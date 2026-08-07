import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['campaign'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a campaign', description: 'Get a single campaign by ID' },
			{ name: 'Get Lead Stats', value: 'getLeadStats', action: 'Get per lead stats of a campaign', description: 'Get per-lead engagement stats for a campaign' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many campaigns', description: 'Get many campaigns' },
			{ name: 'Get Messages', value: 'getMessages', action: 'Get campaign messages', description: 'Get the message templates of a campaign sequence' },
			{ name: 'Get Stats', value: 'getStats', action: 'Get campaign stats', description: 'Get aggregated engagement stats for a campaign' },
		],
		default: 'getAll',
	},
];

export const campaignFields: INodeProperties[] = [
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['get', 'getStats', 'getLeadStats', 'getMessages'] } },
		description: 'The 24-char campaign ID',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['campaign'], operation: ['getAll', 'getLeadStats'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['campaign'], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
