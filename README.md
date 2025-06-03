# Forge MCP Server

This is a minimal Model Context Protocol (MCP) server for Laravel Forge integration. It is designed to be modular and extensible for future API integrations.

## Features
- MCP-compliant server
- Health check tool: `test_connection`
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

## Usage

You can connect to this MCP server using the [MCP Inspector CLI](https://github.com/modelcontextprotocol/inspector-cli) or [MCP Inspector UI](https://inspector.modelcontext.com/).

### Health Check Tool
- Tool name: `test_connection`
- Parameter: `message` (string)
- Returns: Echoes the message and a timestamp

Example request:
```json
{
  "tool": "test_connection",
  "parameters": { "message": "Hello MCP!" }
}
```

## Project Structure
- `src/server.ts` — Main MCP server entry point
- `src/core/types/` — Type definitions
- `package.json` — Scripts and dependencies
- `.gitignore` — Ignores build, env, and dependency files

## Extending
To add new API tools, create a new tool definition and register it in `src/server.ts`.

---

For more information on MCP, see the [Model Context Protocol documentation](https://modelcontextprotocol.org/). 