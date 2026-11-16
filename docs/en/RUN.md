# Run Estude com Calma on my computer

This is the shortest route to explore the project locally. No Cloudflare account or remote database is needed.

## Recommended: Docker Compose

1. Install and start Docker Desktop.
2. From the project folder, run:

   ```sh
   docker compose up --build
   ```

3. Open <http://localhost:4173>.
4. Stop with `Ctrl+C`. Local data stays in the `calmandstudy_data` volume.

If port 4173 is busy, create `.env` with `CALMANDSTUDY_DOCKER_PORT=4174` and open <http://localhost:4174>. To also delete local database data, run `docker compose down -v`; this removes the volume.

## Without Docker

I need Node.js 22.13 or newer and pnpm 10. From the repository root:

```sh
pnpm install
pnpm dev
```

Then open <http://localhost:4173>. `OPENALEX_API_KEY` is optional and belongs only in `.env`, never in source files or commits. The local setup runs the frontend, Pages Functions, and local D1 runtime.

See the [full local guide](../RODAR_LOCALMENTE.md) for additional details.
