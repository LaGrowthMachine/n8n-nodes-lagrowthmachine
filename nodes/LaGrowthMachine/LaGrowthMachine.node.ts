import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';

import {
	lgmApiRequest,
	lgmApiRequestAllItemsCursor,
	lgmApiRequestAllItemsOffset,
	lgmApiRequestAllItemsPage,
	lgmApiRequestAllItemsSearchAfter,
} from './GenericFunctions';

import { audienceFields, audienceOperations } from './descriptions/AudienceDescription';
import { campaignFields, campaignOperations } from './descriptions/CampaignDescription';
import { conversationFields, conversationOperations } from './descriptions/ConversationDescription';
import { crmFields, crmOperations } from './descriptions/CrmDescription';
import { identityFields, identityOperations } from './descriptions/IdentityDescription';
import { leadFields, leadOperations } from './descriptions/LeadDescription';
import { manualTaskFields, manualTaskOperations } from './descriptions/ManualTaskDescription';
import { messageFields, messageOperations } from './descriptions/MessageDescription';
import { postFields, postOperations } from './descriptions/PostDescription';
import { creditOperations, memberOperations } from './descriptions/SimpleDescription';
import { websiteVisitorFields, websiteVisitorOperations } from './descriptions/WebsiteVisitorDescription';
import { workspaceOperations } from './descriptions/WorkspaceDescription';

