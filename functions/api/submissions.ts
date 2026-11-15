type SqlValue = string | number | null;
type D1Result = { success: boolean; meta?: { changes?: number } };
interface D1Statement {
  bind(...values: SqlValue[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result>;
}
interface D1Database {
  prepare(query: string): D1Statement;
}
interface Env {
  DB?: D1Database;
  SUBMISSION_HASH_SECRET?: string;
}
interface PagesContext {
  request: Request;
  env: Env;
}

const DAILY_LIMIT = 5;
const MAX_BODY_BYTES = 128_000;
const UUID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const ALLOWED_KINDS = new Set(['topic', 'review', 'sources']);
const encoder = new TextEncoder();

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  const corsOrigin = allowedOrigin(request);
  if (request.method === 'OPTIONS') {
    if (!corsOrigin) return respond({ error: 'Origem não permitida.' }, 403);
    return respond(null, 204, {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    });
  }
  if (request.method !== 'POST')
    return respond({ error: 'Método não permitido.' }, 405, {
      Allow: 'POST, OPTIONS',
      ...corsHeader(corsOrigin),
    });
  if (request.headers.get('Origin') && !corsOrigin)
    return respond({ error: 'Origem não permitida.' }, 403);
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site')
    return respond({ error: 'Origem não permitida.' }, 403);
  const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json')
    return respond({ error: 'Envie os dados em JSON.' }, 415, corsHeader(corsOrigin));
  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (length > MAX_BODY_BYTES)
    return respond({ error: 'O envio excede o tamanho permitido.' }, 413, corsHeader(corsOrigin));
  if (!env.DB || !env.SUBMISSION_HASH_SECRET || env.SUBMISSION_HASH_SECRET.length < 32) {
    return respond(
      {
        error: 'O recebimento de sugestões ainda não está configurado.',
        code: 'submissions_unavailable',
      },
      503,
      corsHeader(corsOrigin),
    );
  }

  const raw = await readLimitedBody(request, MAX_BODY_BYTES);
  if (!raw.ok)
    return respond(
      {
        error: raw.tooLarge
          ? 'O envio excede o tamanho permitido.'
          : 'Não foi possível ler o envio.',
      },
      raw.tooLarge ? 413 : 400,
      corsHeader(corsOrigin),
    );

  let body: unknown;
  try {
    body = JSON.parse(raw.value);
  } catch {
    return respond({ error: 'O JSON enviado não é válido.' }, 400, corsHeader(corsOrigin));
  }
  const validated = validateSubmission(body);
  if (!validated.ok) return respond({ error: validated.error }, 400, corsHeader(corsOrigin));

  const ip =
    request.headers.get('CF-Connecting-IP') ??
    (new URL(request.url).hostname === 'localhost'
      ? 'local-development'
      : 'missing-client-address');
  if (ip.length > 64)
    return respond(
      { error: 'Não foi possível validar a origem do envio.' },
      400,
      corsHeader(corsOrigin),
    );
  const clientHash = await hashClient(ip, env.SUBMISSION_HASH_SECRET);
  const now = new Date();
  const dayUtc = now.toISOString().slice(0, 10);
  const retryAt = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  ).toISOString();

