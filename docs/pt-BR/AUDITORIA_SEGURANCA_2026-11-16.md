# Auditoria de segurança — 16/11/2026

Revisão do código web e das APIs, dependências, configuração de segurança e imagens Docker. Esta auditoria registra o estado verificado nesta data; não é uma garantia de ausência de vulnerabilidades futuras.

## Alterações realizadas

- O middleware agora encerra requisições de API com origem não permitida usando HTTP 403, em vez de continuar o processamento.
- A API de engajamento limita a leitura do corpo da requisição a 2 KiB e interrompe a leitura quando o limite é excedido.
- O Dockerfile usa estágios separados para dependências, build, execução local e produção. A imagem de produção mantém apenas os artefatos necessários e executa sem privilégios.
- O build de CI da imagem usa `--pull --no-cache` para buscar as imagens-base atuais e reinstalar pacotes do sistema.
- O CI bloqueia vulnerabilidades detectadas pelo Trivy e executa Semgrep, auditoria de dependências, testes, typecheck e análise passiva com OWASP ZAP.

## Verificações e resultados

- Testes automatizados, typecheck e verificação de formatação: aprovados.
- `pnpm audit --audit-level moderate`: nenhuma vulnerabilidade conhecida nas dependências do projeto.
- Trivy na imagem de produção: nenhuma vulnerabilidade detectada (crítica, alta, média, baixa ou desconhecida).
- Trivy na imagem local de desenvolvimento: nenhuma vulnerabilidade crítica; foram reportadas vulnerabilidades em pacotes do Debian 13 sem versão corrigida indicada pelo scanner. Essa imagem inclui ferramentas de desenvolvimento que não fazem parte da imagem de produção.
- O código e os cabeçalhos HTTP foram revisados para controles de origem, limites de requisição, cache, CSP e outros cabeçalhos de segurança.

## Limites

Os resultados refletem as bases de vulnerabilidades disponíveis na data acima. Imagens-base e dependências devem continuar sendo atualizadas e verificadas pelo CI. A imagem de desenvolvimento pode exibir alertas de sistema operacional mesmo quando não há correção disponibilizada para a distribuição; mantenha-a atualizada e evite usá-la como imagem de produção.
