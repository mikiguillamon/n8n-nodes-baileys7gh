# Feature Specification: Baileys Node Parity

**Feature Branch**: `001-baileys-node-parity`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Bring the n8n node to parity with the capabilities already present in wa-instance/Baileys 7, following project rules and SDD."

## User Scenarios & Testing

### User Story 1 - Operate Chats, Groups and Privacy Natively (Priority: P1)

As an n8n builder, I want native UI operations for chats, groups and privacy so I can automate operational WhatsApp tasks without falling back to raw HTTP requests.

**Why this priority**: These are the main parity gaps between the current node and the backend surface.

**Independent Test**: Configure the node against a reachable wa-instance and execute one operation from `Chat`, `Group` and `Privacy` successfully without `Custom API Request`.

**Acceptance Scenarios**:

1. **Given** a configured instance, **When** a user selects `Chat -> Mute`, **Then** the node exposes a clear mute/unmute UX and sends the expected `/chats/:jid/mute` payload.
2. **Given** a configured instance, **When** a user selects `Group -> Update Participants`, **Then** the node exposes participants and action controls and calls `/groups/:jid/participants`.
3. **Given** a configured instance, **When** a user selects `Privacy -> Update Last Seen`, **Then** the node restricts values to supported enums and calls `/privacy/last-seen`.

---

### User Story 2 - Keep Existing Messaging and Batch Flows Aligned (Priority: P2)

As an n8n builder, I want existing message and batch operations to stay consistent with the documented backend behavior so I can rely on previews, idempotency and filters.

**Why this priority**: Existing coverage is already broad, but parity requires tightening UX and keeping behavior correct while the node grows.

**Independent Test**: Execute `Message -> Preview Send`, `Message -> Get Many`, `Batch -> Preview Batch` and `Batch -> Send Text Batch` and confirm payload shape and idempotency behavior.

**Acceptance Scenarios**:

1. **Given** `Preview Send`, **When** the user runs a preview, **Then** no `X-Idempotency-Key` is sent and the backend receives the preview payload only.
2. **Given** `Message -> Get Many`, **When** the user sets filters, **Then** the query string uses `status`, `to_jid`, `client_ref`, `from`, `to`, and `limit`.
3. **Given** `Batch -> Preview Batch`, **When** the user selects text or media mode, **Then** the node exposes repeatable item editors rather than requiring raw JSON.

---

### User Story 3 - Keep Trigger and Documentation Coherent (Priority: P3)

As a maintainer, I want the trigger code and docs to clearly distinguish polling from inbound webhook ingestion so the package does not promise unsupported webhook lifecycle behavior.

**Why this priority**: The repo already ships a polling trigger, while the implementation guide recommends the native `Webhook` node for realtime ingress.

**Independent Test**: Review README and trigger docs and confirm they describe `Baileys Trigger` as `/events` polling and `Webhook` as the recommended realtime ingress pattern.

**Acceptance Scenarios**:

1. **Given** the package documentation, **When** a user reads the trigger sections, **Then** they understand that polling is built-in and webhook registration is not.
2. **Given** the existing trigger node, **When** it is reviewed, **Then** no unsupported webhook-managed behavior is implied in docs or code.

### Edge Cases

- A backend can respond with `409` because the socket state does not support the requested capability, not only because of validation or idempotency problems.
- Group operations may return `400` when a non-group JID is used.
- Preview operations must never reuse send-only idempotency behavior.
- `continueOnFail()` must still return a structured per-item error for newly added operations.
- Credential validation must not reject onboarding states where the backend is reachable and authenticated but WhatsApp pairing is still pending.

## Requirements

### Functional Requirements

- **FR-001**: The node MUST expose native `Chat` operations `Get Many`, `Archive`, `Mute`, and `Set Read State`.
- **FR-002**: The node MUST expose native `Group` operations `Get Many`, `Get`, `Create`, `Join`, `Update Subject`, `Update Description`, `Update Participants`, `Update Participant Requests`, `Get Invite Code`, `Revoke Invite Code`, `Update Settings`, and `Update Ephemeral`.
- **FR-003**: The node MUST expose a native `Privacy` resource with `Get Settings`, `Get Blocklist`, `Update Block Status`, `Update Last Seen`, `Update Online`, `Update Profile Photo`, `Update Status`, `Update Groups Add`, `Update Read Receipts`, and `Update Default Disappearing Mode`.
- **FR-004**: Existing `Message`, `Batch`, `Consent`, `Event`, `History Sync`, `Recipient`, `Webhook Delivery`, `Instance`, and `Custom API Request` resources MUST remain available after the parity work.
- **FR-005**: Send operations MUST support generated or manual `X-Idempotency-Key`, while preview operations MUST NOT send that header.
- **FR-006**: The node MUST keep using relative custom API paths and MUST NOT allow changing the host away from the credential `Base URL`.
- **FR-007**: The node MUST return structured item-level errors when `continueOnFail()` is enabled for newly added operations.
- **FR-008**: The node documentation MUST distinguish between polling via `Baileys Trigger` and realtime ingress via the native n8n `Webhook` node.
- **FR-009**: The repository MUST include SDD artifacts for this feature under `specs/001-baileys-node-parity/`.
- **FR-010**: Credential validation MUST use a backend-authenticated status check that succeeds before strict dependency readiness, and docs/errors MUST explain that `GET /health/deps` can still return `503` during pending pairing.

### Key Entities

- **Chat Operation Payload**: JID-scoped archive, mute and read-state payloads for `/chats`.
- **Group Operation Payload**: Subject, description, participant lists, invite codes and settings for `/groups`.
- **Privacy Setting Update**: Enum-constrained `value` or `duration` payloads for `/privacy` and `/settings/disappearing-mode`.
- **Custom API Request**: Relative-path arbitrary request that reuses the same credential host and auth.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All resources and operations listed in the parity plan are visible in the node UI after build.
- **SC-002**: `npm run lint`, `npm run build`, and `./init.sh` complete successfully for the implementation branch.
- **SC-003**: README and trigger docs describe polling and webhook usage without contradicting the implementation guide.
- **SC-004**: New `Chat`, `Group` and `Privacy` operations produce clean request payloads with no raw JSON required for standard usage.

## Assumptions

- The backend API routes and payload shapes described in `N8N_BAILEYS_NODE_IMPLEMENTATION_GUIDE.md` are the current source of truth.
- No backend changes are required in this feature.
- No new external dependency is necessary; implementation stays within the current n8n node package.
- Manual verification plus `lint`, `build`, and `init.sh` are the required quality gates for this feature.
