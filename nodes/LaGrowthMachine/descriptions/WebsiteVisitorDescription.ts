import { INodeProperties } from 'n8n-workflow';

export const websiteVisitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['websiteVisitor'] } },
		options: [
			{ name: 'Push', value: 'push', action: 'Push a website visitor into an audience', description: 'Push an identified website visitor into an audience (RB2B / Warmly / Vector native format)' },
		],
		default: 'push',
	},
];

export const websiteVisitorFields: INodeProperties[] = [
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		default: 'rb2b',
		displayOptions: { show: { resource: ['websiteVisitor'], operation: ['push'] } },
		options: [
			{ name: 'RB2B', value: 'rb2b' },
			{ name: 'Vector', value: 'vector' },
			{ name: 'Warmly', value: 'warmly' },
		],
		description: 'The visitor-tracking provider whose native payload is being forwarded',
	},
	{
		displayName: 'Audience Name',
		name: 'audienceName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['websiteVisitor'], operation: ['push'] } },
		description: 'Name of the target audience. It is created if it does not exist.',
	},
	{
		displayName: 'Payload',
		name: 'payload',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: { show: { resource: ['websiteVisitor'], operation: ['push'] } },
		description: "The visitor payload in the provider's native field format (mapped to lead fields by LGM)",
	},
];
