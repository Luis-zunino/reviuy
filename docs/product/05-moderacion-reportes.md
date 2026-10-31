# Flujo 05 — Reportes y moderación

## Propósito

Permitir a la comunidad señalar contenido inapropiado (reseñas o inmobiliarias) y darle al equipo de ReviUy un canal para revisarlo y resolverlo, manteniendo la calidad del contenido sin un panel de administración dentro de la app.

## Actores

- **Usuario autenticado**: reporta contenido (anónimos no pueden).
- **Equipo de moderación de ReviUy**: recibe los reportes por email y resuelve fuera del producto.

## Flujo principal — Reportar una reseña

1. En el detalle de una reseña (o tarjeta asociada), el usuario autenticado abre el diálogo "Reportar".
2. Elige un **motivo** (obligatorio) entre:
   - Spam
   - Contenido inapropiado
   - Información falsa
   - Acoso
   - Discurso de odio
   - Reseña falsa
   - Otro
3. Agrega una descripción opcional (máximo 500 caracteres en la interfaz).
4. Presiona "Enviar Reporte".

### Reglas del envío

| Regla | Comportamiento |
|---|---|
| Sin motivo elegido | Botón de envío bloqueado |
| Ya reportó esta reseña antes | Rechazado: *"Ya has reportado esta reseña anteriormente"*; el botón queda deshabilitado |
| Intenta reportar su propia reseña | Rechazado: *"No puedes reportar tu propia reseña"* |
| Límite anti-abuso | Máximo 3 reportes por hora por usuario |

### Doble notificación

Cada reporte genera dos efectos simultáneos:

1. Queda registrado en la base de datos con estado inicial `pending`.
2. Se envía un email al correo de contacto del equipo con el detalle del reporte.

## Variante — Reportar inmobiliaria

Idéntico flujo desde el detalle de la inmobiliaria ("Reportar Inmobiliaria"), con motivos propios:

- Fraude · Falsa · Inapropiado · Spam · Ilegal · Mal servicio · Otro

También existen reportes sobre reseñas de inmobiliarias (mismo mecanismo que las reseñas de direcciones).

## Ciclo de vida del reporte

```
pending ──► reviewed ──► resolved
              └──────► dismissed
```

- `pending`: recién creado, esperando revisión.
- `reviewed`: visto por el equipo.
- `resolved`: se tomó acción sobre el contenido.
- `dismissed`: descartado sin acción.

**Importante**: la resolución de reportes no ocurre dentro del producto hoy. No existe panel de moderación en la app; el equipo gestiona los estados mediante acceso administrativo directo (RPC reservado). Para el usuario que reporta, el flujo termina con la confirmación de envío: no hay seguimiento visible del estado de su reporte.

## Qué NO hace el sistema

- No muestra al usuario el estado final de su reporte.
- No notifica al autor de la reseña reportada.
- No oculta automáticamente el contenido reportado: permanece visible hasta resolución manual.

## Referencias técnicas

- Diálogo de reporte: `src/components/features/Review/components/ReportDialog/` (y equivalente para real estate)
- Motivos de reseña: `src/constants/report-review-reasons.constant.ts`
- RPC de reporte: `report_review` (rate limit 3/hora, anti-duplicados)
- API de email: `/api/report-review`, `/api/report-real-estate`, `/api/report-real-estate-review`
- Moderación fuera de app: función `moderate_reports` (solo service_role)
