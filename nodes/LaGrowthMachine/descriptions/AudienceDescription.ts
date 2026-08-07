import { INodeProperties } from 'n8n-workflow';

export const audienceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['audience'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an empty audience',
				description: 'Create a new empty audience',
			},
			{
				name: 'Get Details',
				value: 'getDetail',
				action: 'Get audience details',
				description: 'Return details about a specific audience',
			},
			{
				name: 'Get Leads',
				value: 'getLeads',
				action: 'Get audience leads',
				description: 'Return the leads of an audience with their full record',
			},
			{
				name: 'Import From LinkedIn',
				value: 'importFromLinkedIn',
				action: 'Import leads into an audience',
				description: 'Populate an audience from a LinkedIn search, Sales Navigator search, a post (likers/commenters), or an event (attendees)',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List audiences',
				description: 'Return all audiences of the account',
			},
		],
		default: 'list',
	},
];

export const audienceFields: INodeProperties[] = [
	// ----------------------------------
	//           audience:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['audience'], operation: ['create'] } },
		description: 'Name of the audience (1-100 characters)',
	},

	// ----------------------------------
	//     audience:importFromLinkedIn
	// ----------------------------------
	{
		displayName: 'Audience Name',
		name: 'audience',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['audience'], operation: ['importFromLinkedIn'] } },
		description: 'Name of an existing audience, or a new one to create',
	},
	{
		displayName: 'LinkedIn URL',
		name: 'linkedinUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['audience'], operation: ['importFromLinkedIn'] } },
		description:
			'Any of: a LinkedIn regular search URL, a Sales Navigator search URL, a LinkedIn post URL (imports the likers or commenters — see the "LinkedIn Post Category" option), or a LinkedIn event URL (imports the attendees). LGM detects the type automatically.',
	},
	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['audience'], operation: ['importFromLinkedIn'] } },
		description: 'ID of the identity to run the search with. LinkedIn must be connected and the widget open.',
	},
	{
		displayName: 'Options',
		name: 'importOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['audience'], operation: ['importFromLinkedIn'] } },
		options: [
			{
				displayName: 'LinkedIn Post Category',
				name: 'linkedinPostCategory',
				type: 'options',
				default: 'like',
				options: [
					{ name: 'Like', value: 'like' },
					{ name: 'Comment', value: 'comment' },
				],
				description: 'Only for a LinkedIn post URL: import the people who liked or commented on the post. Ignored for search and event URLs.',
			},
			{ displayName: 'Exclude Contacted Leads', name: 'excludeContactedLeads', type: 'boolean', default: false },
			{ displayName: 'Auto Import New Leads', name: 'autoImport', type: 'boolean', default: false },
		],
	},

	// ----------------------------------
	//    audience:getDetail / getLeads
	// ----------------------------------
	{
		displayName: 'Audience ID',
		name: 'audienceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['audience'], operation: ['getDetail', 'getLeads'] } },
		description: 'The 24-char audience ID',
	},

	// ----------------------------------
	//         audience:getLeads
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['audience'], operation: ['getLeads'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['audience'], operation: ['getLeads'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
