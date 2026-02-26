// ========================================
// UPLOAD WIZARD — Step 0: Add activity files
// ========================================

(function () {
  var ctx = window._uwCtx;
  if (!ctx) return;

  var esc = ctx.esc;
  var overlay = ctx.overlay;
  var bodyEl = ctx.bodyEl;

  // ── Step 0 constants (local) ────────────────────────────────────

  var FORM_SCOPES = [
    'Scope 1 | Category 1: Stationary combustion',
    'Scope 1 | Category 2: Mobile combustion',
    'Scope 2 | Category 1: Purchased electricity',
    'Scope 3 | Category 6: Business travel',
    'Scope 3 | Category 7: Employee commuting'
  ];
  var FORM_ACT_TYPES = ['Electricity', 'Natural gas', 'Diesel', 'Gasoline', 'Business travel — air', 'Business travel — rail', 'Employee commuting'];
  var FORM_EST_METHODS = ['Spend-based', 'Activity-based', 'Average-data', 'Supplier-specific', 'Hybrid'];
  var FORM_ENTITIES = ['Aiken', 'Chicago HQ', 'Detroit Plant', 'London Office', 'Frankfurt DC', 'Paris Office'];
  var FORM_UNITS = ['kWh', 'MWh', 'MMBtu', 'Gallons', 'Litres', 'Therms', 'kg', 'tonnes', 'USD', 'EUR', 'GBP'];

  // ── Helpers ─────────────────────────────────────────────────────

  function addSampleFiles() {
    var names = [
      'Southern Europe Measure Data Point Data 1',
      'Asia Measure Data Point Data 1',
      'North America Measure Data Point Data 1',
      'East Africa Measure Data Point Data 1'
    ];
    names.forEach(function (n) {
      ctx.uploadedFiles.push({ name: n, size: '999.5mb', type: 'All activity types' });
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
      ctx.ACTIVITY_TYPES.forEach(function (t) {
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

  function buildSelectOptions(items) {
    var h = '<option value="">Select...</option>';
    items.forEach(function (v) { h += '<option value="' + esc(v) + '">' + esc(v) + '</option>'; });
    return h;
  }

  // ── Manual entry form ───────────────────────────────────────────

  function buildManualEntryForm() {
    var html = '';

    html += '<div class="uw-tpl-header">';
    html += '<a href="#" class="uw-tpl-done-link" data-action="manual-done"><i class="fa-solid fa-arrow-left"></i> Done</a>';
    html += '<span class="uw-tpl-header-title">Add your own field</span>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label"><span class="uw-s0-req">*</span> Business Entity <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<select class="uw-s0-select uw-s0-input-track">' + buildSelectOptions(FORM_ENTITIES) + '</select>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label"><span class="uw-s0-req">*</span> Scope / Category <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<select class="uw-s0-select uw-s0-input-track">' + buildSelectOptions(FORM_SCOPES) + '</select>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label"><span class="uw-s0-req">*</span> Activity date <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<div class="uw-s0-date-row">';
    html += '<input type="date" class="uw-s0-input uw-s0-date uw-s0-input-track">';
    html += '<span class="uw-s0-date-to">to</span>';
    html += '<input type="date" class="uw-s0-input uw-s0-date uw-s0-input-track">';
    html += '</div>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label"><span class="uw-s0-req">*</span> Activity Type <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<select class="uw-s0-select uw-s0-input-track">' + buildSelectOptions(FORM_ACT_TYPES) + '</select>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label">Estimation Method <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<select class="uw-s0-select uw-s0-input-track">' + buildSelectOptions(FORM_EST_METHODS) + '</select>';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label">Region <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<input type="text" class="uw-s0-input uw-s0-input-track" placeholder="Enter value">';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label">Origin <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<input type="text" class="uw-s0-input uw-s0-input-track" placeholder="Enter value">';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label">Destination <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';
    html += '<input type="text" class="uw-s0-input uw-s0-input-track" placeholder="Enter value">';
    html += '</div>';

    html += '<div class="uw-s0-field">';
    html += '<label class="uw-s0-label"><span class="uw-s0-req">*</span> Values – enter at least one data type <i class="fa-solid fa-circle-info uw-s0-info"></i></label>';

    var valueTypes = [
      { label: 'Usage value', placeholder: 'Enter usage value' },
      { label: 'Distance value', placeholder: 'Enter distance value' },
      { label: 'Spend value', placeholder: 'Enter spend value' }
    ];
    valueTypes.forEach(function (v) {
      html += '<div class="uw-s0-value-group">';
      html += '<span class="uw-s0-value-label">' + v.label + '</span>';
      html += '<div class="uw-s0-value-row">';
      html += '<input type="number" class="uw-s0-input uw-s0-value-input uw-s0-input-track" placeholder="' + v.placeholder + '">';
      html += '<select class="uw-s0-select uw-s0-value-unit uw-s0-input-track">' + buildSelectOptions(FORM_UNITS) + '</select>';
      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  // ── Form dirty / clear / sync ───────────────────────────────────

  function isFormDirty() {
    var dirty = false;
    bodyEl.querySelectorAll('.uw-s0-input-track').forEach(function (el) {
      if (el.tagName === 'SELECT') {
        if (el.value !== '') dirty = true;
      } else {
        if (el.value !== '') dirty = true;
      }
    });
    return dirty;
  }

  function clearForm() {
    bodyEl.querySelectorAll('.uw-s0-input-track').forEach(function (el) {
      if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      } else {
        el.value = '';
      }
    });
    syncFormFooter();
  }

  function syncFormFooter() {
    var dirty = isFormDirty();
    var clearBtn = overlay.querySelector('.uw-s0-clear-btn');
    var doneBtn = overlay.querySelector('.uw-s0-done-btn');
    if (clearBtn) clearBtn.style.display = dirty ? '' : 'none';
    if (doneBtn) doneBtn.textContent = dirty ? 'Save' : 'Done';
  }

  // ── Template catalog ────────────────────────────────────────────

  function renderTemplateCatalog() {
    var html = '';
    html += '<div class="uw-tpl-header">';
    html += '<a href="#" class="uw-tpl-done-link" data-action="tpl-done"><i class="fa-solid fa-arrow-left"></i> Done</a>';
    html += '<span class="uw-tpl-header-title">Download templates</span>';
    html += '</div>';
    var lastSection = '';
    ctx.TEMPLATE_CATALOG.forEach(function (t, i) {
      if (t.section !== lastSection) {
        if (lastSection) html += '</div>';
        lastSection = t.section;
        var countInSection = ctx.TEMPLATE_CATALOG.filter(function (x) { return x.section === t.section; }).length;
        html += '<div class="uw-tpl-section">';
        html += '<div class="uw-tpl-section-header">';
        html += '<span class="uw-tpl-section-title">' + esc(t.section) + '</span>';
        html += '<span class="uw-tpl-section-count">' + countInSection + ' template' + (countInSection !== 1 ? 's' : '') + '</span>';
        html += '</div>';
      }
      html += '<div class="uw-tpl-row" data-tpl-idx="' + i + '">';
      html += '<div class="uw-tpl-row-top">';
      html += '<span class="uw-tpl-row-title">' + esc(t.title) + '</span>';
      if (t.api) html += '<span class="uw-tpl-badge-api">API</span>';
      html += '<span class="uw-tpl-row-subtitle">' + esc(t.subtitle) + '</span>';
      html += '</div>';
      html += '<div class="uw-tpl-row-desc">' + esc(t.desc) + '</div>';
      html += '<div class="uw-tpl-row-dl-feedback" style="display:none"><i class="fa-solid fa-check"></i> Downloaded</div>';
      html += '</div>';
    });
    if (lastSection) html += '</div>';
    return html;
  }

  function bindTemplateCatalogEvents() {
    bodyEl.querySelectorAll('.uw-tpl-row').forEach(function (row) {
      row.addEventListener('click', function () {
        if (row.classList.contains('uw-tpl-row--downloading')) return;
        row.classList.add('uw-tpl-row--downloading');
        var feedback = row.querySelector('.uw-tpl-row-dl-feedback');
        if (feedback) feedback.style.display = '';
        setTimeout(function () {
          row.classList.remove('uw-tpl-row--downloading');
          if (feedback) feedback.style.display = 'none';
        }, 1500);
      });
    });

    var doneBtn = overlay.querySelector('.uw-s0-done-btn');
    if (doneBtn) {
      doneBtn.addEventListener('click', function () {
        ctx.stepDirection = 'back';
        ctx.showTemplateList = false;
        ctx.render();
      });
    }

    bodyEl.querySelectorAll('[data-action="tpl-done"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        ctx.stepDirection = 'back';
        ctx.showTemplateList = false;
        ctx.render();
      });
    });
  }

  // ── Render & bind ───────────────────────────────────────────────

  function renderStep0() {
    var html = '';

    if (ctx.showTemplateList) {
      html += renderTemplateCatalog();
      bodyEl.innerHTML = html;
      ctx.updateFooterMode();
      var doneBtn = overlay.querySelector('.uw-s0-done-btn');
      if (doneBtn) doneBtn.textContent = 'Done';
      bindTemplateCatalogEvents();
      return;
    }

    var isVersionB = window.uploadWizardVersion === 'b';

    if (ctx.showManualEntry) {
      html += buildManualEntryForm();
    } else {
      if (isVersionB) {
        html += '<p class="upload-wiz-desc">Add your activity files here by uploading a spreadsheet/CSV, importing it from another project, or typing in your own field. If you\'re not familiar with what this document looks like, we wrote <a href="#">a guide for you here</a>.</p>';
        html += '<p class="upload-wiz-hint">If your files is running into validation errors, try entering your data into our <a href="#" class="uw-tpl-link" data-action="show-templates">downloadable excel template</a></p>';
      } else {
        html += '<p class="upload-wiz-desc">First, download the appropriate <a href="#" class="uw-tpl-link" data-action="show-templates">excel templates</a></p>';
        html += '<p class="upload-wiz-desc">Then, after completing it, upload your activity files below</p>';
      }

      html += '<div class="upload-wiz-section">';
      html += '<div class="upload-wiz-section-header">';
      html += '<span class="upload-wiz-section-title">Uploaded files</span>';
      html += '<div class="upload-wiz-section-actions">';
      if (isVersionB) {
        html += '<a href="#" data-action="type-own"><i class="fa-solid fa-pen-to-square"></i> Add your own field</a>';
      }
      if (isVersionB || ctx.uploadedFiles.length > 0) {
        html += '<a href="#" data-action="add-more">+ Upload files</a>';
      }
      html += '</div>';
      html += '</div>';

      if (ctx.uploadedFiles.length === 0) {
        html +=
          '<div class="upload-wiz-dropzone" data-action="dropzone">' +
            '<div class="upload-wiz-dropzone-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>' +
            '<div class="upload-wiz-dropzone-text">Drop your Activity files here, or <a data-action="browse">browse</a></div>' +
            '<div class="upload-wiz-dropzone-meta">Supports: pdf, xls, json, xml, csv<br>Max file size 100MB</div>' +
          '</div>';
      } else {
        html += buildFileListHTML(ctx.uploadedFiles, 'uploaded');
      }
      html += '</div>';

      if (isVersionB) {
        html += '<div class="upload-wiz-section">';
        html += '<div class="upload-wiz-section-header">';
        html += '<span class="upload-wiz-section-title">From other projects</span>';
        html += '<div class="upload-wiz-section-actions">';
        html += '<a href="#" class="upload-wiz-import-toggle" data-action="import-toggle">Import data from other projects <i class="fa-solid fa-chevron-down"></i></a>';
        html += '</div>';
        html += '</div>';
        html += buildFileListHTML(ctx.importedFiles, 'imported');
        html += '</div>';
      }
    }

    bodyEl.innerHTML = html;
    ctx.updateFooterMode();
    bindStep0Events();
  }

  function bindStep0Events() {
    if (ctx.showManualEntry) {
      bodyEl.querySelectorAll('.uw-s0-input-track').forEach(function (el) {
        el.addEventListener('input', syncFormFooter);
        el.addEventListener('change', syncFormFooter);
      });

      var clearBtn = overlay.querySelector('.uw-s0-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
          e.preventDefault();
          clearForm();
        });
      }

      var doneBtn = overlay.querySelector('.uw-s0-done-btn');
      if (doneBtn) {
        doneBtn.addEventListener('click', function () {
          ctx.stepDirection = 'back';
          ctx.showManualEntry = false;
          ctx.render();
        });
      }

      bodyEl.querySelectorAll('[data-action="manual-done"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          ctx.stepDirection = 'back';
          ctx.showManualEntry = false;
          ctx.render();
        });
      });
      return;
    }

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

    bodyEl.querySelectorAll('[data-action="type-own"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        ctx.stepDirection = 'forward';
        ctx.showManualEntry = true;
        ctx.render();
      });
    });

    bodyEl.querySelectorAll('[data-action="show-templates"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        ctx.stepDirection = 'forward';
        ctx.showTemplateList = true;
        ctx.render();
      });
    });

    bodyEl.querySelectorAll('[data-action="import-toggle"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (ctx.importedFiles.length === 0) {
          ctx.importedFiles = ctx.SAMPLE_IMPORTED.map(function (f) { return { name: f.name, size: f.size, type: f.type }; });
        } else {
          ctx.importedFiles = [];
        }
        renderStep0();
      });
    });

    bodyEl.querySelectorAll('.upload-wiz-file-menu').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('.upload-wiz-file-row');
        var listId = row.getAttribute('data-list');
        var idx = parseInt(row.getAttribute('data-index'), 10);
        if (listId === 'uploaded') removeFile(ctx.uploadedFiles, idx);
        else if (listId === 'imported') removeFile(ctx.importedFiles, idx);
      });
    });
  }

  ctx.renderStep0 = renderStep0;
})();
