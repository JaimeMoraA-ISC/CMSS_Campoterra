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
Las rutas usadas por la aplicación móvil no requieren este token para mantener
compatibilidad.
