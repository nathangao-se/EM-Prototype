// ========================================
// INVENTORY WIZARD — Create new inventory
// ========================================

(function () {

  var WS = window.WizardSteps;

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('inv-wizard-overlay');
  var wizardEl = overlay.querySelector('.inv-wizard');
  var titleEl = overlay.querySelector('.wizard-header-title');
  var closeBtn = overlay.querySelector('.wizard-close-btn');
  var body = overlay.querySelector('.wizard-body');
  var footer = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================
  var currentStep = 0;
  var consolidationChoice = 'operational';
  var activitySelections = {};
  var entitySelections = {};
  var entityExpanded = {};
  var assignEntityChecked = {};
  var entityActivities = {};
  var formData = {
    name: '',
    startDate: '01/01/2026',
    endDate: '12/31/2026',
    framework: 'GHG Protocol Corporate Standard',
    gwp: 'ARS 100-year GWP (IPCC 2014)',
    gases: 'Kyoto 7 GHGs (CO\u2082, CH\u2084, N\u2082O, HFCs, PFCs, SF\u2086, NF\u2083)'
  };

  var STEP_WIDTHS = [800, 1000, 1000, 1200, 1000];

  var STEPS = [
    { label: 'Basic info', key: 'basic' },
    { label: 'Add entities', key: 'entities' },
    { label: 'Add activities', key: 'activities' },
    { label: 'Combine', key: 'assign' },
    { label: 'Review', key: 'review' }
  ];

  // ===========================================
  // SAMPLE DATA
  // ===========================================

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
      id: 'americas', name: 'Americas', total: 534, activities: 40, records: 8420,
      children: [
        {
          id: 'offices', name: 'Offices', total: 127, activities: 8, records: 1632,
          children: [
            { id: 'boston-a',  name: 'Boston HQ - Building A', total: 0, activities: 1, records: 364, children: [] },
            { id: 'boston-b',  name: 'Boston HQ - Building B', total: 0, activities: 1, records: 233, children: [] },
            { id: 'denver-r', name: 'Denver Regional Office',  total: 0, activities: 2, records: 692, children: [] },
            { id: 'toronto',  name: 'Toronto Office',          total: 0, activities: 1, records: 164, children: [] },
            { id: 'mexico',   name: 'Mexico City Office',      total: 0, activities: 2, records: 813, children: [] },
            { id: 'denver-o', name: 'Denver Regional office',  total: 0, activities: 1, records: 197, children: [] }
          ]
        },
        { id: 'warehouses', name: 'Warehouses', total: 89, activities: 18, records: 4309, children: [] },
        { id: 'factories',  name: 'Factories',  total: 224, activities: 14, records: 2136, children: [] }
      ]
    },
    { id: 'emea', name: 'EMEA', total: 489, activities: 11, records: 7230, children: [] },
    { id: 'apac', name: 'APAC', total: 224, activities: 9,  records: 8420, children: [] }
  ];

  entityExpanded['americas'] = true;
  entityExpanded['offices'] = true;


  // ===========================================
  // SHARED CONTEXT — passed to WizardSteps
  // ===========================================

  function ctx() {
    return {
      prefix: 'inv',
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
    currentStep = 0;
    render();
    overlay.classList.add('wizard-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('wizard-overlay--open');
    document.body.style.overflow = '';
  }

  window.openInventoryWizard = openWizard;
  window.closeInventoryWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWizard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('wizard-overlay--open')) closeWizard();
  });

  // ===========================================
  // RENDER DISPATCHER
  // ===========================================

  var STEP_HEIGHTS = ['auto', 800, 800, 800, 'auto'];

  function render() {
    wizardEl.style.width = (STEP_WIDTHS[currentStep] || 800) + 'px';
    var h = STEP_HEIGHTS[currentStep] || 800;
    wizardEl.style.height = (h === 'auto') ? 'auto' : h + 'px';
    switch (currentStep) {
      case 0: renderBasicInfo(); break;
      case 1: renderAddEntities(); break;
      case 2: renderSelectActivities(); break;
      case 3: WS.initAssignStep(ctx()); renderAssignActivities(); break;
      case 4: renderReview(); break;
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
    titleEl.textContent = 'Create new inventory: basic info';

    var stepperHTML = buildStepper(0);

    var formHTML =
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--w368">' +
          '<label class="inv-form-label">Inventory name</label>' +
          '<input type="text" class="inv-form-input" id="inv-name" value="' + WS.esc(formData.name) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">Start date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + WS.esc(formData.startDate) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">End date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + WS.esc(formData.endDate) + '">' +
        '</div>' +
      '</div>' +
      '<hr class="inv-form-divider">' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">GHG Framework</label>' +
          '<select class="inv-form-select"><option>' + WS.esc(formData.framework) + '</option></select>' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">GWP Version</label>' +
          '<select class="inv-form-select"><option>' + WS.esc(formData.gwp) + '</option></select>' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">Gases Covered</label>' +
          '<select class="inv-form-select"><option>' + WS.esc(formData.gases) + '</option></select>' +
        '</div>' +
      '</div>' +
      '<hr class="inv-form-divider">' +
      '<div class="inv-consolidation">' +
        '<div class="inv-consolidation-title">Consolidation approach</div>' +
        buildRadioOption('operational', 'Operational control', 'Includes 100% of emissions from operations you control') +
        buildRadioOption('financial', 'Financial control', 'Includes 100% of emissions from operations you financially control') +
        buildRadioOption('equity', 'Equity share', 'Includes emissions proportional to your equity stake') +
      '</div>';

    body.innerHTML = stepperHTML + formHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Select entities to include</button>';

    bindFooterNav(-1, 1);

    body.querySelectorAll('input[name="consolidation"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        consolidationChoice = this.value;
      });
    });
  }

  function buildRadioOption(value, label, desc) {
    var checked = consolidationChoice === value ? ' checked' : '';
    return '<div class="inv-radio-option">' +
      '<label class="inv-radio-row">' +
        '<input type="radio" name="consolidation" value="' + value + '" class="inv-radio"' + checked + '>' +
        '<span class="inv-radio-label">' + WS.esc(label) + '</span>' +
      '</label>' +
      '<div class="inv-radio-desc">' + WS.esc(desc) + '</div>' +
    '</div>';
  }

  // ===========================================
  // STEP 1 — ADD ENTITIES (shared)
  // ===========================================

  function renderAddEntities() {
    titleEl.textContent = 'Create new inventory: Entities to include';
    var c = ctx();

    body.innerHTML = buildStepper(1) + WS.buildStatsBar(c) + WS.buildEntitiesContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Activities to include</button>';

    bindFooterNav(0, 2);
    WS.bindEntitiesStep(c, function () { WS.refreshStatsBar(c); });
  }

  // ===========================================
  // STEP 2 — SELECT ACTIVITIES (shared)
  // ===========================================

  function renderSelectActivities() {
    titleEl.textContent = 'Create new inventory: Activities to include';
    var c = ctx();

    body.innerHTML = buildStepper(2) + WS.buildStatsBar(c) + WS.buildActivitiesContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Add activities to entities</button>';

    bindFooterNav(1, 3);
    WS.bindActivitiesStep(c, function () { WS.refreshStatsBar(c); });
  }

  // ===========================================
  // STEP 3 — ADD ACTIVITIES TO ENTITIES (shared)
  // ===========================================

  function renderAssignActivities() {
    titleEl.textContent = 'Create new inventory: Add activities to entities';
    var c = ctx();

    body.innerHTML = buildStepper(3) + WS.buildStatsBar(c) + WS.buildAssignContent(c);

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Review</button>';

    bindFooterNav(2, 4);
    WS.bindAssignStep(c);
  }

  // ===========================================
  // STEP 4 — REVIEW
  // ===========================================

  function renderReview() {
    titleEl.textContent = 'Create new inventory: Review';
    var c = ctx();

    var stepperHTML = buildStepper(4);
    var statsHTML = WS.buildStatsBar(c);

    var basicReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Basic information</div>' +
        '<div class="inv-review-grid">' +
          '<span class="inv-review-label">Inventory name</span><span class="inv-review-value">' + WS.esc(formData.name || '(not set)') + '</span>' +
          '<span class="inv-review-label">Start date</span><span class="inv-review-value">' + WS.esc(formData.startDate) + '</span>' +
          '<span class="inv-review-label">End date</span><span class="inv-review-value">' + WS.esc(formData.endDate) + '</span>' +
          '<span class="inv-review-label">GHG Framework</span><span class="inv-review-value">' + WS.esc(formData.framework) + '</span>' +
          '<span class="inv-review-label">GWP Version</span><span class="inv-review-value">' + WS.esc(formData.gwp) + '</span>' +
          '<span class="inv-review-label">Gases</span><span class="inv-review-value">' + WS.esc(formData.gases) + '</span>' +
          '<span class="inv-review-label">Consolidation</span><span class="inv-review-value" style="text-transform:capitalize">' + WS.esc(consolidationChoice) + '</span>' +
        '</div>' +
      '</div>';

    var chips = WS.buildActivitiesReviewChips(c);
    var actReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Selected activities (' + chips.count + ')</div>' +
        '<div class="inv-review-list">' + chips.html + '</div>' +
      '</div>';

    var entCount = WS.countEntitiesSelected(c);
    var entitiesReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Entities</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">' + WS.numberFmt(entCount) + ' entities selected</div>' +
      '</div>';

    var assignSummary = WS.buildAssignReviewSummary(c);
    var assignReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Activity assignments</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#1d201f">' + assignSummary.totalAssignments + ' activity assignments across ' + assignSummary.entitiesWithActivities + ' entities</div>' +
      '</div>';

    body.innerHTML = stepperHTML + statsHTML + basicReview + actReview + entitiesReview + assignReview;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next" style="min-width:180px">Complete setup</button>';

    var backBtn = footer.querySelector('#inv-back');
    backBtn.addEventListener('click', function () { currentStep = 3; render(); });

    var nextBtn = footer.querySelector('#inv-next');
    nextBtn.addEventListener('click', function () { closeWizard(); });
  }

  // ===========================================
  // FOOTER NAVIGATION HELPER
  // ===========================================

  function bindFooterNav(backStep, nextStep) {
    var backBtn = footer.querySelector('#inv-back');
    var nextBtn = footer.querySelector('#inv-next');

    if (backBtn && backStep >= 0) {
      backBtn.addEventListener('click', function () { currentStep = backStep; render(); });
    } else if (backBtn) {
      backBtn.style.visibility = 'hidden';
    }

    if (nextBtn && nextStep >= 0 && nextStep <= 4) {
      nextBtn.addEventListener('click', function () { currentStep = nextStep; render(); });
    }
  }

})();
