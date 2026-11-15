# How I publish a release

GitHub Actions verifies changes and Cloudflare Pages deploys them. Actions should not hold deployment credentials or publish directly: Pages' Git integration receives the commit after checks pass.

1. I create the empty `KhaosAndEntropy/CalmAndStudy` repository without generating an initial README, and confirm this computer's GitHub account can access it.
2. I create a focused branch from `main` and open a pull request.
3. GitHub Actions runs formatting, type checks, tests, build, dependency audit, Semgrep, Docker image scanning, and passive ZAP.
4. I fix failures and wait for all required checks.
5. After review, I merge into `main`; Cloudflare Pages' integration publishes the commit.
6. I check the deployment and public availability at the Pages domain configured for the project.

Require successful checks before merging. Exact check names are visible in **Settings → Rules → Rulesets**. Configure the new Pages project with this repository, `main`, the build output for `apps/web`, and required D1 bindings. Confirm the final Pages project name and domain in Cloudflare; the old URL is not assumed to carry over.

See the [CI deployment gate](../GITHUB_DEPLOY_GATE.md) and [Cloudflare publishing guide](../GUIA_EXECUCAO_PUBLICACAO.md) for configuration details.
