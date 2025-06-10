#!/usr/bin/env node
// Prompt-driven server creation orchestration for Laravel Forge
// Each prompt expects the MCPPromptResult from the tool handler to be passed in, so the tool is only called once per prompt step.
// The orchestration layer should call the tool handler with {parsed: true} and pass the result to getChoices/getDefault/getMessage.
// The prompt message is now extracted from the MCPPromptResult (result.messages[0].content.text), falling back to a default if not present.

import { listProvidersTool } from './listProviders.js';
import { listCredentialsTool } from './listCredentials.js';
import { listRegionsTool } from './listRegions.js';
import { listSizesTool } from './listSizes.js';
import { listStaticPhpVersionsTool } from './listPhpVersions.js';
import { listUbuntuVersionsTool } from './listUbuntuVersions.js';
import { listDataTypesTool } from './listDataTypes.js';
import { MCPToolResult, MCPPromptResult, PromptChoice } from '../../core/types/protocols.js';

function extractMessage(result: MCPPromptResult, fallback: string): string {
  return (
    result.messages?.[0]?.content?.type === 'text' &&
    typeof result.messages[0].content.text === 'string'
      ? result.messages[0].content.text
      : fallback
  );
}

export const providerPrompt = {
  name: 'provider',
  fetch: async (forgeApiKey: string) =>
    await listProvidersTool.handler({}, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select a provider:')
};

export const credentialPrompt = {
  name: 'credentialId',
  fetch: async (forgeApiKey: string) =>
    await listCredentialsTool.handler({}, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select a credential:')
};

export const regionPrompt = {
  name: 'region',
  fetch: async (forgeApiKey: string, provider: string) =>
    await listRegionsTool.handler({ provider }, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select a region:')
};

export const sizePrompt = {
  name: 'size',
  fetch: async (forgeApiKey: string, provider: string, region: string) =>
    await listSizesTool.handler({ provider, region }, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select a server size:')
};

export const ubuntuVersionPrompt = {
  name: 'ubuntuVersion',
  fetch: async (forgeApiKey: string) =>
    await listUbuntuVersionsTool.handler({}, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select Ubuntu version:')
};

export const databaseTypePrompt = {
  name: 'databaseType',
  fetch: async (forgeApiKey: string) =>
    await listDataTypesTool.handler({}, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select database type:')
};

export const phpVersionPrompt = {
  name: 'phpVersion',
  fetch: async (forgeApiKey: string) =>
    await listStaticPhpVersionsTool.handler({}, forgeApiKey, { parsed: true }) as MCPPromptResult,
  getChoices: (result: MCPPromptResult) => result.choices ?? [],
  getDefault: (result: MCPPromptResult) => result.default,
  getMessage: (result: MCPPromptResult) => extractMessage(result, 'Select PHP version:')
};

export const serverNamePrompt = {
  name: 'serverName',
  // For free-text prompts, you may want to keep a static message or extend this pattern as needed.
  getMessage: () => 'Enter a server name:'
};

export type CreateServerAnswers = {
  provider: string;
  credentialId: string;
  region: string;
  size: string;
  ubuntuVersion: string;
  databaseType: string;
  phpVersion: string;
  serverName: string;
};

export const confirmationPrompt = {
  name: 'confirmation',
  // Accepts the collected answers and returns a summary message for confirmation
  getMessage: (answers: CreateServerAnswers) => {
    return (
      `Please confirm the server creation with the following settings:\n` +
      `Provider: ${answers.provider}\n` +
      `Credential: ${answers.credentialId}\n` +
      `Region: ${answers.region}\n` +
      `Size: ${answers.size}\n` +
      `Ubuntu: ${answers.ubuntuVersion}\n` +
      `Database: ${answers.databaseType}\n` +
      `PHP: ${answers.phpVersion}\n` +
      `Name: ${answers.serverName}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`
    );
  }
};

 