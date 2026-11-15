# Apoyo voluntario

La Sala de Calma y Estudio sigue siendo gratuita y abierta. Si el proyecto te resultó útil y quieres —y puedes— apoyarlo, puedes contribuir voluntariamente por Pix. No hay suscripción, recompensa, contenido exclusivo ni presión para contribuir.

## Cómo funciona

- **Apoyar el proyecto** está disponible en ambos modos de estudio y en el pie de página.
- El código QR y el texto Pix se generan en el navegador; ninguna plataforma externa de QR recibe la clave.
- Antes de confirmar, comprueba el nombre del destinatario y el importe en la aplicación de tu banco.
- El proyecto no recibe confirmaciones de transferencias ni guarda datos de donantes o bancarios.
- Pix se envía a la persona responsable del proyecto. No es una donación a una entidad benéfica y no se promete ningún beneficio fiscal.

## Configuración de Cloudflare Pages

Configura estas variables de compilación y publica una nueva versión para mostrar el QR:

```text
VITE_DONATION_PIX_KEY=clave-pix-publica-para-recibir
VITE_DONATION_PIX_NAME=NOMBRE DEL DESTINATARIO
VITE_DONATION_PIX_CITY=CIUDAD
```

El nombre admite hasta 25 caracteres y la ciudad hasta 15. Si faltan valores o no son válidos, la página sigue disponible e indica que Pix no está configurado.

Los valores con prefijo `VITE_` se incluyen en el JavaScript que reciben los navegadores. **No son secretos** después de publicar. Usa únicamente la clave Pix pública destinada a recibir contribuciones; nunca pongas aquí contraseñas, tokens ni credenciales privadas.

El apoyo nunca cambia el acceso al contenido, la revisión editorial, las fuentes, las recomendaciones ni las prioridades del catálogo.
