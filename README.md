# n8n-nodes-baileys-instance

Community node de n8n para consumir una instancia `wa-instance` basada en Baileys 7 de forma guiada, operativa y preparada para agentes.

## Qué incluye

- Recurso `Instance` para health, status, pairing, logout, colas y webhook test
- Recurso `Message` para texto, media, previews, consulta de outbounds e inbound persistido
- Recurso `Batch` para envíos y previews batch
- Recurso `Consent` para alta, revocación y consulta
- Recurso `Recipient` para límites operativos por JID
- Recurso `Webhook Delivery` para inspección y retry
- Recurso `Custom API Request` como escape hatch
- `usableAsTool: true` para poder reutilizarlo como Tool dentro de flujos/agentes de n8n

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

### Recipient

- Get Limits

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

## Conversión futura a Tool/MCP

El nodo ya queda marcado con `usableAsTool: true`, así que el siguiente paso natural dentro de n8n es:

1. Exponer las operaciones más útiles como Tool en el flujo/agente.
2. Mantener `Custom API Request` para cubrir endpoints nuevos sin rehacer el nodo.
3. Si más adelante la API añade registro dinámico de webhooks, valorar un trigger dedicado o una capa MCP más declarativa.
