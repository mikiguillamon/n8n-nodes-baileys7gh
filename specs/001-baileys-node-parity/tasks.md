# Tasks: Baileys Node Parity

## Phase 1 - SDD artifacts

- [x] T001 Create `specs/001-baileys-node-parity/spec.md` covering parity goals, stories and requirements. (`FR-009`)
- [x] T002 Create `specs/001-baileys-node-parity/plan.md` and `research.md` documenting implementation shape and trigger/error decisions. (`FR-008`, `FR-009`)
- [x] T003 Update `feature_list.json` to mark the parity feature as active SDD work. (`FR-009`)

## Phase 2 - Main node parity

- [x] T004 Reorder main node resources and operations to mirror the implementation guide. (`FR-001`, `FR-002`, `FR-003`, `FR-004`)
- [x] T005 Replace snapshot-only `chat/group` handling with dedicated resource executors. (`FR-001`, `FR-002`)
- [x] T006 Add native `Chat` operations and their payload/field modeling. (`FR-001`)
- [x] T007 Add native `Group` operations and field collections for participants, requests and settings. (`FR-002`)
- [x] T008 Add native `Privacy` resource with enum-constrained updates and disappearing-mode support. (`FR-003`)
- [x] T009 Keep send-only idempotency behavior and preserve preview semantics. (`FR-004`, `FR-005`)
- [x] T010 Preserve `Custom API Request` relative-host behavior and structured `continueOnFail()` handling. (`FR-006`, `FR-007`)

## Phase 3 - Documentation alignment

- [x] T011 Update `README.md` to reflect the new parity surface and trigger/webhook positioning. (`FR-008`)
- [x] T012 Update trigger docs so polling and webhook ingress recommendations are explicit and non-contradictory. (`FR-008`)
- [x] T017 Align credential validation and onboarding docs with the updated backend readiness semantics. (`FR-010`)

## Phase 4 - Verification

- [x] T013 Run `npm run lint`. (`SC-002`)
- [x] T014 Run `npm run build`. (`SC-002`)
- [x] T015 Run `./init.sh`. (`SC-002`)
- [x] T016 Record remaining manual verification gaps: backend-dependent live checks for `Chat`, `Group`, `Privacy`, and realtime event delivery still require a reachable wa-instance environment. (`SC-003`, `SC-004`)
