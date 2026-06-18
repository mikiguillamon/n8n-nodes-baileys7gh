import type {
	IDataObject,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { ApplicationError, NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

type BaileysCredentials = {
	baseUrl: string;
	timeout?: number;
	tlsAllowSelfSigned?: boolean;
};

type BaileysEvent = IDataObject & {
	event_id?: string;
	event_type?: string;
	entity_type?: string;
	message_id?: string;
	occurred_at?: string;
};

type CursorState = {
	initialized?: boolean;
	lastEventId?: string;
	lastOccurredAt?: string;
};

const properties: INodeProperties[] = [
	{
		displayName: 'Trigger On',
		name: 'triggerOn',
		type: 'options',
		noDataExpression: true,
		default: 'allEvents',
		options: [
			{
				name: 'Account Events',
				value: 'accountEvents',
				description: 'Poll account-level events',
			},
			{
				name: 'All Events',
				value: 'allEvents',
				description: 'Poll every available event',
			},
			{
				name: 'Call Events',
				value: 'callEvents',
				description: 'Poll call-related events',
			},
			{
				name: 'Chat Events',
				value: 'chatEvents',
				description: 'Poll chat snapshot and chat lifecycle events',
			},
			{
				name: 'Contact Events',
				value: 'contactEvents',
				description: 'Poll contact-related events',
			},
			{
				name: 'Custom Filter',
				value: 'customFilter',
				description: 'Use raw API filters',
			},
			{
				name: 'Group Events',
				value: 'groupEvents',
				description: 'Poll group-related events',
			},
			{
				name: 'Message Events',
				value: 'messageEvents',
				description: 'Poll inbound and message lifecycle events',
			},
		],
	},
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'string',
		default: '',
		placeholder: 'message',
		description: 'Raw entity type filter supported by the API',
		displayOptions: {
			show: {
				triggerOn: ['customFilter'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		default: {},
		options: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'string',
				default: '',
				placeholder: 'messages.update',
				description: 'Filter by a specific backend event type',
			},
			{
				displayName: 'First Run Behavior',
				name: 'firstRunBehavior',
				type: 'options',
				default: 'emitNothingAndStartFromNow',
				options: [
					{
						name: 'Emit All Retrieved',
						value: 'emitAllRetrieved',
						description: 'Emit every event returned by the first poll',
					},
					{
						name: 'Emit Latest Only',
						value: 'emitLatestOnly',
						description: 'Emit only the newest event on the first poll',
					},
					{
						name: 'Emit Nothing And Start From Now',
						value: 'emitNothingAndStartFromNow',
						description: 'Set the cursor without emitting items on the first poll',
					},
				],
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				default: '',
				description: 'Filter events related to a single message ID',
			},
		],
	},
];

export class BaileysTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Baileys Trigger',
		name: 'baileysTrigger',
		icon: {
			light: 'file:../BaileysInstance/baileysInstance.svg',
			dark: 'file:../BaileysInstance/baileysInstance.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["triggerOn"]}}',
		description: 'Poll wa-instance events and emit only new ones',
		defaults: {
			name: 'Baileys Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'baileysInstanceApi', required: true }],
		properties,
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		try {
			const query = getEventQuery.call(this);
			const response = (await baileysRequest.call(this, '/events', query)) as {
				items?: BaileysEvent[];
			};
			const events = normalizeEvents(response.items);
			const staticData = this.getWorkflowStaticData('node') as CursorState;
			const firstRunBehavior = getFirstRunBehavior.call(this);

			if (!staticData.initialized) {
				staticData.initialized = true;
				if (events.length > 0) {
					updateCursor(staticData, events[events.length - 1]);
				}

				if (firstRunBehavior === 'emitNothingAndStartFromNow') {
					return null;
				}

				if (firstRunBehavior === 'emitLatestOnly') {
					const latestEvent = events[events.length - 1];
					return latestEvent ? [[{ json: latestEvent }]] : null;
				}

				return events.length > 0 ? [events.map((event) => ({ json: event }))] : null;
			}

			const newEvents = events.filter((event) => isNewEvent(event, staticData));
			if (newEvents.length === 0) {
				return null;
			}

			updateCursor(staticData, newEvents[newEvents.length - 1]);

			return [newEvents.map((event) => ({ json: event }))];
		} catch (error) {
			throw toNodeError.call(this, error);
		}
	}
}

function getEventQuery(this: IPollFunctions): IDataObject {
	const triggerOn = this.getNodeParameter('triggerOn') as string;
	const options = this.getNodeParameter('options', {}) as IDataObject;

	const query = cleanObject({
		entity_type: resolveEntityType(triggerOn, this.getNodeParameter('entityType', '') as string),
		event_type: getOptionalString(options.eventType),
		message_id: getOptionalString(options.messageId),
		limit: options.limit as number | undefined,
	});

	return query;
}

function getFirstRunBehavior(this: IPollFunctions): string {
	const options = this.getNodeParameter('options', {}) as IDataObject;
	return (options.firstRunBehavior as string | undefined) ?? 'emitNothingAndStartFromNow';
}

function resolveEntityType(triggerOn: string, customEntityType: string): string | undefined {
	if (triggerOn === 'customFilter') {
		return getOptionalString(customEntityType);
	}

	const map: Record<string, string | undefined> = {
		accountEvents: 'account',
		allEvents: undefined,
		callEvents: 'call',
		chatEvents: 'chat',
		contactEvents: 'contact',
		groupEvents: 'group',
		messageEvents: 'message',
	};

	return map[triggerOn];
}

async function baileysRequest(
	this: IPollFunctions,
	path: string,
	qs?: IDataObject,
): Promise<unknown> {
	const credentials = (await this.getCredentials('baileysInstanceApi')) as unknown as BaileysCredentials;
	const requestOptions: IHttpRequestOptions = {
		method: 'GET',
		url: `${normalizeBaseUrl(credentials.baseUrl)}${ensureRelativePath(path)}`,
		headers: {
			Accept: 'application/json',
		},
		skipSslCertificateValidation: Boolean(credentials.tlsAllowSelfSigned),
		timeout: Number(credentials.timeout || 30000),
		json: true,
	};

	if (qs && Object.keys(qs).length > 0) {
		requestOptions.qs = qs;
	}

	return await this.helpers.httpRequestWithAuthentication.call(
		this,
		'baileysInstanceApi',
		requestOptions,
	);
}

function normalizeEvents(events: BaileysEvent[] | undefined): BaileysEvent[] {
	return [...(events ?? [])].sort(compareEvents);
}

function compareEvents(left: BaileysEvent, right: BaileysEvent): number {
	const timeDifference = toTimestamp(left.occurred_at) - toTimestamp(right.occurred_at);
	if (timeDifference !== 0) {
		return timeDifference;
	}

	return String(left.event_id ?? '').localeCompare(String(right.event_id ?? ''));
}

function isNewEvent(event: BaileysEvent, cursor: CursorState): boolean {
	const eventTime = toTimestamp(event.occurred_at);
	const cursorTime = toTimestamp(cursor.lastOccurredAt);

	if (eventTime > cursorTime) {
		return true;
	}

	if (eventTime < cursorTime) {
		return false;
	}

	return String(event.event_id ?? '') > String(cursor.lastEventId ?? '');
}

function updateCursor(cursor: CursorState, event: BaileysEvent): void {
	cursor.lastEventId = String(event.event_id ?? '');
	cursor.lastOccurredAt = String(event.occurred_at ?? '');
}

function toTimestamp(value: unknown): number {
	if (typeof value !== 'string' || value.trim() === '') {
		return 0;
	}

	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? 0 : parsed;
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
		throw new ApplicationError('Trigger paths must be relative to the credential Base URL');
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

function toNodeError(this: IPollFunctions, error: unknown): Error {
	if (error instanceof NodeApiError) {
		return error;
	}

	if (error instanceof Error) {
		return new NodeApiError(this.getNode(), error as unknown as JsonObject);
	}

	return new NodeApiError(this.getNode(), { message: String(error) });
}
