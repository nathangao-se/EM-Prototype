/* ============================================
   EMISSION FACTOR LIBRARY PAGE
   Exposed API:
     window.getEfLibraryPageContent() → DOM node
   ============================================ */
(function () {
  'use strict';

  var esc = window.DomUtils.esc;

  var EF_DATA = [
    { name: 'eGRID RFCW Electricity', source: 'eGRID',  category: 'Electricity',           region: 'RFC West (OH, WV, PA)', factor: 0.364,  unit: 'kg CO\u2082e/kWh',    year: 2024 },
    { name: 'Natural Gas \u2013 Stationary', source: 'EPA',   category: 'Stationary Combustion', region: 'United States',         factor: 5.31,   unit: 'kg CO\u2082e/therm',  year: 2024 },
    { name: 'Gasoline \u2013 Mobile',        source: 'EPA',   category: 'Mobile Combustion',     region: 'United States',         factor: 8.89,   unit: 'kg CO\u2082e/gallon', year: 2024 },
    { name: 'Diesel \u2013 Mobile',          source: 'EPA',   category: 'Mobile Combustion',     region: 'United States',         factor: 10.21,  unit: 'kg CO\u2082e/gallon', year: 2024 },
    { name: 'Air Travel \u2013 Short Haul',  source: 'DEFRA', category: 'Business Travel',       region: 'Global',                factor: 0.255,  unit: 'kg CO\u2082e/km',     year: 2024 },
    { name: 'EEIO \u2013 Manufacturing',     source: 'EEIO',  category: 'Purchased Goods',       region: 'United States',         factor: 0.42,   unit: 'kg CO\u2082e/$',      year: 2024 }
  ];

  var SOURCES = ['All Sources'];
  EF_DATA.forEach(function (r) {
    if (SOURCES.indexOf(r.source) === -1) SOURCES.push(r.source);
  });

  function buildSourceBadge(src) {
    var cls = 'ef-source-badge ef-source-badge--' + src.toLowerCase().replace(/[^a-z0-9]/g, '');
    return '<span class="' + cls + '">' + esc(src) + '</span>';
  }

  function buildRows(data) {
    var html = '';
    data.forEach(function (r) {
      html += '<tr>';
      html += '<td>' + esc(r.name) + '</td>';
      html += '<td>' + buildSourceBadge(r.source) + '</td>';
      html += '<td>' + esc(r.category) + '</td>';
      html += '<td>' + esc(r.region) + '</td>';
      html += '<td class="ef-num">' + r.factor + '</td>';
      html += '<td>' + esc(r.unit) + '</td>';
      html += '<td class="ef-num">' + r.year + '</td>';
      html += '</tr>';
    });
    return html;
  }

  function getBodyHTML() {
    var html = '';

    html += '<div class="ef-page-header pt-stagger-item">';
    html += '<div class="ef-breadcrumb"><span>Monitor</span><i class="fa-solid fa-chevron-right"></i><span>EF Library</span></div>';
    html += '<h1 class="ef-page-title">Emission Factor Library</h1>';
    html += '<p class="ef-page-subtitle">Browse and manage emission factors from authoritative sources</p>';
    html += '</div>';

    html += '<div class="ef-table-wrap pt-stagger-item">';

    html += '<div class="ef-toolbar">';
    html += '<div class="ef-search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="ef-search" placeholder="Search emission factors\u2026"></div>';
    html += '<select class="ef-select">';
    SOURCES.forEach(function (s) { html += '<option>' + esc(s) + '</option>'; });
    html += '</select>';
    html += '</div>';

    html += '<div class="ef-table-scroll">';
    html += '<table class="ef-table">';
    html += '<thead><tr>';
    html += '<th class="ef-th-name">NAME</th>';
    html += '<th class="ef-th-source">SOURCE</th>';
    html += '<th class="ef-th-category">CATEGORY</th>';
    html += '<th class="ef-th-region">REGION</th>';
    html += '<th class="ef-th-factor ef-num">FACTOR</th>';
    html += '<th class="ef-th-unit">UNIT</th>';
    html += '<th class="ef-th-year ef-num">YEAR</th>';
    html += '</tr></thead>';
    html += '<tbody>' + buildRows(EF_DATA) + '</tbody>';
    html += '</table>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function bindEfLibrary(container) {
    var searchInput = container.querySelector('.ef-search');
    var sourceSelect = container.querySelector('.ef-select');
    var tbody = container.querySelector('.ef-table tbody');

    function applyFilters() {
      var q = (searchInput ? searchInput.value : '').toLowerCase();
      var src = sourceSelect ? sourceSelect.value : 'All Sources';
      var filtered = EF_DATA.filter(function (r) {
        if (src !== 'All Sources' && r.source !== src) return false;
        if (q && r.name.toLowerCase().indexOf(q) === -1 &&
            r.category.toLowerCase().indexOf(q) === -1 &&
            r.region.toLowerCase().indexOf(q) === -1 &&
            r.unit.toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      if (tbody) tbody.innerHTML = buildRows(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sourceSelect) sourceSelect.addEventListener('change', applyFilters);
  }

  window.getEfLibraryPageContent = function () {
    var wrap = document.createElement('div');
    wrap.className = 'ef-page';
    wrap.innerHTML = getBodyHTML();
    bindEfLibrary(wrap);
    return wrap;
  };

})();
