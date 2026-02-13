// ========================================
// WIZARD — Activity Collection Setup
// ========================================

(function () {

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('wizard-overlay');
  var wizard = overlay.querySelector('.wizard');
  var titleEl = overlay.querySelector('.wizard-header-title');
  var closeBtn = overlay.querySelector('.wizard-close-btn');
  var body = overlay.querySelector('.wizard-body');
  var footer = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================
  var currentStep = 0;
  var filesUploaded = false;
  var emissionsUploaded = false;


  // Step labels for stepper (5-step flow)
  var STEPS = [
    { label: 'Intro', key: 'intro' },
    { label: 'Activity', key: 'activity' },
    { label: 'Column map', key: 'column-map' },
    { label: 'Emissions', key: 'emissions' },
    { label: 'Review/collab', key: 'review' }
  ];

  // Fake file data
  var ACTIVITY_FILES = [
    { name: 'Southern Europe Product Data Field', size: '385 Kb', type: 'csv', status: 'ok' },
    { name: 'Afric Hospitality Sales Team Digest 1', size: '655 Kb', type: 'csv', status: 'ok' },
    { name: 'Asia/Oceania Hospitality Data Final', size: '', type: 'Activity types', status: 'ok' },
    { name: 'Data 2', size: '', type: 'Availability types', status: 'ok' },
    { name: 'Asia Minor Mezique Data Month Batch 2', size: '593 Kb', type: '', status: 'ok' }
  ];

  var EMISSIONS_FILES = [
    { name: 'Legacy Emissions data 2009-2023', size: '504 Ons', type: '', status: 'ok' },
    { name: 'Legacy emissions dat 2023-2025', size: '808 lines', type: '', status: 'ok' }
  ];

  // Column mapping data
  var COLUMN_MAPPINGS = [
    {
      column: 'Date',
      bestMatches: [
        { name: 'Final date', desc: 'Date on which the campaign is deemed complete' }
      ],
      otherOptions: [
        { name: 'Report date', desc: 'Date when the final report is due' },
        { name: 'Start date', desc: 'Date on which the campaign is executed' }
      ]
    },
    {
      column: 'Diesl',
      bestMatches: [
        { name: 'Diesel fuel', desc: 'Fuels that work with no-spark Diesel engines' }
      ],
      otherOptions: [
        { name: 'Biodiesel', desc: 'Diesel fuel derived from biological sources, often fats' }
      ]
    }
  ];

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    currentStep = 0;
    filesUploaded = false;
    emissionsUploaded = false;
    render();
    overlay.classList.add('wizard-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('wizard-overlay--open');
    document.body.style.overflow = '';
  }

  window.openActivityWizard = openWizard;

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

  function render() {
    switch (currentStep) {
      case 0: renderIntro(); break;
      case 1: renderUploadActivity(); break;
      case 2: renderColumnMapping(); break;
      case 3: renderUploadEmissions(); break;
      case 4: renderReview(); break;
    }
  }

  // ===========================================
  // STEP 0 — INTRO
  // ===========================================

  function renderIntro() {
    titleEl.textContent = 'Set up and add your activity data';

    body.innerHTML =
      '<div class="wizard-intro-cards">' +
        '<div class="wizard-selection-card" data-action="upload">' +
          '<div class="wizard-selection-card-icon"><i class="fa-solid fa-file-arrow-up"></i></div>' +
          '<div class="wizard-selection-card-divider"></div>' +
          '<div class="wizard-selection-card-label">Upload prepared<br>activity files</div>' +
        '</div>' +
        '<div class="wizard-selection-card wizard-selection-card--disabled" data-action="manual">' +
          '<div class="wizard-selection-card-icon"><i class="fa-solid fa-file-import"></i></div>' +
          '<div class="wizard-selection-card-divider"></div>' +
          '<div class="wizard-selection-card-label">Enter manual<br>data first</div>' +
        '</div>' +
        '<div class="wizard-intro-divider-v"></div>' +
        '<div class="wizard-selection-card wizard-selection-card--disabled" data-action="api">' +
          '<div class="wizard-selection-card-icon"><i class="fa-solid fa-file-import"></i></div>' +
          '<div class="wizard-selection-card-divider"></div>' +
          '<div class="wizard-selection-card-label">Import<br>via API</div>' +
        '</div>' +
      '</div>' +
      '<div class="wizard-intro-text">' +
        '<p>Welcome to Resource Advisor+ Admin. The first thing we\'ll ask you to do is provide your organization\'s activity data, which is the foundation on which all your calculations will be based.</p>' +
        '<br>' +
        '<p>By the end of this setup, you\'ll have provided clean data that we can then analyze for deeper standardization.</p>' +
      '</div>';

    footer.className = 'wizard-footer wizard-footer--center';
    footer.innerHTML =
      '<button class="wizard-btn-cancel" id="wizard-cancel">Cancel</button>';

    // Bind
    var uploadCard = body.querySelector('[data-action="upload"]');
    uploadCard.addEventListener('click', function () {
      currentStep = 1;
      render();
    });

    footer.querySelector('#wizard-cancel').addEventListener('click', closeWizard);
  }

  // ===========================================
  // STEP 1 — UPLOAD ACTIVITY FILES
  // ===========================================

  function renderUploadActivity() {
    titleEl.textContent = 'Set up and add your files';

    var stepperHTML = buildStepper(1);
    var instructionHTML =
      '<div class="wizard-instruction">' +
        'Add your activity files. These should include [content check]<br><br>' +
        'If your files is running into validation errors, try entering your data into our <a href="#">downloadable excel template</a>' +
      '</div>';

    var contentHTML;
    if (!filesUploaded) {
      contentHTML =
        '<div class="wizard-upload-area" id="wizard-upload-trigger">' +
          '<div class="wizard-upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>' +
          '<div class="wizard-upload-text">' +
            '<div class="wizard-upload-title">Drop your <strong>Activity</strong> files here, or <span class="wizard-upload-title-browse">browse</span></div>' +
            '<div class="wizard-upload-meta">Supports: pdf, xls, json, xml, csv<br>Max file size 100MB</div>' +
          '</div>' +
        '</div>' +
        '<div class="wizard-or-section">' +
          '<div class="wizard-or-text">or</div>' +
          '<label class="wizard-checkbox-row">' +
            '<input type="checkbox" class="wizard-checkbox" id="wizard-no-data-check">' +
            '<span class="wizard-checkbox-label">I don\'t have activity data yet</span>' +
          '</label>' +
        '</div>';
    } else {
      contentHTML = buildFileList(ACTIVITY_FILES);
    }

    body.innerHTML = stepperHTML + instructionHTML + contentHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="wizard-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="wizard-back">Back</button>' +
      '<button class="wizard-btn-green" id="wizard-next">Next: add emissions files</button>';

    // Bind upload trigger
    if (!filesUploaded) {
      var uploadArea = body.querySelector('#wizard-upload-trigger');
      uploadArea.addEventListener('click', function () {
        filesUploaded = true;
        render();
      });
    }

    bindFooter(0, 2);
  }

  // ===========================================
  // STEP 2 — COLUMN MAPPING
  // ===========================================

  function renderColumnMapping() {
    titleEl.textContent = 'Set up and add your files';

    var stepperHTML = buildStepper(2);

    var bannerHTML =
      '<div class="wizard-banner">' +
        '<i class="fa-solid fa-circle-info wizard-banner-icon"></i>' +
        '<span class="wizard-banner-text">For accurate calculations, your data columns need to conform to our standard data set.</span>' +
      '</div>';

    var instructionHTML =
      '<div class="wizard-instruction">' +
        'We found 2 columns in your data that doesn\'t match our standard data; please select a column name from our standard data set to replace it with for calculation purposes.<br><br>' +
        'Your original data will be preserved in our records and will not be lost.' +
      '</div>';

    var mappingHTML = '';
    COLUMN_MAPPINGS.forEach(function (mapping, mi) {
      var radioGroupName = 'mapping-' + mi;
      mappingHTML +=
        '<div class="wizard-mapping-card">' +
          '<div class="wizard-mapping-column-name">' + escapeHTML(mapping.column) + '</div>' +
          '<div class="wizard-mapping-divider"></div>' +
          '<div class="wizard-mapping-options">' +
            '<div class="wizard-mapping-section-label">Best matches in our standard data</div>' +
            buildMappingOptions(mapping.bestMatches, radioGroupName, true) +
            '<hr class="wizard-mapping-hr">' +
            '<div class="wizard-mapping-section-label">Other options</div>' +
            buildMappingOptions(mapping.otherOptions, radioGroupName, false) +
          '</div>' +
        '</div>';
    });

    body.innerHTML = stepperHTML + bannerHTML + instructionHTML + mappingHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="wizard-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="wizard-back">Back</button>' +
      '<button class="wizard-btn-green" id="wizard-next">Next: add emissions files</button>';

    bindFooter(1, 3);
  }

  // ===========================================
  // STEP 3 — UPLOAD EMISSIONS FILES
  // ===========================================

  function renderUploadEmissions() {
    titleEl.textContent = 'Set up and add your files';

    var stepperHTML = buildStepper(3);

    var instructionHTML =
      '<div class="wizard-instruction">' +
        'Add your activity files. These should include [content check]<br><br>' +
        'If your files is running into validation errors, try entering your data into our <a href="#">downloadable excel template</a>' +
      '</div>';

    var contentHTML;
    if (!emissionsUploaded) {
      contentHTML =
        '<div class="wizard-upload-area" id="wizard-upload-emissions-trigger">' +
          '<div class="wizard-upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>' +
          '<div class="wizard-upload-text">' +
            '<div class="wizard-upload-title">Drop your <strong>emissions</strong> files here, or <span class="wizard-upload-title-browse">browse</span></div>' +
            '<div class="wizard-upload-meta">Supports: pdf, xls, json, xml, csv<br>Max file size 100MB</div>' +
          '</div>' +
        '</div>' +
        '<div class="wizard-or-section">' +
          '<div class="wizard-or-text">or</div>' +
          '<label class="wizard-checkbox-row">' +
            '<input type="checkbox" class="wizard-checkbox">' +
            '<span class="wizard-checkbox-label">I don\'t have historical emissions data</span>' +
          '</label>' +
        '</div>';
    } else {
      contentHTML = buildFileList(EMISSIONS_FILES);
    }

    body.innerHTML = stepperHTML + instructionHTML + contentHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="wizard-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="wizard-back">Back</button>' +
      '<button class="wizard-btn-green" id="wizard-next">Next: add collaborators</button>';

    // Bind upload trigger
    if (!emissionsUploaded) {
      var uploadArea = body.querySelector('#wizard-upload-emissions-trigger');
      uploadArea.addEventListener('click', function () {
        emissionsUploaded = true;
        render();
      });
    }

    bindFooter(2, 4);
  }

  // ===========================================
  // STEP 4 — REVIEW & COLLABORATE
  // ===========================================

  function renderReview() {
    titleEl.textContent = 'Set up and add your files';

    var stepperHTML = buildStepper(4);

    var collabHTML =
      '<div class="wizard-review-section">' +
        '<div class="wizard-section-label">Select collaborators from your organization</div>' +
        '<div class="wizard-collab-input-wrapper">' +
          '<input type="text" class="wizard-collab-input" placeholder="">' +
          '<div class="wizard-collab-tags">' +
            '<span class="wizard-collab-tag">E. Honnig <button class="wizard-collab-tag-remove"><i class="fa-solid fa-xmark"></i></button></span>' +
            '<span class="wizard-collab-tag">J. Lee <button class="wizard-collab-tag-remove"><i class="fa-solid fa-xmark"></i></button></span>' +
          '</div>' +
        '</div>' +
      '</div>';

    var activitySection =
      '<div class="wizard-review-section">' +
        '<div class="wizard-review-section-title">Activities data</div>' +
        buildFileList(ACTIVITY_FILES) +
      '</div>';

    var emissionsSection =
      '<div class="wizard-review-section">' +
        '<div class="wizard-review-section-title">Historical emissions data</div>' +
        buildFileList(EMISSIONS_FILES) +
      '</div>';

    body.innerHTML = stepperHTML + collabHTML + activitySection + emissionsSection;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="wizard-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="wizard-back">Back</button>' +
      '<button class="wizard-btn-green" id="wizard-next" style="min-width:180px">Complete your setup</button>';

    bindFooter(3, -1);

    var completeBtn = footer.querySelector('#wizard-next');
    completeBtn.removeEventListener('click', completeBtn._handler);
    completeBtn._handler = function () { closeWizard(); };
    completeBtn.addEventListener('click', completeBtn._handler);
  }

  // ===========================================
  // HELPERS
  // ===========================================

  function buildStepper(activeIndex) {
    // activeIndex is 1-indexed from STEPS (0=intro is always complete when in stepper flow)
    var html = '<div class="wizard-stepper">';
    for (var i = 0; i < STEPS.length; i++) {
      var cls = 'wizard-stepper-item';
      if (i < activeIndex) cls += ' wizard-stepper-item--complete';
      else if (i === activeIndex) cls += ' wizard-stepper-item--active';

      html += '<div class="' + cls + '">';
      html += '<div class="wizard-stepper-label">' + escapeHTML(STEPS[i].label);
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

  function buildFileList(files) {
    var html = '<div class="wizard-file-list">';
    files.forEach(function (f) {
      html +=
        '<div class="wizard-file-item">' +
          '<span class="wizard-file-icon"><i class="fa-regular fa-file"></i></span>' +
          '<span class="wizard-file-name">' + escapeHTML(f.name) + '</span>' +
          (f.size ? '<span class="wizard-file-size">' + escapeHTML(f.size) + '</span>' : '') +
          (f.type ? '<span class="wizard-file-type">' + escapeHTML(f.type) + '</span>' : '') +
          '<span class="wizard-file-status wizard-file-status--ok"><i class="fa-solid fa-circle-check"></i></span>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function buildMappingOptions(options, groupName, isFirst) {
    var html = '';
    options.forEach(function (opt) {
      html +=
        '<label class="wizard-mapping-option">' +
          '<input type="radio" name="' + groupName + '" class="wizard-radio"' + (isFirst ? ' checked' : '') + '>' +
          '<span class="wizard-mapping-option-name">' + escapeHTML(opt.name) + '</span>' +
          '<span class="wizard-mapping-option-desc">' + escapeHTML(opt.desc) + '</span>' +
        '</label>';
      isFirst = false;
    });
    return html;
  }

  function bindFooter(backStep, nextStep) {
    var discardBtn = footer.querySelector('#wizard-discard');
    var backBtn = footer.querySelector('#wizard-back');
    var nextBtn = footer.querySelector('#wizard-next');

    if (discardBtn) {
      discardBtn.addEventListener('click', closeWizard);
    }
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        currentStep = backStep;
        render();
      });
    }
    if (nextBtn && nextStep >= 0) {
      nextBtn.addEventListener('click', function () {
        currentStep = nextStep;
        render();
      });
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
