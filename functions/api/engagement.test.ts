import { describe, expect, it } from 'vitest';
import { onRequest } from './engagement';
import { topics } from '../../packages/content/src/index';

const visitorId = '123e4567-e89b-42d3-a456-426614174000';
const secret = 'b'.repeat(40);
const articleId = topics[0]!.id;

function mockDb(
  options: {
    readRows?: unknown[];
    likeRows?: unknown[];
    mineRows?: unknown[];
    fail?: boolean;
  } = {},
) {
  const calls: { sql: string; values: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      let values: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          values = args;
          return statement;
        },
        async all<T>() {
          calls.push({ sql, values });
          if (options.fail) throw new Error('database unavailable');
          if (sql.includes('FROM content_reads'))
            return { results: (options.readRows ?? []) as T[] };
          if (sql.includes('FROM content_likes WHERE visitor_hash'))
            return { results: (options.mineRows ?? []) as T[] };
          if (sql.includes('FROM content_likes'))
            return { results: (options.likeRows ?? []) as T[] };
          return { results: [] as T[] };
        },
        async run() {
          calls.push({ sql, values });
          if (options.fail) throw new Error('database unavailable');
          return { success: true, meta: { changes: 1 } };
        },
      };
      return statement;
    },
  };
  return { db, calls };
}

describe('/api/engagement', () => {
  it('agrega leituras, curtidas e estado do visitante sem expor identificador', async () => {
    const { db, calls } = mockDb({
      readRows: [{ content_type: 'article', content_id: articleId, total: 12 }],
      likeRows: [{ content_type: 'article', content_id: articleId, total: 4 }],
      mineRows: [{ content_type: 'article', content_id: articleId }],
    });
    const request = new Request(`https://calm.example/api/engagement?visitor=${visitorId}`, {
      headers: { Origin: 'https://calm.example' },
    });
    const response = await onRequest({ request, env: { DB: db, SUBMISSION_HASH_SECRET: secret } });
    const body = (await response.json()) as {
      items: { id: string; reads: number; likes: number; liked: boolean }[];
    };
    expect(body.items).toEqual([
      { type: 'article', id: articleId, reads: 12, likes: 4, liked: true },
    ]);
    expect(JSON.stringify(body)).not.toContain(visitorId);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://calm.example');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(calls[2]?.values[0]).not.toBe(visitorId);
  });

  it('aceita apenas ações válidas para itens presentes no catálogo', async () => {
    const valid = {
      visitorId,
      contentType: 'article',
      contentId: articleId,
      action: 'like',
      liked: true,
    };
    const { db, calls } = mockDb();
    const response = await onRequest({
      request: new Request('https://calm.example/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valid),
      }),
      env: { DB: db, SUBMISSION_HASH_SECRET: secret },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, changed: true });
    expect(calls[0]?.sql).toContain('INSERT OR IGNORE INTO content_likes');
    expect(calls[0]?.values[2]).not.toBe(visitorId);

    const invalid = await onRequest({
      request: new Request('https://calm.example/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...valid, contentId: 'not-in-catalog' }),
      }),
      env: { DB: db, SUBMISSION_HASH_SECRET: secret },
    });
    expect(invalid.status).toBe(400);
  });

  it('recusa origem cruzada, corpo acima do limite e retorna fallback controlado para falhas D1', async () => {
    const crossSite = await onRequest({
      request: new Request('https://calm.example/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
        body: JSON.stringify({
          visitorId,
          contentType: 'article',
          contentId: articleId,
          action: 'read',
        }),
      }),
      env: { DB: mockDb().db, SUBMISSION_HASH_SECRET: secret },
    });
    expect(crossSite.status).toBe(403);

    const oversized = await onRequest({
      request: new Request('https://calm.example/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...{ visitorId, contentType: 'article', contentId: articleId, action: 'read' },
          extra: 'x'.repeat(3000),
        }),
      }),
      env: { DB: mockDb().db, SUBMISSION_HASH_SECRET: secret },
    });
    expect(oversized.status).toBe(413);

    const failed = await onRequest({
      request: new Request('https://calm.example/api/engagement'),
      env: { DB: mockDb({ fail: true }).db, SUBMISSION_HASH_SECRET: secret },
    });
    expect(failed.status).toBe(503);
    expect(failed.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
