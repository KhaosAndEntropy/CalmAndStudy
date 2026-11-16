# Ejecutar localmente

Requisitos: Git, Node.js 22.13 o posterior y pnpm 10 mediante Corepack.

```sh
git clone https://github.com/KhaosAndEntropy/CalmAndStudy.git
cd CalmAndStudy
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abre <http://localhost:4173>. No necesitas claves ni una cuenta de Cloudflare para empezar. `OPENALEX_API_KEY` es opcional; guárdala solo en el archivo `.env` local.

Consulta la [guía completa de desarrollo local](../RODAR_LOCALMENTE.md).
