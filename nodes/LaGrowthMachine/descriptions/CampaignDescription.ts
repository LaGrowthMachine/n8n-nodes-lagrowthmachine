import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['campaign'] } },
		options: [
			{ name: 'Add Step Message', value: 'addStepMessage', action: 'Add a message to an empty campaign step', description: 'Create a message on a step that has none yet (channel inferred from the step)' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a campaign', description: 'Create a draft copy (status READY, not launched) of one of your campaigns or of a public template' },
			{ name: 'Duplicate From Code', value: 'duplicateFromCode', action: 'Duplicate a campaign shared by code', description: 'Copy a campaign shared with an access code into your workspace as a draft' },
			{ name: 'Edit Message', value: 'editMessage', action: 'Edit a campaign message', description: 'Replace the content of an existing message of a campaign step. Not retroactive on leads already past the step.' },
			{ name: 'Get', value: 'get', action: 'Get a campaign', description: 'Get a single campaign by ID' },
			{ name: 'Get Lead Stats', value: 'getLeadStats', action: 'Get per lead stats of a campaign', description: 'Get per-lead engagement stats for a campaign' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many campaigns', description: 'Get many campaigns' },
			{ name: 'Get Messages', value: 'getMessages', action: 'Get campaign messages', description: 'Get the message templates of a campaign sequence' },
			{ name: 'Get Public', value: 'getPublic', action: 'Get public campaigns', description: 'List the ready-made catalog and creator templates anyone can duplicate' },
			{ name: 'Get Stats', value: 'getStats', action: 'Get campaign stats', description: 'Get aggregated engagement stats for a campaign' },
			{ name: 'Get Steps', value: 'getSteps', action: 'Get campaign steps', description: 'List the message-carrying steps of a campaign sequence, with their step and template IDs' },
			{ name: 'Preview From Code', value: 'previewFromCode', action: 'Preview a campaign shared by code', description: 'Preview the sequence and messages of a campaign shared with an access code' },
			{ name: 'Share by Code', value: 'share', action: 'Share a campaign by code', description: 'Generate an access code so another LGM account can preview and copy the campaign. Idempotent.' },
			{ name: 'Stop Sharing', value: 'stopSharing', action: 'Stop sharing a campaign by code', description: 'Revoke the access code of a campaign. Idempotent.' },
			{ name: 'Update Settings', value: 'updateSettings', action: 'Update campaign settings', description: 'Update one or more settings of a campaign (name, audience, enrichment, CRM sync…)' },
			{ name: 'Update Status', value: 'updateStatus', action: 'Pause or resume a campaign', description: 'Pause a RUNNING campaign or resume a PAUSED one. Does not launch a READY campaign.' },
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
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: [
					'addStepMessage', 'duplicate', 'editMessage', 'get', 'getLeadStats',
					'getMessages', 'getStats', 'getSteps', 'share', 'stopSharing',
					'updateSettings', 'updateStatus',
				],
			},
		},
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
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['getAll'] } },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Canceled', value: 'CANCELED' },
			{ name: 'Paused', value: 'PAUSED' },
			{ name: 'Ready', value: 'READY' },
			{ name: 'Running', value: 'RUNNING' },
		],
		description: 'Filter campaigns by their status',
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['getAll'] } },
		description: 'Optional: case-insensitive search on the campaign name',
	},

	// ----------------------------------
	//         campaign:getPublic
	// ----------------------------------
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'public',
		displayOptions: { show: { resource: ['campaign'], operation: ['getPublic'] } },
		options: [
			{ name: 'Featured', value: 'featured', description: 'Catalog campaigns flagged as featured' },
			{ name: 'Public', value: 'public', description: 'The full list: official catalog templates, then creator templates' },
			{ name: 'Recommended', value: 'recommended', description: 'A short curated catalog shortlist, the usual starting point' },
		],
		description: 'Which set of public campaigns to return',
	},

	// ----------------------------------
	//  campaign:previewFromCode / duplicateFromCode
	// ----------------------------------
	{
		displayName: 'Access Code',
		name: 'code',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['previewFromCode', 'duplicateFromCode'] } },
		description: 'The access code received from the campaign owner (generated with "Share by Code")',
	},

	// ----------------------------------
	//       campaign:updateSettings
	// ----------------------------------
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: { show: { resource: ['campaign'], operation: ['updateSettings'] } },
		description: 'Send only the settings to change; at least one is required. Some settings depend on the campaign status (e.g. audience only while READY, CRM sync not while RUNNING).',
		options: [
			{ displayName: 'Audience ID', name: 'audienceId', type: 'string', default: '', description: 'Audience of the campaign. Can only be changed while the campaign is READY.' },
			{ displayName: 'Auto Reschedule Out of Office', name: 'autoRescheduleOutOfOffice', type: 'boolean', default: false, description: 'Whether to automatically reschedule leads that are out of office' },
			{ displayName: 'Enrich', name: 'enrich', type: 'boolean', default: false, description: 'Whether to enrich the campaign leads automatically' },
			{ displayName: 'HubSpot Sync', name: 'hubspot', type: 'boolean', default: false, description: 'Whether to sync the campaign with HubSpot. Cannot be changed while RUNNING.' },
			{ displayName: 'Ignore Emoji-Only Reply', name: 'ignoreEmojiOnlyReply', type: 'boolean', default: false, description: 'Whether emoji-only replies are ignored (the sequence continues). Only while READY or PAUSED.' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New campaign name; must not be used by another campaign of the workspace' },
			{ displayName: 'Pipedrive Sync', name: 'pipedrive', type: 'boolean', default: false, description: 'Whether to sync the campaign with Pipedrive. Cannot be changed while RUNNING.' },
			{ displayName: 'Skip Already Contacted', name: 'skipAlreadyContacted', type: 'boolean', default: false, description: 'Whether to skip leads already contacted by another campaign. Only while READY or PAUSED.' },
		],
	},

	// ----------------------------------
	//        campaign:updateStatus
	// ----------------------------------
	{
		displayName: 'New Status',
		name: 'newStatus',
		type: 'options',
		default: 'PAUSED',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['updateStatus'] } },
		options: [
			{ name: 'Paused', value: 'PAUSED', description: 'Pause a RUNNING campaign; scheduled actions are put on hold' },
			{ name: 'Running', value: 'RUNNING', description: 'Resume a PAUSED campaign; pending actions are scheduled again' },
		],
		description: 'Target status. Not idempotent: pausing an already paused campaign (or resuming a running one) returns a 400 error.',
	},

	// ----------------------------------
	//  campaign:addStepMessage / editMessage
	// ----------------------------------
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['addStepMessage'] } },
		description: 'ID of the empty step to fill (from "Get Steps", a step with hasMessage: false)',
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['editMessage'] } },
		description: 'ID of the message to edit (the ID of each item returned by "Get Messages")',
	},
	{
		displayName: 'Message HTML',
		name: 'newHtml',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['campaign'], operation: ['addStepMessage', 'editMessage'] } },
		placeholder: '<p>Hi <var name="firstname" default="there"/>, a quick question.</p>',
		description: 'Message body as block tags on a single line (<p>…</p><p>…</p>). Personalization variables as <var name="firstname" default="there"/>. See the API docs for the full format.',
	},
	{
		displayName: 'Subject HTML',
		name: 'subjectNewHtml',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['addStepMessage', 'editMessage'] } },
		placeholder: '<p>Quick question for <var name="company"/></p>',
		description: 'Email subject in the same format (email steps only)',
	},
];
