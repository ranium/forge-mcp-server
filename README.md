# Forge MCP Server

This is a Model Context Protocol (MCP) server for Laravel Forge integration. It provides comprehensive access to Laravel Forge's official API through MCP-compliant tools, enabling seamless server and site management.

For more information about the Laravel Forge API, see the [official API documentation](https://forge.laravel.com/api-documentation).

## Features
- MCP-compliant server
- Comprehensive Laravel Forge API integration
- Health check tool: `test_connection`
- Extensive tool coverage for server and site management
- Built on Laravel Forge's official API

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)


## Configuration & Usage

A **Forge API key is required** for all Forge tool invocations. You must provide it as either:
- the `FORGE_API_KEY` environment variable, **or**
- the `--api-key` command-line argument

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

#### Option 1: Using npx (Recommended)

**Using environment variable:**

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@ranium/forge-mcp"
      ],
      "env": {
        "FORGE_API_KEY": "your_forge_api_key_here"
      }
    }
  }
}
```

**Using command-line argument:**

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@ranium/forge-mcp",
        "--api-key=your_forge_api_key_here"
      ]
    }
  }
}
```

#### Option 2: Using node directly

First, clone the repository and build the project:

```sh
git clone https://github.com/ranium/forge-mcp-server
cd forge_mcp
npm install
npm run build
```

Then add the following to your `claude_desktop_config.json`:

**Using environment variable:**

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "node",
      "args": [
        "/path/to/forge_mcp/dist/server.js"
      ],
      "env": {
        "FORGE_API_KEY": "your_forge_api_key_here"
      }
    }
  }
}
```

**Using command-line argument:**

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "node",
      "args": [
        "/path/to/forge_mcp/dist/server.js",
        "--api-key=your_forge_api_key_here"
      ]
    }
  }
}
```

**Note:** You can use either the `FORGE_API_KEY` environment variable or the `--api-key` argument. If both are provided, the command-line argument takes precedence. Never commit your real API keys to version control. Use environment variables or secrets management in production.

## Tool Categories & Access Control

All tools are grouped into three categories:

- **Readonly**: Safe, non-modifying operations (e.g., listing, viewing, status checks).
- **Write**: Operations that create or modify resources (e.g., create, update, reboot, enable/disable features).
- **Destructive**: Operations that delete or irreversibly destroy resources (e.g., delete server, site, database, user, certificate).

By default, **only readonly tools are enabled**. To enable write or destructive tools, use the `--tools` flag:

- `--tools=readonly` (default)
- `--tools=readonly,write` (enables readonly and write tools)
- `--tools=readonly,write,destructive` (enables all tools)

If `destructive` is included, all categories are enabled. If `write` is included, both readonly and write tools are enabled.

**Example:**

```sh
npx -y @ranium/forge-mcp --api-key=your_forge_api_key_here --tools=readonly,write
```