  try {
    const existing = await env.DB.prepare('SELECT id FROM submissions WHERE id = ?1')
      .bind(validated.value.id)
      .first<{ id: string }>();
    if (existing)
      return respond({ ok: true, duplicate: true, id: existing.id }, 200, corsHeader(corsOrigin));

    await env.DB.prepare('DELETE FROM submission_daily_quotas WHERE day_utc < ?1')
      .bind(dayUtc)
      .run();
    const reservation = await env.DB.prepare(
      `
      INSERT INTO submission_daily_quotas (client_hash, day_utc, submission_count)
      VALUES (?1, ?2, 1)
      ON CONFLICT(client_hash, day_utc) DO UPDATE SET submission_count = submission_count + 1
      WHERE submission_count < ?3
      RETURNING submission_count
    `,
    )
      .bind(clientHash, dayUtc, DAILY_LIMIT)
      .first<{ submission_count: number }>();

    if (!reservation) {
      return respond(
        {
          error:
            'Você atingiu o limite diário de 5 envios por este acesso. A sugestão permanece neste dispositivo; tente reenviá-la após a renovação do limite.',
          code: 'daily_limit_reached',
          limit: DAILY_LIMIT,
          retryAt,
        },
        429,
        {
          ...corsHeader(corsOrigin),
          'Retry-After': String(
            Math.max(1, Math.ceil((Date.parse(retryAt) - now.getTime()) / 1000)),
          ),
        },
      );
    }

    try {
      await env.DB.prepare(
        `
        INSERT INTO submissions (id, kind, title, field, article_id, reason, payload_json, created_at, status)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'pending')
      `,
      )
        .bind(
          validated.value.id,
          validated.value.kind,
          validated.value.title,
          validated.value.field,
          validated.value.articleId,
          validated.value.reason,
          JSON.stringify(validated.value.payload),
          now.toISOString(),
        )
        .run();
    } catch (error) {
      await env.DB.prepare(
        `UPDATE submission_daily_quotas SET submission_count = MAX(0, submission_count - 1) WHERE client_hash = ?1 AND day_utc = ?2`,
      )
        .bind(clientHash, dayUtc)
        .run()
        .catch(() => undefined);
      throw error;
    }

    return respond(
      {
        ok: true,
        id: validated.value.id,
        status: 'pending',
        remainingToday: DAILY_LIMIT - reservation.submission_count,
      },
      201,
      corsHeader(corsOrigin),
    );
  } catch {
    return respond(
      {
        error:
          'Não foi possível registrar agora. Seus dados continuam salvos neste dispositivo para tentar novamente.',
        code: 'submissions_unavailable',
      },
      503,
      corsHeader(corsOrigin),
    );
  }
}

type ValidatedSubmission = {
  id: string;
  kind: 'topic' | 'review' | 'sources';
  title: string;
  field: string;
  articleId: string | null;
  reason: string | null;
  payload: Record<string, unknown>;
};

