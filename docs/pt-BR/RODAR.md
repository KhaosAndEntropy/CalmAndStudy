# Rodar localmente

Requisitos: Git, Node.js 22.13 ou superior e pnpm 10 via Corepack.

```sh
git clone https://github.com/KhaosAndEntropy/CalmAndStudy.git
cd CalmAndStudy
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abra <http://localhost:4173>. Não são necessárias chaves ou conta Cloudflare para iniciar. `OPENALEX_API_KEY` é opcional; guarde-a apenas no `.env` local.

Veja o [guia completo para desenvolvimento local](../RODAR_LOCALMENTE.md).
