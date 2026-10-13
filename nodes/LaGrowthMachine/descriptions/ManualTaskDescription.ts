import { INodeProperties } from 'n8n-workflow';

const LEAD_TAGS = [
	'ACTIVATED', 'ALREADY_EQUIPPED', 'CALL_BOOKED', 'COMPLETED_WITHOUT_REPLY', 'CONTACTED',
	'CONVERTED', 'ENRICHED', 'INTERESTED', 'NEGOTIATING', 'NOT_ACTIVATED', 'NOT_INTERESTED',
	'OUT_OF_OFFICE', 'READY_TO_BUY', 'SKIPPED', 'TO_QUALIFY', 'UNSUBSCRIBED', 'WRONG_TARGET',
	'WRONG_TIMING',
];

export const manualTaskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['manualTask'] } },
		options: [
			{ name: 'Complete Call Task', value: 'completeCall', action: 'Complete a call manual task', description: 'Log the outcome of a call task, as in the inbox' },
			{ name: 'Complete Message Task', value: 'completeMessage', action: 'Complete a message manual task', description: 'Provide the custom message a campaign step will send to the lead' },
		],
		default: 'completeCall',
	},
];

export const manualTaskFields: INodeProperties[] = [
	{
		displayName: 'Manual Task ID',
		name: 'manualTaskId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['manualTask'], operation: ['completeCall', 'completeMessage'] } },
		description: 'The 24-char manual task ID',
	},

	// ----------------------------------
	//      manualTask:completeCall
	// ----------------------------------
	{
		displayName: 'Call Status',
		name: 'callStatus',
		type: 'options',
		default: 'DECISIVE',
		required: true,
		displayOptions: { show: { resource: ['manualTask'], operation: ['completeCall'] } },
		options: [
			{ name: 'Decisive', value: 'DECISIVE', description: 'The call happened and was conclusive' },
			{ name: 'Unreachable', value: 'UNREACHABLE', description: 'The lead could not be reached' },
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manualTask'], operation: ['completeCall'] } },
		options: [
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'options',
				default: 'CALL_BOOKED',
				options: LEAD_TAGS.map((t) => ({ name: t, value: t })),
				description: 'Lead tag applied together with the call outcome',
			},
		],
	},

	// ----------------------------------
	//    manualTask:completeMessage
	// ----------------------------------
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['manualTask'], operation: ['completeMessage'] } },
		description: 'The message the campaign step will send. Plain text for LinkedIn steps, HTML body for email steps.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manualTask'], operation: ['completeMessage'] } },
		description: 'Email steps only; ignored on LinkedIn steps',
		options: [
			{ displayName: 'Attachments', name: 'attachments', type: 'string', default: '', description: 'Comma-separated list of attachment URLs' },
			{ displayName: 'BCC', name: 'bcc', type: 'string', default: '' },
			{ displayName: 'CC', name: 'cc', type: 'string', default: '' },
			{ displayName: 'Subject', name: 'subject', type: 'string', default: '' },
		],
	},
];
