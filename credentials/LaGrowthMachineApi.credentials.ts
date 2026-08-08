import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LaGrowthMachineApi implements ICredentialType {
	name = 'laGrowthMachineApi';

	displayName = 'La Growth Machine API';

	icon: Icon = 'file:lagrowthmachine-logo.svg';

	documentationUrl = 'https://documenter.getpostman.com/view/32966764/2sBXqFM2Vv';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your La Growth Machine API key. Generate it from Settings → API at https://app.lagrowthmachine.com/settings/api (you must be logged in).',
		},
	];

	// Sent on every request. LGM accepts the key as an "Authorization: Bearer"
	// header, an "x-api-key" header, or an "?apikey=" query string — they are
	// equivalent. We use the recommended Authorization header.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Used by the "Test" button in the credential UI. /members is the endpoint
	// LGM documents for verifying authentication.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://apiv2.lagrowthmachine.com/flow',
			url: '/members',
		},
	};
}
