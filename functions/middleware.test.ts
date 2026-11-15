import { describe, expect, it } from 'vitest';
import { enforceApiRateLimit, isAllowedApiRequest } from './_middleware';

describe('proteções de borda da API', () => {
  it('permite somente origens próprias e de desenvolvimento explicitamente autorizadas', () => {
    expect(
      isAllowedApiRequest(
        new Request('https://calm.example/api/research', {
          headers: { Origin: 'https://calm.example' },
        }),
      ),
    ).toBe(true);
    expect(
      isAllowedApiRequest(
        new Request('https://calm.example/api/research', {
          headers: { Origin: 'https://attacker.example' },
        }),
      ),
    ).toBe(false);
    expect(
      isAllowedApiRequest(
        new Request('https://calm.example/api/research', {
          headers: { 'Sec-Fetch-Site': 'cross-site' },
        }),
      ),
    ).toBe(false);
    expect(isAllowedApiRequest(new Request('https://calm.example/api/research'))).toBe(true);
  });

  it('aplica limite local por categoria e informa o intervalo de nova tentativa', async () => {
    const request = new Request('http://localhost/api/research', {
      headers: { 'CF-Connecting-IP': '198.51.100.74' },
    });
    let last: Response | null = null;
    for (let count = 0; count < 21; count += 1)
      last = await enforceApiRateLimit(request, {}, 'research');
    expect(last?.status).toBe(429);
    expect(last?.headers.get('Retry-After')).toBeTruthy();
    expect(await last?.json()).toMatchObject({ code: 'rate_limit_exceeded' });
  });

  it('falha fechado quando D1 e segredo estão parcialmente configurados', async () => {
    const db = {
      prepare: () => ({ bind: () => ({ first: async () => null, run: async () => ({}) }) }),
    };
    const response = await enforceApiRateLimit(
      new Request('https://calm.example/api/research', {
        headers: { 'CF-Connecting-IP': '198.51.100.12' },
      }),
      { DB: db },
      'research',
    );
    expect(response?.status).toBe(503);
    expect(response?.headers.get('Cache-Control')).toBe('no-store');
  });
});
