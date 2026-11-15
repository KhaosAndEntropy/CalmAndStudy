# CI e liberação para produção

A publicação continua sob responsabilidade do Cloudflare Pages. O GitHub Actions apenas verifica mudanças; o Pages está conectado ao Git e publica a branch `main`. Os jobs que verificam o site publicado usam a variável de repositório `CALMANDSTUDY_PUBLIC_URL` (URL HTTPS `*.pages.dev`); sem ela, esses jobs são ignorados.

## Verificações automáticas

Um único workflow, **Sala de Calma e Estudo · qualidade e segurança**, organiza as verificações em etapas nomeadas. Em pull requests para `main` e pushes em `main`, executa:

- **Qualidade, testes e dependências:** instalação reproduzível, formatação, TypeScript, testes, build e auditoria de dependências (bloqueia severidade moderada ou maior).
- **Segurança estática (Semgrep):** análise de código e procura de secrets; também roda semanalmente.
- **Segurança web local (OWASP ZAP):** varredura passiva da versão compilada no runner; não envia ataques ativos ao site público. O relatório HTML fica disponível como artefato por 14 dias.
- **Disponibilidade da produção:** verifica o site e a API depois de push em `main` e semanalmente, quando `CALMANDSTUDY_PUBLIC_URL` está configurada.
- **Revisão passiva da produção (OWASP ZAP):** execução semanal somente leitura, sem bloquear merges.

As verificações semanais aparecem como jobs no mesmo workflow: Semgrep na segunda às 08:23 UTC, smoke check na segunda às 10:17 UTC e ZAP de produção na quarta às 10:32 UTC. Execução manual roda os checks e as revisões de produção.

> Os workflows, sozinhos, não impedem que o Cloudflare publique um push direto. O bloqueio precisa ser configurado no GitHub para `main`.

## Ativar a trava que antecede o deploy

No GitHub, abra o repositório **Sala de Calma e Estudo → Settings → Rules → Rulesets → New ruleset → New branch ruleset**. Configure:

1. Nome: **Produção protegida**; status **Active**.
2. Target branches: **Include default branch** ou a branch `main`.
3. Não adicione administradores ou aplicações à lista de bypass, se quiser que a regra também se aplique ao proprietário.
4. Ative **Require a pull request before merging**. Uma aprovação pode ficar desativada para um projeto individual.
5. Ative **Require status checks to pass** e selecione os dois checks obrigatórios depois que eles concluírem uma vez em um pull request:
   - `Sala de Calma e Estudo · qualidade e segurança / Qualidade, testes e dependências`
   - `Sala de Calma e Estudo · qualidade e segurança / Segurança estática (Semgrep)`
     O ZAP passivo local e a guarda de seu relatório são etapas do job de Qualidade.
6. Ative **Require branches to be up to date before merging**, se essa opção aparecer.
7. Ative **Block force pushes** e **Restrict deletions**. Salve o ruleset.

Se os nomes não aparecerem no seletor, abra um PR para `main`, aguarde os dois jobs obrigatórios terminarem e volte a esta tela. Use exatamente os nomes dos checks exibidos em **Actions**. Os jobs de smoke e ZAP público são observabilidade periódica, não requisitos de merge.

## Fluxo depois da configuração

1. Faça alterações em uma branch curta, nunca diretamente em `main`.
2. Abra um pull request para `main`.
3. Aguarde os dois checks obrigatórios. Um check vermelho impede o merge; corrija o problema e envie outro commit.
4. Faça merge apenas com ambos verdes. A integração Git do Cloudflare Pages então recebe o commit de `main` e executa o deploy.
5. Confira o deploy e o smoke check em **Cloudflare Pages → Deployments** e **GitHub → Actions**.

Não é necessário criar `CLOUDFLARE_API_TOKEN`, credenciais de deploy ou secrets de Access no GitHub Actions: o GitHub não publica. A integração Git existente no Pages continua fazendo o CD.

## Versão mobile

A Sala de Calma e Estudo é publicada como web responsiva e pode ser instalada como PWA pelo navegador do celular. Não existe cliente nativo separado, então não há build, credenciais ou publicação de app store para manter.

## Limites

Esses checks reduzem erros comuns, mas não certificam que a aplicação está livre de vulnerabilidades. ZAP roda passivamente, Semgrep depende das regras ativadas, e a auditoria cobre advisories conhecidos das dependências. Mantenha atualizações e revisão humana.
