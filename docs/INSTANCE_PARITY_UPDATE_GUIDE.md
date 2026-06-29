# Guía de actualización de la instancia Baileys para paridad con los nodos n8n

## Objetivo

Este documento inventaria las funcionalidades que hoy exponen los nodos `Baileys Instance` y `Baileys Trigger`, y las traduce a capacidades concretas que la instancia `wa-instance` debe tener activas o implementadas para alcanzar paridad real.

La fuente usada para este inventario es el código actual del paquete:

- [README.md](../README.md)
- [BaileysInstance.node.ts](../nodes/BaileysInstance/BaileysInstance.node.ts)
- [BaileysTrigger.node.ts](../nodes/BaileysTrigger/BaileysTrigger.node.ts)
- [BaileysInstanceApi.credentials.ts](../credentials/BaileysInstanceApi.credentials.ts)
- [TRIGGER_ARCHITECTURE.md](./TRIGGER_ARCHITECTURE.md)
- [TRIGGER_IMPLEMENTATION_SPEC.md](./TRIGGER_IMPLEMENTATION_SPEC.md)

## Resumen ejecutivo

Los nodos no solo esperan una API de envío de mensajes. Esperan una instancia con estas capas:

1. Transporte HTTP autenticado por API key.
2. Señales operativas de salud, estado, colas y pairing.
3. Persistencia consultable de eventos, chats, contactos, grupos y mensajes.
4. Operaciones activas sobre chats, grupos, privacidad, consentimientos y destinatarios.
5. Pipeline de mensajería con idempotencia, previews y batch.
6. Ingesta y observabilidad de webhooks con historial de deliveries y retry.

Si en las instancias actuales solo está operativa la parte básica de Baileys, el mayor gap no está en un endpoint aislado: está en las utilidades transversales que sostienen esos endpoints.

## Contrato mínimo que el nodo da por hecho

### Autenticación y transporte

- Header `Authorization: Bearer <apiKey>`.
- `Base URL` fija por credencial.
- Todas las rutas del nodo son relativas a esa base URL.
- Respuestas JSON.
- Tolerancia opcional a TLS self-signed.
- Timeouts largos en operaciones que pueden encolar, resolver destinatarios o atravesar proxy.

### Señales de readiness

- `GET /status` debe responder aunque la instancia todavía no esté lista para enviar.
- `GET /health/deps` es un check más estricto y puede devolver `503` durante onboarding o pairing pendiente.
- El nodo usa `/status` como test de credenciales y puede usar `/health/deps` como preflight antes de enviar.

### Convenciones funcionales

- Los sends admiten `X-Idempotency-Key`.
- Los previews no deben usar idempotencia.
- Muchas listas aceptan `limit`.
- Las operaciones deben devolver errores útiles cuando el socket o la capacidad no está disponible.
- El trigger depende de persistencia de eventos en `GET /events`; no depende de registro dinámico de webhooks.

## Inventario completo de capacidades que hoy expone el nodo

### Instance

- `GET /health`
- `GET /health/deps`
- `GET /status`
- `GET /queues/status`
- `POST /pairing/qr`
- `POST /pairing/code`
- `POST /session/logout`
- `POST /webhook/test`

### History Sync

- `GET /history-sync/status`
- `POST /history-sync/fetch`

### Event

- `GET /events`
- `GET /events/:event_id`

Filtros esperados:

- `event_type`
- `entity_type`
- `message_id`
- `limit`

### Chat

- `GET /chats`
- `POST /chats/:jid/archive`
- `POST /chats/:jid/mute`
- `POST /chats/:jid/read-state`

### Contact

- `GET /contacts`

### Group

- `GET /groups`
- `GET /groups/:jid`
- `POST /groups`
- `POST /groups/join`
- `PATCH /groups/:jid/subject`
- `PATCH /groups/:jid/description`
- `POST /groups/:jid/participants`
- `POST /groups/:jid/participants/requests`
- `GET /groups/:jid/invite-code`
- `POST /groups/:jid/invite-code/revoke`
- `PATCH /groups/:jid/settings`
- `PATCH /groups/:jid/ephemeral`

### Message

