// Flat ESLint config that mirrors n8n's community-node verification scan
// (@n8n/scan-community-package). Running `npm run lint` here fails on exactly
// what the Creator Portal's automatic vetting fails on, so regressions are
// caught before publishing.
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import tsParser from '@typescript-eslint/parser';
import n8nNodesPlugin from 'eslint-plugin-n8n-nodes-base';

const recommended = n8nCommunityNodesPlugin.configs.recommended;

export default [
	...(Array.isArray(recommended) ? recommended : [recommended]),
	{ rules: { 'no-console': 'error' } },
	{ plugins: { 'n8n-nodes-base': n8nNodesPlugin } },
	{
		files: ['package.json'],
		rules: { ...n8nNodesPlugin.configs.community.rules },
	},
	{
		files: ['**/credentials/**/*.ts'],
		rules: {
			...n8nNodesPlugin.configs.credentials.rules,
			'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
			'n8n-nodes-base/cred-class-field-type-options-password-missing': 'off',
		},
	},
	{
		files: ['**/nodes/**/*.ts'],
		rules: {
			...n8nNodesPlugin.configs.nodes.rules,
			// Inputs/outputs use NodeConnectionTypes enum, not the "main" literal.
			'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
			'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
			// A few endpoints do have a real max limit, so maxValue is valid.
			'n8n-nodes-base/node-param-type-options-max-value-present': 'off',
		},
	},
	{ files: ['**/*.json'], languageOptions: { parser: tsParser } },
	{ files: ['**/*.ts'], languageOptions: { parser: tsParser } },
];
