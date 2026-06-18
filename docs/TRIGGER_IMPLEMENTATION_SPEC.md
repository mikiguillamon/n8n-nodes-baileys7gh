# Baileys Trigger Implementation Spec

## Node name

- `Baileys Trigger`

## Node type

- `polling trigger`
- not a webhook-registration trigger

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

## Positioning

- `Baileys Trigger` is the built-in option for polling persisted events from `/events`.
- Realtime inbound delivery should use `wa-instance -> WEBHOOK_URL -> n8n Webhook`.
- The trigger must not imply webhook lifecycle registration support that the backend does not expose.

## Implementation notes

- The trigger can share the same transport conventions as the main node even if helpers remain in-file during this parity pass.
- `/events` support already exists in the main action node and should stay aligned with the trigger filters.
- README and docs must describe the trigger as polling and keep webhook ingress as a separate pattern.

## Optional advanced pattern to document

Separate from the trigger node, document this architecture:

- fixed `WEBHOOK_URL` at backend level
- one n8n `Webhook` workflow as ingress
- downstream router workflow for fan-out

This is useful for centralized ingestion, but should not replace the polling trigger as the default implementation.
