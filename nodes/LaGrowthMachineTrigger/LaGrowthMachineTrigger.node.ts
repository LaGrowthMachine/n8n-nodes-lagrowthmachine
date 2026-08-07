import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { lgmApiRequest } from '../LaGrowthMachine/GenericFunctions';

export class LaGrowthMachineTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'La Growth Machine Trigger',
		name: 'laGrowthMachineTrigger',
		icon: 'file:lagrowthmachine-logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '=Inbox events',
		description: 'Starts a workflow when a La Growth Machine inbox message is sent or received',
		defaults: {
			name: 'La Growth Machine Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'laGrowthMachineApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'This trigger fires on every LinkedIn and Email message (sent or received) across your leads. Leave the campaign filter empty to receive events from all campaigns.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaignIds',
				type: 'string',
				default: '',
				placeholder: 'camp_123, camp_456',
				description: 'Comma-separated campaign IDs to restrict the webhook to. Leave empty for all campaigns.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const existing = (await lgmApiRequest.call(this, 'GET', '/inboxWebhooks')) as IDataObject[] | IDataObject;
				const list = Array.isArray(existing) ? existing : ((existing.data as IDataObject[]) ?? []);
				const match = list.find((w) => w.url === webhookUrl);
				if (match) {
					webhookData.webhookId = match.id as string;
					return true;
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const campaignIds = (this.getNodeParameter('campaignIds', '') as string)
					.split(',')
					.map((c) => c.trim())
					.filter(Boolean);

				const body: IDataObject = {
					url: webhookUrl,
					name: 'n8n LGM Trigger',
					description: 'Created by the n8n La Growth Machine Trigger node',
					campaigns: campaignIds.length ? campaignIds : [],
				};
				const response = (await lgmApiRequest.call(this, 'POST', '/inboxWebhooks', body)) as IDataObject;
				if (!response.id) return false;
				webhookData.webhookId = response.id as string;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) return true;
				try {
					await lgmApiRequest.call(this, 'DELETE', `/inboxWebhooks/${webhookData.webhookId}`);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray(bodyData as IDataObject)],
		};
	}
}
