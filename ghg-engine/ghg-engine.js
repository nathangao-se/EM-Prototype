/* ========================================
   GHG Calculation Engine – Isolated JS
   Works standalone (ghg-engine.html) AND
   embedded via page transition from main app.

   Exposed API:
     window.getGhgEnginePageContent() → DOM node
     window.bindGhgEngine(container)  → wires interactivity
   ======================================== */
(function () {
  'use strict';

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ==============================================
     DATA
     ============================================== */

  var BREAKDOWN_DATA = [
    { entity: 'North America HQ', s1: 52.3, s2: 18.4, s3: 312.6, total: 383.3, pct: 36.1,
      children: [
        { cat: 'Stationary Combustion', s1: 34.1, s2: 0, s3: 0, total: 34.1, pct: 3.2 },
        { cat: 'Purchased Electricity', s1: 0, s2: 18.4, s3: 0, total: 18.4, pct: 1.7 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 186.2, total: 186.2, pct: 17.5 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 78.4, total: 78.4, pct: 7.4 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 48.0, total: 48.0, pct: 4.5 }
      ] },
    { entity: 'EMEA Regional Office', s1: 28.1, s2: 12.6, s3: 248.3, total: 289.0, pct: 27.2,
      children: [
        { cat: 'Stationary Combustion', s1: 18.2, s2: 0, s3: 0, total: 18.2, pct: 1.7 },
        { cat: 'Purchased Electricity', s1: 0, s2: 12.6, s3: 0, total: 12.6, pct: 1.2 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 142.1, total: 142.1, pct: 13.4 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 56.2, total: 56.2, pct: 5.3 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 50.0, total: 50.0, pct: 4.7 }
      ] },
    { entity: 'APAC Manufacturing', s1: 36.4, s2: 10.8, s3: 224.6, total: 271.8, pct: 25.6,
      children: [
        { cat: 'Mobile Combustion', s1: 22.4, s2: 0, s3: 0, total: 22.4, pct: 2.1 },
        { cat: 'Fugitive Emissions', s1: 4.0, s2: 0, s3: 0, total: 4.0, pct: 0.4 },
        { cat: 'Purchased Electricity', s1: 0, s2: 10.8, s3: 0, total: 10.8, pct: 1.0 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 84.0, total: 84.0, pct: 7.9 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 84.2, total: 84.2, pct: 7.9 },
        { cat: 'Waste in Operations', s1: 0, s2: 0, s3: 52.7, total: 52.7, pct: 5.0 }
      ] },
    { entity: 'LATAM Distribution', s1: 7.8, s2: 3.4, s3: 106.6, total: 117.8, pct: 11.1,
      children: [
        { cat: 'Stationary Combustion', s1: 5.9, s2: 0, s3: 0, total: 5.9, pct: 0.6 },
        { cat: 'Purchased Electricity', s1: 0, s2: 3.4, s3: 0, total: 3.4, pct: 0.3 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 22.2, total: 22.2, pct: 2.1 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 41.4, total: 41.4, pct: 3.9 },
        { cat: 'Fuel & Energy Activities', s1: 0, s2: 0, s3: 46.7, total: 46.7, pct: 4.4 }
      ] }
  ];

  var LINEAGE_DATA = [
    { activity: 'Natural Gas Heating – Building A', entity: 'North America HQ', method: 'Activity-Based',
      value: '14,200 m\u00B3', ef: '2.02 kg CO\u2082e/m\u00B3', emissions: 28.7, status: 'success',
      lineage: { source: 'Utility Bill – ConEd Dec 2025', sourceType: 'Primary Data', period: 'Oct–Dec 2025',
        efName: 'Natural Gas – Pipeline', efSource: 'EPA GHG EF Hub 2024', efRegion: 'United States',
        formula: '14,200 m\u00B3 \u00D7 2.02 kg CO\u2082e/m\u00B3 = 28,684 kg = 28.7 tCO\u2082e',
        checks: ['Source data validated', 'EF within expected range', 'Period aligned', 'Unit conversion verified'] } },
    { activity: 'Electricity Consumption – All Floors', entity: 'North America HQ', method: 'Activity-Based',
      value: '82,400 kWh', ef: '0.223 kg CO\u2082e/kWh', emissions: 18.4, status: 'success',
      lineage: { source: 'Smart Meter Data – Q4 Aggregate', sourceType: 'Metered Data', period: 'Oct–Dec 2025',
        efName: 'US Grid Average – NERC RFC', efSource: 'eGRID 2024', efRegion: 'RFC East',
        formula: '82,400 kWh \u00D7 0.223 kg CO\u2082e/kWh = 18,375 kg = 18.4 tCO\u2082e',
        checks: ['Source data validated', 'EF region-specific', 'Period aligned', 'Cross-checked with billing'] } },
    { activity: 'Business Travel – Flights', entity: 'EMEA Regional Office', method: 'Distance-Based',
      value: '234,000 km', ef: '0.24 kg CO\u2082e/km', emissions: 56.2, status: 'warning',
      lineage: { source: 'Travel Management System – SAP Concur', sourceType: 'System Extract', period: 'Oct–Dec 2025',
        efName: 'Short-Haul Flight – Economy', efSource: 'DEFRA 2024', efRegion: 'United Kingdom',
        formula: '234,000 km \u00D7 0.24 kg CO\u2082e/km = 56,160 kg = 56.2 tCO\u2082e',
        checks: ['Source data validated', 'Mixed distance classes applied', 'Radiative forcing included'] } },
    { activity: 'IT Equipment Purchase', entity: 'APAC Manufacturing', method: 'Spend-Based',
      value: '$420,000', ef: '0.20 kg CO\u2082e/$', emissions: 84.0, status: 'info',
      lineage: { source: 'ERP System – SAP S/4HANA', sourceType: 'Financial Data', period: 'Oct–Dec 2025',
        efName: 'EEIO – Electronic Equipment', efSource: 'USEEIO v2.0', efRegion: 'Global',
        formula: '$420,000 \u00D7 0.20 kg CO\u2082e/$ = 84,000 kg = 84.0 tCO\u2082e',
        checks: ['Spend verified against POs', 'Currency converted to USD', 'EEIO category mapped'] } },
    { activity: 'Fleet Diesel Consumption', entity: 'LATAM Distribution', method: 'Activity-Based',
      value: '8,200 liters', ef: '2.68 kg CO\u2082e/L', emissions: 22.0, status: 'success',
      lineage: { source: 'Fleet Management System', sourceType: 'Primary Data', period: 'Oct–Dec 2025',
        efName: 'Diesel – Mobile Sources', efSource: 'GHG Protocol EF Database 2024', efRegion: 'Latin America',
        formula: '8,200 L \u00D7 2.68 kg CO\u2082e/L = 21,976 kg = 22.0 tCO\u2082e',
        checks: ['Fuel receipts matched', 'EF region-appropriate', 'Odometer cross-check passed'] } }
  ];

  /* ==============================================
     HTML BUILDERS
     ============================================== */

  function buildBreakdownHTML() {
    var html = '';
    BREAKDOWN_DATA.forEach(function (g, gi) {
      html += '<tr class="ghg-group-header" data-group="' + gi + '">' +
        '<td><span class="ghg-group-toggle"><i class="fa-solid fa-chevron-down"></i></span>' + esc(g.entity) + '</td>' +
        '<td class="num">' + g.s1.toFixed(1) + '</td><td class="num">' + g.s2.toFixed(1) + '</td>' +
        '<td class="num">' + g.s3.toFixed(1) + '</td><td class="num"><strong>' + g.total.toFixed(1) + '</strong></td>' +
        '<td class="num">' + g.pct.toFixed(1) + '%</td></tr>';
      g.children.forEach(function (c) {
        html += '<tr class="ghg-group-child" data-group-parent="' + gi + '">' +
          '<td>' + esc(c.cat) + '</td>' +
          '<td class="num">' + (c.s1 ? c.s1.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + (c.s2 ? c.s2.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + (c.s3 ? c.s3.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + c.total.toFixed(1) + '</td><td class="num">' + c.pct.toFixed(1) + '%</td></tr>';
      });
    });
    return html;
  }

  function statusBadge(s) {
    var map = { success: { cls: 'ghg-badge--success', icon: 'fa-circle-check', label: 'Verified' },
      warning: { cls: 'ghg-badge--warning', icon: 'fa-triangle-exclamation', label: 'Review' },
      info: { cls: 'ghg-badge--info', icon: 'fa-circle-info', label: 'Estimated' } };
    var m = map[s] || map.success;
    return '<span class="ghg-badge ' + m.cls + '"><i class="fa-solid ' + m.icon + '"></i> ' + m.label + '</span>';
  }

  function buildLineageHTML() {
    var html = '';
    LINEAGE_DATA.forEach(function (r, i) {
      html += '<tr class="ghg-expand-row" data-lineage="' + i + '">' +
        '<td><span class="ghg-expand-icon"><i class="fa-solid fa-chevron-right"></i></span></td>' +
        '<td>' + esc(r.activity) + '</td><td>' + esc(r.entity) + '</td><td>' + esc(r.method) + '</td>' +
        '<td class="num">' + esc(r.value) + '</td><td class="num">' + esc(r.ef) + '</td>' +
        '<td class="num"><strong>' + r.emissions.toFixed(1) + '</strong></td><td>' + statusBadge(r.status) + '</td></tr>';
      var l = r.lineage;
      html += '<tr class="ghg-expanded-content" data-lineage-detail="' + i + '"><td colspan="8"><div class="ghg-expanded-inner"><div class="ghg-lineage-panel">' +
        '<div class="ghg-lineage-header"><h4><i class="fa-solid fa-diagram-project"></i> Calculation Lineage</h4><p>' + esc(r.activity) + ' \u2013 ' + esc(r.entity) + '</p></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-database"></i> Source Data</div><div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.source) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Type</div><div class="ghg-lineage-item-value">' + esc(l.sourceType) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Period</div><div class="ghg-lineage-item-value">' + esc(l.period) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Activity Value</div><div class="ghg-lineage-item-value">' + esc(r.value) + '</div></div></div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-scale-balanced"></i> Emission Factor</div><div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Factor Name</div><div class="ghg-lineage-item-value">' + esc(l.efName) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.efSource) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Region</div><div class="ghg-lineage-item-value">' + esc(l.efRegion) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Value</div><div class="ghg-lineage-item-value">' + esc(r.ef) + '</div></div></div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-calculator"></i> Calculation</div>' +
        '<div class="ghg-lineage-calc">' + esc(l.formula) + '</div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-shield-check"></i> Validation</div><div class="ghg-lineage-checks">' +
        l.checks.map(function (c) { return '<div class="ghg-lineage-check"><i class="fa-solid fa-circle-check"></i> ' + esc(c) + '</div>'; }).join('') +
        '</div></div></div></div></td></tr>';
    });
    return html;
  }

  /* ==============================================
     BIND INTERACTIVITY to a container
     ============================================== */

  function bindGhgEngine(ctx) {
    var breakdownBody = ctx.querySelector('#ghg-breakdown-body') || ctx.querySelector('[data-ghg-breakdown-body]');
    if (breakdownBody) breakdownBody.innerHTML = buildBreakdownHTML();

    var lineageBody = ctx.querySelector('#ghg-lineage-body') || ctx.querySelector('[data-ghg-lineage-body]');
    if (lineageBody) lineageBody.innerHTML = buildLineageHTML();

    // View switching (list ↔ results)
    function switchView(id) {
      $$(ctx.querySelectorAll ? '.ghg-view' : '.ghg-view', ctx).forEach(function (v) { v.classList.remove('ghg-view--active'); });
      var views = ctx.querySelectorAll('.ghg-view');
      views.forEach(function (v) { v.classList.remove('ghg-view--active'); });
      var target = ctx.querySelector('#ghg-view-' + id) || ctx.querySelector('[data-ghg-view="' + id + '"]');
      if (target) target.classList.add('ghg-view--active');
    }

    ctx.querySelectorAll('.ghg-inv-card').forEach(function (card) {
      card.addEventListener('click', function () { switchView('results'); });
    });

    ctx.addEventListener('click', function (e) {
      var backLink = e.target.closest('[data-action="back-to-list"]');
      if (backLink) { e.preventDefault(); switchView('list'); }
    });

    // Tabs
    ctx.querySelectorAll('.ghg-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tabId = tab.getAttribute('data-ghg-tab');
        ctx.querySelectorAll('.ghg-tab').forEach(function (t) { t.classList.remove('ghg-tab--active'); });
        tab.classList.add('ghg-tab--active');
        ctx.querySelectorAll('.ghg-tab-content').forEach(function (c) { c.classList.remove('ghg-tab-content--active'); });
        var target = ctx.querySelector('#ghg-tab-' + tabId) || ctx.querySelector('[data-ghg-tab-content="' + tabId + '"]');
        if (target) target.classList.add('ghg-tab-content--active');
      });
    });

    // Breakdown group toggle
    ctx.addEventListener('click', function (e) {
      var header = e.target.closest('.ghg-group-header');
      if (!header) return;
      var gi = header.getAttribute('data-group');
      var isCollapsed = header.classList.toggle('ghg-collapsed');
      ctx.querySelectorAll('.ghg-group-child[data-group-parent="' + gi + '"]').forEach(function (row) {
        row.classList.toggle('ghg-hidden', isCollapsed);
      });
    });

    // Lineage expand (accordion)
    ctx.addEventListener('click', function (e) {
      var row = e.target.closest('.ghg-expand-row');
      if (!row) return;
      var idx = row.getAttribute('data-lineage');
      var detail = ctx.querySelector('[data-lineage-detail="' + idx + '"]');
      if (!detail) return;
      var isExpanded = row.classList.toggle('ghg-expanded');
      detail.classList.toggle('ghg-expanded-content--open', isExpanded);
      if (isExpanded) {
        ctx.querySelectorAll('.ghg-expand-row').forEach(function (other) {
          if (other !== row && other.classList.contains('ghg-expanded')) {
            other.classList.remove('ghg-expanded');
            var oi = other.getAttribute('data-lineage');
            var od = ctx.querySelector('[data-lineage-detail="' + oi + '"]');
            if (od) od.classList.remove('ghg-expanded-content--open');
          }
        });
      }
    });
  }

  window.bindGhgEngine = bindGhgEngine;

  /* ==============================================
     getGhgEnginePageContent() — for page transition
     ============================================== */

  window.getGhgEnginePageContent = function () {
    var wrap = document.createElement('div');
    wrap.className = 'ghg-page ghg-page--embedded';
    wrap.innerHTML = document.querySelector('.ghg-page') ?
      document.querySelector('.ghg-page').innerHTML :
      getGhgHTML();
    bindGhgEngine(wrap);
    return wrap;
  };

  function getGhgHTML() {
    return '' +
    '<div id="ghg-view-list" class="ghg-view ghg-view--active">' +
      '<div class="ghg-page-header"><div class="ghg-page-header-left">' +
        '<div class="ghg-breadcrumb"><a href="#">Monitor</a> <i class="fa-solid fa-chevron-right"></i> <span>GHG Inventories</span></div>' +
        '<h1 class="ghg-page-title">GHG Inventories</h1>' +
        '<p class="ghg-page-subtitle">Create, calculate, and manage your emissions inventories</p>' +
      '</div><div class="ghg-page-header-actions"><button class="btn btn-primary btn-small"><i class="fa-solid fa-plus"></i> Create Inventory</button></div></div>' +
      '<div class="ghg-search-bar"><div class="ghg-search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="ghg-search-input" placeholder="Search inventories..."></div>' +
      '<button class="btn btn-outline btn-small"><i class="fa-solid fa-filter"></i> Filter</button></div>' +
      '<div class="ghg-inventory-list">' +
        '<div class="ghg-inv-card" data-inv="q4-2025"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--calc"><i class="fa-solid fa-calculator"></i></div><div><h3 class="ghg-inv-title">Q4 2025 Corporate Inventory</h3><div class="ghg-inv-meta">Oct 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">1,061.9</div><div class="ghg-inv-stat-label">tCO\u2082e Total</div></div><span class="ghg-badge ghg-badge--success"><i class="fa-solid fa-circle-check"></i> Calculated</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
        '<div class="ghg-inv-card" data-inv="q3-2025"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--locked"><i class="fa-solid fa-lock"></i></div><div><h3 class="ghg-inv-title">Q3 2025 Corporate Inventory</h3><div class="ghg-inv-meta">Jul 1 \u2013 Sep 30, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">987.3</div><div class="ghg-inv-stat-label">tCO\u2082e Total</div></div><span class="ghg-badge ghg-badge--success"><i class="fa-solid fa-lock"></i> Locked</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
        '<div class="ghg-inv-card" data-inv="draft"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--draft"><i class="fa-solid fa-pencil"></i></div><div><h3 class="ghg-inv-title">FY 2025 Annual Report</h3><div class="ghg-inv-meta">Jan 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">\u2014</div><div class="ghg-inv-stat-label">Not calculated</div></div><span class="ghg-badge ghg-badge--warning"><i class="fa-solid fa-clock"></i> Draft</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
      '</div>' +
    '</div>' +
    '<div id="ghg-view-results" class="ghg-view">' +
      '<div class="ghg-stats-grid">' +
        '<div class="ghg-stat-card"><div class="ghg-stat-label">Total Emissions</div><div class="ghg-stat-value">1,061.9<span class="ghg-stat-unit">tCO\u2082e</span></div><div class="ghg-stat-change ghg-stat-change--down"><i class="fa-solid fa-arrow-down"></i> 5.4% from Q3 2025</div></div>' +
        '<div class="ghg-stat-card"><div class="ghg-stat-label">Scope 1 \u2013 Direct</div><div class="ghg-stat-value">124.6<span class="ghg-stat-unit">tCO\u2082e</span></div><div class="ghg-stat-change">11.7% of total \u2022 <span class="ghg-stat-change--up">\u25B2 +5.3%</span></div></div>' +
        '<div class="ghg-stat-card"><div class="ghg-stat-label">Scope 2 \u2013 Indirect (Energy)</div><div class="ghg-stat-value">45.2<span class="ghg-stat-unit">tCO\u2082e</span></div><div class="ghg-stat-change">4.3% of total \u2022 <span class="ghg-stat-change--up">\u25B2 +4.9%</span></div></div>' +
        '<div class="ghg-stat-card"><div class="ghg-stat-label">Scope 3 \u2013 Value Chain</div><div class="ghg-stat-value">892.1<span class="ghg-stat-unit">tCO\u2082e</span></div><div class="ghg-stat-change">84.0% of total \u2022 <span class="ghg-stat-change--up">\u25B2 +5.3%</span></div></div>' +
      '</div>' +
      '<div class="ghg-tabs-container"><div class="ghg-tabs">' +
        '<button class="ghg-tab ghg-tab--active" data-ghg-tab="overview">Overview</button>' +
        '<button class="ghg-tab" data-ghg-tab="breakdown">Detailed Breakdown</button>' +
        '<button class="ghg-tab" data-ghg-tab="lineage">Calculation Lineage</button>' +
        '<button class="ghg-tab" data-ghg-tab="ef-selection">EF Selection &amp; Review</button></div>' +
      '<div class="ghg-tab-content ghg-tab-content--active" id="ghg-tab-overview">' +
        '<div class="ghg-overview-meta"><div class="ghg-status-meta">' +
          '<span><i class="fa-regular fa-calendar"></i> Oct 1 \u2013 Dec 31, 2025</span>' +
          '<span><i class="fa-solid fa-book"></i> GHG Protocol Corporate Standard</span>' +
          '<span><i class="fa-solid fa-sitemap"></i> Financial Control</span>' +
          '<span><i class="fa-solid fa-building"></i> 4 entities</span></div>' +
        '<div class="ghg-status-right"><label class="ghg-compare-label">Compare with:</label>' +
          '<select class="ghg-select"><option>No Comparison</option><option selected>Q3 2025 (Previous)</option><option>Q4 2024 (YoY)</option></select>' +
          '<span class="ghg-badge ghg-badge--success ghg-badge--lg"><i class="fa-solid fa-circle-check"></i> Calculation Complete</span></div></div>' +
        '<div class="ghg-quality-card"><div class="ghg-quality-score"><div class="ghg-quality-score-val">87</div><div class="ghg-quality-score-label">out of 100</div></div>' +
          '<div class="ghg-quality-body"><h3 class="ghg-quality-title"><i class="fa-solid fa-shield-check"></i> Data Quality Score</h3>' +
          '<p class="ghg-quality-sub">Based on data completeness, source quality, and validation status</p>' +
          '<div class="ghg-quality-details">' +
            '<div class="ghg-quality-detail-item"><i class="fa-solid fa-circle-check"></i> 892 of 920 records complete (97%)</div>' +
            '<div class="ghg-quality-detail-item"><i class="fa-solid fa-circle-check"></i> All emission factors current (&lt;12 mo)</div>' +
            '<div class="ghg-quality-detail-item"><i class="fa-solid fa-triangle-exclamation warn-icon"></i> 156 records using spend-based estimates (17%)</div>' +
            '<div class="ghg-quality-detail-item"><i class="fa-solid fa-triangle-exclamation warn-icon"></i> 28 high-emission records pending review</div>' +
          '</div></div></div>' +
        '<h3 class="ghg-section-title ghg-section-title--spaced">Scope 2 Dual Reporting</h3>' +
        '<div class="ghg-dual-scope"><div class="ghg-dual-scope-item"><div class="ghg-dual-scope-label">Location-Based</div><div class="ghg-dual-scope-value">45.2 tCO\u2082e</div><div class="ghg-dual-scope-note">Uses grid-average emission factors</div></div>' +
        '<div class="ghg-dual-scope-item"><div class="ghg-dual-scope-label">Market-Based</div><div class="ghg-dual-scope-value">38.1 tCO\u2082e</div><div class="ghg-dual-scope-note">Accounts for RECs and supplier contracts</div></div></div>' +
        '<h3 class="ghg-section-title ghg-section-title--spaced">Emissions Summary by Scope &amp; Category</h3>' +
        '<div class="ghg-scope-bar"><div class="ghg-scope-seg ghg-scope-seg--s1" style="width:11.7%"></div><div class="ghg-scope-seg ghg-scope-seg--s2" style="width:4.3%"></div><div class="ghg-scope-seg ghg-scope-seg--s3" style="width:84%"></div></div>' +
        '<div class="ghg-scope-legend"><div class="ghg-scope-legend-item"><div class="ghg-scope-dot ghg-scope-dot--s1"></div> Scope 1: 124.6 tCO\u2082e (11.7%)</div><div class="ghg-scope-legend-item"><div class="ghg-scope-dot ghg-scope-dot--s2"></div> Scope 2: 45.2 tCO\u2082e (4.3%)</div><div class="ghg-scope-legend-item"><div class="ghg-scope-dot ghg-scope-dot--s3"></div> Scope 3: 892.1 tCO\u2082e (84.0%)</div></div>' +
        '<table class="ghg-table" style="margin-top:16px"><thead><tr><th>Scope</th><th>Category</th><th class="num">Emissions (tCO\u2082e)</th><th class="num">% of Total</th><th class="num">Records</th></tr></thead><tbody>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-1">Scope 1</span></td><td>Stationary Combustion (Natural Gas)</td><td class="num">78.2</td><td class="num">7.4%</td><td class="num">48</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-1">Scope 1</span></td><td>Mobile Combustion (Company Fleet)</td><td class="num">42.4</td><td class="num">4.0%</td><td class="num">24</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-1">Scope 1</span></td><td>Fugitive Emissions</td><td class="num">4.0</td><td class="num">0.4%</td><td class="num">6</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-2">Scope 2</span></td><td>Purchased Electricity</td><td class="num">38.6</td><td class="num">3.6%</td><td class="num">52</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-2">Scope 2</span></td><td>Purchased Heating/Cooling</td><td class="num">6.6</td><td class="num">0.6%</td><td class="num">12</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Purchased Goods &amp; Services</td><td class="num">412.3</td><td class="num">38.8%</td><td class="num">280</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Business Travel</td><td class="num">156.8</td><td class="num">14.8%</td><td class="num">192</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Employee Commuting</td><td class="num">89.4</td><td class="num">8.4%</td><td class="num">120</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Upstream Transport &amp; Distribution</td><td class="num">134.2</td><td class="num">12.6%</td><td class="num">96</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Waste Generated in Operations</td><td class="num">52.7</td><td class="num">5.0%</td><td class="num">48</td></tr>' +
          '<tr><td><span class="ghg-badge ghg-badge--scope-3">Scope 3</span></td><td>Fuel- and Energy-Related Activities</td><td class="num">46.7</td><td class="num">4.4%</td><td class="num">42</td></tr>' +
        '</tbody></table></div>' +
      '<div class="ghg-tab-content" id="ghg-tab-breakdown">' +
        '<h3 class="ghg-section-title">Emissions by Entity &amp; Scope</h3>' +
        '<table class="ghg-table"><thead><tr><th>Entity / Category</th><th class="num">Scope 1</th><th class="num">Scope 2</th><th class="num">Scope 3</th><th class="num">Total (tCO\u2082e)</th><th class="num">% of Total</th></tr></thead>' +
        '<tbody id="ghg-breakdown-body"></tbody></table>' +
        '<h3 class="ghg-section-title ghg-section-title--spaced">Calculation Method Distribution</h3>' +
        '<table class="ghg-table"><thead><tr><th>Method</th><th>Description</th><th class="num">Records</th><th class="num">% Usage</th></tr></thead><tbody>' +
          '<tr><td>Activity-Based</td><td>Activity data \u00D7 emission factor</td><td class="num">332</td><td class="num">52.8%</td></tr>' +
          '<tr><td>Spend-Based</td><td>Spend amount \u00D7 EEIO factor</td><td class="num">156</td><td class="num">24.8%</td></tr>' +
          '<tr><td>Distance-Based</td><td>Distance \u00D7 mode factor (travel/transport)</td><td class="num">136</td><td class="num">21.7%</td></tr>' +
          '<tr><td>Supplier-Specific</td><td>Supplier-provided emission data</td><td class="num">5</td><td class="num">0.8%</td></tr></tbody></table></div>' +
      '<div class="ghg-tab-content" id="ghg-tab-lineage">' +
        '<div class="ghg-info-box ghg-info-box--info" style="margin-bottom:16px"><i class="fa-solid fa-circle-info"></i><div>Click any row to view the full calculation lineage, including source data, emission factors, and validation checks.</div></div>' +
        '<table class="ghg-table"><thead><tr><th style="width:28px"></th><th>Activity</th><th>Entity</th><th>Method</th><th class="num">Value</th><th class="num">EF</th><th class="num">Emissions (tCO\u2082e)</th><th>Status</th></tr></thead>' +
        '<tbody id="ghg-lineage-body"></tbody></table></div>' +
      '<div class="ghg-tab-content" id="ghg-tab-ef-selection">' +
        '<div class="ghg-ef-hero"><div class="ghg-ef-hero-main"><div class="ghg-ef-circle"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#dfe7eb" stroke-width="8"/><circle cx="50" cy="50" r="42" fill="none" stroke="#008029" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="10" transform="rotate(-90 50 50)" stroke-linecap="round"/></svg><div class="ghg-ef-circle-text"><span class="ghg-ef-circle-pct">96.2%</span><span class="ghg-ef-circle-label">EF Coverage</span></div></div>' +
        '<div class="ghg-ef-breakdown"><div class="ghg-ef-bstat"><span class="ghg-ef-bstat-val ghg-ef-bstat-val--success">1,206,234</span><span class="ghg-ef-bstat-label">Records with EF assigned</span></div><div class="ghg-ef-bstat"><span class="ghg-ef-bstat-val ghg-ef-bstat-val--warning">15,402</span><span class="ghg-ef-bstat-label">Flagged for review</span></div><div class="ghg-ef-bstat"><span class="ghg-ef-bstat-val ghg-ef-bstat-val--danger">32,598</span><span class="ghg-ef-bstat-label">Unmapped / Missing EF</span></div></div></div>' +
        '<button class="btn btn-primary btn-small"><i class="fa-solid fa-scale-balanced"></i> Open EF Selection &amp; Review</button></div>' +
        '<div class="ghg-kpi-grid">' +
          '<div class="ghg-kpi-card"><div class="ghg-kpi-top"><div class="ghg-kpi-icon ghg-kpi-icon--success"><i class="fa-solid fa-bullseye"></i></div><div><div class="ghg-kpi-value">76.4</div><div class="ghg-kpi-label">Avg Specificity Score</div></div></div><div class="ghg-kpi-trend ghg-kpi-trend--up">+3.2 from last period</div></div>' +
          '<div class="ghg-kpi-card"><div class="ghg-kpi-top"><div class="ghg-kpi-icon ghg-kpi-icon--primary"><i class="fa-solid fa-location-dot"></i></div><div><div class="ghg-kpi-value">84.2%</div><div class="ghg-kpi-label">Geographic Match Rate</div></div></div><div class="ghg-kpi-trend">Country-specific EFs applied</div></div>' +
          '<div class="ghg-kpi-card"><div class="ghg-kpi-top"><div class="ghg-kpi-icon ghg-kpi-icon--success"><i class="fa-solid fa-calendar-check"></i></div><div><div class="ghg-kpi-value">92.1%</div><div class="ghg-kpi-label">Dataset Freshness</div></div></div><div class="ghg-kpi-trend">Using 2024+ datasets</div></div>' +
          '<div class="ghg-kpi-card"><div class="ghg-kpi-top"><div class="ghg-kpi-icon ghg-kpi-icon--warning"><i class="fa-solid fa-right-left"></i></div><div><div class="ghg-kpi-value">0.11%</div><div class="ghg-kpi-label">Manual Override Rate</div></div></div><div class="ghg-kpi-trend">142 of 1.25M records</div></div></div>' +
        '<div class="ghg-review-queue"><div class="ghg-review-queue-header"><div class="ghg-review-queue-title"><i class="fa-solid fa-flag"></i><h3>Review Queue</h3><span class="ghg-review-count">15,402 selections require attention</span></div><button class="btn btn-primary btn-small">Review All <i class="fa-solid fa-arrow-right"></i></button></div>' +
        '<div class="ghg-issue-cards">' +
          '<div class="ghg-issue-card"><div class="ghg-issue-card-header"><div class="ghg-issue-card-icon ghg-issue-card-icon--warning"><i class="fa-solid fa-location-dot"></i></div><span class="ghg-issue-card-title">Geographic Mismatch</span><span class="ghg-issue-card-count ghg-issue-card-count--warning">5,230</span></div><p class="ghg-issue-card-desc">Non-local EFs applied to local activities</p></div>' +
          '<div class="ghg-issue-card"><div class="ghg-issue-card-header"><div class="ghg-issue-card-icon ghg-issue-card-icon--danger"><i class="fa-solid fa-clock"></i></div><span class="ghg-issue-card-title">Outdated Factors</span><span class="ghg-issue-card-count ghg-issue-card-count--danger">3,890</span></div><p class="ghg-issue-card-desc">Using pre-2023 factors (DEFRA 2022, ADEME 2021)</p></div>' +
          '<div class="ghg-issue-card"><div class="ghg-issue-card-header"><div class="ghg-issue-card-icon ghg-issue-card-icon--info"><i class="fa-solid fa-bullseye"></i></div><span class="ghg-issue-card-title">Low Specificity</span><span class="ghg-issue-card-count ghg-issue-card-count--info">6,282</span></div><p class="ghg-issue-card-desc">Generic/average EFs where more specific available</p></div></div></div>' +
        '<div class="ghg-quick-actions">' +
          '<div class="ghg-quick-action"><div class="ghg-quick-action-icon"><i class="fa-solid fa-building"></i></div><div class="ghg-quick-action-content"><h4>Review by Entity</h4><p>Drill into EF selections for each organizational entity</p></div><i class="fa-solid fa-chevron-right"></i></div>' +
          '<div class="ghg-quick-action"><div class="ghg-quick-action-icon"><i class="fa-solid fa-layer-group"></i></div><div class="ghg-quick-action-content"><h4>Review by Category</h4><p>Examine emission factors across scope categories</p></div><i class="fa-solid fa-chevron-right"></i></div>' +
          '<div class="ghg-quick-action"><div class="ghg-quick-action-icon"><i class="fa-solid fa-sliders"></i></div><div class="ghg-quick-action-content"><h4>Manage Override Rules</h4><p>Configure rules that automatically override system selections</p></div><span class="ghg-quick-action-badge">8 active rules</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
      '</div></div>' +
    '</div>';
  }

  /* ==============================================
     AUTO-INIT for standalone page
     ============================================== */
  var standaloneRoot = document.querySelector('.ghg-page');
  if (standaloneRoot && !standaloneRoot.classList.contains('ghg-page--embedded')) {
    bindGhgEngine(standaloneRoot);

    var headerActions = standaloneRoot.querySelector('#ghg-header-actions');
    var headerTitle = standaloneRoot.querySelector('#ghg-header-title');
    standaloneRoot.querySelectorAll('.ghg-inv-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (headerActions) headerActions.style.display = 'flex';
        if (headerTitle) headerTitle.textContent = 'Q4 2025 Corporate Inventory';
      });
    });
    standaloneRoot.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="back-to-list"]')) {
        if (headerActions) headerActions.style.display = 'none';
        if (headerTitle) headerTitle.textContent = 'GHG Calculation Engine';
      }
    });
  }

})();
