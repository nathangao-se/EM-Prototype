// ========================================
// DEV PANEL - Prototype Controls
// ========================================

(function() {
  const panel = document.getElementById('dev-panel');
  const toggleBtn = document.getElementById('dev-panel-toggle');
  const options = document.querySelectorAll('.dev-panel-option[data-config]');
  const wizardBtn = document.getElementById('dev-open-wizard');
  const invWizardBtn = document.getElementById('dev-open-inventory-wizard');
  
  // Track current config
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
      
      // Update active state
      options.forEach(opt => opt.classList.remove('dev-panel-option--active'));
      option.classList.add('dev-panel-option--active');
      
      // Load the config
      const config = configs[configId];
      if (config && typeof loadConfig === 'function') {
        loadConfig(config);
        currentConfigId = configId;
      }
    });
  });
  
  // ===========================================
  // WIZARD TRIGGER
  // ===========================================
  
  if (wizardBtn) {
    wizardBtn.addEventListener('click', () => {
      if (typeof window.openActivityWizard === 'function') {
        window.openActivityWizard();
      }
    });
  }
  
  if (invWizardBtn) {
    invWizardBtn.addEventListener('click', () => {
      if (typeof window.openInventoryWizard === 'function') {
        window.openInventoryWizard();
      }
    });
  }
  
})();
