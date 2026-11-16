import { topics, studyPaths, tutorials } from '../../packages/content/src/index';

type SqlValue = string | number | null;
interface D1Statement {
  bind(...values: SqlValue[]): D1Statement;
  all<T>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta?: { changes?: number } }>;
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
type ContentType = 'article' | 'trail' | 'tutorial';
type EngagementItem = {
  type: ContentType;
  id: string;
  reads: number;
  likes: number;
  liked: boolean;
};

const UUID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const CONTENT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTENT_TYPES = new Set<ContentType>(['article', 'trail', 'tutorial']);
const CONTENT_IDS: Record<ContentType, Set<string>> = {
  article: new Set(topics.map(item => item.id)),
  trail: new Set(studyPaths.map(item => item.id)),
  tutorial: new Set(tutorials.map(item => item.id)),
};
const encoder = new TextEncoder();
const MAX_BODY_BYTES = 2048;

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  const origin = allowedOrigin(request);
  if (request.method === 'OPTIONS') {
    if (!origin) return respond({ error: 'Origem não permitida.' }, 403);
    return respond(null, 204, corsHeaders(origin, true));
  }
  if (!['GET', 'POST'].includes(request.method))
    return respond({ error: 'Método não permitido.' }, 405, {
      Allow: 'GET, POST, OPTIONS',
      ...corsHeaders(origin),
    });
  if (
    (request.headers.get('Origin') && !origin) ||
    request.headers.get('Sec-Fetch-Site') === 'cross-site'
  )
    return respond({ error: 'Origem não permitida.' }, 403);
  if (!env.DB || !env.SUBMISSION_HASH_SECRET || env.SUBMISSION_HASH_SECRET.length < 32)
    return respond(
      { error: 'As estatísticas ainda não estão configuradas.' },
      503,
      corsHeaders(origin),
    );

  try {
    if (request.method === 'GET') {
      const visitorId = new URL(request.url).searchParams.get('visitor');
      if (visitorId && !UUID.test(visitorId))
        return respond({ error: 'Identificador de visitante inválido.' }, 400, corsHeaders(origin));
      const visitorHash = visitorId
        ? await hashVisitor(visitorId, env.SUBMISSION_HASH_SECRET)
        : null;
      const [reads, likes, mine] = await Promise.all([
        env.DB.prepare(
          'SELECT content_type, content_id, COUNT(*) AS total FROM content_reads GROUP BY content_type, content_id',
        ).all<{ content_type: ContentType; content_id: string; total: number }>(),
        env.DB.prepare(
          'SELECT content_type, content_id, COUNT(*) AS total FROM content_likes GROUP BY content_type, content_id',
        ).all<{ content_type: ContentType; content_id: string; total: number }>(),
        visitorHash
          ? env.DB.prepare(
              'SELECT content_type, content_id FROM content_likes WHERE visitor_hash = ?1',
            )
              .bind(visitorHash)
              .all<{ content_type: ContentType; content_id: string }>()
          : Promise.resolve({ results: [] as { content_type: ContentType; content_id: string }[] }),
      ]);
      const entries = new Map<string, EngagementItem>();
      const itemFor = (type: ContentType, id: string) => {
        const key = type + ':' + id;
        let item = entries.get(key);
        if (!item) {
          item = { type, id, reads: 0, likes: 0, liked: false };
          entries.set(key, item);
        }
        return item;
      };
      for (const row of reads.results ?? [])
        itemFor(row.content_type, row.content_id).reads = Number(row.total) || 0;
      for (const row of likes.results ?? [])
        itemFor(row.content_type, row.content_id).likes = Number(row.total) || 0;
      for (const row of mine.results ?? []) itemFor(row.content_type, row.content_id).liked = true;
      return respond(
        { items: [...entries.values()].slice(0, 3000), updatedAt: new Date().toISOString() },
        200,
        corsHeaders(origin),
      );
    }

    const length = Number(request.headers.get('Content-Length') ?? 0);
    if (length > MAX_BODY_BYTES)
      return respond(
        { error: 'A solicitação excede o tamanho permitido.' },
        413,
        corsHeaders(origin),
      );
    if (
      request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() !==
      'application/json'
    )
      return respond({ error: 'Envie os dados em JSON.' }, 415, corsHeaders(origin));
    const raw = await readLimitedBody(request, MAX_BODY_BYTES);
    if (!raw.ok)
      return respond(
        {
          error: raw.tooLarge
            ? 'A solicitação excede o tamanho permitido.'
            : 'Não foi possível ler a solicitação.',
        },
        raw.tooLarge ? 413 : 400,
        corsHeaders(origin),
      );

    let body: unknown;
    try {
      body = JSON.parse(raw.value);
    } catch {
      return respond({ error: 'O JSON enviado não é válido.' }, 400, corsHeaders(origin));
    }
    if (
      !isRecord(body) ||
      typeof body.visitorId !== 'string' ||
      !UUID.test(body.visitorId) ||
      typeof body.contentId !== 'string' ||
      !CONTENT_ID.test(body.contentId) ||
      typeof body.contentType !== 'string' ||
      !CONTENT_TYPES.has(body.contentType as ContentType) ||
      !CONTENT_IDS[body.contentType as ContentType]?.has(body.contentId) ||
      (body.action !== 'read' && body.action !== 'like') ||
      (body.action === 'like' && typeof body.liked !== 'boolean')
    )
      return respond({ error: 'Dados de engajamento inválidos.' }, 400, corsHeaders(origin));

    const contentType = body.contentType as ContentType;
    const visitorHash = await hashVisitor(body.visitorId, env.SUBMISSION_HASH_SECRET);
    const now = new Date().toISOString();
    const result =
      body.action === 'read'
        ? await env.DB.prepare(
            'INSERT OR IGNORE INTO content_reads (content_type, content_id, visitor_hash, first_read_at) VALUES (?1, ?2, ?3, ?4)',
          )
            .bind(contentType, body.contentId, visitorHash, now)
            .run()
        : body.liked
          ? await env.DB.prepare(
              'INSERT OR IGNORE INTO content_likes (content_type, content_id, visitor_hash, created_at) VALUES (?1, ?2, ?3, ?4)',
            )
              .bind(contentType, body.contentId, visitorHash, now)
              .run()
          : await env.DB.prepare(
              'DELETE FROM content_likes WHERE content_type = ?1 AND content_id = ?2 AND visitor_hash = ?3',
            )
              .bind(contentType, body.contentId, visitorHash)
              .run();
    return respond(
      { ok: true, changed: (result.meta?.changes ?? 0) > 0 },
      200,
      corsHeaders(origin),
    );
  } catch {
    return respond(
      { error: 'Não foi possível atualizar as estatísticas agora.' },
      503,
      corsHeaders(origin),
    );
  }
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function hashVisitor(visitorId: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(visitorId));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  if (origin === new URL(request.url).origin) return origin;
  return [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'http://localhost:19006',
    'http://127.0.0.1:19006',
  ].includes(origin)
    ? origin
    : null;
}

function corsHeaders(origin: string | null, preflight = false): HeadersInit {
  return origin
    ? {
        'Access-Control-Allow-Origin': origin,
        ...(preflight
          ? {
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '86400',
            }
          : {}),
        Vary: 'Origin',
      }
    : {};
}

function respond(body: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy':
      'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Origin-Agent-Cluster': '?1',
    'Content-Security-Policy':
      "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  });
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  new Headers(extraHeaders).forEach((value, name) => headers.set(name, value));
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}
