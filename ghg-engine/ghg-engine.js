/* ========================================
   GHG Calculation Engine – Isolated JS
   ======================================== */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ---------- view switching ---------- */
  var headerActions = $('#ghg-header-actions');
  var headerTitle = $('#ghg-header-title');

  function switchView(id) {
    $$('.ghg-view').forEach(function (v) { v.classList.remove('ghg-view--active'); });
    var target = document.getElementById('ghg-view-' + id);
    if (target) target.classList.add('ghg-view--active');
    var isResults = id === 'results';
    if (headerActions) headerActions.style.display = isResults ? 'flex' : 'none';
    if (headerTitle) headerTitle.textContent = isResults ? 'Q4 2025 Corporate Inventory' : 'GHG Calculation Engine';
  }

  $$('.ghg-inv-card').forEach(function (card) {
    card.addEventListener('click', function () {
      switchView('results');
    });
  });

  document.addEventListener('click', function (e) {
    var backLink = e.target.closest('[data-action="back-to-list"]');
    if (backLink) { e.preventDefault(); switchView('list'); }
  });

  /* ---------- tabs ---------- */
  $$('.ghg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabId = tab.getAttribute('data-ghg-tab');
      $$('.ghg-tab').forEach(function (t) { t.classList.remove('ghg-tab--active'); });
      tab.classList.add('ghg-tab--active');
      $$('.ghg-tab-content').forEach(function (c) { c.classList.remove('ghg-tab-content--active'); });
      var target = document.getElementById('ghg-tab-' + tabId);
      if (target) target.classList.add('ghg-tab-content--active');
    });
  });


  /* ==============================================
     BREAKDOWN TAB – grouped table data
     ============================================== */
  var BREAKDOWN_DATA = [
    {
      entity: 'North America HQ',
      s1: 52.3, s2: 18.4, s3: 312.6, total: 383.3, pct: 36.1,
      children: [
        { cat: 'Stationary Combustion', s1: 34.1, s2: 0, s3: 0, total: 34.1, pct: 3.2 },
        { cat: 'Purchased Electricity', s1: 0, s2: 18.4, s3: 0, total: 18.4, pct: 1.7 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 186.2, total: 186.2, pct: 17.5 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 78.4, total: 78.4, pct: 7.4 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 48.0, total: 48.0, pct: 4.5 }
      ]
    },
    {
      entity: 'EMEA Regional Office',
      s1: 28.1, s2: 12.6, s3: 248.3, total: 289.0, pct: 27.2,
      children: [
        { cat: 'Stationary Combustion', s1: 18.2, s2: 0, s3: 0, total: 18.2, pct: 1.7 },
        { cat: 'Purchased Electricity', s1: 0, s2: 12.6, s3: 0, total: 12.6, pct: 1.2 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 142.1, total: 142.1, pct: 13.4 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 56.2, total: 56.2, pct: 5.3 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 50.0, total: 50.0, pct: 4.7 }
      ]
    },
    {
      entity: 'APAC Manufacturing',
      s1: 36.4, s2: 10.8, s3: 224.6, total: 271.8, pct: 25.6,
      children: [
        { cat: 'Mobile Combustion', s1: 22.4, s2: 0, s3: 0, total: 22.4, pct: 2.1 },
        { cat: 'Fugitive Emissions', s1: 4.0, s2: 0, s3: 0, total: 4.0, pct: 0.4 },
        { cat: 'Purchased Electricity', s1: 0, s2: 10.8, s3: 0, total: 10.8, pct: 1.0 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 84.0, total: 84.0, pct: 7.9 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 84.2, total: 84.2, pct: 7.9 },
        { cat: 'Waste in Operations', s1: 0, s2: 0, s3: 52.7, total: 52.7, pct: 5.0 }
      ]
    },
    {
      entity: 'LATAM Distribution',
      s1: 7.8, s2: 3.4, s3: 106.6, total: 117.8, pct: 11.1,
      children: [
        { cat: 'Stationary Combustion', s1: 5.9, s2: 0, s3: 0, total: 5.9, pct: 0.6 },
        { cat: 'Purchased Electricity', s1: 0, s2: 3.4, s3: 0, total: 3.4, pct: 0.3 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 22.2, total: 22.2, pct: 2.1 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 41.4, total: 41.4, pct: 3.9 },
        { cat: 'Fuel & Energy Activities', s1: 0, s2: 0, s3: 46.7, total: 46.7, pct: 4.4 }
      ]
    }
  ];

  function renderBreakdown() {
    var tbody = $('#ghg-breakdown-body');
    if (!tbody) return;
    var html = '';
    BREAKDOWN_DATA.forEach(function (g, gi) {
      html += '<tr class="ghg-group-header" data-group="' + gi + '">' +
        '<td><span class="ghg-group-toggle"><i class="fa-solid fa-chevron-down"></i></span>' + esc(g.entity) + '</td>' +
        '<td class="num">' + g.s1.toFixed(1) + '</td>' +
        '<td class="num">' + g.s2.toFixed(1) + '</td>' +
        '<td class="num">' + g.s3.toFixed(1) + '</td>' +
        '<td class="num"><strong>' + g.total.toFixed(1) + '</strong></td>' +
        '<td class="num">' + g.pct.toFixed(1) + '%</td></tr>';
      g.children.forEach(function (c) {
        html += '<tr class="ghg-group-child" data-group-parent="' + gi + '">' +
          '<td>' + esc(c.cat) + '</td>' +
          '<td class="num">' + (c.s1 ? c.s1.toFixed(1) : '—') + '</td>' +
          '<td class="num">' + (c.s2 ? c.s2.toFixed(1) : '—') + '</td>' +
          '<td class="num">' + (c.s3 ? c.s3.toFixed(1) : '—') + '</td>' +
          '<td class="num">' + c.total.toFixed(1) + '</td>' +
          '<td class="num">' + c.pct.toFixed(1) + '%</td></tr>';
      });
    });
    tbody.innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    var header = e.target.closest('.ghg-group-header');
    if (!header) return;
    var gi = header.getAttribute('data-group');
    var isCollapsed = header.classList.toggle('ghg-collapsed');
    $$('.ghg-group-child[data-group-parent="' + gi + '"]').forEach(function (row) {
      row.classList.toggle('ghg-hidden', isCollapsed);
    });
  });

  renderBreakdown();

  /* ==============================================
     LINEAGE TAB – expandable rows
     ============================================== */
  var LINEAGE_DATA = [
    {
      activity: 'Natural Gas Heating – Building A',
      entity: 'North America HQ',
      method: 'Activity-Based',
      value: '14,200 m³',
      ef: '2.02 kg CO₂e/m³',
      emissions: 28.7,
      status: 'success',
      lineage: {
        source: 'Utility Bill – ConEd Dec 2025',
        sourceType: 'Primary Data',
        period: 'Oct–Dec 2025',
        efName: 'Natural Gas – Pipeline',
        efSource: 'EPA GHG EF Hub 2024',
        efRegion: 'United States',
        formula: '14,200 m³ × 2.02 kg CO₂e/m³ = 28,684 kg = 28.7 tCO₂e',
        checks: ['Source data validated', 'EF within expected range', 'Period aligned', 'Unit conversion verified']
      }
    },
    {
      activity: 'Electricity Consumption – All Floors',
      entity: 'North America HQ',
      method: 'Activity-Based',
      value: '82,400 kWh',
      ef: '0.223 kg CO₂e/kWh',
      emissions: 18.4,
      status: 'success',
      lineage: {
        source: 'Smart Meter Data – Q4 Aggregate',
        sourceType: 'Metered Data',
        period: 'Oct–Dec 2025',
        efName: 'US Grid Average – NERC RFC',
        efSource: 'eGRID 2024',
        efRegion: 'RFC East',
        formula: '82,400 kWh × 0.223 kg CO₂e/kWh = 18,375 kg = 18.4 tCO₂e',
        checks: ['Source data validated', 'EF region-specific', 'Period aligned', 'Cross-checked with billing']
      }
    },
    {
      activity: 'Business Travel – Flights',
      entity: 'EMEA Regional Office',
      method: 'Distance-Based',
      value: '234,000 km',
      ef: '0.24 kg CO₂e/km',
      emissions: 56.2,
      status: 'warning',
      lineage: {
        source: 'Travel Management System – SAP Concur',
        sourceType: 'System Extract',
        period: 'Oct–Dec 2025',
        efName: 'Short-Haul Flight – Economy',
        efSource: 'DEFRA 2024',
        efRegion: 'United Kingdom',
        formula: '234,000 km × 0.24 kg CO₂e/km = 56,160 kg = 56.2 tCO₂e',
        checks: ['Source data validated', 'Mixed distance classes applied', 'Radiative forcing included']
      }
    },
    {
      activity: 'IT Equipment Purchase',
      entity: 'APAC Manufacturing',
      method: 'Spend-Based',
      value: '$420,000',
      ef: '0.20 kg CO₂e/$',
      emissions: 84.0,
      status: 'info',
      lineage: {
        source: 'ERP System – SAP S/4HANA',
        sourceType: 'Financial Data',
        period: 'Oct–Dec 2025',
        efName: 'EEIO – Electronic Equipment',
        efSource: 'USEEIO v2.0',
        efRegion: 'Global',
        formula: '$420,000 × 0.20 kg CO₂e/$ = 84,000 kg = 84.0 tCO₂e',
        checks: ['Spend verified against POs', 'Currency converted to USD', 'EEIO category mapped']
      }
    },
    {
      activity: 'Fleet Diesel Consumption',
      entity: 'LATAM Distribution',
      method: 'Activity-Based',
      value: '8,200 liters',
      ef: '2.68 kg CO₂e/L',
      emissions: 22.0,
      status: 'success',
      lineage: {
        source: 'Fleet Management System',
        sourceType: 'Primary Data',
        period: 'Oct–Dec 2025',
        efName: 'Diesel – Mobile Sources',
        efSource: 'GHG Protocol EF Database 2024',
        efRegion: 'Latin America',
        formula: '8,200 L × 2.68 kg CO₂e/L = 21,976 kg = 22.0 tCO₂e',
        checks: ['Fuel receipts matched', 'EF region-appropriate', 'Odometer cross-check passed']
      }
    }
  ];

  function statusBadge(s) {
    var map = {
      success: { cls: 'ghg-badge--success', icon: 'fa-circle-check', label: 'Verified' },
      warning: { cls: 'ghg-badge--warning', icon: 'fa-triangle-exclamation', label: 'Review' },
      info: { cls: 'ghg-badge--info', icon: 'fa-circle-info', label: 'Estimated' }
    };
    var m = map[s] || map.success;
    return '<span class="ghg-badge ' + m.cls + '"><i class="fa-solid ' + m.icon + '"></i> ' + m.label + '</span>';
  }

  function renderLineage() {
    var tbody = $('#ghg-lineage-body');
    if (!tbody) return;
    var html = '';
    LINEAGE_DATA.forEach(function (r, i) {
      html += '<tr class="ghg-expand-row" data-lineage="' + i + '">' +
        '<td><span class="ghg-expand-icon"><i class="fa-solid fa-chevron-right"></i></span></td>' +
        '<td>' + esc(r.activity) + '</td>' +
        '<td>' + esc(r.entity) + '</td>' +
        '<td>' + esc(r.method) + '</td>' +
        '<td class="num">' + esc(r.value) + '</td>' +
        '<td class="num">' + esc(r.ef) + '</td>' +
        '<td class="num"><strong>' + r.emissions.toFixed(1) + '</strong></td>' +
        '<td>' + statusBadge(r.status) + '</td>' +
        '</tr>';
      var l = r.lineage;
      html += '<tr class="ghg-expanded-content" data-lineage-detail="' + i + '">' +
        '<td colspan="8"><div class="ghg-expanded-inner"><div class="ghg-lineage-panel">' +
        '<div class="ghg-lineage-header"><h4><i class="fa-solid fa-diagram-project"></i> Calculation Lineage</h4>' +
        '<p>' + esc(r.activity) + ' – ' + esc(r.entity) + '</p></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-database"></i> Source Data</div>' +
        '<div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.source) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Type</div><div class="ghg-lineage-item-value">' + esc(l.sourceType) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Period</div><div class="ghg-lineage-item-value">' + esc(l.period) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Activity Value</div><div class="ghg-lineage-item-value">' + esc(r.value) + '</div></div>' +
        '</div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-scale-balanced"></i> Emission Factor</div>' +
        '<div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Factor Name</div><div class="ghg-lineage-item-value">' + esc(l.efName) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.efSource) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Region</div><div class="ghg-lineage-item-value">' + esc(l.efRegion) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Value</div><div class="ghg-lineage-item-value">' + esc(r.ef) + '</div></div>' +
        '</div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-calculator"></i> Calculation</div>' +
        '<div class="ghg-lineage-calc">' + esc(l.formula) + '</div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-shield-check"></i> Validation</div>' +
        '<div class="ghg-lineage-checks">' +
        l.checks.map(function (c) { return '<div class="ghg-lineage-check"><i class="fa-solid fa-circle-check"></i> ' + esc(c) + '</div>'; }).join('') +
        '</div></div>' +
        '</div></div></td></tr>';
    });
    tbody.innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    var row = e.target.closest('.ghg-expand-row');
    if (!row) return;
    var idx = row.getAttribute('data-lineage');
    var detail = $('[data-lineage-detail="' + idx + '"]');
    if (!detail) return;
    var isExpanded = row.classList.toggle('ghg-expanded');
    detail.classList.toggle('ghg-expanded-content--open', isExpanded);

    if (isExpanded) {
      $$('.ghg-expand-row').forEach(function (other) {
        if (other !== row && other.classList.contains('ghg-expanded')) {
          other.classList.remove('ghg-expanded');
          var otherIdx = other.getAttribute('data-lineage');
          var otherDetail = $('[data-lineage-detail="' + otherIdx + '"]');
          if (otherDetail) otherDetail.classList.remove('ghg-expanded-content--open');
        }
      });
    }
  });

  renderLineage();

})();
