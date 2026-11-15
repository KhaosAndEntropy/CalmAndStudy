# Segurança da Calm & Study

Este documento descreve as proteções implementadas e o que ainda depende da configuração de hospedagem. Nenhuma aplicação pública fica imune a abuso, falhas de fornecedores ou vulnerabilidades futuras; revise esta lista antes de abrir novos endpoints.

## Proteções no código

- **Cabeçalhos da web e APIs:** Content Security Policy sem scripts nem estilos inline na versão publicada, bloqueio de frames, MIME sniffing, isolamento entre origens, HSTS e restrição de recursos/dispositivos. O servidor Vite local mantém a exceção de estilos inline necessária ao HMR. A pesquisa externa ocorre no backend.
- **API:** métodos, origem, parâmetros e tipos de conteúdo são conferidos. As buscas limitam query, área, tamanho da URL e quantidade de fontes por chamada. Erros e respostas de sugestões não são armazenados em cache.
- **Abuso e custo:** com `DB` e `SUBMISSION_HASH_SECRET` configurados, o D1 aplica limites distribuídos por endereço e janela: pesquisa 20/minuto, checagem de links 12/minuto, envios 10/minuto e engajamento 60/minuto. Além disso, envios têm limite de cinco por dia. Os endereços são HMAC; o IP em texto não é persistido. Se o D1 ou o segredo falhar, os endpoints fecham com erro temporário em vez de ignorar o limite. Em desenvolvimento local há apenas um limite em memória.
- **SSRF:** a API só consulta domínios institucionais explicitamente permitidos, em HTTPS, sem credenciais, portas alternativas ou endereços IP; valida novamente cada redirecionamento. As respostas dos catálogos têm tamanho máximo de 2 MB, timeout e redirect limitado. A checagem de links recebe no máximo 24 URLs e interrompe a leitura dos corpos.
- **Formulários e entradas:** campos de busca e formulários limitam o tamanho no navegador para orientar a pessoa, mas o backend repete a validação e nunca confia nas restrições do cliente. O endpoint de sugestões limita o corpo a 128 KB mesmo sem `Content-Length`, valida o formato, normaliza campos, aceita apenas links HTTPS e grava apenas estados permitidos. Formulários de envio exigem JSON e método esperado; origens de navegador não autorizadas e chamadas marcadas como cross-site são recusadas. O limite de taxa reduz spam. A interface não importa arquivos JSON; cópias exportadas servem apenas para consulta manual.
- **Estado local:** os dados de pesquisa salvos são filtrados por formato, tamanho e endereço HTTPS antes de serem apresentados. O progresso do jogo só aceita IDs presentes no catálogo atual, evitando que valores alterados no navegador inflacionem fases ou pontuação.
- **Bem-estar e privacidade:** o check-in de humor é opcional e transitório; a resposta não é salva, enviada, analisada ou usada para inferir perfil. Recursos de apoio aparecem somente quando a pessoa os solicita. O lembrete de pausa conta apenas o tempo da aba visível, fica em memória até recarga/fechamento e não registra o horário local nem transmite métricas. O cronômetro do jogo começa desligado.
- **Falhas de interface:** uma fronteira React impede que um erro inesperado de renderização deixe o site inteiro em branco e oferece uma ação para tentar novamente. Detalhes de erro ficam no console somente em desenvolvimento; não há envio de conteúdo do usuário para monitoramento externo.
- **XSS e injeção:** entradas são renderizadas pelo React como texto escapado; não usar HTML de usuário com `dangerouslySetInnerHTML`. Consultas D1 usam parâmetros preparados em vez de concatenar texto SQL. Links fornecidos permanecem dados para revisão e não são abertos pelo servidor de submissões, reduzindo risco de SSRF.
- **Interface:** o React renderiza conteúdo como texto escapado; não usamos `dangerouslySetInnerHTML`. Links externos abrem com `rel="noreferrer"` ou passam por verificação antes de aparecer. Curtidas aceitam apenas IDs do catálogo publicado; a identificação de visitantes é transformada com HMAC no servidor.
- **Fila editorial:** não há rota pública para listar ou alterar envios. A triagem exige acesso ao D1 pelo painel Cloudflare; o usuário da aplicação não recebe permissões editoriais.

