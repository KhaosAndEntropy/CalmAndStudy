# Cómo publico una versión

Uso GitHub Actions para comprobar los cambios y Cloudflare Pages para desplegarlos. Actions no debe guardar credenciales de publicación ni desplegar directamente: la integración Git de Pages recibe el commit después de superar las comprobaciones.

1. Creo el repositorio vacío `KhaosAndEntropy/CalmAndStudy` sin generar un README inicial y confirmo que la cuenta de GitHub de este ordenador tiene acceso.
2. Creo una rama pequeña desde `main` y abro una solicitud de incorporación.
3. GitHub Actions ejecuta formato, tipos, pruebas, compilación, auditoría de dependencias, Semgrep, análisis de la imagen Docker y ZAP pasivo.
4. Corrijo los fallos y espero todos los checks obligatorios.
5. Tras la revisión, integro el cambio en `main`; Cloudflare Pages lo publica.
6. Compruebo el despliegue y la disponibilidad en el dominio Pages configurado.

Exige checks correctos antes de integrar cambios. Sus nombres aparecen en **Settings → Rules → Rulesets**. Configura el nuevo proyecto Pages con este repositorio, `main`, la salida de compilación de `apps/web` y los bindings D1 necesarios. Confirma el nombre y el dominio definitivos en Cloudflare; no supongo que la URL anterior seguirá activa.

Consulta la [barrera de despliegue CI](../GITHUB_DEPLOY_GATE.md) y la [guía de publicación Cloudflare](../GUIA_EXECUCAO_PUBLICACAO.md) para los detalles.
