// ========================================
// ONBOARDING WIZARD
// ========================================

(function () {
  'use strict';

  var esc = window.DomUtils ? window.DomUtils.esc : function (s) { return s; };

  // ===========================================
  // DOM
  // ===========================================

  var overlay = document.getElementById('onb-wizard-overlay');
  if (!overlay) return;

  ModalManager.register('onboarding-wizard', {
    overlay: overlay,
    openClass: 'wizard-overlay--open',
    onOpen: function () {
      currentStep = 0;
      selectedProject = '';
      projectLength = 'daily';
      render();
    }
  });

  var wizardEl  = overlay.querySelector('.onb-wizard');
  var titleEl   = overlay.querySelector('.wizard-header-title');
  var closeBtn  = overlay.querySelector('.wizard-close-btn');
  var body      = overlay.querySelector('.wizard-body');
  var footer    = overlay.querySelector('.wizard-footer');
  var header    = overlay.querySelector('.wizard-header');

  // ===========================================
  // STATE
  // ===========================================

  var currentStep = 0;
  var selectedProject = '';
  var projectLength = 'daily';
  var ASSET_BASE = 'wizards/onboarding/assets/';

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var ORDINALS = ['1st', '2nd', '3rd', '4th', 'Last'];

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    ModalManager.closeAll();
    ModalManager.open('onboarding-wizard');
  }

  function closeWizard() {
    ModalManager.close('onboarding-wizard');
  }

  window.openOnboardingWizard = openWizard;
  window.closeOnboardingWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);

  // ===========================================
  // RENDER DISPATCHER
  // ===========================================

  function render() {
    switch (currentStep) {
      case 0: renderWelcome(); break;
      case 1: renderProjectType(); break;
      case 2: renderProjectSetup(); break;
      case 3: renderReview(); break;
    }
  }

  // ===========================================
  // STEP 0 — WELCOME
  // ===========================================

  function renderWelcome() {
    wizardEl.style.width = '640px';
    header.classList.add('onb-header--hidden');
    body.classList.remove('onb-ps-body');
    titleEl.textContent = '';

    body.innerHTML =
      '<div class="onb-welcome-banner">' +
        '<img class="onb-welcome-banner-img" src="' + ASSET_BASE + 'banner-left.jpg" alt="">' +
        '<img class="onb-welcome-banner-img" src="' + ASSET_BASE + 'banner-center.jpg" alt="">' +
        '<img class="onb-welcome-banner-img" src="' + ASSET_BASE + 'banner-right.jpg" alt="">' +
        '<div class="onb-welcome-banner-overlay">' +
          '<div class="onb-welcome-banner-heading">Welcome to<br>Resource Advisor Plus</div>' +
        '</div>' +
      '</div>' +
      '<div class="onb-welcome-card">' +
        '<p>Welcome to Schneider SB\u2019s next generation sustainability platform.</p>' +
        '<p>We distilled 20 years of Sustainability experience into a new platform where ' +
        'every inch of software is designed to help you accomplish your sustainability ' +
        'program management goals faster and more accurately than ever before.</p>' +
      '</div>';

    footer.className = 'wizard-footer onb-welcome-footer';
    footer.innerHTML =
      '<button class="onb-welcome-btn" id="onb-next">Next: set up your projects</button>';

    document.getElementById('onb-next').addEventListener('click', function () {
      currentStep = 1;
      render();
    });
  }

  // ===========================================
  // STEP 1 — PROJECT TYPE
  // ===========================================

  function renderProjectType() {
    wizardEl.style.width = '800px';
    header.classList.remove('onb-header--hidden');
    body.classList.remove('onb-ps-body');
    titleEl.textContent = 'Welcome to Resource advisor plus';

    body.innerHTML =
      '<div class="onb-pt-text">' +
        '<p>Resource advisor plus is based around projects; you can manage multiple branches of work, ' +
        'share/request resources, or schedule recurring work with ease, <strong>regardless of scale</strong>.</p>' +
        '<p>Let\u2019s create your first project. Start by choosing the project setting that\u2019s the best for you.</p>' +
        '<p>You\u2019ll be able to create multiple concurrent projects and change settings later on if need be.</p>' +
      '</div>' +
      '<div class="onb-pt-cards">' +
        buildProjectCard('continuous',
          '<div class="onb-pt-icon-week">' +
            '<div class="onb-pt-day-box">Mon</div>' +
            '<div class="onb-pt-day-arrow"><i class="fa-solid fa-arrow-right"></i></div>' +
            '<div class="onb-pt-day-box">Sun</div>' +
          '</div>',
          'Continuous or ad hoc',
          'Often used by site managers/team members with regular day-to-day responsibilities'
        ) +
        buildProjectCard('seasonal',
          '<div class="onb-pt-icon-fa"><i class="fa-regular fa-calendar-days"></i></div>',
          'Seasonal',
          'Often used for seasonal reporting for medium-large scale companies'
        ) +
        buildProjectCard('ghg',
          '<div class="onb-pt-icon-fa"><i class="fa-solid fa-clipboard-list"></i></div>',
          'Greenhouse Gas audit',
          'Often used for large to multi-national companies reporting to meet global GHG audits'
        ) +
      '</div>';

    footer.className = 'wizard-footer onb-pt-footer';
    footer.innerHTML = '';

    var PROJECT_LENGTH_MAP = { continuous: 'daily', seasonal: 'monthly', ghg: 'annual' };

    body.querySelectorAll('.onb-pt-card').forEach(function (card) {
      card.addEventListener('click', function () {
        selectedProject = card.dataset.onbProject;
        projectLength = PROJECT_LENGTH_MAP[selectedProject] || 'daily';
        currentStep = 2;
        render();
      });
    });
  }

  function buildProjectCard(key, iconHtml, title, desc) {
    return '' +
      '<div class="onb-pt-card" data-onb-project="' + key + '">' +
        '<div class="onb-pt-card-icon">' + iconHtml + '</div>' +
        '<div class="onb-pt-card-divider"></div>' +
        '<div class="onb-pt-card-title">' + esc(title) + '</div>' +
        '<div class="onb-pt-card-desc">' + esc(desc) + '</div>' +
      '</div>';
  }

  // ===========================================
  // STEP 2 — PROJECT SETUP
  // ===========================================

  var HELPER_TEXT = {
    daily:   'A new project will be created on the selected days at the specified time.',
    weekly:  'A new project will be created each week on the selected day.',
    monthly: 'A new project will be created monthly on the selected schedule.',
    annual:  'A new project will be created for the specified date range.'
  };

  function renderProjectSetup() {
    wizardEl.style.width = '640px';
    header.classList.remove('onb-header--hidden');
    titleEl.textContent = 'Welcome to Resource advisor plus';
    body.classList.add('onb-ps-body');

    body.innerHTML =
      '<p class="onb-ps-required">All fields required unless noted.</p>' +
      buildSegmentedControl() +
      '<div id="onb-ps-dynamic"></div>' +
      '<div class="onb-ps-field">' +
        '<label class="onb-ps-label">Project name</label>' +
        '<input class="onb-ps-input" type="text" placeholder="e.g. Q1 2026 Carbon Audit">' +
      '</div>' +
      '<div class="onb-ps-field">' +
        '<label class="onb-ps-label">Project Description</label>' +
        '<textarea class="onb-ps-textarea" rows="4" placeholder="Describe the scope and goals of this project..."></textarea>' +
      '</div>';

    renderDynamicFields();

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-ps-back">Back</button>' +
      '<button class="wizard-btn-green" id="onb-ps-next">Next: Review</button>';

    document.getElementById('onb-ps-back').addEventListener('click', function () {
      currentStep = 1; render();
    });
    document.getElementById('onb-ps-next').addEventListener('click', function () {
      snapshotFormData();
      currentStep = 3; render();
    });

    body.querySelector('.onb-ps-seg').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-onb-len]');
      if (!btn) return;
      projectLength = btn.dataset.onbLen;
      body.querySelectorAll('[data-onb-len]').forEach(function (b) {
        b.classList.toggle('onb-ps-seg-btn--active', b.dataset.onbLen === projectLength);
      });
      renderDynamicFields();
    });
  }

  function buildSegmentedControl() {
    var modes = [
      { key: 'daily', label: 'Daily/perm' },
      { key: 'weekly', label: 'Weekly' },
      { key: 'monthly', label: 'Monthly' },
      { key: 'annual', label: 'Annual/custom' }
    ];
    var html = '<div class="onb-ps-field"><label class="onb-ps-label">Project length</label><div class="onb-ps-seg">';
    modes.forEach(function (m) {
      var active = m.key === projectLength ? ' onb-ps-seg-btn--active' : '';
      html += '<button class="onb-ps-seg-btn' + active + '" data-onb-len="' + m.key + '">' + esc(m.label) + '</button>';
    });
    html += '</div></div>';
    return html;
  }

  function renderDynamicFields() {
    var container = document.getElementById('onb-ps-dynamic');
    if (!container) return;
    var html = '';

    switch (projectLength) {
      case 'daily':
        html = buildDailyFields();
        break;
      case 'weekly':
        html = buildWeeklyFields();
        break;
      case 'monthly':
        html = buildMonthlyFields();
        break;
      case 'annual':
        html = buildAnnualFields();
        break;
    }

    var helperCls = (projectLength === 'weekly' || projectLength === 'monthly') ? ' onb-ps-helper--flush' : '';
    html += '<p class="onb-ps-helper' + helperCls + '">' + esc(HELPER_TEXT[projectLength]) + '</p>';
    container.innerHTML = html;
    bindDynamicFields(container);
  }

  function buildDailyFields() {
    return '' +
      '<div class="onb-ps-field">' +
        '<div class="onb-ps-row" style="align-items:center">' +
          '<div class="onb-ps-check-row">' +
            '<input type="checkbox" class="onb-ps-checkbox" id="onb-daily-recur" checked>' +
            '<label for="onb-daily-recur">Repeat project</label>' +
          '</div>' +
          '<div class="onb-ps-field onb-ps-field--grow">' +
            '<div class="onb-ps-multiselect" id="onb-day-multiselect">' +
              '<div class="onb-ps-multiselect-trigger" id="onb-day-trigger">' +
                '<span id="onb-day-label">All days</span>' +
                '<i class="fa-solid fa-chevron-down"></i>' +
              '</div>' +
              '<div class="onb-ps-multiselect-dropdown" id="onb-day-dropdown">' +
                buildDayCheckboxes() +
              '</div>' +
            '</div>' +
          '</div>' +
          '<select class="onb-ps-select onb-ps-select--time">' +
            buildTimeOptions() +
          '</select>' +
        '</div>' +
      '</div>';
  }

  function buildDayCheckboxes() {
    var html = '';
    DAYS.forEach(function (d, i) {
      html += '<label class="onb-ps-ms-item">' +
        '<input type="checkbox" data-onb-day="' + i + '" checked>' +
        '<span>' + d + '</span>' +
      '</label>';
    });
    return html;
  }

  function updateDayLabel() {
    var label = document.getElementById('onb-day-label');
    if (!label) return;
    var checks = document.querySelectorAll('[data-onb-day]');
    var selected = [];
    checks.forEach(function (cb) {
      if (cb.checked) selected.push(DAYS[parseInt(cb.dataset.onbDay)]);
    });
    if (selected.length === 7) label.textContent = 'All days';
    else if (selected.length === 0) label.textContent = 'No days';
    else label.textContent = selected.map(function (d) { return d.substring(0, 2); }).join(', ');
  }

  function buildWeeklyFields() {
    return '' +
      '<div class="onb-ps-field">' +
        '<label class="onb-ps-label">Repeat project:</label>' +
        '<div class="onb-ps-row" style="align-items:center">' +
          buildDayPills('weekly', 1) +
          '<select class="onb-ps-select onb-ps-select--time">' +
            buildTimeOptions() +
          '</select>' +
        '</div>' +
      '</div>';
  }

  function buildMonthlyFields() {
    return '' +
      '<div class="onb-ps-field">' +
        '<label class="onb-ps-label">Repeat project every:</label>' +
        '<div id="onb-ps-month-fields">' +
          buildMonthDayFields() +
        '</div>' +
      '</div>';
  }

  function buildMonthDayFields() {
    var html = '<div class="onb-ps-row" style="align-items:center">';
    html += '<select class="onb-ps-select" id="onb-month-mode">';
    html += '<option value="day">Day of the month</option>';
    ORDINALS.forEach(function (o) {
      html += '<option value="' + o + '">' + o + ' weekday of the month</option>';
    });
    html += '</select>';
    html += '<select class="onb-ps-select" id="onb-month-value">';
    for (var i = 1; i <= 31; i++) {
      html += '<option' + (i === 15 ? ' selected' : '') + '>' + ordinalSuffix(i) + '</option>';
    }
    html += '</select>';
    html += '</div>';
    return html;
  }

  function ordinalSuffix(n) {
    var s = ['th','st','nd','rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function buildAnnualFields() {
    return '' +
      '<div class="onb-ps-row">' +
        '<div class="onb-ps-field onb-ps-field--grow">' +
          '<label class="onb-ps-label">Start date</label>' +
          '<input class="onb-ps-input" type="text" placeholder="MM/DD/YYYY" value="01/01/2026">' +
        '</div>' +
        '<div class="onb-ps-field onb-ps-field--grow">' +
          '<label class="onb-ps-label">End date</label>' +
          '<input class="onb-ps-input" type="text" placeholder="MM/DD/YYYY" value="12/31/2026">' +
        '</div>' +
      '</div>' +
      '<div class="onb-ps-check-row">' +
        '<input type="checkbox" class="onb-ps-checkbox" id="onb-annual-recur">' +
        '<label for="onb-annual-recur">Repeat project</label>' +
      '</div>';
  }

  function buildDayPills(prefix, activeIdx) {
    var html = '<div class="onb-ps-pill-seg"><div class="onb-ps-pills">';
    DAYS.forEach(function (d, i) {
      var active = i === activeIdx ? ' onb-ps-pill--active' : '';
      html += '<button class="onb-ps-pill' + active + '" data-onb-pill="' + prefix + '-' + i + '">' + d + '</button>';
    });
    html += '</div></div>';
    return html;
  }

  function buildTimeOptions() {
    var html = '';
    for (var m = 0; m < 1440; m += 15) {
      var h = Math.floor(m / 60);
      var mm = m % 60;
      var period = h < 12 ? 'AM' : 'PM';
      var h12 = h % 12 || 12;
      var label = h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + period;
      var sel = (h === 9 && mm === 0) ? ' selected' : '';
      html += '<option' + sel + '>' + label + '</option>';
    }
    return html;
  }

  function bindDynamicFields(container) {
    container.querySelectorAll('.onb-ps-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        pill.closest('.onb-ps-pills').querySelectorAll('.onb-ps-pill').forEach(function (p) {
          p.classList.remove('onb-ps-pill--active');
        });
        pill.classList.add('onb-ps-pill--active');
      });
    });

    var modeSelect = container.querySelector('#onb-month-mode');
    var valueSelect = container.querySelector('#onb-month-value');
    if (modeSelect && valueSelect) {
      modeSelect.addEventListener('change', function () {
        var html = '';
        if (modeSelect.value === 'day') {
          for (var i = 1; i <= 31; i++) {
            html += '<option' + (i === 15 ? ' selected' : '') + '>' + ordinalSuffix(i) + '</option>';
          }
        } else {
          DAYS.forEach(function (d) { html += '<option>' + d + '</option>'; });
        }
        valueSelect.innerHTML = html;
      });
    }

    var msWrap = container.querySelector('#onb-day-multiselect');
    var trigger = container.querySelector('#onb-day-trigger');
    var dropdown = container.querySelector('#onb-day-dropdown');
    if (msWrap && trigger && dropdown) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dropdown.classList.toggle('onb-ps-multiselect-dropdown--open');
        msWrap.classList.toggle('onb-ps-multiselect--open', open);
      });
      dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
      container.querySelectorAll('[data-onb-day]').forEach(function (cb) {
        cb.addEventListener('change', updateDayLabel);
      });
      document.addEventListener('click', function () {
        dropdown.classList.remove('onb-ps-multiselect-dropdown--open');
        msWrap.classList.remove('onb-ps-multiselect--open');
      });
    }
  }

  // ===========================================
  // DATA SNAPSHOT (gathered before leaving step 2)
  // ===========================================

  var formData = {};

  var PROJECT_TYPE_LABELS = {
    continuous: 'Continuous or ad hoc',
    seasonal: 'Seasonal',
    ghg: 'Greenhouse Gas audit'
  };

  var PROJECT_LENGTH_LABELS = {
    daily: 'Daily/perm',
    weekly: 'Weekly',
    monthly: 'Monthly',
    annual: 'Annual/custom'
  };

  function snapshotFormData() {
    var nameInput = body.querySelector('.onb-ps-input[type="text"]');
    var descInput = body.querySelector('.onb-ps-textarea');

    formData.projectType = PROJECT_TYPE_LABELS[selectedProject] || selectedProject;
    formData.projectLength = PROJECT_LENGTH_LABELS[projectLength] || projectLength;
    formData.projectName = nameInput ? nameInput.value : '';
    formData.projectDesc = descInput ? descInput.value : '';

    switch (projectLength) {
      case 'daily':
        var dayChecks = body.querySelectorAll('[data-onb-day]');
        var days = [];
        dayChecks.forEach(function (cb) {
          if (cb.checked) days.push(DAYS[parseInt(cb.dataset.onbDay)]);
        });
        formData.days = days.length === 7 ? 'All days' : (days.length === 0 ? 'None' : days.join(', '));
        var recurCb = body.querySelector('#onb-daily-recur');
        formData.recurring = recurCb ? recurCb.checked : false;
        var timeSel = body.querySelector('.onb-ps-select--time');
        formData.time = timeSel ? timeSel.value : '';
        break;
      case 'weekly':
        var activePill = body.querySelector('.onb-ps-pill--active');
        formData.day = activePill ? activePill.textContent : '';
        var wTimeSel = body.querySelector('.onb-ps-select--time');
        formData.time = wTimeSel ? wTimeSel.value : '';
        break;
      case 'monthly':
        var modeSel = body.querySelector('#onb-month-mode');
        var valSel = body.querySelector('#onb-month-value');
        formData.monthMode = modeSel ? modeSel.options[modeSel.selectedIndex].text : '';
        formData.monthValue = valSel ? valSel.value : '';
        break;
      case 'annual':
        var dateInputs = body.querySelectorAll('.onb-ps-input[type="text"]');
        formData.startDate = dateInputs[0] ? dateInputs[0].value : '';
        formData.endDate = dateInputs[1] ? dateInputs[1].value : '';
        var annualRecur = body.querySelector('#onb-annual-recur');
        formData.recurring = annualRecur ? annualRecur.checked : false;
        break;
    }
  }

  // ===========================================
  // STEP 3 — REVIEW
  // ===========================================

  function renderReview() {
    wizardEl.style.width = '640px';
    header.classList.remove('onb-header--hidden');
    body.classList.add('onb-ps-body');
    titleEl.textContent = 'Review your project';

    var rows = [];
    rows.push(reviewRow('Project type', formData.projectType));
    rows.push(reviewRow('Project length', formData.projectLength));

    switch (projectLength) {
      case 'daily':
        rows.push(reviewRow('Recurring', formData.recurring ? 'Yes' : 'No'));
        rows.push(reviewRow('Days', formData.days));
        rows.push(reviewRow('Time', formData.time));
        break;
      case 'weekly':
        rows.push(reviewRow('Repeat day', formData.day));
        rows.push(reviewRow('Time', formData.time));
        break;
      case 'monthly':
        rows.push(reviewRow('Schedule', formData.monthMode + ' \u2014 ' + formData.monthValue));
        break;
      case 'annual':
        rows.push(reviewRow('Start date', formData.startDate));
        rows.push(reviewRow('End date', formData.endDate));
        rows.push(reviewRow('Recurring', formData.recurring ? 'Yes' : 'No'));
        break;
    }

    rows.push(reviewRow('Project name', formData.projectName || '<span class="onb-rv-empty">Not provided</span>'));
    rows.push(reviewRow('Description', formData.projectDesc || '<span class="onb-rv-empty">Not provided</span>'));

    body.innerHTML =
      '<div class="onb-rv-card">' +
        '<div class="onb-rv-heading">Project summary</div>' +
        '<div class="onb-rv-table">' + rows.join('') + '</div>' +
      '</div>';

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="onb-rv-back">Back</button>' +
      '<button class="wizard-btn-green" id="onb-rv-create">Create project</button>';

    document.getElementById('onb-rv-back').addEventListener('click', function () {
      currentStep = 2; render();
    });
    document.getElementById('onb-rv-create').addEventListener('click', function () {
      window.onboardingProject = Object.assign({}, formData);
      closeWizard();
      if (typeof window.renderPostOnboarding === 'function') {
        window.renderPostOnboarding();
      }
    });
  }

  function reviewRow(label, value) {
    return '<div class="onb-rv-row">' +
      '<div class="onb-rv-label">' + esc(label) + '</div>' +
      '<div class="onb-rv-value">' + value + '</div>' +
    '</div>';
  }

})();
