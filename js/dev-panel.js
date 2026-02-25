// ========================================
// DEV PANEL - Prototype Controls
// ========================================

(function() {
  const panel = document.getElementById('dev-panel');
  const toggleBtn = document.getElementById('dev-panel-toggle');
  if (!panel || !toggleBtn) return;

  const options = document.querySelectorAll('.dev-panel-option[data-config]');

  let currentConfigId = 'global-oversight';

  // ===========================================
  // PANEL EXPAND/COLLAPSE
  // ===========================================

  var closeBtn = document.getElementById('dev-panel-close');

  toggleBtn.addEventListener('click', () => {
    panel.classList.add('dev-panel--expanded');
  });

  if (closeBtn) closeBtn.addEventListener('click', () => {
    panel.classList.remove('dev-panel--expanded');
  });

  // ===========================================
  // PERSPECTIVE TOGGLE
  // ===========================================

  const configs = {
    'global-oversight': CONFIG_GLOBAL_OVERSIGHT,
    'site-manager': CONFIG_SITE_MANAGER
  };

  var appContainer = document.querySelector('.app-container');
  var deliverablesPage = document.getElementById('deliverables-page');

  function deactivateDeliverables() {
    if (deliverablesPage) deliverablesPage.style.display = 'none';
    if (appContainer) appContainer.style.display = '';
  }

  function activateDeliverables() {
    if (appContainer) appContainer.style.display = 'none';
    if (typeof window.deactivateAppShell === 'function') window.deactivateAppShell();
    if (deliverablesPage) deliverablesPage.style.display = '';
  }

  function switchToConfig(configId) {
    if (configId === currentConfigId) return;
    options.forEach(opt => opt.classList.remove('dev-panel-option--active'));
    var matchBtn = document.querySelector('[data-config="' + configId + '"]');
    if (matchBtn) matchBtn.classList.add('dev-panel-option--active');

    if (currentConfigId === 'app-shell' && typeof window.deactivateAppShell === 'function') {
      window.deactivateAppShell();
    }
    if (currentConfigId === 'deliverables') {
      deactivateDeliverables();
    }

    if (configId === 'deliverables') {
      currentConfigId = configId;
      activateDeliverables();
      return;
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
  }

  options.forEach(option => {
    option.addEventListener('click', () => {
      switchToConfig(option.dataset.config);
    });
  });

  // ===========================================
  // LANDING SELECTION MODAL
  // ===========================================

  var landingOverlay = document.getElementById('landing-selection-overlay');
  if (landingOverlay) {
    landingOverlay.querySelectorAll('[data-landing]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-landing');
        landingOverlay.classList.remove('landing-sel-overlay--open');

        if (target === 'deliverables') {
          switchToConfig('deliverables');
        } else if (target === 'global-admin') {
          switchToConfig('global-oversight');
        } else if (target === 'site-manager') {
          switchToConfig('site-manager');
        } else if (target === 'app-shell') {
          switchToConfig('app-shell');
        }
      });
    });
  }

  // ===========================================
  // DELIVERABLES PAGE — WIZARD LAUNCHERS
  // ===========================================

  if (deliverablesPage) {
    deliverablesPage.querySelectorAll('.deliverables-launch-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wizard = btn.getAttribute('data-wizard');
        if (wizard === 'upload' && typeof window.openUploadWizard === 'function') {
          window.openUploadWizard();
        } else if (wizard === 'inventory' && typeof window.openInventoryWizard === 'function') {
          window.openInventoryWizard();
        } else if (wizard === 'activity-map') {
          deactivateDeliverables();
          if (typeof window.getActivityMapPageContent === 'function' && typeof window.runPageTransition === 'function') {
            var pageContent = window.getActivityMapPageContent();
            window.runPageTransition({ triggerEl: btn, pageContent: pageContent, title: 'Activity Data', onExit: function () {
              activateDeliverables();
            }});
          }
        }
      });
    });
  }

  // ===========================================
  // INVENTORY WIZARD — COMBINE STEP TOGGLE
  // ===========================================

  var combineToggle = document.getElementById('dev-toggle-combine');
  window.inventoryCombineStepEnabled = false;

  if (combineToggle) combineToggle.addEventListener('click', function () {
    window.inventoryCombineStepEnabled = !window.inventoryCombineStepEnabled;
    combineToggle.classList.toggle('dev-panel-option--active', window.inventoryCombineStepEnabled);
  });

  // ===========================================
  // UPLOAD WIZARD — VERSION TOGGLE
  // ===========================================

  window.uploadWizardVersion = 'a';
  var uploadVersionBtns = document.querySelectorAll('[data-upload-version]');
  uploadVersionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ver = btn.getAttribute('data-upload-version');
      if (ver === window.uploadWizardVersion) return;
      window.uploadWizardVersion = ver;
      uploadVersionBtns.forEach(function (b) {
        b.classList.toggle('dev-panel-option--active', b.getAttribute('data-upload-version') === ver);
      });
    });
  });

  // ===========================================
  // CLOSE ALL OVERLAYS — ensures only one is open at a time
  // ===========================================

  window.closeAllOverlays = function () {
    window.ModalManager.closeAll();
  };

})();