Or in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@ranium/forge-mcp",
        "--api-key=your_forge_api_key_here",
        "--tools=readonly,write"
      ]
    }
  }
}
```

## Available Tools (by Category)

### Readonly Tools
- `list_servers` - List all servers
- `list_static_php_versions` - List static PHP versions
- `list_php_versions` - List PHP versions
- `get_user` - Get user information
- `show_server` - Get detailed information about a specific server
- `list_sites` - List all sites on a server
- `show_site` - Get detailed information about a specific site
- `list_daemons` - List daemons
- `show_daemon` - Get daemon details
- `list_deployments` - List deployments
- `get_deployment_log` - Get deployment logs
- `get_deployment` - Get deployment details
- `get_deployment_output` - Get deployment output
- `get_server_logs` - Get server logs
- `list_providers` - List cloud providers
- `list_database_types` - List database types
- `list_credentials` - List credentials
- `list_regions` - List available regions
- `list_ubuntu_versions` - List Ubuntu versions
- `get_composer_packages_auth` - Get Composer authentication
- `check_laravel_maintenance_status` - Check Laravel maintenance mode
- `check_pulse_daemon_status` - Check Pulse daemon status
- `check_inertia_daemon_status` - Check Inertia daemon status
- `check_laravel_scheduler_status` - Check Laravel scheduler status
- `list_sizes` - List server sizes
- `list_project_types` - List project types
- `list_databases` - List all databases
- `get_database` - Get database details
- `list_database_users` - List database users
- `get_database_user` - Get database user details
- `list_certificates` - List SSL certificates
- `get_certificate` - Get certificate details
- `get_site_log` - Get site logs

### Write Tools
- `confirm_server_creation` - Confirm server creation
- `create_server` - Create a new server
- `confirm_create_database` - Confirm database creation
- `create_database` - Create a new database
- `sync_database` - Sync database
- `confirm_create_database_user` - Confirm database user creation
- `create_database_user` - Create a new database user
- `confirm_server_reboot` - Confirm server reboot
- `reboot_server` - Reboot a server
- `reboot_nginx` - Reboot Nginx service
- `reboot_php` - Reboot PHP service
- `reboot_mysql` - Reboot MySQL service
- `reboot_postgres` - Reboot PostgreSQL service
- `confirm_site_creation` - Confirm site creation
- `create_site` - Create a new site
- `confirm_install_or_update_site_git` - Confirm Git installation/update
- `install_or_update_site_git` - Install or update Git repository
- `confirm_remove_site_git` - Confirm Git removal
- `remove_site_git` - Remove Git repository
- `enable_quick_deployment` - Enable quick deployment
- `confirm_disable_quick_deployment` - Confirm disabling quick deployment
- `disable_quick_deployment` - Disable quick deployment
- `confirm_deploy_now` - Confirm immediate deployment
- `deploy_now` - Deploy immediately
- `confirm_change_site_php_version` - Confirm PHP version change
- `change_site_php_version` - Change site PHP version
- `confirm_add_site_aliases` - Confirm site aliases addition
- `add_site_aliases` - Add site aliases
- `confirm_clear_site_log` - Confirm site log clearing
- `clear_site_log` - Clear site logs
- `confirm_lets_encrypt_certificate_creation` - Confirm Let's Encrypt certificate creation
- `create_lets_encrypt_certificate` - Create Let's Encrypt certificate
- `confirm_activate_certificate` - Confirm certificate activation
- `activate_certificate` - Activate a certificate

### Destructive Tools
- `confirm_server_deletion` - Confirm server deletion
- `delete_server` - Delete a server
- `confirm_delete_database` - Confirm database deletion
- `delete_database` - Delete a database
- `confirm_delete_database_user` - Confirm database user deletion
- `delete_database_user` - Delete a database user
- `confirm_site_deletion` - Confirm site deletion
- `delete_site` - Delete a site
- `confirm_delete_certificate` - Confirm certificate deletion
- `delete_certificate` - Delete a certificate

## Screenshots

### Creating a Server
![Creating a Server](docs/screenshots/create-server.png)
*Demonstrates the server creation process through the MCP interface*

### Creating a Site
![Creating a Site](docs/screenshots/create-site.png)
*Shows how to create a new site on an existing server*

### Rebooting a Server
![Rebooting a Server](docs/screenshots/reboot-server.png)
*Illustrates the server reboot functionality*

## Project Structure
- `src/server.ts` — Main MCP server entry point
- `src/tools/forge/` — All Forge tool definitions and registry
- `src/core/types/` — Type definitions and protocols
- `package.json` — Scripts and dependencies
- `.gitignore` — Ignores build, env, and dependency files

## Extending (Adding New Tools)
1. Export a `ForgeToolDefinition` from the new file.
2. Import and add the tool to the `forgeTools` array in `src/tools/forge/index.ts`.
3. The tools will be registered when the server starts.

---

For more information on MCP, see the [Model Context Protocol documentation](https://modelcontextprotocol.org/).