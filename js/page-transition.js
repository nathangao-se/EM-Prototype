/* ========================================
   PAGE TRANSITION — unified staggered dissolve

   Every stage uses the same effect: items fade+zoom in random
   order, with header pinned last (out) / first (in).

   Forward:
     Stage 1 — main out:   all main items stagger out (header last)
     [swap header content while invisible]
     Stage 2 — page in:    all page items stagger in (header first)

   Reverse:
     Stage 3 — page out:   all page items stagger out (header last)
     [restore header content while invisible]
     Stage 4 — main in:    all main items stagger in (header first)
   ======================================== */

(function () {
  'use strict';

  var ITEM_STAGGER = 22;
  var ITEM_DURATION = 160;
  var BETWEEN_STAGES = 40;

  var headerMain = document.querySelector('.header-main');
  var headerTitle = document.querySelector('.header-title');
  var headerActions = document.querySelector('.header-actions');
  var goalsSection = document.querySelector('.goals');
  var dashboardSection = document.querySelector('.dashboard');
  var projectBar = document.querySelector('.project-bar');
  var appContainer = document.querySelector('.app-container');

  var pageSection = null;
  var currentState = null;

  function getParentCardColor(triggerEl) {
    var card = triggerEl && triggerEl.closest('.project-bar__card');
    if (!card) return null;
    var style = window.getComputedStyle(card);
    var bg = style.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    var section = triggerEl && triggerEl.closest('.project-bar');
    if (section) return window.getComputedStyle(section).backgroundColor;
    return '#eaf5ef';
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  // ------------------------------------------------------------------
  // Item collectors
  // ------------------------------------------------------------------

  function collectMainItems() {
    var items = [];
    if (goalsSection) {
      goalsSection.querySelectorAll('.goals-card').forEach(function (el) { items.push(el); });
      goalsSection.querySelectorAll('.alert-group').forEach(function (el) { items.push(el); });
    }
    if (projectBar && !projectBar.classList.contains('project-bar--hidden')) {
      var pbTitle = projectBar.querySelector('.project-bar__title');
      if (pbTitle) items.push(pbTitle);
      projectBar.querySelectorAll('.project-bar__card').forEach(function (el) { items.push(el); });
    }
    if (dashboardSection) {
      var tabs = dashboardSection.querySelector('.dashboard-tabs');
      if (tabs) items.push(tabs);
      var controlCard = dashboardSection.querySelector('.dashboard-control-card');
      if (controlCard) items.push(controlCard);
      var hierarchyCard = dashboardSection.querySelector('.dashboard-hierarchy-card');
      if (hierarchyCard) items.push(hierarchyCard);
      var divider = dashboardSection.querySelector('.dashboard-divider');
      if (divider) items.push(divider);
      var detailNav = dashboardSection.querySelector('.dashboard-detail-nav');
      if (detailNav) items.push(detailNav);
      var detailExpanded = dashboardSection.querySelector('.dashboard-detail-expanded');
      if (detailExpanded) items.push(detailExpanded);
    }
    return items;
  }

  function collectPageItems(container) {
    if (!container) return [];
    var items = [];
    container.querySelectorAll('.dm-top-row > .goals-card').forEach(function (el) { items.push(el); });
    container.querySelectorAll('.dm-filter-row').forEach(function (el) { items.push(el); });
    var filterFooter = container.querySelector('.dm-filter-footer');
    if (filterFooter) items.push(filterFooter);
    var toolbar = container.querySelector('.dm-toolbar');
    if (toolbar) items.push(toolbar);
    var tableScroll = container.querySelector('.dm-table-scroll');
    if (tableScroll) items.push(tableScroll);
    return items;
  }

  // ------------------------------------------------------------------
  // Build ordered list: shuffle freely, pin header last (out) or first (in)
  // ------------------------------------------------------------------

  function buildOrder(items, direction) {
    var others = items.filter(function (el) { return el !== headerMain; });
    shuffle(others);
    if (direction === 'out') {
      others.push(headerMain);
    } else {
      others.unshift(headerMain);
    }
    return others;
  }

  // ------------------------------------------------------------------
  // Stagger engine — applies the same fade+zoom to every item
  // ------------------------------------------------------------------

  function staggerOut(ordered, done) {
    ordered.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('pt-item', 'pt-item--out');
      }, i * ITEM_STAGGER);
    });
    var total = (ordered.length - 1) * ITEM_STAGGER + ITEM_DURATION;
    setTimeout(done, total);
  }

  function staggerIn(ordered, done) {
    ordered.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('pt-item', 'pt-item--in-start');
        void el.offsetWidth;
        el.classList.remove('pt-item--out', 'pt-item--in-start');
      }, i * ITEM_STAGGER);
    });
    var total = (ordered.length - 1) * ITEM_STAGGER + ITEM_DURATION;
    setTimeout(done, total);
  }

  function hideInstantly(items) {
    items.forEach(function (el) {
      el.classList.add('pt-item', 'pt-item--out');
    });
  }

  function cleanAll(items) {
    items.forEach(function (el) {
      el.classList.remove('pt-item', 'pt-item--out', 'pt-item--in-start');
    });
  }

  // ------------------------------------------------------------------
  // FORWARD  (main → other page)
  // ------------------------------------------------------------------

  window.runPageTransition = function (options) {
    var triggerEl = options.triggerEl;
    var pageContent = options.pageContent;
    var title = options.title || 'Activity Data';
    var onExit = options.onExit || function () {};

    if (!appContainer || !pageContent) return;

    var savedBg = headerMain ? (headerMain.style.backgroundColor || '') : '';
    var savedTitle = headerTitle ? headerTitle.textContent : '';
    var savedActionsHTML = headerActions ? headerActions.innerHTML : '';
    var cardColor = getParentCardColor(triggerEl);

    pageSection = document.createElement('section');
    pageSection.className = 'pt-page-section';
    pageSection.appendChild(pageContent);
    appContainer.appendChild(pageSection);

    currentState = {
      onExit: onExit,
      savedBg: savedBg,
      savedTitle: savedTitle,
      savedActionsHTML: savedActionsHTML
    };

    var mainItems = collectMainItems();
    var newPageItems = collectPageItems(pageSection);

    // Pre-hide all new page items + header (for stage 2)
    hideInstantly(newPageItems);

    // --- Stage 1: stagger OUT main items (header last) ---
    var outOrder = buildOrder(mainItems, 'out');
    staggerOut(outOrder, function () {

      // --- Between stages: swap header content while invisible ---
      if (headerMain && cardColor) headerMain.style.backgroundColor = cardColor;
      if (headerTitle) headerTitle.textContent = title;
      if (headerActions) headerActions.style.display = 'none';
      var backBtn = document.createElement('button');
      backBtn.className = 'btn btn-outline pt-back-btn';
      backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i><span>Back</span>';
      backBtn.addEventListener('click', function () {
        window.exitPageTransition();
      });
      if (headerMain && headerTitle) {
        headerMain.insertBefore(backBtn, headerTitle);
      }

      // Hide main sections
      [goalsSection, projectBar, dashboardSection].forEach(function (el) {
        if (el) el.classList.add('pt-hidden');
      });

      // Clean out classes from main items
      cleanAll(mainItems);

      // --- Stage 2: stagger IN page items (header first) ---
      setTimeout(function () {
        var inOrder = buildOrder(newPageItems, 'in');
        staggerIn(inOrder, function () {
          cleanAll(newPageItems);
          if (headerMain) headerMain.classList.remove('pt-item', 'pt-item--out', 'pt-item--in-start');
        });
      }, BETWEEN_STAGES);
    });
  };

  // ------------------------------------------------------------------
  // REVERSE  (other page → main)
  // ------------------------------------------------------------------

  window.exitPageTransition = function () {
    if (!currentState || !pageSection) return;
    var state = currentState;

    var pageItems = collectPageItems(pageSection);
    var mainItems = collectMainItems();

    // Pre-hide all main items + header (for stage 4)
    hideInstantly(mainItems);

    // --- Stage 3: stagger OUT page items (header last) ---
    var outOrder = buildOrder(pageItems, 'out');
    staggerOut(outOrder, function () {

      // --- Between stages: restore header content while invisible ---
      if (headerMain) headerMain.style.backgroundColor = state.savedBg;
      if (headerTitle) headerTitle.textContent = state.savedTitle;
      var oldBack = headerMain && headerMain.querySelector('.pt-back-btn');
      if (oldBack) oldBack.parentNode.removeChild(oldBack);
      if (headerActions) {
        headerActions.innerHTML = state.savedActionsHTML;
        headerActions.style.display = '';
      }

      // Remove page, unhide main sections
      if (pageSection && pageSection.parentNode) {
        pageSection.parentNode.removeChild(pageSection);
      }
      pageSection = null;

      [goalsSection, projectBar, dashboardSection].forEach(function (el) {
        if (el) el.classList.remove('pt-hidden');
      });

      // Clean out classes from page items
      cleanAll(pageItems);

      // --- Stage 4: stagger IN main items (header first) ---
      setTimeout(function () {
        var inOrder = buildOrder(mainItems, 'in');
        staggerIn(inOrder, function () {
          cleanAll(mainItems);
          if (headerMain) headerMain.classList.remove('pt-item', 'pt-item--out', 'pt-item--in-start');
          currentState = null;
          state.onExit();
        });
      }, BETWEEN_STAGES);
    });
  };
})();
