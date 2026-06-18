# Research Notes: Baileys Node Parity

## Trigger stance

- The repository already ships `BaileysTrigger` as a polling trigger over `GET /events`.
- The backend still does not expose webhook registration lifecycle endpoints.
- The implementation guide recommends the native n8n `Webhook` node for realtime inbound delivery via backend `WEBHOOK_URL`.
- Decision: keep the trigger, position it clearly as polling, and resolve the tension through documentation rather than a trigger redesign.

## Credential and readiness stance

- The backend can return `200` on `GET /status` even when the WhatsApp connection is not open yet.
- `GET /health/deps` is a stricter readiness check and can legitimately return `503` before pairing is complete.
- Decision: use `GET /status` for the credential test so onboarding states are treated as authenticated but not ready.
- Decision: keep `Get Dependencies Health` as an explicit operational check and document the distinction in README and node error hints.

## Error mapping

- `409` must not be treated as idempotency-only.
- For parity work, the node should give a generic capability/state hint on `409`, with a more specific hint when the backend message mentions idempotency reuse.
- `404` should surface as missing backend resource.
- `400` on group operations should hint at invalid or non-group JIDs when the backend message suggests it.

## UX modeling

- Native repeatable collections are preferred over JSON entry for batch items, participant lists, message IDs and keys.
- `Chat -> Mute` needs an explicit mode split to avoid requiring incompatible inputs.
- `Group -> Update Settings` should accept one or more optional values but fail fast in-node if the body would be empty.
