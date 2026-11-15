# Cómo organicé el proyecto

Mantengo un monorepo pnpm con una aplicación web adaptable que se puede instalar como PWA. No hay un cliente Expo separado.

```text
apps/web          interfaz React, Vite, PWA y navegación
packages/content  catálogo versionado, relaciones editoriales, pruebas y tutoriales
packages/research adaptadores para fuentes bibliográficas públicas
functions         API de Cloudflare Pages y migraciones D1
docs              guías, decisiones y políticas
```

El navegador carga el catálogo versionado de `content`. La búsqueda en fuentes públicas utiliza adaptadores de `research`, ejecutados localmente por middleware de Vite o en producción por Pages Functions. D1 recibe sugerencias y guarda contadores limitados; no es un CMS y no publica artículos automáticamente. OpenAlex y otros catálogos ayudan a localizar referencias, pero aparecer en una base no demuestra que una afirmación sea verdadera.

El Modo aventura tiene grupos de navegación propios y una pantalla de expedición, pero comparte los mismos artículos, rutas, tutoriales, mapa, fuentes y biblioteca que el Estudio tranquilo. La ilustración orbital con profundidad está hecha solo con CSS y no añade una dependencia 3D. El progreso y las puntuaciones permanecen en el dispositivo. La presentación lúdica no obliga a usar temporizadores, no bloquea lecturas ni aplica penalizaciones; se mantienen el acceso por teclado, el foco visible y la preferencia de movimiento reducido.

En producción, Cloudflare Pages sirve la interfaz y Pages Functions; D1 está vinculado al proyecto. Localmente, Wrangler simula Pages y D1 con SQLite. Docker Compose levanta el entorno con un comando y persiste los datos en un volumen local.

## Límites que declaro

- El catálogo aún contiene material legado que no pasó por completo por el nuevo registro de evidencias y revisión humana. Debe identificarse como pendiente; los porcentajes ilustrativos no son probabilidades de verdad.
- Una respuesta HTTP correcta, metadatos bibliográficos o una licencia abierta no demuestran independencia de las fuentes ni que respalden una afirmación concreta.
- Se requiere revisión humana antes de publicar. Las sugerencias de lectores nunca entran automáticamente al catálogo.
- Las preferencias de lectura y el progreso permanecen en el navegador. Las rutas de API reciben solo los datos necesarios para su finalidad.

Consulta la [arquitectura actual](../ARQUITETURA_ATUAL.md) y la [guía de seguridad](../SEGURANCA.md) para más detalles.
