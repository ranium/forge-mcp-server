import { listUbuntuVersionsTool } from './listUbuntuVersions.js'
import { listServersTool } from './listServers.js'
import { listPhpVersionsTool } from './listPhpVersions.js'
import { listStaticPhpVersionsTool } from './listStaticPhpVersions.js'
import { getUserTool } from './getUser.js'
import { showServerTool } from './showServer.js'
import { listSitesTool } from './listSites.js'
import { showSiteTool } from './showSite.js'
import { listDaemonsTool } from './listDaemons.js'
import { showDaemonTool } from './showDaemon.js'
import { listDeploymentsTool } from './listDeployments.js'
import { getDeploymentLogTool } from './getDeploymentLog.js'
import { getDeploymentTool } from './getDeployment.js'
import { getDeploymentOutputTool } from './getDeploymentOutput.js'
import { getServerLogsTool } from './getServerLogs.js'
import { listProvidersTool } from './listProviders.js'
import { listDatabaseTypesTool } from './listDatabaseTypes.js'
import { listCredentialsTool } from './listCredentials.js'
import { listRegionsTool } from './listRegions.js'
import { getComposerPackagesAuthTool } from './getComposerPackagesAuth.js'
import { checkLaravelMaintenanceStatusTool } from './checkLaravelMaintenanceStatus.js'
import { checkPulseDaemonStatusTool } from './checkPulseDaemonStatus.js'
import { checkInertiaDaemonStatusTool } from './checkInertiaDaemonStatus.js'
import { checkLaravelSchedulerStatusTool } from './checkLaravelSchedulerStatus.js'
import { listSizesTool } from './listSizes.js'
import { createServerTool } from './createServerTool.js'
import { confirmServerCreationTool } from './confirmServerCreationTool.js'
import { confirmServerDeletionTool } from './confirmServerDeletionTool.js'
import { deleteServerTool } from './deleteServerTool.js'
import { confirmServerRebootTool } from './confirmServerRebootTool.js'
import { rebootServerTool } from './rebootServerTool.js'
import { rebootNginxTool } from './rebootNginxTool.js'
import { rebootPhpTool } from './rebootPhpTool.js'
import { rebootMysqlTool } from './rebootMysqlTool.js'
import { rebootPostgresTool } from './rebootPostgresTool.js'
import { confirmSiteCreationTool } from './confirmSiteCreationTool.js'
import { createSiteTool } from './createSiteTool.js'
import { listProjectTypesTool } from './listProjectTypesTool.js'
import { confirmChangeSitePhpVersionTool } from './confirmChangeSitePhpVersionTool.js'
import { changeSitePhpVersionTool } from './changeSitePhpVersionTool.js'
import { confirmAddSiteAliasesTool } from './confirmAddSiteAliasesTool.js'
import { addSiteAliasesTool } from './addSiteAliasesTool.js'
import { confirmSiteDeletionTool } from './confirmSiteDeletionTool.js'
import { deleteSiteTool } from './deleteSiteTool.js'
import { getSiteLogTool } from './getSiteLogTool.js'
import { clearSiteLogTool } from './clearSiteLogTool.js'
import { confirmClearSiteLogTool } from './confirmClearSiteLogTool.js'
import { installOrUpdateSiteGitTool } from './installOrUpdateSiteGitTool.js'
import { confirmInstallOrUpdateSiteGitTool } from './confirmInstallOrUpdateSiteGitTool.js'
import { confirmRemoveSiteGitTool } from './confirmRemoveSiteGitTool.js'
import { removeSiteGitTool } from './removeSiteGitTool.js'
import { enableQuickDeploymentTool } from './enableQuickDeploymentTool.js'
import { confirmDisableQuickDeploymentTool } from './confirmDisableQuickDeploymentTool.js'
import { disableQuickDeploymentTool } from './disableQuickDeploymentTool.js'
import { confirmDeployNowTool } from './confirmDeployNowTool.js'
import { deployNowTool } from './deployNowTool.js'
import { confirmCreateDatabaseTool } from './confirmCreateDatabaseTool.js'
import { createDatabaseTool } from './createDatabaseTool.js'
import { syncDatabaseTool } from './syncDatabaseTool.js'
import { listDatabasesTool } from './listDatabasesTool.js'
import { getDatabaseTool } from './getDatabaseTool.js'
import { confirmDeleteDatabaseTool } from './confirmDeleteDatabaseTool.js'
import { deleteDatabaseTool } from './deleteDatabaseTool.js'
import { confirmCreateDatabaseUserTool } from './confirmCreateDatabaseUserTool.js'
import { createDatabaseUserTool } from './createDatabaseUserTool.js'
import { listDatabaseUsersTool } from './listDatabaseUsersTool.js'
import { getDatabaseUserTool } from './getDatabaseUserTool.js'
import { confirmDeleteDatabaseUserTool } from './confirmDeleteDatabaseUserTool.js'
import { deleteDatabaseUserTool } from './deleteDatabaseUserTool.js'
import { confirmLetsEncryptCertificateCreationTool } from './confirmLetsEncryptCertificateCreationTool.js'
import { createLetsEncryptCertificateTool } from './createLetsEncryptCertificateTool.js'
import { listCertificatesTool } from './listCertificatesTool.js'
import { getCertificateTool } from './getCertificateTool.js'
import { confirmActivateCertificateTool } from './confirmActivateCertificateTool.js'
import { activateCertificateTool } from './activateCertificateTool.js'
import { confirmDeleteCertificateTool } from './confirmDeleteCertificateTool.js'
import { deleteCertificateTool } from './deleteCertificateTool.js'
// Import other tools here as you add them

