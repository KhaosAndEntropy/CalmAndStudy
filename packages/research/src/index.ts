export type ResearchProvider =
  'OpenAlex' | 'OpenAIRE' | 'Crossref' | 'Europe PMC' | 'NASA STI' | 'USGS Publications Warehouse';
export type ResearchAccess = 'open-access' | 'metadata-only' | 'unknown';

export interface ResearchResult {
  id: string;
  provider: ResearchProvider;
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  publicationType?: string;
  publicationVersion?: 'published' | 'accepted';
  publicationChannel?: 'journal' | 'repository';
  doi?: string;
  url: string;
  abstract?: string;
  access: ResearchAccess;
  license?: string;
  citations?: number;
  verification: {
    level: 'metadata-and-access';
    checkedAt: string;
    httpStatus: number;
    mediaType: string;
    corroboratedBy: string[];
    checks: string[];
  };
  note: string;
}

export interface ProviderStatus {
  provider: ResearchProvider;
  status: 'ok' | 'unavailable' | 'not-applicable';
  count: number;
  reason?: string;
}
export interface ResearchResponse {
  query: string;
  field: string;
  generatedAt: string;
  results: ResearchResult[];
  providers: ProviderStatus[];
  notice: string;
}

export interface LinkCheckResult {
  url: string;
  status: 'ok' | 'broken' | 'unverified';
  httpStatus?: number;
}
type ResearchCandidate = Omit<ResearchResult, 'verification'> & {
  verificationUrl?: string;
  verificationKind?: 'pdf' | 'xml';
  isRetracted?: boolean;
};

const API_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Sala de Calma e Estudo/0.1 (public-source research)',
};
const MAX_RESULTS_PER_PROVIDER = 6;
const OPENALEX_RESULTS_PER_PAGE = 40;
const OPENAIRE_RESULTS_PER_PAGE = 20;
const TIMEOUT_MS = 8000;
const FULL_TEXT_TIMEOUT_MS = 4500;
const MAX_PROVIDER_RESPONSE_BYTES = 2_000_000;
const CACHE_TTL_MS = 15 * 60 * 1000;
const searchCache = new Map<string, { expiresAt: number; value: ResearchResponse }>();
const linkCache = new Map<string, { expiresAt: number; value: LinkCheckResult }>();
const requestLimits = new Map<string, { startedAt: number; count: number }>();
const REQUEST_WINDOW_MS = 60_000;
const REQUEST_LIMIT_PER_WINDOW = 30;
const MAX_RATE_LIMIT_BUCKETS = 5_000;
const MAX_CANDIDATES_TO_VERIFY = 12;
const biomedicalFields =
  /biolog|medicin|saúde|saude|genética|genetica|neuro|microbi|farmac|imun|epidemi|bioqu|botânica|botanica|zoolog|anatom|fisiolog|paleont/i;
const trustedSourceHosts = [
  'namuseum.gr',
  'nature.com',
  'ucl.ac.uk',
  'smithsonianmag.com',
  'unesco.org',
  'metmuseum.org',
  'bl.uk',
  'nasa.gov',
  'si.edu',
  'uchicago.edu',
  'usgs.gov',
  'genome.gov',
  'cern',
  'nist.gov',
  'rfc-editor.org',
  'openstax.org',
  'doi.org',
  'crossref.org',
  'openalex.org',
  'figshare.com',
  'zenodo.org',
  'osf.io',
  'europepmc.org',
  'ebi.ac.uk',
  'wikimedia.org',
  'noaa.gov',
  'cdc.gov',
  'who.int',
  'math.hmc.edu',
  'bls.gov',
  'fao.org',
  'ausstellungen.deutsche-digitale-bibliothek.de',
  'dh.uni-leipzig.de',
  'plato.stanford.edu',
  'energy.gov',
  'nsidc.org',
  'nrcs.usda.gov',
  'fda.gov',
  'ocw.mit.edu',
  'archaeologydataservice.ac.uk',
  'cbd.int',
  'nationalgeographic.org',
];

class SourceHttpError extends Error {
  constructor(readonly status: number) {
    super(`Source returned HTTP ${status}`);
    this.name = 'SourceHttpError';
  }
}

function providerFailureReason(provider: ResearchProvider, error: unknown): string {
  if (provider === 'OpenAlex' && error instanceof SourceHttpError) {
    if (error.status === 401 || error.status === 403)
      return 'A base OpenAlex recusou a consulta. A busca pública também foi tentada; experimente novamente mais tarde.';
    if (error.status === 429)
      return 'A base OpenAlex atingiu temporariamente o limite de consultas. Aguarde um pouco e tente novamente.';
    return 'A base OpenAlex não concluiu a consulta. Tente novamente em instantes.';
  }
  return provider === 'OpenAlex'
    ? 'OpenAlex não respondeu dentro do tempo esperado ou enviou uma resposta que não pôde ser lida.'
    : 'O catálogo não respondeu nesta tentativa.';
}

function trimText(value: unknown, maxLength = 440): string | undefined {
  if (typeof value !== 'string') return undefined;
  const text = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

function abstractFromIndex(index?: Record<string, number[]> | null): string | undefined {
  if (!index) return undefined;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index))
    for (const position of positions) words[position] = word;
  return trimText(words.filter(Boolean).join(' '));
}

function parseYear(value: unknown): number | undefined {
  const year = Number(typeof value === 'string' ? value.match(/^\d{4}/)?.[0] : value);
  return Number.isFinite(year) && year >= 1000 && year <= 3000 ? year : undefined;
}

function normalizeOpenLicense(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  let normalized = value
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\/creativecommons\.org\/licenses\//, '')
    .replace(/\/(?:legalcode|deed\.en)?\/?$/, '')
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
  if (
    /^(?:cc-?)?0(?:-1\.0)?$/.test(normalized) ||
    /^public-?domain(?:-mark)?(?:-1\.0)?$/.test(normalized)
  )
    return normalized.toUpperCase();
  if (/^by(?:-.*)?$/.test(normalized)) normalized = `cc-${normalized}`;
  if (/^cc-?by(?:-(?:sa|nc|nd))*(?:-[1-4](?:\.0)?)?$/.test(normalized))
    return normalized.toUpperCase().replace(/^CCBY/, 'CC-BY');
  return undefined;
}

