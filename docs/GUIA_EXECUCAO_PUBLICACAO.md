# Executar e publicar o Estude com Calma

## Rodar localmente

Requisitos: Node.js 22 ou superior e pnpm 10. Na raiz do monorepo:

```sh
pnpm install
pnpm dev
```

Abra `http://localhost:4173`. O Vite serve o site e encaminha `/api/research` e `/api/links/check` para os handlers locais. As buscas precisam de internet; o catálogo e as ilustrações locais continuam disponíveis sem conexão.

## Usar no celular

A versão mobile é o site responsivo instalável como PWA. Abra o endereço `.pages.dev` no navegador e escolha **Instalar o Estude com Calma** ou **Adicionar à tela inicial**. Não precisa de Expo Go nem de um pacote nativo separado.

## Publicar no Cloudflare Pages

1. Conecte o repositório Git ao projeto Pages.
2. Mantenha a raiz do monorepo como diretório raiz para que o Pages encontre `functions/`.
3. Configure:

   | Campo                  | Valor                                              |
   | ---------------------- | -------------------------------------------------- |
   | Build command          | `pnpm install --frozen-lockfile && pnpm run build` |
   | Build output directory | `apps/web/dist`                                    |
   | Functions directory    | `functions/` na raiz                               |

4. Configure Node.js 22 ou superior no ambiente de build.
5. Depois do deploy, confira o site em `https://NOME-DO-PROJETO.pages.dev` e a rota `/api/research?q=astronomia&field=Astronomia`.

Não é necessário registrar domínio próprio. O Cloudflare Pages recebe os commits por integração Git; o GitHub Actions executa verificações, mas não faz o deploy.

## Configuração do backend

Para sugestões, limites e estatísticas, crie o D1, aplique `functions/migrations/0001_submissions.sql` e `0002_content_engagement.sql`, configure o binding `DB` e o secret `SUBMISSION_HASH_SECRET`. O secret opcional `OPENALEX_API_KEY` aumenta a cota gratuita da pesquisa. Aplique secrets no ambiente de produção do Pages e faça novo deploy.

Nunca grave chaves no código, no frontend ou no repositório.

## Verificações locais

- `pnpm format:check`: verifica formatação.
- `pnpm typecheck`: verifica os tipos nos workspaces.
- `pnpm test`: executa os testes.
- `pnpm run build`: gera o site para produção.