// Categorize tools based on their functionality
// READONLY: Safe read operations that don't modify anything
// WRITE: Operations that create or modify resources
// DESTRUCTIVE: Operations that delete or destroy resources

export const forgeTools = [
  // READONLY TOOLS
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
  listUbuntuVersionsTool,
  getComposerPackagesAuthTool,
  checkLaravelMaintenanceStatusTool,
  checkPulseDaemonStatusTool,
  checkInertiaDaemonStatusTool,
  checkLaravelSchedulerStatusTool,
  listSizesTool,
  listProjectTypesTool,
  listDatabasesTool,
  getDatabaseTool,
  listDatabaseUsersTool,
  getDatabaseUserTool,
  listCertificatesTool,
  getCertificateTool,
  getSiteLogTool,

  // WRITE TOOLS (Creation and Modification)
  confirmServerCreationTool,
  createServerTool,
  confirmCreateDatabaseTool,
  createDatabaseTool,
  syncDatabaseTool,
  confirmCreateDatabaseUserTool,
  createDatabaseUserTool,
  confirmServerRebootTool,
  rebootServerTool,
  rebootNginxTool,
  rebootPhpTool,
  rebootMysqlTool,
  rebootPostgresTool,
  confirmSiteCreationTool,
  createSiteTool,
  confirmInstallOrUpdateSiteGitTool,
  installOrUpdateSiteGitTool,
  confirmRemoveSiteGitTool,
  removeSiteGitTool,
  enableQuickDeploymentTool,
  confirmDisableQuickDeploymentTool,
  disableQuickDeploymentTool,
  confirmDeployNowTool,
  deployNowTool,
  confirmChangeSitePhpVersionTool,
  changeSitePhpVersionTool,
  confirmAddSiteAliasesTool,
  addSiteAliasesTool,
  confirmClearSiteLogTool,
  clearSiteLogTool,
  confirmLetsEncryptCertificateCreationTool,
  createLetsEncryptCertificateTool,
  confirmActivateCertificateTool,
  activateCertificateTool,

  // DESTRUCTIVE TOOLS (Deletion)
  confirmServerDeletionTool,
  deleteServerTool,
  confirmDeleteDatabaseTool,
  deleteDatabaseTool,
  confirmDeleteDatabaseUserTool,
  deleteDatabaseUserTool,
  confirmSiteDeletionTool,
  deleteSiteTool,
  confirmDeleteCertificateTool,
  deleteCertificateTool,
]
