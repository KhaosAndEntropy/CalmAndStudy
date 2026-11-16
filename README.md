# Estude com Calma

Projeto gratuito de aprendizagem com artigos, trilhas, tutoriais e fontes abertas. Estudo calmo e Modo aventura usam o mesmo conteúdo e os mesmos critérios editoriais.

## Sobre o projeto

Criado no Brasil por Ednaldo Santos, o Estude com Calma é um projeto independente e aberto à colaboração de outros desenvolvedores brasileiros. Contribuições para código, documentação, acessibilidade, segurança e conteúdo educativo são bem-vindas; todas passam por revisão e seguem as licenças e os critérios editoriais do projeto.

## Rodar localmente

Requisitos: Node.js 22.13 ou superior e pnpm 10 (via Corepack).

Para contribuir a partir de um fork, faça fork do repositório no GitHub e clone o seu fork. Para apenas executar o projeto, clone o repositório diretamente:

```sh
git clone https://github.com/KhaosAndEntropy/CalmAndStudy.git
cd CalmAndStudy
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abra <http://localhost:4173>. A execução local não exige conta Cloudflare, banco remoto nem chaves. O Docker Compose é uma alternativa: `docker compose up --build`.

`OPENALEX_API_KEY` é opcional. Se precisar dela, configure-a no arquivo `.env` local; nunca a coloque no código ou em commits. Consulte [Rodar localmente](docs/RODAR_LOCALMENTE.md).

## Desenvolvimento

- `apps/web`: aplicação web e PWA.
- `packages/content`: artigos, áreas, trilhas, tutoriais e exercícios.
- `packages/research`: busca e referências públicas.
- `functions`: Pages Functions e migrações D1.
- `docs`: guias de desenvolvimento, arquitetura e publicação.

Antes de abrir um PR, rode `pnpm format:check`, `pnpm typecheck`, `pnpm test` e `pnpm build`. Veja [como contribuir](CONTRIBUTING.md).

## Licenças

O código usa [MIT](LICENSE). Os textos originais usam [CC BY 4.0](CONTENT-LICENSE.md). Materiais de terceiros mantêm seus próprios créditos e licenças.