- `POST /send/text`
- `POST /send/media`
- `POST /sends/preview`
- `GET /sends/:message_id`
- `GET /sends`
- `GET /messages/:message_id`
- `POST /messages/:message_id/reply`
- `POST /messages/:message_id/forward`
- `POST /messages/:message_id/delete`
- `POST /messages/:message_id/edit`
- `POST /messages/:message_id/reaction`
- `POST /messages/read`
- `POST /messages/receipts`
- `POST /messages/:message_id/media/refresh`

Filtros esperados en `GET /sends`:

- `status`
- `to_jid`
- `client_ref`
- `from`
- `to`
- `limit`

### Batch

- `POST /send/batch/text`
- `POST /send/batch/media`
- `POST /send-batches/preview`
- `GET /send-batches/:batch_id`

### Consent

- `POST /consents/upsert`
- `POST /consents/revoke`
- `GET /consents/:jid`

### Recipient

- `GET /limits/:jid`

### Privacy

- `GET /privacy`
- `GET /privacy/blocklist`
- `POST /privacy/blocks`
- `PATCH /privacy/last-seen`
- `PATCH /privacy/online`
- `PATCH /privacy/profile-photo`
- `PATCH /privacy/status`
- `PATCH /privacy/groups-add`
- `PATCH /privacy/read-receipts`
- `PATCH /settings/disappearing-mode`

### Webhook Delivery

- `GET /webhooks/deliveries`
- `POST /webhooks/deliveries/:delivery_id/retry`

Filtros esperados:

- `status`
- `event_id`
- `since`
- `limit`

### Trigger

- `GET /events` como fuente de polling.
- Filtros por `event_type`, `entity_type`, `message_id`, `limit`.
- Persistencia suficiente para ordenar por `occurred_at` y deduplicar por `event_id`.

## Utilidades que la instancia necesita para soportar esa superficie

Aquí está la parte importante: aunque el nodo se vea como una lista de endpoints, la instancia necesita varias utilidades de backend para que esos endpoints no sean simples stubs.

### 1. Utilidad de autenticación y hardening HTTP

Necesaria para:

- validar API key en todas las rutas
- normalizar errores HTTP
- registrar contexto mínimo de request
- soportar timeouts/proxies sin cortar envíos largos de forma prematura

Debe cubrir:

- middleware de auth bearer
- manejo consistente de `401`, `403`, `404`, `409`, `503`
- request IDs o trazas equivalentes

### 2. Utilidad de estado operativo de instancia

Necesaria para:

- `/status`
- `/health`
- `/health/deps`
- `/queues/status`
- pairing QR/code
- logout y reconnect

Debe exponer, como mínimo:

- estado de conexión de WhatsApp
- modo de pairing activo
- estado de Redis/Postgres/MinIO si aplica
- estado de workers/colas de salida y webhook
- capacidad de distinguir "autenticado pero no listo" de "caído"

### 3. Utilidad de idempotencia

Necesaria para:

- `POST /send/text`
- `POST /send/media`
- `POST /send/batch/text`
- `POST /send/batch/media`
- `reply`, `forward`, `delete`, `edit`, `reaction`

Debe cubrir:

- almacenamiento temporal o persistente por `X-Idempotency-Key`
- detección de reuse con payload distinto
- respuesta coherente en conflicto `409`

Sin esto, el nodo puede mostrar operaciones activas que en la práctica no son seguras de reintentar.

### 4. Utilidad de persistencia de eventos

Necesaria para:

- `GET /events`
- `GET /events/:event_id`
- `Baileys Trigger`
- inspección de `message_id`, `event_type`, `entity_type`
- historial para `webhooks/deliveries`

Debe cubrir:

- almacenamiento de eventos normalizados
- `event_id` estable
- `occurred_at`
- índices por `event_type`, `entity_type`, `message_id`
- ordenación consistente para polling

Sin esta capa, el trigger de n8n deja de ser funcional.

### 5. Utilidad de snapshots persistidos

Necesaria para:

- `GET /chats`
- `GET /contacts`
- `GET /groups`
- `GET /groups/:jid`
- `GET /messages/:message_id`

Debe cubrir:

- proyección persistida de chats
- proyección persistida de contactos
- proyección persistida de grupos
- lookup de mensajes inbound ya almacenados

Si hoy la instancia solo opera sobre estado en memoria de Baileys, hay que añadir persistencia o proyección consultable.

