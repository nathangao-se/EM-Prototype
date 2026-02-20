/* ============================================
   GHG INVENTORIES LIST PAGE
   Exposed API:
     window.getGhgInventoriesPageContent(options) -> DOM node
       options.onOpenInventory(inv) — callback when a card is clicked
       options.onCreateInventory()  — callback for Create Inventory btn
   ============================================ */
(function () {
  'use strict';

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  var INVENTORIES = [
    { id: 'q4-2025', title: 'Q4 2025 Corporate Inventory', meta: 'Oct 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities',
      value: '1,061.9', valueLabel: 'tCO\u2082e Total', status: 'Calculated', statusType: 'success', icon: 'fa-solid fa-calculator', iconType: 'calc' },
    { id: 'q3-2025', title: 'Q3 2025 Corporate Inventory', meta: 'Jul 1 \u2013 Sep 30, 2025 \u2022 GHG Protocol \u2022 4 entities',
      value: '987.3', valueLabel: 'tCO\u2082e Total', status: 'Locked', statusType: 'success', icon: 'fa-solid fa-lock', iconType: 'locked' },
    { id: 'draft',   title: 'FY 2025 Annual Report',       meta: 'Jan 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities',
      value: '\u2014', valueLabel: 'Not calculated', status: 'Draft', statusType: 'warning', icon: 'fa-solid fa-pencil', iconType: 'draft' }
  ];

  function statusIcon(type) {
    if (type === 'success') return '<i class="fa-solid fa-circle-check"></i> ';
    if (type === 'warning') return '<i class="fa-solid fa-clock"></i> ';
    return '';
  }

  function buildCardHTML(inv) {
    var html = '<div class="gi-card" data-inv="' + inv.id + '">';
    html += '<div class="gi-card-left">';
    html += '<div class="gi-card-icon gi-card-icon--' + inv.iconType + '"><i class="' + inv.icon + '"></i></div>';
    html += '<div><div class="gi-card-title">' + esc(inv.title) + '</div>';
    html += '<div class="gi-card-meta">' + inv.meta + '</div></div>';
    html += '</div>';
    html += '<div class="gi-card-right">';
    html += '<div class="gi-card-stat"><div class="gi-card-stat-value">' + inv.value + '</div>';
    html += '<div class="gi-card-stat-label">' + inv.valueLabel + '</div></div>';
    html += '<span class="gi-badge gi-badge--' + inv.statusType + '">' + statusIcon(inv.statusType) + inv.status + '</span>';
    html += '<i class="fa-solid fa-chevron-right gi-card-chevron"></i>';
    html += '</div></div>';
    return html;
  }

  function getBodyHTML() {
    var html = '';

    html += '<div class="gi-page-header pt-stagger-item">';
    html += '<div class="gi-page-header-left">';
    html += '<div class="gi-breadcrumb"><span>Monitor</span><i class="fa-solid fa-chevron-right"></i><span>GHG Inventories</span></div>';
    html += '<h1 class="gi-page-title">GHG Inventories</h1>';
    html += '<p class="gi-page-subtitle">Create, calculate, and manage your emissions inventories</p>';
    html += '</div>';
    html += '<div class="gi-page-header-right">';
    html += '<button class="btn btn-primary btn-small gi-create-btn"><i class="fa-solid fa-plus"></i> Create Inventory</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="gi-toolbar pt-stagger-item">';
    html += '<div class="gi-search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="gi-search" placeholder="Search inventories\u2026"></div>';
    html += '<button class="btn btn-outline btn-small"><i class="fa-solid fa-filter"></i> Filter</button>';
    html += '</div>';

    html += '<div class="gi-card-list pt-stagger-item">';
    INVENTORIES.forEach(function (inv) { html += buildCardHTML(inv); });
    html += '</div>';

    return html;
  }

  window.getGhgInventoriesPageContent = function (options) {
    options = options || {};
    var wrap = document.createElement('div');
    wrap.className = 'gi-page';
    wrap.innerHTML = getBodyHTML();

    wrap.addEventListener('click', function (e) {
      var card = e.target.closest('.gi-card');
      if (card && typeof options.onOpenInventory === 'function') {
        var invId = card.getAttribute('data-inv');
        var inv = null;
        INVENTORIES.forEach(function (i) { if (i.id === invId) inv = i; });
        options.onOpenInventory(inv || { id: invId, title: invId });
        return;
      }
      var createBtn = e.target.closest('.gi-create-btn');
      if (createBtn && typeof options.onCreateInventory === 'function') {
        options.onCreateInventory();
      }
    });

    var searchInput = wrap.querySelector('.gi-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = searchInput.value.toLowerCase();
        wrap.querySelectorAll('.gi-card').forEach(function (card) {
          var title = card.querySelector('.gi-card-title');
          var meta = card.querySelector('.gi-card-meta');
          var text = ((title ? title.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase();
          card.style.display = q && text.indexOf(q) === -1 ? 'none' : '';
        });
      });
    }

    return wrap;
  };

})();
