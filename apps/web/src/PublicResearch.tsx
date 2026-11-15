import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  LoaderCircle,
  Plus,
  RotateCw,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { ResearchResult, ResearchResponse } from '../../../packages/research/src/index';
import { fields as catalogueFields } from '../../../packages/content/src/fields';
import {
  postSubmission,
  SubmissionError,
  type SubmissionRequest,
} from '@calmandstudy/content/submissions';

// Use the same catalogue as discovery so every area offered by the app can be researched here.
const fields = catalogueFields.filter(field => field !== 'Todas');
const STORAGE_KEY = 'calmandstudy-source-verified-v2';
const PENDING_KEY = 'calmandstudy-pending-source-submission-v1';
const MAX_SAVED_RESULTS = 100;
const MAX_SAVED_BYTES = 500_000;
const UUID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSavedResult(value: unknown): value is ResearchResult {
  if (!isRecord(value) || typeof value.id !== 'string' || value.id.length > 300) return false;
  const verification = value.verification;
  if (
    !['OpenAlex', 'Crossref', 'Europe PMC', 'NASA STI', 'USGS Publications Warehouse'].includes(
      String(value.provider),
    ) ||
    typeof value.title !== 'string' ||
    value.title.length > 500 ||
    typeof value.url !== 'string' ||
    value.url.length > 2048 ||
    typeof value.access !== 'string' ||
    !['open-access', 'metadata-only', 'unknown'].includes(value.access) ||
    !Array.isArray(value.authors) ||
    value.authors.length > 30 ||
    !value.authors.every(author => typeof author === 'string' && author.length <= 160) ||
    typeof value.note !== 'string' ||
    value.note.length > 1200 ||
    !isRecord(verification) ||
    verification.level !== 'metadata-and-access' ||
    typeof verification.checkedAt !== 'string' ||
    !Number.isFinite(Date.parse(verification.checkedAt)) ||
    typeof verification.httpStatus !== 'number' ||
    verification.httpStatus < 100 ||
    verification.httpStatus > 599 ||
    typeof verification.mediaType !== 'string' ||
    verification.mediaType.length > 120 ||
    !Array.isArray(verification.corroboratedBy) ||
    verification.corroboratedBy.length > 10 ||
    !verification.corroboratedBy.every(
      source => typeof source === 'string' && source.length <= 100,
    ) ||
    !Array.isArray(verification.checks) ||
    verification.checks.length > 20 ||
    !verification.checks.every(check => typeof check === 'string' && check.length <= 160) ||
    (value.abstract !== undefined &&
      (typeof value.abstract !== 'string' || value.abstract.length > 10_000)) ||
    (value.year !== undefined &&
      (typeof value.year !== 'number' || value.year < 1000 || value.year > 9999)) ||
    (value.citations !== undefined &&
      (typeof value.citations !== 'number' ||
        !Number.isFinite(value.citations) ||
        value.citations < 0))
  )
    return false;
  try {
    return new URL(value.url).protocol === 'https:';
  } catch {
    return false;
  }
}

function loadSaved(): ResearchResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_SAVED_BYTES) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedResult).slice(0, MAX_SAVED_RESULTS);
  } catch {
    return [];
  }
}
function loadPending(): SubmissionRequest | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw || raw.length > 130_000) return null;
    const value: unknown = JSON.parse(raw);
    return isRecord(value) &&
      value.kind === 'sources' &&
      typeof value.id === 'string' &&
      UUID.test(value.id) &&
      isRecord(value.payload)
      ? (value as unknown as SubmissionRequest)
      : null;
  } catch {
    return null;
  }
}

