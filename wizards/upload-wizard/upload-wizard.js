// ========================================
// UPLOAD WIZARD — Add activity files flow (step 1 of upload branch)
// Triggered from Activity data setup → "Add/upload/migrate activity data"
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
  var stepBtns = overlay.querySelectorAll('.upload-wiz-step');

  var currentStep = 0;

  var ACTIVITY_TYPES = ['All activity types', 'Electricity only', 'Mixed activities', 'Fuel consumption', 'Water usage'];

  var uploadedFiles = [];
  var importedFiles = [];

  var SAMPLE_IMPORTED = [
    { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'All activity types' },
    { name: 'Asia Measure Data Point Data 1', size: '999.5mb', type: 'All activity types' },
    { name: 'North America Measure Data Point Data 1', size: '999.5mb', type: 'Electricity only' },
    { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' }
  ];

  // Step 2 (columns cleanup) state
  var step1Tab = 'layouts';
  var savedSections = [];
  var SAMPLE_SECTIONS = [
    { range: 'A1:E15' },
    { range: 'P1:R15' }
  ];

  var SAMPLE_COLUMNS = [
    {
      name: 'Date',
      bestMatches: [
        { value: 'final-date', label: 'Final date', desc: 'Date on which the campaign is deemed complete' }
      ],
      otherOptions: [
        { value: 'report-date', label: 'Report date', desc: 'Date when the final report is due' },
        { value: 'start-date', label: 'Start date', desc: 'Date on which the campaign is executed' }
      ],
      selected: ''
    },
    {
      name: 'Diesl',
      bestMatches: [
        { value: 'diesel-fuel', label: 'Diesel fuel', desc: 'Fuels that work with no-spark Diesel engines' }
      ],
      otherOptions: [
        { value: 'biodiesel', label: 'Biodiesel', desc: 'Diesel fuel derived from biological sources, often fats' }
      ],
      selected: ''
    }
  ];

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function openWizard() {
    currentStep = 0;
    uploadedFiles = [];
    importedFiles = [];
    step1Tab = 'layouts';
    savedSections = [];
    SAMPLE_COLUMNS.forEach(function (c) { c.selected = ''; });
    render();
    overlay.classList.add('upload-wiz-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('upload-wiz-overlay--open');
    document.body.style.overflow = '';
  }

  window.openUploadWizard = openWizard;
  window.closeUploadWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWizard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('upload-wiz-overlay--open')) closeWizard();
  });
  discardLink.addEventListener('click', function (e) {
    e.preventDefault();
    closeWizard();
  });

  backBtn.addEventListener('click', function () {
    if (currentStep > 0) {
      currentStep--;
      render();
    } else {
      closeWizard();
      if (typeof window.openActivityDataSetupModal === 'function') {
        window.openActivityDataSetupModal();
      }
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentStep < 2) {
      currentStep++;
      render();
    }
  });

  stepBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var s = parseInt(btn.getAttribute('data-step'), 10);
      if (!isNaN(s) && s >= 0 && s <= 2) {
        currentStep = s;
        render();
      }
    });
  });

  function updateStepTabs() {
    stepBtns.forEach(function (btn) {
      var s = parseInt(btn.getAttribute('data-step'), 10);
      btn.classList.toggle('upload-wiz-step--active', s === currentStep);
    });
  }

  function updateFooter() {
    backBtn.textContent = 'Back';
    if (currentStep === 2) {
      nextBtn.textContent = 'Finish';
    } else if (currentStep === 1) {
      nextBtn.textContent = 'Review';
    } else {
      nextBtn.textContent = 'Next: add emissions files';
    }
  }

  function updateModalWidth() {
    wiz.classList.toggle('upload-wiz--wide', currentStep === 1);
  }

  // ========================================
  // STEP 0 — Add activity files
  // ========================================

  function addSampleFiles() {
    var names = [
      'Southern Europe Measure Data Point Data 1',
      'Asia Measure Data Point Data 1',
      'North America Measure Data Point Data 1',
      'East Africa Measure Data Point Data 1'
    ];
    names.forEach(function (n) {
      uploadedFiles.push({ name: n, size: '999.5mb', type: 'All activity types' });
    });
    renderStep0();
  }

  function removeFile(list, idx) {
    list.splice(idx, 1);
    renderStep0();
  }

  function buildFileListHTML(files, listId) {
    if (!files.length) {
      return '<div class="upload-wiz-file-list"><div class="upload-wiz-empty-row">No files currently imported from other projects</div></div>';
    }
    var html = '<div class="upload-wiz-file-list">';
    files.forEach(function (f, i) {
      var typeOptions = '';
      ACTIVITY_TYPES.forEach(function (t) {
        typeOptions += '<option' + (f.type === t ? ' selected' : '') + '>' + esc(t) + '</option>';
      });
      html +=
        '<div class="upload-wiz-file-row" data-list="' + listId + '" data-index="' + i + '">' +
          '<span class="upload-wiz-file-name">' + esc(f.name) + '</span>' +
          '<span class="upload-wiz-file-size">' + esc(f.size) + '</span>' +
          '<span class="upload-wiz-file-type"><select>' + typeOptions + '</select></span>' +
          '<button type="button" class="upload-wiz-file-menu" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderStep0() {
    var html = '';

    html += '<p class="upload-wiz-desc">Add your activity files here by uploading a spreadsheet/CSV, importing it from another project, or typing in your own field. If you\'re not familiar with what this document looks like, we wrote <a href="#">a guide for you here</a>.</p>';
    html += '<p class="upload-wiz-hint">If your files is running into validation errors, try entering your data into our downloadable excel template</p>';

    html += '<div class="upload-wiz-section">';
    html += '<div class="upload-wiz-section-header">';
    html += '<span class="upload-wiz-section-title">Uploaded</span>';
    html += '<div class="upload-wiz-section-actions">';
    html += '<a href="#" data-action="type-own">A Type in your own field</a>';
    html += '<a href="#" data-action="add-more">+ Add files</a>';
    html += '</div>';
    html += '</div>';

    if (uploadedFiles.length === 0) {
      html +=
        '<div class="upload-wiz-dropzone" data-action="dropzone">' +
          '<div class="upload-wiz-dropzone-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>' +
          '<div class="upload-wiz-dropzone-text">Drop your Activity files here, or <a data-action="browse">browse</a></div>' +
          '<div class="upload-wiz-dropzone-meta">Supports: pdf, xls, json, xml, csv<br>Max file size 100MB</div>' +
        '</div>';
    } else {
      html += buildFileListHTML(uploadedFiles, 'uploaded');
    }
    html += '</div>';

    html += '<div class="upload-wiz-section">';
    html += '<div class="upload-wiz-section-header">';
    html += '<span class="upload-wiz-section-title">From other projects</span>';
    html += '<div class="upload-wiz-section-actions">';
    html += '<a href="#" class="upload-wiz-import-toggle" data-action="import-toggle">Import data from other projects <i class="fa-solid fa-chevron-down"></i></a>';
    html += '</div>';
    html += '</div>';
    html += buildFileListHTML(importedFiles, 'imported');
    html += '</div>';

    bodyEl.innerHTML = html;
    bindStep0Events();
  }

  function bindStep0Events() {
    var dropzone = bodyEl.querySelector('[data-action="dropzone"]');
    if (dropzone) {
      dropzone.addEventListener('click', addSampleFiles);
      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropzone.classList.add('upload-wiz-dropzone--active');
      });
      dropzone.addEventListener('dragleave', function () {
        dropzone.classList.remove('upload-wiz-dropzone--active');
      });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropzone.classList.remove('upload-wiz-dropzone--active');
        addSampleFiles();
      });
    }

    bodyEl.querySelectorAll('[data-action="add-more"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        addSampleFiles();
      });
    });

    bodyEl.querySelectorAll('[data-action="browse"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        addSampleFiles();
      });
    });

    bodyEl.querySelectorAll('[data-action="import-toggle"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (importedFiles.length === 0) {
          importedFiles = SAMPLE_IMPORTED.map(function (f) { return { name: f.name, size: f.size, type: f.type }; });
        } else {
          importedFiles = [];
        }
        renderStep0();
      });
    });

    bodyEl.querySelectorAll('.upload-wiz-file-menu').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('.upload-wiz-file-row');
        var listId = row.getAttribute('data-list');
        var idx = parseInt(row.getAttribute('data-index'), 10);
        if (listId === 'uploaded') removeFile(uploadedFiles, idx);
        else if (listId === 'imported') removeFile(importedFiles, idx);
      });
    });
  }

  // ========================================
  // STEP 1 — Columns cleanup
  // ========================================

  function renderStep1() {
    var html = '';

    html += '<div class="uw-s1-banner">';
    html += '<div class="uw-s1-banner-icon"><i class="fa-light fa-circle-info"></i></div>';
    html += '<div class="uw-s1-banner-text">';
    html += '<p>For accurate calculations, your data columns need to conform to our standard data set. We found unclear columns/layouts in your data that doesn\'t match our standard set, please reconcile the items below.</p>';
    html += '<p>Your original data will be preserved in our records and will not be lost.</p>';
    html += '</div>';
    html += '</div>';

    html += '<div class="uw-s1-tabs">';
    html += '<button type="button" class="uw-s1-tab' + (step1Tab === 'layouts' ? ' uw-s1-tab--active' : '') + '" data-s1tab="layouts"><i class="fa-light fa-table-layout"></i> Unrecognized column layouts</button>';
    html += '<button type="button" class="uw-s1-tab' + (step1Tab === 'columns' ? ' uw-s1-tab--active' : '') + '" data-s1tab="columns"><i class="fa-light fa-table-columns"></i> Columns</button>';
    html += '</div>';

    if (step1Tab === 'layouts') {
      html += renderLayoutsTab();
    } else {
      html += renderColumnsTab();
    }

    bodyEl.innerHTML = html;
    bindStep1Events();
  }

  function renderLayoutsTab() {
    var html = '';
    html += '<div class="uw-s1-split">';

    html += '<div class="uw-s1-left">';
    if (savedSections.length === 0) {
      html += '<p class="uw-s1-left-desc">We\'re having trouble identifying where the relevant data lives in your spreadsheet. Please help us by selecting a section on the right to capture</p>';
      html += '<div class="uw-s1-select-field"><span class="uw-s1-select-text">No sections selected</span></div>';
    } else {
      html += '<div class="uw-s1-section-list">';
      savedSections.forEach(function (s, i) {
        html += '<div class="uw-s1-section-item" data-idx="' + i + '">';
        html += '<span class="uw-s1-section-range">' + esc(s.range) + '</span>';
        html += '<button type="button" class="uw-s1-section-remove" data-idx="' + i + '" title="Remove"><i class="fa-light fa-trash-can"></i></button>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div class="uw-s1-save-actions">';
    html += '<button type="button" class="btn btn-sm btn-outline uw-s1-save-btn" data-action="save-block" disabled><i class="fa-light fa-floppy-disk"></i> Save block</button>';
    html += '<button type="button" class="btn btn-sm btn-outline uw-s1-save-btn" data-action="save-headers" disabled><i class="fa-light fa-floppy-disk"></i> Save with headers</button>';
    html += '</div>';

    html += '</div>';

    html += '<div class="uw-s1-right">';
    html += '<div class="uw-s1-parser-container" id="ep-container"></div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderColumnsTab() {
    var html = '';
    html += '<div class="uw-s1-columns">';

    SAMPLE_COLUMNS.forEach(function (col, ci) {
      html += '<div class="uw-s1-col-card">';
      html += '<div class="uw-s1-col-name">' + esc(col.name) + '</div>';
      html += '<div class="uw-s1-col-options">';

      html += '<div class="uw-s1-col-group-label">Best matches in our standard data</div>';
      col.bestMatches.forEach(function (opt) {
        var checked = col.selected === opt.value ? ' checked' : '';
        html += '<label class="uw-s1-col-option">';
        html += '<input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '">';
        html += '<span class="uw-s1-col-option-label">' + esc(opt.label) + '</span>';
        html += '<span class="uw-s1-col-option-desc">' + esc(opt.desc) + '</span>';
        html += '</label>';
      });

      html += '<div class="uw-s1-col-group-label uw-s1-col-group-label--other">Other options</div>';
      col.otherOptions.forEach(function (opt) {
        var checked = col.selected === opt.value ? ' checked' : '';
        html += '<label class="uw-s1-col-option">';
        html += '<input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '">';
        html += '<span class="uw-s1-col-option-label">' + esc(opt.label) + '</span>';
        html += '<span class="uw-s1-col-option-desc">' + esc(opt.desc) + '</span>';
        html += '</label>';
      });

      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function bindStep1Events() {
    bodyEl.querySelectorAll('.uw-s1-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        step1Tab = btn.getAttribute('data-s1tab');
        renderStep1();
      });
    });

    bodyEl.querySelectorAll('.uw-s1-section-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        savedSections.splice(idx, 1);
        renderStep1();
      });
    });

    var saveBlockBtn = bodyEl.querySelector('[data-action="save-block"]');
    if (saveBlockBtn) {
      saveBlockBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.hasSelection()) {
          var block = window.ExcelParser.saveBlock();
          if (block) {
            savedSections.push({ range: block.rangeLabel, block: block });
            renderStep1();
          }
        }
      });
    }

    var saveHeadersBtn = bodyEl.querySelector('[data-action="save-headers"]');
    if (saveHeadersBtn) {
      saveHeadersBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.canSaveWithHeader()) {
          var block = window.ExcelParser.saveBlockWithHeader();
          if (block) {
            savedSections.push({ range: block.rangeLabel, block: block });
            renderStep1();
          }
        }
      });
    }

    bodyEl.querySelectorAll('input[type="radio"][data-col]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var ci = parseInt(radio.getAttribute('data-col'), 10);
        SAMPLE_COLUMNS[ci].selected = radio.value;
      });
    });

    // Initialize parser in the right panel (layouts tab only)
    if (step1Tab === 'layouts') {
      var epContainer = bodyEl.querySelector('#ep-container');
      if (epContainer && window.ExcelParser) {
        window.ExcelParser.init(epContainer, {
          onSelectionChange: function (sel) {
            updateSaveButtonStates();
          }
        });
      }
    }
  }

  function updateSaveButtonStates() {
    var saveBlockBtn = bodyEl.querySelector('[data-action="save-block"]');
    var saveHeadersBtn = bodyEl.querySelector('[data-action="save-headers"]');
    if (!window.ExcelParser) return;
    var hasSel = window.ExcelParser.hasSelection();
    var canHeader = window.ExcelParser.canSaveWithHeader();
    if (saveBlockBtn) saveBlockBtn.disabled = !hasSel;
    if (saveHeadersBtn) saveHeadersBtn.disabled = !canHeader;
  }

  // ========================================
  // STEP 2 — Review / collaborate
  // ========================================

  function renderStep2() {
    bodyEl.innerHTML = '<div class="upload-wiz-placeholder">Review / collaborate \u2014 coming soon</div>';
  }

  // ========================================
  // RENDER
  // ========================================

  function render() {
    updateStepTabs();
    updateFooter();
    updateModalWidth();
    if (currentStep === 0) renderStep0();
    else if (currentStep === 1) renderStep1();
    else renderStep2();
  }

  render();
})();
