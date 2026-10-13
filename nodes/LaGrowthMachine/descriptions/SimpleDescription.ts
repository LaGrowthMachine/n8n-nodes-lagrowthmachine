import { INodeProperties } from 'n8n-workflow';

// Member and Credit expose simple read operations with no parameters.
// They are grouped here to keep the node file tidy.

export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['member'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', action: 'Get many members', description: 'Get many workspace members' },
			{ name: 'Get Me', value: 'getMe', action: 'Get the authenticated member', description: 'Get the member (ID and email) behind the API key used for the call' },
		],
		default: 'getAll',
	},
];

export const creditOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['credit'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get the credit balance', description: 'Get the credit balance of the account' },
		],
		default: 'get',
	},
];
