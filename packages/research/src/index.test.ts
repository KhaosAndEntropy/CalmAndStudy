import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleResearchRequest, type ResearchResponse } from './index';

const fetchMock = vi.fn<typeof fetch>();

function request(path: string, options: { method?: string; origin?: string } = {}) {
  const headers = new Headers();
  if (options.origin) headers.set('Origin', options.origin);
  return new Request(`https://calmandstudy.pages.dev${path}`, {
    method: options.method ?? 'GET',
    headers,
  });
}

async function payload<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe('API de pesquisa', () => {
  it('recusa métodos diferentes de GET sem consultar fontes externas', async () => {
    const response = await handleResearchRequest(
      request('/api/research?q=astronomia', { method: 'POST' }),
    );

    expect(response.status).toBe(405);
    expect(await payload<{ error: string }>(response)).toMatchObject({
      error: expect.stringContaining('GET'),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('exige pelo menos três caracteres na busca', async () => {
    const response = await handleResearchRequest(request('/api/research?q=ab'));

    expect(response.status).toBe(400);
    expect(await payload<{ error: string }>(response)).toMatchObject({
      error: expect.stringContaining('3 caracteres'),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('aplica cabeçalhos de segurança e CORS somente à própria origem', async () => {
    const allowed = await handleResearchRequest(
      request('/api/research?q=ab', { origin: 'https://calmandstudy.pages.dev' }),
    );
    const rejected = await handleResearchRequest(
      request('/api/research?q=ab', { origin: 'https://site-externo.example' }),
    );

    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://calmandstudy.pages.dev',
    );
    expect(allowed.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(allowed.headers.get('Content-Security-Policy')).toContain("default-src 'none'");
    expect(allowed.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    expect(rejected.headers.has('Access-Control-Allow-Origin')).toBe(false);
  });

  it('faz fallback da chave OpenAlex recusada para a cota pública sem chave', async () => {
    const openAlexRequests: Array<{ url: string; authenticated: boolean }> = [];
    fetchMock.mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      const authenticated = new Headers(init?.headers).has('Authorization');
      if (url.hostname === 'api.openalex.org')
        openAlexRequests.push({ url: url.href, authenticated });
      if (url.hostname === 'api.openalex.org' && authenticated)
        return new Response(null, { status: 403 });
      if (url.hostname === 'api.openalex.org') return Response.json({ results: [] });
      if (url.hostname === 'api.crossref.org') return Response.json({ message: { items: [] } });
      throw new Error(`Provedor inesperado: ${url.hostname}`);
    });

    const response = await handleResearchRequest(
      request('/api/research?q=busca-openalex-fallback'),
      { openAlexApiKey: 'chave-de-teste' },
    );
    const body = await payload<ResearchResponse>(response);
    const openAlex = body.providers.find(provider => provider.provider === 'OpenAlex');
    expect(response.status).toBe(200);
    expect(openAlex?.status).toBe('ok');
    expect(openAlexRequests).toHaveLength(2);
    expect(openAlexRequests.some(value => value.authenticated)).toBe(true);
    expect(openAlexRequests.some(value => !value.authenticated)).toBe(true);
    expect(openAlexRequests.every(value => !value.url.includes('api_key'))).toBe(true);
  });

  it('descreve falhas de autenticação e limite do OpenAlex sem expor a chave', async () => {
    fetchMock.mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.hostname === 'api.openalex.org')
        return new Response(null, {
          status: new Headers(init?.headers).has('Authorization') ? 403 : 429,
        });
      if (url.hostname === 'api.crossref.org') return Response.json({ message: { items: [] } });
      throw new Error(`Provedor inesperado: ${url.hostname}`);
    });

    const response = await handleResearchRequest(
      request('/api/research?q=diagnostico-openalex-auth'),
      { openAlexApiKey: 'segredo-de-teste-nao-publicar' },
    );
    const body = await payload<ResearchResponse>(response);
    const openAlex = body.providers.find(provider => provider.provider === 'OpenAlex');

    expect(openAlex?.status).toBe('unavailable');
    expect(openAlex?.reason).toMatch(/atingiu temporariamente o limite/i);
    expect(JSON.stringify(body)).not.toContain('segredo-de-teste-nao-publicar');
  });

  it('exibe artigo OpenAlex com DOI cruzado e PDF aberto mesmo sem licença de reutilização informada', async () => {
    const doi = '10.5555/calmandstudy.strict.openalex';
    const pdfUrl = 'https://api.openalex.org/files/strict-test.pdf';
    const acceptedWork = {
      id: 'https://openalex.org/W123',
      doi: `https://doi.org/${doi}`,
      title: 'Artigo aberto confirmado pelos testes',
      publication_year: 2026,
      authorships: [{ author: { display_name: 'Autora de teste' } }],
      best_oa_location: {
        is_oa: true,
        pdf_url: 'https://api.openalex.org/files/submitted-test.pdf',
        license: 'cc-by',
        version: 'submittedVersion',
        source: { type: 'repository', display_name: 'Repositório de teste' },
      },
      locations: [
        {
          is_oa: true,
          pdf_url: pdfUrl,
          landing_page_url: 'https://api.openalex.org/landing/strict-test',
          license: null,
          version: 'publishedVersion',
          source: { type: 'journal', display_name: 'Revista de teste' },
        },
      ],
      type: 'article',
      is_retracted: false,
      cited_by_count: 4,
    };
    const closedWork = {
      ...acceptedWork,
      id: 'https://openalex.org/W456',
      doi: 'https://doi.org/10.5555/calmandstudy.closed',
      title: 'Artigo sem licença aberta identificada',
      best_oa_location: { ...acceptedWork.best_oa_location, license: null },
    };
    fetchMock.mockImplementation(async input => {
      const url = new URL(String(input));
      if (url.href === pdfUrl)
        return new Response(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]), {
          status: 206,
          headers: { 'Content-Type': 'application/pdf' },
        });
      if (url.hostname === 'api.openalex.org')
        return Response.json({ results: [acceptedWork, closedWork] });
      if (url.hostname === 'api.crossref.org' && url.pathname.endsWith(encodeURIComponent(doi)))
        return Response.json({ message: { DOI: doi } });
      if (url.hostname === 'api.crossref.org')
        return Response.json({
          message: {
            items: [
              {
                DOI: doi,
                title: ['Artigo aberto confirmado pelos testes'],
                type: 'journal-article',
                link: [
                  { URL: pdfUrl, 'content-type': 'application/pdf', 'content-version': 'vor' },
                ],
              },
            ],
          },
        });
      throw new Error(`Provedor inesperado: ${url.href}`);
    });

    const response = await handleResearchRequest(
      request('/api/research?q=verificacao-estrita-openalex'),
    );
    const body = await payload<ResearchResponse>(response);
    const openAlex = body.providers.find(provider => provider.provider === 'OpenAlex');

    expect(response.status).toBe(200);
    expect(body.results.map(result => result.title)).toEqual([
      'Artigo aberto confirmado pelos testes',
    ]);
    expect(body.results[0].verification.corroboratedBy).toContain('Crossref');
    expect(body.results[0].publicationChannel).toBe('journal');
    expect(body.results[0].publicationVersion).toBe('published');
    expect(body.results[0].license).toBeUndefined();
    expect(body.results[0].note).toMatch(/não informou licença de reutilização/i);
    expect(openAlex?.status).toBe('ok');
    expect(fetchMock.mock.calls.some(([input]) => String(input).includes('W456'))).toBe(false);
  });

  it('busca além dos primeiros seis registros OpenAlex antes de aplicar o filtro estrito', async () => {
    const doi = '10.5555/calmandstudy.after-six';
    const pdfUrl = 'https://api.openalex.org/files/after-six.pdf';
    const ineligibleWorks = Array.from({ length: 6 }, (_, index) => ({
      id: `https://openalex.org/W${index + 1}`,
      doi: `https://doi.org/10.5555/calmandstudy.closed-${index + 1}`,
      title: `Registro sem licença aberta ${index + 1}`,
      type: 'article',
      is_retracted: false,
      locations: [
        {
          is_oa: true,
          pdf_url: `https://api.openalex.org/files/closed-${index + 1}.pdf`,
          license: null,
          version: 'publishedVersion',
          source: { type: 'journal', display_name: 'Periódico' },
        },
      ],
    }));
    const eligibleWork = {
      id: 'https://openalex.org/W7',
      doi: `https://doi.org/${doi}`,
      title: 'Alan Turing e a computação teórica',
      type: 'article',
      is_retracted: false,
      locations: [
        {
          is_oa: true,
          pdf_url: pdfUrl,
          landing_page_url: 'https://journal.example/alan-turing',
          license: 'cc-by',
          version: 'publishedVersion',
          source: { type: 'journal', display_name: 'Revista de Computação' },
        },
      ],
    };
    fetchMock.mockImplementation(async input => {
      const url = new URL(String(input));
      if (url.href === pdfUrl)
        return new Response(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]), {
          status: 206,
          headers: { 'Content-Type': 'application/pdf' },
        });
      if (url.hostname === 'api.openalex.org')
        return Response.json({ results: [...ineligibleWorks, eligibleWork] });
      if (url.hostname === 'api.crossref.org' && url.pathname.endsWith(encodeURIComponent(doi)))
        return Response.json({ message: { DOI: doi, type: 'journal-article' } });
      if (url.hostname === 'api.crossref.org') return Response.json({ message: { items: [] } });
      throw new Error(`Provedor inesperado: ${url.href}`);
    });

    const response = await handleResearchRequest(request('/api/research?q=alan-turing-after-six'));
    const body = await payload<ResearchResponse>(response);
    const openAlexRequest = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .find(url => url.hostname === 'api.openalex.org');

    expect(openAlexRequest?.searchParams.get('per_page')).toBe('40');
    expect(body.results.map(result => result.title)).toContain(
      'Alan Turing e a computação teórica',
    );
  });

  it('aceita cópia aceita em repositório quando DOI confirma artigo de periódico e o PDF passa', async () => {
    const doi = '10.5555/calmandstudy.repository.accepted';
    const pdfUrl = 'https://api.openalex.org/files/accepted-test.pdf';
    fetchMock.mockImplementation(async input => {
      const url = new URL(String(input));
      if (url.href === pdfUrl)
        return new Response(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]), {
          status: 206,
          headers: { 'Content-Type': 'application/pdf' },
        });
      if (url.hostname === 'api.openalex.org')
        return Response.json({
          results: [
            {
              id: 'https://openalex.org/W789',
              doi: `https://doi.org/${doi}`,
              title: 'Versão aceita disponível em repositório',
              publication_year: 2024,
              authorships: [],
              type: 'article',
              is_retracted: false,
              locations: [
                {
                  is_oa: true,
                  pdf_url: pdfUrl,
                  landing_page_url: 'https://api.openalex.org/landing/repository-test',
                  license: 'cc-by',
                  version: 'acceptedVersion',
                  source: { type: 'repository', display_name: 'Repositório institucional' },
                },
              ],
            },
          ],
        });
      if (url.hostname === 'api.crossref.org')
        return Response.json({
          message: {
            items: [
              {
                DOI: doi,
                title: ['Versão aceita disponível em repositório'],
                type: 'journal-article',
                license: [],
                link: [],
              },
            ],
          },
        });
      throw new Error(`Provedor inesperado: ${url.href}`);
    });

    const response = await handleResearchRequest(
      request('/api/research?q=artigo-com-versao-aceita'),
    );
    const body = await payload<ResearchResponse>(response);

    expect(body.results).toHaveLength(1);
    expect(body.results[0]).toMatchObject({
      publicationChannel: 'repository',
      publicationVersion: 'accepted',
      url: 'https://api.openalex.org/landing/repository-test',
    });
    expect(body.results[0].note).toContain('versão publicada ou aceita');
  });
});

