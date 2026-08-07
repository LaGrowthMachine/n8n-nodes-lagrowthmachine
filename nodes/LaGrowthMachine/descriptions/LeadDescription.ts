import { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lead'] } },
		options: [
			{
				name: 'Create or Update',
				value: 'createOrUpdate',
				action: 'Create or update a lead',
				description: 'Create a lead, or update it if it already exists',
			},
			{
				name: 'Enrich',
				value: 'enrich',
				action: 'Enrich a lead',
				description: 'Start an enrichment (email and/or LinkedIn profile). Consumes credits.',
			},
			{
				name: 'Get Conversations',
				value: 'getConversations',
				action: 'Get lead conversations',
				description: 'Retrieve all conversations of a lead',
			},
			{
				name: 'Get Enrich Result',
				value: 'getEnrichResult',
				action: 'Get an enrichment result',
				description: 'Retrieve the result of a polling enrichment request',
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				action: 'Get lead activity logs',
				description: 'Retrieve the activity logs of a lead',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search leads',
				description: 'Find one or more leads by ID, email, LinkedIn, name, or CRM ID',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update a lead status',
				description: 'Change a lead status inside one or more campaigns',
			},
		],
		default: 'createOrUpdate',
	},
];

// Reusable identifier collection: most write endpoints accept any of these.
const leadIdentifierFields: INodeProperties[] = [
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		default: '',
		description: 'The 24-char LGM lead ID (takes priority over every other identifier)',
	},
	{ displayName: 'Pro Email', name: 'proEmail', type: 'string', default: '', placeholder: 'name@company.com' },
	{ displayName: 'Perso Email', name: 'persoEmail', type: 'string', default: '', placeholder: 'name@gmail.com' },
	{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
	{ displayName: 'Twitter', name: 'twitter', type: 'string', default: '' },
	{ displayName: 'First Name', name: 'firstname', type: 'string', default: '' },
	{ displayName: 'Last Name', name: 'lastname', type: 'string', default: '' },
	{ displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
	{ displayName: 'Company URL', name: 'companyUrl', type: 'string', default: '' },
];

export const leadFields: INodeProperties[] = [
	// ----------------------------------
	//        lead:createOrUpdate
	// ----------------------------------
	{
		displayName: 'Audience Name',
		name: 'audience',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['lead'], operation: ['createOrUpdate'] } },
		description:
			'Name of the target audience. If it does not exist it is created. Leave empty to create the lead with no audience.',
	},
	{
		displayName: 'Identifiers',
		name: 'identifiers',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['createOrUpdate'] } },
		description:
			'At least one identifier is required: Lead ID, an email, LinkedIn URL, Twitter, OR First + Last name (+ company)',
		options: leadIdentifierFields,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['createOrUpdate'] } },
		options: [
			{ displayName: 'Bio', name: 'bio', type: 'string', default: '' },
			{ displayName: 'CRM ID', name: 'crm_id', type: 'string', default: '' },
			{
				displayName: 'Custom Attributes',
				name: 'customAttributes',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						name: 'attribute',
						displayName: 'Attribute',
						values: [
							{ displayName: 'Name', name: 'key', type: 'options', default: 'customAttribute1', options: Array.from({ length: 10 }, (_, i) => ({ name: `Custom Attribute ${i + 1}`, value: `customAttribute${i + 1}` })) },
							{ displayName: 'Value', name: 'value', type: 'string', default: '' },
						],
					},
				],
			},
			{ displayName: 'Gender', name: 'gender', type: 'options', options: [{ name: 'Man', value: 'man' }, { name: 'Woman', value: 'woman' }], default: 'man' },
			{ displayName: 'Industry', name: 'industry', type: 'string', default: '' },
			{ displayName: 'Job Title', name: 'jobTitle', type: 'string', default: '' },
			{ displayName: 'Location', name: 'location', type: 'string', default: '' },
			{ displayName: 'Phone', name: 'phone', type: 'string', default: '' },
			{ displayName: 'Profile Picture URL', name: 'profilePicture', type: 'string', default: '' },
			{ displayName: 'Relations Count', name: 'relationsCount', type: 'number', default: 0 },
		],
	},

	// ----------------------------------
	//              lead:search
	// ----------------------------------
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'collection',
		placeholder: 'Add Criterion',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['search'] } },
		description: 'At least one criterion is required',
		options: [
			{ displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
			{ displayName: 'Company URL', name: 'companyUrl', type: 'string', default: '' },
			{ displayName: 'CRM ID', name: 'crmId', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@company.com' },
			{ displayName: 'First Name', name: 'firstname', type: 'string', default: '' },
			{ displayName: 'Industry', name: 'industry', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastname', type: 'string', default: '' },
			{ displayName: 'Lead ID', name: 'leadId', type: 'string', default: '' },
			{ displayName: 'LinkedIn ID', name: 'linkedinId', type: 'string', default: '' },
			{ displayName: 'LinkedIn Public ID', name: 'linkedinPublicId', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
			{ displayName: 'Location', name: 'location', type: 'string', default: '' },
		],
	},

	// ----------------------------------
	//          lead:updateStatus
	// ----------------------------------
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'PAUSED',
		required: true,
		displayOptions: { show: { resource: ['lead'], operation: ['updateStatus'] } },
		options: [
			'PAUSED', 'RESUME', 'STOPPED', 'CONVERTED', 'SUBSCRIBED', 'UNSUBSCRIBED',
			'NOT_ACTIVATED', 'ALREADY_EQUIPPED', 'ENRICHED', 'CONTACTED', 'COMPLETED_WITHOUT_REPLY',
			'TO_QUALIFY', 'OUT_OF_OFFICE', 'WRONG_TIMING', 'CALL_BOOKED', 'INTERESTED',
			'NOT_INTERESTED', 'WRONG_TARGET', 'NEGOTIATING', 'READY_TO_BUY',
		].map((s) => ({ name: s, value: s })),
	},
	{
		displayName: 'Campaign',
		name: 'campaign',
		type: 'string',
		default: 'all',
		required: true,
		displayOptions: { show: { resource: ['lead'], operation: ['updateStatus'] } },
		description: 'Campaign name, "all", or a comma-separated list of campaign names',
	},
	{
		displayName: 'Identifiers',
		name: 'identifiers',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['updateStatus'] } },
		description: 'At least one identifier is required to target the lead',
		options: leadIdentifierFields,
	},

	// ----------------------------------
	//   lead:getLogs / getConversations
	// ----------------------------------
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['lead'], operation: ['getLogs', 'getConversations'] } },
		description: 'The 24-char LGM lead ID',
	},
	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['lead'], operation: ['getLogs', 'getConversations'] } },
		description: 'Optional: filter by a specific identity',
	},

	// ----------------------------------
	//              lead:enrich
	// ----------------------------------
	{
		displayName: 'Enrich Type',
		name: 'enrichType',
		type: 'options',
		default: 'EMAIL_ENRICH',
		displayOptions: { show: { resource: ['lead'], operation: ['enrich'] } },
		options: [
			{ name: 'Email (5 Credits)', value: 'EMAIL_ENRICH', description: 'Pro email + email status. Works from name + company, no lead ID needed.' },
			{ name: 'LinkedIn (1 Credit)', value: 'LINKEDIN_ENRICH', description: 'LinkedIn profile fields. Requires a Lead ID.' },
			{ name: 'Full (5 Credits)', value: 'FULL_ENRICH', description: 'LinkedIn profile + email. Requires a Lead ID.' },
		],
	},
	{
		displayName: 'Identifiers',
		name: 'identifiers',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['enrich'] } },
		description:
			'Lead ID, OR First + Last name (+ company / LinkedIn URL). LinkedIn & Full enrichment require a Lead ID.',
		options: [
			{ displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
			{ displayName: 'Company URL', name: 'companyUrl', type: 'string', default: '' },
			{ displayName: 'First Name', name: 'firstname', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastname', type: 'string', default: '' },
			{ displayName: 'Lead ID', name: 'leadId', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		default: 'polling',
		displayOptions: { show: { resource: ['lead'], operation: ['enrich'] } },
		options: [
			{ name: 'Polling', value: 'polling', description: 'Returns an enrichRequestId immediately; retrieve later with "Get Enrich Result"' },
			{ name: 'Sync', value: 'sync', description: 'Waits for the result (may time out on large enrichments)' },
			{ name: 'Webhook', value: 'webhook', description: 'Returns immediately; the result is POSTed to your webhook URL' },
		],
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['lead'], operation: ['enrich'], mode: ['webhook'] } },
		description: 'HTTPS URL that will receive the enrichment result',
	},

	// ----------------------------------
	//         lead:getEnrichResult
	// ----------------------------------
	{
		displayName: 'Enrich Request ID',
		name: 'enrichRequestId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['lead'], operation: ['getEnrichResult'] } },
		description: 'The enrichRequestId returned by a polling enrichment',
	},

	// ----------------------------------
	//     shared pagination (getLogs)
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['lead'], operation: ['getLogs'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['lead'], operation: ['getLogs'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
