import { ForgeToolDefinition } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'

const ubuntuVersions = [
  { id: '24.04', name: 'Ubuntu 24.04 LTS (Noble Numbat)', default: true },
  { id: '22.04', name: 'Ubuntu 22.04 LTS (Jammy Jellyfish)', default: false },
  { id: '20.04', name: 'Ubuntu 20.04 LTS (Focal Fossa)', default: false },
]

const paramsSchema = {}

export const listUbuntuVersionsTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'list_ubuntu_versions',
    description:
      'List supported Ubuntu versions for new server creation (static, as per Forge documentation). 24.04 is the default if not specified.',
    parameters: paramsSchema,
    handler: async (_params, _forgeApiKey) => {
      return toMCPToolResult({ ubuntuVersions })
    },
  }
