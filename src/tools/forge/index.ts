import { listServersTool } from "./listServers.js";
import { listPhpVersionsTool } from "./listPhpVersions.js";
import { getUserTool } from "./getUser.js";
import { showServerTool } from "./showServer.js";
import { listSitesTool } from "./listSites.js";
import { showSiteTool } from "./showSite.js";
import { listDaemonsTool } from "./listDaemons.js";
import { showDaemonTool } from "./showDaemon.js";
import { listDeploymentsTool } from "./listDeployments.js";
import { getDeploymentLogTool } from "./getDeploymentLog.js";
import { getComposerPackagesAuthTool } from "./getComposerPackagesAuth.js";
import { checkLaravelMaintenanceStatusTool } from "./checkLaravelMaintenanceStatus.js";
import { checkPulseDaemonStatusTool } from "./checkPulseDaemonStatus.js";
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
  listDeploymentsTool,
  getDeploymentLogTool,
  getComposerPackagesAuthTool,
  checkLaravelMaintenanceStatusTool,
  checkPulseDaemonStatusTool,
  // Add new tools here
]; 