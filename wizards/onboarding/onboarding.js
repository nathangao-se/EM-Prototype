// ========================================
// ONBOARDING WIZARD
// ========================================

(function () {
  'use strict';

  var esc = window.DomUtils ? window.DomUtils.esc : function (s) { return s; };

  // ===========================================
  // DOM
  // ===========================================

  var overlay = document.getElementById('onb-wizard-overlay');
  if (!overlay) return;

  ModalManager.register('onboarding-wizard', {
    overlay: overlay,
    openClass: 'wizard-overlay--open',
    onOpen: function () {
      currentStep = 0;
      selectedType = 'ghg';
      selectedPerspective = 'global-oversight';
      setupForm = { name: '', startDate: '', endDate: '' };
      render();
    }
  });

  var wizardEl  = overlay.querySelector('.onb-wizard');
  var titleEl   = overlay.querySelector('.wizard-header-title');
  var closeBtn  = overlay.querySelector('.wizard-close-btn');
  var body      = overlay.querySelector('.wizard-body');
  var footer    = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================

  var currentStep = 0;
  var selectedType = 'ghg';
  var selectedPerspective = 'global-oversight';
  var setupForm = { name: '', startDate: '', endDate: '' };

  var STEP_WIDTHS = [720, 960, 720, 720];

  var STEPS = [
    { label: 'Welcome',      key: 'welcome'     },
    { label: 'Project type',  key: 'type'        },
    { label: 'Project setup', key: 'setup'       },
    { label: 'View',          key: 'perspective'  }
  ];

  // ===========================================
  // PROJECT TYPE DATA
  // ===========================================

  var PROJECT_TYPES = {
    ghg: {
      name: 'GHG Projects',
      desc: 'Designed for greenhouse gas inventories, emissions reporting, and compliance workflows.',
      groups: [
        { title: 'Activity / data mgmt', items: ['Activity mapping', 'Add files', 'Data campaign', 'Individual tasks'] },
        { title: 'Emissions factors', items: ['Calculation methods', 'EF library'] },
        { title: 'Inventory', items: ['Reporting', 'Inventory / projections list', 'Create inventory / projections'] }
      ]
    },
    seasonal: {
      name: 'Seasonal Projects',
      desc: 'Periodic data collection with recurring schedules and reporting cycles.',
      groups: [
        { title: 'Activity / data mgmt', items: ['Activity mapping', 'Add files', 'Data campaign', 'Individual tasks'] },
        { title: 'Operations', items: ['Individual tasks', 'Reporting', 'Scheduling'] }
      ]
    },
    daily: {
      name: 'Daily / Default',
      desc: 'Ongoing operational tracking, reconciliation, and routine data management.',
      groups: [
        { title: 'Data management', items: ['Data reconciliation', 'Add files', 'Data campaign', 'Individual tasks'] },
        { title: 'Operations', items: ['Individual tasks', 'Reporting', 'Scheduling', 'Optional workflows'] }
      ]
    }
  };

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    ModalManager.closeAll();
    ModalManager.open('onboarding-wizard');
  }

  function closeWizard() {
    ModalManager.close('onboarding-wizard');
  }

  window.openOnboardingWizard = openWizard;
  window.closeOnboardingWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);

  // ===========================================
  // RENDER DISPATCHER
  // ===========================================

  function render() {
    wizardEl.style.width = (STEP_WIDTHS[currentStep] || 720) + 'px';
    switch (currentStep) {
      case 0: renderWelcome();       break;
      case 1: renderProjectType();   break;
      case 2: renderSetup();         break;
      case 3: renderPerspective();   break;
    }
  }

  // ===========================================
  // STEPPER
  // ===========================================

  function buildStepper(activeIndex) {
    var html = '<div class="wizard-stepper">';
    STEPS.forEach(function (s, i) {
      var cls = 'wizard-stepper-item';
      if (i < activeIndex) cls += ' wizard-stepper-item--complete';
      else if (i === activeIndex) cls += ' wizard-stepper-item--active';

      html += '<div class="' + cls + '">';
      html += '<span class="wizard-stepper-label">';
      if (i < activeIndex) {
        html += '<span class="wizard-stepper-check"><i class="fa-solid fa-check" style="font-size:8px"></i></span>';
      }
      html += esc(s.label) + '</span>';
      html += '<div class="wizard-stepper-bar"><div class="wizard-stepper-bar-fill"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // ===========================================
  // FOOTER NAV HELPER
  // ===========================================

  function bindFooterNav(backStep, nextStep) {
    var backBtn = footer.querySelector('#onb-back');
    var nextBtn = footer.querySelector('#onb-next');

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (backStep >= 0) { currentStep = backStep; render(); }
        else closeWizard();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (nextStep < STEPS.length) { currentStep = nextStep; render(); }
        else finishWizard();
      });
    }
  }

  // ===========================================
  // STEP 0 — WELCOME
  // ===========================================

  function renderWelcome() {
    titleEl.textContent = 'Getting started';

    var html = buildStepper(0);

    html +=
      '<div class="onb-welcome">' +
        '<div class="onb-welcome-icon"><i class="fa-solid fa-cubes"></i></div>' +
        '<h2 class="onb-welcome-title">Everything lives in a project</h2>' +
        '<p class="onb-welcome-subtitle">' +
          'Projects are the central way to organize your work in EcoStruxure Resource Advisor+. ' +
          'Whether you\'re running a GHG inventory, collecting seasonal data, or managing daily operations, ' +
          'every workflow starts inside a project.' +
        '</p>' +
        '<div class="onb-welcome-highlight">' +
          '<i class="fa-solid fa-lightbulb" style="margin-right:6px"></i> ' +
          'Any feature can live in any project, but each project type is optimized for certain kinds of work.' +
        '</div>' +
      '</div>';

    body.innerHTML = html;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-back" style="visibility:hidden">Back</button>' +
      '<button class="wizard-btn-green" id="onb-next">Next: Choose project type</button>';

    bindFooterNav(-1, 1);
  }

  // ===========================================
  // STEP 1 — PROJECT TYPE
  // ===========================================

  function buildTypeCard(key) {
    var t = PROJECT_TYPES[key];
    var sel = (key === selectedType) ? ' onb-type-card--selected' : '';

    var html = '<div class="onb-type-card' + sel + '" data-onb-type="' + key + '">';
    html += '<div class="onb-type-card-name">' + esc(t.name) + '</div>';
    html += '<div class="onb-type-card-desc">' + esc(t.desc) + '</div>';

    t.groups.forEach(function (g) {
      html += '<div class="onb-feature-group">';
      html += '<div class="onb-feature-group-title">' + esc(g.title) + '</div>';
      g.items.forEach(function (item) {
        html += '<div class="onb-feature-item">' + esc(item) + '</div>';
      });
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderProjectType() {
    titleEl.textContent = 'Choose a project type';

    var html = buildStepper(1);

    html += '<p class="onb-type-intro">Select a project type. Each type comes with features optimized for that kind of work.</p>';
    html += '<div class="onb-type-grid">';
    html += buildTypeCard('ghg');
    html += buildTypeCard('seasonal');
    html += buildTypeCard('daily');
    html += '</div>';

    body.innerHTML = html;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-back">Back</button>' +
      '<button class="wizard-btn-green" id="onb-next">Next: Project setup</button>';

    bindFooterNav(0, 2);

    body.querySelectorAll('[data-onb-type]').forEach(function (card) {
      card.addEventListener('click', function () {
        selectedType = this.dataset.onbType;
        body.querySelectorAll('.onb-type-card').forEach(function (c) {
          c.classList.toggle('onb-type-card--selected', c.dataset.onbType === selectedType);
        });
      });
    });
  }

  // ===========================================
  // STEP 2 — LIGHT SETUP
  // ===========================================

  function renderSetup() {
    titleEl.textContent = 'Set up your project';

    var t = PROJECT_TYPES[selectedType];
    var html = buildStepper(2);

    html += '<span class="onb-project-type-badge"><i class="fa-solid fa-cube"></i> ' + esc(t.name) + '</span>';
    html += '<p class="onb-setup-intro">Give your project a name and time range. You can always change these later.</p>';

    html +=
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">Project name</label>' +
          '<input type="text" class="inv-form-input" id="onb-proj-name" placeholder="e.g. Q1 2026 Carbon Audit" value="' + esc(setupForm.name) + '">' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">Start date</label>' +
          '<input type="text" class="inv-form-input" id="onb-start" placeholder="mm/dd/yyyy" value="' + esc(setupForm.startDate) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">End date</label>' +
          '<input type="text" class="inv-form-input" id="onb-end" placeholder="mm/dd/yyyy" value="' + esc(setupForm.endDate) + '">' +
        '</div>' +
      '</div>';

    if (selectedType === 'ghg') {
      html +=
        '<hr class="inv-form-divider">' +
        '<div class="inv-form-row">' +
          '<div class="inv-form-field inv-form-field--flex1">' +
            '<label class="inv-form-label">GHG Framework</label>' +
            '<select class="inv-form-select"><option>GHG Protocol Corporate Standard</option></select>' +
          '</div>' +
          '<div class="inv-form-field inv-form-field--flex1">' +
            '<label class="inv-form-label">GWP Version</label>' +
            '<select class="inv-form-select"><option>ARS 100-year GWP (IPCC 2014)</option></select>' +
          '</div>' +
        '</div>';
    }

    body.innerHTML = html;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-back">Back</button>' +
      '<button class="wizard-btn-green" id="onb-next">Next: Choose view</button>';

    bindFooterNav(1, 3);

    var nameInput = document.getElementById('onb-proj-name');
    var startInput = document.getElementById('onb-start');
    var endInput = document.getElementById('onb-end');
    if (nameInput) nameInput.addEventListener('input', function () { setupForm.name = this.value; });
    if (startInput) startInput.addEventListener('input', function () { setupForm.startDate = this.value; });
    if (endInput) endInput.addEventListener('input', function () { setupForm.endDate = this.value; });
  }

  // ===========================================
  // STEP 3 — PERSPECTIVE CHOICE
  // ===========================================

  function renderPerspective() {
    titleEl.textContent = 'Choose your view';

    var html = buildStepper(3);

    html += '<p class="onb-perspective-intro">How will you be using the platform? This sets your default dashboard layout.</p>';

    html += '<div class="onb-perspective-grid">';

    var gSel = selectedPerspective === 'global-oversight' ? ' onb-perspective-card--selected' : '';
    var sSel = selectedPerspective === 'site-manager' ? ' onb-perspective-card--selected' : '';

    html +=
      '<div class="onb-perspective-card' + gSel + '" data-onb-perspective="global-oversight">' +
        '<div class="onb-perspective-icon onb-perspective-icon--global"><i class="fa-solid fa-globe"></i></div>' +
        '<div class="onb-perspective-card-name">Global Admin</div>' +
        '<div class="onb-perspective-card-desc">Multi-site portfolio view with world map and organizational hierarchy. Best for overseeing operations across regions.</div>' +
      '</div>';

    html +=
      '<div class="onb-perspective-card' + sSel + '" data-onb-perspective="site-manager">' +
        '<div class="onb-perspective-icon onb-perspective-icon--site"><i class="fa-solid fa-building"></i></div>' +
        '<div class="onb-perspective-card-name">Site Manager</div>' +
        '<div class="onb-perspective-card-desc">Single-site focus with flat navigation. Best for managing day-to-day operations at one location.</div>' +
      '</div>';

    html += '</div>';

    body.innerHTML = html;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-back">Back</button>' +
      '<button class="wizard-btn-green" id="onb-next">Finish &amp; start collecting data</button>';

    bindFooterNav(2, STEPS.length);

    body.querySelectorAll('[data-onb-perspective]').forEach(function (card) {
      card.addEventListener('click', function () {
        selectedPerspective = this.dataset.onbPerspective;
        body.querySelectorAll('.onb-perspective-card').forEach(function (c) {
          c.classList.toggle('onb-perspective-card--selected', c.dataset.onbPerspective === selectedPerspective);
        });
      });
    });
  }

  // ===========================================
  // FINISH — load config + open data collection
  // ===========================================

  function finishWizard() {
    closeWizard();

    var configs = {
      'global-oversight': window.CONFIG_GLOBAL_OVERSIGHT,
      'site-manager': window.CONFIG_SITE_MANAGER
    };

    var config = configs[selectedPerspective];
    if (!config) return;

    if (typeof window.deactivateAppShell === 'function') {
      window.deactivateAppShell();
    }

    var delivPage = document.getElementById('deliverables-page');
    if (delivPage) delivPage.style.display = 'none';

    var appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.style.display = '';

    function applyConfig() {
      if (typeof window.loadConfig === 'function') {
        window.loadConfig(config);
      }

      var devOptions = document.querySelectorAll('.dev-panel-option[data-config]');
      devOptions.forEach(function (opt) {
        opt.classList.toggle('dev-panel-option--active', opt.dataset.config === selectedPerspective);
      });

      setTimeout(function () {
        if (typeof window.openActivityDataSetupModal === 'function') {
          window.openActivityDataSetupModal();
        }
      }, 400);
    }

    if (typeof window.runConfigTransition === 'function') {
      window.runConfigTransition(applyConfig);
    } else {
      applyConfig();
    }
  }

})();
