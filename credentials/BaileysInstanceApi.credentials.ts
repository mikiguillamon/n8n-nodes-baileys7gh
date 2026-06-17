import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BaileysInstanceApi implements ICredentialType {
	name = 'baileysInstanceApi';

	displayName = 'Baileys Instance API';

	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/';

	icon: Icon = {
		light: 'file:baileysInstance.svg',
		dark: 'file:baileysInstance.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:3000',
			placeholder: 'https://wa-instance.example.com',
			description: 'Base URL of the wa-instance API',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Timeout (ms)',
			name: 'timeout',
			type: 'number',
			default: 30000,
			description: 'Request timeout in milliseconds',
		},
		{
			displayName: 'Allow Self-Signed TLS Certificates',
			name: 'tlsAllowSelfSigned',
			type: 'boolean',
			default: false,
			description: 'Whether to skip TLS certificate validation for internal environments',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/health/deps',
			method: 'GET',
			skipSslCertificateValidation: '={{$credentials.tlsAllowSelfSigned}}',
		},
	};
}
