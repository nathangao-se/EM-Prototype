// ========================================
// DATA MANAGEMENT — page content (rendered via page transition from project bar)
// ========================================

(function () {

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

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

  function buildTableHTML(rows) {
    var html = '<thead><tr>';
    TABLE_COLS.forEach(function (col) { html += '<th>' + esc(col) + '</th>'; });
    html += '<th></th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr>';
      r.forEach(function (cell) { html += '<td>' + esc(cell) + '</td>'; });
      html += '<td><button class="dm-more"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>';
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
    html += '<select class="dm-select"><option>All scope</option></select>';
    html += '<select class="dm-select"><option>All entities</option></select>';
    html += '<select class="dm-select"><option>Normalized and unnormalized</option></select>';
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

  function restoreDataListView(rightPanel) {
    if (!rightPanel) return;
    var html = '';
    html += '<div class="dm-table-wrap">';
    html += '<h3 class="dm-view-title">All data list</h3>';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<select class="dm-select"><option>Display: list</option></select>';
    html += '<select class="dm-select"><option>All scope</option></select>';
    html += '<select class="dm-select"><option>All entities</option></select>';
    html += '<select class="dm-select"><option>Normalized and unnormalized</option></select>';
    html += '</div>';
    html += '<div class="dm-table-scroll">';
    html += '<table class="dm-table">';
    html += buildTableHTML(TABLE_ROWS);
    html += '</table>';
    html += '</div>';
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
    var html = '<div class="dm-filter-card">';

    html += '<div class="dm-filter-row" data-action="open-category-overview" style="cursor:pointer">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title">Category overview</div>';
    html += '<div class="dm-filter-meta">8,923 records</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '<span class="dm-filter-title">Unnormalized Columns</span>';
    html += '</div>';
    html += '<div class="dm-filter-meta">6 instances</div>';
    html += '</div>';
    html += '<div class="dm-filter-action">';
    html += '<a href="#" class="dm-filter-link" data-action="open-columns-modal">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '<span class="dm-filter-title">Unnormalized data</span>';
    html += '</div>';
    html += '<div class="dm-filter-meta">1,249 records</div>';
    html += '</div>';
    html += '<div class="dm-filter-action">';
    html += '<a href="#" class="dm-filter-link" data-action="open-normalize">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-footer">';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // Category overview click delegation
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-action="open-category-overview"]');
    if (trigger) {
      e.preventDefault();
      showCategoryView(trigger);
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
  var TABLE_COLS = ['ID','Business Entity','Scope','Category','Activity Type','Emissions Factor','Start Date','End Date','Record Type','Description','Fuel Type','Usage Value','Usage UoM','Factor Set','Factor Set Version','\u2082e','Alerts'];

  var TABLE_ROWS = [
    ['86f7c8','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Estimate','Heating Source 6','Refinery Gas','1,000','Liter','','','',''],
    ['dfc393','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Estimate','Heating Source 3','Liquefied Petroleum Gas','1,000','Cubic Meter','','','',''],
    ['cd7e03','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Meter Reading','Heating Source 14','Landfill Gas','1,000','Kilogram','','','',''],
    ['6aae5c','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Meter Reading','Heating Source 8','Heating Oil','1,000','Gallon','','','',''],
    ['24042f','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 10','Petrol Stationary','1,000','Kilogram','','','',''],
    ['c59202','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.12','Natural Gas','1,003','Kilowatt-hour','','','','1 issue'],
    ['362dcc','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 1','Furnace Oil','1,000','Liter','','','',''],
    ['c7bd6c','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.13','Natural Gas','1,003','Kilowatt-hour','','','','1 issue'],
    ['6c6a5d','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.11','','1,003','Kilowatt-hour','','','','1 issue'],
    ['301976','Besana','1','','','','1/1/24','1/31/24','Invoice','Heating Source 17','','1,000','Liter','','','','1 issue'],
    ['65f64f','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 18','','1,000','Liter','','','','1 issue'],
    ['8eac9c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','','1/1/24','1/31/24','Estimate','Mobile Comb. Source 11','','1,000','Kilogram','','','','1 issue'],
    ['c9ac41','Besana','1','0','Stationary Combustion','Other bituminous coal','1/1/24','1/31/24','Estimate','Heating Source 12','Coal Bituminous','1,000','Short Tons','IEA','2024','18,885.91',''],
    ['104f29','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gaseous fuels - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 12','Compressed Natural Gas','1,000','Kilogram','UK DESZN (ex-DEFRA)','2024','3.099',''],
    ['4c8919','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Geothermal-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.4','Geothermal','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
    ['37cd90','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Wind-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.3','Wind','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
    ['818361','Besana','1','0','Stationary Combustion','Liquefied petroleum gases','1/1/24','1/31/24','Invoice','Heating Source 4','Propane','1,000','Kilogram','IEA','2024','44.953',''],
    ['48756c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gaseous fuels - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 1','Compressed Natural Gas','1,000','Kilogram','UK DESZN (ex-DEFRA)','2024','3.099',''],
    ['7eb6fd','Besana','1','0','Stationary Combustion','Biomass - Wood chips','1/1/24','1/31/24','Estimate','Heating Source 18','Biomass Wood','1,000','Short Tons','UK DESZN (ex-DEFRA)','2024','1,239.31',''],
    ['c0044d','Besana','1','0','Stationary Combustion','Biofuel - Dev diesel','1/1/24','1/31/24','Meter Reading','Heating Source 20','Diesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.254',''],
    ['e47b8f','Besana','1','0','Stationary Combustion','Fuels - Gas oil','1/1/24','1/31/24','Invoice','Heating Source 22','Kerosene','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.383',''],
    ['61e741','Besana','1','0','Stationary Combustion','Natural gas','1/1/24','1/31/24','Meter Reading','Heating Source 2','Liquefied Natural Gas','1,000','Cubic Meter','IEA','2024','8.037',''],
    ['ae1698','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 6','Kerosene','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.921',''],
    ['f88db6','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 9','Lubricant Oil','1,000','Gallon','IEA','2024','44.665',''],
    ['5.68E+03','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gas oil','1/1/24','1/31/24','Estimate','Mobile Comb. Source 3','Gas Oil','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.383',''],
    ['7dcdd9','Besana','1','0','Stationary Combustion','Petroleum coke','1/1/24','1/31/24','Invoice','Heating Source 16','Pet Coke','1,000','Short Tons','IEA','2024','10,253.57',''],
    ['8ae196','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Upper medium - Diesel','1/1/24','1/31/24','Invoice','Mobile Comb. Source 17','Diesel','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.161',''],
    ['efa448','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Large car - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 16','Compressed Natural Gas','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.237',''],
    ['bda2ec','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Invoice','Heating Source 13','Biomass Agri. Byproducts','1,000','Kilogram','IEA','2024','12.769',''],
    ['52a36c','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Photovoltaic Solar-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.1','Photovoltaic Solar','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
    ['07be92','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev diesel','1/1/24','1/31/24','Invoice','Mobile Comb. Source 2','Diesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.254',''],
    ['c34679','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 4','Petrol','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.947',''],
    ['435ac8','Besana','1','0','Stationary Combustion','Biofuel - Biodiesel ME','1/1/24','1/31/24','Meter Reading','Heating Source 23','Biodiesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.871',''],
    ['47a72f','Besana','1','0','Stationary Combustion','Fuels - Fuel oil','1/1/24','1/31/24','Invoice','Heating Source 7','Fuel Oil','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.87',''],
    ['744676','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 15','Butane','1,000','Kilogram','IEA','2024','13.044',''],
    ['ba513f','Besana','1','0','Stationary Combustion','Anthracite','1/1/24','1/31/24','Meter Reading','Heating Source 11','Coal Anthracite','1,000','Short Tons','IEA','2024','19,702.37',''],
    ['04cf5a','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 21','Petrol','1,000','Kilogram','IEA','2024','13.516',''],
    ['43ebca','Besana','1','0','Stationary Combustion','Coke oven coke','1/1/24','1/31/24','Invoice','Heating Source 19','Coke Mixed Industrial','1,000','Short Tons','IEA','2024','20,595.48',''],
    ['6e1b3f','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Aviation turbine fuel','1/1/24','1/31/24','Estimate','Mobile Comb. Source 7','Aviation Gasoline','1,000','Gallon','UK DESZN (ex-DEFRA)','2024','10.783',''],
    ['bd9d9c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Upper medium - Petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 19','Petrol','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.19','']
  ];

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
    html += '<select class="dm-select"><option>Display: list</option></select>';
    html += '<select class="dm-select"><option>All scope</option></select>';
    html += '<select class="dm-select"><option>All entities</option></select>';
    html += '<select class="dm-select"><option>Normalized and unnormalized</option></select>';
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
