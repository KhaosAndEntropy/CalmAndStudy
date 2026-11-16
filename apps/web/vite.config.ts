import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleResearchRequest } from '../../packages/research/src/index.ts';

const localResearchApi = {
  name: 'calmandstudy-local-research-api',
  configureServer(server: import('vite').ViteDevServer) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url?.startsWith('/api/research') && !request.url?.startsWith('/api/links/check'))
        return next();
      try {
        const headers = new Headers();
        if (typeof request.headers.origin === 'string')
          headers.set('Origin', request.headers.origin);
        const apiResponse = await handleResearchRequest(
          new Request(new URL(request.url, 'http://localhost'), {
            method: request.method ?? 'GET',
            headers,
          }),
          { openAlexApiKey: process.env.OPENALEX_API_KEY },
        );
        response.statusCode = apiResponse.status;
        apiResponse.headers.forEach((value, key) => response.setHeader(key, value));
        response.end(await apiResponse.text());
      } catch {
        response.statusCode = 502;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.end(JSON.stringify({ error: 'Falha ao consultar as fontes públicas.' }));
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), localResearchApi],
  server: {
    // HMR is disabled for this hardened local preview; CSS imports still use
    // Vite-injected <style> elements, so the dev-only CSP must allow inline styles.
    // Production headers remain separately configured and do not inherit this.
    hmr: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy':
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; media-src 'self'; manifest-src 'self'; worker-src 'self'; connect-src 'self'; upgrade-insecure-requests",
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'X-DNS-Prefetch-Control': 'off',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Origin-Agent-Cluster': '?1',
    },
  },
});
