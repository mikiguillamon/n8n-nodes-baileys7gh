# n8n-nodes-baileys-instance

Community node de n8n para consumir una instancia `wa-instance` basada en Baileys 7 de forma guiada, operativa y preparada para agentes.

## Qué incluye

- Recurso `Instance` para health, status, pairing, logout, colas y webhook test
- Recurso `Message` para texto, media, previews, consulta de outbounds e inbound persistido
- Recurso `Batch` para envíos y previews batch
- Recurso `Chat` para snapshots persistidos de chats
- Recurso `Contact` para snapshots persistidos de contactos
- Recurso `Consent` para alta, revocación y consulta
- Recurso `Event` para inspección de eventos persistidos
- Recurso `Group` para snapshots persistidos de grupos
- Recurso `History Sync` para estado y fetch on-demand de historial
- Recurso `Recipient` para límites operativos por JID
- Recurso `Webhook Delivery` para inspección y retry
- Recurso `Custom API Request` como escape hatch
- `usableAsTool: true` para poder reutilizarlo como Tool dentro de flujos/agentes de n8n
- Nodo `Baileys Trigger` para polling de eventos persistidos en `/events`

## Requisitos

- n8n self-hosted con soporte para community nodes
- Una instancia `wa-instance` accesible por HTTP/HTTPS
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

### Message

- Send Text
- Send Media
- Preview Send
- Get
- Get Many
- Get Inbound Message

### Batch

- Send Text Batch
- Send Media Batch
- Preview Batch
- Get

### Consent

- Upsert
- Revoke
- Get

### Chat

- Get Many

### Contact

- Get Many

### Recipient

- Get Limits

### Event

- Get
- Get Many

### Group

- Get Many

### History Sync

- Get Status
- Fetch

### Webhook Delivery

- Get Many
- Retry

### Custom API Request

- Execute

## Notas de uso

- Los endpoints de envío añaden `X-Idempotency-Key` automáticamente si no se informa una clave manual.
- `Preview Send` y `Preview Batch` están pensados para validar policy, normalización y destinatario antes de enviar.
- Para recibir eventos inbound se recomienda usar el nodo nativo `Webhook` de n8n y configurar `WEBHOOK_URL` en `wa-instance`.
- `Custom API Request` reutiliza el mismo host y autenticación del credential, sin permitir cambiar de servidor.

## Desarrollo local

```bash
npm install
npm run build
npm run dev
```

## Publicacion en npm

Este paquete esta preparado para publicarse como paquete publico de npm y para cumplir el flujo recomendado por n8n con GitHub Actions + provenance.

### Flujo recomendado

1. Configura el Trusted Publisher del paquete en npm para este repositorio y el workflow `publish.yml`.
2. Haz un release con:

```bash
npm run release
```

3. El tag `v*` disparara GitHub Actions y publicara el paquete en npm.

### Publicacion manual

Si solo quieres hacer una publicacion inicial manual y no te importa todavia la verificacion de n8n:

```bash
npm login
npm publish --access public
```

Para verificacion en n8n, la publicacion correcta es desde GitHub Actions con provenance.

## Conversión futura a Tool/MCP

El nodo ya queda marcado con `usableAsTool: true`, así que el siguiente paso natural dentro de n8n es:

1. Exponer las operaciones más útiles como Tool en el flujo/agente.
2. Mantener `Custom API Request` para cubrir endpoints nuevos sin rehacer el nodo.
3. Si más adelante la API añade registro dinámico de webhooks, valorar un trigger dedicado o una capa MCP más declarativa.

## Trigger

El paquete incluye ya un `Baileys Trigger` en modo **polling sobre `/events`**.

No se recomienda que la primera version del trigger dependa de un webhook fijo compartido por cuenta, porque la API actual no registra webhooks por endpoint y ese patron complica mucho la propiedad de cada workflow.

Documentacion preparada:

- [Trigger architecture](./docs/TRIGGER_ARCHITECTURE.md)
- [Trigger implementation spec](./docs/TRIGGER_IMPLEMENTATION_SPEC.md)