function normalizeDoi(value: unknown): string | undefined {
  return typeof value === 'string'
    ? value
        .trim()
        .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
        .toLowerCase() || undefined
    : undefined;
}

async function getJson<T>(url: URL, headers: HeadersInit = {}): Promise<T> {
  const allowedHosts = new Set([
    'api.openalex.org',
    'api.openaire.eu',
    'api.crossref.org',
    'www.ebi.ac.uk',
    'ntrs.nasa.gov',
    'pubs.usgs.gov',
  ]);
  let target = url;
  let response: Response | undefined;
  for (let redirects = 0; redirects <= 3; redirects++) {
    response = await fetch(target, {
      headers: { ...API_HEADERS, ...Object.fromEntries(new Headers(headers).entries()) },
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const location = response.headers.get('Location');
    if (response.status < 300 || response.status >= 400 || !location) break;
    const next = new URL(location, target);
    if (
      redirects === 3 ||
      next.protocol !== 'https:' ||
      !allowedHosts.has(next.hostname) ||
      next.username ||
      next.password
    ) {
      await response.body?.cancel();
      throw new Error('Source redirected outside the approved hosts.');
    }
    await response.body?.cancel();
    target = next;
  }
  if (!response?.ok || !response.body) {
    await response?.body?.cancel();
    throw new SourceHttpError(response?.status ?? 0);
  }
  const declaredLength = Number(response.headers.get('Content-Length') ?? 0);
  if (declaredLength > MAX_PROVIDER_RESPONSE_BYTES) {
    await response.body.cancel();
    throw new Error('Source response exceeded the size limit.');
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_PROVIDER_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error('Source response exceeded the size limit.');
      }
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

async function searchOpenAlex(query: string, apiKey?: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://api.openalex.org/works');
  url.searchParams.set('search', query);
  // Strict eligibility checks discard many records, so fetch a wider relevance
  // window before filtering instead of stopping after the first six matches.
  url.searchParams.set('per_page', String(OPENALEX_RESULTS_PER_PAGE));
  url.searchParams.set('sort', 'relevance_score:desc');
  url.searchParams.set('filter', 'is_oa:true,is_retracted:false,type:article');
  url.searchParams.set(
    'select',
    'id,doi,title,publication_year,authorships,primary_location,locations,best_oa_location,open_access,abstract_inverted_index,cited_by_count,type,is_retracted',
  );
  let data: { results?: Array<Record<string, any>> };
  const authHeaders: HeadersInit = apiKey?.trim()
    ? { Authorization: `Bearer ${apiKey.trim()}` }
    : {};
  try {
    data = await getJson<{ results?: Array<Record<string, any>> }>(url, authHeaders);
  } catch (error) {
    // A key issue or exhausted keyed quota must not block the free public tier.
    if (
      !apiKey?.trim() ||
      !(error instanceof SourceHttpError) ||
      !([401, 403, 429].includes(error.status) || error.status >= 500)
    )
      throw error;
    data = await getJson<{ results?: Array<Record<string, any>> }>(url);
  }
  return (data.results ?? [])
    .filter(work => typeof work.title === 'string')
    .flatMap(work => {
      const locations = Array.isArray(work.locations) ? work.locations : [];
      if (work.best_oa_location && !locations.includes(work.best_oa_location))
        locations.unshift(work.best_oa_location);
      const eligibleLocations = locations.flatMap((location: any) => {
        const license = normalizeOpenLicense(location?.license);
        const version = String(location?.version ?? '').toLowerCase();
        const sourceType = location?.source?.type;
        if (
          !location?.is_oa ||
          !location?.pdf_url ||
          !license ||
          !['publishedversion', 'acceptedversion'].includes(version) ||
          !['journal', 'repository'].includes(sourceType)
        )
          return [];
        return [{ location, license, version, sourceType }];
      });
      eligibleLocations.sort((a: any, b: any) => {
        const score = (candidate: any) =>
          (candidate.sourceType === 'journal' ? 4 : 0) +
          (candidate.version === 'publishedversion' ? 2 : 0);
        return score(b) - score(a);
      });
      const selected = eligibleLocations[0];
      if (work.is_retracted || work.type !== 'article' || !work.doi || !selected) return [];
      const { location, license, version, sourceType } = selected;
      const primaryVenue = work.primary_location?.source?.display_name;
      return {
        id: `openalex:${work.id}`,
        provider: 'OpenAlex',
        title: work.title,
        authors: (work.authorships ?? [])
          .slice(0, 5)
          .map((row: any) => row.author?.display_name)
          .filter(Boolean),
        year: parseYear(work.publication_year),
        venue: primaryVenue ?? location.source?.display_name,
        publicationType: work.type,
        publicationVersion: version === 'publishedversion' ? 'published' : 'accepted',
        publicationChannel: sourceType,
        doi: normalizeDoi(work.doi),
        url: location.landing_page_url ?? location.pdf_url,
        verificationUrl: location.pdf_url,
        verificationKind: 'pdf',
        abstract: abstractFromIndex(work.abstract_inverted_index),
        access: 'open-access' as const,
        license,
        citations: Number.isFinite(work.cited_by_count) ? work.cited_by_count : undefined,
        note:
          sourceType === 'repository'
            ? 'Cópia de versão publicada ou aceita depositada em repositório. O DOI foi cruzado com o Crossref, a licença aberta foi identificada e o PDF integral foi conferido. A cópia não substitui a leitura do registro editorial.'
            : 'Versão publicada ou aceita em periódico, com licença aberta identificada; o PDF foi conferido pelo backend e o DOI foi cruzado com o registro Crossref.',
      };
    });
}

async function crossrefConfirmsDoi(doi: string): Promise<boolean> {
  const url = new URL(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  try {
    const data = await getJson<{ message?: Record<string, any> }>(url);
    const work = data.message;
    return Boolean(
      work &&
      normalizeDoi(work.DOI) === normalizeDoi(doi) &&
      work.type === 'journal-article' &&
      !(
        Array.isArray(work['update-to']) &&
        work['update-to'].some((update: any) =>
          /retract|withdraw/i.test(update.type ?? update.label ?? ''),
        )
      ),
    );
  } catch {
    return false;
  }
}

async function searchCrossref(query: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://api.crossref.org/works');
  url.searchParams.set('query.bibliographic', query);
  url.searchParams.set('rows', String(MAX_RESULTS_PER_PROVIDER));
  url.searchParams.set(
    'select',
    'DOI,title,author,published-print,published-online,publisher,container-title,URL,license,link,abstract,type,is-referenced-by-count,update-to',
  );
  const data = await getJson<{ message?: { items?: Array<Record<string, any>> } }>(url);
  return (data.message?.items ?? [])
    .filter(work => typeof work.title?.[0] === 'string')
    .map(work => {
      const doi = normalizeDoi(work.DOI);
      const licenseItem = (work.license ?? []).find((item: any) =>
        /^(vor|am)$/i.test(item?.['content-version'] ?? ''),
      );
      const license = normalizeOpenLicense(licenseItem?.URL);
      const fullText = (work.link ?? []).find(
        (link: any) =>
          /application\/pdf/i.test(link?.['content-type'] ?? '') &&
          /^(vor|am)$/i.test(link?.['content-version'] ?? '') &&
          typeof link?.URL === 'string',
      );
      const dateParts =
        work['published-print']?.['date-parts']?.[0] ??
        work['published-online']?.['date-parts']?.[0];
      return {
        id: `crossref:${doi ?? work.URL ?? work.title[0]}`,
        provider: 'Crossref',
        title: work.title[0],
        authors: (work.author ?? [])
          .slice(0, 5)
          .map((author: any) => [author.given, author.family].filter(Boolean).join(' '))
          .filter(Boolean),
        year: parseYear(dateParts?.[0]),
        venue: work['container-title']?.[0],
        publicationType: work.type,
        doi,
        url:
          fullText?.URL ??
          (doi ? `https://doi.org/${doi}` : (work.URL ?? 'https://search.crossref.org/')),
        ...(license && fullText
          ? { verificationUrl: fullText.URL, verificationKind: 'pdf' as const }
          : {}),
        abstract: trimText(work.abstract),
        access: license && fullText ? 'open-access' : 'unknown',
        license,
        isRetracted:
          Array.isArray(work['update-to']) &&
          work['update-to'].some((update: any) =>
            /retract|withdraw/i.test(update.type ?? update.label ?? ''),
          ),
        citations: Number.isFinite(work['is-referenced-by-count'])
          ? work['is-referenced-by-count']
          : undefined,
        note:
          license && fullText
            ? 'O Crossref registra licença Creative Commons e link de versão aceita/publicada; o PDF integral foi aberto e validado pelo backend. Confira a licença e as condições do documento original.'
            : 'Metadados bibliográficos sem licença Creative Commons e arquivo integral confirmados; este registro não será exibido como fonte verificada.',
      };
    });
}

async function searchEuropePmc(query: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search');
  const safeQuery = query
    .replace(/[():"]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  url.searchParams.set('query', `(${safeQuery}) AND OPEN_ACCESS:Y`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('resultType', 'core');
  url.searchParams.set('pageSize', String(MAX_RESULTS_PER_PROVIDER));
  url.searchParams.set('sort', 'RELEVANCE');
  const data = await getJson<{ resultList?: { result?: Array<Record<string, any>> } }>(url);
  return (data.resultList?.result ?? [])
    .filter(work => typeof work.title === 'string')
    .flatMap(work => {
      const doi = normalizeDoi(work.doi);
      const license = normalizeOpenLicense(work.license);
      const publicationTypes = Array.isArray(work.pubTypeList?.pubType)
        ? work.pubTypeList.pubType.join(' ')
        : String(work.pubTypeList?.pubType ?? '');
      if (
        !work.pmcid ||
        !doi ||
        !license ||
        !/journal article/i.test(publicationTypes) ||
        /preprint/i.test(publicationTypes) ||
        work.isRetracted === 'Y' ||
        work.isRetracted === true
      )
        return [];
      const url = `https://europepmc.org/articles/${work.pmcid}`;
      return {
        id: `europepmc:${work.source}:${work.id}`,
        provider: 'Europe PMC',
        title: work.title,
        authors:
          typeof work.authorString === 'string' ? work.authorString.split(', ').slice(0, 5) : [],
        year: parseYear(work.firstPublicationDate?.slice(0, 4) ?? work.pubYear),
        venue: work.journalTitle,
        publicationType: publicationTypes,
        doi,
        url,
        abstract: trimText(work.abstractText),
        access: 'open-access',
        license,
        verificationUrl: `https://www.ebi.ac.uk/europepmc/webservices/rest/${work.pmcid}/fullTextXML`,
        verificationKind: 'xml' as const,
        citations: Number.isFinite(work.citedByCount) ? work.citedByCount : undefined,
        note: 'Texto completo open access de Europe PMC; o DOI foi cruzado com Crossref e o XML integral conferido pelo backend. Isso confirma metadados e acesso, não a verdade de cada afirmação.',
      };
    });
}

async function searchOpenAire(query: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://api.openaire.eu/graph/v4/research-products');
  url.searchParams.set('search', query);
  url.searchParams.set(
    'filter',
    'type:publication,is_peer_reviewed:true,best_oa.rights:Open Access,has_license:true,has_doi:true',
  );
  url.searchParams.set('page_size', String(OPENAIRE_RESULTS_PER_PAGE));
  url.searchParams.set(
    'select',
    'mainTitle,authors,publicationDate,container,instances,pids,isPeerReviewed,impact',
  );
  const data = await getJson<{ results?: Array<Record<string, any>> }>(url);
  return (data.results ?? []).flatMap(work => {
    if (typeof work.mainTitle !== 'string' || work.isPeerReviewed !== true) return [];
    const doi = normalizeDoi(
      (work.pids ?? []).find((pid: any) => String(pid?.scheme).toLowerCase() === 'doi')?.value,
    );
    if (!doi) return [];

    const openInstance = (work.instances ?? []).find((instance: any) => {
      const access = String(instance?.accessRight?.label ?? '').toLowerCase();
      const type = String(instance?.type ?? '').toLowerCase();
      const refereed = String(instance?.refereed ?? '').toUpperCase();
      return (
        (access === 'open' || access === 'open access') &&
        type === 'article' &&
        refereed !== 'FALSE' &&
        Boolean(normalizeOpenLicense(instance?.license))
      );
    });
    if (!openInstance) return [];

    const ids = [
      ...(Array.isArray(work.pids) ? work.pids : []),
      ...(Array.isArray(openInstance.pids) ? openInstance.pids : []),
    ];
    const pmcid = ids
      .map((pid: any) => String(pid?.value ?? ''))
      .concat((openInstance.urls ?? []).map((entry: any) => String(entry?.url ?? entry ?? '')))
      .map(value => value.match(/PMC\d+/i)?.[0]?.toUpperCase())
      .find(Boolean);
    // Only retrieve full text through the known Europe PMC API endpoint; never
    // fetch arbitrary repository URLs supplied by an aggregated index.
    if (!pmcid) return [];

    const license = normalizeOpenLicense(openInstance.license);
    if (!license) return [];
    const authors = Array.isArray(work.authors)
      ? work.authors
          .slice(0, 5)
          .map((author: any) => String(author?.fullName ?? '').trim())
          .filter(Boolean)
      : [];
    const venue = String(work.container?.name ?? '').trim() || undefined;
    return [
      {
        id: `openaire:${doi}`,
        provider: 'OpenAIRE',
        title: work.mainTitle,
        authors,
        year: parseYear(work.publicationDate),
        venue,
        publicationType: 'journal-article',
        publicationChannel: 'journal',
        publicationVersion: 'published',
        doi,
        url: `https://europepmc.org/articles/${pmcid}`,
        access: 'open-access',
        license,
        citations: Number.isFinite(work.impact?.citationCount)
          ? work.impact.citationCount
          : undefined,
        verificationUrl: `https://www.ebi.ac.uk/europepmc/webservices/rest/${pmcid}/fullTextXML`,
        verificationKind: 'xml',
        note: 'Encontrado pelo índice OpenAIRE, que agrega registros de diferentes catálogos. A indicação de revisão por pares, o DOI no Crossref, a licença declarada e o XML integral foram conferidos; OpenAIRE não é contado como confirmação independente nem como prova de veracidade.',
      },
    ];
  });
}

function ntrsFileUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value, 'https://ntrs.nasa.gov');
    return url.protocol === 'https:' && url.hostname === 'ntrs.nasa.gov'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function ntrsLicense(record: any): string | undefined {
  const rights = record.copyright ?? {};
  const type = String(rights.licenseType ?? '').toUpperCase();
  const ccLicenses: Record<string, string> = {
    CCBY: 'CC-BY',
    CCBYSA: 'CC-BY-SA',
    CCBYND: 'CC-BY-ND',
    CCBYNC: 'CC-BY-NC',
    CCBYNCSA: 'CC-BY-NC-SA',
    CCBYNCND: 'CC-BY-NC-ND',
  };
  if (ccLicenses[type]) return ccLicenses[type];
  if (
    type === 'OPEN_ACCESS' &&
    ['GOV_PUBLIC_USE_PERMITTED', 'PUBLIC_USE_PERMITTED'].includes(rights.determinationType)
  )
    return 'NASA STI · acesso público e permissão de uso registrados';
  if (['GOV_PUBLIC_USE_PERMITTED', 'PUBLIC_USE_PERMITTED'].includes(rights.determinationType))
    return 'NASA STI · permissão de uso público registrada';
  return undefined;
}

async function searchNasaSti(query: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://ntrs.nasa.gov/api/citations/search');
  url.searchParams.set('q', query);
  url.searchParams.set('page.size', String(MAX_RESULTS_PER_PROVIDER));
  url.searchParams.set('disseminated', 'DOCUMENT_AND_METADATA');
  url.searchParams.set('distribution', 'PUBLIC');
  const data = await getJson<{ results?: Array<Record<string, any>> }>(url);
  return (data.results ?? []).flatMap(record => {
    const rights = record.copyright ?? {};
    const license = ntrsLicense(record);
    const pdfUrl = ntrsFileUrl(record.downloads?.links?.pdf);
    const id = String(record.id ?? record.ntrsNumber ?? '');
    const title = trimText(record.title, 280);
    const publicRights =
      ['GOV_PUBLIC_USE_PERMITTED', 'PUBLIC_USE_PERMITTED'].includes(rights.determinationType) ||
      Boolean(license?.startsWith('CC-'));
    const thirdPartyClear =
      rights.containsThirdPartyMaterial !== true || rights.thirdPartyPermissionsProduced === true;
    if (
      !id ||
      !title ||
      !pdfUrl ||
      !license ||
      !publicRights ||
      !thirdPartyClear ||
      record.distribution !== 'PUBLIC' ||
      record.disseminated !== 'DOCUMENT_AND_METADATA' ||
      record.downloads?.draft === true
    )
      return [];
    const publisher = 'NASA Scientific and Technical Information Program';
    const authorList = Array.isArray(record.authors)
      ? record.authors
      : Array.isArray(record.author)
        ? record.author
        : [];
    return [
      {
        id: `nasa-sti:${id}`,
        provider: 'NASA STI' as const,
        title,
        authors: authorList
          .map((author: any) =>
            typeof author === 'string'
              ? author
              : [author.firstName, author.middleName, author.lastName].filter(Boolean).join(' '),
          )
          .filter(Boolean)
          .slice(0, 5),
        year: parseYear(record.publicationDate?.slice?.(0, 4) ?? record.published?.slice?.(0, 4)),
        venue: publisher,
        publicationType:
          record.stiType ?? record.publication?.text ?? 'Documento técnico institucional',
        doi: normalizeDoi(record.doi),
        url: `https://ntrs.nasa.gov/citations/${encodeURIComponent(id)}`,
        verificationUrl: pdfUrl,
        verificationKind: 'pdf' as const,
        abstract: trimText(record.abstract),
        access: 'open-access' as const,
        license,
        note: 'O registro NASA STI declara distribuição pública, documento integral e permissão/licença de uso; o PDF foi aberto e identificado. É uma publicação técnica institucional, não necessariamente um artigo revisado por pares. A checagem de catálogo e acesso não confirma, por si só, todas as afirmações do documento.',
      },
    ];
  });
}

function usgsHasInstitutionalAuthor(record: any): boolean {
  const authors = record.contributors?.authors;
  return (
    Array.isArray(authors) &&
    authors.some(
      (author: any) =>
        author.usgs === true ||
        /\bUSGS\b|U\.S\. Geological Survey/i.test(author.affiliation?.text ?? ''),
    )
  );
}

async function searchUsgs(query: string): Promise<ResearchCandidate[]> {
  const url = new URL('https://pubs.usgs.gov/pubs-services/publication/');
  url.searchParams.set('q', query);
  url.searchParams.set('page_size', String(MAX_RESULTS_PER_PROVIDER));
  url.searchParams.set('page_number', '1');
  const data = await getJson<{ records?: Array<Record<string, any>> }>(url);
  return (data.records ?? []).flatMap(record => {
    const authors = record.contributors?.authors;
    const title = trimText(
      record.title ?? record.titleText ?? record.text?.split(/\s+-\s+\d{4}\s+-\s+/).pop(),
      280,
    );
    const pdf = (record.links ?? []).find(
      (link: any) =>
        /pdf/i.test(link.linkFileType?.text ?? link.url ?? '') ||
        /document/i.test(link.type?.text ?? ''),
    );
    const pdfUrl = pdf?.url;
    const id = String(record.indexId ?? record.id ?? '');
    if (
      !id ||
      !title ||
      typeof pdfUrl !== 'string' ||
      !/^https:\/\/pubs\.usgs\.gov\//i.test(pdfUrl) ||
      !usgsHasInstitutionalAuthor(record)
    )
      return [];
    return [
      {
        id: `usgs:${id}`,
        provider: 'USGS Publications Warehouse' as const,
        title,
        authors: Array.isArray(authors)
          ? authors
              .slice(0, 5)
              .map(
                (author: any) =>
                  [author.given, author.family].filter(Boolean).join(' ') || author.text,
              )
              .filter(Boolean)
          : [],
        year: parseYear(record.publicationYear),
        venue: 'U.S. Geological Survey',
        publicationType: record.publicationType?.text ?? 'Publicação científica institucional',
        doi: normalizeDoi(record.doi),
        url: pdfUrl,
        verificationUrl: pdfUrl,
        verificationKind: 'pdf' as const,
        abstract: trimText(record.abstract ?? record.productDescription),
        access: 'open-access' as const,
        license:
          'Domínio público dos EUA · conteúdo produzido por USGS; confira ressalvas do documento',
        note: 'O registro oficial do USGS identifica autoria institucional e fornece o PDF público, que passou pela verificação de acesso e assinatura. A política do USGS considera obras produzidas pela agência domínio público nos EUA, mas documentos podem conter material de terceiros; consulte os avisos do próprio PDF. A origem oficial não equivale a confirmação independente de cada afirmação.',
      },
    ];
  });
}

function isNasaRelevant(field: string): boolean {
  return /astr|astrof|cosmolog|planet|astrobiolog|física|fisica|matem|engenhar|comput|robót|robot|climat|atmosfer|geograf|geolog|paleont|ocean|ecolog/i.test(
    field,
  );
}
function isUsgsRelevant(field: string): boolean {
  return /geolog|geograf|climat|meteor|hidrolog|glaci|vulcan|sismolog|mineral|solo|conserv|ambient|ocean|paleont|cartograf|ecolog|engenhar/i.test(
    field,
  );
}

function isBiomedical(field: string): boolean {
  return biomedicalFields.test(field);
}

interface FullTextCheck {
  ok: boolean;
  status?: number;
  mediaType?: string;
  finalUrl?: string;
  signatureOk?: boolean;
}

async function checkFullText(urlValue: string, kind: 'pdf' | 'xml'): Promise<FullTextCheck> {
  let target: URL;
  try {
    target = new URL(urlValue);
  } catch {
    return { ok: false };
  }
  if (!isAllowedSourceUrl(target)) return { ok: false };
  try {
    let response: Response | undefined;
    for (let redirects = 0; redirects <= 4; redirects++) {
      response = await fetch(target, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(FULL_TEXT_TIMEOUT_MS),
        headers: { ...API_HEADERS, ...(kind === 'pdf' ? { Range: 'bytes=0-7' } : {}) },
      });
      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.get('Location') &&
        redirects < 4
      ) {
        const next = new URL(response.headers.get('Location')!, target);
        if (!isAllowedSourceUrl(next)) {
          await response.body?.cancel();
          return { ok: false, status: response.status };
        }
        await response.body?.cancel();
        target = next;
        continue;
      }
      break;
    }
    if (!response || !response.ok || !response.body) {
      await response?.body?.cancel();
      return { ok: false, status: response?.status };
    }
    const mediaType = (response.headers.get('Content-Type') ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    if (kind === 'pdf' && mediaType !== 'application/pdf') {
      await response.body.cancel();
      return { ok: false, status: response.status, mediaType };
    }
    if (kind === 'xml' && !/(?:application|text)\/(?:xml|[^;]+\+xml)/.test(mediaType)) {
      await response.body.cancel();
      return { ok: false, status: response.status, mediaType };
    }
    const reader = response.body.getReader();
    const { value } = await reader.read();
    await reader.cancel();
    if (!value) return { ok: false, status: response.status, mediaType };
    const prefix = new TextDecoder().decode(value.slice(0, 64)).replace(/^\uFEFF?\s*/, '');
    const signatureOk = kind === 'pdf' ? prefix.startsWith('%PDF-') : prefix.startsWith('<');
    return {
      ok: signatureOk,
      status: response.status,
      mediaType,
      finalUrl: target.toString(),
      signatureOk,
    };
  } catch {
    return { ok: false };
  }
}

async function checkHumanPage(urlValue: string): Promise<{ ok: boolean; status?: number }> {
  let target: URL;
  try {
    target = new URL(urlValue);
  } catch {
    return { ok: false };
  }
  if (!isAllowedSourceUrl(target)) return { ok: false };
  try {
    let response: Response | undefined;
    for (let redirects = 0; redirects <= 4; redirects++) {
      response = await fetch(target, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(FULL_TEXT_TIMEOUT_MS),
        headers: { ...API_HEADERS, Range: 'bytes=0-0' },
      });
      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.get('Location') &&
        redirects < 4
      ) {
        const next = new URL(response.headers.get('Location')!, target);
        if (!isAllowedSourceUrl(next)) {
          await response.body?.cancel();
          return { ok: false, status: response.status };
        }
        await response.body?.cancel();
        target = next;
        continue;
      }
      break;
    }
    const type = response?.headers.get('Content-Type')?.toLowerCase() ?? '';
    await response?.body?.cancel();
    return {
      ok: Boolean(response?.ok && /text\/html|application\/xhtml\+xml/.test(type)),
      status: response?.status,
    };
  } catch {
    return { ok: false };
  }
}

export async function handleResearchRequest(
  request: Request,
  options: { openAlexApiKey?: string } = {},
): Promise<Response> {
  let response: Response;
  try {
    response = await handleResearchRequestBody(request, options);
  } catch {
    response = json({ error: 'Não foi possível processar esta consulta.' }, 500);
  }
  return secureApiResponse(response, request);
}

async function handleResearchRequestBody(
  request: Request,
  options: { openAlexApiKey?: string },
): Promise<Response> {
  if (request.url.length > 12_000)
    return json({ error: 'A solicitação excede o tamanho permitido.' }, 414);
  const url = new URL(request.url);
  if (request.method !== 'GET') return json({ error: 'Use GET para pesquisar fontes.' }, 405);
  if (!isAllowedRequestOrigin(request)) return json({ error: 'Origem não permitida.' }, 403);
  if (isRateLimited(request))
    return json(
      { error: 'Limite temporário de consultas atingido. Tente novamente em um minuto.' },
      429,
      { 'Retry-After': '60' },
    );
  if (url.pathname === '/api/links/check') {
    if ([...url.searchParams.keys()].some(key => key !== 'url'))
      return json({ error: 'Parâmetros inválidos.' }, 400);
    return handleLinkCheck(request);
  }
  if (url.pathname !== '/api/research') return json({ error: 'Endpoint não encontrado.' }, 404);
  if (
    [...url.searchParams.keys()].some(key => key !== 'q' && key !== 'field') ||
    url.searchParams.getAll('q').length !== 1 ||
    url.searchParams.getAll('field').length > 1
  )
    return json({ error: 'Parâmetros inválidos.' }, 400);
  const query = (url.searchParams.get('q') ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  const field = (url.searchParams.get('field') ?? 'Todas').trim();
  if (field.length > 80) return json({ error: 'A área deve ter até 80 caracteres.' }, 400);
  if (query.length < 3)
    return json({ error: 'Digite pelo menos 3 caracteres para pesquisar.' }, 400);
  if (query.length > 160) return json({ error: 'A busca deve ter até 160 caracteres.' }, 400);
  const cacheKey = `${field.toLocaleLowerCase()}|${query.toLocaleLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return json(cached.value);
  if (cached) searchCache.delete(cacheKey);

  const jobs: Array<{
    provider: ResearchProvider;
    applicable: boolean;
    run: () => Promise<ResearchCandidate[]>;
  }> = [
    {
      provider: 'OpenAlex',
      applicable: true,
      run: () => searchOpenAlex(query, options.openAlexApiKey),
    },
    { provider: 'Crossref', applicable: true, run: () => searchCrossref(query) },
    { provider: 'OpenAIRE', applicable: true, run: () => searchOpenAire(query) },
    { provider: 'Europe PMC', applicable: isBiomedical(field), run: () => searchEuropePmc(query) },
    { provider: 'NASA STI', applicable: isNasaRelevant(field), run: () => searchNasaSti(query) },
    {
      provider: 'USGS Publications Warehouse',
      applicable: isUsgsRelevant(field),
      run: () => searchUsgs(query),
    },
  ];
  const settled = await Promise.all(
    jobs.map(async job => {
      if (!job.applicable)
        return {
          job,
          status: { provider: job.provider, status: 'not-applicable' as const, count: 0 },
          results: [] as ResearchCandidate[],
        };
      try {
        const results = await job.run();
        return {
          job,
          status: { provider: job.provider, status: 'ok' as const, count: results.length },
          results,
        };
      } catch (error) {
        return {
          job,
          status: {
            provider: job.provider,
            status: 'unavailable' as const,
            count: 0,
            reason: providerFailureReason(job.provider, error),
          },
          results: [] as ResearchCandidate[],
        };
      }
    }),
  );
  const openAlex = settled.find(result => result.job.provider === 'OpenAlex')?.results ?? [];
  const crossref = settled.find(result => result.job.provider === 'Crossref')?.results ?? [];
  const openAire = settled.find(result => result.job.provider === 'OpenAIRE')?.results ?? [];
  const europePmc = settled.find(result => result.job.provider === 'Europe PMC')?.results ?? [];
  const nasaSti = settled.find(result => result.job.provider === 'NASA STI')?.results ?? [];
  const usgs =
    settled.find(result => result.job.provider === 'USGS Publications Warehouse')?.results ?? [];
  const crossrefDois = new Set(
    crossref
      .filter(item => !item.isRetracted && item.publicationType === 'journal-article')
      .map(item => normalizeDoi(item.doi))
      .filter((doi): doi is string => Boolean(doi)),
  );
  const discoveryDois = [
    ...new Set(
      [...openAlex, ...openAire]
        .map(item => normalizeDoi(item.doi))
        .filter((doi): doi is string => Boolean(doi)),
    ),
  ]
    .filter(doi => !crossrefDois.has(doi))
    .slice(0, MAX_CANDIDATES_TO_VERIFY);
  const exactCrossrefMatches = await Promise.all(discoveryDois.map(crossrefConfirmsDoi));
  discoveryDois.forEach((doi, index) => {
    if (exactCrossrefMatches[index]) crossrefDois.add(doi);
  });
  const candidates: ResearchCandidate[] = [
    ...openAlex
      .filter(item => normalizeDoi(item.doi) && crossrefDois.has(normalizeDoi(item.doi)!))
      .slice(0, 4),
    ...europePmc
      .filter(item => normalizeDoi(item.doi) && crossrefDois.has(normalizeDoi(item.doi)!))
      .slice(0, 3),
    ...openAire
      .filter(item => normalizeDoi(item.doi) && crossrefDois.has(normalizeDoi(item.doi)!))
      .slice(0, 2),
    ...crossref
      .filter(item => item.access === 'open-access' && item.license && item.verificationUrl)
      .slice(0, 3),
    ...nasaSti.slice(0, 1),
    ...usgs.slice(0, 1),
  ].slice(0, MAX_CANDIDATES_TO_VERIFY);
  const verifiedCandidates = await Promise.all(
    candidates.map(async candidate => {
      const check = await checkFullText(
        candidate.verificationUrl ?? candidate.url,
        candidate.verificationKind ?? 'pdf',
      );
      if (!check.ok || check.status === undefined || !check.mediaType) return undefined;
      const needsHumanPage =
        candidate.provider === 'Europe PMC' ||
        candidate.provider === 'OpenAIRE' ||
        candidate.provider === 'NASA STI';
      const humanPageCheck = needsHumanPage ? await checkHumanPage(candidate.url) : undefined;
      if (needsHumanPage && !humanPageCheck?.ok) return undefined;
      const bibliographicProvider =
        candidate.provider === 'OpenAlex' || candidate.provider === 'Europe PMC';
      const corroboratedBy = new Set<string>(
        candidate.provider === 'OpenAIRE'
          ? ['Crossref']
          : bibliographicProvider
            ? [candidate.provider, 'Crossref']
            : [candidate.provider],
      );
      const checks = [
        ...(bibliographicProvider
          ? ['DOI e ficha bibliográfica encontrados também no Crossref.']
          : []),
        candidate.provider === 'OpenAlex'
          ? candidate.publicationChannel === 'repository'
            ? `OpenAlex identifica uma cópia em repositório de versão ${candidate.publicationVersion === 'accepted' ? 'aceita' : 'publicada'}; licença ${candidate.license}. O DOI foi confirmado no Crossref.`
            : `OpenAlex identifica versão ${candidate.publicationVersion === 'accepted' ? 'aceita' : 'publicada'} em periódico e licença ${candidate.license}. O DOI foi confirmado no Crossref.`
          : candidate.provider === 'Europe PMC'
            ? `Europe PMC classifica o registro como open access, com PMCID e licença ${candidate.license}.`
            : candidate.provider === 'OpenAIRE'
              ? `OpenAIRE encontrou o registro e indica revisão por pares e acesso aberto. Por ser um índice agregador, não conta como fonte independente. O DOI foi confirmado no Crossref e a licença ${candidate.license} e o XML integral foram conferidos.`
              : candidate.provider === 'NASA STI'
                ? `NASA STI registra distribuição pública, documento integral e direitos de uso; a página do registro respondeu HTTP ${humanPageCheck?.status}.`
                : candidate.provider === 'USGS Publications Warehouse'
                  ? 'O catálogo oficial do USGS registra autoria da instituição e disponibiliza o documento.'
                  : `Crossref registra licença ${candidate.license} e versão aceita/publicada; o link do texto integral foi aberto pelo backend.`,
        candidate.verificationKind === 'xml'
          ? `Texto integral XML respondeu HTTP ${check.status} (${check.mediaType}) e a página de leitura HTTP ${humanPageCheck?.status}.`
          : `PDF respondeu HTTP ${check.status}, tipo ${check.mediaType}, com assinatura %PDF- confirmada.`,
      ];
      const {
        verificationUrl: _verificationUrl,
        verificationKind: _verificationKind,
        isRetracted: _isRetracted,
        ...publicCandidate
      } = candidate;
      return {
        ...publicCandidate,
        verification: {
          level: 'metadata-and-access' as const,
          checkedAt: new Date().toISOString(),
          httpStatus: check.status,
          mediaType: check.mediaType,
          corroboratedBy: [...corroboratedBy],
          checks,
        },
        note: candidate.note,
      } satisfies ResearchResult;
    }),
  );
  const deduped = new Map<string, ResearchResult>();
  for (const result of verifiedCandidates.filter((item): item is ResearchResult => Boolean(item))) {
    const key = normalizeDoi(result.doi) ?? result.title.toLowerCase();
    const previous = deduped.get(key);
    if (!previous) deduped.set(key, result);
    else
      deduped.set(key, {
        ...previous,
        verification: {
          ...previous.verification,
          corroboratedBy: [
            ...new Set([
              ...previous.verification.corroboratedBy,
              ...result.verification.corroboratedBy,
            ]),
          ],
          checks: [...new Set([...previous.verification.checks, ...result.verification.checks])],
        },
      });
  }
  const ranked = [...deduped.values()].sort(
    (a, b) =>
      Number(b.verification.corroboratedBy.length) - Number(a.verification.corroboratedBy.length) ||
      (b.citations ?? 0) - (a.citations ?? 0),
  );
  const failedCount = settled.filter(result => result.status.status === 'unavailable').length;
  const body: ResearchResponse = {
    query,
    field,
    generatedAt: new Date().toISOString(),
    results: ranked,
    providers: settled.map(result => ({
      ...result.status,
      count:
        result.job.provider === 'Crossref'
          ? crossrefDois.size
          : result.job.provider === 'OpenAIRE'
            ? result.status.count
            : ranked.filter(item => item.provider === result.job.provider).length,
    })),
    notice:
      'Artigos de periódico só aparecem se não estiverem retratados, tiverem DOI cruzado em bases bibliográficas, licença aberta identificada e texto integral acessível. Relatórios institucionais NASA/USGS ficam identificados separadamente e exigem registro público oficial, direitos adequados conforme os metadados/política institucional e PDF integral aberto. Estas verificações confirmam catálogo, procedência declarada e acesso, não a veracidade de cada afirmação nem fontes independentes. Leia o documento, confira método, dados, exceções de copyright, correções e outras evidências antes de concluir.',
  };
  if (!candidates.length && failedCount === settled.filter(result => result.job.applicable).length)
    return json(
      {
        ...body,
        error:
          'As fontes públicas estão temporariamente indisponíveis. Tente novamente mais tarde.',
      },
      503,
    );
  if (failedCount === 0) {
    if (searchCache.size >= 200) searchCache.delete(searchCache.keys().next().value!);
    searchCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: body });
  }
  return json(body, 200);
}

async function handleLinkCheck(request: Request): Promise<Response> {
  const requestedUrls = new URL(request.url).searchParams.getAll('url');
  if (requestedUrls.length > 24)
    return json({ error: 'Verifique no máximo 24 endereços por consulta.' }, 400);
  const urls = [...new Set(requestedUrls)];
  const results = await Promise.all(
    urls.map(async value => {
      if (value.length > 2048) return { url: value.slice(0, 2048), status: 'unverified' as const };
      let target: URL;
      try {
        target = new URL(value);
      } catch {
        return { url: value, status: 'broken' as const };
      }
      if (!isAllowedSourceUrl(target)) return { url: value, status: 'unverified' as const };
      const cached = linkCache.get(value);
      if (cached && cached.expiresAt > Date.now()) return cached.value;
      try {
        let response = await fetch(target, {
          method: 'HEAD',
          redirect: 'manual',
          signal: AbortSignal.timeout(3500),
          headers: { 'User-Agent': 'Sala de Calma e Estudo/0.1 (+https://calmandstudy.pages.dev)' },
        });
        if (response.status === 405 || response.status === 501) {
          await response.body?.cancel();
          response = await fetch(target, {
            method: 'GET',
            redirect: 'manual',
            signal: AbortSignal.timeout(3500),
            headers: {
              Range: 'bytes=0-0',
              'User-Agent': 'Sala de Calma e Estudo/0.1 (+https://calmandstudy.pages.dev)',
            },
          });
        }
        let redirects = 0;
        while (
          response.status >= 300 &&
          response.status < 400 &&
          response.headers.get('Location') &&
          redirects < 4
        ) {
          const next = new URL(response.headers.get('Location')!, target);
          if (!isAllowedSourceUrl(next)) {
            await response.body?.cancel();
            return { url: value, status: 'unverified', httpStatus: response.status };
          }
          target = next;
          await response.body?.cancel();
          response = await fetch(target, {
            method: 'HEAD',
            redirect: 'manual',
            signal: AbortSignal.timeout(3500),
            headers: {
              'User-Agent': 'Sala de Calma e Estudo/0.1 (+https://calmandstudy.pages.dev)',
            },
          });
          redirects++;
        }
        const status: LinkCheckResult['status'] =
          response.status === 404 || response.status === 410
            ? 'broken'
            : response.ok
              ? 'ok'
              : 'unverified';
        const result = { url: value, status, httpStatus: response.status };
        await response.body?.cancel();
        if (linkCache.size > 300) linkCache.delete(linkCache.keys().next().value!);
        linkCache.set(value, { value: result, expiresAt: Date.now() + 30 * 60 * 1000 });
        return result;
      } catch {
        return { url: value, status: 'unverified' as const };
      }
    }),
  );
  return json({ checkedAt: new Date().toISOString(), links: results }, 200);
}

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '::' ||
    host === '::1' ||
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('fe80:') ||
    /^::ffff:(?:127|10|192\.168|169\.254|172\.(?:1[6-9]|2\d|3[01]))\./.test(host) ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

function isAllowedSourceUrl(target: URL): boolean {
  return (
    target.protocol === 'https:' &&
    (!target.port || target.port === '443') &&
    !target.username &&
    !target.password &&
    !isPrivateHost(target.hostname) &&
    !target.hostname.includes(':') &&
    !/^\d+(?:\.\d+){0,3}$/.test(target.hostname) &&
    isTrustedSourceHost(target.hostname)
  );
}

function isTrustedSourceHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return trustedSourceHosts.some(domain => host === domain || host.endsWith(`.${domain}`));
}

function isRateLimited(request: Request): boolean {
  const clientKey = request.headers.get('CF-Connecting-IP') ?? 'missing-client-address';

  const now = Date.now();
  const existing = requestLimits.get(clientKey);
  if (!existing || now - existing.startedAt >= REQUEST_WINDOW_MS) {
    requestLimits.set(clientKey, { startedAt: now, count: 1 });
  } else if (existing.count >= REQUEST_LIMIT_PER_WINDOW) {
    return true;
  } else {
    existing.count += 1;
  }

  if (requestLimits.size > MAX_RATE_LIMIT_BUCKETS) {
    for (const [key, bucket] of requestLimits) {
      if (
        now - bucket.startedAt >= REQUEST_WINDOW_MS ||
        requestLimits.size > MAX_RATE_LIMIT_BUCKETS
      )
        requestLimits.delete(key);
      if (requestLimits.size <= MAX_RATE_LIMIT_BUCKETS) break;
    }
  }
  return false;
}

function isAllowedRequestOrigin(request: Request): boolean {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return false;
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  const ownOrigin = new URL(request.url).origin;
  return (
    origin === ownOrigin ||
    origin === 'http://localhost:8081' ||
    origin === 'http://127.0.0.1:8081' ||
    origin === 'http://localhost:19006' ||
    origin === 'http://127.0.0.1:19006'
  );
}

function secureApiResponse(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set(
    'Permissions-Policy',
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
  );
  headers.set(
    'Content-Security-Policy',
    "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  headers.set('X-DNS-Prefetch-Control', 'off');
  headers.set('Origin-Agent-Cluster', '?1');
  if (new URL(request.url).protocol === 'https:')
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (response.status >= 400) headers.set('Cache-Control', 'no-store');

  const origin = request.headers.get('Origin');
  if (origin && isAllowedRequestOrigin(request)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set(
      'Vary',
      [
        ...new Set([
          ...(headers
            .get('Vary')
            ?.split(',')
            .map(value => value.trim()) ?? []),
          'Origin',
        ]),
      ].join(', '),
    );
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control':
      status >= 400 ? 'no-store' : 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
  });
  for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
  return new Response(JSON.stringify(body), { status, headers });
}
