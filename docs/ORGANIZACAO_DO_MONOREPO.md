# Organização do monorepo

## Mapa de responsabilidades

```text
apps/web
  src/App.tsx                    composição da experiência web/PWA
  src/features/                  leitor, pesquisa, trilhas, tutoriais e preferências
  src/shared/                    componentes e hooks reutilizáveis
  src/shared/components/         componentes comuns, inclusive recuperação de erro

packages/content
  src/types.ts                   contratos de conteúdo
  src/topics/                    catálogo editorial organizado por assunto
  src/fields.ts                  taxonomia de áreas
  src/study-paths.ts             sequências de aprendizagem
  src/recommendations.ts         relações entre artigos
  src/tutorials.ts               roteiros práticos
  src/editorial.ts               validações editoriais

packages/research
  src/index.ts                   fontes públicas, filtros, verificação e API

functions/api/                   endpoints do Cloudflare Pages
functions/migrations/            migrações do D1
docs/                            documentação operacional e editorial
```

## Regras de dependência

1. `apps/web` pode depender de `packages/content` e `packages/research`.
2. Pacotes compartilhados não importam componentes da aplicação.
3. `functions/api/*` valida a requisição e chama os handlers compartilhados; integrações externas ficam em `packages/research`.
4. Preferências, salvos e progresso ficam no navegador; sugestões enviadas e engajamento agregado usam D1.
5. Pesquisa não publica artigos automaticamente; o catálogo só muda por revisão e alteração versionada.
6. Cada recurso deve validar dados na fronteira em que entram. O navegador valida para orientar; endpoints repetem a validação e nunca confiam no cliente.
7. Falhas esperadas devem produzir estado vazio, mensagem de recuperação ou tentativa novamente. Erros inesperados de renderização são contidos pela fronteira global, sem enviar dados do leitor a serviços externos.

## Tratamento de erros e armazenamento local

- Trate falhas de rede, indisponibilidade dos catálogos e armazenamento bloqueado como estados recuperáveis; mantenha mensagens voltadas à pessoa usuária e não exponha stack traces em produção.
- Ao ler `localStorage`, trate o conteúdo como entrada não confiável: confira tipo, tamanho e valores permitidos antes de usar. O progresso gamificado só deve aceitar IDs que existem no catálogo atual.
- Não salve credenciais, endereços de IP ou dados de formulários além do necessário. Os dados enviados à fila editorial são validados no backend e têm limite de tamanho.
- Evite capturar exceções sem contexto durante o desenvolvimento. Logs locais devem ser úteis, mas não incluir conteúdo pessoal; em produção, mostre um fallback simples e recuperável.

## Catálogo

O catálogo editorial está em `packages/content/src/topics/`. Use `topics.length` para mostrar a quantidade atual. `fields.ts` define áreas de navegação: uma área pode não ter artigo ainda. Recomendações e trilhas organizam a leitura sem bloquear o acesso direto.

## Comandos

- `pnpm dev`: inicia a aplicação web local.
- `pnpm typecheck`: confere os tipos.
- `pnpm test`: executa testes automatizados.
- `pnpm run build`: compila a versão de produção.
- `pnpm format` / `pnpm format:check`: formata ou confere o código.

O monorepo usa pnpm e Turbo para coordenar os pacotes. A única interface mantida é a web responsiva/PWA, também usada no celular.