export default function PublicResearch() {
  const [query, setQuery] = useState('');
  const [field, setField] = useState('História');
  const [response, setResponse] = useState<ResearchResponse | null>(null);
  const [saved, setSaved] = useState<ResearchResult[]>(loadSaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<SubmissionRequest | null>(loadPending);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* Storage can be disabled or full. */
    }
  }, [saved]);
  useEffect(() => {
    try {
      if (pending) localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      else localStorage.removeItem(PENDING_KEY);
    } catch {
      /* Keep JSON export available. */
    }
  }, [pending]);
  const results = useMemo(() => response?.results ?? [], [response]);

  const search = async (event?: FormEvent) => {
    event?.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery.length > 0 && cleanQuery.length < 3) {
      setError('Digite pelo menos 3 caracteres ou deixe o campo vazio para pesquisar pela área.');
      return;
    }
    const searchTerm = cleanQuery || field;
    setLoading(true);
    setError('');
    setNotice('');
    setResponse(null);
    try {
      const params = new URLSearchParams({ q: searchTerm, field });
      const result = await fetch(`/api/research?${params}`, {
        headers: { Accept: 'application/json' },
      });
      const body = (await result.json()) as ResearchResponse & { error?: string };
      if (!result.ok) throw new Error(body.error ?? 'Não foi possível consultar as fontes agora.');
      setResponse(body);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Não foi possível consultar as fontes agora.',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = (item: ResearchResult) => {
    const alreadySaved = saved.some(source => source.id === item.id);
    setSaved(current =>
      alreadySaved
        ? current.filter(source => source.id !== item.id)
        : [{ ...item, abstract: undefined }, ...current].slice(0, MAX_SAVED_RESULTS),
    );
    setNotice(
      alreadySaved ? 'Referência removida da seleção.' : 'Referência adicionada à seleção local.',
    );
    window.setTimeout(() => setNotice(''), 2400);
  };

  const makeDraft = () => {
    const exportedAt = new Date().toISOString();
    const draft = {
      status: 'needs-review',
      exportedAt,
      searchContext: { field, query: response?.query ?? query },
      sourceCandidates: saved.map(item => ({
        id: item.id,
        title: item.title,
        publisher: item.venue ?? item.provider,
        url: item.url,
        kind: 'other',
        catalogue: item.provider,
        authors: item.authors,
        publishedAt: item.year ? `${item.year}` : undefined,
        accessedAt: response?.generatedAt ?? exportedAt,
        doi: item.doi,
        license: item.license,
        openAccessStatus: item.access,
        publicationType: item.publicationType,
        editorialNote: item.note,
      })),
      editorialReminder:
        'Os metadados e o acesso aberto passaram pelo filtro automático, mas isso não confirma a verdade das afirmações. Leia o texto integral, associe evidências diretas a cada afirmação, compare fontes independentes e faça revisão humana antes de publicar.',
    };
    return draft;
  };

  const ensurePending = () =>
    pending ?? { id: crypto.randomUUID(), kind: 'sources' as const, payload: makeDraft() };
  const sendSources = async (submission = ensurePending()) => {
    setPending(submission);
    setSending(true);
    setNotice('');
    try {
      await postSubmission('/api/submissions', submission);
      setPending(null);
      setSaved([]);
      setNotice('Referências enviadas para a fila de curadoria editorial.');
    } catch (reason) {
      const message =
        reason instanceof SubmissionError
          ? reason.message
          : 'Não foi possível enviar. As referências selecionadas foram mantidas neste navegador para tentar novamente.';
      const retry =
        reason instanceof SubmissionError && reason.retryAt
          ? ` Tente novamente após ${new Date(reason.retryAt).toLocaleString('pt-BR')}.`
          : '';
      setNotice(`${message}${retry}`);
    } finally {
      setSending(false);
    }
  };

  const exportDraft = () => {
    const submission = ensurePending();
    const draft = { ...(submission.payload as Record<string, unknown>), submission };
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'calmandstudy-fontes-para-revisao.json';
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <section className="public-research">
      <header className="research-intro">
        <div className="eyebrow">
          <BookOpen size={14} /> FONTES PÚBLICAS · ACESSO E PROCEDÊNCIA CONFERIDOS
        </div>
        <h1>
          Comece por fontes,
          <br />
          <em>construa conhecimento.</em>
        </h1>
        <p>
          Artigos acadêmicos só aparecem com licença aberta reconhecida e texto integral testado.
          Quando disponíveis, cruzamos também o DOI entre catálogos bibliográficos. Uma versão
          aceita depositada em repositório pode aparecer se tiver licença clara, PDF acessível e DOI
          confirmado; ela será identificada como cópia de repositório. Nas áreas pertinentes também
          buscamos documentos técnicos da NASA e publicações do USGS, exigindo catálogo
          institucional, permissão pública declarada e PDF acessível. A checagem técnica não prova a
          verdade das conclusões.
        </p>
        <div className="research-source-chips">
          <span>OpenAlex + Crossref · artigos OA e DOI</span>
          <span>Europe PMC · biomédicas</span>
          <span>NASA STI · documentos com direitos públicos registrados</span>
          <span>USGS · publicações com autoria institucional</span>
        </div>
      </header>

      <form className="research-search" onSubmit={search} aria-busy={loading}>
        <label htmlFor="public-research-query">O que você quer investigar?</label>
        <div className="research-search-row">
          <Search size={17} />
          <input
            id="public-research-query"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Opcional: ex. circulação da seda na Antiguidade"
            maxLength={160}
          />
          <button className="primary" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={15} /> : <Search size={15} />}{' '}
            {loading ? 'Pesquisando' : 'Buscar fontes'}
          </button>
        </div>
        <div className="research-options">
          <label>
            Área científica <span className="research-field-count">{fields.length} áreas</span>
            <select value={field} onChange={event => setField(event.target.value)}>
              {fields.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <span className="strict-filter">
            <Check size={14} /> Filtro obrigatório: catálogo e direitos claros + texto integral
            testado
          </span>
        </div>
        <p className="research-coverage-note">
          Pesquise um tema específico ou deixe o campo vazio para buscar pela área selecionada.
          Todas as áreas do catálogo estão disponíveis; só exibimos referências com procedência e
          acesso livre confirmados automaticamente.
        </p>
        <small className="research-privacy">
          O termo de busca é enviado aos provedores públicos selecionados para obter resultados. Não
          inclua dados pessoais.
        </small>
      </form>

      {notice && (
        <div className="research-notice" role="status" aria-live="polite">
          <Check size={15} aria-hidden="true" />
          {notice}
        </div>
      )}
      {error && (
        <div className="research-error" role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      {response && (
        <section className="research-response" aria-label="Resultados da busca">
          <div className="research-results-head">
            <div>
              <span className="eyebrow muted">ACESSO ABERTO E PROCEDÊNCIA CONFERIDOS</span>
              <h2>Fontes que passaram pelo filtro</h2>
            </div>
            <span role="status" aria-live="polite">
              {results.length} resultados
            </span>
          </div>
          <div className="provider-status" aria-label="Status das fontes consultadas">
            {response.providers.map(provider => (
              <span
                key={provider.provider}
                className={`provider-${provider.status}`}
                title={provider.reason}
                aria-label={
                  provider.reason
                    ? `${provider.provider}: ${provider.reason}`
                    : `${provider.provider}: ${provider.status}`
                }
              >
                <i aria-hidden="true" />
                {provider.provider}:{' '}
                {provider.status === 'ok'
                  ? provider.provider === 'Crossref'
                    ? `${provider.count} metadados bibliográficos`
                    : `${provider.count} referências validadas`
                  : provider.status === 'not-applicable'
                    ? 'fora do escopo desta área'
                    : 'indisponível agora'}
              </span>
            ))}
          </div>
          {response.providers.map(provider => {
            const diagnostic =
              provider.reason ??
              (provider.provider === 'OpenAlex' && provider.status === 'ok' && provider.count === 0
                ? 'OpenAlex respondeu, mas nenhum registro passou por todas as verificações de DOI, licença aberta, versão elegível e texto integral acessível.'
                : undefined);
            return diagnostic ? (
              <p className="provider-diagnostic" key={`${provider.provider}-diagnostic`}>
                <b>{provider.provider}:</b> {diagnostic}
              </p>
            ) : null;
          })}
          <div className="research-results">
            {results.map(item => (
              <article className="research-result" key={item.id}>
                <div className="research-result-top">
                  <span className="provider-badge">
                    {item.verification.corroboratedBy.join(' + ')}
                  </span>
                  <span className="access-badge access-open-access">
                    Texto integral confirmado · {item.license}
                  </span>
                  {item.publicationChannel === 'repository' && (
                    <span className="repository-badge">
                      Cópia em repositório · versão{' '}
                      {item.publicationVersion === 'accepted' ? 'aceita' : 'publicada'}
                    </span>
                  )}
                </div>
                <h3>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ExternalLink size={14} />
                  </a>
                </h3>
                <p className="result-authors">
                  {item.authors.length ? item.authors.join(', ') : 'Autoria não informada'}
                  {item.year ? ` · ${item.year}` : ''}
                  {item.venue ? ` · ${item.venue}` : ''}
                  {item.publicationType ? ` · ${item.publicationType}` : ''}
                </p>
                {item.abstract && <p className="result-abstract">{item.abstract}</p>}
                <div className="verification-checks">
                  <b>O que foi verificado</b>
                  <ul>
                    {item.verification.checks.map(check => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                  <small>
                    Teste em {new Date(item.verification.checkedAt).toLocaleString('pt-BR')} · HTTP{' '}
                    {item.verification.httpStatus} · {item.verification.mediaType}
                  </small>
                </div>
                <p className="result-note">
                  <ShieldAlert size={14} />
                  {item.note}
                </p>
                <div className="result-footer">
                  {item.doi && (
                    <a
                      href={`https://doi.org/${item.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DOI: {item.doi}
                    </a>
                  )}
                  {item.citations !== undefined && (
                    <span>
                      {item.citations.toLocaleString('pt-BR')} citações registradas (não é nota de
                      qualidade)
                    </span>
                  )}
                  <button
                    className={saved.some(source => source.id === item.id) ? 'saved' : ''}
                    onClick={() => toggleSaved(item)}
                  >
                    {saved.some(source => source.id === item.id) ? (
                      <Check size={14} />
                    ) : (
                      <Plus size={14} />
                    )}{' '}
                    {saved.some(source => source.id === item.id) ? 'Selecionada' : 'Selecionar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {results.length === 0 && (
            <div className="research-empty">
              <Search size={22} />
              <b>Nenhum artigo passou pelo filtro estrito</b>
              <span>
                {response.providers.some(provider => provider.status === 'unavailable')
                  ? 'Algumas fontes públicas não responderam agora, então esta busca pode estar incompleta. Tente novamente em alguns minutos ou use termos mais curtos e específicos.'
                  : 'Os catálogos consultados não permitiram confirmar, nesta busca, licença aberta e acesso ao texto integral. Metadados bibliográficos isolados não são suficientes para exibir uma referência. Experimente termos mais curtos, sinônimos ou um nome próprio relacionado ao tema.'}
              </span>
              <button className="outline-btn" onClick={() => void search()} disabled={loading}>
                {loading ? <LoaderCircle className="spin" size={15} /> : <RotateCw size={15} />}
                {loading ? 'Pesquisando…' : 'Tentar novamente'}
              </button>
            </div>
          )}
          <p className="research-disclaimer">{response.notice}</p>
        </section>
      )}
      <div className="research-workbench">
        <div>
          <span className="eyebrow muted">CADERNO DE PESQUISA</span>
          <h2>
            Referências selecionadas <b>{saved.length}</b>
          </h2>
          <p>
            Envie as referências à fila editorial privada ou baixe uma cópia para consulta manual. O
            envio não publica conteúdo automaticamente.
          </p>
        </div>
        <div className="workbench-actions">
          <button
            className="outline-btn"
            onClick={() => void sendSources()}
            disabled={!saved.length || sending}
          >
            <Plus size={15} />
            {sending ? 'Enviando…' : 'Enviar para curadoria'}
          </button>
          <button
            className="outline-btn"
            onClick={exportDraft}
            disabled={!saved.length && !pending}
          >
            <Download size={15} /> Baixar cópia JSON
          </button>
          {saved.length > 0 && (
            <button className="quiet-btn" onClick={() => setSaved([])}>
              <Trash2 size={14} /> Limpar
            </button>
          )}
        </div>
      </div>
      {!response && !loading && !error && (
        <div className="research-how">
          <h2>Critério do filtro</h2>
          <ol>
            <li>
              Artigos de periódico: retirar retratações e preprints, exigir licença Creative Commons
              reconhecida e confirmar o arquivo integral. Quando há DOI, cruzamos os catálogos
              OpenAlex/Europe PMC e Crossref; registros Crossref sem uma segunda base só entram se a
              licença declarada e o PDF de versão aceita/publicada forem confirmados diretamente.
            </li>
            <li>
              NASA STI: aceitar somente distribuição pública, documento liberado, permissão
              pública/licença registrada e sem material de terceiros não liberado.
            </li>
            <li>
              USGS: exigir um registro do Publications Warehouse com autoria atribuída ao USGS e
              documento disponível para leitura.
            </li>
            <li>
              Abrir o arquivo completo no backend e confirmar resposta, tipo e assinatura PDF/XML.
              Fontes bloqueadas, sem direitos claros ou com erro ficam fora.
            </li>
          </ol>
          <p>
            O resultado é uma pista de pesquisa, não um artigo pronto nem confirmação independente
            de suas afirmações. A tela identifica se é artigo revisado por periódico ou documento
            institucional; examine método, ressalvas, direitos e outras evidências antes de usar uma
            conclusão.
          </p>
        </div>
      )}
    </section>
  );
}
