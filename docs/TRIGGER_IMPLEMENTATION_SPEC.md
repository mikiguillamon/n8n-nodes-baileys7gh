# Baileys Trigger Implementation Spec

## Node name

- `Baileys Trigger`

## Node type

- `polling trigger`

## Source endpoint

- `GET /events`

## Supported API filters

The backend currently supports these query params:

- `event_type`
- `entity_type`
- `message_id`
- `limit`

## Trigger UX

### Top-level fields

- `Trigger On`
- `Polling Interval`
- `Options`

### `Trigger On`

Options:

- `All Events`
- `Message Events`
- `Chat Events`
- `Contact Events`
- `Group Events`
- `Custom Filter`

Mapping:

- `Message Events` sets an opinionated default `entity_type`
- `Custom Filter` exposes raw `event_type`, `entity_type`, and `message_id`

### `Polling Interval`

Use standard n8n polling controls.

### `Options`

- `Event Type`
- `Entity Type`
- `Message ID`
- `Limit`
- `First Run Behavior`

### `First Run Behavior`

Options:

- `Emit Latest Only`
- `Emit Nothing And Start From Now`
- `Emit All Retrieved`

Recommended default:

- `Emit Nothing And Start From Now`

## Output contract

Emit one item per event.

Suggested output shape:

```json
{
  "event_id": "evt_123",
  "instance_id": "wa_001",
  "event_type": "message.upsert",
  "occurred_at": "2026-06-17T19:00:00.000Z",
  "message_id": "abc",
  "chat_jid": "34600111222@s.whatsapp.net",
  "from_jid": "34600111222@s.whatsapp.net",
  "from_me": false,
  "message_type": "conversation",
  "text": "hola",
  "media": null,
  "raw_min": {}
}
```

## Cursor strategy

Use workflow static data to store:

- `lastEventId`
- `lastOccurredAt`
- `initialized`

Recommended comparison order:

1. `occurred_at`
2. `event_id` as tiebreaker

## Poll algorithm

1. Fetch `/events` with configured filters and `limit`
2. Normalize `items` array
3. Sort ascending by `occurred_at`, then `event_id`
4. If first run:
   - apply `First Run Behavior`
   - save newest cursor
5. If not first run:
   - keep only events newer than stored cursor
   - emit remaining events in ascending order
   - update cursor to newest emitted event

## Deduplication rule

An event is new if:

- `occurred_at` is greater than the stored cursor time

or:

- `occurred_at` is equal and `event_id` is lexically greater than the stored `lastEventId`

## Error behavior

- auth and transport failures should fail the trigger execution
- empty results should return no items without error
- malformed payloads should surface as `NodeApiError`

## Future-compatible helper extraction

Before implementing the trigger, extract shared transport logic from the main node into reusable helpers:

- `nodes/BaileysInstance/transport/request.ts`
- `nodes/BaileysInstance/transport/helpers.ts`
- `nodes/BaileysInstance/transport/errors.ts`

The trigger should reuse the same:

- base URL normalization
- credential handling
- TLS setting handling
- error mapping

## Recommended implementation tasks

1. Extract HTTP transport from `BaileysInstance.node.ts`
2. Add `/events` support to the main action node as an `Event` resource
3. Implement `BaileysTrigger.node.ts`
4. Register trigger node in `package.json`
5. Add README section with trigger examples
6. Test first-run and dedup behavior

## Optional advanced pattern to document

Separate from the trigger node, document this architecture:

- fixed `WEBHOOK_URL` at backend level
- one n8n `Webhook` workflow as ingress
- downstream router workflow for fan-out

This is useful for centralized ingestion, but should not replace the polling trigger as the default implementation.
