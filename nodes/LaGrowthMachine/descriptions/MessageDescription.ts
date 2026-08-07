import { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['message'] } },
		options: [
			{ name: 'Send Email', value: 'sendEmail', action: 'Send an email to a lead', description: 'Send a custom email to a lead via a connected email identity' },
			{ name: 'Send LinkedIn Message', value: 'sendLinkedIn', action: 'Send a direct message to a lead', description: 'Send a LinkedIn text or voice message to a lead via a connected identity' },
		],
		default: 'sendLinkedIn',
	},
];

export const messageFields: INodeProperties[] = [
	// ---------- common ----------
	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['message'] } },
		description: 'ID of the connected identity that will send the message',
	},

	// ---------- sendLinkedIn ----------
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendLinkedIn'] } },
		description: 'ID of the member performing the action (from the Member resource)',
	},
	{
		displayName: 'Target',
		name: 'target',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['sendLinkedIn'] } },
		description: 'Provide a Lead ID or a LinkedIn URL',
		options: [
			{ displayName: 'Lead ID', name: 'leadId', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendLinkedIn'] } },
		description: 'Text message to send. Required unless an Audio URL is provided.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['sendLinkedIn'] } },
		options: [
			{ displayName: 'Attachments', name: 'attachments', type: 'string', default: '', description: 'Comma-separated list of file URLs to attach' },
			{ displayName: 'Audio URL', name: 'audioUrl', type: 'string', default: '', description: 'URL to a hosted voice message (MP3). Used when no text message is provided.' },
			{ displayName: 'Source', name: 'source', type: 'string', default: 'n8n', description: 'Source identifier for tracking (e.g. n8n)' },
		],
	},

	// ---------- sendEmail ----------
	{
		displayName: 'Target',
		name: 'targetEmail',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['sendEmail'] } },
		description: 'Provide a Lead ID or a Lead Email',
		options: [
			{ displayName: 'Lead Email', name: 'leadEmail', type: 'string', default: '', placeholder: 'name@company.com' },
			{ displayName: 'Lead ID', name: 'leadId', type: 'string', default: '' },
		],
	},
	{
		displayName: 'HTML Body',
		name: 'messageHtml',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendEmail'] } },
		description: 'The HTML version of the email body',
	},
	{
		displayName: 'Text Body',
		name: 'messageText',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendEmail'] } },
		description: 'The plain-text version of the email body',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFieldsEmail',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['sendEmail'] } },
		description: 'You must provide at least one of Subject, Reply In Last Thread, or Reply To Message ID',
		options: [
			{ displayName: 'BCC', name: 'bcc', type: 'string', default: '', description: 'Comma-separated list of BCC recipients' },
			{ displayName: 'CC', name: 'cc', type: 'string', default: '', description: 'Comma-separated list of CC recipients' },
			{ displayName: 'Reply In Last Thread', name: 'replyInLastThread', type: 'boolean', default: false },
			{ displayName: 'Reply To Message ID', name: 'replyToMessageId', type: 'string', default: '' },
			{ displayName: 'Subject', name: 'subject', type: 'string', default: '', description: 'Required if not replying' },
		],
	},
];