## Configuração obrigatória em produção

Para Pages Functions públicas, configure:

1. O banco D1 com `functions/migrations/0001_submissions.sql` e `functions/migrations/0002_content_engagement.sql` (as criações de tabelas e índices usam `IF NOT EXISTS`).
2. O binding D1 chamado `DB`.
3. O secret `SUBMISSION_HASH_SECRET`, aleatório, com pelo menos 32 caracteres. Não exponha no frontend nem o salve no Git.
4. Um novo deploy depois de configurar os bindings e secrets.
5. Opcionalmente, o secret `OPENALEX_API_KEY` para elevar a cota gratuita da busca acadêmica; nunca o inclua em código de cliente.

Sem D1 e segredo, as rotas de produção recusam requisições. Não publique secrets em logs, issues ou arquivos de ambiente versionados.

## Verificações antes do deploy

Um workflow do GitHub Actions organiza formatação (incluindo CSS e Markdown), TypeScript, testes automatizados, build web, auditoria de dependências, análise Semgrep, ZAP passivo local, disponibilidade da produção e ZAP passivo periódico. O Cloudflare Pages continua responsável pelo deploy; para garantir que ele só receba mudanças aprovadas, `main` precisa exigir pull request e os checks descritos em [CI e liberação para produção](GITHUB_DEPLOY_GATE.md).

## Limites que continuam

- As APIs públicas não exigem login. Os limites são por endereço e podem ser contornados por rotação de IP; eles controlam abuso casual e consumo, não autenticam pessoas.
- A fila D1 contém mensagens e links enviados voluntariamente. Restrinja o acesso ao painel e remova registros quando não forem mais necessários.
- Segurança de aplicação não substitui proteção de borda contra ataques volumétricos. Monitore invocações, erros e limites do plano Pages/Workers; se houver domínio próprio e recursos compatíveis com o plano, acrescente regras de rate limiting e WAF na zona.
- Dependências precisam ser atualizadas e revisadas periodicamente. Não há processo automático de publicação de artigos, login, pagamentos ou dados sensíveis nesta versão.
- O `_headers` remove o CORS curinga dos arquivos estáticos; as APIs configuram CORS separadamente, com allowlist de origens. O isolamento COEP `require-corp` se aplica ao app estático, que usa recursos locais.

## Como interpretar os alertas passivos do ZAP

- **10015 — Cache-Control** e **10049 — cacheabilidade:** páginas HTML e rotas da aplicação não guardam cópias no navegador; arquivos com hash em `/assets/` podem ser armazenados por um ano, e imagens/ícones por uma hora. Alertas restantes sobre cache devem ser avaliados pelo tipo de arquivo e pelo valor de `Cache-Control`; conteúdo público e sem sessão não exige o mesmo tratamento de dados pessoais.
- **10098 — configuração entre domínios:** Pages pode enviar CORS curinga em arquivos estáticos por padrão. O `_headers` remove esse cabeçalho dos arquivos públicos; endpoints de API continuam usando allowlist de origem.
- **10055-6 — `style-src unsafe-inline`:** estilos dinâmicos foram trocados por CSS e elementos `<progress>`, então a política de produção não permite estilos inline. A exceção existe apenas no servidor local de desenvolvimento para o HMR do Vite.
- **90004-2 — COEP ausente:** a versão estática envia `Cross-Origin-Embedder-Policy: require-corp`; os recursos incorporados pelo app são locais.
- **10109 — Modern Web Application:** aviso informativo de que o site é uma aplicação web moderna; não aponta vulnerabilidade.

## Revisão antes de novos recursos

Antes de criar uma rota, defina método e schema, limite de bytes, autorização, rate limit, cache, origem CORS e política de erro. Para qualquer recurso que leia ou altere dados de uma pessoa, exija autenticação e autorização no backend; esconder o botão na interface não protege a rota.
