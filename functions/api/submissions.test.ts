import { describe, expect, it } from 'vitest';
import { onRequest } from './submissions';

const id = '123e4567-e89b-42d3-a456-426614174000';
const secret = 'a'.repeat(40);
const topicPayload = {
  title: 'Como se formam os fósseis?',
  field: 'Paleontologia',
  reason: 'Gostaria de compreender o processo de fossilização.',
  editorialPolicyAccepted: true,
  sources: [
    { publisher: 'Museu A', url: 'https://museum-a.example/fossils' },
    { publisher: 'Universidade B', url: 'https://university-b.example/fossils' },
    { publisher: 'Instituto C', url: 'https://institute-c.example/fossils' },
  ],
};

function fakeDb(
  options: { duplicate?: boolean; quota?: number | null; failInsert?: boolean } = {},
) {
  const queries: { sql: string; values: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      let values: unknown[] = [];
      const statement = {
        bind(...bound: unknown[]) {
          values = bound;
          return statement;
        },
        async first<T>() {
          queries.push({ sql, values });
          if (sql.includes('SELECT id FROM submissions'))
            return (options.duplicate ? { id } : null) as T | null;
          if (sql.includes('RETURNING submission_count'))
            return (
              options.quota === null ? null : { submission_count: options.quota ?? 1 }
            ) as T | null;
          return null;
        },
        async run() {
          queries.push({ sql, values });
          if (options.failInsert && sql.includes('INSERT INTO submissions'))
            throw new Error('db failure');
          return { success: true, meta: { changes: 1 } };
        },
      };
      return statement;
    },
  };
  return { db, queries };
}

async function submit(
  payload: unknown,
  options: Parameters<typeof fakeDb>[0] = {},
  headers: Record<string, string> = {},
) {
  const { db, queries } = fakeDb(options);
  const request = new Request('https://calm.example/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.8', ...headers },
    body: JSON.stringify(payload),
  });
  const response = await onRequest({ request, env: { DB: db, SUBMISSION_HASH_SECRET: secret } });
  return { response, body: (await response.json()) as Record<string, unknown>, queries };
}

describe('POST /api/submissions', () => {
  it('exige HTTPS, três domínios independentes e aceite da política editorial', async () => {
    const noPolicy = await submit({
      id,
      kind: 'topic',
      payload: { ...topicPayload, editorialPolicyAccepted: false },
    });
    expect(noPolicy.response.status).toBe(400);
    const repeatedHost = await submit({
      id,
      kind: 'topic',
      payload: {
        ...topicPayload,
        sources: topicPayload.sources.map(source => ({
          ...source,
          url: 'https://same.example/source',
        })),
      },
    });
    expect(repeatedHost.response.status).toBe(400);
    const httpSource = await submit({
      id,
      kind: 'topic',
      payload: {
        ...topicPayload,
        sources: [
          { ...topicPayload.sources[0], url: 'http://museum-a.example' },
          ...topicPayload.sources.slice(1),
        ],
      },
    });
    expect(httpSource.response.status).toBe(400);
  });

  it('registra submissão válida com status pendente, origem CORS e dados sanitizados', async () => {
    const result = await submit(
      { id, kind: 'topic', payload: { ...topicPayload, ignored: '<script>alert(1)</script>' } },
      {},
      { Origin: 'https://calm.example' },
    );
    expect(result.response.status).toBe(201);
    expect(result.body).toMatchObject({ ok: true, id, status: 'pending', remainingToday: 4 });
    expect(result.response.headers.get('Access-Control-Allow-Origin')).toBe('https://calm.example');
    const insert = result.queries.find(query => query.sql.includes('INSERT INTO submissions'));
    expect(insert).toBeDefined();
    expect(JSON.stringify(insert?.values)).not.toContain('ignored');
    expect(result.response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('recusa payload inválido, origem externa e método diferente de POST', async () => {
    const invalid = await submit({ id: 'bad', kind: 'topic', payload: topicPayload });
    expect(invalid.response.status).toBe(400);
    const external = await submit(
      { id, kind: 'topic', payload: topicPayload },
      {},
      { Origin: 'https://evil.example' },
    );
    expect(external.response.status).toBe(403);
    const method = await onRequest({
      request: new Request('https://calm.example/api/submissions'),
      env: {},
    });
    expect(method.status).toBe(405);
    expect(method.headers.get('Allow')).toContain('POST');
  });

  it('responde 429 no limite e sinaliza quando a infraestrutura não está configurada', async () => {
    const limited = await submit({ id, kind: 'topic', payload: topicPayload }, { quota: null });
    expect(limited.response.status).toBe(429);
    expect(limited.body.code).toBe('daily_limit_reached');
    expect(limited.response.headers.get('Retry-After')).toBeTruthy();
    const unavailable = await onRequest({
      request: new Request('https://calm.example/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }),
      env: {},
    });
    expect(unavailable.status).toBe(503);
  });

  it('torna idempotente para a mesma submissão e libera cota se a gravação falhar', async () => {
    const duplicate = await submit(
      { id, kind: 'topic', payload: topicPayload },
      { duplicate: true },
    );
    expect(duplicate.response.status).toBe(200);
    expect(duplicate.body.duplicate).toBe(true);
    expect(duplicate.queries.some(query => query.sql.includes('RETURNING submission_count'))).toBe(
      false,
    );

    const failed = await submit({ id, kind: 'topic', payload: topicPayload }, { failInsert: true });
    expect(failed.response.status).toBe(503);
    expect(
      failed.queries.some(query =>
        query.sql.includes('submission_count = MAX(0, submission_count - 1)'),
      ),
    ).toBe(true);
  });
});