describe('verificação de links', () => {
  it.each([
    ['HTTP sem TLS', 'http://nasa.gov/publication'],
    ['domínio fora da lista confiável', 'https://not-a-source.example/publication'],
    ['porta não padrão', 'https://nasa.gov:8443/publication'],
    ['endereço local', 'https://127.0.0.1/private'],
  ])('não consulta %s', async (_description, target) => {
    const params = new URLSearchParams({ url: target });
    const response = await handleResearchRequest(request(`/api/links/check?${params}`));
    const body = await payload<{ links: { status: string }[] }>(response);

    expect(response.status).toBe(200);
    expect(body.links[0].status).toBe('unverified');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('marca uma fonte permitida que retorna 404 como quebrada', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    const target = 'https://nasa.gov/unit-test-missing-page';
    const response = await handleResearchRequest(
      request(`/api/links/check?${new URLSearchParams({ url: target })}`),
    );
    const body = await payload<{ links: { url: string; status: string; httpStatus: number }[] }>(
      response,
    );

    expect(body.links).toEqual([{ url: target, status: 'broken', httpStatus: 404 }]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({ hostname: 'nasa.gov' }),
      expect.objectContaining({ method: 'HEAD', redirect: 'manual' }),
    );
  });

  it('tenta GET quando a fonte não aceita HEAD', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 405 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const target = 'https://nasa.gov/unit-test-head-fallback';
    const response = await handleResearchRequest(
      request(`/api/links/check?${new URLSearchParams({ url: target })}`),
    );
    const body = await payload<{ links: { status: string; httpStatus: number }[] }>(response);

    expect(body.links[0]).toMatchObject({ status: 'ok', httpStatus: 200 });
    expect(fetchMock.mock.calls.map(([, init]) => init?.method)).toEqual(['HEAD', 'GET']);
  });

  it('não segue redirecionamento para um domínio fora da lista permitida', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { Location: 'https://attacker.example/collect' },
      }),
    );
    const target = 'https://nasa.gov/unit-test-redirect';
    const response = await handleResearchRequest(
      request(`/api/links/check?${new URLSearchParams({ url: target })}`),
    );
    const body = await payload<{ links: { status: string }[] }>(response);

    expect(body.links[0].status).toBe('unverified');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
