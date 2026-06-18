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
        { name: 'Recipient', value: 'recipient' },
        { name: 'Webhook Delivery', value: 'webhookDelivery' },
    ],
};
const instanceOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getHealth',
    displayOptions: {
        show: { resource: ['instance'] },
    },
    options: [
        {
            name: 'Get Dependencies Health',
            value: 'getDependenciesHealth',
            description: 'Check Postgres, Redis, MinIO and WhatsApp readiness',
            action: 'Get dependencies health an instance',
        },
        {
            name: 'Get Health',
            value: 'getHealth',
            description: 'Run a basic smoke check against the instance',
            action: 'Get health an instance',
        },
        {
            name: 'Get Pairing QR',
            value: 'getPairingQr',
            description: 'Fetch the current QR when the instance is in QR pairing mode',
            action: 'Get pairing qr an instance',
        },
        {
            name: 'Get Queue Status',
            value: 'getQueueStatus',
            description: 'Inspect outbound and webhook queue health',
            action: 'Get queue status an instance',
        },
        {
            name: 'Get Status',
            value: 'getStatus',
            description: 'Read current WhatsApp session state',
            action: 'Get status an instance',
        },
        {
            name: 'Logout Session',
            value: 'logoutSession',
            description: 'Logout the current session and optionally purge auth',
            action: 'Logout session an instance',
        },
        {
            name: 'Request Pairing Code',
            value: 'requestPairingCode',
            description: 'Request a pairing code when the instance is in code pairing mode',
            action: 'Request pairing code an instance',
        },
        {
            name: 'Send Webhook Test',
            value: 'sendWebhookTest',
            description: 'Trigger a webhook test event from the backend',
            action: 'Send webhook test an instance',
        },
    ],
};
const messageOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'sendText',
    displayOptions: {
        show: { resource: ['message'] },
    },
    options: [
        {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a message by ID',
            action: 'Delete a message',
        },
        {
            name: 'Edit',
            value: 'edit',
            description: 'Edit a message by ID',
            action: 'Edit a message',
        },
        {
            name: 'Forward',
            value: 'forward',
            description: 'Forward a message to another recipient',
            action: 'Forward a message',
        },
        {
            name: 'Get',
            value: 'get',
            description: 'Get a single outbound message by ID',
            action: 'Get a message',
        },
        {
            name: 'Get Inbound Message',
            value: 'getInboundMessage',
            description: 'Inspect a persisted inbound message by ID',
            action: 'Get inbound message a message',
        },
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List outbound messages with filters',
            action: 'Get many a message',
        },
        {
            name: 'Mark Read',
            value: 'markRead',
            description: 'Mark one or more message keys as read',
            action: 'Mark read a message',
        },
        {
            name: 'Preview Send',
            value: 'previewSend',
            description: 'Validate policy and normalization without sending',
            action: 'Preview send a message',
        },
        {
            name: 'React',
            value: 'react',
            description: 'React to a message by ID',
            action: 'React a message',
        },
        {
            name: 'Refresh Media',
            value: 'refreshMedia',
            description: 'Refresh media for a persisted message',
            action: 'Refresh media a message',
        },
        {
            name: 'Reply',
            value: 'reply',
            description: 'Reply to a message by ID',
            action: 'Reply a message',
        },
        {
            name: 'Send Media',
            value: 'sendMedia',
            description: 'Send a single media message',
            action: 'Send media a message',
        },
        {
            name: 'Send Receipts',
            value: 'sendReceipts',
            description: 'Send receipts for one or more messages',
            action: 'Send receipts a message',
        },
        {
            name: 'Send Text',
            value: 'sendText',
            description: 'Send one text or a text sequence',
            action: 'Send text a message',
        },
    ],
};
const batchOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'sendTextBatch',
    displayOptions: {
        show: { resource: ['batch'] },
    },
    options: [
        {
            name: 'Get',
            value: 'get',
            description: 'Get a batch by ID',
            action: 'Get a batch',
        },
        {
            name: 'Preview Batch',
            value: 'previewBatch',
            description: 'Validate a batch without sending',
            action: 'Preview batch a batch',
        },
        {
            name: 'Send Media Batch',
            value: 'sendMediaBatch',
            description: 'Queue a homogeneous media batch',
            action: 'Send media batch a batch',
        },
        {
            name: 'Send Text Batch',
            value: 'sendTextBatch',
            description: 'Queue a homogeneous text batch',
            action: 'Send text batch a batch',
        },
    ],
};
const consentOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'upsert',
    displayOptions: {
        show: { resource: ['consent'] },
    },
    options: [
        {
            name: 'Get',
            value: 'get',
            description: 'Get the current consent record for a JID',
            action: 'Get a consent',
        },
        {
            name: 'Revoke',
            value: 'revoke',
            description: 'Revoke consent for a JID',
            action: 'Revoke a consent',
        },
        {
            name: 'Create or Update',
            value: 'upsert',
            description: 'Create a new record, or update the current one if it already exists (upsert)',
            action: 'Upsert a consent',
        },
    ],
};
const chatOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getMany',
    displayOptions: {
        show: { resource: ['chat'] },
    },
    options: [
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List persisted chat snapshots',
            action: 'Get many a chat',
        },
    ],
};
const contactOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getMany',
    displayOptions: {
        show: { resource: ['contact'] },
    },
    options: [
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List persisted contact snapshots',
            action: 'Get many a contact',
        },
    ],
};
const groupOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getMany',
    displayOptions: {
        show: { resource: ['group'] },
    },
    options: [
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List persisted group snapshots',
            action: 'Get many a group',
        },
    ],
};
const historySyncOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getStatus',
    displayOptions: {
        show: { resource: ['historySync'] },
    },
    options: [
        {
            name: 'Fetch',
            value: 'fetch',
            description: 'Fetch older messages on demand starting from a reference message',
            action: 'Fetch a history sync',
        },
        {
            name: 'Get Status',
            value: 'getStatus',
            description: 'Get the current history sync status',
            action: 'Get status a history sync',
        },
    ],
};
const recipientOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getLimits',
    displayOptions: {
        show: { resource: ['recipient'] },
    },
    options: [
        {
            name: 'Get Limits',
            value: 'getLimits',
            description: 'Read policy and operational limits for a recipient',
            action: 'Get limits a recipient',
        },
    ],
};
const webhookDeliveryOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getMany',
    displayOptions: {
        show: { resource: ['webhookDelivery'] },
    },
    options: [
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List webhook deliveries with filters',
            action: 'Get many a webhook delivery',
        },
        {
            name: 'Retry',
            value: 'retry',
            description: 'Retry a failed delivery',
            action: 'Retry webhook delivery',
        },
    ],
};
const eventOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'getMany',
    displayOptions: {
        show: { resource: ['event'] },
    },
    options: [
        {
            name: 'Get',
            value: 'get',
            description: 'Get a single persisted event by ID',
            action: 'Get an event',
        },
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'List persisted events with filters',
            action: 'Get many an event',
        },
    ],
};
const customApiRequestOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    default: 'execute',
    displayOptions: {
        show: { resource: ['customApiRequest'] },
    },
    options: [
        {
            name: 'Execute',
            value: 'execute',
            description: 'Call a relative path on the wa-instance API',
            action: 'Execute a custom api request',
        },
    ],
};
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
        typeOptions: {
            rows: 3,
        },
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
        typeOptions: {
            multipleValues: true,
        },
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
                        typeOptions: {
                            rows: 2,
                        },
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
            { name: 'Media', value: 'media' },
            { name: 'Text', value: 'text' },
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
            {
                displayName: 'Audio Duration (Ms)',
                name: 'audioDurationMs',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Client Ref',
                name: 'clientRef',
                type: 'string',
                default: '',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Generate Automatically',
                name: 'generateIdempotencyKey',
                type: 'boolean',
                default: true,
                description: 'Whether to generate a unique X-Idempotency-Key per n8n item when no manual key is provided',
            },
            {
                displayName: 'Idempotency Key',
                name: 'idempotencyKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'MIME Type',
                name: 'mimeType',
                type: 'string',
                default: '',
            },
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
            {
                displayName: 'Audio Duration (Ms)',
                name: 'audioDurationMs',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
            },
            {
                displayName: 'MIME Type',
                name: 'mimeType',
                type: 'string',
                default: '',
            },
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
        typeOptions: {
            rows: 3,
        },
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['reply', 'edit'],
            },
        },
    },
    {
        displayName: 'Forward To',
        name: 'forwardTo',
        type: 'string',
        default: '',
        placeholder: '34600111222 or 34600111222@s.whatsapp.net',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['forward'],
            },
        },
    },
    {
        displayName: 'Emoji',
        name: 'reactionEmoji',
        type: 'string',
        default: '',
        description: 'Reaction emoji. Leave empty only if your backend supports clearing reactions.',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['react'],
            },
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
            { displayName: 'Limit', name: 'limit', type: 'number',
                description: 'Max number of results to return', default: 50, typeOptions: { minValue: 1, maxValue: 100 } },
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
            show: {
                resource: ['message'],
                operation: ['reply', 'forward', 'delete', 'edit', 'react'],
            },
        },
        options: [
            {
                displayName: 'Force',
                name: 'force',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        '/operation': ['forward'],
                    },
                },
            },
            {
                displayName: 'Generate Automatically',
                name: 'generateIdempotencyKey',
                type: 'boolean',
                default: true,
                description: 'Whether to generate a unique X-Idempotency-Key per n8n item when no manual key is provided',
            },
            {
                displayName: 'Idempotency Key',
                name: 'idempotencyKey',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        displayName: 'Keys',
        name: 'messageReadKeys',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['markRead'],
            },
        },
        options: [
            {
                name: 'values',
                displayName: 'Keys',
                values: [
                    {
                        displayName: 'From Me',
                        name: 'fromMe',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Participant',
                        name: 'participant',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Remote JID',
                        name: 'remoteJid',
                        type: 'string',
                        default: '',
                    },
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
            show: {
                resource: ['message'],
                operation: ['sendReceipts'],
            },
        },
    },
    {
        displayName: 'Message IDs',
        name: 'messageReceiptIds',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendReceipts'],
            },
        },
        options: [
            {
                name: 'values',
                displayName: 'Message IDs',
                values: [
                    {
                        displayName: 'Message ID',
                        name: 'messageId',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'messageReceiptsAdditionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendReceipts'],
            },
        },
        options: [
            {
                displayName: 'Participant',
                name: 'participant',
                type: 'string',
                default: '',
            },
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
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        displayOptions: {
            show: { resource: ['batch'], operation: ['sendTextBatch', 'previewBatch'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Items',
                values: [
                    {
                        displayName: 'Client Ref',
                        name: 'clientRef',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Content Mode',
                        name: 'contentMode',
                        type: 'options',
                        default: 'singleText',
                        options: [
                            {
                                name: 'Single Text',
                                value: 'singleText',
                            },
                            {
                                name: 'Text Sequence',
                                value: 'textSequence',
                            },
                        ]
                    },
                    {
                        displayName: 'Text',
                        name: 'text',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Texts',
                        name: 'texts',
                        type: 'fixedCollection',
                        default: {},
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
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        displayName: 'To',
                        name: 'to',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Items',
        name: 'mediaBatchItems',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        displayOptions: {
            show: { resource: ['batch'], operation: ['sendMediaBatch'] },
        },
        options: [
            {
                name: 'values',
                displayName: 'Items',
                values: [
                    {
                        displayName: 'Audio Duration (Ms)',
                        name: 'audioDurationMs',
                        type: 'number',
                        default: 0
                    },
                    {
                        displayName: 'Caption',
                        name: 'caption',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Client Ref',
                        name: 'clientRef',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'File Name',
                        name: 'fileName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Media URL',
                        name: 'mediaUrl',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'MIME Type',
                        name: 'mimeType',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'To',
                        name: 'to',
                        type: 'string',
                        default: '',
                    },
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
            { name: 'Media', value: 'media' },
            { name: 'Text', value: 'text' },
        ],
        displayOptions: {
            show: { resource: ['batch'], operation: ['previewBatch'] },
        },
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
            {
                displayName: 'Generate Automatically',
                name: 'generateIdempotencyKey',
                type: 'boolean',
                default: true,
            },
            {
                displayName: 'Idempotency Key',
                name: 'idempotencyKey',
                type: 'string',
                default: '',
            },
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
            show: { resource: ['consent'], operation: ['upsert', 'revoke', 'get'] },
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
            show: {
                resource: ['chat', 'contact', 'group'],
                operation: ['getMany'],
            },
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
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
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
            {
                displayName: 'From Me',
                name: 'fromMe',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Oldest Message Timestamp',
                name: 'oldestMessageTimestamp',
                type: 'number',
                default: 0,
                description: 'Unix timestamp in seconds when the oldest message is not present locally',
            },
            {
                displayName: 'Participant',
                name: 'participant',
                type: 'string',
                default: '',
            },
        ],
    },
    {
        displayName: 'JID',
        name: 'limitsJid',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['recipient'], operation: ['getLimits'] },
        },
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
            { displayName: 'Limit', name: 'limit', type: 'number',
                description: 'Max number of results to return', default: 50, typeOptions: { minValue: 1, maxValue: 100 } },
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
        typeOptions: {
            rows: 6,
        },
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
                messageOperations,
                batchOperations,
                chatOperations,
                contactOperations,
                consentOperations,
                eventOperations,
                groupOperations,
                historySyncOperations,
                recipientOperations,
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
                let responseData;
                if (resource === 'instance') {
                    responseData = await executeInstanceOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'message') {
                    responseData = await executeMessageOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'batch') {
                    responseData = await executeBatchOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'chat') {
                    responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'chat');
                }
                else if (resource === 'contact') {
                    responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'contact');
                }
                else if (resource === 'consent') {
                    responseData = await executeConsentOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'event') {
                    responseData = await executeEventOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'group') {
                    responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'group');
                }
                else if (resource === 'historySync') {
                    responseData = await executeHistorySyncOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'recipient') {
                    responseData = await executeRecipientOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'webhookDelivery') {
                    responseData = await executeWebhookDeliveryOperation.call(this, itemIndex, operation);
                }
                else if (resource === 'customApiRequest') {
                    responseData = await executeCustomApiRequest.call(this, itemIndex);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource "${resource}"`, {
                        itemIndex,
                    });
                }
                results.push({
                    json: toNodeJson(responseData),
                    pairedItem: itemIndex,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    results.push({
                        json: {
                            error: toErrorJson(error),
                        },
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
async function executeInstanceOperation(itemIndex, operation) {
    if (operation === 'getHealth') {
        return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/health' });
    }
    if (operation === 'getDependenciesHealth') {
        return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/health/deps' });
    }
    if (operation === 'getStatus') {
        return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/status' });
    }
    if (operation === 'getQueueStatus') {
        return await baileysRequest.call(this, itemIndex, { method: 'GET', path: '/queues/status' });
    }
    if (operation === 'getPairingQr') {
        return await baileysRequest.call(this, itemIndex, { method: 'POST', path: '/pairing/qr' });
    }
    if (operation === 'requestPairingCode') {
        const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex, '');
        const body = phoneNumber ? { phone_number: phoneNumber } : undefined;
        return await baileysRequest.call(this, itemIndex, { method: 'POST', path: '/pairing/code', body });
    }
    if (operation === 'logoutSession') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/session/logout',
            body: {
                purge_auth: this.getNodeParameter('purgeAuth', itemIndex),
                reconnect: this.getNodeParameter('reconnect', itemIndex),
            },
        });
    }
    if (operation === 'sendWebhookTest') {
        const text = this.getNodeParameter('webhookTestText', itemIndex, '');
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/webhook/test',
            body: text ? { text } : undefined,
        });
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported instance operation "${operation}"`, {
        itemIndex,
    });
}
async function executeMessageOperation(itemIndex, operation) {
    if (operation === 'sendText') {
        const body = buildTextPayload.call(this, itemIndex, 'send');
        const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/send/text',
            body,
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'send-text', additionalOptions),
        });
    }
    if (operation === 'sendMedia') {
        const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {});
        const body = cleanObject({
            to: this.getNodeParameter('to', itemIndex),
            media_url: this.getNodeParameter('mediaUrl', itemIndex),
            mime_type: getOptionalString(additionalOptions.mimeType),
            caption: getOptionalString(additionalOptions.caption),
            file_name: getOptionalString(additionalOptions.fileName),
            audio_duration_ms: getOptionalNumber(additionalOptions.audioDurationMs),
            client_ref: getOptionalString(additionalOptions.clientRef),
        });
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/send/media',
            body,
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'send-media', additionalOptions),
        });
    }
    if (operation === 'previewSend') {
        const previewType = this.getNodeParameter('previewType', itemIndex);
        const additionalOptions = this.getNodeParameter('messagePreviewAdditionalOptions', itemIndex, {});
        if (previewType === 'text') {
            const body = buildTextPayload.call(this, itemIndex, 'preview');
            return await baileysRequest.call(this, itemIndex, {
                method: 'POST',
                path: '/sends/preview',
                body: { type: 'text', ...body },
            });
        }
        const body = cleanObject({
            type: 'media',
            to: this.getNodeParameter('to', itemIndex),
            media_url: this.getNodeParameter('previewMediaUrl', itemIndex),
            mime_type: getOptionalString(additionalOptions.mimeType),
            caption: getOptionalString(additionalOptions.caption),
            audio_duration_ms: getOptionalNumber(additionalOptions.audioDurationMs),
        });
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/sends/preview',
            body,
        });
    }
    if (operation === 'get') {
        const messageId = this.getNodeParameter('messageId', itemIndex);
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: `/sends/${encodeURIComponent(messageId)}`,
        });
    }
    if (operation === 'getInboundMessage') {
        const messageId = this.getNodeParameter('messageId', itemIndex);
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: `/messages/${encodeURIComponent(messageId)}`,
        });
    }
    if (operation === 'getMany') {
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
    if (operation === 'reply') {
        const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/reply`,
            body: {
                text: this.getNodeParameter('messageActionText', itemIndex),
            },
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-reply', additionalOptions),
        });
    }
    if (operation === 'forward') {
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
    if (operation === 'delete') {
        const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/delete`,
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-delete', additionalOptions),
        });
    }
    if (operation === 'edit') {
        const additionalOptions = this.getNodeParameter('messageActionAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/edit`,
            body: {
                text: this.getNodeParameter('messageActionText', itemIndex),
            },
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'message-edit', additionalOptions),
        });
    }
    if (operation === 'react') {
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
    if (operation === 'markRead') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/messages/read',
            body: {
                keys: getMessageReadKeys.call(this, itemIndex),
            },
        });
    }
    if (operation === 'sendReceipts') {
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
    if (operation === 'refreshMedia') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: `/messages/${encodeURIComponent(this.getNodeParameter('messageId', itemIndex))}/media/refresh`,
        });
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported message operation "${operation}"`, {
        itemIndex,
    });
}
async function executeBatchOperation(itemIndex, operation) {
    if (operation === 'sendTextBatch') {
        const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/send/batch/text',
            body: {
                items: getTextBatchItems.call(this, itemIndex),
            },
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'batch-text', additionalOptions),
        });
    }
    if (operation === 'sendMediaBatch') {
        const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {});
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/send/batch/media',
            body: {
                items: getMediaBatchItems.call(this, itemIndex),
            },
            idempotencyKey: resolveIdempotencyKey(itemIndex, 'batch-media', additionalOptions),
        });
    }
    if (operation === 'previewBatch') {
        const batchType = this.getNodeParameter('batchPreviewType', itemIndex);
        const items = batchType === 'text'
            ? getTextBatchItems.call(this, itemIndex)
            : getMediaBatchItems.call(this, itemIndex, true);
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/send-batches/preview',
            body: {
                type: batchType,
                items,
            },
        });
    }
    if (operation === 'get') {
        const batchId = this.getNodeParameter('batchId', itemIndex);
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: `/send-batches/${encodeURIComponent(batchId)}`,
        });
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported batch operation "${operation}"`, {
        itemIndex,
    });
}
async function executeConsentOperation(itemIndex, operation) {
    const jid = this.getNodeParameter('jid', itemIndex);
    const additionalOptions = this.getNodeParameter('consentAdditionalOptions', itemIndex, {});
    if (operation === 'upsert') {
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
    }
    if (operation === 'revoke') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: '/consents/revoke',
            body: cleanObject({
                jid,
                reason: getOptionalString(additionalOptions.reason),
            }),
        });
    }
    if (operation === 'get') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: `/consents/${encodeURIComponent(jid)}`,
        });
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported consent operation "${operation}"`, {
        itemIndex,
    });
}
async function executeSnapshotOperation(itemIndex, operation, resource) {
    if (operation !== 'getMany') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported ${resource} operation "${operation}"`, {
            itemIndex,
        });
    }
    const filters = this.getNodeParameter('snapshotFilters', itemIndex, {});
    const pathMap = {
        chat: '/chats',
        contact: '/contacts',
        group: '/groups',
    };
    return await baileysRequest.call(this, itemIndex, {
        method: 'GET',
        path: pathMap[resource],
        qs: cleanObject({
            limit: filters.limit,
        }),
    });
}
async function executeHistorySyncOperation(itemIndex, operation) {
    if (operation === 'getStatus') {
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: '/history-sync/status',
        });
    }
    if (operation === 'fetch') {
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
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported history sync operation "${operation}"`, {
        itemIndex,
    });
}
async function executeRecipientOperation(itemIndex, operation) {
    if (operation !== 'getLimits') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported recipient operation "${operation}"`, {
            itemIndex,
        });
    }
    const jid = this.getNodeParameter('limitsJid', itemIndex);
    return await baileysRequest.call(this, itemIndex, {
        method: 'GET',
        path: `/limits/${encodeURIComponent(jid)}`,
    });
}
async function executeEventOperation(itemIndex, operation) {
    if (operation === 'get') {
        const eventId = this.getNodeParameter('eventId', itemIndex);
        return await baileysRequest.call(this, itemIndex, {
            method: 'GET',
            path: `/events/${encodeURIComponent(eventId)}`,
        });
    }
    if (operation === 'getMany') {
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
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported event operation "${operation}"`, {
        itemIndex,
    });
}
async function executeWebhookDeliveryOperation(itemIndex, operation) {
    if (operation === 'getMany') {
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
    if (operation === 'retry') {
        const deliveryId = this.getNodeParameter('deliveryId', itemIndex);
        return await baileysRequest.call(this, itemIndex, {
            method: 'POST',
            path: `/webhooks/deliveries/${encodeURIComponent(deliveryId)}/retry`,
        });
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported webhook delivery operation "${operation}"`, {
        itemIndex,
    });
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
function getMediaBatchItems(itemIndex, usePreviewSwitch = false) {
    var _a;
    if (usePreviewSwitch) {
        const batchType = this.getNodeParameter('batchPreviewType', itemIndex);
        if (batchType === 'text') {
            return getTextBatchItems.call(this, itemIndex);
        }
    }
    const collection = this.getNodeParameter('mediaBatchItems', itemIndex, {});
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
function getNameValuePairs(itemIndex, propertyName) {
    var _a;
    const shouldReadQuery = propertyName !== 'customQueryParameters'
        || this.getNodeParameter('sendCustomQuery', itemIndex, false);
    const shouldReadBody = propertyName !== 'customHeaders';
    if (!shouldReadQuery && !shouldReadBody) {
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
function resolveIdempotencyKey(itemIndex, prefix, additionalOptions) {
    const manualKey = getOptionalString(additionalOptions.idempotencyKey);
    if (manualKey) {
        return manualKey;
    }
    const shouldGenerate = additionalOptions.generateIdempotencyKey !== false;
    if (!shouldGenerate) {
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
    return trimmed ? trimmed : undefined;
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
    return {
        data: data,
    };
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
    return {
        message: String(error),
    };
}
function enrichError(error, itemIndex) {
    const hint = getErrorHint(error);
    if (error instanceof n8n_workflow_1.NodeOperationError || error instanceof n8n_workflow_1.NodeApiError) {
        return error;
    }
    if (error instanceof Error) {
        return new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            itemIndex,
            message: hint ? `${error.message} ${hint}` : error.message,
        });
    }
    return new n8n_workflow_1.NodeOperationError(this.getNode(), String(error), { itemIndex });
}
function getErrorHint(error) {
    var _a, _b;
    const candidate = error;
    const message = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.message) !== null && _a !== void 0 ? _a : '';
    const httpCode = (_b = candidate === null || candidate === void 0 ? void 0 : candidate.httpCode) !== null && _b !== void 0 ? _b : '';
    if (httpCode === '409') {
        return 'The same idempotency key was likely reused with a different payload.';
    }
    if (message.includes('without qr pairing method')) {
        return 'The instance may be configured with WA_PAIRING_METHOD=code instead of qr.';
    }
    if (message.includes('without code pairing method')) {
        return 'The instance may be configured with WA_PAIRING_METHOD=qr instead of code.';
    }
    return '';
}
//# sourceMappingURL=BaileysInstance.node.js.map