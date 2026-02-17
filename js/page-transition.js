/* ========================================
   PAGE TRANSITION — overlapping staggered dissolve

   All phases trigger in order but overlap smoothly:
     Background fade starts → items begin fading partway through →
     header flip begins while last items are still fading.

   Forward:
     t=0        Background dissolves
     t=80ms     Items start stagger-fading (random order, ~45ms apart)
     t=lastItem Header flip begins (overlaps tail of items)
     t=flip end Sections hidden, new page fades in

   Reverse:
     t=0        Page fades out
     t=150ms    Header flip begins (overlaps page fade tail)
     t=flip end Sections restored, bg fades in, items stagger in
   ======================================== */

(function () {
  'use strict';

  var BG_HEAD_START = 0;
  var ITEM_DELAY = 40;
  var ITEM_STAGGER = 22;
  var ITEM_DURATION = 160;
  var FLIP_HALF = 125;
  var PAGE_FADE = 175;

  var header = document.querySelector('.header');
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

  function collectItems() {
    var items = [];
    if (goalsSection) {
      goalsSection.querySelectorAll('.goals-card').forEach(function (el) { items.push(el); });
      goalsSection.querySelectorAll('.alert-group').forEach(function (el) { items.push(el); });
    }
    if (projectBar) {
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

  function getBgSections() {
    var sections = [];
    if (goalsSection) sections.push(goalsSection);
    if (projectBar && !projectBar.classList.contains('project-bar--hidden')) sections.push(projectBar);
    return sections;
  }

  function flipHeader(midCallback, doneCallback) {
    if (!headerMain || !header) {
      midCallback();
      doneCallback();
      return;
    }
    header.classList.add('pt-header-perspective');
    headerMain.classList.remove('pt-header-flip-half', 'pt-header-flip-back');
    headerMain.classList.add('pt-header-animating');
    void headerMain.offsetWidth;
    headerMain.classList.add('pt-header-flip-half');

    setTimeout(function () {
      midCallback();
      headerMain.classList.remove('pt-header-animating', 'pt-header-flip-half');
      headerMain.style.transform = 'rotateX(-90deg)';
      void headerMain.offsetWidth;
      headerMain.classList.add('pt-header-flip-back');

      setTimeout(function () {
        headerMain.classList.remove('pt-header-flip-back');
        headerMain.style.transform = '';
        header.classList.remove('pt-header-perspective');
        doneCallback();
      }, FLIP_HALF);
    }, FLIP_HALF);
  }

  /**
   * Kick off stagger. Returns the timestamp (ms from now) when the
   * last item's fade will be fully complete.
   */
  function staggerItems(items, direction) {
    if (items.length === 0) return 0;
    var shuffled = shuffle(items.slice());
    shuffled.forEach(function (el, i) {
      setTimeout(function () {
        if (direction === 'out') {
          el.classList.add('pt-item', 'pt-item--out');
        } else {
          el.classList.add('pt-item');
          void el.offsetWidth;
          el.classList.remove('pt-item--out');
        }
      }, i * ITEM_STAGGER);
    });
    return (shuffled.length - 1) * ITEM_STAGGER + ITEM_DURATION;
  }

  // ============================
  // FORWARD
  // ============================
  window.runPageTransition = function (options) {
    var triggerEl = options.triggerEl;
    var pageContent = options.pageContent;
    var title = options.title || 'Activity mapping';
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

    var bgSections = getBgSections();
    var items = collectItems();

    // t=0: backgrounds start dissolving
    bgSections.forEach(function (el) {
      el.classList.add('pt-bg-fade', 'pt-bg-fade--out');
    });

    // t=ITEM_DELAY: items start stagger-fading (overlaps bg fade)
    setTimeout(function () {
      var totalItemTime = staggerItems(items, 'out');

      // Header flip starts when ~75% of items have begun fading
      // (overlaps with the tail end of item fades)
      var flipDelay = Math.max(0, totalItemTime - ITEM_DURATION - FLIP_HALF * 0.5);
      setTimeout(function () {
        flipHeader(
          function () {
            if (headerMain && cardColor) headerMain.style.backgroundColor = cardColor;
            if (headerTitle) headerTitle.textContent = title;
            if (headerActions) {
              headerActions.innerHTML =
                '<button class="btn btn-outline pt-back-btn">' +
                  '<i class="fa-solid fa-arrow-left"></i>' +
                  '<span>Back</span>' +
                '</button>';
              var backBtn = headerActions.querySelector('.pt-back-btn');
              if (backBtn) {
                backBtn.addEventListener('click', function () {
                  window.exitPageTransition();
                });
              }
            }
          },
          function () {
            [goalsSection, projectBar, dashboardSection].forEach(function (el) {
              if (el) el.classList.add('pt-hidden');
            });
            requestAnimationFrame(function () {
              pageSection.classList.add('pt-page-section--visible');
            });
          }
        );
      }, flipDelay);
    }, ITEM_DELAY);
  };

  // ============================
  // REVERSE
  // ============================
  window.exitPageTransition = function () {
    if (!currentState || !pageSection) return;
    var state = currentState;

    // Step 1: page starts fading out
    pageSection.classList.remove('pt-page-section--visible');

    // Step 2: header flip begins partway through page fade (overlaps)
    setTimeout(function () {
      flipHeader(
        function () {
          if (headerMain) headerMain.style.backgroundColor = state.savedBg;
          if (headerTitle) headerTitle.textContent = state.savedTitle;
          if (headerActions) headerActions.innerHTML = state.savedActionsHTML;
        },
        function () {
          // Unhide sections
          [goalsSection, projectBar, dashboardSection].forEach(function (el) {
            if (el) el.classList.remove('pt-hidden');
          });

          // Restore backgrounds (overlaps with item fade-in)
          var bgSections = getBgSections();
          bgSections.forEach(function (el) {
            void el.offsetWidth;
            el.classList.remove('pt-bg-fade--out');
          });

          // Items stagger in (overlaps bg restore)
          var items = collectItems();
          requestAnimationFrame(function () {
            var totalItemTime = staggerItems(items, 'in');

            setTimeout(function () {
              items.forEach(function (el) {
                el.classList.remove('pt-item', 'pt-item--out');
              });
              bgSections.forEach(function (el) {
                el.classList.remove('pt-bg-fade', 'pt-bg-fade--out');
              });
              if (pageSection && pageSection.parentNode) {
                pageSection.parentNode.removeChild(pageSection);
              }
              pageSection = null;
              currentState = null;
              state.onExit();
            }, totalItemTime + 25);
          });
        }
      );
    }, 75);
  };
})();