### 6. Utilidad de mensajería saliente

Necesaria para:

- sends simples
- sends con media
- replies, forwards, edits, reactions, delete
- refresh de media
- mark read
- receipts

Debe cubrir:

- normalización de destinatarios
- soporte PN JID y LID JID
- resolución opcional de destinatario si `RECIPIENT_LOOKUP` está activo
- `client_ref`
- almacenamiento de mensajes salientes consultables vía `/sends`

### 7. Utilidad de preview y policy

Necesaria para:

- `POST /sends/preview`
- `POST /send-batches/preview`
- `GET /limits/:jid`
- flujos de validación antes de enviar

Debe cubrir:

- validación de payload sin envío
- normalización previa
- políticas por destinatario
- límites operativos y de consentimiento

Si esta utilidad no existe, el nodo seguirá enseñando previews que no tendrán backend real.

### 8. Utilidad de batch processing

Necesaria para:

- `/send/batch/text`
- `/send/batch/media`
- `/send-batches/:batch_id`
- `/send-batches/preview`

Debe cubrir:

- colas de batch
- tracking por batch
- persistencia de estado
- itemización por destinatario

### 9. Utilidad de gestión de grupos

Necesaria para:

- creación y join
- subject/description
- participants y participant requests
- invite codes
- settings
- ephemeral

Debe cubrir:

- validación de JID de grupo
- mapeo a capacidades reales de Baileys/WhatsApp
- manejo de `400` y `409` según estado/capacidad

### 10. Utilidad de privacidad

Necesaria para:

- blocklist
- block/unblock
- last seen
- online
- profile photo
- status
- groups add
- read receipts
- default disappearing mode

Debe cubrir:

- enums soportados exactamente como los usa el nodo
- persistencia o consulta del estado actual
- adaptación estable a las primitivas de Baileys

Valores esperados por el nodo:

- `last-seen`, `profile-photo`, `status`: `all`, `contacts`, `contact_blacklist`, `none`
- `online`: `all`, `match_last_seen`
- `groups-add`: `all`, `contacts`, `contact_blacklist`
- `read-receipts`: `all`, `none`

### 11. Utilidad de consentimientos y límites

Necesaria para:

- `/consents/upsert`
- `/consents/revoke`
- `/consents/:jid`
- `/limits/:jid`

Debe cubrir:

- alta y revocación
- trazabilidad por `source`, `reason`, `timezone`
- evaluación de límites operativos por destinatario

### 12. Utilidad de webhooks salientes y observabilidad

Necesaria para:

- `POST /webhook/test`
- `GET /webhooks/deliveries`
- `POST /webhooks/deliveries/:id/retry`

Debe cubrir:

- envío real a `WEBHOOK_URL`
- persistencia de cada delivery
- estado, timestamps, respuesta remota y retries

Si hoy la instancia envía webhooks pero no guarda deliveries, el nodo tiene visibilidad parcial.

### 13. Utilidad de history sync

Necesaria para:

- `GET /history-sync/status`
- `POST /history-sync/fetch`

Debe cubrir:

- fetch on-demand por `chat_jid`
- referencia por `oldest_message_id`
- soporte para `oldest_message_timestamp`, `participant`, `from_me`
- persistencia posterior de mensajes recuperados

## Plan de actualización recomendado para la instancia

### Prioridad P0

Sin esto, el nodo parece funcional pero fallará en casi todo:

- autenticación bearer homogénea
- `GET /status`
- `GET /health`
- `GET /health/deps`
- `GET /queues/status`
- pipeline de envío `POST /send/text` y `POST /send/media`
- utilidad de idempotencia
- persistencia de eventos para `GET /events`

### Prioridad P1

Esto habilita la operación diaria real desde n8n:

- `GET /sends` y `GET /sends/:id`
- `POST /sends/preview`
- `GET /chats`, `GET /contacts`, `GET /groups`
- operaciones de chat
- operaciones principales de grupo
- `GET /privacy` y updates de privacidad
- `GET /limits/:jid`

### Prioridad P2

Esto cierra la brecha avanzada y de observabilidad:

- batches completos
- history sync
- consentimientos
- deliveries de webhook y retry
- refresh de media
- receipts
- participant requests
- default disappearing mode