function validateSubmission(
  input: unknown,
): { ok: true; value: ValidatedSubmission } | { ok: false; error: string } {
  if (
    !isRecord(input) ||
    typeof input.id !== 'string' ||
    !UUID.test(input.id) ||
    typeof input.kind !== 'string' ||
    !ALLOWED_KINDS.has(input.kind) ||
    !isRecord(input.payload)
  ) {
    return { ok: false, error: 'Formato de envio inválido.' };
  }
  const { id, payload } = input;
  const kind = input.kind as ValidatedSubmission['kind'];

  if (kind === 'topic' || kind === 'review') {
    const title = stringValue(payload.title, 120);
    const field = stringValue(payload.field, 80);
    const reason = stringValue(payload.reason, 600);
    const source = optionalHttpsUrl(payload.source, 500);
    if (!title || !field || !reason || source === false)
      return {
        ok: false,
        error: 'Informe um tema, uma área e o motivo da sugestão. Links devem usar HTTPS.',
      };
    let submittedSources: { publisher: string; url: string }[] = [];
    if (kind === 'topic') {
      if (payload.editorialPolicyAccepted !== true)
        return {
          ok: false,
          error: 'Confirme que a proposta respeita os limites editoriais antes de enviá-la.',
        };
      if (!Array.isArray(payload.sources) || payload.sources.length !== 3)
        return { ok: false, error: 'Uma sugestão de tema precisa de três fontes independentes.' };
      const publishers = new Set<string>();
      const hosts = new Set<string>();
      for (const candidate of payload.sources) {
        if (!isRecord(candidate))
          return { ok: false, error: 'Cada fonte precisa de instituição e link HTTPS.' };
        const publisher = stringValue(candidate.publisher, 160);
        const url = optionalHttpsUrl(candidate.url, 500);
        if (!publisher || !url)
          return { ok: false, error: 'Informe três instituições e links HTTPS válidos.' };
        let host = '';
        try {
          host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
        } catch {
          return { ok: false, error: 'Um dos links informados não é válido.' };
        }
        const publisherKey = publisher.normalize('NFKC').trim().toLocaleLowerCase('pt-BR');
        if (publishers.has(publisherKey) || hosts.has(host))
          return {
            ok: false,
            error: 'Use três instituições independentes e links de domínios diferentes.',
          };
        publishers.add(publisherKey);
        hosts.add(host);
        submittedSources.push({ publisher, url });
      }
    }
    const articleId = kind === 'review' ? stringValue(payload.articleId, 120) : undefined;
    if (kind === 'review' && !articleId)
      return { ok: false, error: 'A revisão precisa identificar o artigo relacionado.' };
    const articleTitle = kind === 'review' ? stringValue(payload.articleTitle, 160) : undefined;
    if (kind === 'review' && !articleTitle)
      return { ok: false, error: 'O título do artigo relacionado está ausente.' };
    const clean = {
      title,
      field,
      reason,
      source: source ?? '',
      ...(kind === 'topic' ? { sources: submittedSources } : {}),
      ...(kind === 'topic' ? { editorialPolicyAccepted: true } : {}),
      kind,
      ...(articleId ? { articleId } : {}),
      ...(articleTitle ? { articleTitle } : {}),
    };
    return {
      ok: true,
      value: { id, kind, title, field, articleId: articleId ?? null, reason, payload: clean },
    };
  }

  const searchContext = isRecord(payload.searchContext) ? payload.searchContext : null;
  const field = searchContext ? stringValue(searchContext.field, 80) : undefined;
  const query = searchContext ? stringValue(searchContext.query, 160) : undefined;
  if (
    !field ||
    !Array.isArray(payload.sourceCandidates) ||
    payload.sourceCandidates.length < 1 ||
    payload.sourceCandidates.length > 80
  ) {
    return { ok: false, error: 'O pacote de fontes precisa de uma área e de 1 a 80 referências.' };
  }
  const candidates: Record<string, unknown>[] = [];
  for (const candidate of payload.sourceCandidates) {
    if (!isRecord(candidate))
      return { ok: false, error: 'Uma das referências está em formato inválido.' };
    const candidateTitle = stringValue(candidate.title, 300);
    const url = optionalHttpsUrl(candidate.url, 2048);
    const provider = stringValue(candidate.catalogue, 80);
    if (!candidateTitle || !url || !provider)
      return { ok: false, error: 'Cada referência precisa de título, catálogo e endereço HTTPS.' };
    const authors = Array.isArray(candidate.authors)
      ? candidate.authors
          .filter((author): author is string => typeof author === 'string' && author.length <= 160)
          .slice(0, 30)
      : [];
    candidates.push({
      id: stringValue(candidate.id, 300) ?? '',
      title: candidateTitle,
      publisher: stringValue(candidate.publisher, 200) ?? provider,
      url,
      catalogue: provider,
      authors,
      publishedAt: stringValue(candidate.publishedAt, 40) ?? '',
      accessedAt: stringValue(candidate.accessedAt, 40) ?? '',
      doi: stringValue(candidate.doi, 200) ?? '',
      license: stringValue(candidate.license, 200) ?? '',
      openAccessStatus: stringValue(candidate.openAccessStatus, 40) ?? '',
      publicationType: stringValue(candidate.publicationType, 100) ?? '',
      editorialNote: stringValue(candidate.editorialNote, 1000) ?? '',
    });
  }
  const title = `Referências para curadoria · ${field}`;
  const cleanPayload = {
    status: 'needs-review',
    searchContext: { field, query: query ?? '' },
    sourceCandidates: candidates,
    editorialReminder: stringValue(payload.editorialReminder, 1000) ?? '',
  };
  return {
    ok: true,
    value: {
      id,
      kind,
      title,
      field,
      articleId: null,
      reason: query ? `Pesquisa: ${query}` : 'Referências selecionadas na pesquisa pública',
      payload: cleanPayload,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readLimitedBody(
  request: Request,
  limit: number,
): Promise<{ ok: true; value: string } | { ok: false; tooLarge: boolean }> {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, tooLarge: false };
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        return { ok: false, tooLarge: true };
      }
      chunks.push(value);
    }
    const body = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { ok: true, value: new TextDecoder().decode(body) };
  } catch {
    return { ok: false, tooLarge: false };
  }
}

function stringValue(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const clean = value.trim();
  return clean.length > 0 && clean.length <= maxLength ? clean : undefined;
}

function optionalHttpsUrl(value: unknown, maxLength: number): string | '' | false {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > maxLength) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    return url.toString();
  } catch {
    return false;
  }
}

async function hashClient(ip: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(ip));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const own = new URL(request.url).origin;
  const local = new Set([
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'http://localhost:19006',
    'http://127.0.0.1:19006',
  ]);
  return origin === own || local.has(origin) ? origin : null;
}

function corsHeader(origin: string | null): Record<string, string> {
  return origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};
}

function respond(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy':
      'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
    'Content-Security-Policy':
      "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Origin-Agent-Cluster': '?1',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  });
  Object.entries(extraHeaders).forEach(([name, value]) => headers.set(name, value));
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}
