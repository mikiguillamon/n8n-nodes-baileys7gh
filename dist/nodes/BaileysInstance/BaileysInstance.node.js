"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaileysInstance = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const resourceProperty = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    default: 'instance',
    options: [
        { name: 'Batch', value: 'batch' },
        { name: 'Chat', value: 'chat' },
        { name: 'Consent', value: 'consent' },
        { name: 'Contact', value: 'contact' },
        { name: 'Custom API Request', value: 'customApiRequest' },
        { name: 'Event', value: 'event' },
        { name: 'Group', value: 'group' },
        { name: 'History Sync', value: 'historySync' },
        { name: 'Instance', value: 'instance' },
        { name: 'Message', value: 'message' },
        { name: 'Privacy', value: 'privacy' },
        { name: 'Recipient', value: 'recipient' },
        { name: 'Webhook Delivery', value: 'webhookDelivery' },
    ],
};
const instanceOperations = createOperationProperty('instance', 'getHealth', [
    {
        name: 'Get Health',
        value: 'getHealth',
        description: 'Run a basic smoke check against the instance',
        action: 'Get instance health',
    },
    {
        name: 'Get Dependencies Health',
        value: 'getDependenciesHealth',
        description: 'Check Postgres, Redis, MinIO and WhatsApp readiness',
        action: 'Get instance dependencies health',
    },
    {
        name: 'Get Status',
        value: 'getStatus',
        description: 'Read the current WhatsApp session state',
        action: 'Get instance status',
    },
    {
        name: 'Get Queue Status',
        value: 'getQueueStatus',
        description: 'Inspect outbound and webhook queue health',
        action: 'Get instance queue status',
    },
    {
        name: 'Get Pairing QR',
        value: 'getPairingQr',
        description: 'Fetch the current QR when the instance is in QR pairing mode',
        action: 'Get pairing qr',
    },
    {
        name: 'Request Pairing Code',
        value: 'requestPairingCode',
        description: 'Request a pairing code when the instance is in code pairing mode',
        action: 'Request pairing code',
    },
    {
        name: 'Logout Session',
        value: 'logoutSession',
        description: 'Logout the current session and optionally purge auth',
        action: 'Logout session',
    },
    {
        name: 'Send Webhook Test',
        value: 'sendWebhookTest',
        description: 'Trigger a webhook test event from the backend',
        action: 'Send webhook test',
    },
]);
const historySyncOperations = createOperationProperty('historySync', 'getStatus', [
    {
        name: 'Get Status',
        value: 'getStatus',
        description: 'Get the current history sync status',
        action: 'Get history sync status',
    },
    {
        name: 'Fetch',
        value: 'fetch',
        description: 'Fetch older messages on demand from a reference message',
        action: 'Fetch history sync',
    },
]);
const eventOperations = createOperationProperty('event', 'getMany', [
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List persisted events with filters',
        action: 'Get many events',
    },
    {
        name: 'Get',
        value: 'get',
        description: 'Get a single persisted event by ID',
        action: 'Get event',
    },
]);
const chatOperations = createOperationProperty('chat', 'getMany', [
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List persisted chat snapshots',
        action: 'Get many chats',
    },
    {
        name: 'Archive',
        value: 'archive',
        description: 'Archive or unarchive a chat',
        action: 'Archive chat',
    },
    {
        name: 'Mute',
        value: 'mute',
        description: 'Mute until a date or unmute a chat',
        action: 'Mute chat',
    },
    {
        name: 'Set Read State',
        value: 'setReadState',
        description: 'Set the read state for a chat',
        action: 'Set chat read state',
    },
]);
const contactOperations = createOperationProperty('contact', 'getMany', [
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List persisted contact snapshots',
        action: 'Get many contacts',
    },
]);
const groupOperations = createOperationProperty('group', 'getMany', [
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List persisted group snapshots',
        action: 'Get many groups',
    },
    {
        name: 'Get',
        value: 'get',
        description: 'Get a single group snapshot by JID',
        action: 'Get group',
    },
    {
        name: 'Create',
        value: 'create',
        description: 'Create a group with a subject and participants',
        action: 'Create group',
    },
    {
        name: 'Join',
        value: 'join',
        description: 'Join a group through an invite code',
        action: 'Join group',
    },
    {
        name: 'Update Subject',
        value: 'updateSubject',
        description: 'Update the group subject',
        action: 'Update group subject',
    },
    {
        name: 'Update Description',
        value: 'updateDescription',
        description: 'Update the group description',
        action: 'Update group description',
    },
    {
        name: 'Update Participants',
        value: 'updateParticipants',
        description: 'Add, remove, promote or demote participants',
        action: 'Update group participants',
    },
    {
        name: 'Update Participant Requests',
        value: 'updateParticipantRequests',
        description: 'Approve or reject participant requests',
        action: 'Update group participant requests',
    },
    {
        name: 'Get Invite Code',
        value: 'getInviteCode',
        description: 'Get the current invite code',
        action: 'Get group invite code',
    },
    {
        name: 'Revoke Invite Code',
        value: 'revokeInviteCode',
        description: 'Revoke the current invite code',
        action: 'Revoke group invite code',
    },
    {
        name: 'Update Settings',
        value: 'updateSettings',
        description: 'Update one or more group settings',
        action: 'Update group settings',
    },
    {
        name: 'Update Ephemeral',
        value: 'updateEphemeral',
        description: 'Update the group ephemeral expiration',
        action: 'Update group ephemeral mode',
    },
]);
const messageOperations = createOperationProperty('message', 'sendText', [
    {
        name: 'Send Text',
        value: 'sendText',
        description: 'Send one text or a text sequence',
        action: 'Send text',
    },
    {
        name: 'Send Media',
        value: 'sendMedia',
        description: 'Send a single media message',
        action: 'Send media',
    },
    {
        name: 'Preview Send',
        value: 'previewSend',
        description: 'Validate policy and normalization without sending',
        action: 'Preview send',
    },
    {
        name: 'Get',
        value: 'get',
        description: 'Get a single outbound message by ID',
        action: 'Get message',
    },
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List outbound messages with filters',
        action: 'Get many messages',
    },
    {
        name: 'Get Inbound Message',
        value: 'getInboundMessage',
        description: 'Inspect a persisted inbound message by ID',
        action: 'Get inbound message',
    },
    {
        name: 'Reply',
        value: 'reply',
        description: 'Reply to a persisted message by ID',
        action: 'Reply to message',
    },
    {
        name: 'Forward',
        value: 'forward',
        description: 'Forward a message to another recipient',
        action: 'Forward message',
    },
    {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a message by ID',
        action: 'Delete message',
    },
    {
        name: 'Edit',
        value: 'edit',
        description: 'Edit a message by ID',
        action: 'Edit message',
    },
    {
        name: 'React',
        value: 'react',
        description: 'React to a message by ID',
        action: 'React to message',
    },
    {
        name: 'Mark Read',
        value: 'markRead',
        description: 'Mark one or more message keys as read',
        action: 'Mark messages read',
    },
    {
        name: 'Send Receipts',
        value: 'sendReceipts',
        description: 'Send receipts for one or more messages',
        action: 'Send message receipts',
    },
    {
        name: 'Refresh Media',
        value: 'refreshMedia',
        description: 'Refresh media for a persisted message',
        action: 'Refresh message media',
    },
]);
const batchOperations = createOperationProperty('batch', 'sendTextBatch', [
    {
        name: 'Send Text Batch',
        value: 'sendTextBatch',
        description: 'Queue a homogeneous text batch',
        action: 'Send text batch',
    },
    {
        name: 'Send Media Batch',
        value: 'sendMediaBatch',
        description: 'Queue a homogeneous media batch',
        action: 'Send media batch',
    },
    {
        name: 'Preview Batch',
        value: 'previewBatch',
        description: 'Validate a batch without sending',
        action: 'Preview batch',
    },
    {
        name: 'Get',
        value: 'get',
        description: 'Get a batch by ID',
        action: 'Get batch',
    },
]);
const consentOperations = createOperationProperty('consent', 'upsert', [
    {
        name: 'Create or Update',
        value: 'upsert',
        description: 'Create a new record, or update the current one if it already exists (upsert)',
        action: 'Upsert consent',
    },
    {
        name: 'Revoke',
        value: 'revoke',
        description: 'Revoke consent for a JID',
        action: 'Revoke consent',
    },
    {
        name: 'Get',
        value: 'get',
        description: 'Get the current consent record for a JID',
        action: 'Get consent',
    },
]);
const recipientOperations = createOperationProperty('recipient', 'getLimits', [
    {
        name: 'Get Limits',
        value: 'getLimits',
        description: 'Read policy and operational limits for a recipient',
        action: 'Get recipient limits',
    },
]);
const privacyOperations = createOperationProperty('privacy', 'getSettings', [
    {
        name: 'Get Settings',
        value: 'getSettings',
        description: 'Get current privacy settings',
        action: 'Get privacy settings',
    },
    {
        name: 'Get Blocklist',
        value: 'getBlocklist',
        description: 'Get the current privacy blocklist',
        action: 'Get privacy blocklist',
    },
    {
        name: 'Update Block Status',
        value: 'updateBlockStatus',
        description: 'Block or unblock a JID',
        action: 'Update privacy block status',
    },
    {
        name: 'Update Last Seen',
        value: 'updateLastSeen',
        description: 'Update last seen visibility',
        action: 'Update last seen privacy',
    },
    {
        name: 'Update Online',
        value: 'updateOnline',
        description: 'Update online visibility',
        action: 'Update online privacy',
    },
    {
        name: 'Update Profile Photo',
        value: 'updateProfilePhoto',
        description: 'Update profile photo privacy',
        action: 'Update profile photo privacy',
    },
    {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update status privacy',
        action: 'Update status privacy',
    },
    {
        name: 'Update Groups Add',
        value: 'updateGroupsAdd',
        description: 'Update who can add this account to groups',
        action: 'Update groups add privacy',
    },
    {
        name: 'Update Read Receipts',
        value: 'updateReadReceipts',
        description: 'Update read receipts privacy',
        action: 'Update read receipts privacy',
    },
    {
        name: 'Update Default Disappearing Mode',
        value: 'updateDefaultDisappearingMode',
        description: 'Update the default disappearing mode duration in seconds',
        action: 'Update default disappearing mode',
    },
]);
const webhookDeliveryOperations = createOperationProperty('webhookDelivery', 'getMany', [
    {
        name: 'Get Many',
        value: 'getMany',
        description: 'List webhook deliveries with filters',
        action: 'Get many webhook deliveries',
    },
    {
        name: 'Retry',
        value: 'retry',
        description: 'Retry a webhook delivery',
        action: 'Retry webhook delivery',
    },
]);
const customApiRequestOperations = createOperationProperty('customApiRequest', 'execute', [
    {
        name: 'Execute',
        value: 'execute',
        description: 'Call a relative path on the wa-instance API',
        action: 'Execute custom API request',
    },
]);
const operationProperties = [
    {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        placeholder: '34600111222',
        description: 'International number to pair. If empty, the backend falls back to WA_PHONE_NUMBER.',
        displayOptions: {
            show: { resource: ['instance'], operation: ['requestPairingCode'] },
        },
    },
    {
        displayName: 'Purge Auth',
        name: 'purgeAuth',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: { resource: ['instance'], operation: ['logoutSession'] },
        },
    },
    {
        displayName: 'Reconnect',
        name: 'reconnect',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: { resource: ['instance'], operation: ['logoutSession'] },
        },
    },
    {
        displayName: 'Text',
        name: 'webhookTestText',
        type: 'string',
        default: '',
        description: 'Optional text payload for the webhook test event',
        displayOptions: {
            show: { resource: ['instance'], operation: ['sendWebhookTest'] },
        },
    },
    {
        displayName: 'To',
        name: 'to',
        type: 'string',
        default: '',
        placeholder: '34600111222 or 34600111222@s.whatsapp.net',
        description: 'Phone number, PN JID or LID JID. The backend can resolve PN/LID if RECIPIENT_LOOKUP is enabled.',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendText', 'sendMedia', 'previewSend'],
            },
        },
    },
    {
        displayName: 'Content Mode',
        name: 'contentMode',
        type: 'options',
        default: 'singleText',
        options: [
            { name: 'Single Text', value: 'singleText' },
            { name: 'Text Sequence', value: 'textSequence' },
        ],
        description: 'Text sequences can contain up to 20 messages',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendText', 'previewSend'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        typeOptions: { rows: 3 },
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendText', 'previewSend'],
                contentMode: ['singleText'],
            },
        },
    },
    {
        displayName: 'Texts',
        name: 'texts',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        description: 'Ordered sequence of text messages',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendText', 'previewSend'],
                contentMode: ['textSequence'],
            },
        },
        options: [
            {
                name: 'values',
                displayName: 'Texts',
                values: [
                    {
                        displayName: 'Text',
                        name: 'text',
                        type: 'string',
                        default: '',
                        typeOptions: { rows: 2 },
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Preview Type',
        name: 'previewType',
        type: 'options',
        default: 'text',
        options: [
            { name: 'Text', value: 'text' },
            { name: 'Media', value: 'media' },
        ],
        displayOptions: {
            show: { resource: ['message'], operation: ['previewSend'] },
        },
    },
    {
        displayName: 'Media URL',
        name: 'mediaUrl',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/file.pdf',
        displayOptions: {
            show: { resource: ['message'], operation: ['sendMedia'] },
        },
    },
    {
        displayName: 'Media URL',
        name: 'previewMediaUrl',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/file.pdf',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['previewSend'],
                previewType: ['media'],
            },
        },
    },
    {
        displayName: 'Additional Options',
        name: 'messageAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['sendText', 'sendMedia'] },
        },
        options: [
            { displayName: 'Audio Duration (Ms)', name: 'audioDurationMs', type: 'number', default: 0 },
            { displayName: 'Caption', name: 'caption', type: 'string', default: '' },
            { displayName: 'Client Ref', name: 'clientRef', type: 'string', default: '' },
            { displayName: 'File Name', name: 'fileName', type: 'string', default: '' },
            {
                displayName: 'Generate Automatically',
                name: 'generateIdempotencyKey',
                type: 'boolean',
                default: true,
                description: 'Whether to generate a unique X-Idempotency-Key per n8n item when no manual key is provided',
            },
            { displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
            { displayName: 'MIME Type', name: 'mimeType', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'messagePreviewAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['previewSend'] },
        },
        options: [
            { displayName: 'Audio Duration (Ms)', name: 'audioDurationMs', type: 'number', default: 0 },
            { displayName: 'Caption', name: 'caption', type: 'string', default: '' },
            { displayName: 'MIME Type', name: 'mimeType', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['get', 'getInboundMessage', 'reply', 'forward', 'delete', 'edit', 'react', 'refreshMedia'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'messageActionText',
        type: 'string',
        default: '',
        typeOptions: { rows: 3 },
        displayOptions: {
            show: { resource: ['message'], operation: ['reply', 'edit'] },
        },
    },
    {
        displayName: 'Forward To',
        name: 'forwardTo',
        type: 'string',
        default: '',
        placeholder: '34600111222 or 34600111222@s.whatsapp.net',
        displayOptions: {
            show: { resource: ['message'], operation: ['forward'] },
        },
    },
    {
        displayName: 'Emoji',
        name: 'reactionEmoji',
        type: 'string',
        default: '',
        description: 'Reaction emoji. Leave empty to remove the reaction when supported by the backend.',
        displayOptions: {
            show: { resource: ['message'], operation: ['react'] },
        },
    },
    {
        displayName: 'Filters',
        name: 'messageFilters',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['getMany'] },
        },
        options: [
            { displayName: 'Client Ref', name: 'clientRef', type: 'string', default: '' },
            { displayName: 'From', name: 'from', type: 'dateTime', default: '' },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                description: 'Max number of results to return',
                typeOptions: { minValue: 1, maxValue: 100 },
            },
            { displayName: 'Status', name: 'status', type: 'string', default: '' },
            { displayName: 'To', name: 'to', type: 'dateTime', default: '' },
            { displayName: 'To JID', name: 'toJid', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'messageActionAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['reply', 'forward', 'delete', 'edit', 'react'] },
        },
        options: [
            {
                displayName: 'Force',
                name: 'force',
                type: 'boolean',
                default: false,
                displayOptions: { show: { '/operation': ['forward'] } },
            },
            {
                displayName: 'Generate Automatically',
                name: 'generateIdempotencyKey',
                type: 'boolean',
                default: true,
                description: 'Whether to generate a unique X-Idempotency-Key per n8n item when no manual key is provided',
            },
            { displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Keys',
        name: 'messageReadKeys',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['markRead'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Keys',
                values: [
                    { displayName: 'From Me', name: 'fromMe', type: 'boolean', default: false },
                    { displayName: 'Message ID', name: 'id', type: 'string', default: '' },
                    { displayName: 'Participant', name: 'participant', type: 'string', default: '' },
                    { displayName: 'Remote JID', name: 'remoteJid', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'JID',
        name: 'messageReceiptsJid',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['message'], operation: ['sendReceipts'] },
        },
    },
    {
        displayName: 'Message IDs',
        name: 'messageReceiptIds',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['sendReceipts'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Message IDs',
                values: [{ displayName: 'Message ID', name: 'messageId', type: 'string', default: '' }],
            },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'messageReceiptsAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['message'], operation: ['sendReceipts'] },
        },
        options: [
            { displayName: 'Participant', name: 'participant', type: 'string', default: '' },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                default: '',
                options: [
                    { name: 'Default', value: '' },
                    { name: 'Hist Sync', value: 'hist_sync' },
                    { name: 'Inactive', value: 'inactive' },
                    { name: 'Peer Msg', value: 'peer_msg' },
                    { name: 'Played', value: 'played' },
                    { name: 'Read', value: 'read' },
                    { name: 'Read Self', value: 'read-self' },
                    { name: 'Sender', value: 'sender' },
                ],
            },
        ],
    },
    {
        displayName: 'Items',
        name: 'textBatchItems',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['batch'], operation: ['sendTextBatch', 'previewBatch'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Items',
                values: [
                    { displayName: 'Client Ref', name: 'clientRef', type: 'string', default: '' },
                    {
                        displayName: 'Content Mode',
                        name: 'contentMode',
                        type: 'options',
                        default: 'singleText',
                        options: [
                            { name: 'Single Text', value: 'singleText' },
                            { name: 'Text Sequence', value: 'textSequence' },
                        ],
                    },
                    { displayName: 'Text', name: 'text', type: 'string', default: '' },
                    {
                        displayName: 'Texts',
                        name: 'texts',
                        type: 'fixedCollection',
                        default: {},
                        options: [
                            {
                                name: 'values',
                                displayName: 'Texts',
                                values: [{ displayName: 'Text', name: 'text', type: 'string', default: '' }],
                            },
                        ],
                    },
                    { displayName: 'To', name: 'to', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Items',
        name: 'mediaBatchItems',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['batch'], operation: ['sendMediaBatch'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Items',
                values: [
                    { displayName: 'Audio Duration (Ms)', name: 'audioDurationMs', type: 'number', default: 0 },
                    { displayName: 'Caption', name: 'caption', type: 'string', default: '' },
                    { displayName: 'Client Ref', name: 'clientRef', type: 'string', default: '' },
                    { displayName: 'File Name', name: 'fileName', type: 'string', default: '' },
                    { displayName: 'Media URL', name: 'mediaUrl', type: 'string', default: '' },
                    { displayName: 'MIME Type', name: 'mimeType', type: 'string', default: '' },
                    { displayName: 'To', name: 'to', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Batch Type',
        name: 'batchPreviewType',
        type: 'options',
        default: 'text',
        options: [
            { name: 'Text', value: 'text' },
            { name: 'Media', value: 'media' },
        ],
        displayOptions: {
            show: { resource: ['batch'], operation: ['previewBatch'] },
        },
    },
    {
        displayName: 'Preview Media Items',
        name: 'previewMediaBatchItems',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: {
                resource: ['batch'],
                operation: ['previewBatch'],
                batchPreviewType: ['media'],
            },
        },
        options: [
            {
                name: 'values',
                displayName: 'Items',
                values: [
                    { displayName: 'Audio Duration (Ms)', name: 'audioDurationMs', type: 'number', default: 0 },
                    { displayName: 'Caption', name: 'caption', type: 'string', default: '' },
                    { displayName: 'Client Ref', name: 'clientRef', type: 'string', default: '' },
                    { displayName: 'File Name', name: 'fileName', type: 'string', default: '' },
                    { displayName: 'Media URL', name: 'mediaUrl', type: 'string', default: '' },
                    { displayName: 'MIME Type', name: 'mimeType', type: 'string', default: '' },
                    { displayName: 'To', name: 'to', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'batchAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['batch'], operation: ['sendTextBatch', 'sendMediaBatch'] },
        },
        options: [
            { displayName: 'Generate Automatically', name: 'generateIdempotencyKey', type: 'boolean', default: true },
            { displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Batch ID',
        name: 'batchId',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['batch'], operation: ['get'] },
        },
    },
    {
        displayName: 'JID',
        name: 'jid',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['consent', 'recipient', 'privacy'],
                operation: ['upsert', 'revoke', 'get', 'getLimits', 'updateBlockStatus'],
            },
        },
    },
    {
        displayName: 'Additional Options',
        name: 'consentAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['consent'], operation: ['upsert', 'revoke'] },
        },
        options: [
            { displayName: 'Reason', name: 'reason', type: 'string', default: '' },
            { displayName: 'Source', name: 'source', type: 'string', default: '' },
            { displayName: 'Timezone', name: 'timezone', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Filters',
        name: 'snapshotFilters',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['chat', 'contact', 'group'], operation: ['getMany'] },
        },
        options: [
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                description: 'Max number of results to return',
                typeOptions: { minValue: 1, maxValue: 100 },
            },
        ],
    },
    {
        displayName: 'Chat JID',
        name: 'chatJid',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['chat'], operation: ['archive', 'mute', 'setReadState'] },
        },
    },
    {
        displayName: 'Archive',
        name: 'chatArchive',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: { resource: ['chat'], operation: ['archive'] },
        },
    },
    {
        displayName: 'Mute Mode',
        name: 'chatMuteMode',
        type: 'options',
        default: 'muteUntil',
        options: [
            { name: 'Mute Until', value: 'muteUntil' },
            { name: 'Unmute', value: 'unmute' },
        ],
        displayOptions: {
            show: { resource: ['chat'], operation: ['mute'] },
        },
    },
    {
        displayName: 'Mute Until',
        name: 'chatMuteUntil',
        type: 'dateTime',
        default: '',
        description: 'When mute mode is selected, the backend mutes the chat until this time',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['mute'],
                chatMuteMode: ['muteUntil'],
            },
        },
    },
    {
        displayName: 'Read',
        name: 'chatRead',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: { resource: ['chat'], operation: ['setReadState'] },
        },
    },
    {
        displayName: 'Group JID',
        name: 'groupJid',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: [
                    'get',
                    'updateSubject',
                    'updateDescription',
                    'updateParticipants',
                    'updateParticipantRequests',
                    'getInviteCode',
                    'revokeInviteCode',
                    'updateSettings',
                    'updateEphemeral',
                ],
            },
        },
    },
    {
        displayName: 'Subject',
        name: 'groupSubject',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['group'], operation: ['create', 'updateSubject'] },
        },
    },
    {
        displayName: 'Description',
        name: 'groupDescription',
        type: 'string',
        default: '',
        typeOptions: { rows: 4 },
        displayOptions: {
            show: { resource: ['group'], operation: ['updateDescription'] },
        },
    },
    {
        displayName: 'Participants',
        name: 'groupParticipants',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['group'], operation: ['create', 'updateParticipants', 'updateParticipantRequests'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Participants',
                values: [{ displayName: 'JID', name: 'jid', type: 'string', default: '' }],
            },
        ],
    },
    {
        displayName: 'Invite Code',
        name: 'groupInviteCode',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['group'], operation: ['join'] },
        },
    },
    {
        displayName: 'Action',
        name: 'groupParticipantsAction',
        type: 'options',
        default: 'add',
        options: [
            { name: 'Add', value: 'add' },
            { name: 'Remove', value: 'remove' },
            { name: 'Promote', value: 'promote' },
            { name: 'Demote', value: 'demote' },
        ],
        displayOptions: {
            show: { resource: ['group'], operation: ['updateParticipants'] },
        },
    },
    {
        displayName: 'Action',
        name: 'groupParticipantRequestsAction',
        type: 'options',
        default: 'approve',
        options: [
            { name: 'Approve', value: 'approve' },
            { name: 'Reject', value: 'reject' },
        ],
        displayOptions: {
            show: { resource: ['group'], operation: ['updateParticipantRequests'] },
        },
    },
    {
        displayName: 'Additional Options',
        name: 'groupSettingsOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['group'], operation: ['updateSettings'] },
        },
        options: [
            {
                displayName: 'Setting',
                name: 'setting',
                type: 'options',
                default: '',
                options: [
                    { name: 'Announcement', value: 'announcement' },
                    { name: 'Default', value: '' },
                    { name: 'Locked', value: 'locked' },
                    { name: 'Not Announcement', value: 'not_announcement' },
                    { name: 'Unlocked', value: 'unlocked' },
                ],
            },
            {
                displayName: 'Join Approval Mode',
                name: 'joinApprovalMode',
                type: 'options',
                default: '',
                options: [
                    { name: 'Default', value: '' },
                    { name: 'Off', value: 'off' },
                    { name: 'On', value: 'on' },
                ],
            },
            {
                displayName: 'Member Add Mode',
                name: 'memberAddMode',
                type: 'options',
                default: '',
                options: [
                    { name: 'Default', value: '' },
                    { name: 'Admin Only', value: 'admin_only' },
                    { name: 'All Members', value: 'all_member_add' },
                ],
            },
        ],
    },
    {
        displayName: 'Ephemeral Expiration',
        name: 'groupEphemeralExpiration',
        type: 'number',
        default: 0,
        description: 'Duration in seconds. Use 0 to disable ephemeral mode for the group.',
        displayOptions: {
            show: { resource: ['group'], operation: ['updateEphemeral'] },
        },
    },
    {
        displayName: 'Chat JID',
        name: 'historySyncChatJid',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['historySync'], operation: ['fetch'] },
        },
    },
    {
        displayName: 'Count',
        name: 'historySyncCount',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 200 },
        displayOptions: {
            show: { resource: ['historySync'], operation: ['fetch'] },
        },
    },
    {
        displayName: 'Oldest Message ID',
        name: 'historySyncOldestMessageId',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['historySync'], operation: ['fetch'] },
        },
    },
    {
        displayName: 'Additional Options',
        name: 'historySyncAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['historySync'], operation: ['fetch'] },
        },
        options: [
            { displayName: 'From Me', name: 'fromMe', type: 'boolean', default: false },
            {
                displayName: 'Oldest Message Timestamp',
                name: 'oldestMessageTimestamp',
                type: 'number',
                default: 0,
                description: 'Unix timestamp in seconds when the oldest message is not present locally',
            },
            { displayName: 'Participant', name: 'participant', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Delivery ID',
        name: 'deliveryId',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['webhookDelivery'], operation: ['retry'] },
        },
    },
    {
        displayName: 'Filters',
        name: 'webhookDeliveryFilters',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['webhookDelivery'], operation: ['getMany'] },
        },
        options: [
            { displayName: 'Event ID', name: 'eventId', type: 'string', default: '' },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                description: 'Max number of results to return',
                typeOptions: { minValue: 1, maxValue: 100 },
            },
            { displayName: 'Since', name: 'since', type: 'dateTime', default: '' },
            { displayName: 'Status', name: 'status', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['event'], operation: ['get'] },
        },
    },
    {
        displayName: 'Filters',
        name: 'eventFilters',
        type: 'collection',
        default: {},
        displayOptions: {
            show: { resource: ['event'], operation: ['getMany'] },
        },
        options: [
            { displayName: 'Entity Type', name: 'entityType', type: 'string', default: '' },
            { displayName: 'Event Type', name: 'eventType', type: 'string', default: '' },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                description: 'Max number of results to return',
                typeOptions: { minValue: 1, maxValue: 100 },
            },
            { displayName: 'Message ID', name: 'messageId', type: 'string', default: '' },
        ],
    },
    {
        displayName: 'Action',
        name: 'privacyBlockAction',
        type: 'options',
        default: 'block',
        options: [
            { name: 'Block', value: 'block' },
            { name: 'Unblock', value: 'unblock' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateBlockStatus'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyLastSeenValue',
        type: 'options',
        default: 'contacts',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Contacts', value: 'contacts' },
            { name: 'Contact Blacklist', value: 'contact_blacklist' },
            { name: 'None', value: 'none' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateLastSeen'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyOnlineValue',
        type: 'options',
        default: 'match_last_seen',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Match Last Seen', value: 'match_last_seen' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateOnline'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyProfilePhotoValue',
        type: 'options',
        default: 'contacts',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Contacts', value: 'contacts' },
            { name: 'Contact Blacklist', value: 'contact_blacklist' },
            { name: 'None', value: 'none' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateProfilePhoto'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyStatusValue',
        type: 'options',
        default: 'contacts',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Contacts', value: 'contacts' },
            { name: 'Contact Blacklist', value: 'contact_blacklist' },
            { name: 'None', value: 'none' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateStatus'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyGroupsAddValue',
        type: 'options',
        default: 'contacts',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Contacts', value: 'contacts' },
            { name: 'Contact Blacklist', value: 'contact_blacklist' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateGroupsAdd'] },
        },
    },
    {
        displayName: 'Value',
        name: 'privacyReadReceiptsValue',
        type: 'options',
        default: 'all',
        options: [
            { name: 'All', value: 'all' },
            { name: 'None', value: 'none' },
        ],
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateReadReceipts'] },
        },
    },
    {
        displayName: 'Duration',
        name: 'privacyDefaultDisappearingDuration',
        type: 'number',
        default: 0,
        description: 'Duration in seconds. Use 0 to disable the default disappearing mode.',
        displayOptions: {
            show: { resource: ['privacy'], operation: ['updateDefaultDisappearingMode'] },
        },
    },
    {
        displayName: 'Method',
        name: 'customMethod',
        type: 'options',
        default: 'GET',
        options: [
            { name: 'DELETE', value: 'DELETE' },
            { name: 'GET', value: 'GET' },
            { name: 'PATCH', value: 'PATCH' },
            { name: 'POST', value: 'POST' },
            { name: 'PUT', value: 'PUT' },
        ],
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
    },
    {
        displayName: 'Path',
        name: 'customPath',
        type: 'string',
        default: '/health',
        placeholder: '/sends?limit=10',
        description: 'Relative API path. Host is always taken from the credential.',
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
    },
    {
        displayName: 'Send Query Parameters',
        name: 'sendCustomQuery',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
    },
    {
        displayName: 'Query Parameters',
        name: 'customQueryParameters',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: {
                resource: ['customApiRequest'],
                operation: ['execute'],
                sendCustomQuery: [true],
            },
        },
        options: [
            {
                name: 'values',
                displayName: 'Query Parameters',
                values: [
                    { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    { displayName: 'Value', name: 'value', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Send Body',
        name: 'sendCustomBody',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
    },
    {
        displayName: 'JSON Body',
        name: 'customBody',
        type: 'string',
        default: '',
        typeOptions: { rows: 6 },
        description: 'JSON object string sent as the request body',
        displayOptions: {
            show: {
                resource: ['customApiRequest'],
                operation: ['execute'],
                sendCustomBody: [true],
            },
        },
    },
    {
        displayName: 'Additional Headers',
        name: 'customHeaders',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Headers',
                values: [
                    { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    { displayName: 'Value', name: 'value', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Ignore Response Code',
        name: 'ignoreResponseCode',
        type: 'boolean',
        default: false,
        description: 'Whether to return the error as JSON instead of failing the node',
        displayOptions: {
            show: { resource: ['customApiRequest'], operation: ['execute'] },
        },
    },
];
class BaileysInstance {
    constructor() {
        this.description = {
            displayName: 'Baileys Instance',
            name: 'baileysInstance',
            icon: {
                light: 'file:baileysInstance.svg',
                dark: 'file:baileysInstance.dark.svg',
            },
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Use the wa-instance API built on Baileys 7',
            defaults: {
                name: 'Baileys Instance',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            usableAsTool: true,
            credentials: [{ name: 'baileysInstanceApi', required: true }],
            properties: [
                resourceProperty,
                instanceOperations,
                historySyncOperations,
                eventOperations,
                chatOperations,
                contactOperations,
                groupOperations,
                messageOperations,
                batchOperations,
                consentOperations,
                recipientOperations,
                privacyOperations,
                webhookDeliveryOperations,
                customApiRequestOperations,
                ...operationProperties,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const results = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const resource = this.getNodeParameter('resource', itemIndex);
                const operation = this.getNodeParameter('operation', itemIndex);
                const responseData = await executeResourceOperation.call(this, itemIndex, resource, operation);
                results.push({
                    json: toNodeJson(responseData),
                    pairedItem: itemIndex,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    results.push({
                        json: { error: toErrorJson(error) },
                        pairedItem: itemIndex,
                    });
                    continue;
                }
                throw enrichError.call(this, error, itemIndex);
            }
        }
        return [results];
    }
}
exports.BaileysInstance = BaileysInstance;
function createOperationProperty(resource, defaultValue, options) {
    return {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: defaultValue,
        displayOptions: { show: { resource: [resource] } },
        options,
    };
}
async function executeResourceOperation(itemIndex, resource, operation) {
    switch (resource) {
        case 'instance':
            return await executeInstanceOperation.call(this, itemIndex, operation);
        case 'historySync':
            return await executeHistorySyncOperation.call(this, itemIndex, operation);
        case 'event':
            return await executeEventOperation.call(this, itemIndex, operation);
        case 'chat':
            return await executeChatOperation.call(this, itemIndex, operation);
        case 'contact':
            return await executeContactOperation.call(this, itemIndex, operation);
        case 'group':
            return await executeGroupOperation.call(this, itemIndex, operation);
        case 'message':
            return await executeMessageOperation.call(this, itemIndex, operation);
        case 'batch':
            return await executeBatchOperation.call(this, itemIndex, operation);
        case 'consent':
            return await executeConsentOperation.call(this, itemIndex, operation);
        case 'recipient':
            return await executeRecipientOperation.call(this, itemIndex, operation);
        case 'privacy':
            return await executePrivacyOperation.call(this, itemIndex, operation);
        case 'webhookDelivery':
            return await executeWebhookDeliveryOperation.call(this, itemIndex, operation);
        case 'customApiRequest':
            return await executeCustomApiRequest.call(this, itemIndex);
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource "${resource}"`, { itemIndex });
    }
}
async function executeInstanceOperation(itemIndex, operation) {
    switch (operation) {
        case 'getHealth':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/health' });
        case 'getDependenciesHealth':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/health/deps' });
        case 'getStatus':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/status' });
        case 'getQueueStatus':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/queues/status' });
        case 'getPairingQr':
            return await baileysRequest.call(this, itemIndex, { method: 'POST', path: '/pairing/qr' });
        case 'requestPairingCode': {
            const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex, '');
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/pairing/code',
                body: phoneNumber ? { phone_number: phoneNumber } : undefined,
            });
        }
        case 'logoutSession':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/session/logout',
                body: {
                    purge_auth: this.getNodeParameter('purgeAuth', itemIndex),
                    reconnect: this.getNodeParameter('reconnect', itemIndex),
                },
            });
        case 'sendWebhookTest': {
            const text = this.getNodeParameter('webhookTestText', itemIndex, '');
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/webhook/test',
                body: text ? { text } : undefined,
            });
        }
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported instance operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeHistorySyncOperation(itemIndex, operation) {
    switch (operation) {
        case 'getStatus':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/history-sync/status' });
        case 'fetch': {
            const additionalOptions = this.getNodeParameter('historySyncAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/history-sync/fetch',
                body: cleanObject({
                    count: this.getNodeParameter('historySyncCount', itemIndex),
                    chat_jid: this.getNodeParameter('historySyncChatJid', itemIndex),
                    oldest_message_id: this.getNodeParameter('historySyncOldestMessageId', itemIndex),
                    oldest_message_timestamp: getOptionalPositiveNumber(additionalOptions.oldestMessageTimestamp),
                    participant: getOptionalString(additionalOptions.participant),
                    from_me: additionalOptions.fromMe === true ? true : undefined,
                }),
            });
        }
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported history sync operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeEventOperation(itemIndex, operation) {
    switch (operation) {
        case 'get': {
            const eventId = this.getNodeParameter('eventId', itemIndex);
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/events/${encodeURIComponent(eventId)}`,
            });
        }
        case 'getMany': {
            const filters = this.getNodeParameter('eventFilters', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: '/events',
                qs: cleanObject({
                    event_type: getOptionalString(filters.eventType),
                    entity_type: getOptionalString(filters.entityType),
                    message_id: getOptionalString(filters.messageId),
                    limit: filters.limit,
                }),
            });
        }
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported event operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeChatOperation(itemIndex, operation) {
    switch (operation) {
        case 'getMany':
            return await executeSnapshotList.call(this, itemIndex, '/chats');
        case 'archive':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/chats/${encodeURIComponent(this.getNodeParameter('chatJid', itemIndex))}/archive`,
                body: {
                    archive: this.getNodeParameter('chatArchive', itemIndex),
                },
            });
        case 'mute': {
            const jid = this.getNodeParameter('chatJid', itemIndex);
            const muteMode = this.getNodeParameter('chatMuteMode', itemIndex);
            const body = muteMode === 'unmute'
                ? { muted: false }
                : cleanObject({
                    muted: true,
                    mute_until: this.getNodeParameter('chatMuteUntil', itemIndex, ''),
                });
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/chats/${encodeURIComponent(jid)}/mute`,
                body,
            });
        }
        case 'setReadState':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/chats/${encodeURIComponent(this.getNodeParameter('chatJid', itemIndex))}/read-state`,
                body: {
                    read: this.getNodeParameter('chatRead', itemIndex),
                },
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported chat operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeContactOperation(itemIndex, operation) {
    if (operation !== 'getMany') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported contact operation "${operation}"`, {
            itemIndex,
        });
    }
    return await executeSnapshotList.call(this, itemIndex, '/contacts');
}
async function executeGroupOperation(itemIndex, operation) {
    switch (operation) {
        case 'getMany':
            return await executeSnapshotList.call(this, itemIndex, '/groups');
        case 'get':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}`,
            });
        case 'create':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/groups',
                body: {
                    subject: this.getNodeParameter('groupSubject', itemIndex),
                    participants: getJidCollection.call(this, itemIndex, 'groupParticipants'),
                },
            });
        case 'join':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/groups/join',
                body: {
                    invite_code: this.getNodeParameter('groupInviteCode', itemIndex),
                },
            });
        case 'updateSubject':
            return await baileysRequest.call(this, itemIndex, {
                method: 'PATCH',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/subject`,
                body: {
                    subject: this.getNodeParameter('groupSubject', itemIndex),
                },
            });
        case 'updateDescription':
            return await baileysRequest.call(this, itemIndex, {
                method: 'PATCH',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/description`,
                body: {
                    description: this.getNodeParameter('groupDescription', itemIndex),
                },
            });
        case 'updateParticipants':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/participants`,
                body: {
                    participants: getJidCollection.call(this, itemIndex, 'groupParticipants'),
                    action: this.getNodeParameter('groupParticipantsAction', itemIndex),
                },
            });
        case 'updateParticipantRequests':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/participants/requests`,
                body: {
                    participants: getJidCollection.call(this, itemIndex, 'groupParticipants'),
                    action: this.getNodeParameter('groupParticipantRequestsAction', itemIndex),
                },
            });
        case 'getInviteCode':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/invite-code`,
            });
        case 'revokeInviteCode':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/invite-code/revoke`,
            });
        case 'updateSettings': {
            const options = this.getNodeParameter('groupSettingsOptions', itemIndex, {});
            const body = cleanObject({
                setting: getOptionalString(options.setting),
                member_add_mode: getOptionalString(options.memberAddMode),
                join_approval_mode: getOptionalString(options.joinApprovalMode),
            });
            ensureNonEmptyBody.call(this, itemIndex, body, 'Group settings');
            return await baileysRequest.call(this, itemIndex, {
                method: 'PATCH',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/settings`,
                body,
            });
        }
        case 'updateEphemeral':
            return await baileysRequest.call(this, itemIndex, {
                method: 'PATCH',
                path: `/groups/${encodeURIComponent(this.getNodeParameter('groupJid', itemIndex))}/ephemeral`,
                body: {
                    ephemeral_expiration: this.getNodeParameter('groupEphemeralExpiration', itemIndex),
                },
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported group operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeMessageOperation(itemIndex, operation) {
    switch (operation) {
        case 'sendText': {
            const body = buildTextPayload.call(this, itemIndex, 'send');
            const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/send/text',
                body,
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'send-text', additionalOptions),
            });
        }
        case 'sendMedia': {
            const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/send/media',
                body: cleanObject({
                    to: this.getNodeParameter('to', itemIndex),
                    media_url: this.getNodeParameter('mediaUrl', itemIndex),
                    mime_type: getOptionalString(additionalOptions.mimeType),
                    caption: getOptionalString(additionalOptions.caption),
                    file_name: getOptionalString(additionalOptions.fileName),
                    audio_duration_ms: getOptionalNumber(additionalOptions.audioDurationMs),
                    client_ref: getOptionalString(additionalOptions.clientRef),
                }),
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'send-media', additionalOptions),
            });
        }
        case 'previewSend': {
            const previewType = this.getNodeParameter('previewType', itemIndex);
            if (previewType === 'text') {
                return await baileysRequest.call(this, itemIndex, {
                    method: 'POST',
                    path: '/sends/preview',
                    body: {
                        type: 'text',
                        ...buildTextPayload.call(this, itemIndex, 'preview'),
                    },
                });
            }
            const additionalOptions = this.getNodeParameter('messagePreviewAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/sends/preview',
                body: cleanObject({
                    type: 'media',
                    to: this.getNodeParameter('to', itemIndex),
                    media_url: this.getNodeParameter('previewMediaUrl', itemIndex),
                    mime_type: getOptionalString(additionalOptions.mimeType),
                    caption: getOptionalString(additionalOptions.caption),
                    audio_duration_ms: getOptionalNumber(additionalOptions.audioDurationMs),
                }),
            });
        }
        case 'get':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/sends/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}`,
            });
        case 'getMany': {
            const filters = this.getNodeParameter('messageFilters', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: '/sends',
                qs: cleanObject({
                    status: getOptionalString(filters.status),
                    to_jid: getOptionalString(filters.toJid),
                    client_ref: getOptionalString(filters.clientRef),
                    from: getOptionalString(filters.from),
                    to: getOptionalString(filters.to),
                    limit: filters.limit,
                }),
            });
        }
        case 'getInboundMessage':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}`,
            });
        case 'reply': {
            const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/reply`,
                body: { text: this.getNodeParameter('messageActionText', itemIndex) },
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-reply', additionalOptions),
            });
        }
        case 'forward': {
            const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/forward`,
                body: cleanObject({
                    to: this.getNodeParameter('forwardTo', itemIndex),
                    force: additionalOptions.force === true ? true : undefined,
                }),
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-forward', additionalOptions),
            });
        }
        case 'delete': {
            const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/delete`,
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-delete', additionalOptions),
            });
        }
        case 'edit': {
            const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/edit`,
                body: { text: this.getNodeParameter('messageActionText', itemIndex) },
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-edit', additionalOptions),
            });
        }
        case 'react': {
            const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/reaction`,
                body: cleanObject({
                    emoji: getOptionalString(this.getNodeParameter('reactionEmoji', itemIndex)),
                }),
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-react', additionalOptions),
            });
        }
        case 'markRead':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/messages/read',
                body: { keys: getMessageReadKeys.call(this, itemIndex) },
            });
        case 'sendReceipts': {
            const additionalOptions = this.getNodeParameter('messageReceiptsAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/messages/receipts',
                body: cleanObject({
                    jid: this.getNodeParameter('messageReceiptsJid', itemIndex),
                    participant: getOptionalString(additionalOptions.participant),
                    message_ids: getMessageReceiptIds.call(this, itemIndex),
                    type: getOptionalString(additionalOptions.type),
                }),
            });
        }
        case 'refreshMedia':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/media/refresh`,
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported message operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeBatchOperation(itemIndex, operation) {
    switch (operation) {
        case 'sendTextBatch': {
            const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/send/batch/text',
                body: { items: getTextBatchItems.call(this, itemIndex) },
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'batch-text', additionalOptions),
            });
        }
        case 'sendMediaBatch': {
            const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/send/batch/media',
                body: { items: getMediaBatchItems.call(this, itemIndex, 'mediaBatchItems') },
                idempotencyKey: resolveIdempotencyKey(itemIndex, 'batch-media', additionalOptions),
            });
        }
        case 'previewBatch': {
            const batchType = this.getNodeParameter('batchPreviewType', itemIndex);
            const items = batchType === 'text'
                ? getTextBatchItems.call(this, itemIndex)
                : getMediaBatchItems.call(this, itemIndex, 'previewMediaBatchItems');
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/send-batches/preview',
                body: { type: batchType, items },
            });
        }
        case 'get':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/send-batches/${encodeURIComponent(this.getNodeParameter('batchId', itemIndex))}`,
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported batch operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeConsentOperation(itemIndex, operation) {
    const jid = this.getNodeParameter('jid', itemIndex);
    const additionalOptions = this.getNodeParameter('consentAdditionalOptions', itemIndex, {});
    switch (operation) {
        case 'upsert':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/consents/upsert',
                body: cleanObject({
                    jid,
                    timezone: getOptionalString(additionalOptions.timezone),
                    source: getOptionalString(additionalOptions.source),
                    reason: getOptionalString(additionalOptions.reason),
                }),
            });
        case 'revoke':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/consents/revoke',
                body: cleanObject({
                    jid,
                    reason: getOptionalString(additionalOptions.reason),
                }),
            });
        case 'get':
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: `/consents/${encodeURIComponent(jid)}`,
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported consent operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeRecipientOperation(itemIndex, operation) {
    if (operation !== 'getLimits') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported recipient operation "${operation}"`, {
            itemIndex,
        });
    }
    return await baileysRequest.call(this, itemIndex, {
        method: 'GET',
        path: `/limits/${encodeURIComponent(this.getNodeParameter('jid', itemIndex))}`,
    });
}
async function executePrivacyOperation(itemIndex, operation) {
    switch (operation) {
        case 'getSettings':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/privacy' });
        case 'getBlocklist':
            return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/privacy/blocklist' });
        case 'updateBlockStatus':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/privacy/blocks',
                body: {
                    jid: this.getNodeParameter('jid', itemIndex),
                    action: this.getNodeParameter('privacyBlockAction', itemIndex),
                },
            });
        case 'updateLastSeen':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/last-seen', 'privacyLastSeenValue');
        case 'updateOnline':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/online', 'privacyOnlineValue');
        case 'updateProfilePhoto':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/profile-photo', 'privacyProfilePhotoValue');
        case 'updateStatus':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/status', 'privacyStatusValue');
        case 'updateGroupsAdd':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/groups-add', 'privacyGroupsAddValue');
        case 'updateReadReceipts':
            return await executePrivacyValuePatch.call(this, itemIndex, '/privacy/read-receipts', 'privacyReadReceiptsValue');
        case 'updateDefaultDisappearingMode':
            return await baileysRequest.call(this, itemIndex, {
                method: 'PATCH',
                path: '/settings/disappearing-mode',
                body: {
                    duration: this.getNodeParameter('privacyDefaultDisappearingDuration', itemIndex),
                },
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported privacy operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeWebhookDeliveryOperation(itemIndex, operation) {
    switch (operation) {
        case 'getMany': {
            const filters = this.getNodeParameter('webhookDeliveryFilters', itemIndex, {});
            return await baileysRequest.call(this, itemIndex, {
                method: 'GET',
                path: '/webhooks/deliveries',
                qs: cleanObject({
                    status: getOptionalString(filters.status),
                    event_id: getOptionalString(filters.eventId),
                    since: getOptionalString(filters.since),
                    limit: filters.limit,
                }),
            });
        }
        case 'retry':
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: `/webhooks/deliveries/${encodeURIComponent(this.getNodeParameter('deliveryId', itemIndex))}/retry`,
            });
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported webhook delivery operation "${operation}"`, {
                itemIndex,
            });
    }
}
async function executeCustomApiRequest(itemIndex) {
    const method = this.getNodeParameter('customMethod', itemIndex);
    const pathInput = this.getNodeParameter('customPath', itemIndex);
    const ignoreResponseCode = this.getNodeParameter('ignoreResponseCode', itemIndex, false);
    try {
        return await baileysRequest.call(this, itemIndex, {
            method,
            path: ensureRelativePath(pathInput),
            body: getCustomBody.call(this, itemIndex),
            qs: getNameValuePairs.call(this, itemIndex, 'customQueryParameters'),
            headers: getNameValuePairs.call(this, itemIndex, 'customHeaders'),
        });
    }
    catch (error) {
        if (!ignoreResponseCode) {
            throw enrichError.call(this, error, itemIndex);
        }
        return {
            ok: false,
            error: toErrorJson(error),
        };
    }
}
async function executeSnapshotList(itemIndex, path) {
    const filters = this.getNodeParameter('snapshotFilters', itemIndex, {});
    return await baileysRequest.call(this, itemIndex, {
        method: 'GET',
        path,
        qs: cleanObject({
            limit: filters.limit,
        }),
    });
}
async function executePrivacyValuePatch(itemIndex, path, propertyName) {
    return await baileysRequest.call(this, itemIndex, {
        method: 'PATCH',
        path,
        body: {
            value: this.getNodeParameter(propertyName, itemIndex),
        },
    });
}
async function baileysRequest(itemIndex, options) {
    const credentials = (await this.getCredentials('baileysInstanceApi'));
    const baseUrl = normalizeBaseUrl(credentials.baseUrl);
    const headers = {
        Accept: 'application/json',
        ...options.headers,
    };
    if (options.body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }
    if (options.idempotencyKey) {
        headers['X-Idempotency-Key'] = options.idempotencyKey;
    }
    const requestOptions = {
        method: options.method,
        url: `${baseUrl}${ensureRelativePath(options.path)}`,
        headers,
        skipSslCertificateValidation: Boolean(credentials.tlsAllowSelfSigned),
        timeout: Number(credentials.timeout || 30000),
        json: true,
    };
    if (options.body !== undefined) {
        requestOptions.body = options.body;
    }
    if (options.qs && Object.keys(options.qs).length > 0) {
        requestOptions.qs = options.qs;
    }
    return await this.helpers.httpRequestWithAuthentication.call(this, 'baileysInstanceApi', requestOptions);
}
function buildTextPayload(itemIndex, mode) {
    const payload = {
        to: this.getNodeParameter('to', itemIndex),
    };
    const contentMode = this.getNodeParameter('contentMode', itemIndex);
    if (contentMode === 'singleText') {
        payload.text = this.getNodeParameter('text', itemIndex);
    }
    else {
        payload.texts = getTextValues.call(this, itemIndex, 'texts');
    }
    if (mode === 'send') {
        const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {});
        const clientRef = getOptionalString(additionalOptions.clientRef);
        if (clientRef) {
            payload.client_ref = clientRef;
        }
    }
    return payload;
}
function getTextValues(itemIndex, propertyName) {
    var _a;
    const collection = this.getNodeParameter(propertyName, itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : [])
        .map((entry) => { var _a; return (_a = entry.text) === null || _a === void 0 ? void 0 : _a.trim(); })
        .filter((value) => Boolean(value));
}
function getTextBatchItems(itemIndex) {
    var _a;
    const collection = this.getNodeParameter('textBatchItems', itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : []).map((entry) => {
        var _a, _b;
        return cleanObject({
            to: entry.to,
            text: entry.contentMode === 'singleText' ? entry.text : undefined,
            texts: entry.contentMode === 'textSequence'
                ? ((_b = (_a = entry.texts) === null || _a === void 0 ? void 0 : _a.values) !== null && _b !== void 0 ? _b : []).map((textEntry) => textEntry.text).filter(Boolean)
                : undefined,
            client_ref: entry.clientRef || undefined,
        });
    });
}
function getMediaBatchItems(itemIndex, propertyName) {
    var _a;
    const collection = this.getNodeParameter(propertyName, itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : []).map((entry) => cleanObject({
        to: entry.to,
        media_url: entry.mediaUrl,
        mime_type: entry.mimeType || undefined,
        caption: entry.caption || undefined,
        file_name: entry.fileName || undefined,
        audio_duration_ms: entry.audioDurationMs || undefined,
        client_ref: entry.clientRef || undefined,
    }));
}
function getMessageReadKeys(itemIndex) {
    var _a;
    const collection = this.getNodeParameter('messageReadKeys', itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : []).map((entry) => cleanObject({
        remoteJid: entry.remoteJid,
        id: entry.id,
        participant: entry.participant || undefined,
        fromMe: entry.fromMe === true ? true : undefined,
    }));
}
function getMessageReceiptIds(itemIndex) {
    var _a;
    const collection = this.getNodeParameter('messageReceiptIds', itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : [])
        .map((entry) => { var _a; return (_a = entry.messageId) === null || _a === void 0 ? void 0 : _a.trim(); })
        .filter((value) => Boolean(value));
}
function getJidCollection(itemIndex, propertyName) {
    var _a;
    const collection = this.getNodeParameter(propertyName, itemIndex, {});
    return ((_a = collection.values) !== null && _a !== void 0 ? _a : [])
        .map((entry) => { var _a; return (_a = entry.jid) === null || _a === void 0 ? void 0 : _a.trim(); })
        .filter((value) => Boolean(value));
}
function getNameValuePairs(itemIndex, propertyName) {
    var _a;
    if (propertyName === 'customQueryParameters'
        && !this.getNodeParameter('sendCustomQuery', itemIndex, false)) {
        return undefined;
    }
    const collection = this.getNodeParameter(propertyName, itemIndex, {});
    const output = ((_a = collection.values) !== null && _a !== void 0 ? _a : []).reduce((acc, entry) => {
        var _a;
        if (entry.name) {
            acc[entry.name] = (_a = entry.value) !== null && _a !== void 0 ? _a : '';
        }
        return acc;
    }, {});
    return Object.keys(output).length > 0 ? output : undefined;
}
function getCustomBody(itemIndex) {
    const sendBody = this.getNodeParameter('sendCustomBody', itemIndex, false);
    if (!sendBody) {
        return undefined;
    }
    const bodyRaw = this.getNodeParameter('customBody', itemIndex, '');
    if (!bodyRaw.trim()) {
        return undefined;
    }
    try {
        return JSON.parse(bodyRaw);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom API Request body must be valid JSON', {
            itemIndex,
            description: error instanceof Error ? error.message : undefined,
        });
    }
}
function ensureNonEmptyBody(itemIndex, body, label) {
    if (Object.keys(body).length > 0) {
        return;
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `${label} must include at least one value`, {
        itemIndex,
    });
}
function resolveIdempotencyKey(itemIndex, prefix, additionalOptions) {
    const manualKey = getOptionalString(additionalOptions.idempotencyKey);
    if (manualKey) {
        return manualKey;
    }
    if (additionalOptions.generateIdempotencyKey === false) {
        return undefined;
    }
    return `${prefix}-${Date.now()}-${itemIndex}`;
}
function normalizeBaseUrl(baseUrl) {
    if (!(baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.trim())) {
        throw new n8n_workflow_1.ApplicationError('Base URL is required');
    }
    return baseUrl.replace(/\/+$/, '');
}
function ensureRelativePath(path) {
    if (!path.trim()) {
        return '/';
    }
    if (/^https?:\/\//i.test(path)) {
        throw new n8n_workflow_1.ApplicationError('Custom paths must be relative to the credential Base URL');
    }
    return path.startsWith('/') ? path : `/${path}`;
}
function cleanObject(input) {
    return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined && value !== '' && value !== null));
}
function getOptionalString(value) {
    if (typeof value !== 'string') {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed || undefined;
}
function getOptionalNumber(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
        return undefined;
    }
    return value;
}
function getOptionalPositiveNumber(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
        return undefined;
    }
    return value;
}
function toNodeJson(data) {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        return data;
    }
    return { data: data };
}
function toErrorJson(error) {
    if (error instanceof Error) {
        const candidate = error;
        return cleanObject({
            name: candidate.name,
            message: candidate.message,
            httpCode: candidate.httpCode,
            description: candidate.description,
            context: candidate.context,
        });
    }
    return { message: String(error) };
}
function enrichError(error, itemIndex) {
    if (error instanceof n8n_workflow_1.NodeOperationError || error instanceof n8n_workflow_1.NodeApiError) {
        return error;
    }
    if (error instanceof Error) {
        const hint = getErrorHint(error);
        return new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            itemIndex,
            message: hint ? `${error.message} ${hint}` : error.message,
        });
    }
    return new n8n_workflow_1.NodeOperationError(this.getNode(), String(error), { itemIndex });
}
function getErrorHint(error) {
    var _a, _b, _c;
    const candidate = error;
    const message = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.message) !== null && _a !== void 0 ? _a : '';
    const httpCode = (_b = candidate === null || candidate === void 0 ? void 0 : candidate.httpCode) !== null && _b !== void 0 ? _b : String((_c = candidate === null || candidate === void 0 ? void 0 : candidate.statusCode) !== null && _c !== void 0 ? _c : '');
    const lowerMessage = message.toLowerCase();
    if (httpCode === '409') {
        if (lowerMessage.includes('idempot')) {
            return 'The same idempotency key was likely reused with a different payload.';
        }
        return 'The backend reported that this capability is not available in the current socket or state.';
    }
    if (httpCode === '404') {
        return 'The referenced resource was not found in the backend.';
    }
    if (httpCode === '400' && lowerMessage.includes('group')) {
        return 'Check that the JID belongs to a real WhatsApp group.';
    }
    if (lowerMessage.includes('without qr pairing method')) {
        return 'The instance may be configured with WA_PAIRING_METHOD=code instead of qr.';
    }
    if (lowerMessage.includes('without code pairing method')) {
        return 'The instance may be configured with WA_PAIRING_METHOD=qr instead of code.';
    }
    return '';
}
//# sourceMappingURL=BaileysInstance.node.js.map