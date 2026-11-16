type SqlValue = string | number | null;
interface Statement {
  bind(...values: SqlValue[]): Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface Database {
  prepare(query: string): Statement;
}
export interface RateLimitEnv {
  DB?: Database;
  SUBMISSION_HASH_SECRET?: string;
}
interface PagesContext {
  request: Request;
  env: RateLimitEnv;
  next(): Promise<Response>;
}

const encoder = new TextEncoder();
const localBuckets = new Map<string, { window: number; count: number }>();
const MAX_LOCAL_BUCKETS = 5_000;
let lastCleanupWindow = -1;

const policies = {
  research: { limit: 20, windowSeconds: 60 },
  links: { limit: 12, windowSeconds: 60 },
  submissions: { limit: 10, windowSeconds: 60 },
  engagement: { limit: 60, windowSeconds: 60 },
} as const;

export async function onRequest({ request, env, next }: PagesContext): Promise<Response> {
  const path = new URL(request.url).pathname;
  const category =
    path === '/api/research'
      ? 'research'
      : path === '/api/links/check'
        ? 'links'
        : path === '/api/submissions'
          ? 'submissions'
          : path === '/api/engagement'
            ? 'engagement'
            : null;
  if (!category || (category === 'submissions' && request.method === 'OPTIONS')) return next();
  if (!isAllowedApiRequest(request)) return apiError(403, 'Origem não permitida.');
  const limited = await enforceApiRateLimit(request, env, category);
  return limited ? addRateLimitCors(limited, request) : next();
}

function apiError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error, code: 'origin_not_allowed' }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

export async function enforceApiRateLimit(
  request: Request,
  env: RateLimitEnv,
  category: keyof typeof policies,
): Promise<Response | null> {
  const policy = policies[category];
  const nowSeconds = Math.floor(Date.now() / 1000);
  const window = Math.floor(nowSeconds / policy.windowSeconds);
  const retryAfter = policy.windowSeconds - (nowSeconds % policy.windowSeconds);
  const clientAddress = request.headers.get('CF-Connecting-IP');
  const localRequest = ['localhost', '127.0.0.1'].includes(new URL(request.url).hostname);
  if (!env.DB !== !env.SUBMISSION_HASH_SECRET)
    return rateError(503, 'A proteção contra abuso está configurada parcialmente.');
  if (!env.DB && !localRequest)
    return rateError(503, 'A proteção contra abuso não está configurada para este ambiente.');
  if (env.DB && env.SUBMISSION_HASH_SECRET) {
    if (env.SUBMISSION_HASH_SECRET.length < 32)
      return rateError(503, 'A proteção contra abuso não está configurada corretamente.');
    if (!clientAddress && !localRequest)
      return rateError(503, 'Não foi possível identificar a origem da solicitação.');
    try {
      const key = await hashClient(
        `${category}:${clientAddress ?? 'local-development'}`,
        env.SUBMISSION_HASH_SECRET,
      );
      // The deployed 0001 schema predates engagement and only permits the
      // research/links/submissions category values. The HMAC already includes
      // the real category, so storing this isolated bucket under "links" keeps
      // engagement limits separate without requiring a D1 schema migration.
      const storedCategory = category === 'engagement' ? 'links' : category;
      const result = await env.DB.prepare(
        `
        INSERT INTO api_request_limits (client_hash, category, window_start, request_count)
        VALUES (?1, ?2, ?3, 1)
        ON CONFLICT(client_hash, category, window_start) DO UPDATE SET request_count = request_count + 1
        WHERE request_count < ?4
        RETURNING request_count
      `,
      )
        .bind(key, storedCategory, window, policy.limit)
        .first<{ request_count: number }>();
      if (window % 10 === 0 && lastCleanupWindow !== window) {
        lastCleanupWindow = window;
        try {
          await env.DB.prepare('DELETE FROM api_request_limits WHERE window_start < ?1')
            .bind(window - 10)
            .run();
        } catch {
          lastCleanupWindow = -1;
        }
      }
      return result
        ? null
        : rateError(
            429,
            'Limite temporário de consultas atingido. Tente novamente em instantes.',
            retryAfter,
          );
    } catch {
      return rateError(
        503,
        'A proteção contra abuso está indisponível. Tente novamente mais tarde.',
      );
    }
  }

  // Development fallback only. Production Pages should have D1 and the HMAC secret bound.
  const clientKey = `${category}:${clientAddress ?? (localRequest ? 'local-development' : 'missing-client-address')}`;
  const current = localBuckets.get(clientKey);
  if (!current || current.window !== window) localBuckets.set(clientKey, { window, count: 1 });
  else if (current.count >= policy.limit)
    return rateError(
      429,
      'Limite temporário de consultas atingido. Tente novamente em instantes.',
      retryAfter,
    );
  else current.count += 1;
  while (localBuckets.size > MAX_LOCAL_BUCKETS)
    localBuckets.delete(localBuckets.keys().next().value!);
  return null;
}

export function addRateLimitCors(response: Response, request: Request): Response {
  const origin = request.headers.get('Origin');
  if (!origin) return response;
  const allowed =
    origin === new URL(request.url).origin ||
    [
      'http://localhost:8081',
      'http://127.0.0.1:8081',
      'http://localhost:19006',
      'http://127.0.0.1:19006',
    ].includes(origin);
  if (!allowed) return response;
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function isAllowedApiRequest(request: Request): boolean {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return false;
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return (
    origin === new URL(request.url).origin ||
    [
      'http://localhost:8081',
      'http://127.0.0.1:8081',
      'http://localhost:19006',
      'http://127.0.0.1:19006',
    ].includes(origin)
  );
}

async function hashClient(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function rateError(status: number, error: string, retryAfter?: number): Response {
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
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Origin-Agent-Cluster': '?1',
  });
  if (retryAfter) headers.set('Retry-After', String(retryAfter));
  return new Response(
    JSON.stringify({
      error,
      ...(status === 429 ? { code: 'rate_limit_exceeded' } : { code: 'rate_limit_unavailable' }),
    }),
    { status, headers },
  );
}
