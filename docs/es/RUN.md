# Ejecutar Sala de Calma e Estudo en mi ordenador

Esta es la forma más breve de explorar el proyecto localmente. No necesito una cuenta de Cloudflare ni una base de datos remota.

## Opción recomendada: Docker Compose

1. Instala e inicia Docker Desktop.
2. Desde la carpeta del proyecto, ejecuta:

   ```sh
   docker compose up --build
   ```

3. Abre <http://localhost:4173>.
4. Detén el servicio con `Ctrl+C`. Los datos locales quedan en el volumen `calmandstudy_data`.

Si el puerto 4173 está ocupado, crea `.env` con `CALMANDSTUDY_DOCKER_PORT=4174` y abre <http://localhost:4174>. Para borrar también la base de datos local, ejecuta `docker compose down -v`; esto elimina el volumen.

## Sin Docker

Necesito Node.js 22.13 o posterior y pnpm 10. En la raíz del repositorio:

```sh
pnpm install
pnpm dev
```

Después abro <http://localhost:4173>. `OPENALEX_API_KEY` es opcional y debe guardarse solo en `.env`, nunca en el código ni en commits. El entorno local ejecuta la interfaz, Pages Functions y D1 local.

Consulta la [guía local completa](../RODAR_LOCALMENTE.md) para más detalles.
