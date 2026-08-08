import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	NodeApiError,
} from 'n8n-workflow';

export const LGM_BASE_URL = 'https://apiv2.lagrowthmachine.com/flow';

type LgmContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions;

/**
 * Single authenticated request to the LGM API.
 *
 * Auth is injected by the `laGrowthMachineApi` credential (Authorization
 * header), so we never touch the API key here. `body` is sent as JSON unless
 * `option.form` is set, in which case it is sent as x-www-form-urlencoded —
 * a few LGM endpoints (leads/status, audiences import) expect form encoding.
 */
export async function lgmApiRequest(
	this: LgmContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const useForm = option.form === true;
	delete option.form;

	const options: IHttpRequestOptions = {
		method,
		qs,
		url: `${LGM_BASE_URL}${endpoint}`,
		json: true,
		...option,
	};

	if (Object.keys(body).length !== 0) {
		if (useForm) {
			// x-www-form-urlencoded. Arrays are repeated as `key=a&key=b`, matching
			// what the LGM endpoints (leads/status, audiences import) expect.
			const parts: string[] = [];
			const encode = (value: unknown) => encodeURIComponent(String(value));
			for (const [key, value] of Object.entries(body)) {
				if (Array.isArray(value)) {
					value.forEach((entry) => parts.push(`${encode(key)}=${encode(entry)}`));
				} else if (value !== undefined && value !== null) {
					parts.push(`${encode(key)}=${encode(value)}`);
				}
			}
			options.headers = { 'content-type': 'application/x-www-form-urlencoded' };
			options.body = parts.join('&');
		} else {
			options.body = body;
		}
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'laGrowthMachineApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Offset pagination (skip / limit). Used by audiences leads, lead logs, etc.
 *
 * @param dataKey  Key in the response that holds the array (e.g. "data").
 * @param pageSize Max items per page for this endpoint (LGM caps vary: 25/100).
 */
export async function lgmApiRequestAllItemsOffset(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	dataKey: string,
	qs: IDataObject = {},
	pageSize = 25,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let skip = 0;
	qs.limit = pageSize;

	let responseItems: IDataObject[];
	do {
		qs.skip = skip;
		const responseData = await lgmApiRequest.call(this, method, endpoint, {}, qs);
		responseItems = (responseData?.[dataKey] as IDataObject[]) ?? [];
		returnData.push(...responseItems);
		skip += pageSize;
	} while (responseItems.length === pageSize);

	return returnData;
}

/**
 * Cursor pagination (getLeadsAfter). Used by campaigns/:id/statsleads.
 * The API returns `hasMore` and 25 items max; the cursor is the last lead id.
 */
export async function lgmApiRequestAllItemsCursor(
	this: IExecuteFunctions,
	endpoint: string,
	dataKey: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let hasMore = true;

	do {
		const responseData = await lgmApiRequest.call(this, 'GET', endpoint, {}, qs);
		const items = (responseData?.[dataKey] as IDataObject[]) ?? [];
		returnData.push(...items);

		hasMore = responseData?.hasMore === true && items.length > 0;
		if (hasMore) {
			qs.getLeadsAfter = items[items.length - 1].id as string;
		}
	} while (hasMore);

	return returnData;
}

/**
 * Cursor pagination (searchAfter / nextToken). Used by conversations/search.
 * The nextToken is Base64; n8n's request layer URL-encodes qs values for us.
 */
export async function lgmApiRequestAllItemsSearchAfter(
	this: IExecuteFunctions,
	endpoint: string,
	dataKey: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let hasMore = true;

	do {
		const responseData = await lgmApiRequest.call(this, 'GET', endpoint, {}, qs);
		const items = (responseData?.[dataKey] as IDataObject[]) ?? [];
		returnData.push(...items);

		hasMore = responseData?.hasMore === true && Boolean(responseData?.nextToken);
		if (hasMore) {
			qs.searchAfter = responseData.nextToken as string;
		}
	} while (hasMore);

	return returnData;
}

/**
 * Page-number pagination (page=0,1,2…). Used by conversations/:id/messages.
 */
export async function lgmApiRequestAllItemsPage(
	this: IExecuteFunctions,
	endpoint: string,
	dataKey: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 0;
	let total = Infinity;

	do {
		qs.page = page;
		const responseData = await lgmApiRequest.call(this, 'GET', endpoint, {}, qs);
		const items = (responseData?.[dataKey] as IDataObject[]) ?? [];
		returnData.push(...items);
		if (typeof responseData?.total === 'number') total = responseData.total;
		page += 1;
		if (items.length === 0) break;
	} while (returnData.length < total);

	return returnData;
}

// Re-exported for typing NodeApiError without importing it everywhere.
type JsonObject = { [key: string]: any };
