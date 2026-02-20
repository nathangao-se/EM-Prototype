/* ============================================
   APP SHELL — Left-nav alternate view
   Exposed API:
     window.activateAppShell()
     window.deactivateAppShell()
   ============================================ */
(function () {
  'use strict';

  var NAV_SECTIONS = [
    { id: 'menu',     icon: 'fa-solid fa-arrow-right-to-bracket', label: 'Menu',     expandable: false },
    { id: 'home',     icon: 'fa-solid fa-house',                  label: 'Home',     expandable: false },
    { id: 'collect',  icon: 'fa-solid fa-database',               label: 'Collect',  expandable: true,
      title: 'Data Collection',
      items: [
        { id: 'data-import',       label: 'Data Import',        page: null },
        { id: 'import-templates',  label: 'Import Templates',   page: null },
        { id: 'historical-imports', label: 'Historical Imports', page: null },
        { id: 'activity-mapping',  label: 'Activity Mapping',   page: 'getActivityMapPageContent' }
      ]
    },
    { id: 'monitor',  icon: 'fa-solid fa-chart-line',             label: 'Monitor',  expandable: true,
      title: 'GHG Monitoring',
      items: [
        { id: 'inventory-list',      label: 'Inventory List',      page: 'getGhgEnginePageContent' },
        { id: 'calculation-methods', label: 'Calculation Methods',  page: 'getCalcMethodsPageContent' },
        { id: 'ef-library',         label: 'EF Library',           page: 'getEfLibraryPageContent' },
        { id: 'ef-selection',       label: 'EF Selection',         page: null }
      ]
    },
    { id: 'reports',  icon: 'fa-solid fa-file-lines',             label: 'Reports',  expandable: false },
    { id: 'settings', icon: 'fa-solid fa-sliders',                label: 'Settings', expandable: false }
  ];

  var DEFAULT_SECTION = 'monitor';
  var DEFAULT_ITEM = 'ef-library';

  var shellEl, navEl, contentEl;
  var headerTitle;
  var savedHeaderTitle = '';
  var activeSection = null;
  var activeItem = null;

  function buildNavHTML() {
    var html = '<nav class="shell-nav">';

    html += '<div class="shell-nav-icons">';
    NAV_SECTIONS.forEach(function (s) {
      html += '<button class="shell-nav-icon" data-section="' + s.id + '">';
      html += '<i class="' + s.icon + '"></i>';
      html += '<span>' + s.label + '</span>';
      html += '</button>';
    });
    html += '</div>';

    html += '<div class="shell-nav-panel"></div>';
    html += '</nav>';
    html += '<main class="shell-content"></main>';
    return html;
  }

  function renderPanel(sectionId) {
    var section = null;
    NAV_SECTIONS.forEach(function (s) { if (s.id === sectionId) section = s; });
    if (!section || !section.expandable) return;

    var panel = shellEl.querySelector('.shell-nav-panel');
    var html = '<h2 class="shell-nav-section-title">' + section.title + '</h2>';
    html += '<div class="shell-nav-items">';
    section.items.forEach(function (item) {
      var cls = 'shell-nav-item';
      if (item.id === activeItem) cls += ' shell-nav-item--active';
      if (!item.page) cls += ' shell-nav-item--disabled';
      html += '<button class="' + cls + '" data-item="' + item.id + '">' + item.label + '</button>';
    });
    html += '</div>';
    panel.innerHTML = html;
  }

  function setActiveIcon(sectionId) {
    shellEl.querySelectorAll('.shell-nav-icon').forEach(function (btn) {
      btn.classList.toggle('shell-nav-icon--active', btn.getAttribute('data-section') === sectionId);
    });
  }

  function loadPage(itemId) {
    var itemDef = null;
    NAV_SECTIONS.forEach(function (s) {
      if (s.items) s.items.forEach(function (it) { if (it.id === itemId) itemDef = it; });
    });

    contentEl.innerHTML = '';
    activeItem = itemId;

    shellEl.querySelectorAll('.shell-nav-item').forEach(function (btn) {
      btn.classList.toggle('shell-nav-item--active', btn.getAttribute('data-item') === itemId);
    });

    if (!itemDef || !itemDef.page) {
      contentEl.innerHTML = '<div class="shell-placeholder"><i class="fa-solid fa-hammer"></i><span>Coming soon</span></div>';
      return;
    }

    var getter = window[itemDef.page];
    if (typeof getter !== 'function') {
      contentEl.innerHTML = '<div class="shell-placeholder"><i class="fa-solid fa-circle-exclamation"></i><span>Page not available</span></div>';
      return;
    }

    var opts = itemDef.page === 'getGhgEnginePageContent' ? { skipList: true } : undefined;
    var pageNode = getter(opts);
    contentEl.appendChild(pageNode);
  }

  function selectSection(sectionId) {
    var section = null;
    NAV_SECTIONS.forEach(function (s) { if (s.id === sectionId) section = s; });
    if (!section || !section.expandable) return;

    activeSection = sectionId;
    setActiveIcon(sectionId);
    renderPanel(sectionId);

    if (headerTitle) headerTitle.textContent = section.title;

    var firstPageItem = null;
    section.items.forEach(function (it) {
      if (!firstPageItem && it.page) firstPageItem = it;
    });

    if (activeItem) {
      var inThisSection = false;
      section.items.forEach(function (it) { if (it.id === activeItem) inThisSection = true; });
      if (inThisSection) {
        loadPage(activeItem);
        return;
      }
    }

    if (firstPageItem) {
      loadPage(firstPageItem.id);
    }
  }

  function initShell() {
    shellEl = document.getElementById('app-shell');
    if (!shellEl) return;

    headerTitle = document.querySelector('.header-title');
    shellEl.innerHTML = buildNavHTML();
    contentEl = shellEl.querySelector('.shell-content');

    shellEl.addEventListener('click', function (e) {
      var iconBtn = e.target.closest('.shell-nav-icon');
      if (iconBtn) {
        var sectionId = iconBtn.getAttribute('data-section');
        var sec = null;
        NAV_SECTIONS.forEach(function (s) { if (s.id === sectionId) sec = s; });
        if (sec && sec.expandable) {
          selectSection(sectionId);
        }
        return;
      }

      var itemBtn = e.target.closest('.shell-nav-item');
      if (itemBtn && !itemBtn.classList.contains('shell-nav-item--disabled')) {
        var itemId = itemBtn.getAttribute('data-item');
        loadPage(itemId);
      }
    });
  }

  window.activateAppShell = function () {
    if (!shellEl) initShell();
    if (!shellEl) return;

    savedHeaderTitle = headerTitle ? headerTitle.textContent : '';

    var goals = document.querySelector('.goals');
    var pb = document.querySelector('.project-bar');
    var dash = document.querySelector('.dashboard');
    [goals, pb, dash].forEach(function (el) { if (el) el.classList.add('shell-hidden'); });

    shellEl.classList.add('shell-active');

    activeItem = DEFAULT_ITEM;
    selectSection(DEFAULT_SECTION);
  };

  window.deactivateAppShell = function () {
    if (!shellEl) return;
    shellEl.classList.remove('shell-active');

    var goals = document.querySelector('.goals');
    var pb = document.querySelector('.project-bar');
    var dash = document.querySelector('.dashboard');
    [goals, pb, dash].forEach(function (el) { if (el) el.classList.remove('shell-hidden'); });

    if (headerTitle) headerTitle.textContent = savedHeaderTitle;

    contentEl.innerHTML = '';
    activeSection = null;
    activeItem = null;
  };

})();
