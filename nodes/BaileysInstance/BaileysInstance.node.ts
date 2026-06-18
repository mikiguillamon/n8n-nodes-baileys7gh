import type {
	IDataObject,
	IExecuteFunctions,
	GenericValue,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import {
	ApplicationError,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type BaileysCredentials = {
	baseUrl: string;
	timeout?: number;
	tlsAllowSelfSigned?: boolean;
};

const resourceProperty: INodeProperties = {
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

const instanceOperations: INodeProperties = {
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

const messageOperations: INodeProperties = {
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
			name: 'Preview Send',
			value: 'previewSend',
			description: 'Validate policy and normalization without sending',
			action: 'Preview send a message',
		},
		{
			name: 'Send Media',
			value: 'sendMedia',
			description: 'Send a single media message',
			action: 'Send media a message',
		},
		{
			name: 'Send Text',
			value: 'sendText',
			description: 'Send one text or a text sequence',
			action: 'Send text a message',
		},
	],
};

const batchOperations: INodeProperties = {
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

const consentOperations: INodeProperties = {
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

const chatOperations: INodeProperties = {
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

const contactOperations: INodeProperties = {
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

const groupOperations: INodeProperties = {
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

const historySyncOperations: INodeProperties = {
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

const recipientOperations: INodeProperties = {
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

const webhookDeliveryOperations: INodeProperties = {
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

const eventOperations: INodeProperties = {
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

const customApiRequestOperations: INodeProperties = {
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

const operationProperties: INodeProperties[] = [
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
				description:
					'Whether to generate a unique X-Idempotency-Key per n8n item when no manual key is provided',
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
			show: { resource: ['message'], operation: ['get', 'getInboundMessage'] },
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
									values:	[
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

export class BaileysInstance implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const results: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				let responseData: unknown;

				if (resource === 'instance') {
					responseData = await executeInstanceOperation.call(this, itemIndex, operation);
				} else if (resource === 'message') {
					responseData = await executeMessageOperation.call(this, itemIndex, operation);
				} else if (resource === 'batch') {
					responseData = await executeBatchOperation.call(this, itemIndex, operation);
				} else if (resource === 'chat') {
					responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'chat');
				} else if (resource === 'contact') {
					responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'contact');
				} else if (resource === 'consent') {
					responseData = await executeConsentOperation.call(this, itemIndex, operation);
				} else if (resource === 'event') {
					responseData = await executeEventOperation.call(this, itemIndex, operation);
				} else if (resource === 'group') {
					responseData = await executeSnapshotOperation.call(this, itemIndex, operation, 'group');
				} else if (resource === 'historySync') {
					responseData = await executeHistorySyncOperation.call(this, itemIndex, operation);
				} else if (resource === 'recipient') {
					responseData = await executeRecipientOperation.call(this, itemIndex, operation);
				} else if (resource === 'webhookDelivery') {
					responseData = await executeWebhookDeliveryOperation.call(this, itemIndex, operation);
				} else if (resource === 'customApiRequest') {
					responseData = await executeCustomApiRequest.call(this, itemIndex);
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported resource "${resource}"`, {
						itemIndex,
					});
				}

				results.push({
					json: toNodeJson(responseData),
					pairedItem: itemIndex,
				});
			} catch (error) {
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

async function executeInstanceOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
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
		const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex, '') as string;
		const body = phoneNumber ? { phone_number: phoneNumber } : undefined;
		return await baileysRequest.call(this, itemIndex, { method: 'POST', path: '/pairing/code', body });
	}

	if (operation === 'logoutSession') {
		return await baileysRequest.call(this, itemIndex, {
			method: 'POST',
			path: '/session/logout',
			body: {
				purge_auth: this.getNodeParameter('purgeAuth', itemIndex) as boolean,
				reconnect: this.getNodeParameter('reconnect', itemIndex) as boolean,
			},
		});
	}

	if (operation === 'sendWebhookTest') {
		const text = this.getNodeParameter('webhookTestText', itemIndex, '') as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'POST',
			path: '/webhook/test',
			body: text ? { text } : undefined,
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported instance operation "${operation}"`, {
		itemIndex,
	});
}

async function executeMessageOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation === 'sendText') {
		const body = buildTextPayload.call(this, itemIndex, 'send');
		const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {}) as IDataObject;
		return await baileysRequest.call(this, itemIndex, {
			method: 'POST',
			path: '/send/text',
			body,
			idempotencyKey: resolveIdempotencyKey(itemIndex, 'send-text', additionalOptions),
		});
	}

	if (operation === 'sendMedia') {
		const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {}) as IDataObject;
		const body = cleanObject({
			to: this.getNodeParameter('to', itemIndex) as string,
			media_url: this.getNodeParameter('mediaUrl', itemIndex) as string,
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
		const previewType = this.getNodeParameter('previewType', itemIndex) as string;
		const additionalOptions = this.getNodeParameter('messagePreviewAdditionalOptions', itemIndex, {}) as IDataObject;

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
			to: this.getNodeParameter('to', itemIndex) as string,
			media_url: this.getNodeParameter('previewMediaUrl', itemIndex) as string,
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
		const messageId = this.getNodeParameter('messageId', itemIndex) as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: `/sends/${encodeURIComponent(messageId)}`,
		});
	}

	if (operation === 'getInboundMessage') {
		const messageId = this.getNodeParameter('messageId', itemIndex) as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: `/messages/${encodeURIComponent(messageId)}`,
		});
	}

	if (operation === 'getMany') {
		const filters = this.getNodeParameter('messageFilters', itemIndex, {}) as IDataObject;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: '/sends',
			qs: cleanObject({
				status: getOptionalString(filters.status),
				to_jid: getOptionalString(filters.toJid),
				client_ref: getOptionalString(filters.clientRef),
				from: getOptionalString(filters.from),
				to: getOptionalString(filters.to),
				limit: filters.limit as number | undefined,
			}),
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported message operation "${operation}"`, {
		itemIndex,
	});
}

async function executeBatchOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation === 'sendTextBatch') {
		const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {}) as IDataObject;
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
		const additionalOptions = this.getNodeParameter('batchAdditionalOptions', itemIndex, {}) as IDataObject;
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
		const batchType = this.getNodeParameter('batchPreviewType', itemIndex) as string;
		const items =
			batchType === 'text'
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
		const batchId = this.getNodeParameter('batchId', itemIndex) as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: `/send-batches/${encodeURIComponent(batchId)}`,
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported batch operation "${operation}"`, {
		itemIndex,
	});
}

async function executeConsentOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	const jid = this.getNodeParameter('jid', itemIndex) as string;
	const additionalOptions = this.getNodeParameter('consentAdditionalOptions', itemIndex, {}) as IDataObject;

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

	throw new NodeOperationError(this.getNode(), `Unsupported consent operation "${operation}"`, {
		itemIndex,
	});
}

async function executeSnapshotOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
	resource: 'chat' | 'contact' | 'group',
): Promise<unknown> {
	if (operation !== 'getMany') {
		throw new NodeOperationError(this.getNode(), `Unsupported ${resource} operation "${operation}"`, {
			itemIndex,
		});
	}

	const filters = this.getNodeParameter('snapshotFilters', itemIndex, {}) as IDataObject;
	const pathMap: Record<'chat' | 'contact' | 'group', string> = {
		chat: '/chats',
		contact: '/contacts',
		group: '/groups',
	};

	return await baileysRequest.call(this, itemIndex, {
		method: 'GET',
		path: pathMap[resource],
		qs: cleanObject({
			limit: filters.limit as number | undefined,
		}),
	});
}

async function executeHistorySyncOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation === 'getStatus') {
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: '/history-sync/status',
		});
	}

	if (operation === 'fetch') {
		const additionalOptions = this.getNodeParameter(
			'historySyncAdditionalOptions',
			itemIndex,
			{},
		) as IDataObject;

		return await baileysRequest.call(this, itemIndex, {
			method: 'POST',
			path: '/history-sync/fetch',
			body: cleanObject({
				count: this.getNodeParameter('historySyncCount', itemIndex) as number,
				chat_jid: this.getNodeParameter('historySyncChatJid', itemIndex) as string,
				oldest_message_id: this.getNodeParameter('historySyncOldestMessageId', itemIndex) as string,
				oldest_message_timestamp: getOptionalPositiveNumber(additionalOptions.oldestMessageTimestamp),
				participant: getOptionalString(additionalOptions.participant),
				from_me: additionalOptions.fromMe === true ? true : undefined,
			}),
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported history sync operation "${operation}"`, {
		itemIndex,
	});
}

async function executeRecipientOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation !== 'getLimits') {
		throw new NodeOperationError(this.getNode(), `Unsupported recipient operation "${operation}"`, {
			itemIndex,
		});
	}

	const jid = this.getNodeParameter('limitsJid', itemIndex) as string;
	return await baileysRequest.call(this, itemIndex, {
		method: 'GET',
		path: `/limits/${encodeURIComponent(jid)}`,
	});
}

async function executeEventOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation === 'get') {
		const eventId = this.getNodeParameter('eventId', itemIndex) as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: `/events/${encodeURIComponent(eventId)}`,
		});
	}

	if (operation === 'getMany') {
		const filters = this.getNodeParameter('eventFilters', itemIndex, {}) as IDataObject;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: '/events',
			qs: cleanObject({
				event_type: getOptionalString(filters.eventType),
				entity_type: getOptionalString(filters.entityType),
				message_id: getOptionalString(filters.messageId),
				limit: filters.limit as number | undefined,
			}),
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported event operation "${operation}"`, {
		itemIndex,
	});
}

async function executeWebhookDeliveryOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
): Promise<unknown> {
	if (operation === 'getMany') {
		const filters = this.getNodeParameter('webhookDeliveryFilters', itemIndex, {}) as IDataObject;
		return await baileysRequest.call(this, itemIndex, {
			method: 'GET',
			path: '/webhooks/deliveries',
			qs: cleanObject({
				status: getOptionalString(filters.status),
				event_id: getOptionalString(filters.eventId),
				since: getOptionalString(filters.since),
				limit: filters.limit as number | undefined,
			}),
		});
	}

	if (operation === 'retry') {
		const deliveryId = this.getNodeParameter('deliveryId', itemIndex) as string;
		return await baileysRequest.call(this, itemIndex, {
			method: 'POST',
			path: `/webhooks/deliveries/${encodeURIComponent(deliveryId)}/retry`,
		});
	}

	throw new NodeOperationError(this.getNode(), `Unsupported webhook delivery operation "${operation}"`, {
		itemIndex,
	});
}

