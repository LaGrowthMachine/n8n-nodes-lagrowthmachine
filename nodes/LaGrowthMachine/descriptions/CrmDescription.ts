import { INodeProperties } from 'n8n-workflow';

export const crmOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['crm'] } },
		options: [
			{ name: 'Search', value: 'search', action: 'Search the connected CRM', description: 'Look up a contact in the connected CRM (HubSpot, Pipedrive, Salesforce…)' },
		],
		default: 'search',
	},
];

export const crmFields: INodeProperties[] = [
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'collection',
		placeholder: 'Add Criterion',
		default: {},
		displayOptions: { show: { resource: ['crm'], operation: ['search'] } },
		description: 'At least one of Email, Pro Email, Perso Email, or First Name is required',
		options: [
			{ displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@company.com' },
			{ displayName: 'First Name', name: 'firstname', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastname', type: 'string', default: '' },
			{ displayName: 'LinkedIn URL', name: 'linkedinUrl', type: 'string', default: '' },
			{ displayName: 'Perso Email', name: 'persoEmail', type: 'string', default: '' },
			{ displayName: 'Pro Email', name: 'proEmail', type: 'string', default: '' },
		],
	},
];
