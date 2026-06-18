# Implementation Plan: Baileys Node Parity

**Branch**: `001-baileys-node-parity` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-baileys-node-parity/spec.md`

## Summary

Bring `Baileys Instance` to parity with the documented `wa-instance` surface by completing `Chat`, `Group`, and `Privacy`, tightening message and batch UX alignment, and keeping the polling trigger/docs consistent with the recommended webhook ingress story.

## Technical Context

**Language/Version**: TypeScript 5.9

**Primary Dependencies**: `n8n-workflow`, `@n8n/node-cli`

**Storage**: N/A

**Testing**: `npm run lint`, `npm run build`, `./init.sh`, manual node smoke validation

**Target Platform**: n8n community node for self-hosted n8n

**Project Type**: Node package / integration plugin

**Performance Goals**: No regression in current node execution behavior; clean per-item request execution

**Constraints**: No new dependencies, no backend changes, preserve `continueOnFail()`, keep `Custom API Request` host-relative

**Scale/Scope**: One node package, one main action node, one existing polling trigger, docs and SDD artifacts

## Constitution Check

- `AGENTS.md` read and followed.
- Feature work is isolated to SDD artifacts, node implementation, and related documentation.
- Verification commands come from `harness.config.json` and `AGENTS.md`.
- No unrelated refactors or added dependencies.

## Project Structure

### Documentation

```text
specs/001-baileys-node-parity/
├── spec.md
├── plan.md
├── research.md
└── tasks.md
```

### Source Code

```text
credentials/
nodes/
├── BaileysInstance/
│   └── BaileysInstance.node.ts
├── BaileysTrigger/
│   └── BaileysTrigger.node.ts
docs/
README.md
feature_list.json
```

**Structure Decision**: Keep the implementation in the existing package layout and extend the main node file rather than introducing new modules during this parity pass.

## Implementation Changes

### Main node

- Reorder resources to follow the implementation guide.
- Add `Privacy` as a first-class resource.
- Replace the snapshot-only `chat/group` executor pattern with resource-specific handlers.
- Model group participants, chat mute, privacy values, and batch items with native repeatable n8n fields.
- Keep idempotency headers only on send actions.

### Existing resources alignment

- Preserve all current `Instance`, `Message`, `Batch`, `Consent`, `Event`, `History Sync`, `Recipient`, `Webhook Delivery`, and `Custom API Request` operations.
- Keep `Message -> Get Many` filter mapping aligned with the guide.
- Keep previews free of idempotency headers.
- Keep `continueOnFail()` behavior for new operations.

### Trigger and docs

- Review the existing polling trigger for parity contradictions.
- Keep the trigger as `/events` polling.
- Clarify in README and trigger docs that realtime inbound ingestion should use the native n8n `Webhook` node via `WEBHOOK_URL`.

## Risks and Tradeoffs

- The main node still lives in a single large file; this keeps scope down but limits modularity.
- Several backend operations can fail with stateful `409` responses; the node needs useful hints without guessing backend internals.
- The package ships both a polling trigger and a webhook recommendation, so wording must stay precise to avoid false expectations.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Run `./init.sh`.
- Manually validate payload shape and visibility for:
  - `Chat`
  - `Group`
  - `Privacy`
  - `Message` and `Batch` previews
  - `Custom API Request`
  - `continueOnFail()`
