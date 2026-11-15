# Como organizei o projeto

Eu mantenho uma aplicação web responsiva instalável como PWA dentro de um monorepo pnpm. Não há aplicativo Expo separado.

```text
apps/web        interface React, Vite, PWA e recursos de navegação
packages/content catálogo versionado, relações editoriais, provas e tutoriais
packages/research adaptadores para fontes bibliográficas públicas
functions       API Cloudflare Pages e migrações D1
docs            guias, decisões e políticas
```

O navegador carrega o catálogo versionado do pacote `content`. A busca pública consulta os adaptadores em `research`, executados localmente pelo middleware Vite ou em produção por Pages Functions. D1 recebe sugestões e guarda contadores limitados; não é CMS e não publica artigos automaticamente. A OpenAlex e outros catálogos ajudam a localizar referências, mas a presença numa base não prova a verdade de uma afirmação.

Em produção, Cloudflare Pages serve a interface e as Pages Functions; D1 é uma dependência vinculada ao projeto. Localmente, Wrangler simula Pages e D1 em SQLite. O Docker Compose reúne esses serviços num comando e mantém os dados num volume local.

## Limites que eu declaro

- O catálogo atual ainda contém material legado que não passou integralmente pelo novo registro de evidências e revisão. A interface deve identificá-lo como pendente; percentuais ilustrativos não são probabilidades de verdade.
- Uma resposta HTTP válida, metadados bibliográficos ou uma licença aberta não provam que fontes sejam independentes nem que apoiem uma afirmação específica.
- Uma pessoa precisa revisar evidências e licenças antes da publicação. Sugestões de leitores nunca entram automaticamente no catálogo.
- Dados de favoritos e progresso ficam no navegador. As rotas de API recebem apenas os dados necessários para suas funções.

Para detalhes de rotas, variáveis e responsabilidades, consulte [arquitetura atual](../ARQUITETURA_ATUAL.md) e [segurança](../SEGURANCA.md).
