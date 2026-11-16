# Guia técnico do Estude com Calma Brasil

Este guia explica como o projeto funciona, onde procurar cada parte e como aprender a contribuir. Ele descreve a arquitetura atual do repositório; detalhes operacionais e políticas podem mudar. Consulte os arquivos ligados ao longo do texto antes de alterar configurações de produção.

## 1. O que é o projeto

O Estude com Calma Brasil é uma aplicação gratuita de aprendizagem, criada no Brasil por Ednaldo Santos e aberta a contribuições de desenvolvedores brasileiros e de outras pessoas. Reúne artigos, trilhas, tutoriais, exercícios, busca de fontes públicas e um Modo escolar demonstrativo alinhado à BNCC.

O projeto é uma aplicação web responsiva instalável como PWA, não um aplicativo móvel nativo. O catálogo editorial é versionado no Git. Os modos Estudo calmo e Modo aventura apresentam os mesmos temas e critérios editoriais em ritmos diferentes. O Modo escolar organiza uma amostra limitada de habilidades; não é uma plataforma oficial do MEC e não substitui escola, matrícula, professor ou certificação.

Princípios de produto, decisões do criador e escolhas técnicas revisáveis estão separados em [decisões e evolução](DECISOES.md). Código aceito usa MIT; textos originais de aprendizagem usam CC BY 4.0. Conteúdo de terceiros conserva seus próprios créditos e termos.

## 2. Mapa do repositório

```text
apps/web/                 Aplicação React, Vite, PWA e estilos
  src/App.tsx             Composição e navegação de alto nível
  src/features/           Funcionalidades organizadas por domínio
  src/shared/              Hooks e componentes reutilizados
  public/                  Ícones, imagens e arquivos estáticos
packages/content/         Catálogo e contratos de conteúdo educativo
packages/research/        Busca e validação de referências públicas
functions/                Cloudflare Pages Functions e migrações D1
  api/                     Endpoints HTTP
  migrations/              Esquema versionado do banco D1
docs/                     Guias técnicos, editoriais e operacionais
.github/workflows/         CI, segurança e atualização de dependências
Dockerfile                Builds locais Pages e produção em estágios separados
compose.yaml               Ambiente local isolado com Pages e D1
wrangler.toml             Configuração de Pages/D1 para desenvolvimento local
```

Os pacotes usam nomes internos `@calmandstudy/*`, mesmo que a marca pública seja Estude com Calma Brasil. O workspace é definido em `pnpm-workspace.yaml` e o Turbo coordena tarefas entre pacotes. Regras detalhadas de dependência ficam em [organização do monorepo](../ORGANIZACAO_DO_MONOREPO.md).

## 3. Ferramentas e inicialização

Requisitos: Git, Node.js 22.13 ou superior, Corepack e pnpm 10. O repositório trava a versão do pnpm no `package.json` e das dependências no `pnpm-lock.yaml`.

