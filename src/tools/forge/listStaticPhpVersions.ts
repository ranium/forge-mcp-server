import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'

const staticPhpVersions = [
  { id: 'php84', name: 'PHP 8.4', default: true },
  { id: 'php83', name: 'PHP 8.3', default: false },
  { id: 'php82', name: 'PHP 8.2', default: false },
  { id: 'php81', name: 'PHP 8.1', default: false },
  { id: 'php80', name: 'PHP 8.0', default: false },
  { id: 'php74', name: 'PHP 7.4', default: false },
  { id: 'php73', name: 'PHP 7.3', default: false },
  { id: 'php72', name: 'PHP 7.2', default: false },
  { id: 'php70', name: 'PHP 7.0', default: false },
  { id: 'php56', name: 'PHP 5.6', default: false },
]

const staticParamsSchema = {}

export const listStaticPhpVersionsTool: ForgeToolDefinition<
  typeof staticParamsSchema
> = {
  name: 'list_static_php_versions',
  description:
    'List supported PHP versions for new server creation (static, as per Forge documentation). Also allows custom/free-text entry.',
  parameters: staticParamsSchema,
  category: ToolCategory.Readonly,
  handler: async (_params, _forgeApiKey) => {
    return toMCPToolResult({ phpVersions: staticPhpVersions })
  },
} 