# @lagrowthmachine/n8n-nodes-lagrowthmachine

> ✅ **Official node**, built and maintained by [La Growth Machine](https://lagrowthmachine.com). Published under the `@lagrowthmachine` scope. (An unofficial `n8n-nodes-lagrowthmachine` package also exists on npm — this scoped package is the official one.)

This is an n8n community node. It lets you use **La Growth Machine (LGM)** in your n8n workflows.

[La Growth Machine](https://lagrowthmachine.com) is a multichannel sales-engagement platform (LinkedIn, Email, Twitter/X) used by growth and sales teams to run and manage outreach at scale.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  ·  [Credentials](#credentials)  ·  [Operations](#operations)  ·  [Usage](#usage)  ·  [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

For a self-hosted instance: **Settings → Community Nodes → Install** and enter `@lagrowthmachine/n8n-nodes-lagrowthmachine`.

## Credentials

You need a La Growth Machine API key.

1. Log in to LGM and open **Settings → API** (<https://app.lagrowthmachine.com/settings/api>).
2. Generate an API key.
3. In n8n, create new **La Growth Machine API** credentials and paste the key.

The credential authenticates every request with an `Authorization: Bearer` header and can be tested against the `/members` endpoint directly from the credential screen.

On a **multi-workspace account** (agencies), set the optional **Workspace ID** field of the credential to act in a sub-workspace: it is sent as the `X-LGM-Workspace` header on every request. Create one credential per workspace to drive several client workspaces from the same n8n instance. List the available workspace IDs with *Workspace → Get Many*.

> API usage is limited to **50 calls / 10 seconds** per key. You can review every API call (endpoint, status, result) in **Settings → API** in the LGM app.

## Operations

### Lead

| Operation | What it does |
|---|---|
| Create or Update | Create a lead, or update it if it already exists (optionally into an audience) |
| Search | Find leads by id, email, LinkedIn, name, or CRM id |
| Update Status | Change a lead's status inside one or more campaigns |
| Remove From Audience | Remove a lead from one or more audiences (or all of them) |
| Get Logs | Retrieve a lead's activity logs (with *Return All* pagination) |
| Get Conversations | Retrieve a lead's conversations |
| Enrich | Start an email and/or LinkedIn enrichment (consumes credits) |
| Get Enrich Result | Retrieve the result of a polling enrichment |

### Audience

| Operation | What it does |
|---|---|
| List | Return all audiences |
| Create | Create a new empty audience |
| Import From LinkedIn | Populate an audience from a LinkedIn search, Sales Navigator search, a post (likers/commenters), or an event (attendees) |
| Get Details | Return details about an audience |
| Get Leads | Return an audience's leads with their full record (with *Return All* pagination) |

### Campaign

| Operation | What it does |
|---|---|
| Get Many | Return campaigns, optionally filtered by status or a name search |
| Get | Return a single campaign by ID |
| Get Public | Return the ready-made catalog and creator templates anyone can duplicate |
| Get Stats | Return aggregated engagement stats for a campaign |
| Get Lead Stats | Return per-lead engagement stats (with *Return All* cursor pagination) |
| Get Messages | Return the message templates of a campaign sequence |
| Get Steps | Return the message-carrying steps of the sequence, with step and template IDs |
| Duplicate | Create a draft copy of one of your campaigns or of a public template |
| Update Settings | Change the name, audience, enrichment, CRM sync and other settings |
| Update Status | Pause a running campaign or resume a paused one |
| Add Step Message | Create the message of an empty sequence step |
| Edit Message | Replace the content of an existing campaign message |
| Share by Code | Generate an access code so another LGM account can preview and copy the campaign |
| Preview From Code | Preview a campaign shared with an access code |
| Duplicate From Code | Copy a shared campaign into your workspace as a draft |
| Stop Sharing | Revoke a campaign's access code |

### Conversation

| Operation | What it does |
|---|---|
| Get Many | Search and paginate inbox conversations with rich filters (status, channel, dates, replied, and more) |
| Get Messages | Return all messages of a conversation |
| Archive | Move a conversation out of the active inbox |
| Unarchive | Bring an archived conversation back |
| Snooze | Hide a conversation until a chosen date |
| Unsnooze | Wake a snoozed conversation up immediately |
| Edit Note | Set or append the note attached to a conversation |

### Message

| Operation | What it does |
|---|---|
| Send LinkedIn Message | Send a text or voice LinkedIn message via a connected identity |
| Send Email | Send an email via a connected identity (with reply-in-thread, CC/BCC) |

### CRM

| Operation | What it does |
|---|---|
| Search | Look up a contact in your connected CRM (HubSpot, Pipedrive, Salesforce…) |

### Website Visitor

| Operation | What it does |
|---|---|
| Push | Forward an identified visitor (RB2B / Warmly / Vector native payload) into an audience |

### Identity

| Operation | What it does |
|---|---|
| Get Many | Return your connected identities (needed for Message and LinkedIn-import operations) |
| Get Preferences | List the key-value preferences of an identity (used to personalize AI-generated content) |
| Save Preference | Create or update a preference of an identity |
| Delete Preference | Delete a preference of an identity |

### Manual Task

| Operation | What it does |
|---|---|
| Complete Call Task | Log the outcome of a call task (decisive / unreachable, with an optional lead tag) |
| Complete Message Task | Provide the custom message a campaign step will send to the lead |

### Post

| Operation | What it does |
|---|---|
| Enrich | Fetch the content, author and engagement of a public LinkedIn post (1 credit) |

### Member

| Operation | What it does |
|---|---|
| Get Many | Return your workspace members (needed as `memberId` when sending LinkedIn messages) |
| Get Me | Return the member (id and email) behind the API key |

### Credit

| Operation | What it does |
|---|---|
| Get | Return the account's credit balance |

### Workspace

| Operation | What it does |
|---|---|
| Get Many | List the workspaces the account can act in (see the Workspace ID credential field) |

## Trigger

The **La Growth Machine Trigger** node starts a workflow whenever an inbox message (LinkedIn or Email) is sent or received. It registers an LGM inbox webhook when the workflow is activated and removes it when deactivated. Optionally restrict it to specific campaigns with the *Campaign IDs* field. The event payload includes the message, the conversation context, the full lead record, and the last 20 messages of the conversation.

## Usage

A few common patterns:

- **Sync new signups into an audience** — trigger on your product/CRM, then *Lead → Create or Update* with the `audience` field to drop them straight into an LGM campaign audience.
- **Enrich then act** — *Lead → Enrich* (polling) → wait → *Lead → Get Enrich Result* to fetch a pro email before pushing to your CRM.
- **Report on an audience** — *Audience → Get Leads* with *Return All* enabled to pull every lead into a spreadsheet or warehouse.
- **Pilot campaigns end to end** — *Campaign → Duplicate* a template, *Edit Message* to rewrite its copy, *Update Settings* to attach an audience, then *Update Status* to pause and resume it on your own schedule.

> Enrichment consumes LGM credits. *Email* costs 5 credits, *LinkedIn* 1, *Full* 5. Email enrichment works from a Lead ID or from a first and last name plus a company; LinkedIn and Full enrichment require a Lead ID.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [La Growth Machine API documentation](https://developers.lagrowthmachine.com/)

## Version history

### 1.1.0

Full coverage of the expanded LGM API: **13 resources / 51 operations**. New **Manual Task**, **Post** (LinkedIn post enrichment) and **Workspace** resources; campaign management (duplicate, settings, pause/resume, steps, message editing, sharing by code, public templates); identity preferences; *Lead → Remove From Audience*; *Member → Get Me*; multi-workspace support via the credential's **Workspace ID** field (`X-LGM-Workspace`).

### 0.2.0

Full API coverage. Resources: **Lead**, **Audience**, **Campaign**, **Conversation**, **Message**, **CRM**, **Website Visitor**, **Identity**, **Member**, **Credit** (31 operations), plus the **La Growth Machine Trigger** node for inbox webhooks.

### 0.1.0

Initial release. Resources: **Lead** and **Audience**.

## License

[MIT](LICENSE.md)
