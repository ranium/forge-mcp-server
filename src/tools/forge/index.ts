import { listServersTool } from "./listServers.js";
import { listPhpVersionsTool } from "./listPhpVersions.js";
import { getUserTool } from "./getUser.js";
import { showServerTool } from "./showServer.js";
import { listSitesTool } from "./listSites.js";
// Import other tools here as you add them

export const forgeTools = [
  listServersTool,
  listPhpVersionsTool,
  getUserTool,
  showServerTool,
  listSitesTool,
  // Add new tools here
]; 