# Forge MCP Server

This is a Model Context Protocol (MCP) server for Laravel Forge integration. It is modular, extensible, and supports dynamic registration of Forge API tools.

## Features
- MCP-compliant server
- Dynamic tool registration (add new tools easily)
- Health check tool: `test_connection`
- Example Forge tool: `list_servers`
- Ready for future API tool additions

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd forge_mcp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Build the project:**
   ```sh
   npm run build
   ```

4. **Run the MCP server:**
   - For production (after build):
     ```sh
     npm start
     ```
   - For development (hot-reload):
     ```sh
     npm run dev
     ```

## Configuration & Usage

A **Forge API key is required** for all Forge tool invocations. You must provide it either as an environment variable or at runtime via the MCP Inspector UI/CLI.

- When using the [MCP Inspector UI](https://inspector.modelcontext.com/) or CLI, you will be prompted to enter your Forge API key as a parameter for the relevant tool if it is not already set in the environment.
- The server does not store or require the API key in any config file by default, but it must be available at runtime.

### Example: Using the `list_servers` Tool
When you invoke the `list_servers` tool, you will be prompted for your Forge API key if it is not already set. The tool will use this key to authenticate with the Forge API for that request only.

### Launching the MCP Server with a Configuration Block

If you are using an orchestrator (such as MCP Inspector UI/CLI) that supports launching MCP servers via a configuration block, you **must** specify the Forge API key as shown below:

```json
{
  "mcpServers": {
    "forge-mcp": {
      "command": "node",
      "args": [
        "/path/to/forge_mcp/dist/server.js"
      ],
      "cleanup": true,
      "autoRestart": true,
      "env": {
        "FORGE_API_KEY": "your_forge_api_key_here"
      }
    }
  }
}
```

- The `FORGE_API_KEY` in the `env` section is **required**. If not set here, you will be prompted to provide it at runtime via the MCP Inspector UI/CLI when invoking a Forge tool.
- **Precedence:** If both an environment variable and a runtime parameter are provided, the runtime parameter (entered in the UI/CLI) will take precedence.

**Note:**
Never commit your real API keys to version control. Use environment variables or secrets management in production.

## Project Structure
- `src/server.ts` — Main MCP server entry point (dynamically registers all tools)
- `src/tools/forge/` — All Forge tool definitions and registry
- `src/core/types/` — Type definitions and protocols
- `package.json` — Scripts and dependencies
- `.gitignore` — Ignores build, env, and dependency files

## Extending (Adding New Tools)
1. Export a `ForgeToolDefinition` from the new file.
2. Import and add the tool to the `forgeTools` array in `src/tools/forge/index.ts`.
3. No changes needed in `server.ts`—tools are registered automatically.

---

For more information on MCP, see the [Model Context Protocol documentation](https://modelcontextprotocol.org/). 