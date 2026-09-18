# Autenticación del Dashboard

El endpoint `POST /api/login/` conserva `mensaje`, `username` y `rol`, y ahora
también devuelve `access_token` y `token_type: "bearer"`. Las contraseñas nuevas
se almacenan con PBKDF2-SHA256; los registros antiguos en texto plano se migran
al hash tras un inicio de sesión válido.

Configura `CAMPOTERRA_TOKEN_SECRET` con un valor aleatorio largo. En producción
también establece `CAMPOTERRA_ENV=production`; el backend se detendrá con un
mensaje explícito si falta la clave. En desarrollo se genera una clave temporal
para no incluir secretos en el repositorio.

Las rutas del Dashboard requieren `Authorization: Bearer <access_token>`.
`GET /api/shift/options` permanece público porque sólo entrega las opciones
necesarias para mostrar el selector de inicio de jornada. `POST /api/shift/start`
valida que el técnico esté activo y el turno exista, y devuelve un token de
sesión temporal para la app móvil. La app debe enviarlo como
`Authorization: Bearer <token>` en estadísticas, catálogos, inventario y
reportes. Las rutas móviles de lectura/escritura protegidas ya no aceptan
peticiones sin ese token.
