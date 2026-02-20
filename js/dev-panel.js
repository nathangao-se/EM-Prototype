// ========================================
// DEV PANEL - Prototype Controls
// ========================================

(function() {
  const panel = document.getElementById('dev-panel');
  const toggleBtn = document.getElementById('dev-panel-toggle');
  const options = document.querySelectorAll('.dev-panel-option[data-config]');

  let currentConfigId = 'global-oversight';

  // ===========================================
  // PANEL EXPAND/COLLAPSE
  // ===========================================

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('dev-panel--expanded');
    toggleBtn.textContent = panel.classList.contains('dev-panel--expanded') ? '× Dev' : '☰ Dev';
  });

  // ===========================================
  // PERSPECTIVE TOGGLE
  // ===========================================

  const configs = {
    'global-oversight': CONFIG_GLOBAL_OVERSIGHT,
    'site-manager': CONFIG_SITE_MANAGER
  };

  options.forEach(option => {
    option.addEventListener('click', () => {
      const configId = option.dataset.config;
      if (configId === currentConfigId) return;
      options.forEach(opt => opt.classList.remove('dev-panel-option--active'));
      option.classList.add('dev-panel-option--active');

      // Deactivate app shell if leaving it
      if (currentConfigId === 'app-shell' && typeof window.deactivateAppShell === 'function') {
        window.deactivateAppShell();
      }

      if (configId === 'app-shell') {
        currentConfigId = configId;
        if (typeof window.activateAppShell === 'function') {
          window.activateAppShell();
        }
        return;
      }

      const config = configs[configId];
      if (config && typeof loadConfig === 'function') {
        currentConfigId = configId;
        if (typeof runConfigTransition === 'function') {
          runConfigTransition(function () { loadConfig(config); });
        } else {
          loadConfig(config);
        }
      }
    });
  });

  // ===========================================
  // CLOSE ALL OVERLAYS — ensures only one is open at a time
  // ===========================================

  window.closeAllOverlays = function () {
    if (typeof window.closeInventoryWizard === 'function') window.closeInventoryWizard();
    if (typeof window.closeCampaignWizard === 'function') window.closeCampaignWizard();
    if (typeof window.closeNormalizeModal === 'function') window.closeNormalizeModal();
    if (typeof window.closeActivityDataSetupModal === 'function') window.closeActivityDataSetupModal();
    if (typeof window.closeUploadWizard === 'function') window.closeUploadWizard();
    if (typeof window.closeCategoryModal === 'function') window.closeCategoryModal();
  };

})();
