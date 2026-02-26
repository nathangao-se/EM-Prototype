// ========================================
// CAMPAIGN WIZARD — Data collection campaign
// ========================================

(function () {

  var WS = window.WizardSteps;

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('dcc-wizard-overlay');
  if (!overlay) return;

  ModalManager.register('campaign-wizard', {
    overlay: overlay,
    openClass: 'wizard-overlay--open',
    onOpen: function () {
      currentStep = 0;
      templatesChecked = false;
      entitySelections = {};
      entityExpanded = {};
      entityExpanded['dcc-americas'] = true;
      entityExpanded['dcc-offices'] = true;
      ACTIVITIES.forEach(function (a) { activitySelections[a.id] = true; });
      assignEntityChecked = {};
      entityActivities = {};
      render();
    }
  });

  var wizardEl = overlay.querySelector('.dcc-wizard');
  var titleEl = overlay.querySelector('.wizard-header-title');
  var closeBtn = overlay.querySelector('.wizard-close-btn');
  var body = overlay.querySelector('.wizard-body');
  var footer = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================
  var currentStep = 0;
  var templatesChecked = false;
  var formData = {
    name: '',
    startDate: '',
    endDate: '',
    prompt: 'Exact semantic and scope match: \'Fuel cell - Natural Gas\' is a direct fuel-cell'
  };

  var activitySelections = {};
  var entitySelections = {};
  var entityExpanded = {};
  var assignEntityChecked = {};
  var entityActivities = {};

  var STEP_WIDTHS = [680, 1000, 1000, 1200, 760];

  var STEPS = [
    { label: 'Basic info', key: 'basic' },
    { label: 'Add entities', key: 'entities' },
    { label: 'Add activities', key: 'activities' },
    { label: 'Combine', key: 'assign' },
    { label: 'Finalize', key: 'finalize' }
  ];

  // ===========================================
  // SAMPLE DATA
  // ===========================================

  var TEMPLATES = [
    { name: 'Main template', categories: 12 },
    { name: 'Template electricity only', categories: 6 },
    { name: 'Template Europe', categories: 4 }
  ];

  var ACTIVITIES = [
    { id: 'sc',  name: 'Stationary combustion',           scope: 1, entities: 1223, records: 847,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'mc',  name: 'Mobile combustion',                scope: 1, entities: 1223, records: 847,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'fe',  name: 'Fugitive emissions',               scope: 1, entities: 987,  records: 634,  calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'pe2', name: 'Process emissions',                 scope: 1, entities: 412,  records: 283,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'pe',  name: 'Purchased electricity',             scope: 2, entities: 1223, records: 847,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'sh',  name: 'Purchased steam & heat',            scope: 2, entities: 890,  records: 612,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'pc',  name: 'Purchased cooling',                 scope: 2, entities: 345,  records: 198,  calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'pgs', name: 'Purchased goods & services',        scope: 3, entities: 1102, records: 4210, calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'cg',  name: 'Capital goods',                     scope: 3, entities: 578,  records: 1340, calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'fera',name: 'Fuel & energy related activities',  scope: 3, entities: 1041, records: 892,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'ut',  name: 'Upstream transportation',           scope: 3, entities: 764,  records: 2105, calc: 'RA+ Standard v2.1',  status: 'need' },
    { id: 'wg',  name: 'Waste generated in operations',     scope: 3, entities: 923,  records: 1570, calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'bt',  name: 'Business travel',                   scope: 3, entities: 645,  records: 423,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'ec',  name: 'Employee commuting',                scope: 3, entities: 645,  records: 389,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'dt',  name: 'Downstream transportation',         scope: 3, entities: 510,  records: 1780, calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'usp', name: 'Use of sold products',              scope: 3, entities: 298,  records: 940,  calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'eol', name: 'End-of-life treatment',             scope: 3, entities: 298,  records: 467,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'fr',  name: 'Franchises',                        scope: 3, entities: 134,  records: 312,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'inv', name: 'Investments',                       scope: 3, entities: 89,   records: 156,  calc: 'RA+ Standard v2.1',  status: 'need' }
  ];

  ACTIVITIES.forEach(function (a) { activitySelections[a.id] = true; });

  var ENTITY_TREE = [
    {
      id: 'dcc-americas', name: 'Americas', total: 534, activities: 40, records: 8420,
      children: [
        {
          id: 'dcc-offices', name: 'Offices', total: 127, activities: 8, records: 1632,
          children: [
            { id: 'dcc-boston-a',  name: 'Boston HQ - Building A', total: 0, activities: 1, records: 364, children: [] },
            { id: 'dcc-boston-b',  name: 'Boston HQ - Building B', total: 0, activities: 1, records: 233, children: [] },
            { id: 'dcc-denver-r', name: 'Denver Regional Office',  total: 0, activities: 2, records: 692, children: [] },
            { id: 'dcc-toronto',  name: 'Toronto Office',          total: 0, activities: 1, records: 164, children: [] },
            { id: 'dcc-mexico',   name: 'Mexico City Office',      total: 0, activities: 2, records: 813, children: [] },
            { id: 'dcc-denver-o', name: 'Denver Regional office',  total: 0, activities: 1, records: 197, children: [] }
          ]
        },
        { id: 'dcc-warehouses', name: 'Warehouses', total: 89, activities: 18, records: 4309, children: [] },
        { id: 'dcc-factories',  name: 'Factories',  total: 224, activities: 14, records: 2136, children: [] }
      ]
    },
    { id: 'dcc-emea', name: 'EMEA', total: 489, activities: 11, records: 7230, children: [] },
    { id: 'dcc-apac', name: 'APAC', total: 224, activities: 9,  records: 8420, children: [] }
  ];

  entityExpanded['dcc-americas'] = true;
  entityExpanded['dcc-offices'] = true;

  // ===========================================
  // SHARED CONTEXT — passed to WizardSteps
  // ===========================================

  function ctx() {
    return {
      prefix: 'dcc',
      body: body,
      entityTree: ENTITY_TREE,
      activities: ACTIVITIES,
      entitySelections: entitySelections,
      entityExpanded: entityExpanded,
      activitySelections: activitySelections,
      assignEntityChecked: assignEntityChecked,
      entityActivities: entityActivities
    };
  }

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    ModalManager.open('campaign-wizard');
  }

  function closeWizard() {
    ModalManager.close('campaign-wizard');
  }

  window.openCampaignWizard = openWizard;
  window.closeCampaignWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);

  // ===========================================
  // RENDER DISPATCHER
  // ===========================================

  var STEP_HEIGHTS = ['auto', 800, 800, 800, 'auto'];

  function render() {
    wizardEl.style.width = (STEP_WIDTHS[currentStep] || 680) + 'px';
    var h = STEP_HEIGHTS[currentStep] || 800;
    wizardEl.style.height = (h === 'auto') ? 'auto' : h + 'px';
    switch (currentStep) {
      case 0: renderBasicInfo(); break;
      case 1: renderAddEntities(); break;
      case 2: renderSelectActivities(); break;
      case 3: WS.initAssignStep(ctx()); renderAssignActivities(); break;
      case 4: renderFinalize(); break;
    }
  }

  // ===========================================
  // STEPPER BUILDER
  // ===========================================

  function buildStepper(activeIndex) {
    var html = '<div class="wizard-stepper">';
    for (var i = 0; i < STEPS.length; i++) {
      var cls = 'wizard-stepper-item';
      if (i < activeIndex) cls += ' wizard-stepper-item--complete';
      else if (i === activeIndex) cls += ' wizard-stepper-item--active';

      html += '<div class="' + cls + '">';
      html += '<div class="wizard-stepper-label">' + (i + 1) + '. ' + WS.esc(STEPS[i].label);
      if (i < activeIndex) {
        html += ' <span class="wizard-stepper-check"><i class="fa-solid fa-check"></i></span>';
      }
      html += '</div>';
      html += '<div class="wizard-stepper-bar"><div class="wizard-stepper-bar-fill"></div></div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===========================================
  // STEP 0 — BASIC INFO
  // ===========================================

  function renderBasicInfo() {
    titleEl.textContent = 'Data collection campaign';

    var stepperHTML = buildStepper(0);

    var formHTML =
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">Campaign name</label>' +
          '<input type="text" class="inv-form-input" id="dcc-name" value="' + WS.esc(formData.name) + '">' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">Start date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + WS.esc(formData.startDate) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">End date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + WS.esc(formData.endDate) + '">' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">What do the respondents need to provide here?</label>' +
          '<textarea class="dcc-textarea">' + WS.esc(formData.prompt) + '</textarea>' +
        '</div>' +
      '</div>' +
      '<label class="dcc-checkbox-row">' +
        '<input type="checkbox" class="dcc-checkbox" id="dcc-templates-check"' + (templatesChecked ? ' checked' : '') + '>' +
        '<span class="dcc-checkbox-label">Add templates for reference</span>' +
      '</label>';

    if (templatesChecked) {
      formHTML += buildTemplateList();
    }

    body.innerHTML = stepperHTML + formHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Cancel</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: Entities to include</button>';

    footer.querySelector('#dcc-back').addEventListener('click', closeWizard);
    bindFooterNav(-1, 1);

    var templateCb = document.getElementById('dcc-templates-check');
    if (templateCb) {
      templateCb.addEventListener('change', function () {
        templatesChecked = this.checked;
        render();
      });
    }
  }

  function buildTemplateList() {
    var html = '<div class="dcc-template-list">';
    TEMPLATES.forEach(function (t) {
      html +=
        '<div class="dcc-template-item">' +
          '<input type="checkbox" class="dcc-checkbox dcc-checkbox--small">' +
          '<span class="dcc-template-name">' + WS.esc(t.name) + '</span>' +
          '<a href="#" class="dcc-template-preview">Preview <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px"></i></a>' +
          '<span class="dcc-template-meta">' + t.categories + ' categories</span>' +
          '<button class="dcc-template-sort"><i class="fa-solid fa-arrows-up-down" style="font-size:12px;color:#676f73"></i></button>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  // ===========================================
  // STEP 1 — ADD ENTITIES (shared)
  // ===========================================

  function renderAddEntities() {
    titleEl.textContent = 'Data collection campaign: Entities to include';
    var c = ctx();

    body.innerHTML = buildStepper(1) + WS.buildStatsBar(c) + WS.buildEntitiesContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: Activities to include</button>';

    bindFooterNav(0, 2);
    WS.bindEntitiesStep(c, function () { WS.refreshStatsBar(c); });
  }

  // ===========================================
  // STEP 2 — SELECT ACTIVITIES (shared)
  // ===========================================

  function renderSelectActivities() {
    titleEl.textContent = 'Data collection campaign: Activities to include';
    var c = ctx();

    body.innerHTML = buildStepper(2) + WS.buildStatsBar(c) + WS.buildActivitiesContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: Add activities to entities</button>';

    bindFooterNav(1, 3);
    WS.bindActivitiesStep(c, function () { WS.refreshStatsBar(c); });
  }

  // ===========================================
  // STEP 3 — ADD ACTIVITIES TO ENTITIES (shared)
  // ===========================================

  function renderAssignActivities() {
    titleEl.textContent = 'Data collection campaign: Add activities to entities';
    var c = ctx();

    body.innerHTML = buildStepper(3) + WS.buildStatsBar(c) + WS.buildAssignContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: Finalize</button>';

    bindFooterNav(2, 4);
    WS.bindAssignStep(c);
  }

  // ===========================================
  // STEP 4 — FINALIZE
  // ===========================================

  function renderFinalize() {
    titleEl.textContent = 'Data collection campaign: Finalize';
    var c = ctx();

    var stepperHTML = buildStepper(4);
    var statsHTML = WS.buildStatsBar(c);

    function reviewItem(label, value, extra) {
      return '<div class="inv-review-item">' +
        '<span class="inv-review-label">' + label + '</span>' +
        '<span class="inv-review-value"' + (extra || '') + '>' + value + '</span>' +
      '</div>';
    }

    var basicReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Campaign details</div>' +
        '<div class="inv-review-grid">' +
          reviewItem('Name', WS.esc(formData.name || '(not set)')) +
          reviewItem('Start', WS.esc(formData.startDate || '(not set)')) +
          reviewItem('End', WS.esc(formData.endDate || '(not set)')) +
        '</div>' +
      '</div>';

    var chips = WS.buildActivitiesReviewChips(c);
    var actReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Selected activities (' + chips.count + ')</div>' +
        '<div class="inv-review-columns">' + chips.columnsHtml + '</div>' +
      '</div>';

    var entCount = WS.countEntitiesSelected(c);
    var entitiesReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Entities</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">' +
          WS.numberFmt(entCount) + ' entities selected' +
        '</div>' +
      '</div>';

    var assignSummary = WS.buildAssignReviewSummary(c);
    var assignReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Activity assignments</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#1d201f">' + assignSummary.totalAssignments + ' activity assignments across ' + assignSummary.entitiesWithActivities + ' entities</div>' +
      '</div>';

    var templatesReview = '';
    if (templatesChecked) {
      templatesReview =
        '<div class="inv-review-section">' +
          '<div class="inv-review-title">Templates</div>' +
          '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">' + TEMPLATES.length + ' templates attached</div>' +
        '</div>';
    }

    body.innerHTML = stepperHTML + statsHTML + basicReview + actReview + entitiesReview + assignReview + templatesReview;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next" style="min-width:180px">Launch campaign</button>';

    var backBtn = footer.querySelector('#dcc-back');
    backBtn.addEventListener('click', function () { currentStep = 3; render(); });
    var discardBtn = footer.querySelector('#dcc-discard');
    discardBtn.addEventListener('click', closeWizard);
    var nextBtn = footer.querySelector('#dcc-next');
    nextBtn.addEventListener('click', closeWizard);
  }

  // ===========================================
  // FOOTER NAVIGATION HELPER
  // ===========================================

  function bindFooterNav(backStep, nextStep) {
    var backBtn = footer.querySelector('#dcc-back');
    var nextBtn = footer.querySelector('#dcc-next');
    var discardBtn = footer.querySelector('#dcc-discard');

    if (discardBtn) discardBtn.addEventListener('click', closeWizard);
    if (backBtn && backStep >= 0) {
      backBtn.addEventListener('click', function () { currentStep = backStep; render(); });
    }
    if (nextBtn && nextStep >= 0 && nextStep <= 4) {
      nextBtn.addEventListener('click', function () { currentStep = nextStep; render(); });
    }
  }

})();