async function executeCustomApiRequest(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<unknown> {
	const method = this.getNodeParameter('customMethod', itemIndex) as HttpMethod;
	const pathInput = this.getNodeParameter('customPath', itemIndex) as string;
	const ignoreResponseCode = this.getNodeParameter('ignoreResponseCode', itemIndex, false) as boolean;

	try {
			return await baileysRequest.call(this, itemIndex, {
				method,
				path: ensureRelativePath(pathInput),
				body: getCustomBody.call(this, itemIndex),
				qs: getNameValuePairs.call(this, itemIndex, 'customQueryParameters'),
				headers: getNameValuePairs.call(this, itemIndex, 'customHeaders'),
			});
		} catch (error) {
			if (!ignoreResponseCode) {
				throw enrichError.call(this, error, itemIndex);
			}

		return {
			ok: false,
			error: toErrorJson(error),
		};
	}
}

async function baileysRequest(
	this: IExecuteFunctions,
	itemIndex: number,
	options: {
		method: HttpMethod;
		path: string;
		body?: IDataObject;
		qs?: IDataObject;
		headers?: IDataObject;
		idempotencyKey?: string;
	},
): Promise<unknown> {
	const credentials = (await this.getCredentials('baileysInstanceApi')) as unknown as BaileysCredentials;
	const baseUrl = normalizeBaseUrl(credentials.baseUrl);
	const headers: IDataObject = {
		Accept: 'application/json',
		...options.headers,
	};

	if (options.body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	if (options.idempotencyKey) {
		headers['X-Idempotency-Key'] = options.idempotencyKey;
	}

	const requestOptions: IHttpRequestOptions = {
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

	return await this.helpers.httpRequestWithAuthentication.call(
		this,
		'baileysInstanceApi',
		requestOptions,
	);
}

function buildTextPayload(
	this: IExecuteFunctions,
	itemIndex: number,
	mode: 'send' | 'preview',
): IDataObject {
	const payload: IDataObject = {
		to: this.getNodeParameter('to', itemIndex) as string,
	};

	const contentMode = this.getNodeParameter('contentMode', itemIndex) as string;
	if (contentMode === 'singleText') {
		payload.text = this.getNodeParameter('text', itemIndex) as string;
	} else {
		payload.texts = getTextValues.call(this, itemIndex, 'texts');
	}

	if (mode === 'send') {
		const additionalOptions = this.getNodeParameter('messageAdditionalOptions', itemIndex, {}) as IDataObject;
		const clientRef = getOptionalString(additionalOptions.clientRef);
		if (clientRef) {
			payload.client_ref = clientRef;
		}
	}

	return payload;
}

function getTextValues(this: IExecuteFunctions, itemIndex: number, propertyName: string): string[] {
	const collection = this.getNodeParameter(propertyName, itemIndex, {}) as {
		values?: Array<{ text?: string }>;
	};
	return (collection.values ?? [])
		.map((entry) => entry.text?.trim())
		.filter((value): value is string => Boolean(value));
}

function getTextBatchItems(this: IExecuteFunctions, itemIndex: number): IDataObject[] {
	const collection = this.getNodeParameter('textBatchItems', itemIndex, {}) as {
		values?: Array<{
			to?: string;
			contentMode?: string;
			text?: string;
			texts?: { values?: Array<{ text?: string }> };
			clientRef?: string;
		}>;
	};

	return (collection.values ?? []).map((entry) =>
		cleanObject({
			to: entry.to,
			text: entry.contentMode === 'singleText' ? entry.text : undefined,
			texts:
				entry.contentMode === 'textSequence'
					? (entry.texts?.values ?? []).map((textEntry) => textEntry.text).filter(Boolean)
					: undefined,
			client_ref: entry.clientRef || undefined,
		}),
	);
}

function getMediaBatchItems(
	this: IExecuteFunctions,
	itemIndex: number,
	usePreviewSwitch = false,
): IDataObject[] {
	if (usePreviewSwitch) {
		const batchType = this.getNodeParameter('batchPreviewType', itemIndex) as string;
		if (batchType === 'text') {
			return getTextBatchItems.call(this, itemIndex);
		}
	}

	const collection = this.getNodeParameter('mediaBatchItems', itemIndex, {}) as {
		values?: Array<{
			to?: string;
			mediaUrl?: string;
			mimeType?: string;
			caption?: string;
			fileName?: string;
			audioDurationMs?: number;
			clientRef?: string;
		}>;
	};

	return (collection.values ?? []).map((entry) =>
		cleanObject({
			to: entry.to,
			media_url: entry.mediaUrl,
			mime_type: entry.mimeType || undefined,
			caption: entry.caption || undefined,
			file_name: entry.fileName || undefined,
			audio_duration_ms: entry.audioDurationMs || undefined,
			client_ref: entry.clientRef || undefined,
		}),
	);
}

function getNameValuePairs(
	this: IExecuteFunctions,
	itemIndex: number,
	propertyName: string,
): IDataObject | undefined {
	const shouldReadQuery = propertyName !== 'customQueryParameters'
		|| (this.getNodeParameter('sendCustomQuery', itemIndex, false) as boolean);
	const shouldReadBody = propertyName !== 'customHeaders';
	if (!shouldReadQuery && !shouldReadBody) {
		return undefined;
	}

	const collection = this.getNodeParameter(propertyName, itemIndex, {}) as {
		values?: Array<{ name?: string; value?: string }>;
	};
	const output = (collection.values ?? []).reduce<IDataObject>((acc, entry) => {
		if (entry.name) {
			acc[entry.name] = entry.value ?? '';
		}
		return acc;
	}, {});

	return Object.keys(output).length > 0 ? output : undefined;
}

function getCustomBody(this: IExecuteFunctions, itemIndex: number): IDataObject | undefined {
	const sendBody = this.getNodeParameter('sendCustomBody', itemIndex, false) as boolean;
	if (!sendBody) {
		return undefined;
	}

	const bodyRaw = this.getNodeParameter('customBody', itemIndex, '') as string;
	if (!bodyRaw.trim()) {
		return undefined;
	}

	try {
		return JSON.parse(bodyRaw) as IDataObject;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Custom API Request body must be valid JSON', {
			itemIndex,
			description: error instanceof Error ? error.message : undefined,
		});
	}
}

function resolveIdempotencyKey(
	itemIndex: number,
	prefix: string,
	additionalOptions: IDataObject,
): string | undefined {
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

function normalizeBaseUrl(baseUrl: string): string {
	if (!baseUrl?.trim()) {
		throw new ApplicationError('Base URL is required');
	}
	return baseUrl.replace(/\/+$/, '');
}

function ensureRelativePath(path: string): string {
	if (!path.trim()) {
		return '/';
	}

	if (/^https?:\/\//i.test(path)) {
		throw new ApplicationError('Custom paths must be relative to the credential Base URL');
	}

	return path.startsWith('/') ? path : `/${path}`;
}

function cleanObject(input: IDataObject): IDataObject {
	return Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined && value !== '' && value !== null),
	) as IDataObject;
}

