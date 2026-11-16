# Rodar localmente

## Requisitos

- Node.js 22.13 ou superior
- Corepack e pnpm 10
- Git

## Clonar e iniciar

```sh
git clone https://github.com/KhaosAndEntropy/CalmAndStudy.git
cd CalmAndStudy
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abra <http://localhost:4173>. Para iniciar a partir de um repositório já clonado, pule os dois primeiros comandos.

## Ambiente e segredos

O catálogo abre sem conta Cloudflare, banco remoto ou chaves. `OPENALEX_API_KEY` é opcional para aumentar a cota da OpenAlex. Se usar, guarde-a no `.env` local, que não é versionado. Não coloque chaves em código, commits, logs ou variáveis `VITE_*`: elas ficam públicas no navegador. O `.env.example` não contém credenciais; a chave opcional fica vazia.

## Docker (opcional)

Com Docker Desktop iniciado, rode `docker compose up --build` e abra <http://localhost:4173>. O Docker também inicia Pages Functions e um D1 local. Para encerrar, pressione `Ctrl+C`; para remover o volume de dados local, rode `docker compose down -v`.

## Verificações antes de um PR

```sh
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

Para publicar um fork, configure seus próprios recursos e segredos no Cloudflare. Consulte [guia de publicação](GUIA_EXECUCAO_PUBLICACAO.md) e [segurança](SEGURANCA.md).
