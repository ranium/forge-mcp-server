import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { createLetsEncryptCertificateConfirmationStore } from './confirmLetsEncryptCertificateCreationTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const dnsProviderTypes = [
  'cloudflare',
  'route53',
  'digitalocean',
  'dnssimple',
  'linode',
  'ovh',
  'google',
] as const

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  siteName: z
    .string()
    .describe(
      'The name of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  domains: z
    .array(z.string())
    .describe(
      "Array of domain names for which to obtain the Let's Encrypt certificate."
    ),
  dns_provider: z
    .object({
      type: z.enum(dnsProviderTypes),
      cloudflare_api_token: z.string().optional(),
      route53_key: z.string().optional(),
      route53_secret: z.string().optional(),
      digitalocean_token: z.string().optional(),
      dnssimple_token: z.string().optional(),
      linode_token: z.string().optional(),
      ovh_endpoint: z.string().optional(),
      ovh_app_key: z.string().optional(),
      ovh_app_secret: z.string().optional(),
      ovh_consumer_key: z.string().optional(),
      google_credentials_file: z.string().optional(),
    })
    .optional()
    .describe('DNS provider configuration for wildcard certificates.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirm_lets_encrypt_certificate_creation tool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const createLetsEncryptCertificateTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'create_lets_encrypt_certificate',
  parameters: paramsSchema,
  annotations: {
    title: 'Create Let\'s Encrypt Certificate',
    description:
      "Creates a Let's Encrypt SSL certificate for a site. Before calling this tool, the client MUST call the 'confirm_lets_encrypt_certificate_creation' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.",
    operation: 'create',
    resource: 'certificate',
    safe: false,
    readOnlyHint: false,
    openWorldHint: true,
    readWriteHint: true,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const {
        serverId,
        serverName,
        siteId,
        siteName,
        domains,
        dns_provider,
        confirmationId,
      } = parsed

      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        createLetsEncryptCertificateConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId === serverId &&
          stored.serverName === serverName &&
          stored.siteId === siteId &&
          stored.siteName === siteName &&
          JSON.stringify(stored.domains) === JSON.stringify(domains) &&
          JSON.stringify(stored.dns_provider) === JSON.stringify(dns_provider)
      )

      if (!confirmation) {
        return toMCPToolResult(false)
      }

      markConfirmationUsed(
        createLetsEncryptCertificateConfirmationStore,
        confirmationId
      )

      // Call Forge API
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${serverId}/sites/${siteId}/certificates/letsencrypt`,
          method: HttpMethod.POST,
          data: { domains, dns_provider },
        },
        forgeApiKey
      )

      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
