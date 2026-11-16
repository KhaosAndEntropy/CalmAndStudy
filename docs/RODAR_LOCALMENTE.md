# Rodar o Estude com Calma no computador

Este guia inicia a versão web responsiva do Estude com Calma. Ela também pode ser instalada como PWA pelo navegador; não é necessário instalar Expo.

## O que instalar

- Node.js 22 ou superior
- Corepack (incluído nas versões atuais do Node.js) e pnpm 10
- Git, caso ainda não tenha o código do repositório

Não é preciso configurar conta Cloudflare, banco D1 ou chave de IA para abrir o catálogo e usar a busca pública de referências. A chave `OPENALEX_API_KEY` é opcional e só melhora a cota de consulta da OpenAlex.

## Primeira execução

No PowerShell, dentro da pasta do projeto:

```powershell
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Abra <http://localhost:4173> no navegador. Para usar no celular conectado à mesma rede Wi-Fi, execute `pnpm dev -- --host 0.0.0.0` e abra no celular o endereço local do computador seguido de `:4173`.

## Rodar com Docker Compose

Com Docker Desktop aberto, na pasta raiz do repositório:

```powershell
docker compose up --build
```

Acesse <http://localhost:4173>. Esse modo usa o runtime local da Cloudflare Pages para executar também as Pages Functions e um banco D1 local (SQLite), com as migrações aplicadas automaticamente. Os dados ficam no volume Docker `calmandstudy_data`, então continuam lá após reiniciar o container. Nenhuma conta Cloudflare ou banco remoto é usado. Para parar, pressione `Ctrl+C`; em seguida, se quiser remover o container, execute:

```powershell
docker compose down
```

O Compose monta a aplicação web, as Pages Functions e o D1 local. A chave `OPENALEX_API_KEY` é opcional: crie um arquivo `.env` na raiz com `OPENALEX_API_KEY=sua-chave`. Não compartilhe esse arquivo. Se a porta 4173 estiver ocupada, defina `CALMANDSTUDY_DOCKER_PORT=4174` no mesmo `.env` e abra <http://localhost:4174>.

### Como a imagem é montada

O [Dockerfile](../Dockerfile) tem três estágios. `build` instala dependências fixadas e compila o site. `pages-local` mantém as ferramentas de desenvolvimento para executar o Wrangler Pages local e o D1 em SQLite; o volume persistente guarda esse banco. `runtime` é a imagem enxuta para servir o site e a busca local, sem ferramentas de build. Ambos executam como usuário sem privilégios, têm healthcheck, e o Compose usa filesystem somente leitura, remove capabilities, bloqueia a elevação de privilégios e publica a porta apenas em `127.0.0.1`.

O Compose baixa a versão atual da imagem-base (`pull: true`). As dependências JavaScript continuam fixadas pelo `pnpm-lock.yaml` e são conferidas com `pnpm audit` no CI; elas não são atualizadas automaticamente para versões arbitrárias, o que preserva builds reproduzíveis. O workflow também constrói e analisa a imagem final com Trivy. Vulnerabilidades encontradas interrompem o CI e precisam ser corrigidas ou avaliadas antes do merge.

Na varredura completa executada em 14/11/2026 na imagem local `calmandstudy:local`, o Trivy 0.76.2 encontrou zero vulnerabilidades conhecidas nos pacotes do sistema e zero arquivos de dependências JavaScript no estágio final. Essa leitura vale para aquela imagem e para a base de vulnerabilidades disponível naquele momento; novas vulnerabilidades podem ser publicadas depois. O Docker Compose aqui é para uso local: não publica o site na internet nem substitui Cloudflare Pages, D1, domínio, segredos ou configuração de hospedagem.

## Verificações antes de publicar

```powershell
pnpm typecheck
pnpm test
pnpm build
```

## Pausar temporariamente o site público

Para ativar a página de manutenção, defina `VITE_MAINTENANCE_MODE=true` nas variáveis de build do Cloudflare Pages. Para testar localmente, crie `apps/web/.env.local` com essa mesma linha. Remova a variável ou defina `false` para voltar ao site. Gere e publique um novo build após alterar a configuração. O conteúdo e as funções continuam no repositório enquanto a tela de manutenção aparece.

## Dados locais e dados publicados

O D1 do Compose é um SQLite local isolado; não sincroniza dados com Cloudflare. O secret usado localmente é apenas uma configuração de desenvolvimento e não deve ser reutilizado em produção. No Cloudflare, sugestões, curtidas e estatísticas compartilhadas usam o D1 remoto ligado como `DB`, migrações de `functions/migrations` aplicadas e o secret `SUBMISSION_HASH_SECRET` configurado no ambiente.

As consultas de pesquisa usam provedores públicos. Sem a chave opcional da OpenAlex, os demais provedores continuam disponíveis dentro dos limites e critérios de acesso aberto definidos pelo aplicativo.
