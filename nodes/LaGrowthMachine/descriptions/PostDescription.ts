import { INodeProperties } from 'n8n-workflow';

export const postOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['post'] } },
		options: [
			{ name: 'Enrich', value: 'enrich', action: 'Enrich a public post', description: 'Fetch the content and engagement of a public LinkedIn post. Costs 1 credit per successful call.' },
		],
		default: 'enrich',
	},
];

export const postFields: INodeProperties[] = [
	{
		displayName: 'Post URL',
		name: 'postUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['post'], operation: ['enrich'] } },
		placeholder: 'https://www.linkedin.com/posts/…',
		description: 'URL of the public LinkedIn post to fetch',
	},
];
