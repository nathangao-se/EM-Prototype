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
    var html = '<div class="project-bar__card">';

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

    // Action buttons (and optional dropdown)
    var hasActions = (card.actions && card.actions.length) || card.dropdown;
    if (hasActions) {
      html += '<div class="project-bar__actions">';
      if (card.actions) {
        card.actions.forEach(function (a) {
          var attrs = a.actionId ? ' data-action-id="' + esc(a.actionId) + '"' : '';
          html +=
            '<button class="project-bar__btn"' + attrs + '>' +
              (a.icon ? '<i class="' + esc(a.icon) + '"></i>' : '') +
              '<span>' + esc(a.label) + '</span>' +
            '</button>';
        });
      }
      if (card.dropdown) {
        html += '<div class="project-bar__dropdown">';
        html += '<button class="project-bar__dropdown-toggle">';
        if (card.dropdown.icon) html += '<i class="' + esc(card.dropdown.icon) + '"></i>';
        html += '<span>' + esc(card.dropdown.label) + '</span>';
        html += '<i class="fa-solid fa-chevron-down project-bar__dropdown-chevron"></i>';
        html += '</button>';
        html += '<div class="project-bar__dropdown-menu">';
        card.dropdown.items.forEach(function (item) {
          var attrs = item.actionId ? ' data-action-id="' + esc(item.actionId) + '"' : '';
          html += '<button class="project-bar__dropdown-item"' + attrs + '>' + esc(item.label) + '</button>';
        });
        html += '</div>';
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