export class LaGrowthMachine implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'La Growth Machine',
		name: 'laGrowthMachine',
		icon: { light: 'file:lagrowthmachine-logo-light.svg', dark: 'file:lagrowthmachine-logo.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage leads, audiences, campaigns, conversations and more in La Growth Machine',
		usableAsTool: true,
		defaults: {
			name: 'La Growth Machine',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'laGrowthMachineApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Audience', value: 'audience' },
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Credit', value: 'credit' },
					{ name: 'CRM', value: 'crm' },
					{ name: 'Identity', value: 'identity' },
					{ name: 'Lead', value: 'lead' },
					{ name: 'Manual Task', value: 'manualTask' },
					{ name: 'Member', value: 'member' },
					{ name: 'Message', value: 'message' },
					{ name: 'Post', value: 'post' },
					{ name: 'Website Visitor', value: 'websiteVisitor' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'lead',
			},
			...leadOperations,
			...leadFields,
			...audienceOperations,
			...audienceFields,
			...campaignOperations,
			...campaignFields,
			...conversationOperations,
			...conversationFields,
			...messageOperations,
			...messageFields,
			...crmOperations,
			...crmFields,
			...identityOperations,
			...identityFields,
			...manualTaskOperations,
			...manualTaskFields,
			...postOperations,
			...postFields,
			...memberOperations,
			...creditOperations,
			...websiteVisitorOperations,
			...websiteVisitorFields,
			...workspaceOperations,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (resource === 'lead') {
					responseData = await handleLead.call(this, operation, i);
				} else if (resource === 'audience') {
					responseData = await handleAudience.call(this, operation, i);
				} else if (resource === 'campaign') {
					responseData = await handleCampaign.call(this, operation, i);
				} else if (resource === 'conversation') {
					responseData = await handleConversation.call(this, operation, i);
				} else if (resource === 'message') {
					responseData = await handleMessage.call(this, operation, i);
				} else if (resource === 'crm') {
					responseData = await handleCrm.call(this, operation, i);
				} else if (resource === 'websiteVisitor') {
					responseData = await handleWebsiteVisitor.call(this, operation, i);
				} else if (resource === 'identity') {
					responseData = await handleIdentity.call(this, operation, i);
				} else if (resource === 'manualTask') {
					responseData = await handleManualTask.call(this, operation, i);
				} else if (resource === 'post') {
					responseData = await handlePost.call(this, operation, i);
				} else if (resource === 'member' || resource === 'credit' || resource === 'workspace') {
					responseData = await handleSimple.call(this, resource, operation, i);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

// --------------------------------------------------------------------------
//                                Leads
// --------------------------------------------------------------------------
async function handleLead(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'createOrUpdate') {
		const body: IDataObject = {
			...(this.getNodeParameter('identifiers', i, {}) as IDataObject),
		};
		const audience = this.getNodeParameter('audience', i, '') as string;
		if (audience) body.audience = audience;

		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const customAttributes = (additionalFields.customAttributes as IDataObject)?.attribute as
			| IDataObject[]
			| undefined;
		delete additionalFields.customAttributes;
		Object.assign(body, additionalFields);
		if (customAttributes) {
			for (const attr of customAttributes) {
				body[attr.key as string] = attr.value;
			}
		}

		await lgmApiRequest.call(this, 'POST', '/leads', body);
		// This endpoint returns no body; echo the payload so the workflow has context.
		return { success: true, ...body };
	}

	if (operation === 'search') {
		const qs = this.getNodeParameter('searchCriteria', i, {}) as IDataObject;
		const responseData = await lgmApiRequest.call(this, 'GET', '/leads/search', {}, qs);
		// The API returns `leads` (array) for multiple matches, or `lead` (single
		// object) + `recentLogs` for a single match. Normalise to lead item(s).
		if (Array.isArray(responseData.leads)) return responseData.leads as IDataObject[];
		if (responseData.lead) return responseData.lead as IDataObject;
		return responseData;
	}

	if (operation === 'updateStatus') {
		const campaignRaw = this.getNodeParameter('campaign', i) as string;
		const campaign =
			campaignRaw === 'all'
				? 'all'
				: campaignRaw.includes(',')
					? campaignRaw.split(',').map((c) => c.trim())
					: campaignRaw;

		const body: IDataObject = {
			status: this.getNodeParameter('status', i) as string,
			campaign,
			...(this.getNodeParameter('identifiers', i, {}) as IDataObject),
		};
		Object.assign(body, this.getNodeParameter('statusOptions', i, {}) as IDataObject);
		return (await lgmApiRequest.call(this, 'POST', '/leads/status', body, {}, { form: true })) as IDataObject;
	}

	if (operation === 'removeFromAudience') {
		const audienceRaw = (this.getNodeParameter('removeAudience', i) as string).trim();
		const audience =
			audienceRaw === 'all'
				? 'all'
				: audienceRaw.includes(',')
					? audienceRaw.split(',').map((a) => a.trim())
					: audienceRaw;

		const body: IDataObject = {
			audience,
			...(this.getNodeParameter('identifiers', i, {}) as IDataObject),
		};
		await lgmApiRequest.call(this, 'POST', '/leads/removefromaudience', body);
		// The endpoint only returns { statusCode }; echo the payload for context.
		return { success: true, ...body };
	}

	if (operation === 'getLogs') {
		const leadId = this.getNodeParameter('leadId', i) as string;
		const identityId = this.getNodeParameter('identityId', i, '') as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {};
		if (identityId) qs.identityId = identityId;

		if (returnAll) {
			return lgmApiRequestAllItemsOffset.call(this, 'GET', `/leads/${leadId}/logs`, 'data', qs, 100);
		}
		qs.limit = this.getNodeParameter('limit', i) as number;
		const responseData = await lgmApiRequest.call(this, 'GET', `/leads/${leadId}/logs`, {}, qs);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'getConversations') {
		const leadId = this.getNodeParameter('leadId', i) as string;
		const identityId = this.getNodeParameter('identityId', i, '') as string;
		const qs: IDataObject = {};
		if (identityId) qs.identityId = identityId;
		const responseData = await lgmApiRequest.call(this, 'GET', `/leads/${leadId}/conversations`, {}, qs);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'enrich') {
		const body: IDataObject = {
			enrichType: this.getNodeParameter('enrichType', i) as string,
			mode: this.getNodeParameter('mode', i) as string,
			...(this.getNodeParameter('identifiers', i, {}) as IDataObject),
		};
		if (body.mode === 'webhook') {
			body.webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
		}
		return (await lgmApiRequest.call(this, 'POST', '/leads/enrich', body)) as IDataObject;
	}

	if (operation === 'getEnrichResult') {
		const enrichRequestId = this.getNodeParameter('enrichRequestId', i) as string;
		return (await lgmApiRequest.call(this, 'GET', `/leads/enrich/${enrichRequestId}`)) as IDataObject;
	}

	return {};
}

// --------------------------------------------------------------------------
//                               Audiences
// --------------------------------------------------------------------------
async function handleAudience(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'list') {
		const responseData = await lgmApiRequest.call(this, 'GET', '/audiences');
		return (responseData.audiences as IDataObject[]) ?? responseData;
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const responseData = await lgmApiRequest.call(this, 'POST', '/audiences/create', { name });
		// Real response is { statusCode, audience: {...} }; return the audience object.
		return (responseData.audience as IDataObject) ?? responseData;
	}

	if (operation === 'importFromLinkedIn') {
		const body: IDataObject = {
			audience: this.getNodeParameter('audience', i) as string,
			linkedinUrl: this.getNodeParameter('linkedinUrl', i) as string,
			identityId: this.getNodeParameter('identityId', i) as string,
			...(this.getNodeParameter('importOptions', i, {}) as IDataObject),
		};
		return (await lgmApiRequest.call(this, 'POST', '/audiences', body, {}, { form: true })) as IDataObject;
	}

	if (operation === 'getDetail') {
		const audienceId = this.getNodeParameter('audienceId', i) as string;
		const responseData = await lgmApiRequest.call(this, 'GET', `/audiences/${audienceId}/detail`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'getLeads') {
		const audienceId = this.getNodeParameter('audienceId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return lgmApiRequestAllItemsOffset.call(this, 'GET', `/audiences/${audienceId}/leads`, 'data', {}, 100);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		const responseData = await lgmApiRequest.call(this, 'GET', `/audiences/${audienceId}/leads`, {}, { limit, skip: 0 });
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	return {};
}

// --------------------------------------------------------------------------
//                               Campaigns
// --------------------------------------------------------------------------
async function handleCampaign(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const status = this.getNodeParameter('status', i, '') as string;
		const search = this.getNodeParameter('search', i, '') as string;
		const qs: IDataObject = {};
		if (status) qs.status = status;
		if (search) qs.search = search;
		if (returnAll) {
			return lgmApiRequestAllItemsOffset.call(this, 'GET', '/campaigns', 'campaigns', qs, 25);
		}
		// The campaigns endpoint caps limit at 25 per page (higher values return empty).
		qs.limit = Math.min(this.getNodeParameter('limit', i) as number, 25);
		qs.skip = 0;
		const responseData = await lgmApiRequest.call(this, 'GET', '/campaigns', {}, qs);
		return (responseData.campaigns as IDataObject[]) ?? responseData;
	}

	if (operation === 'getPublic') {
		const type = this.getNodeParameter('type', i, 'public') as string;
		const qs: IDataObject = {};
		if (type) qs.type = type;
		const responseData = await lgmApiRequest.call(this, 'GET', '/campaigns/public', {}, qs);
		return (responseData.campaigns as IDataObject[]) ?? responseData;
	}

	if (operation === 'previewFromCode') {
		const code = (this.getNodeParameter('code', i) as string).trim();
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/accessible/${encodeURIComponent(code)}`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'duplicateFromCode') {
		const code = (this.getNodeParameter('code', i) as string).trim();
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/duplicate/accessible/${encodeURIComponent(code)}`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	const campaignId = this.getNodeParameter('campaignId', i, '') as string;

	if (operation === 'get') {
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/${campaignId}`);
		return (responseData.campaign as IDataObject) ?? responseData;
	}

	if (operation === 'getStats') {
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/${campaignId}/stats`);
		return (responseData.engagementStats as IDataObject) ?? responseData;
	}

	if (operation === 'getMessages') {
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/${campaignId}/messages`);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'getLeadStats') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return lgmApiRequestAllItemsCursor.call(this, `/campaigns/${campaignId}/statsleads`, 'leads', {});
		}
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/${campaignId}/statsleads`);
		return (responseData.leads as IDataObject[]) ?? responseData;
	}

	if (operation === 'getSteps') {
		const responseData = await lgmApiRequest.call(this, 'GET', `/campaigns/${campaignId}/steps`);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'duplicate') {
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/${campaignId}/duplicate`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'updateSettings') {
		const body = this.getNodeParameter('settings', i, {}) as IDataObject;
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/${campaignId}/settings`, body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'updateStatus') {
		const body: IDataObject = { status: this.getNodeParameter('newStatus', i) as string };
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/${campaignId}/status`, body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'share') {
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/${campaignId}/share-by-code`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'stopSharing') {
		const responseData = await lgmApiRequest.call(this, 'POST', `/campaigns/${campaignId}/stop-sharing-by-code`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'addStepMessage' || operation === 'editMessage') {
		const body: IDataObject = { newHtml: this.getNodeParameter('newHtml', i) as string };
		const subjectNewHtml = this.getNodeParameter('subjectNewHtml', i, '') as string;
		if (subjectNewHtml) body.subjectNewHtml = subjectNewHtml;

		const endpoint =
			operation === 'addStepMessage'
				? `/campaigns/${campaignId}/steps/${this.getNodeParameter('stepId', i) as string}/message`
				: `/campaigns/${campaignId}/messages/${this.getNodeParameter('templateId', i) as string}`;
		const responseData = await lgmApiRequest.call(this, 'POST', endpoint, body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	return {};
}

// --------------------------------------------------------------------------
//                             Conversations
// --------------------------------------------------------------------------
async function handleConversation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'search') {
		const qs = this.getNodeParameter('filters', i, {}) as IDataObject;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return lgmApiRequestAllItemsSearchAfter.call(this, '/conversations/search', 'data', qs);
		}
		qs.limit = this.getNodeParameter('limit', i) as number;
		const responseData = await lgmApiRequest.call(this, 'GET', '/conversations/search', {}, qs);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'getMessages') {
		const conversationId = this.getNodeParameter('conversationId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return lgmApiRequestAllItemsPage.call(this, `/conversations/${conversationId}/messages`, 'data', {});
		}
		const responseData = await lgmApiRequest.call(this, 'GET', `/conversations/${conversationId}/messages`, {}, { page: 0 });
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	// Action endpoints share a target identifier collection.
	const target = this.getNodeParameter('target', i, {}) as IDataObject;

	if (operation === 'archive' || operation === 'unarchive' || operation === 'unsnooze') {
		const responseData = await lgmApiRequest.call(this, 'POST', `/inbox/conversations/${operation}`, { ...target });
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'snooze') {
		const body: IDataObject = { ...target, snoozeUntil: this.getNodeParameter('snoozeUntil', i) as string };
		const responseData = await lgmApiRequest.call(this, 'POST', '/inbox/conversations/snooze', body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'editNote') {
		const body: IDataObject = {
			...target,
			note: this.getNodeParameter('note', i) as string,
			mode: this.getNodeParameter('mode', i) as string,
		};
		const responseData = await lgmApiRequest.call(this, 'POST', '/inbox/conversations/note', body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	return {};
}

// --------------------------------------------------------------------------
//                          Messages (outbound)
// --------------------------------------------------------------------------
async function handleMessage(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const identityId = this.getNodeParameter('identityId', i) as string;

	if (operation === 'sendLinkedIn') {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		if (typeof additionalFields.attachments === 'string' && additionalFields.attachments) {
			additionalFields.attachments = (additionalFields.attachments as string).split(',').map((s) => s.trim());
		}
		const body: IDataObject = {
			identityId,
			memberId: this.getNodeParameter('memberId', i) as string,
			...(this.getNodeParameter('target', i, {}) as IDataObject),
			...additionalFields,
		};
		const message = this.getNodeParameter('message', i, '') as string;
		if (message) body.message = message;
		return (await lgmApiRequest.call(this, 'POST', '/inbox/linkedin', body)) as IDataObject;
	}

	if (operation === 'sendEmail') {
		const body: IDataObject = {
			identityId,
			...(this.getNodeParameter('targetEmail', i, {}) as IDataObject),
			message: {
				html: this.getNodeParameter('messageHtml', i) as string,
				text: this.getNodeParameter('messageText', i) as string,
			},
			...(this.getNodeParameter('additionalFieldsEmail', i, {}) as IDataObject),
		};
		return (await lgmApiRequest.call(this, 'POST', '/inbox/email', body)) as IDataObject;
	}

	return {};
}

// --------------------------------------------------------------------------
//                                 CRM
// --------------------------------------------------------------------------
async function handleCrm(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'search') {
		const body = this.getNodeParameter('searchCriteria', i, {}) as IDataObject;
		const responseData = await lgmApiRequest.call(this, 'POST', '/crm/search', body);
		// Real response is { statusCode, results }; surface the results.
		return (responseData.results as IDataObject[]) ?? responseData;
	}
	return {};
}

// --------------------------------------------------------------------------
//                            Website Visitor
// --------------------------------------------------------------------------
async function handleWebsiteVisitor(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'push') {
		const provider = this.getNodeParameter('provider', i) as string;
		const audienceName = this.getNodeParameter('audienceName', i) as string;
		const rawPayload = this.getNodeParameter('payload', i, {}) as IDataObject | string;
		const body = typeof rawPayload === 'string' ? (JSON.parse(rawPayload) as IDataObject) : rawPayload;
		const endpoint = `/leads/visitors/${provider}/${encodeURIComponent(audienceName)}`;
		await lgmApiRequest.call(this, 'POST', endpoint, body);
		// This endpoint returns no body.
		return { success: true, provider, audienceName };
	}
	return {};
}

// --------------------------------------------------------------------------
//                               Identities
// --------------------------------------------------------------------------
async function handleIdentity(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const responseData = await lgmApiRequest.call(this, 'GET', '/identities');
		if (Array.isArray(responseData)) return responseData as IDataObject[];
		return (responseData.identities as IDataObject[]) ?? (responseData.data as IDataObject[]) ?? responseData;
	}

	const identityId = this.getNodeParameter('identityId', i) as string;

	if (operation === 'getPreferences') {
		const category = this.getNodeParameter('category', i, '') as string;
		const qs: IDataObject = {};
		if (category) qs.category = category;
		const responseData = await lgmApiRequest.call(this, 'GET', `/identities/${identityId}/preferences`, {}, qs);
		return (responseData.data as IDataObject[]) ?? responseData;
	}

	if (operation === 'savePreference') {
		const body: IDataObject = {
			category: this.getNodeParameter('prefCategory', i) as string,
			key: this.getNodeParameter('prefKey', i) as string,
			value: this.getNodeParameter('prefValue', i) as string,
		};
		const channel = this.getNodeParameter('prefChannel', i, '') as string;
		if (channel) body.channel = channel;
		const responseData = await lgmApiRequest.call(this, 'POST', `/identities/${identityId}/preferences`, body);
		return (responseData.data as IDataObject) ?? responseData;
	}

	if (operation === 'deletePreference') {
		const preferenceId = this.getNodeParameter('preferenceId', i) as string;
		const responseData = await lgmApiRequest.call(this, 'DELETE', `/identities/${identityId}/preferences/${preferenceId}`);
		return (responseData.data as IDataObject) ?? responseData;
	}

	return {};
}

// --------------------------------------------------------------------------
//                              Manual tasks
// --------------------------------------------------------------------------
async function handleManualTask(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const manualTaskId = this.getNodeParameter('manualTaskId', i) as string;

	if (operation === 'completeCall') {
		const body: IDataObject = {
			manualTaskId,
			callStatus: this.getNodeParameter('callStatus', i) as string,
			...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
		};
		return (await lgmApiRequest.call(this, 'POST', '/manualtasks/call/complete', body)) as IDataObject;
	}

	if (operation === 'completeMessage') {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		if (typeof additionalFields.attachments === 'string' && additionalFields.attachments) {
			additionalFields.attachments = (additionalFields.attachments as string).split(',').map((s) => s.trim());
		} else {
			delete additionalFields.attachments;
		}
		const body: IDataObject = {
			manualTaskId,
			message: this.getNodeParameter('message', i) as string,
			...additionalFields,
		};
		return (await lgmApiRequest.call(this, 'POST', '/manualtasks/message/complete', body)) as IDataObject;
	}

	return {};
}

// --------------------------------------------------------------------------
//                            Posts (LinkedIn)
// --------------------------------------------------------------------------
async function handlePost(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'enrich') {
		const body: IDataObject = { postUrl: this.getNodeParameter('postUrl', i) as string };
		const responseData = await lgmApiRequest.call(this, 'POST', '/posts/enrich', body);
		return (responseData.post as IDataObject) ?? responseData;
	}
	return {};
}

// --------------------------------------------------------------------------
//            Simple reads: Member / Credit / Workspace
// --------------------------------------------------------------------------
async function handleSimple(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	_i: number,
): Promise<IDataObject | IDataObject[]> {
	if (resource === 'member') {
		if (operation === 'getMe') {
			return (await lgmApiRequest.call(this, 'GET', '/me')) as IDataObject;
		}
		const responseData = await lgmApiRequest.call(this, 'GET', '/members');
		if (Array.isArray(responseData)) return responseData as IDataObject[];
		return (responseData.members as IDataObject[]) ?? responseData;
	}

	if (resource === 'credit') {
		const responseData = await lgmApiRequest.call(this, 'GET', '/credits');
		return (responseData.credits as IDataObject) ?? responseData;
	}

	if (resource === 'workspace') {
		const responseData = await lgmApiRequest.call(this, 'GET', '/workspaces');
		return (responseData.workspaces as IDataObject[]) ?? responseData;
	}

	return {};
}
