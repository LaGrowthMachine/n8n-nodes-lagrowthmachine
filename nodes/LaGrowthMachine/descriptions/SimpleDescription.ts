import { INodeProperties } from 'n8n-workflow';

// Identity, Member and Credit each expose a single read operation with no
// parameters. They are grouped here to keep the node file tidy.

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['identity'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', action: 'Get many identities', description: 'Get many connected identities' },
		],
		default: 'getAll',
	},
];

export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['member'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', action: 'Get many members', description: 'Get many workspace members' },
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
