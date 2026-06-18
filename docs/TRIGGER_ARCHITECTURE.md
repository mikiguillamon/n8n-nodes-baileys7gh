# Baileys Trigger Architecture

## Decision

Add a native `Baileys Trigger` node, but implement it in **polling mode first**, not as a webhook-registration trigger.

## Why

The current `wa-instance` API:

- exposes persisted events through `GET /events`
- exposes single event lookup through `GET /events/:event_id`
- does **not** expose webhook registration or webhook lifecycle management by API
- sends outbound webhooks to a single `WEBHOOK_URL` configured at the backend level

Because of that, a classic n8n trigger with activate/deactivate registration is not a good fit yet.

## Recommended v1

Create a trigger node that:

- polls `GET /events`
- filters by event type, entity type, or message ID when configured
- deduplicates by `event_id`
- stores the last seen cursor in static workflow data
- emits one n8n item per new event

This gives us:

- a true reusable trigger node
- no dependence on backend webhook registration support
- one trigger per workflow, which is the standard and safest n8n model

## Why not a fixed shared webhook as the main trigger

A single static webhook per account sounds convenient, but it introduces product and operational problems:

- multiple workflows cannot safely "own" the same trigger endpoint
- routing logic becomes a second system that must decide which workflow gets which event
- workflow activation/deactivation no longer maps cleanly to trigger lifecycle
- replay, filtering, and deduplication become harder to reason about

That pattern is still useful, but it should be treated as an **advanced integration pattern**, not as the base trigger implementation.

## Recommended product stance

### Primary trigger mode

`Baileys Trigger` using polling over `/events`

### Advanced alternative

Documented "shared ingress" pattern:

- `wa-instance` -> fixed backend `WEBHOOK_URL`
- one n8n `Webhook` workflow receives all events
- a router workflow dispatches by `event_type`, `instance_id`, or business rules

## Scope for v1 trigger

Include:

- polling trigger
- event type filters
- entity type filters
- optional message ID filter
- max events per poll
- dedup by `event_id`
- optional "emit only newest on first run" behavior

Do not include yet:

- dynamic webhook registration
- multiple trigger modes in the same node
- shared static webhook orchestration inside the node

## Future v2

If the backend later exposes endpoints such as:

- create webhook
- update webhook
- delete webhook
- list webhooks

then we can add a second trigger mode:

- `Webhook Registration`

At that point the trigger node can decide between:

- `Polling`
- `Managed Webhook`

