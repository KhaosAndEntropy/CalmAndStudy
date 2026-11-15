# Rodar Calm & Study no meu computador

Este é o caminho curto para conhecer o projeto localmente. Não preciso de conta Cloudflare nem de banco remoto.

## Opção recomendada: Docker Compose

1. Instale e inicie o Docker Desktop.
2. Na pasta do projeto, execute:

   ```sh
   docker compose up --build
   ```

3. Abra <http://localhost:4173>.
4. Para encerrar, pressione `Ctrl+C`. Os dados locais ficam no volume `calmandstudy_data`.

Se a porta 4173 estiver ocupada, crie `.env` com `CALMANDSTUDY_DOCKER_PORT=4174` e abra <http://localhost:4174>. Para remover também os dados locais, use `docker compose down -v` sabendo que essa opção apaga o volume do banco local.

## Rodar sem Docker

Preciso de Node.js 22.13 ou superior e pnpm 10. Na raiz:

```sh
pnpm install
pnpm dev
```

Depois abro <http://localhost:4173>. A chave `OPENALEX_API_KEY` é opcional e só deve ficar em `.env`, nunca no código ou em commits. O modo local executa o frontend, as Pages Functions e o D1 local.

Mais detalhes e solução de problemas: [guia local completo](../RODAR_LOCALMENTE.md).
