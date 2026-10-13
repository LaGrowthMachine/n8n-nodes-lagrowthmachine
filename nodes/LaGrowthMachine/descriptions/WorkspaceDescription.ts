import { INodeProperties } from 'n8n-workflow';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['workspace'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many workspaces',
				description: 'List the workspaces the authenticated account can act in. To act in another workspace, set its ID in the credential ("Workspace ID").',
			},
		],
		default: 'getAll',
	},
];
