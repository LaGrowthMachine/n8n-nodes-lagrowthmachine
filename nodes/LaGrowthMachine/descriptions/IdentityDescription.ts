import { INodeProperties } from 'n8n-workflow';

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['identity'] } },
		options: [
			{ name: 'Delete Preference', value: 'deletePreference', action: 'Delete an identity preference', description: 'Delete one preference of an identity' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many identities', description: 'Get many connected identities' },
			{ name: 'Get Preferences', value: 'getPreferences', action: 'Get identity preferences', description: 'List the key-value preferences saved for an identity' },
			{ name: 'Save Preference', value: 'savePreference', action: 'Save an identity preference', description: 'Create or update a preference of an identity (same category + key + channel replaces the value)' },
		],
		default: 'getAll',
	},
];

export const identityFields: INodeProperties[] = [
	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['getPreferences', 'savePreference', 'deletePreference'] } },
		description: 'The 24-char identity ID (from "Get Many")',
	},

	// ----------------------------------
	//      identity:getPreferences
	// ----------------------------------
	{
		displayName: 'Category',
		name: 'category',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['identity'], operation: ['getPreferences'] } },
		description: 'Optional: only return the preferences of this category',
	},

	// ----------------------------------
	//      identity:savePreference
	// ----------------------------------
	{
		displayName: 'Category',
		name: 'prefCategory',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['savePreference'] } },
		description: 'Preference category (e.g. "tone")',
	},
	{
		displayName: 'Key',
		name: 'prefKey',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['savePreference'] } },
		description: 'Preference key (e.g. "formality")',
	},
	{
		displayName: 'Value',
		name: 'prefValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['savePreference'] } },
		description: 'Preference value',
	},
	{
		displayName: 'Channel',
		name: 'prefChannel',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['identity'], operation: ['savePreference'] } },
		description: 'Optional: restrict the preference to a channel',
	},

	// ----------------------------------
	//     identity:deletePreference
	// ----------------------------------
	{
		displayName: 'Preference ID',
		name: 'preferenceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['deletePreference'] } },
		description: 'The 24-char preference ID (from "Get Preferences")',
	},
];
