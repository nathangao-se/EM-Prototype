/* ========================================
   PROJECT STATUS BAR
   Renders a modular project-overview section
   between goals and dashboard.

   Exposed API:
     window.renderProjectBar(config)
     window.hideProjectBar()
     window.showProjectBar()
   ======================================== */

(function () {
  'use strict';

  var container = document.querySelector('.project-bar');
  if (!container) return;

  // ------------------------------------------
  // DATA — lives on the config object at
  //   config.projectBar  (array of card objects)
  //
  // Each card:
  //   { label, value, unit, subtitle, progress,
  //     icon?, iconBg?, chip?, actions[] }
  //
  //   action: { label, icon? }
  // ------------------------------------------

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function buildCard(card) {
    var html = '<div class="kpi-card project-bar__card">';

    // Heading row
    html += '<div class="project-bar__card-heading">';
    html += '<span class="project-bar__card-label">' + esc(card.label) + '</span>';
    if (card.chip) {
      html +=
        '<span class="project-bar__chip project-bar__chip--blue">' +
          (card.chipIcon ? '<i class="' + esc(card.chipIcon) + ' project-bar__chip-icon"></i>' : '') +
          '<span>' + esc(card.chip) + '</span>' +
        '</span>';
    }
    html += '</div>';

    // KPI row
    html += '<div class="project-bar__kpi">';
    if (card.icon) {
      var iconBgClass = card.iconBg ? ' project-bar__kpi-icon--' + card.iconBg : '';
      html +=
        '<div class="project-bar__kpi-icon' + iconBgClass + '">' +
          '<i class="' + esc(card.icon) + '"></i>' +
        '</div>';
    }
    html += '<span class="project-bar__kpi-value">' + esc(card.value) + '</span>';
    html += '<span class="project-bar__kpi-unit">' + esc(card.unit) + '</span>';
    html += '</div>';

    // Subtitle
    if (card.subtitle) {
      html += '<p class="project-bar__subtitle">' + esc(card.subtitle) + '</p>';
    }

    // Progress bar
    if (typeof card.progress === 'number') {
      var pct = Math.max(0, Math.min(100, card.progress));
      html +=
        '<div class="project-bar__progress">' +
          '<div class="project-bar__progress-fill" style="width:' + pct + '%"></div>' +
          '<div class="project-bar__progress-bg"></div>' +
        '</div>';
    }

    // Action buttons (and optional dropdown), split into left/right slots
    var hasActions = (card.actions && card.actions.length) || card.dropdown;
    if (hasActions) {
      var leftActions = [];
      var rightActions = [];
      if (card.actions) {
        card.actions.forEach(function (a) { (a.slot === 'left' ? leftActions : rightActions).push(a); });
      }
      var dropdownSlot = card.dropdown && card.dropdown.slot === 'left' ? 'left' : 'right';

      function renderBtn(a) {
        var attrs = a.actionId ? ' data-action-id="' + esc(a.actionId) + '"' : '';
        return '<button class="project-bar__btn"' + attrs + '>' +
          (a.icon ? '<i class="' + esc(a.icon) + '"></i>' : '') +
          '<span>' + esc(a.label) + '</span>' +
        '</button>';
      }

      function renderDropdown(dd) {
        var h = '<div class="project-bar__dropdown">';
        h += '<button class="project-bar__dropdown-toggle">';
        if (dd.icon) h += '<i class="' + esc(dd.icon) + '"></i>';
        h += '<span>' + esc(dd.label) + '</span>';
        h += '<i class="fa-solid fa-chevron-down project-bar__dropdown-chevron"></i>';
        h += '</button>';
        h += '<div class="project-bar__dropdown-menu">';
        dd.items.forEach(function (item) {
          var attrs = item.actionId ? ' data-action-id="' + esc(item.actionId) + '"' : '';
          h += '<button class="project-bar__dropdown-item"' + attrs + '>';
          h += '<span class="project-bar__dropdown-item-label">' + esc(item.label) + '</span>';
          if (item.meta || item.badge) {
            h += '<span class="project-bar__dropdown-item-row">';
            if (item.meta) h += '<span class="project-bar__dropdown-item-meta">' + esc(item.meta) + '</span>';
            if (item.badge) {
              var badgeCls = item.badgeType ? ' project-bar__dropdown-badge--' + esc(item.badgeType) : '';
              h += '<span class="project-bar__dropdown-badge' + badgeCls + '">' + esc(item.badge) + '</span>';
            }
            h += '</span>';
          }
          h += '</button>';
        });
        h += '</div></div>';
        return h;
      }

      html += '<div class="project-bar__actions">';

      // Left slot
      if (leftActions.length || dropdownSlot === 'left') {
        html += '<div class="project-bar__actions-left">';
        leftActions.forEach(function (a) { html += renderBtn(a); });
        if (card.dropdown && dropdownSlot === 'left') html += renderDropdown(card.dropdown);
        html += '</div>';
      }

      // Right slot
      if (rightActions.length || dropdownSlot === 'right') {
        html += '<div class="project-bar__actions-right">';
        rightActions.forEach(function (a) { html += renderBtn(a); });
        if (card.dropdown && dropdownSlot === 'right') html += renderDropdown(card.dropdown);
        html += '</div>';
      }

      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ------------------------------------------
  // PUBLIC API
  // ------------------------------------------

  window.renderProjectBar = function (config) {
    var data = config && config.projectBar;
    if (!data) {
      container.classList.add('project-bar--hidden');
      return;
    }

    var title = data.title || 'Project';
    var cards = data.cards || [];

    var html = '<h2 class="project-bar__title">' + esc(title) + '</h2>';
    html += '<div class="project-bar__columns">';
    cards.forEach(function (card) {
      html += buildCard(card);
    });
    html += '</div>';

    container.innerHTML = html;
    container.classList.remove('project-bar--hidden');

    var activityMapBtn = container.querySelector('[data-action-id="open-activity-map"]');
    if (activityMapBtn) {
      activityMapBtn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.runPageTransition === 'function' && typeof window.getActivityMapPageContent === 'function') {
          var pageContent = window.getActivityMapPageContent();
          window.runPageTransition({ triggerEl: activityMapBtn, pageContent: pageContent, title: 'Activity Data', onExit: function () {} });
        }
      });
    }

    var addFilesBtn = container.querySelector('[data-action-id="open-activity-data-setup"]');
    if (addFilesBtn) {
      addFilesBtn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.openActivityDataSetupModal === 'function') {
          window.openActivityDataSetupModal();
        }
      });
    }

    var calcMethodsBtn = container.querySelector('[data-action-id="open-calc-methods"]');
    if (calcMethodsBtn) {
      calcMethodsBtn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.runPageTransition === 'function' && typeof window.getCalcMethodsPageContent === 'function') {
          var pageContent = window.getCalcMethodsPageContent();
          window.runPageTransition({ triggerEl: calcMethodsBtn, pageContent: pageContent, title: 'Calculation methods', onExit: function () {} });
        }
      });
    }

    var efLibraryBtn = container.querySelector('[data-action-id="open-ef-library"]');
    if (efLibraryBtn) {
      efLibraryBtn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.runPageTransition === 'function' && typeof window.getEfLibraryPageContent === 'function') {
          var pageContent = window.getEfLibraryPageContent();
          window.runPageTransition({ triggerEl: efLibraryBtn, pageContent: pageContent, title: 'EF library', onExit: function () {} });
        }
      });
    }

    var inventoryWizBtn = container.querySelector('[data-action-id="open-inventory-wizard"]');
    if (inventoryWizBtn) {
      inventoryWizBtn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.openInventoryWizard === 'function') {
          window.openInventoryWizard();
        }
      });
    }

    container.querySelectorAll('[data-action-id="open-ghg-inventory"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
        if (typeof window.runPageTransition === 'function' && typeof window.getGhgEnginePageContent === 'function') {
          var pageContent = window.getGhgEnginePageContent({ skipList: true });
          var title = btn.querySelector('.project-bar__dropdown-item-label');
          window.runPageTransition({ triggerEl: btn, pageContent: pageContent, title: title ? title.textContent : 'GHG Inventory', onExit: function () {} });
        }
      });
    });

    // Dropdown toggles
    container.querySelectorAll('.project-bar__dropdown-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dd = btn.closest('.project-bar__dropdown');
        dd.classList.toggle('project-bar__dropdown--open');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function () {
      container.querySelectorAll('.project-bar__dropdown--open').forEach(function (dd) {
        dd.classList.remove('project-bar__dropdown--open');
      });
    });
  };

  window.hideProjectBar = function () {
    container.classList.add('project-bar--hidden');
  };

  window.showProjectBar = function () {
    container.classList.remove('project-bar--hidden');
  };

})();