## Matriz de paridad nodo -> utilidad backend requerida

| Recurso del nodo | Superficie visible | Utilidad backend mínima |
| --- | --- | --- |
| Instance | health, deps, status, queues, pairing, logout | instance-state, dependency-health, pairing-manager, queue-observer |
| History Sync | status, fetch | history-sync service, persisted message import |
| Event | list, get | persisted event store |
| Chat | list, archive, mute, read state | chat projection + mutation adapter |
| Contact | list | contact projection |
| Group | list, get, create, join, settings | group service + group snapshot store |
| Message | send, preview, query, reply, forward, edit, react | outbound messaging pipeline + send store + policy/preview |
| Batch | send, preview, get | batch queue + batch status store |
| Consent | upsert, revoke, get | consent repository |
| Recipient | limits | recipient policy engine |
| Privacy | get/update | privacy adapter + settings projection |
| Webhook Delivery | list, retry | webhook dispatcher + delivery log |
| Trigger | polling `/events` | ordered event persistence |

## Riesgos típicos que ya anticipa el nodo

El propio nodo ya da pistas de los gaps que suele haber en backend:

- `409` no siempre significa idempotencia; también puede significar que la capacidad no está disponible en el estado actual del socket.
- `503` en `/health/deps` puede ser legítimo durante pairing pendiente.
- `400` en grupos suele indicar JID inválido o no grupal.
- `ECONNABORTED`, `ETIMEDOUT` y cierres de socket suelen indicar proxy, cola o latencia, no solo fallo de auth.
- `/pairing/qr` y `/pairing/code` dependen del modo de pairing real configurado en la instancia.

## Checklist de verificación para cada instancia

### Transporte y auth

- `GET /status` responde con API key válida.
- El backend devuelve JSON consistente.
- La instancia soporta timeouts superiores a 30s cuando la operación lo necesita.

### Estado operativo

- `/health`, `/health/deps`, `/status` y `/queues/status` existen y devuelven datos útiles.
- La respuesta de `/status` deja distinguir `open`, `connecting`, `closed`, `pairing`, `qr`.

### Persistencia

- `/events` devuelve eventos ordenables por `occurred_at`.
- `/events/:id` funciona.
- `/chats`, `/contacts`, `/groups`, `/messages/:id`, `/sends` consultan datos persistidos.

### Mensajería

- `/send/text` y `/send/media` aceptan `X-Idempotency-Key`.
- `/sends/preview` no envía nada realmente.
- `/messages/:id/reply`, `forward`, `edit`, `reaction`, `delete` funcionan sobre mensajes persistidos.

### Grupos y privacidad

- Los endpoints de grupo reflejan capacidades reales de la sesión.
- Los enums de privacidad aceptados coinciden con los que usa el nodo.

### Webhooks y trigger

- La instancia persiste eventos antes o durante el envío a webhook.
- `/webhooks/deliveries` y retry existen si el nodo debe usarlos.
- `GET /events` tiene volumen y orden suficientes para polling.

## Secuencia práctica de trabajo recomendada

1. Confirmar qué endpoints ya existen en cada instancia.
2. Validar cuáles tienen lógica real y cuáles son parciales o inexistentes.
3. Implementar primero utilidades transversales: auth, readiness, idempotencia, persistencia de eventos y send store.
4. Activar después snapshots, grupos, privacidad y previews.
5. Cerrar con observabilidad de webhook, history sync y batch tracking.

## Qué significa "paridad suficiente" para dar por cerrada la actualización

Se puede considerar que una instancia está alineada con los nodos cuando:

- el credential test contra `GET /status` pasa
- los sends y previews funcionan con contratos estables
- `GET /events` permite usar `Baileys Trigger`
- chats, grupos y privacidad dejan de depender de `Custom API Request`
- existe observabilidad mínima de colas y deliveries

## Nota importante sobre alcance

Este documento inventaría lo que el nodo espera del backend. No valida automáticamente qué parte de eso ya existe en una instancia concreta de `wa-instance`. Para convertirlo en un informe de gap exacto por instancia, el siguiente paso es ejecutar esta checklist contra cada despliegue y marcar cada endpoint/utilidad como:

- `Disponible`
- `Disponible pero incompleto`
- `No disponible`
- `No aplica`
