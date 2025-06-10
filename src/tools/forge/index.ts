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
import { listDataTypesTool } from "./listDataTypes.js";
import { listCredentialsTool } from "./listCredentials.js";
import { listRegionsTool } from "./listRegions.js";
import { getComposerPackagesAuthTool } from "./getComposerPackagesAuth.js";
import { checkLaravelMaintenanceStatusTool } from "./checkLaravelMaintenanceStatus.js";
import { checkPulseDaemonStatusTool } from "./checkPulseDaemonStatus.js";
import { checkInertiaDaemonStatusTool } from "./checkInertiaDaemonStatus.js";
import { checkLaravelSchedulerStatusTool } from "./checkLaravelSchedulerStatus.js";
import { listSizesTool } from "./listSizes.js";
import {
  providerPrompt,
  credentialPrompt,
  regionPrompt,
  sizePrompt,
  ubuntuVersionPrompt,
  databaseTypePrompt,
  phpVersionPrompt,
  serverNamePrompt,
  confirmationPrompt
} from './promptDrivenServerCreation.js';
import { createServerTool } from './createServerTool.js';
// Import other tools here as you add them

export const forgeTools = [
  listServersTool,
  listPhpVersionsTool,
  listStaticPhpVersionsTool,
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
  // listProvidersTool,
  // listDataTypesTool,
  // listCredentialsTool,
  // listRegionsTool,
  getComposerPackagesAuthTool,
  checkLaravelMaintenanceStatusTool,
  checkPulseDaemonStatusTool,
  checkInertiaDaemonStatusTool,
  checkLaravelSchedulerStatusTool,
  // listSizesTool,
  createServerTool
];

// Export all prompts for MCP registration
export const forgePrompts = [
  providerPrompt,
  credentialPrompt,
  regionPrompt,
  sizePrompt,
  ubuntuVersionPrompt,
  databaseTypePrompt,
  phpVersionPrompt,
  serverNamePrompt,
  confirmationPrompt
];
