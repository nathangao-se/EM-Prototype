/* ========================================
   PAGE TRANSITION — generic non-modal/sidebar transitions
   Use for: Activity Map and any other full-page transition from a card.

   Flow (forward):
     1. Goals + dashboard fade out (300ms)
     2. Source card morphs to header-left size and moves up; header-left moves up (400ms)
     3. Page content fades/zooms in (300ms)

   Flow (reverse): same steps in reverse.
   ======================================== */

(function () {
  'use strict';

  var DURATION_FADE = 300;
  var DURATION_MORPH = 400;

  var appContainer = document.querySelector('.app-container');
  var headerMain = document.querySelector('.header-main');
  var goalsSection = document.querySelector('.goals');
  var dashboardSection = document.querySelector('.dashboard');
  var projectBar = document.querySelector('.project-bar');

  var pageViewEl = null;
  var cardClone = null;
  var currentState = null;

  function getPageView() {
    if (!pageViewEl) {
      pageViewEl = document.getElementById('page-transition-view');
    }
    return pageViewEl;
  }

  /** Returns the element into which page content should be appended (e.g. for Activity Map). */
  window.getTransitionMountPoint = function () {
    var view = ensurePageViewContainer();
    return view.querySelector('.pt-page-content');
  };

  function ensurePageViewContainer() {
    var view = getPageView();
    if (view) return view;
    view = document.createElement('div');
    view.id = 'page-transition-view';
    view.className = 'pt-page-view';
    var inner = document.createElement('div');
    inner.className = 'pt-page-content';
    view.appendChild(inner);
    document.body.appendChild(view);
    return view;
  }

  /**
   * Run the forward transition to show a page.
   * @param {Object} options
   * @param {HTMLElement} options.triggerEl - Button or element that was clicked (will find containing .project-bar__card)
   * @param {HTMLElement} options.pageContent - The DOM element to show as the page (will be moved into transition view)
   * @param {function} [options.onExit] - Called when user exits (after reverse transition)
   */
  window.runPageTransition = function (options) {
    var triggerEl = options.triggerEl;
    var pageContent = options.pageContent;
    var onExit = options.onExit || function () {};

    var card = triggerEl && triggerEl.closest('.project-bar__card');
    if (!card || !headerMain || !pageContent) {
      if (pageContent && pageContent.parentNode) {
        var view = ensurePageViewContainer();
        var wrap = view.querySelector('.pt-page-content');
        wrap.innerHTML = '';
        wrap.appendChild(pageContent);
        view.classList.add('pt-page-visible');
      }
      return;
    }

    var view = ensurePageViewContainer();
    var wrap = view.querySelector('.pt-page-content');
    wrap.innerHTML = '';
    wrap.appendChild(pageContent);

    var cardRect = card.getBoundingClientRect();
    var headerRect = headerMain.getBoundingClientRect();

    currentState = {
      card: card,
      cardRect: cardRect,
      headerRect: headerRect,
      onExit: onExit,
      view: view,
      wrap: wrap,
      pageContent: pageContent
    };

    // Step 1: Fade goals and dashboard
    if (appContainer) appContainer.classList.add('pt-project-bar-hidden');
    if (goalsSection) { goalsSection.classList.add('pt-fade-target', 'pt-fade-out'); }
    if (dashboardSection) { dashboardSection.classList.add('pt-fade-target', 'pt-fade-out'); }

    setTimeout(function () {
      // Step 2: Clone card as skeleton only (no inner content), morph; push header up
      cardClone = card.cloneNode(true);
      cardClone.innerHTML = '';
      cardClone.className = cardClone.className + ' pt-card-clone';
      cardClone.style.width = cardRect.width + 'px';
      cardClone.style.height = cardRect.height + 'px';
      cardClone.style.transform =
        'translate(' + cardRect.left + 'px, ' + cardRect.top + 'px) scale(1)';
      document.body.appendChild(cardClone);

      headerMain.classList.add('pt-header-push', 'pt-header-up');

      var scaleX = headerRect.width / cardRect.width;
      var scaleY = headerRect.height / cardRect.height;
      cardClone.style.transform =
        'translate(' + headerRect.left + 'px, ' + headerRect.top + 'px) scale(' + scaleX + ', ' + scaleY + ')';

      setTimeout(function () {
        // Step 3: Show page view
        view.classList.add('pt-page-visible');
        if (cardClone && cardClone.parentNode) {
          cardClone.parentNode.removeChild(cardClone);
          cardClone = null;
        }
      }, DURATION_MORPH);
    }, DURATION_FADE);
  };

  /**
   * Run the reverse transition and return to main screen.
   */
  window.exitPageTransition = function () {
    if (!currentState) return;
    var state = currentState;
    var view = state.view;
    var wrap = state.wrap;
    var pageContent = state.pageContent;
    var onExit = state.onExit;

    view.classList.remove('pt-page-visible');

    setTimeout(function () {
      var card = state.card;
      var cardRect = state.cardRect;
      var headerRect = state.headerRect;

      headerMain.classList.remove('pt-header-up');

      cardClone = card.cloneNode(true);
      cardClone.innerHTML = '';
      cardClone.className = cardClone.className + ' pt-card-clone';
      cardClone.style.width = cardRect.width + 'px';
      cardClone.style.height = cardRect.height + 'px';
      var scaleX = headerRect.width / cardRect.width;
      var scaleY = headerRect.height / cardRect.height;
      cardClone.style.transform =
        'translate(' + headerRect.left + 'px, ' + headerRect.top + 'px) scale(' + scaleX + ', ' + scaleY + ')';
      document.body.appendChild(cardClone);

      requestAnimationFrame(function () {
        cardClone.style.transition = 'transform 400ms ease';
        cardClone.style.transform =
          'translate(' + cardRect.left + 'px, ' + cardRect.top + 'px) scale(1)';
      });

      setTimeout(function () {
        if (cardClone && cardClone.parentNode) {
          cardClone.parentNode.removeChild(cardClone);
          cardClone = null;
        }
        if (appContainer) appContainer.classList.remove('pt-project-bar-hidden');
        if (goalsSection) { goalsSection.classList.remove('pt-fade-target', 'pt-fade-out'); }
        if (dashboardSection) { dashboardSection.classList.remove('pt-fade-target', 'pt-fade-out'); }

        wrap.innerHTML = '';
        if (pageContent && pageContent.parentNode) pageContent.parentNode.removeChild(pageContent);
        currentState = null;
        onExit();
      }, DURATION_MORPH);
    }, DURATION_FADE);
  };

})();
