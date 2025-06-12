import { listServersTool } from "./listServers.js";
import { listPhpVersionsTool } from "./listPhpVersions.js";
import { listStaticPhpVersionsTool } from "./listPhpVersions.js";
import { getUserTool } from "./getUser.js";
import { showServerTool } from "./showServer.js";
import { listSitesTool } from "./listSites.js";
import { showSiteTool } from "./showSite.js";
import { listDaemonsTool } from "./listDaemons.js";
import { showDaemonTool } from "./showDaemon.js";
import { listDeploymentsTool } from "./listDeployments.js";
import { getDeploymentLogTool } from "./getDeploymentLog.js";
import { getDeploymentTool } from "./getDeployment.js";
import { getDeploymentOutputTool } from "./getDeploymentOutput.js";
import { getServerLogsTool } from "./getServerLogs.js";
import { listProvidersTool } from "./listProviders.js";
import { listDatabaseTypesTool } from "./listDatabaseTypes.js";
import { listCredentialsTool } from "./listCredentials.js";
import { listRegionsTool } from "./listRegions.js";
import { getComposerPackagesAuthTool } from "./getComposerPackagesAuth.js";
import { checkLaravelMaintenanceStatusTool } from "./checkLaravelMaintenanceStatus.js";
import { checkPulseDaemonStatusTool } from "./checkPulseDaemonStatus.js";
import { checkInertiaDaemonStatusTool } from "./checkInertiaDaemonStatus.js";
import { checkLaravelSchedulerStatusTool } from "./checkLaravelSchedulerStatus.js";
import { listSizesTool } from "./listSizes.js";
import { createServerTool } from './createServerTool.js';
import { confirmServerCreationTool } from './confirmServerCreationTool.js';
import { confirmServerDeletionTool } from './confirmServerDeletionTool.js';
import { deleteServerTool } from './deleteServerTool.js';
import { confirmServerRebootTool } from './confirmServerRebootTool.js';
import { rebootServerTool } from './rebootServerTool.js';
// Import other tools here as you add them

export const forgeTools = [
  listServersTool,
  listStaticPhpVersionsTool,
  listPhpVersionsTool,
  getUserTool,
  showServerTool,
  listSitesTool,
  showSiteTool,
  listDaemonsTool,
  showDaemonTool,
  listDeploymentsTool,
  getDeploymentLogTool,
  getDeploymentTool,
  getDeploymentOutputTool,
  getServerLogsTool,
  listProvidersTool,
  listDatabaseTypesTool,
  listCredentialsTool,
  listRegionsTool,
  getComposerPackagesAuthTool,
  checkLaravelMaintenanceStatusTool,
  checkPulseDaemonStatusTool,
  checkInertiaDaemonStatusTool,
  checkLaravelSchedulerStatusTool,
  listSizesTool,
  confirmServerCreationTool,
  createServerTool,
  confirmServerDeletionTool,
  deleteServerTool,
  confirmServerRebootTool,
  rebootServerTool,
];
