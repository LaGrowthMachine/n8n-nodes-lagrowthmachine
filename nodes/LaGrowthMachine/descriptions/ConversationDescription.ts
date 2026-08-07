import { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['conversation'] } },
		options: [
			{ name: 'Archive', value: 'archive', action: 'Archive a conversation', description: 'Move a conversation out of the active inbox' },
			{ name: 'Edit Note', value: 'editNote', action: 'Edit a conversation note', description: 'Set or append the note attached to a conversation' },
			{ name: 'Get Many', value: 'search', action: 'Search conversations', description: 'Search and paginate inbox conversations' },
			{ name: 'Get Messages', value: 'getMessages', action: 'Get messages of a conversation', description: 'Get all messages of a conversation' },
			{ name: 'Snooze', value: 'snooze', action: 'Snooze a conversation', description: 'Hide a conversation until a chosen date' },
			{ name: 'Unarchive', value: 'unarchive', action: 'Unarchive a conversation', description: 'Bring an archived conversation back to the inbox' },
			{ name: 'Unsnooze', value: 'unsnooze', action: 'Unsnooze a conversation', description: 'Wake a snoozed conversation up immediately' },
		],
		default: 'search',
	},
];

// Shared: how to target a conversation for the action endpoints.
const conversationTargetFields: INodeProperties[] = [
	{ displayName: 'Campaign ID', name: 'campaignId', type: 'string', default: '', description: 'Disambiguate when a lead has several conversations' },
	{ displayName: 'Campaign Name', name: 'campaignName', type: 'string', default: '', description: 'Disambiguate when a lead has several conversations' },
	{ displayName: 'Conversation ID', name: 'conversationId', type: 'string', default: '', description: 'Direct conversation ID (fastest, most reliable)' },
	{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@company.com' },
	{ displayName: 'Identity ID', name: 'identityId', type: 'string', default: '', description: 'Disambiguate when a lead has several conversations' },
	{ displayName: 'Lead ID', name: 'leadId', type: 'string', default: '' },
	{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
];

export const conversationFields: INodeProperties[] = [
	// ---------- search ----------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['conversation'], operation: ['search', 'getMessages'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['conversation'], operation: ['search'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['conversation'], operation: ['search'] } },
		options: [
			{ displayName: 'Audience IDs', name: 'audienceIds', type: 'string', default: '', description: 'Comma-separated audience IDs' },
			{ displayName: 'Campaign IDs', name: 'campaignIds', type: 'string', default: '', description: 'Comma-separated campaign IDs' },
			{ displayName: 'Favourite', name: 'favourite', type: 'boolean', default: false },
			{ displayName: 'Identity IDs', name: 'identityIds', type: 'string', default: '', description: 'Comma-separated identity IDs' },
			{ displayName: 'Last Message At From', name: 'lastMessageAtFrom', type: 'number', default: 0, description: 'Lower bound on the last message date (epoch ms)' },
			{ displayName: 'Last Message At To', name: 'lastMessageAtTo', type: 'number', default: 0, description: 'Upper bound on the last message date (epoch ms)' },
			{ displayName: 'Last Message Status', name: 'lastMessageStatus', type: 'string', default: '', description: 'E.g. RECEIVED, SENT, SEND_FAILED.' },
			{ displayName: 'Last Message Type', name: 'lastMessageType', type: 'string', default: '', description: 'E.g. LINKEDIN, EMAIL, LGM.' },
			{ displayName: 'Lead IDs', name: 'leadIds', type: 'string', default: '', description: 'Comma-separated lead IDs' },
			{ displayName: 'Lead Replied', name: 'leadReplied', type: 'boolean', default: false },
			{ displayName: 'Query', name: 'q', type: 'string', default: '' },
			{ displayName: 'Read', name: 'read', type: 'boolean', default: false },
			{ displayName: 'Sort Direction', name: 'sortDirection', type: 'options', default: -1, options: [{ name: 'Descending', value: -1 }, { name: 'Ascending', value: 1 }] },
			{ displayName: 'Sort Field', name: 'sortField', type: 'options', default: 'lastMessageAt', options: [{ name: 'Call Completed At', value: 'callCompletedAt' }, { name: 'Last Message At', value: 'lastMessageAt' }, { name: 'Snooze Until', value: 'snoozeUntil' }] },
			{ displayName: 'Status', name: 'status', type: 'string', default: '', description: 'Comma-separated: OPEN, SNOOZED, ARCHIVED' },
			{ displayName: 'Unsubscribed', name: 'unsubscribed', type: 'boolean', default: false },
		],
	},

	// ---------- getMessages ----------
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['conversation'], operation: ['getMessages'] } },
		description: 'The 24-char conversation ID',
	},

	// ---------- archive / unarchive / snooze / unsnooze / editNote ----------
	{
		displayName: 'Target',
		name: 'target',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['conversation'], operation: ['archive', 'unarchive', 'snooze', 'unsnooze', 'editNote'] } },
		description: 'How to find the conversation. Provide at least one of Conversation ID, Lead ID, Email or LinkedIn URL.',
		options: conversationTargetFields,
	},
	{
		displayName: 'Snooze Until',
		name: 'snoozeUntil',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['conversation'], operation: ['snooze'] } },
		description: 'Date/time until which the conversation stays hidden (ISO 8601)',
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['conversation'], operation: ['editNote'] } },
		description: 'Note content (max 1500 characters)',
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		default: 'replace',
		displayOptions: { show: { resource: ['conversation'], operation: ['editNote'] } },
		options: [
			{ name: 'Replace', value: 'replace', description: 'Replace the entire note' },
			{ name: 'Append', value: 'append', description: 'Append after a timestamp separator' },
		],
	},
];
