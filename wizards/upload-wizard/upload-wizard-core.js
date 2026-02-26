// ========================================
// UPLOAD WIZARD — Core: state, utilities, navigation, stepper, footer, render
// Split from upload-wizard.js
// ========================================

(function () {
  var overlay = document.getElementById('upload-wizard-overlay');
  if (!overlay) return;

  var wiz = overlay.querySelector('.upload-wiz');
  var closeBtn = overlay.querySelector('.upload-wiz-close');
  var bodyEl = overlay.querySelector('.upload-wiz-body');
  var backBtn = overlay.querySelector('.upload-wiz-back');
  var nextBtn = overlay.querySelector('.upload-wiz-next');
  var discardLink = overlay.querySelector('.upload-wiz-discard');
  var footerEl = overlay.querySelector('.upload-wiz-footer');
  var esc = window.DomUtils.esc;

  // ── Shared context ──────────────────────────────────────────────
  var ctx = window._uwCtx = {
    overlay: overlay,
    wiz: wiz,
    bodyEl: bodyEl,
    footerEl: footerEl,
    esc: esc,

    // State
    currentStep: 0,
    stepDirection: 'forward',
    uploadedFiles: [],
    importedFiles: [],
    showManualEntry: false,
    showTemplateList: false,
    showTablePreview: false,
    step1Tab: 'layouts',
    savedSections: [],
    savedRanges: [],
    collaborators: [
      { name: 'E. Honnig' },
      { name: 'J. Lee' }
    ],

    // Constants
    ACTIVITY_TYPES: ['All activity types', 'Electricity only', 'Mixed activities', 'Fuel consumption', 'Water usage'],
    SAMPLE_IMPORTED: window.SampleData.UPLOAD_FILES,
    SAMPLE_CSV_DATA: window.SampleData.UPLOAD_CSV,
    TEMPLATE_CATALOG: window.SampleData.TEMPLATE_CATALOG,
    SAMPLE_SECTIONS: [
      { range: 'A1:E15' },
      { range: 'P1:R15' }
    ],
    SAMPLE_HISTORICAL: [
      { name: 'Legacy Emissions data 2000-2019', size: '999.5mb' },
      { name: 'Legacy emissions dat 2021-2023', size: '999.5mb' }
    ],

    standardColumns: [
      { label: 'Business entity', desc: 'Business Entity name as appears in Resource Advisor+.' },
      { label: 'Start date', desc: 'Start Date of Activity.' },
      { label: 'End date', desc: 'End Date of Activity.' },
      { label: 'Estimation method', desc: 'Method used to estimate emissions.' },
      { label: 'Description', desc: 'Description of the Activity.' },
      { label: 'Record type', desc: 'Select one of the drop-down Record Types.' },
      { label: 'Category', desc: 'Select one of the drop-down Categories.' },
      { label: 'Fuel type/refrigerant', desc: 'Select the fuel type or refrigerant for the activity.' },
      { label: 'Is renewable', desc: 'Indicates if Fuel Type/Power is Renewable.' },
      { label: 'Is generation owned by client', desc: 'Indicates if RE Generator is owned by the client. This field is required when Category is On-Site Energy Generation and Is Renewable is true.' },
      { label: 'Is renewable power used on-site', desc: 'Indicates if renewable power is used on-site. This field is required if Category is On-Site Energy Generation and Is Renewable is true.' },
      { label: 'Are EACs retained by client', desc: 'Indicates if EACs are retained by the client. This field is required when Category is On-Site Energy Generation and Is Renewable is true.' },
      { label: 'Usage value', desc: 'Usage quantity. This field is required when Category is Stationary Combustion or Onsite Energy Generation or Refrigerants.' },
      { label: 'Usage UOM', desc: 'Usage Unit of Measure. This field is required when Category is Stationary Combustion or Onsite Energy Generation or Refrigerants.' },
      { label: 'Distance value', desc: 'Distance traveled for Mobile Combustion. For Mobile Combustion, either Usage value/UOM or Distance value/UOM is required.' },
      { label: 'Distance UOM', desc: 'Distance Unit of Measure for Mobile Combustion. For Mobile Combustion, either Usage value/UOM or Distance value/UOM is required.' },
      { label: 'Spend value', desc: 'The amount spent on the Activity.' },
      { label: 'Spend UOM', desc: 'The unit of measurement (UoM) used for the amount spent on the Activity.' },
      { label: 'Vehicle type', desc: 'Type of vehicle driven. This field is required when Category is Mobile Combustion.' },
      { label: 'Energy type', desc: 'Select the energy type for the activity.' },
      { label: 'Energy attribute type', desc: 'Select one of the drop-down Energy Attribute Types. This field is required if the Category is Off-Site Purchased Energy.' },
      { label: 'Suborganization', desc: 'Suborganization involved in the Activity.' },
      { label: 'Industry', desc: 'Industry related to the Activity.' },
      { label: 'Sectors', desc: 'Sectors involved in the Activity.' },
      { label: 'Products and services', desc: 'Products and services related to the activity.' },
      { label: 'Vendor name', desc: 'Name of the Vendor.' },
      { label: 'Raw material', desc: 'Raw used for the Activity.' },
      { label: 'Item description', desc: 'Description of the item.' },
      { label: 'Is metallic', desc: 'Indicates if the raw material is metallic.' },
      { label: 'Region', desc: 'Region where the Activity took place.' },
      { label: 'Activity type', desc: 'Select one of the drop-down Activity Types.' },
      { label: 'Segment', desc: 'Segment of Activity.' },
      { label: 'Fuel type', desc: 'Select one of the drop-down Fuel Types. This field is required for Storage and Retail Facility activity types. This field is also required when Usage Value and Usage UOM are provided.' },
      { label: 'Origin', desc: 'Starting location of the transport or activity (e.g., city, facility, or site).' },
      { label: 'Destination', desc: 'Ending location of the transport or activity (e.g., city, facility, or site).' },
      { label: 'Is hazardous', desc: 'Indicates whether the Material type is hazardous.' },
      { label: 'Disposal method', desc: 'Select one of the drop-down Disposal Methods.' },
      { label: 'em_template_8e5f6789a0b1c2d3e4f56789a12b3c4d', desc: '' },
      { label: 'Cabin class', desc: 'Select Cabin Class (First Class, Business, etc.) used for Air travel. This field is required when Activity type is \'Air\'.' },
      { label: 'Car type', desc: 'Select Type of Car used for Automobile Travel. This field is required when Activity type is \'Automobile\'.' },
      { label: 'Rail type', desc: 'Select type of Rail used for Rail travel. This field is required when Acitivity type is \'Rail\'.' },
      { label: 'Bus type', desc: 'Select Type of Bus used for Bus travel. This field is required if Activity type is \'Bus\'.' },
      { label: 'Ferry passenger type', desc: 'Select the Type of Ferry travel. This field is required when Activity type is \'Water\'.' },
      { label: 'Room nights', desc: 'Total number of nights for all rooms booked for the Activity.' },
      { label: 'em_template_9f6789a0b1c2d3e4f56789a12b3c4d5e', desc: '' },
      { label: 'Employee ID', desc: 'Identification of the employee as determined by the organization. Only for informational purposes. This field is required if Number of employees is 1.' },
      { label: 'Average distance', desc: 'Average one-way commute distance traveled, either by individual or across all employees.' },
      { label: 'Average distance UOM', desc: 'Unit of measurement (UoM) for Average distance.' },
      { label: 'Days in office per week', desc: 'Average number of days the employee commuted to the office in any given week.' },
      { label: 'Number of weeks', desc: 'Number of weeks commuting.' },
      { label: 'Mode of transportation details', desc: 'Further details of the mode of transport(s) used. i.e. hybrid vehicle, subway train, etc.' },
      { label: 'Number of employees', desc: 'Number of employees. This field is required.' },
      { label: 'em_template_a06789a0b1c2d3e4f56789a12b3c4d5f', desc: '' },
      { label: 'Postal code', desc: 'Postal Code where the Activity took place.' },
      { label: 'em_template_b1789a0b1c2d3e4f56789a12b3c4d5f6', desc: '' },
      { label: 'em_template_c289a0b1c2d3e4f56789a12b3c4d5f67', desc: '' },
      { label: 'Product category', desc: 'The category of the product.' },
      { label: 'Product name', desc: 'The name of the product.' },
      { label: 'Number of uses per lifetime (required)', desc: 'Number of uses during the product\'s lifetime.' },
      { label: 'Quantity sold', desc: 'Number of products products sold.' },
      { label: 'Processing source', desc: 'Select one of the drop-down Processing Sources.' },
      { label: 'Processing usage per unit sold', desc: 'Processing consumed per unit per use. Processing usage per unit per use/UOM is required.' },
      { label: 'Processing usage UOM per unit sold', desc: 'The amount of processing used per unit per use of the product.' },
      { label: 'em_template_d39a0b1c2d3e4f56789a12b3c4d5f678', desc: '' },
      { label: 'Energy per unit per use', desc: 'The amount of energy used per unit per use of the product.' },
      { label: 'Energy use UOM', desc: 'The unit of measure for the energy use.' },
      { label: 'Energy source', desc: 'Select one of the drop-down Energy Sources.' },
      { label: 'em_template_e4a0b1c2d3e4f56789a12b3c4d5f6789', desc: '' },
      { label: 'Revenue value', desc: 'Revenue-based value (not activity) of the activity.' },
      { label: 'Revenue UOM', desc: 'Revenue-based unit of measure (UOM) for the activity value (i.e. USD, EUR, etc)' },
      { label: 'em_template_f5b1c2d3e4f56789a0b1c2d3e4f56789a0', desc: '' },
      { label: 'em_template_06c2d3e4f56789a12b3c4d5f6789a0b1', desc: '' },
      { label: 'em_template_17d3e4f56789a12b3c4d5f6789a0b1c2', desc: '' },
      { label: 'Investment type', desc: 'Type of investment.' },
      { label: 'Total asset value amount', desc: 'Total value of the investment. This field is required if Equity Share is not given.' },
      { label: 'Total amount invested', desc: 'Total amount invested in the investment. This field is required if Equity Share is not given.' },
      { label: 'Equity share', desc: 'Percent ownership of the investment.' },
      { label: 'Industry of investment', desc: 'Industry of investment.' },
      { label: 'Building type', desc: 'Building type of the investment.' },
      { label: 'Is initial sponsor or lender', desc: 'Indicates if the client is an initial sponsor or lender of the investment. This field is required if Investment Type is Debt Investment or Project Finance.' },
      { label: 'Is proceeds use known', desc: 'Indicates if the use of the proceeds generated by the investment is known. This field is required if Investment Type is Debt Investment.' },
      { label: 'Total debt amount', desc: 'Total debt amount held in the investment. This field is required if "Is the use of the proceeds known?" is No.' },
      { label: 'Total asset revenue', desc: 'Annual asset revenue. This field is required if "Is the client an initial sponsor or lender of the investment?" is Yes.' },
      { label: 'Asset status', desc: 'Status of the asset. This field is required if "Is the client an initial sponsor or lender of the investment?" is Yes.' },
      { label: 'Total asset cost', desc: 'Total asset cost. This field is required if Investment Type is Debt Investment.' },
      { label: 'Annual asset cost', desc: 'Annual asset cost. This field is required if Investment Type is Debt Investment.' },
      { label: 'Projected annual emissions', desc: 'Projected annual emissions of the investment. This field is required if Investment Type is Debt Investment.' },
      { label: 'Projected lifetime in years', desc: 'Projected lifetime in years of the investment. This field is required if Investment Type is Debt Investment.' },
      { label: 'em_template_a3e2c1d45b6f4a8e9c2d7f1b3e4a5c6d', desc: '' },
      { label: 'Emissions of the investment', desc: 'Emissions of the investment. Required for emissions calculations.' },
      { label: 'Emissions UoM', desc: 'Unit of measure for the investment emissions.' },
      { label: 'em_template_e7a2c8b14f3d4e2a9b7c2d1f8a6c5b4e', desc: '' }
    ],
    unrecognizedNames: ['Date', 'method', 'UOM', 'Total', 'Revenue', 'descrkption'],
    columnMatches: [],

    // Step renderers (populated by step files)
    renderStep0: null,
    renderStep1: null,
    renderStep2: null
  };

  // ── Column-matching utilities ───────────────────────────────────

  function levenshtein(s, t) {
    var m = s.length, n = t.length;
    var d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 0; j <= n; j++) { d[0][j] = j; }
    for (var i2 = 1; i2 <= m; i2++) {
      for (var j2 = 1; j2 <= n; j2++) {
        var cost = s[i2 - 1] === t[j2 - 1] ? 0 : 1;
        d[i2][j2] = Math.min(d[i2 - 1][j2] + 1, d[i2][j2 - 1] + 1, d[i2 - 1][j2 - 1] + cost);
      }
    }
    return d[m][n];
  }

  function correctTypo(input, vocabulary) {
    var lower = input.toLowerCase();
    var bestWord = lower;
    var bestDist = Infinity;
    for (var i = 0; i < vocabulary.length; i++) {
      var w = vocabulary[i].toLowerCase();
      if (w === lower) return lower;
      var d = levenshtein(lower, w);
      if (d < bestDist && d <= Math.ceil(lower.length * 0.4)) {
        bestDist = d;
        bestWord = w;
      }
    }
    return bestWord;
  }

  function buildColumnMatches() {
    var vocabSet = {};
    ctx.standardColumns.forEach(function (col) {
      col.label.split(/[\s\/\-(),]+/).forEach(function (w) {
        var lw = w.toLowerCase();
        if (lw.length > 1) vocabSet[lw] = true;
      });
    });
    var vocabulary = Object.keys(vocabSet);

    ctx.columnMatches = ctx.unrecognizedNames.map(function (name) {
      var corrected = correctTypo(name, vocabulary);

      var matches = [];
      ctx.standardColumns.forEach(function (col) {
        var words = col.label.toLowerCase().split(/[\s\/\-(),]+/);
        var found = false;
        for (var i = 0; i < words.length; i++) {
          if (words[i] === corrected) { found = true; break; }
        }
        if (!found && col.label.toLowerCase().indexOf(corrected) >= 0) found = true;
        if (found) {
          matches.push({
            label: col.label,
            desc: col.desc,
            value: col.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        }
      });

      var seen = {};
      var unique = [];
      matches.forEach(function (m) {
        if (!seen[m.label]) { seen[m.label] = true; unique.push(m); }
      });

      var best = unique.slice(0, 1);
      var other = unique.slice(1, 6);

      return { name: name, bestMatches: best, otherOptions: other, selected: '' };
    });

    if (ctx.currentStep === 1 && ctx.step1Tab === 'columns' && ctx.renderStep1) ctx.renderStep1();
  }
  ctx.buildColumnMatches = buildColumnMatches;

  function isExactColumnMatch(name) {
    var lower = name.toLowerCase();
    return ctx.standardColumns.some(function (col) {
      return col.label.toLowerCase() === lower;
    });
  }
  ctx.isExactColumnMatch = isExactColumnMatch;

  function matchSingleColumn(name) {
    var vocabSet = {};
    ctx.standardColumns.forEach(function (col) {
      col.label.split(/[\s\/\-(),]+/).forEach(function (w) {
        var lw = w.toLowerCase();
        if (lw.length > 1) vocabSet[lw] = true;
      });
    });
    var vocabulary = Object.keys(vocabSet);
    var corrected = correctTypo(name, vocabulary);

    var matches = [];
    ctx.standardColumns.forEach(function (col) {
      var words = col.label.toLowerCase().split(/[\s\/\-(),]+/);
      var found = false;
      for (var i = 0; i < words.length; i++) {
        if (words[i] === corrected) { found = true; break; }
      }
      if (!found && col.label.toLowerCase().indexOf(corrected) >= 0) found = true;
      if (found) {
        matches.push({ label: col.label, desc: col.desc, value: col.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      }
    });

    var seen = {};
    var unique = [];
    matches.forEach(function (m) { if (!seen[m.label]) { seen[m.label] = true; unique.push(m); } });

    return { name: name, bestMatches: unique.slice(0, 1), otherOptions: unique.slice(1, 6), selected: '' };
  }
  ctx.matchSingleColumn = matchSingleColumn;

  buildColumnMatches();

  // ── Open / close ────────────────────────────────────────────────

  function openWizard() { ModalManager.open('upload-wizard'); }
  function closeWizard() { ModalManager.close('upload-wizard'); }

  window.openUploadWizard = openWizard;
  window.closeUploadWizard = closeWizard;

  ModalManager.register('upload-wizard', {
    overlay: overlay,
    openClass: 'upload-wiz-overlay--open',
    onOpen: function () {
      ctx.currentStep = 0;
      ctx.uploadedFiles = [];
      ctx.importedFiles = [];
      ctx.step1Tab = 'layouts';
      ctx.showManualEntry = false;
      ctx.showTemplateList = false;
      ctx.showTablePreview = false;
      ctx.savedSections = [];
      ctx.savedRanges = [];
      ctx.columnMatches.forEach(function (c) { c.selected = ''; });
      render();
    }
  });

  closeBtn.addEventListener('click', closeWizard);
  discardLink.addEventListener('click', function (e) {
    e.preventDefault();
    closeWizard();
  });

  // ── Navigation ──────────────────────────────────────────────────

  function getVisibleSteps() {
    if (window.uploadWizardVersion === 'a') return [0];
    return [0, 1, 2];
  }
  ctx.getVisibleSteps = getVisibleSteps;

  function nextVisibleStep(from) {
    var steps = getVisibleSteps();
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] > from) return steps[i];
    }
    return -1;
  }

  function prevVisibleStep(from) {
    var steps = getVisibleSteps();
    for (var i = steps.length - 1; i >= 0; i--) {
      if (steps[i] < from) return steps[i];
    }
    return -1;
  }

  backBtn.addEventListener('click', function () {
    var prev = prevVisibleStep(ctx.currentStep);
    if (prev >= 0) {
      ctx.stepDirection = 'back';
      ctx.currentStep = prev;
      render();
    } else {
      closeWizard();
      if (typeof window.openActivityDataSetupModal === 'function') {
        window.openActivityDataSetupModal();
      }
    }
  });

  nextBtn.addEventListener('click', function () {
    closeWizard();
  });

  // ── Stepper ─────────────────────────────────────────────────────

  function updateStepTabs() {
    var stepsContainer = overlay.querySelector('.upload-wiz-steps');
    if (!stepsContainer) return;

    var visible = getVisibleSteps();
    if (visible.length <= 1) {
      stepsContainer.style.display = 'none';
      return;
    }
    stepsContainer.style.display = '';

    var allStepData = [
      { step: 0, label: 'Add activity files' },
      { step: 1, label: 'Columns cleanup' },
      { step: 2, label: 'Review / collaborate' }
    ];

    var html = '';
    visible.forEach(function (stepIdx, displayIdx) {
      var s = allStepData[stepIdx];
      var isComplete = visible.indexOf(ctx.currentStep) > displayIdx;
      var isActive = stepIdx === ctx.currentStep;
      var cls = 'wizard-stepper-item';
      if (isComplete) cls += ' wizard-stepper-item--complete';
      else if (isActive) cls += ' wizard-stepper-item--active';

      html += '<div class="' + cls + '">';
      html += '<div class="wizard-stepper-label">';
      html += '<span>' + (displayIdx + 1) + '. ' + s.label + '</span>';
      if (isComplete) html += ' <span class="wizard-stepper-check"><i class="fa-solid fa-check"></i></span>';
      html += '</div>';
      html += '<div class="wizard-stepper-bar"><div class="wizard-stepper-bar-fill"></div></div>';
      html += '</div>';
    });

    stepsContainer.className = 'upload-wiz-steps wizard-stepper';
    stepsContainer.innerHTML = html;
  }

  // ── Footer ──────────────────────────────────────────────────────

  function updateFooter() {
    backBtn.textContent = 'Cancel';
    backBtn.style.visibility = '';
    nextBtn.textContent = 'Save';
    discardLink.style.display = 'none';

    var checkRow = overlay.querySelector('.uw-s2-check-row');
    if (checkRow) {
      checkRow.style.display = (ctx.currentStep === 2 && getVisibleSteps().indexOf(2) >= 0) ? 'flex' : 'none';
    }
  }

  function updateModalWidth() {
    var inSwap = ctx.currentStep === 0 && (ctx.showManualEntry || ctx.showTemplateList);
    wiz.classList.toggle('upload-wiz--wide', ctx.currentStep === 1 && ctx.showTablePreview);
    wiz.classList.toggle('upload-wiz--swap', inSwap);
  }

  function updateFooterMode() {
    var inForm = ctx.currentStep === 0 && ctx.showManualEntry;
    var inTemplates = ctx.currentStep === 0 && ctx.showTemplateList;
    footerEl.classList.toggle('upload-wiz-footer--hidden', inForm || inTemplates);

    var formFooter = overlay.querySelector('.uw-s0-form-footer');
    if (formFooter) formFooter.style.display = (inForm || inTemplates) ? 'flex' : 'none';
  }
  ctx.updateFooterMode = updateFooterMode;

  // ── Main render ─────────────────────────────────────────────────

  function render() {
    updateStepTabs();
    updateFooter();
    updateFooterMode();
    updateModalWidth();
    var anim = ctx.stepDirection === 'back' ? 'uw-slide-right' : 'uw-slide-left';
    bodyEl.style.animation = 'none';
    void bodyEl.offsetWidth;
    bodyEl.style.animation = anim + ' 220ms ease-in-out';
    if (ctx.currentStep === 0) ctx.renderStep0();
    else if (ctx.currentStep === 1) ctx.renderStep1();
    else ctx.renderStep2();
  }
  ctx.render = render;
})();
