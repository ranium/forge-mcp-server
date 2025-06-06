import { listServersTool } from "./listServers.js";
import { listPhpVersionsTool } from "./listPhpVersions.js";
import { getUserTool } from "./getUser.js";
import { showServerTool } from "./showServer.js";
import { listSitesTool } from "./listSites.js";
import { showSiteTool } from "./showSite.js";
import { listDaemonsTool } from "./listDaemons.js";
import { showDaemonTool } from "./showDaemon.js";
// Import other tools here as you add them

export const forgeTools = [
  listServersTool,
  listPhpVersionsTool,
  getUserTool,
  showServerTool,
  listSitesTool,
  showSiteTool,
  listDaemonsTool,
  showDaemonTool,
  // Add new tools here
]; 