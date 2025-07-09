import { ForgeToolDefinition } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
} from '../../utils/confirmationStore.js'
import { CONFIRMATION_DESCRIPTION } from '../../utils/protocolDescriptions.js'

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
}

const paramsZodObject = z.object(paramsSchema)
type Params = z.infer<typeof paramsZodObject>

export const createLetsEncryptCertificateConfirmationStore =
  createConfirmationStore<Params>()

const baseDescription = "Confirms the request to create a Let's Encrypt SSL certificate for a site and returns a summary for user confirmation."

export const confirmLetsEncryptCertificateCreationTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_lets_encrypt_certificate_creation',
  parameters: paramsSchema,
  annotations: {
    title: 'Confirm Let\'s Encrypt Certificate Creation',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'certificate_creation',
    safe: false,
    readOnlyHint: false,
    openWorldHint: true,
    readWriteHint: true,
    destructiveHint: false
  },
  handler: async params => {
    const validatedParams = paramsZodObject.parse(params) as Params
    const entry = createConfirmation(
      createLetsEncryptCertificateConfirmationStore,
      validatedParams
    )

    let summary =
      `Are you sure you want to create a Let's Encrypt SSL certificate?\n` +
      `Server: ${validatedParams.serverName} (ID: ${validatedParams.serverId})\n` +
      `Site: ${validatedParams.siteName} (ID: ${validatedParams.siteId})\n` +
      `Domains: ${validatedParams.domains.join(', ')}\n`

    if (validatedParams.dns_provider) {
      summary += `DNS Provider: ${validatedParams.dns_provider.type}\n`
    }

    summary += `\nType "yes" to confirm or "no" to cancel.`

    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