```sh
git clone https://github.com/KhaosAndEntropy/EstudeComCalmaBrasil.git
cd EstudeComCalmaBrasil
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abra <http://localhost:4173>. O início básico não precisa de conta Cloudflare, banco remoto ou chave de API. Busca por fontes externas precisa de conexão com a internet. `OPENALEX_API_KEY` é opcional e serve para a integração de pesquisa; configure-a somente no `.env` local ou como secret no servidor. Nunca use `VITE_*` para segredos: variáveis desse tipo podem ser incorporadas ao bundle público.

Para simular Pages Functions e D1 locais, use Docker Desktop e rode `docker compose up --build` (o arquivo é `compose.yaml`). Essa opção oferece rotas backend e banco local usados pelo ambiente Pages. Os dados ficam no volume Docker `calmandstudy_data`. Para removê-los deliberadamente, `docker compose down -v` apaga o volume local.

Guia passo a passo: [rodar localmente](../RODAR_LOCALMENTE.md). Para publicar um fork, use [publicação Cloudflare](PUBLICAR.md) e configure recursos próprios.

## 4. Como a aplicação é montada

`apps/web/src/main.tsx` monta o React, a fronteira global de erro e os estilos compartilhados. `App.tsx` organiza navegação e estado de alto nível. Funcionalidades maiores são carregadas sob demanda quando apropriado e mantidas em `features/`, por exemplo leitor, trilhas, pesquisa, preferências, sugestões, comunidade e Modo escolar. Componentes e hooks que servem a mais de uma área ficam em `shared/`.

Vite atende o desenvolvimento e gera o bundle estático de produção. O pacote `@calmandstudy/content` é compartilhado pela aplicação e pelas funções que precisam validar IDs do catálogo. `@calmandstudy/research` concentra integrações com catálogos públicos e handlers reutilizados pelo middleware local e pelo backend.

O estado de navegação vive em React. Preferências, itens salvos, progresso e alguns dados locais usam `localStorage` pelo hook `apps/web/src/shared/hooks/useStoredState.ts`; os valores persistidos são entrada não confiável e precisam de validação. Não há conta obrigatória nem sincronização de favoritos/progresso entre dispositivos.

## 5. Conteúdo e domínio educativo

O catálogo editorial começa em `packages/content/src/index.ts` e seus módulos em `packages/content/src/`. Principais arquivos:

- `types.ts`: contratos TypeScript de artigos, exercícios e materiais relacionados.
- `topics/`: textos e metadados dos artigos, organizados por assunto.
- `fields.ts`: taxonomia de áreas para navegação; uma área pode ainda não ter artigo.
- `study-paths.ts`: trilhas e suas relações de navegação.
- `recommendations.ts`: sugestões editoriais entre artigos.
- `tutorials.ts` e `assessments.ts`: tutoriais e builders de exercícios/provas.
- `expanded.ts`: seções de aprofundamento associadas a artigos.
- `editorial.ts`: contratos e validações do registro editorial.
- `submissions.ts`: validação compartilhada de dados de sugestões.

O conteúdo é versionado: pesquisa de referências e envios de usuários não publicam artigos. Sugestões entram em fila de revisão humana. As integrações ajudam a descobrir documentos e verificar disponibilidade; elas não provam que uma afirmação está correta, que as fontes são independentes ou que há permissão para republicar.

### Modo escolar e relações BNCC

`apps/web/src/features/school/school-curriculum.ts` descreve filtros de etapa/ano/componente, três habilidades demonstrativas, atividades originais e relações editoriais entre elas. `SchoolModePage.tsx` apresenta filtros, percursos e três visualizações de relações:

- **Árvore:** mostra a hierarquia curricular cadastrada (etapa, ano, componente/área e habilidades presentes na amostra).
- **Sequência:** ordena exemplos segundo uma proposta editorial para estudo.
- **Grafo:** permite explorar ligações sugeridas e abrir o percurso da habilidade selecionada.

Apenas a hierarquia cadastrada na árvore representa a estrutura curricular usada no recorte. Sequência e grafo são propostas pedagógicas do projeto, não pré-requisitos oficiais nem ordem obrigatória da BNCC. A cobertura é parcial; confira [o escopo e as fontes do Modo escolar](MODO_ESCOLAR.md) antes de ampliar dados.

## 6. Servidor, endpoints e dados

Em produção, Cloudflare Pages serve os arquivos estáticos e executa as Pages Functions do diretório `functions/`. D1 é o banco usado por funções específicas. Localmente, Wrangler pode simular Pages/D1; `compose.yaml` prepara essa experiência. `wrangler.toml` contém valores fictícios locais e não deve ser tratado como configuração de produção.

| Rota               | Método / responsabilidade                   | Implementação                                                  |
| ------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| `/api/research`    | Pesquisa registros bibliográficos públicos  | `functions/api/research.ts` e `packages/research/src/index.ts` |
| `/api/links/check` | Verifica links HTTPS em domínios permitidos | `functions/api/links/check.ts`                                 |
| `/api/submissions` | Recebe sugestões validadas para revisão     | `functions/api/submissions.ts`                                 |
| `/api/engagement`  | Contabiliza leituras e curtidas agregadas   | `functions/api/engagement.ts`                                  |

`functions/_middleware.ts` aplica verificação de origem e limites de chamadas. `functions/migrations/0001_submissions.sql` estrutura fila de envios/controle de uso; `0002_content_engagement.sql` cria tabelas de leitura e curtida. Migrações devem ser aditivas, revisadas e aplicadas primeiro em ambiente de teste.

D1 não é CMS: artigos não são inseridos nele e uma sugestão não altera o catálogo. Contadores usam um identificador local pseudônimo assinado no servidor e guardam hash, não autenticação de pessoa. Eles limitam duplicidade por navegador, mas não provam que cada navegador seja uma pessoa.

Integrações bibliográficas estão em `packages/research/src/index.ts`. Entre os catálogos consultados estão OpenAlex, Crossref, OpenAIRE, Europe PMC e fontes institucionais NASA/USGS conforme a área. Há verificações e limites para evitar responder indiscriminadamente a URLs externas; não transforme isso em um proxy aberto. Critérios e limites são descritos em [arquitetura atual](../ARQUITETURA_ATUAL.md).

## 7. Segurança e privacidade

- Segredos ficam no ambiente do backend, nunca no JavaScript do navegador, no Git ou em logs.
- APIs validam origem, método, formato, tamanho e dados. Validação visual no frontend não substitui validação no servidor.
- `_middleware.ts` faz rate limit distribuído com D1 e chave HMAC quando bindings de produção estão configurados; a implementação local possui fallback de desenvolvimento.
- Sugestões têm tamanho e cota limitados. O backend salva em fila privada; a publicação depende de revisão.
- Engajamento valida tipos e IDs contra o catálogo e limita o corpo das requisições.
- Cabeçalhos de segurança estão definidos para Pages (arquivos estáticos), handlers e servidor Docker, pois `_headers` sozinho não cobre respostas de Functions.
- Valores em `localStorage` podem ser alterados pelo usuário e não devem ser considerados autoridade ou conteúdo confiável.
- Relatos de vulnerabilidade não devem incluir dados pessoais ou segredos em issue pública.

Docker tem estágios separados de dependências, build, Pages local e runtime de produção. O serviço Compose é de desenvolvimento; a imagem de produção é menor, contém artefatos compilados, remove ferramentas de build e executa como usuário sem privilégios. CI atualiza a base na construção e verifica a imagem com Trivy. Isso reduz riscos, mas não substitui atualização periódica de dependências e imagens.

Leia a [auditoria de segurança de 16/11/2026](AUDITORIA_SEGURANCA_2026-11-16.md) para o resultado registrado naquela data e [segurança para desenvolvimento](../SEGURANCA.md) para práticas do dia a dia. Uma auditoria é um retrato temporal, não uma garantia permanente.

## 8. Acessibilidade e responsividade

Mudanças de interface devem funcionar em celular, tablet e desktop, com zoom, teclado e leitor de tela. Preserve rótulos visíveis e associações de formulário, foco perceptível, ordem lógica de navegação, estados anunciados quando necessário e contraste legível. Não use apenas cor para transmitir erro, seleção ou progresso. Em gráficos e mapas, ofereça explicação textual e controles que também funcionem por teclado; em telas estreitas, prefira rolagem local ou cartões refluídos a cortar conteúdo.

Estilos de base estão em `apps/web/src/*.css`; estilos específicos vivem junto às features. Faça mudanças estreitas e confira os breakpoints existentes antes de criar outro sistema visual. `prefers-reduced-motion` e preferências de aparência devem ser preservados.

## 9. Qualidade, testes e integração contínua

Os comandos principais na raiz:

```sh
pnpm format:check # Prettier sem modificar arquivos
pnpm typecheck    # TypeScript coordenado pelo Turbo
pnpm test         # Vitest nos pacotes e aplicação
pnpm build        # build de produção coordenado pelo Turbo
```

Para editar formatação automaticamente, `pnpm format`. Antes do PR, rode os comandos aplicáveis e descreva o que não pôde executar. Testes unitários e de componentes ficam junto dos módulos com sufixo `.test.ts` ou `.test.tsx`; há testes também para endpoints. Ao mudar uma regra, escreva testes para casos válidos, inválidos e limites importantes.

`.github/workflows/ci.yml` roda qualidade, auditoria de dependências, análise Semgrep, build Docker/Trivy e verificações passivas selecionadas. O workflow de produção não deve ser contornado; confira os checks no PR e resolva falhas antes do merge. Relatórios externos podem não estar disponíveis localmente.

## 10. Contribuir de forma segura

1. Leia [CONTRIBUTING.md](../../CONTRIBUTING.md) e procure uma issue existente.
2. Para mudanças grandes, apresente a proposta em uma issue antes de investir em implementação.
3. Faça fork, crie uma branch a partir de `main` e mantenha o escopo pequeno.
4. Inclua contexto, comportamento esperado, evidência visual quando útil e passos para validar.
5. Para mudanças educativas, cite fontes, licença e limites; não copie texto protegido.
6. Aguarde revisão humana. Um PR não implica publicação automática.

Este é um projeto brasileiro criado por uma pessoa e preparado para receber contribuições de outros desenvolvedores brasileiros. Código, documentação, acessibilidade, segurança, traduções e conteúdo educativo podem ser propostos. Respeite as licenças, evite credenciais e dados pessoais, e confira o nome/e-mail Git antes de publicar commits: o histórico é público.

## 11. Roteiro sugerido para aprender o código

1. Leia `README.md`, `CONTRIBUTING.md` e este guia para entender propósito e fluxo.
2. Rode a aplicação e explore os modos; observe o que funciona sem internet.
3. Leia `apps/web/src/main.tsx` e depois `apps/web/src/App.tsx` para conhecer a composição.
4. Escolha uma feature em `apps/web/src/features/` e siga seus imports, estilos e testes.
5. Leia `packages/content/src/types.ts` e um módulo de `topics/` para entender o catálogo.
6. Acompanhe uma requisição: interface → `/api/...` → `functions/api/` → handler compartilhado ou D1.
7. Leia as migrações e testes do endpoint antes de alterar esquema ou validação.
8. Execute format, typecheck, testes e build; examine o diff antes de abrir o PR.

## Glossário curto

- **PWA:** site que pode ser instalado pelo navegador e usa recursos da plataforma web.
- **Vite:** servidor de desenvolvimento e ferramenta de build do frontend.
- **Pages Functions:** funções serverless executadas junto ao Cloudflare Pages.
- **D1:** banco SQL gerenciado pela Cloudflare, baseado em SQLite.
- **HMAC:** assinatura criptográfica usada aqui para gerar identificadores derivados sem guardar o endereço de rede em claro.
- **BNCC:** Base Nacional Comum Curricular; referência curricular oficial que não transforma as relações pedagógicas do projeto em regra oficial.
- **CI:** verificações automatizadas executadas para mudanças no GitHub.
- **PWA/produção:** o Docker local não é a hospedagem de produção do site; deployment web atual usa Cloudflare Pages.

## Leituras relacionadas

- [Arquitetura em mais detalhe](../ARQUITETURA_ATUAL.md)
- [Organização do monorepo](../ORGANIZACAO_DO_MONOREPO.md)
- [Fluxo editorial](../FLUXO_EDITORIAL.md)
- [Modo escolar e cobertura BNCC](MODO_ESCOLAR.md)
- [Acessibilidade](../ACESSIBILIDADE.md)
- [Auditoria de segurança](AUDITORIA_SEGURANCA_2026-11-16.md)
- [Índice da documentação](README.md)
