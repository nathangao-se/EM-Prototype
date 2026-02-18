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

  // Mutable state: uploaded files and imported files
  var uploadedFiles = [];
  var importedFiles = [];

  var SAMPLE_IMPORTED = [
    { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'All activity types' },
    { name: 'Asia Measure Data Point Data 1', size: '999.5mb', type: 'All activity types' },
    { name: 'North America Measure Data Point Data 1', size: '999.5mb', type: 'Electricity only' },
    { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' }
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
    backBtn.textContent = currentStep === 0 ? 'Back' : 'Back';
    if (currentStep === 2) {
      nextBtn.textContent = 'Finish';
    } else {
      nextBtn.textContent = 'Next: add emissions files';
    }
  }

  // Simulated file add (demo: adds sample files)
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

    // Uploaded section
    html += '<div class="upload-wiz-section">';
    html += '<div class="upload-wiz-section-header">';
    html += '<span class="upload-wiz-section-title">Uploaded</span>';
    html += '<div class="upload-wiz-section-actions">';
    if (uploadedFiles.length === 0) {
      html += '<a href="#" data-action="type-own">A Type in your own field</a>';
    }
    html += '<a href="#" data-action="add-more">+ Add more files</a>';
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

    // From other projects section
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
    // Dropzone / browse / add-more all simulate adding files
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

    // Kebab menu: remove file on click (simple demo)
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

  function renderStep1() {
    bodyEl.innerHTML = '<div class="upload-wiz-placeholder">Initial cleanup — coming soon</div>';
  }

  function renderStep2() {
    bodyEl.innerHTML = '<div class="upload-wiz-placeholder">Review / collaborate — coming soon</div>';
  }

  function render() {
    updateStepTabs();
    updateFooter();
    if (currentStep === 0) renderStep0();
    else if (currentStep === 1) renderStep1();
    else renderStep2();
  }

  render();
})();
