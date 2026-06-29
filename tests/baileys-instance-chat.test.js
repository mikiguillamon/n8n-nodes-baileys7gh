const test = require('node:test');
const assert = require('node:assert/strict');

const {
	BaileysInstance,
} = require('../dist/nodes/BaileysInstance/BaileysInstance.node.js');

function createExecuteContext(parameters, responseData) {
	const requests = [];

	return {
		requests,
		context: {
			getInputData() {
				return [{ json: {} }];
			},
			getNodeParameter(name, _itemIndex, defaultValue) {
				return Object.prototype.hasOwnProperty.call(parameters, name)
					? parameters[name]
					: defaultValue;
			},
			async getCredentials() {
				return {
					baseUrl: 'https://wa-instance.example.com/',
					timeout: 30000,
					tlsAllowSelfSigned: false,
				};
			},
			helpers: {
				async httpRequestWithAuthentication(_credentialType, requestOptions) {
					requests.push(requestOptions);
					return responseData;
				},
			},
			continueOnFail() {
				return false;
			},
			getNode() {
				return { name: 'Baileys Instance' };
			},
		},
	};
}

test('Chat resource exposes Get Recent Messages and raises Get Many max limit to 1000', () => {
	const node = new BaileysInstance();
	const properties = node.description.properties;

	const chatOperationProperty = properties.find(
		(property) =>
			property.name === 'operation' &&
			property.displayOptions?.show?.resource?.includes('chat'),
	);

	assert.ok(chatOperationProperty);
	assert.ok(
		chatOperationProperty.options.some(
			(option) => option.value === 'getRecentMessages' && option.name === 'Get Recent Messages',
		),
	);

	const snapshotFilters = properties.find((property) => property.name === 'snapshotFilters');
	assert.ok(snapshotFilters);

	const limitOption = snapshotFilters.options.find((option) => option.name === 'limit');
	assert.equal(limitOption.typeOptions.maxValue, 1000);
});

test('Chat Get Many forwards snapshot limits above 100 without altering the response shape', async () => {
	const node = new BaileysInstance();
	const responseData = { items: [{ chat_jid: 'a@s.whatsapp.net' }], count: 1 };
	const { context, requests } = createExecuteContext(
		{
			resource: 'chat',
			operation: 'getMany',
			snapshotFilters: { limit: 500 },
		},
		responseData,
	);

	const output = await node.execute.call(context);

	assert.equal(requests.length, 1);
	assert.equal(requests[0].method, 'GET');
	assert.equal(requests[0].url, 'https://wa-instance.example.com/chats');
	assert.deepEqual(requests[0].qs, { limit: 500 });
	assert.deepEqual(output, [[{ json: responseData, pairedItem: 0 }]]);
});

test('Chat Get Recent Messages calls /chats/:jid/messages and returns response.items as n8n items', async () => {
	const node = new BaileysInstance();
	const responseData = {
		chat_jid: '123@s.whatsapp.net',
		items: [
			{ message_id: 'm1', text: 'hola' },
			{ message_id: 'm2', text: 'adios' },
		],
		count: 2,
	};
	const { context, requests } = createExecuteContext(
		{
			resource: 'chat',
			operation: 'getRecentMessages',
			chatJid: '123@s.whatsapp.net',
			chatMessagesLimit: 25,
		},
		responseData,
	);

	const output = await node.execute.call(context);

	assert.equal(requests[0].method, 'GET');
	assert.equal(
		requests[0].url,
		'https://wa-instance.example.com/chats/123%40s.whatsapp.net/messages',
	);
	assert.deepEqual(requests[0].qs, { limit: 25 });
	assert.deepEqual(output, [
		[
			{ json: responseData.items[0], pairedItem: 0 },
			{ json: responseData.items[1], pairedItem: 0 },
		],
	]);
});
