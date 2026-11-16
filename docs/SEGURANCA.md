# Segurança para desenvolvimento

## Execução local

O catálogo funciona sem credenciais. `OPENALEX_API_KEY` é opcional e só aumenta a cota da OpenAlex. Guarde-a no `.env` local, nunca no Git. Arquivos `.env` são ignorados; `.env.example` não contém chaves reais.

Não use segredos em variáveis `VITE_*`: o Vite as incorpora no código enviado ao navegador. Não compartilhe valores de `.env` em issues, logs ou capturas de tela. Se uma chave for publicada por engano, revogue-a no serviço que a emitiu e gere outra.

## Usar um fork em produção

Um deploy próprio com Pages Functions precisa dos recursos configurados na conta do mantenedor:

- binding D1 chamado `DB`;
- secret `SUBMISSION_HASH_SECRET` configurado no Cloudflare;
- opcionalmente, secret `OPENALEX_API_KEY` para a busca.

Crie credenciais próprias para o fork e configure-as na hospedagem. Não reutilize credenciais de terceiros, não as salve no repositório ou no frontend. A publicação e os valores necessários estão descritos no [guia de execução e publicação](GUIA_EXECUCAO_PUBLICACAO.md).

## Antes de abrir um PR

```sh
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

O GitHub Actions também executa verificações de segurança e dependências. Para relatar um problema de segurança, não publique detalhes nem credenciais em uma issue pública; use um canal privado com os mantenedores do repositório.
