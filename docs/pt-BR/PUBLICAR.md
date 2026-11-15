# Como publico uma versão

Eu uso GitHub Actions para verificar alterações e Cloudflare Pages para fazer o deploy. A Action não deve guardar credenciais de publicação nem publicar diretamente: a integração Git do Pages recebe o commit depois que as verificações passam.

1. Crio o repositório vazio `KhaosAndEntropy/CalmAndStudy` no GitHub, sem gerar um README automaticamente, e confirmo que a conta desta máquina tem acesso a ele.
2. Abro uma branch pequena a partir de `main` e envio um pull request.
3. O GitHub Actions executa formatação, tipos, testes, build, auditoria de dependências, Semgrep, verificação da imagem Docker e ZAP passivo.
4. Corrijo falhas e aguardo todos os checks obrigatórios.
5. Depois da revisão, faço merge em `main`; a integração Cloudflare Pages publica o commit.
6. Confiro o deploy e a disponibilidade do site no domínio `pages.dev` configurado no projeto.

O repositório deve exigir os checks bem-sucedidos antes do merge. Os nomes exatos aparecem em **Settings → Rules → Rulesets**. Configure o projeto Pages com o repositório novo, branch `main`, diretório de build de `apps/web` conforme `wrangler.toml`/configuração atual e os bindings de D1 necessários. O nome e o domínio final do projeto Pages precisam ser confirmados no painel Cloudflare; não presumo que a URL antiga continue válida.

Para a lista detalhada de variáveis, migrações e checks, consulte [guia de deploy](../GITHUB_DEPLOY_GATE.md) e [publicação Cloudflare](../GUIA_EXECUCAO_PUBLICACAO.md).
