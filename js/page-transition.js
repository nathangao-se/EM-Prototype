/* ========================================
   PAGE TRANSITION — unified staggered dissolve

   Ordering rules (always apply unless explicitly retracted):
     RULE 1 — Header is always LAST out and FIRST in.
     RULE 2 — Section backgrounds (goals, project areas) always
              transition out BEFORE their cards and in AFTER them,
              using a slightly slower background-only fade.
     RULE 3 — All remaining items follow left-to-right screen order.
     RULE 4 — OUT uses bottom-to-top vertical order; IN uses top-to-bottom.

   Forward:
     Stage 1 — main out:   section bgs → cards L→R B→T → others L→R B→T → header
     [swap header content while invisible]
     Stage 2 — page in:    header → cards L→R T→B → others L→R T→B

   Reverse:
     Stage 3 — page out:   cards L→R B→T → others L→R B→T → header
     [restore header content while invisible]
     Stage 4 — main in:    header → cards L→R T→B → others L→R T→B → section bgs
   ======================================== */

(function () {
  'use strict';

  // --- Timing ---------------------------------------------------------------
  var ITEM_STAGGER   = 13;
  var ITEM_DURATION  = 96;
  var BG_DURATION    = 132;   // section backgrounds: slightly slower (RULE 2)
  var BETWEEN_STAGES = 24;

  var headerMain = document.querySelector('.header-main');
  var headerUser = document.querySelector('.header-user');
  var headerTitle = document.querySelector('.header-title');
  var headerActions = document.querySelector('.header-actions');
  var goalsSection = document.querySelector('.goals');
  var dashboardSection = document.querySelector('.dashboard');
  var projectBar = document.querySelector('.project-bar');
  var appContainer = document.querySelector('.app-container');

  var pageSection = null;
  var currentState = null;
  var dimOverlay = null;

  function ensureDimDOM() {
    if (!dimOverlay) {
      dimOverlay = document.createElement('div');
      dimOverlay.className = 'pt-dim-overlay';
      document.body.appendChild(dimOverlay);
    }
  }

  function playDimAnimation(done) {
    ensureDimDOM();
    dimOverlay.classList.remove('pt-dim-overlay--animate');
    void dimOverlay.offsetWidth;
    function onEnd() {
      dimOverlay.removeEventListener('animationend', onEnd);
      dimOverlay.classList.remove('pt-dim-overlay--animate');
      if (done) done();
    }
    dimOverlay.addEventListener('animationend', onEnd);
    dimOverlay.classList.add('pt-dim-overlay--animate');
  }

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

  // --- Ordering rule helpers (RULE 1 / RULE 2) ---

  function isBgSection(el) {
    return el === goalsSection || el === projectBar;
  }

  function isGoalOrPbCard(el) {
    if (isBgSection(el)) return false;
    return !!el.closest('.goals') || !!el.closest('.project-bar');
  }

  function sortByPosition(arr, bottomToTop) {
    arr.sort(function (a, b) {
      var rA = a.getBoundingClientRect();
      var rB = b.getBoundingClientRect();
      if (rA.left !== rB.left) return rA.left - rB.left;
      return bottomToTop ? rB.top - rA.top : rA.top - rB.top;
    });
    return arr;
  }

  // ------------------------------------------------------------------
  // Item collectors
  // ------------------------------------------------------------------

  function collectMainItems() {
    var items = [];
    if (goalsSection) {
      items.push(goalsSection);
      goalsSection.querySelectorAll('.goals-card').forEach(function (el) { items.push(el); });
      goalsSection.querySelectorAll('.alert-group').forEach(function (el) { items.push(el); });
    }
    if (projectBar && !projectBar.classList.contains('project-bar--hidden')) {
      items.push(projectBar);
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

    // Activity-map — collect top-level visual blocks as units so their
    // borders/backgrounds fade with their content (no nested duplicates)
    var pageTitle = container.querySelector('.dm-page-title');
    if (pageTitle) items.push(pageTitle);
    container.querySelectorAll('.dm-top-row > .goals-card').forEach(function (el) { items.push(el); });
    container.querySelectorAll('.dm-filter-card').forEach(function (el) { items.push(el); });
    container.querySelectorAll('.dm-table-wrap').forEach(function (el) { items.push(el); });

    // Generic: any page can mark children with .pt-stagger-item
    container.querySelectorAll('.pt-stagger-item').forEach(function (el) { items.push(el); });

    return items;
  }

  // ------------------------------------------------------------------
  // Build ordered list  (RULE 1 + RULE 2 + RULE 3 + RULE 4)
  //   OUT:  section bgs → cards L→R B→T → others L→R B→T → header
  //   IN:   header → cards L→R T→B → others L→R T→B → section bgs
  // ------------------------------------------------------------------

  function buildOrder(items, direction) {
    var bgSections   = [];
    var goalPbCards  = [];
    var otherItems   = [];
    var btt = direction === 'out';

    items.forEach(function (el) {
      if (el === headerMain || el === headerUser) return;
      if (isBgSection(el))      bgSections.push(el);
      else if (isGoalOrPbCard(el)) goalPbCards.push(el);
      else                         otherItems.push(el);
    });

    sortByPosition(bgSections, btt);
    sortByPosition(goalPbCards, btt);
    sortByPosition(otherItems, btt);

    var headerOut = headerUser ? [headerUser, headerMain] : [headerMain];
    var headerIn  = headerUser ? [headerMain, headerUser] : [headerMain];

    if (direction === 'out') {
      return bgSections.concat(goalPbCards, otherItems, headerOut);
    }
    return headerIn.concat(goalPbCards, otherItems, bgSections);
  }

  // ------------------------------------------------------------------
  // Stagger engine — cards use fade+zoom, bg sections use bg fade
  // ------------------------------------------------------------------

  function staggerOut(ordered, done) {
    var maxEnd = 0;
    ordered.forEach(function (el, i) {
      var bg  = isBgSection(el);
      var dur = bg ? BG_DURATION : ITEM_DURATION;
      el.style.setProperty('--pt-delay', (i * ITEM_STAGGER) + 'ms');
      if (bg) {
        el.classList.add('pt-bg-item', 'pt-bg-item--out');
      } else {
        el.classList.add('pt-item', 'pt-item--out');
      }
      var end = i * ITEM_STAGGER + dur;
      if (end > maxEnd) maxEnd = end;
    });
    setTimeout(done, maxEnd);
  }

  function staggerIn(ordered, done) {
    var maxEnd = 0;
    ordered.forEach(function (el, i) {
      var bg = isBgSection(el);
      var dur = bg ? BG_DURATION : ITEM_DURATION;
      el.style.setProperty('--pt-delay', (i * ITEM_STAGGER) + 'ms');
      if (bg) {
        el.classList.add('pt-bg-item', 'pt-bg-item--in-start');
      } else {
        el.classList.add('pt-item', 'pt-item--in-start');
      }
      var end = i * ITEM_STAGGER + dur;
      if (end > maxEnd) maxEnd = end;
    });
    void document.body.offsetWidth;
    ordered.forEach(function (el) {
      var bg = isBgSection(el);
      if (bg) {
        el.classList.remove('pt-bg-item--out', 'pt-bg-item--in-start');
      } else {
        el.classList.remove('pt-item--out', 'pt-item--in-start');
      }
    });
    setTimeout(done, maxEnd);
  }

  function hideInstantly(items) {
    items.forEach(function (el) {
      if (isBgSection(el)) {
        el.classList.add('pt-bg-item', 'pt-bg-item--out');
      } else {
        el.classList.add('pt-item', 'pt-item--out');
      }
    });
  }

  function cleanAll(items) {
    items.forEach(function (el) {
      el.classList.remove(
        'pt-item', 'pt-item--out', 'pt-item--in-start',
        'pt-bg-item', 'pt-bg-item--out', 'pt-bg-item--in-start'
      );
      el.style.removeProperty('--pt-delay');
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

    // Blanket-hide the entire page section so nothing leaks through during dim
    pageSection.classList.add('pt-item', 'pt-item--out');

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

      // Hide main sections, lock container to viewport
      if (appContainer) appContainer.classList.add('app-container--page');
      [goalsSection, projectBar, dashboardSection].forEach(function (el) {
        if (el) el.classList.add('pt-hidden');
      });

      // Clean out classes from main items
      cleanAll(mainItems);

      // --- Dim animation between stages ---
      playDimAnimation(function () {
        // Remove blanket hide so page section content can stagger in
        cleanAll([pageSection]);

        // --- Stage 2: stagger IN page items (header first) ---
        setTimeout(function () {
          var inOrder = buildOrder(newPageItems, 'in');
          staggerIn(inOrder, function () {
            cleanAll(newPageItems);
            if (headerMain) cleanAll([headerMain]);
            if (headerUser) cleanAll([headerUser]);
          });
        }, BETWEEN_STAGES);
      });
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

      // Blanket-hide the page section so nothing is visible during dim
      pageSection.classList.add('pt-item', 'pt-item--out');

      // --- Dim animation between stages ---
      playDimAnimation(function () {

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

        if (appContainer) appContainer.classList.remove('app-container--page');
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
            if (headerMain) cleanAll([headerMain]);
            if (headerUser) cleanAll([headerUser]);
            currentState = null;
            state.onExit();
          });
        }, BETWEEN_STAGES);
      });
    });
  };
  // ------------------------------------------------------------------
  // CONFIG SWAP  (e.g. global admin ↔ site manager)
  // Same stagger rules, but the header stays visible throughout.
  // ------------------------------------------------------------------

  var configTransitioning = false;

  window.runConfigTransition = function (swapFn) {
    if (!swapFn || configTransitioning) return;
    configTransitioning = true;

    var oldItems = collectMainItems();
    var skipHeader = function (el) { return el !== headerMain && el !== headerUser; };

    var outOrder = buildOrder(oldItems, 'out').filter(skipHeader);

    staggerOut(outOrder, function () {
      swapFn();

      var newItems = collectMainItems();
      hideInstantly(newItems.filter(skipHeader));

      setTimeout(function () {
        var inOrder = buildOrder(newItems, 'in').filter(skipHeader);
        staggerIn(inOrder, function () {
          cleanAll(newItems);
          configTransitioning = false;
        });
      }, BETWEEN_STAGES);
    });
  };
})();
