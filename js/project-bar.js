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

    // Action buttons
    if (card.actions && card.actions.length) {
      html += '<div class="project-bar__actions">';
      card.actions.forEach(function (a) {
        html +=
          '<button class="project-bar__btn">' +
            (a.icon ? '<i class="' + esc(a.icon) + '"></i>' : '') +
            '<span>' + esc(a.label) + '</span>' +
          '</button>';
      });
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
  };

  window.hideProjectBar = function () {
    container.classList.add('project-bar--hidden');
  };

  window.showProjectBar = function () {
    container.classList.remove('project-bar--hidden');
  };

})();
