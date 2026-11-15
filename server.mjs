import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleResearchRequest } from './research-api.mjs';

const port = Number(process.env.PORT) || 4173;
const webRoot = resolve(fileURLToPath(new URL('./dist/', import.meta.url)));
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy':
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self'; font-src 'self' data:; img-src 'self' data:; media-src 'self'; manifest-src 'self'; worker-src 'self'; connect-src 'self'; upgrade-insecure-requests",
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Origin-Agent-Cluster': '?1',
};

function applySecurityHeaders(response) {
  for (const [name, value] of Object.entries(securityHeaders)) response.setHeader(name, value);
}

async function serveResearch(request, response, requestUrl) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string' && name.toLowerCase() !== 'cf-connecting-ip')
      headers.set(name, value);
  }
  headers.set('CF-Connecting-IP', request.socket.remoteAddress ?? 'local-client');

  const host = request.headers.host ?? `localhost:${port}`;
  const apiRequest = new Request(new URL(requestUrl, `http://${host}`), {
    method: request.method,
    headers,
  });
  const apiResponse = await handleResearchRequest(apiRequest, {
    openAlexApiKey: process.env.OPENALEX_API_KEY,
  });

  response.statusCode = apiResponse.status;
  apiResponse.headers.forEach((value, name) => response.setHeader(name, value));
  response.end(
    request.method === 'HEAD' ? undefined : Buffer.from(await apiResponse.arrayBuffer()),
  );
}

async function serveStatic(request, response, requestUrl) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' }).end();
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(new URL(requestUrl, 'http://local').pathname);
  } catch {
    response.writeHead(400, { 'Cache-Control': 'no-store' }).end();
    return;
  }

  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.slice(1);
  const filePath = resolve(webRoot, relativePath);
  if (filePath !== webRoot && !filePath.startsWith(`${webRoot}${sep}`)) {
    response.writeHead(404, { 'Cache-Control': 'no-store' }).end();
    return;
  }

  let fileInfo;
  try {
    fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) throw new Error('Not a file');
  } catch {
    response.writeHead(404, { 'Cache-Control': 'no-store' }).end();
    return;
  }

  applySecurityHeaders(response);
  response.setHeader(
    'Content-Type',
    mimeTypes.get(extname(filePath)) ?? 'application/octet-stream',
  );
  response.setHeader(
    'Cache-Control',
    decodedPath.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-store',
  );
  response.setHeader('Content-Length', String(fileInfo.size));
  if (request.method === 'HEAD') {
    response.writeHead(200).end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

createServer((request, response) => {
  const requestUrl = request.url ?? '/';
  if (requestUrl.length > 12_000) {
    response.writeHead(414, { 'Cache-Control': 'no-store' }).end();
    return;
  }

  const pathname = requestUrl.split('?', 1)[0];
  if (pathname === '/api/research' || pathname === '/api/links/check') {
    serveResearch(request, response, requestUrl).catch(() => {
      response.writeHead(502, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(JSON.stringify({ error: 'Falha ao consultar as fontes públicas.' }));
    });
    return;
  }

  serveStatic(request, response, requestUrl).catch(() => {
    response.writeHead(500, { 'Cache-Control': 'no-store' }).end();
  });
}).listen(port, '0.0.0.0');
