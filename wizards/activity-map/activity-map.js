// ========================================
// DATA MANAGEMENT — page content (rendered via page transition from project bar)
// ========================================

(function () {

  var esc = window.DomUtils.esc;

  // Columns normalize modal delegation
  document.addEventListener('click', function (e) {
    var colLink = e.target.closest('[data-action="open-columns-modal"]');
    if (colLink) {
      e.preventDefault();
      if (typeof window.openColumnsNormalizeModal === 'function') {
        window.openColumnsNormalizeModal();
      }
    }
  });

  // ========== CATEGORY OVERVIEW — scope breakdown drill-down ==========

  var SCOPE_ROWS = [
    { label: 'Scope 1',   cls: 'dm-scope-1', records: '156,302', entities: 483, completion: 75 },
    { label: 'Scope 2',   cls: 'dm-scope-2', records: '234,358', entities: 245, completion: 75 },
    { label: 'Scope 3',   cls: 'dm-scope-3', records: '64,022',  entities: 80,  completion: 50 },
    { label: 'Scope 3.1', cls: 'dm-scope-3', records: '8,493',   entities: 74,  completion: 50 },
    { label: 'Scope 3.2', cls: 'dm-scope-3', records: '12,300',  entities: 82,  completion: 60 },
    { label: 'Scope 3.3', cls: 'dm-scope-3', records: '15,678',  entities: 90,  completion: 55 },
    { label: 'Scope 3.4', cls: 'dm-scope-3', records: '10,124',  entities: 78,  completion: 65 },
    { label: 'Scope 3.5', cls: 'dm-scope-3', records: '5,432',   entities: 88,  completion: 70 },
    { label: 'Scope 3.6', cls: 'dm-scope-3', records: '3,210',   entities: 76,  completion: 45 },
    { label: 'Scope 3.7', cls: 'dm-scope-3', records: '9,876',   entities: 85,  completion: 55 },
    { label: 'Scope 3.8', cls: 'dm-scope-3', records: '4,321',   entities: 93,  completion: 50 }
  ];

  function buildCategoryLeftPanel(activeLabel) {
    var html = '<div class="dm-filter-card">';

    html += '<div class="dm-cat-header">';
    html += '<button class="dm-cat-back" data-action="cat-back"><i class="fa-solid fa-chevron-left"></i> Back</button>';
    html += '<div class="dm-cat-display">';
    html += '<span class="dm-cat-display-label">Display:</span>';
    html += '<select class="dm-select"><option>Scope</option></select>';
    html += '</div>';
    html += '</div>';

    html += '<table class="dm-cat-table">';
    html += '<thead><tr><th>Scope</th><th>Records</th><th>Entity</th><th>Completion</th></tr></thead>';
    html += '<tbody>';
    SCOPE_ROWS.forEach(function (row) {
      var active = activeLabel === row.label ? ' dm-cat-row--active' : '';
      html += '<tr class="dm-cat-row' + active + '" data-action="select-scope" data-scope="' + esc(row.label) + '">';
      html += '<td><span class="dm-scope-pill ' + row.cls + '">' + esc(row.label) + '</span></td>';
      html += '<td class="dm-cat-num">' + esc(row.records) + '</td>';
      html += '<td class="dm-cat-num">' + esc(String(row.entities)) + '</td>';
      html += '<td class="dm-cat-completion">';
      html += '<div class="dm-cat-bar"><div class="dm-cat-bar-fill" style="width:' + row.completion + '%"></div></div>';
      html += '<span class="dm-cat-pct">' + row.completion + '%</span>';
      html += '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    html += '</div>';
    return html;
  }

  function filterRowsByScope(scopeLabel) {
    var scopeNum = parseFloat(scopeLabel.replace('Scope ', ''));
    return TABLE_ROWS.filter(function (r) {
      var s = parseFloat(r[2]);
      if (scopeNum === 3) return s >= 3;
      return s === scopeNum;
    });
  }

  function rowHasError(r) {
    for (var i = 0; i < REQUIRED_COL_IDX.length; i++) {
      if (!r[REQUIRED_COL_IDX[i]].trim()) return true;
    }
    return false;
  }

  function buildTableHTML(rows) {
    var html = '<thead><tr>';
    html += '<th class="dm-col-flag"></th>';
    html += '<th class="dm-col-check"><input type="checkbox" class="dm-checkbox dm-checkbox-all"></th>';
    TABLE_COLS.forEach(function (col) { html += '<th>' + esc(col) + '</th>'; });
    html += '<th class="dm-col-actions"></th></tr></thead><tbody>';
    rows.forEach(function (r) {
      var hasErr = rowHasError(r);
      html += '<tr>';
      html += '<td class="dm-col-flag">';
      if (hasErr) html += '<i class="fa-solid fa-triangle-exclamation dm-flag-error"></i>';
      html += '</td>';
      html += '<td class="dm-col-check"><input type="checkbox" class="dm-checkbox"></td>';
      r.forEach(function (cell, ci) {
        var isEmpty = REQUIRED_COL_IDX.indexOf(ci) !== -1 && !cell.trim();
        var ctrl = COL_CONTROL[ci] || '';
        if (isEmpty) {
          html += '<td class="dm-cell-error" data-row-id="' + esc(r[0]) + '" data-col-idx="' + ci + '"';
          if (ctrl) html += ' data-control="' + ctrl + '"';
          html += '><div class="dm-cell-error-inner"><span class="dm-cell-error-label">&mdash;</span></div></td>';
        } else {
          html += '<td>' + esc(cell) + '</td>';
        }
      });
      html += '<td class="dm-col-actions"><button class="dm-more"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>';
      html += '</tr>';
    });
    html += '</tbody>';
    return html;
  }

  function renderScopeTable(scopeLabel, rightPanel) {
    var html = '';
    html += '<div class="dm-table-wrap">';
    html += '<h3 class="dm-view-title">' + esc(scopeLabel) + ' activities</h3>';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<button class="dm-btn dm-btn-outline"><i class="fa-solid fa-sliders"></i> Filter</button>';
    html += '</div>';
    html += '<div class="dm-table-scroll">';
    html += '<table class="dm-table">';
    html += buildTableHTML(TABLE_ROWS);
    html += '</table>';
    html += '</div>';
    html += '</div>';
    rightPanel.innerHTML = html;
  }

  function showCategoryView(contextEl, activeScope) {
    var layout = contextEl ? contextEl.closest('.dm-layout') : document.querySelector('.pt-page-section .dm-layout') || document.querySelector('.dm-layout');
    if (!layout) return;
    var leftPanel = layout.querySelector('.dm-left');
    var rightPanel = layout.querySelector('.dm-right');
    if (!leftPanel || !rightPanel) return;

    var scope = activeScope || SCOPE_ROWS[0].label;
    leftPanel.innerHTML = buildCategoryLeftPanel(scope);
    renderScopeTable(scope, rightPanel);
  }

  function restoreDataListView(rightPanel, rows, title) {
    if (!rightPanel) return;
    var data = rows || TABLE_ROWS;
    var heading = title || 'All data list';
    var html = '';
    html += '<div class="dm-table-wrap">';
    html += '<h3 class="dm-view-title">' + heading + '</h3>';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<button class="dm-btn dm-btn-outline"><i class="fa-solid fa-sliders"></i> Filter</button>';
    html += '</div>';
    if (data.length === 0) {
      html += '<div class="dm-empty-state">No records available for this file.</div>';
    } else {
      html += '<div class="dm-table-scroll">';
      html += '<table class="dm-table">';
      html += buildTableHTML(data);
      html += '</table>';
      html += '</div>';
    }
    html += '</div>';
    rightPanel.innerHTML = html;
  }

  function restoreDefaultLeftPanel(contextEl) {
    var layout = contextEl ? contextEl.closest('.dm-layout') : document.querySelector('.pt-page-section .dm-layout') || document.querySelector('.dm-layout');
    if (!layout) return;
    var leftPanel = layout.querySelector('.dm-left');
    var rightPanel = layout.querySelector('.dm-right');
    if (!leftPanel) return;

    leftPanel.innerHTML = buildDefaultLeftPanel();
    restoreDataListView(rightPanel);
  }

  function buildDefaultLeftPanel() {
    var html = '';

    // ---- Unnormalized sections card (always on top) ----
    html += '<div class="dm-filter-card">';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<span class="dm-filter-title">Unnormalized Columns</span>';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '</div>';
    html += '<div class="dm-filter-meta-row">';
    html += '<span class="dm-filter-meta">6 instances</span>';
    html += '<a href="#" class="dm-filter-link" data-action="open-columns-modal">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<span class="dm-filter-title">Unnormalized data</span>';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '</div>';
    html += '<div class="dm-filter-meta-row">';
    html += '<span class="dm-filter-meta">1,249 records</span>';
    html += '<a href="#" class="dm-filter-link" data-action="open-normalize">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    // ---- Sort control ----
    html += '<div class="dm-sort-control">';
    html += '<div class="dm-sort-label">Sort</div>';
    html += '<div class="dm-sort-row">';
    html += '<div class="dm-segmented">';
    html += '<button class="dm-segmented-item' + (fileSortKey === 'name' ? ' dm-segmented-item--active' : '') + '" data-sort="name">Name</button>';
    html += '<button class="dm-segmented-item' + (fileSortKey === 'records' ? ' dm-segmented-item--active' : '') + '" data-sort="records">Records</button>';
    html += '<button class="dm-segmented-item' + (fileSortKey === 'uploaded' ? ' dm-segmented-item--active' : '') + '" data-sort="uploaded">Uploaded</button>';
    html += '</div>';
    html += '<button class="dm-sort-dir-btn" data-action="toggle-sort-dir"><i class="fa-solid ' + (fileSortAsc ? 'fa-arrow-up' : 'fa-arrow-down') + '"></i></button>';
    html += '</div>';
    html += '</div>';

    // ---- Files card ----
    html += '<div class="dm-filter-card">';

    var sortedIndices = getSortedFileIndices();
    sortedIndices.forEach(function (fi) {
      var f = FILE_ITEMS[fi];
      html += '<div class="dm-filter-row' + (activeFileIdx === fi ? ' dm-filter-row--active' : '') + '" data-action="select-file" data-file-idx="' + fi + '" style="cursor:pointer">';
      html += '<div class="dm-filter-content">';
      html += '<div class="dm-file-title">' + esc(f.name) + '</div>';
      html += '<div class="dm-file-meta">';
      html += '<span class="dm-file-time">' + esc(f.time) + '</span>';
      if (f.state === 'warning') {
        html += '<span class="dm-file-chip-warn"><i class="fa-solid fa-circle-exclamation"></i> ' + f.errors + ' errors / ' + esc(f.records) + ' recs</span>';
      } else if (f.state === 'failed') {
        html += '<span class="dm-file-chip-error"><i class="fa-solid fa-triangle-exclamation"></i> File did not load</span>';
      } else {
        html += '<span class="dm-file-stats">' + esc(f.records) + ' recs</span>';
      }
      html += '</div>';
      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function refreshFileList(contextEl) {
    var layout = contextEl ? contextEl.closest('.dm-layout') : document.querySelector('.pt-page-section .dm-layout') || document.querySelector('.dm-layout');
    if (!layout) return;
    var leftPanel = layout.querySelector('.dm-left');
    if (leftPanel) leftPanel.innerHTML = buildDefaultLeftPanel();
  }

  // File selection + sort + category overview click delegation
  document.addEventListener('click', function (e) {
    var segBtn = e.target.closest('.dm-segmented-item[data-sort]');
    if (segBtn) {
      var newKey = segBtn.getAttribute('data-sort');
      if (newKey !== fileSortKey) {
        fileSortKey = newKey;
        fileSortAsc = true;
      }
      refreshFileList(segBtn);
      return;
    }
    var dirBtn = e.target.closest('[data-action="toggle-sort-dir"]');
    if (dirBtn) {
      fileSortAsc = !fileSortAsc;
      refreshFileList(dirBtn);
      return;
    }
    var fileEl = e.target.closest('[data-action="select-file"]');
    if (fileEl) {
      e.preventDefault();
      selectFile(parseInt(fileEl.getAttribute('data-file-idx'), 10), fileEl);
      return;
    }
    var scopeRow = e.target.closest('[data-action="select-scope"]');
    if (scopeRow) {
      e.preventDefault();
      var scopeLabel = scopeRow.getAttribute('data-scope');
      showCategoryView(scopeRow, scopeLabel);
      return;
    }
    var back = e.target.closest('[data-action="cat-back"]');
    if (back) {
      e.preventDefault();
      restoreDefaultLeftPanel(back);
    }
  });

  // ========== TABLE DATA (from test.csv — Besana activity records) ==========
  var TABLE_COLS = window.SampleData.ACTIVITY_TABLE_COLS;
  var TABLE_ROWS = window.SampleData.ACTIVITY_TABLE_ROWS;

  // ========== FILE ITEMS — left-panel file cards ==========
  var FILE_ITEMS = [
    { name: 'North America Q4 2024.xlsx',  time: '15 mins ago', timeVal: 15,   records: '4.5k', recordsVal: 4500, errors: 120, state: 'warning', rows: [0, 14],  entity: 'Besana' },
    { name: 'Southern Europe FY2024.xlsx', time: '2 hrs ago',   timeVal: 120,  records: '3.2k', recordsVal: 3200, errors: 0,   state: 'ok',      rows: [14, 27], entity: 'Meridian' },
    { name: 'Asia Pacific Q4 2024.csv',    time: '1 day ago',   timeVal: 1440, records: '',     recordsVal: 0,    errors: 0,   state: 'failed',  rows: null,     entity: null },
    { name: 'East Africa 2024.xlsx',       time: '3 hrs ago',   timeVal: 180,  records: '1.8k', recordsVal: 1800, errors: 0,   state: 'ok',      rows: [27, 40], entity: 'Northwind' }
  ];

  var activeFileIdx = 0;
  var fileSortKey = 'name';
  var fileSortAsc = true;

  function getSortedFileIndices() {
    var indices = [];
    for (var i = 0; i < FILE_ITEMS.length; i++) indices.push(i);
    indices.sort(function (a, b) {
      var fa = FILE_ITEMS[a], fb = FILE_ITEMS[b];
      var cmp = 0;
      if (fileSortKey === 'name') {
        cmp = fa.name.localeCompare(fb.name);
      } else if (fileSortKey === 'records') {
        cmp = fa.recordsVal - fb.recordsVal;
      } else if (fileSortKey === 'uploaded') {
        cmp = fa.timeVal - fb.timeVal;
      }
      return fileSortAsc ? cmp : -cmp;
    });
    return indices;
  }

  // ========== ERROR DETECTION — required columns + control types ==========
  var REQUIRED_COL_NAMES = ['Activity Type','Fuel Type','Start Date','End Date','Record Type','Business Entity','Usage Value'];
  var REQUIRED_COL_IDX = [];
  TABLE_COLS.forEach(function (col, i) {
    if (REQUIRED_COL_NAMES.indexOf(col) !== -1) REQUIRED_COL_IDX.push(i);
  });

  var COL_CONTROL = {};
  TABLE_COLS.forEach(function (col, i) {
    if (['Business Entity','Activity Type','Record Type','Fuel Type'].indexOf(col) !== -1) COL_CONTROL[i] = 'dropdown';
    else if (['Start Date','End Date'].indexOf(col) !== -1) COL_CONTROL[i] = 'date';
    else if (col === 'Usage Value') COL_CONTROL[i] = 'number';
  });

  var DROPDOWN_OPTIONS = {
    'Business Entity': ['Besana','Meridian','Northwind','Cascade'],
    'Activity Type': ['Stationary Combustion','On-site Energy Generation','Mobile Combustion','Purchased Electricity','Steam Generation'],
    'Record Type': ['Estimate','Meter Reading','Invoice'],
    'Fuel Type': ['Refinery Gas','Liquefied Petroleum Gas','Landfill Gas','Natural Gas','Diesel','Petrol','Kerosene','Propane','Heating Oil','Furnace Oil','Fuel Oil','Coal Bituminous','Coal Anthracite','Compressed Natural Gas','Biodiesel','Biomass Wood','Butane','Gas Oil','Lubricant Oil','Geothermal','Wind','Photovoltaic Solar','Aviation Gasoline']
  };

  function getFileRows(idx) {
    var f = FILE_ITEMS[idx];
    if (!f || !f.rows) return [];
    var slice = [];
    for (var i = f.rows[0]; i < f.rows[1]; i++) {
      var row = TABLE_ROWS[i].slice();
      if (f.entity) row[1] = f.entity;
      slice.push(row);
    }
    return slice;
  }

  function selectFile(idx, contextEl) {
    var layout = contextEl ? contextEl.closest('.dm-layout') : document.querySelector('.dm-layout');
    if (!layout) return;
    var leftPanel = layout.querySelector('.dm-left');
    var rightPanel = layout.querySelector('.dm-right');
    if (!leftPanel || !rightPanel) return;

    activeFileIdx = idx;

    leftPanel.querySelectorAll('[data-action="select-file"]').forEach(function (el) {
      el.classList.toggle('dm-filter-row--active', parseInt(el.getAttribute('data-file-idx'), 10) === idx);
    });

    var rows, title;
    if (idx === -1) {
      rows = TABLE_ROWS;
      title = 'All data list';
    } else {
      rows = getFileRows(idx);
      title = esc(FILE_ITEMS[idx].name);
    }
    restoreDataListView(rightPanel, rows, title);
  }

  // ========== INLINE EDITING — click-to-fix error cells ==========

  function findRowByID(id) {
    for (var i = 0; i < TABLE_ROWS.length; i++) {
      if (TABLE_ROWS[i][0] === id) return TABLE_ROWS[i];
    }
    return null;
  }

  function formatDateFromInput(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return parseInt(p[1], 10) + '/' + parseInt(p[2], 10) + '/' + p[0].slice(-2);
  }

  function commitValue(td, rowId, colIdx, value) {
    var row = findRowByID(rowId);
    if (row) row[colIdx] = value;
    td.classList.remove('dm-cell-editing');
    td.classList.remove('dm-cell-error');
    td.classList.add('dm-cell-corrected');
    td.innerHTML = '<div class="dm-cell-corrected-inner">' + esc(value) + '</div>';
  }

  function revertCell(td) {
    td.classList.remove('dm-cell-editing');
    var ctrl = td.querySelector('.dm-inline-ctrl');
    if (ctrl) ctrl.remove();
    var inner = td.querySelector('.dm-cell-error-inner');
    if (inner) inner.style.display = '';
    var corrInner = td.querySelector('.dm-cell-corrected-inner');
    if (corrInner) corrInner.style.display = '';
  }

  function closeActivePopover() {
    var existing = document.querySelector('.dm-popover');
    if (existing) {
      var ownerTd = existing._ownerTd;
      existing.remove();
      if (ownerTd) revertCell(ownerTd);
    }
  }

  function spawnPopoverDropdown(td, rowId, colIdx, colName) {
    closeActivePopover();
    td.classList.add('dm-cell-editing');
    var inner = td.querySelector('.dm-cell-error-inner');
    if (inner) inner.style.display = 'none';
    var corrInner = td.querySelector('.dm-cell-corrected-inner');
    if (corrInner) corrInner.style.display = 'none';

    var options = DROPDOWN_OPTIONS[colName] || [];
    var pop = document.createElement('div');
    pop.className = 'dm-popover';
    pop._ownerTd = td;

    var html = '<div class="dm-popover-header">' + esc(colName) + '</div>';
    html += '<div class="dm-popover-list">';
    options.forEach(function (opt) {
      html += '<button class="dm-popover-item" data-value="' + esc(opt) + '">' + esc(opt) + '</button>';
    });
    html += '</div>';
    pop.innerHTML = html;

    document.body.appendChild(pop);

    var rect = td.getBoundingClientRect();
    pop.style.top = (rect.bottom + 4) + 'px';
    pop.style.left = rect.left + 'px';

    var popRect = pop.getBoundingClientRect();
    if (popRect.right > window.innerWidth - 8) {
      pop.style.left = Math.max(8, rect.right - popRect.width) + 'px';
    }
    if (popRect.bottom > window.innerHeight - 8) {
      pop.style.top = (rect.top - popRect.height - 4) + 'px';
    }

    pop.querySelectorAll('.dm-popover-item').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var val = btn.getAttribute('data-value');
        pop.remove();
        commitValue(td, rowId, colIdx, val);
      });
    });
  }

  function spawnInlineControl(td) {
    if (td.querySelector('.dm-inline-ctrl')) return;
    var control = td.getAttribute('data-control');
    var colIdx = parseInt(td.getAttribute('data-col-idx'), 10);
    var rowId = td.getAttribute('data-row-id');
    var colName = TABLE_COLS[colIdx];

    if (control === 'dropdown') {
      spawnPopoverDropdown(td, rowId, colIdx, colName);
      return;
    }

    td.classList.add('dm-cell-editing');
    var inner = td.querySelector('.dm-cell-error-inner');
    if (inner) inner.style.display = 'none';
    var corrInner = td.querySelector('.dm-cell-corrected-inner');
    if (corrInner) corrInner.style.display = 'none';

    var el;
    if (control === 'date') {
      el = document.createElement('input');
      el.type = 'date';
      el.className = 'dm-inline-ctrl dm-inline-date dm-inline-overlay';
      el.addEventListener('change', function () {
        el.remove();
        commitValue(td, rowId, colIdx, formatDateFromInput(el.value));
      });
      el.addEventListener('blur', function () {
        setTimeout(function () {
          if (!el.value) { el.remove(); revertCell(td); }
        }, 120);
      });
    } else if (control === 'number') {
      el = document.createElement('input');
      el.type = 'text';
      el.inputMode = 'numeric';
      el.placeholder = '0';
      el.className = 'dm-inline-ctrl dm-inline-number dm-inline-overlay';
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); if (el.value.trim()) { el.remove(); commitValue(td, rowId, colIdx, el.value.trim()); } }
      });
      el.addEventListener('blur', function () {
        if (el.value.trim()) { el.remove(); commitValue(td, rowId, colIdx, el.value.trim()); }
        else { el.remove(); revertCell(td); }
      });
    }

    if (el) {
      document.body.appendChild(el);
      var rect = td.getBoundingClientRect();
      el.style.top = rect.top + 'px';
      el.style.left = rect.left + 'px';
      el.style.height = rect.height + 'px';
      el.focus();
      if (control === 'date' && el.showPicker) {
        try { el.showPicker(); } catch (_) {}
      }
    }
  }

  document.addEventListener('click', function (e) {
    var pop = document.querySelector('.dm-popover');
    if (pop && !pop.contains(e.target) && !e.target.closest('[data-control="dropdown"]')) {
      closeActivePopover();
    }
    var cell = e.target.closest('.dm-cell-error[data-control], .dm-cell-corrected[data-control]');
    if (cell && !cell.classList.contains('dm-cell-editing')) {
      spawnInlineControl(cell);
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.classList.contains('dm-checkbox-all')) {
      var table = e.target.closest('.dm-table');
      if (!table) return;
      var checked = e.target.checked;
      table.querySelectorAll('tbody .dm-checkbox').forEach(function (cb) { cb.checked = checked; });
    }
  });

  /** Returns the body HTML string (dm-layout) for the Data management page. */
  function getBodyHTML() {
    var html = '<h1 class="dm-page-title">Activity data</h1>';
    html += '<div class="dm-layout">';

    html += '<div class="dm-top-row">';
    html += '<div class="kpi-card goals-card">';
    html += '<div class="goals-card-heading"><span class="goals-card-label">Active campaigns</span></div>';
    html += '<div class="goals-metric">';
    html += '<span class="goals-metric-value">3</span>';
    html += '<span class="goals-metric-label">Active</span>';
    html += '<span class="goals-metric-value">5%</span>';
    html += '<span class="goals-metric-label">past due</span>';
    html += '</div>';
    html += '<p class="goals-subtitle">19,832 records requested, 992 past due</p>';
    html += '<div class="goals-progress">';
    html += '<div class="goals-progress-track"></div>';
    html += '<div class="goals-progress-segment goals-progress-pending" style="width:5%"></div>';
    html += '</div>';
    html += '<div class="goals-actions">';
    html += '<button class="btn btn-outline btn-small">Review campaigns</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="kpi-card goals-card">';
    html += '<div class="goals-card-heading"><span class="goals-card-label">All activity records</span></div>';
    html += '<div class="goals-metric">';
    html += '<span class="goals-metric-value">86%</span>';
    html += '<span class="goals-metric-label">Activities normalized</span>';
    html += '</div>';
    html += '<p class="goals-subtitle">12 files uploaded, 8,923 records, 45/90 normalized</p>';
    html += '<div class="goals-progress">';
    html += '<div class="goals-progress-track"></div>';
    html += '<div class="goals-progress-segment goals-progress-pending" style="width:86%"></div>';
    html += '</div>';
    html += '<div class="goals-actions">';
    html += '<button class="btn btn-outline btn-small" data-action="open-activity-data-setup">+ Add files/data</button>';
    html += '<button class="btn btn-outline btn-small"><i class="fa-solid fa-book"></i> Rules library</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-bottom">';
    html += '<div class="dm-left">';
    html += buildDefaultLeftPanel();
    html += '</div>';

    html += '<div class="dm-right">';
    html += '<div class="dm-table-wrap">';
    html += '<h3 class="dm-view-title">All data list</h3>';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<button class="dm-btn dm-btn-outline"><i class="fa-solid fa-sliders"></i> Filter</button>';
    html += '</div>';
    html += '<div class="dm-table-scroll">';
    html += '<table class="dm-table">';
    html += buildTableHTML(TABLE_ROWS);
    html += '</table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Build a DOM tree for the Data management page (for use in page transition).
   */
  window.getActivityMapPageContent = function () {
    var wrap = document.createElement('div');
    wrap.className = 'dm-page';
    wrap.innerHTML = getBodyHTML();
    return wrap;
  };

})();
