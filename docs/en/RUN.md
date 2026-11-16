# Run locally

Requirements: Git, Node.js 22.13 or newer, and pnpm 10 through Corepack.

```sh
git clone https://github.com/KhaosAndEntropy/CalmAndStudy.git
cd CalmAndStudy
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:4173>. No API key or Cloudflare account is needed to start. `OPENALEX_API_KEY` is optional; keep it in a local `.env` file only.

See the [full local development guide](../RODAR_LOCALMENTE.md).
