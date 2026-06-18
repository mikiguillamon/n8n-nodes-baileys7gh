# n8n-nodes-baileys-instance

Community node de n8n para consumir una instancia `wa-instance` basada en Baileys 7 con una UI guiada, operativa y preparada para agentes.

## Qué incluye

- Recurso `Instance` para health, status, pairing, logout, colas y webhook test
- Recurso `History Sync` para estado y fetch on-demand
- Recurso `Event` para inspección de eventos persistidos
- Recurso `Chat` para snapshots, archive, mute y read state
- Recurso `Contact` para snapshots persistidos
- Recurso `Group` para snapshots y gestión operativa real
- Recurso `Message` para texto, media, previews y operaciones avanzadas
- Recurso `Batch` para envíos y previews batch
- Recurso `Consent` para alta, revocación y consulta
- Recurso `Recipient` para límites operativos por JID
- Recurso `Privacy` para settings, blocklist y updates de visibilidad
- Recurso `Webhook Delivery` para inspección y retry
- Recurso `Custom API Request` como escape hatch
- `usableAsTool: true` para reutilizar el nodo como tool dentro de flujos/agentes de n8n
- Nodo `Baileys Trigger` para polling de eventos persistidos en `/events`

## Requisitos

- n8n self-hosted con soporte para community nodes
- una instancia `wa-instance` accesible por HTTP/HTTPS
- API key válida del backend

## Credenciales

El credential `Baileys Instance API` pide:

- `Base URL`
- `API Key`
- `Timeout (ms)`
- `Allow Self-Signed TLS Certificates`

La comprobación de credenciales usa `GET /health/deps`.

## Recursos y operaciones

### Instance

- Get Health
- Get Dependencies Health
- Get Status
- Get Queue Status
- Get Pairing QR
- Request Pairing Code
- Logout Session
- Send Webhook Test

### History Sync

- Get Status
- Fetch

### Event

- Get Many
- Get

### Chat

- Get Many
- Archive
- Mute
- Set Read State

### Contact

- Get Many

### Group

- Get Many
- Get
- Create
- Join
- Update Subject
- Update Description
- Update Participants
- Update Participant Requests
- Get Invite Code
- Revoke Invite Code
- Update Settings
- Update Ephemeral

### Message

- Send Text
- Send Media
- Preview Send
- Get
- Get Many
- Get Inbound Message
- Reply
- Forward
- Delete
- Edit
- React
- Mark Read
- Send Receipts
- Refresh Media

### Batch

- Send Text Batch
- Send Media Batch
- Preview Batch
- Get

### Consent

- Upsert
- Revoke
- Get

### Recipient

- Get Limits

### Privacy

- Get Settings
- Get Blocklist
- Update Block Status
- Update Last Seen
- Update Online
- Update Profile Photo
- Update Status
- Update Groups Add
- Update Read Receipts
- Update Default Disappearing Mode

### Webhook Delivery

- Get Many
- Retry

### Custom API Request

- Execute

## Notas de uso

- Los endpoints de envío añaden `X-Idempotency-Key` automáticamente si no se informa una clave manual.
- `Preview Send` y `Preview Batch` validan policy, normalización y destinatario antes de enviar, y no envían `X-Idempotency-Key`.
- `Custom API Request` reutiliza el mismo host y autenticación del credential, sin permitir cambiar de servidor.
- Algunas operaciones pueden devolver `409` cuando la capacidad no está disponible en el estado actual del socket/backend.
- Para tareas habituales usa los recursos modelados; `Custom API Request` queda como escape hatch para endpoints nuevos o no modelados.

## Trigger y webhooks

El paquete incluye `Baileys Trigger` en modo **polling sobre `/events`**.

Esto significa:

- el trigger integrado sirve para consumir eventos persistidos desde el backend mediante polling
- no registra ni gestiona webhooks dinámicos en `wa-instance`
- no sustituye la ingesta realtime vía webhook del backend

Para eventos inbound realtime, la vía recomendada es:

1. configurar `WEBHOOK_URL` en `wa-instance`
2. recibir los eventos con el nodo nativo `Webhook` de n8n
3. enrutar por `event_type`, `instance_id` o reglas de negocio dentro del workflow

Documentación relacionada:

- [Trigger architecture](./docs/TRIGGER_ARCHITECTURE.md)
- [Trigger implementation spec](./docs/TRIGGER_IMPLEMENTATION_SPEC.md)

## Desarrollo local

```bash
npm install
npm run build
npm run dev
```

## Publicación en npm

Este paquete está preparado para publicarse como paquete público de npm y seguir el flujo recomendado por n8n con GitHub Actions + provenance.

### Flujo recomendado

1. Configura el Trusted Publisher del paquete en npm para este repositorio y el workflow `publish.yml`.
2. Haz un release con:

```bash
npm run release
```

3. El tag `v*` disparará GitHub Actions y publicará el paquete en npm.

### Publicación manual

```bash
npm login
npm publish --access public
```

Para verificación en n8n, la publicación recomendada es desde GitHub Actions con provenance.
