"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaileysInstanceApi = void 0;
class BaileysInstanceApi {
    constructor() {
        this.name = 'baileysInstanceApi';
        this.displayName = 'Baileys Instance API';
        this.documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/';
        this.icon = {
            light: 'file:baileysInstance.svg',
            dark: 'file:baileysInstance.dark.svg',
        };
        this.properties = [
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
                description: 'Request timeout in milliseconds. Increase it when sends can stay queued or proxied for longer.',
            },
            {
                displayName: 'Allow Self-Signed TLS Certificates',
                name: 'tlsAllowSelfSigned',
                type: 'boolean',
                default: false,
                description: 'Whether to skip TLS certificate validation for internal environments',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/status',
                method: 'GET',
                skipSslCertificateValidation: '={{$credentials.tlsAllowSelfSigned}}',
            },
        };
    }
}
exports.BaileysInstanceApi = BaileysInstanceApi;
//# sourceMappingURL=BaileysInstanceApi.credentials.js.map