function getOptionalString(value: unknown): string | undefined {
	if (typeof value !== 'string') {
		return undefined;
	}
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
}

function getOptionalNumber(value: unknown): number | undefined {
	if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
		return undefined;
	}
	return value;
}

function getOptionalPositiveNumber(value: unknown): number | undefined {
	if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
		return undefined;
	}

	return value;
}

function toNodeJson(data: unknown): IDataObject {
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		return data as IDataObject;
	}

	return {
		data: data as GenericValue,
	};
}

function toErrorJson(error: unknown): IDataObject {
	if (error instanceof Error) {
		const candidate = error as Error & {
			httpCode?: string;
			description?: string;
			context?: IDataObject;
		};
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

function enrichError(this: IExecuteFunctions, error: unknown, itemIndex: number): Error {
	const hint = getErrorHint(error);
	if (error instanceof NodeOperationError || error instanceof NodeApiError) {
		return error;
	}

	if (error instanceof Error) {
		return new NodeApiError(this.getNode(), error as unknown as JsonObject, {
			itemIndex,
			message: hint ? `${error.message} ${hint}` : error.message,
		});
	}

	return new NodeOperationError(this.getNode(), String(error), { itemIndex });
}

function getErrorHint(error: unknown): string {
	const candidate = error as { message?: string; httpCode?: string };
	const message = candidate?.message ?? '';
	const httpCode = candidate?.httpCode ?? '';

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
