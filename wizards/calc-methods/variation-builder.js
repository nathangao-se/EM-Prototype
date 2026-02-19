// ========================================
// VARIATION BUILDER MODAL
// 3-step wizard: Select Activities → Configure → Review & Save
// ========================================

(function () {

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Default activity bank per method — mirrors calc-methods METHOD_DETAILS keys
  var ACTIVITY_BANKS = {
    'Stationary Combustion': [
      { id: 'natural-gas',     name: 'Natural Gas Combustion',  group: 'Natural Gas' },
      { id: 'diesel',          name: 'Diesel Combustion',       group: 'Liquid Fuels' },
      { id: 'fuel-oil',        name: 'Fuel Oil Combustion',     group: 'Liquid Fuels' },
      { id: 'propane',         name: 'Propane Combustion',      group: 'Gaseous Fuels' },
      { id: 'lpg',             name: 'LPG Combustion',          group: 'Gaseous Fuels' },
      { id: 'kerosene',        name: 'Kerosene Combustion',     group: 'Liquid Fuels' },
      { id: 'coal-anthracite', name: 'Coal (Anthracite)',       group: 'Solid Fuels' },
      { id: 'coal-bituminous', name: 'Coal (Bituminous)',       group: 'Solid Fuels' },
      { id: 'biodiesel',       name: 'Biodiesel Combustion',    group: 'Biofuels' },
      { id: 'biomass-wood',    name: 'Biomass (Wood)',          group: 'Biofuels' },
      { id: 'lng',             name: 'LNG Combustion',          group: 'Gaseous Fuels' },
      { id: 'heating-oil',     name: 'Heating Oil Combustion',  group: 'Liquid Fuels' }
    ],
    'Mobile Combustion': [
      { id: 'diesel-road',    name: 'Diesel (Road)',       group: 'Road' },
      { id: 'gasoline-road',  name: 'Gasoline (Road)',     group: 'Road' },
      { id: 'cng',            name: 'CNG',                 group: 'Alt Fuels' },
      { id: 'lpg-mobile',     name: 'LPG',                 group: 'Alt Fuels' },
      { id: 'diesel-offroad', name: 'Diesel (Off-road)',   group: 'Off-road' },
      { id: 'marine-diesel',  name: 'Marine Diesel',       group: 'Marine' }
    ],
    'Fugitive Emissions': [
      { id: 'r410a', name: 'R-410A', group: 'Refrigerants' },
      { id: 'r134a', name: 'R-134a', group: 'Refrigerants' },
      { id: 'r404a', name: 'R-404A', group: 'Refrigerants' },
      { id: 'sf6',   name: 'SF6',    group: 'Electrical' },
      { id: 'co2-fire', name: 'CO2 (fire suppression)', group: 'Fire Suppression' }
    ],
    'Purchased Electricity': [
      { id: 'grid-elec',  name: 'Grid Electricity',    group: 'Grid' },
      { id: 'recs',       name: 'Renewable (RECs)',     group: 'Renewable' },
      { id: 'onsite-solar', name: 'On-site Solar',     group: 'On-site' },
      { id: 'ppa',        name: 'PPA Electricity',      group: 'PPA' }
    ],
    'Purchased Heat & Steam': [
      { id: 'district-heat', name: 'District Heating', group: 'Heating' },
      { id: 'district-cool', name: 'District Cooling', group: 'Cooling' },
      { id: 'steam',         name: 'Steam',            group: 'Steam' },
      { id: 'chilled-water', name: 'Chilled Water',    group: 'Cooling' }
    ],
    'Fuel & Energy Activities': [
      { id: 'wtt-ng',   name: 'WTT Natural Gas', group: 'WTT' },
      { id: 'wtt-diesel', name: 'WTT Diesel',    group: 'WTT' },
      { id: 'td-elec',  name: 'T&D Electricity', group: 'T&D' },
      { id: 'wtt-gas',  name: 'WTT Gasoline',    group: 'WTT' },
      { id: 'wtt-coal', name: 'WTT Coal',        group: 'WTT' },
      { id: 'td-heat',  name: 'T&D Heat/Steam',  group: 'T&D' }
    ],
    'Upstream Transportation': [
      { id: 'road-hgv',  name: 'Road Freight (HGV)', group: 'Road' },
      { id: 'road-lgv',  name: 'Road Freight (LGV)', group: 'Road' },
      { id: 'rail',      name: 'Rail Freight',       group: 'Rail' },
      { id: 'sea',       name: 'Sea Freight',        group: 'Sea' },
      { id: 'air',       name: 'Air Freight',        group: 'Air' }
    ],
    'Business Travel': [
      { id: 'domestic-flight', name: 'Domestic Flight',   group: 'Air' },
      { id: 'short-haul',     name: 'Short-Haul Flight',  group: 'Air' },
      { id: 'long-haul',      name: 'Long-Haul Flight',   group: 'Air' },
      { id: 'rail-travel',    name: 'Rail',               group: 'Rail' },
      { id: 'taxi',           name: 'Taxi / Rideshare',   group: 'Ground' },
      { id: 'hotel',          name: 'Hotel Stay',          group: 'Accommodation' }
    ],
    'Employee Commuting': [
      { id: 'car-gasoline', name: 'Car (Gasoline)', group: 'Personal Vehicle' },
      { id: 'car-diesel',   name: 'Car (Diesel)',   group: 'Personal Vehicle' },
      { id: 'car-ev',       name: 'Car (EV)',       group: 'Personal Vehicle' },
      { id: 'bus',          name: 'Bus',             group: 'Public Transit' },
      { id: 'rail-subway',  name: 'Rail / Subway',   group: 'Public Transit' },
      { id: 'wfh',          name: 'Work from Home',   group: 'Remote' }
    ],
    'Downstream Transportation': [
      { id: 'down-hgv',  name: 'Road Freight (HGV)', group: 'Road' },
      { id: 'down-lgv',  name: 'Road Freight (LGV)', group: 'Road' },
      { id: 'down-rail', name: 'Rail Freight',       group: 'Rail' },
      { id: 'down-sea',  name: 'Sea Freight',        group: 'Sea' },
      { id: 'down-air',  name: 'Air Freight',        group: 'Air' }
    ]
  };

  // Decision point options per method group
  var DECISION_OPTIONS = {
    fuel: {
      title: 'Fuel combustion lifecycle',
      options: [
        { id: 'wtt-ttw', label: 'WTT + TTW Decomposed', desc: 'Well-to-Tank and Tank-to-Wheel reported separately', default: true },
        { id: 'wtw',     label: 'WTW Combined',         desc: 'Well-to-Wheel combined factor' },
        { id: 'ttw',     label: 'TTW Only (Direct)',     desc: 'Only direct combustion emissions' }
      ]
    },
    electricity: {
      title: 'Scope 2 accounting method',
      options: [
        { id: 'dual',     label: 'Dual Reporting',       desc: 'Both location-based and market-based', default: true },
        { id: 'location', label: 'Location-Based Only',  desc: 'Grid average emission factors' },
        { id: 'market',   label: 'Market-Based Primary', desc: 'Supplier-specific or residual mix factors' }
      ]
    },
    transport: {
      title: 'Distance calculation method',
      options: [
        { id: 'actual',   label: 'Actual Distance',      desc: 'Use reported distance data', default: true },
        { id: 'estimate', label: 'Great Circle + Uplift', desc: 'Calculate from origin/destination with uplift factor' }
      ]
    },
    general: {
      title: 'Boundary approach',
      options: [
        { id: 'cradle',  label: 'Cradle-to-Gate',  desc: 'Raw materials through manufacturing gate', default: true },
        { id: 'full',    label: 'Cradle-to-Grave',  desc: 'Full product lifecycle' }
      ]
    }
  };

  var DATA_PATHS = [
    { id: 'direct',   label: 'Direct measurement', desc: 'Direct emissions measurement',      efCompat: 'Supplier-provided' },
    { id: 'activity', label: 'Activity-based',     desc: 'Fuel volume, distance, kWh',         efCompat: 'Activity-based EFs' },
    { id: 'spend',    label: 'Spend-based',        desc: 'Monetary value of procurement',      efCompat: 'Spend-based EFs' },
    { id: 'proxy',    label: 'Proxy',              desc: 'Modeled or inferred data',            efCompat: 'Generic EFs' }
  ];

  function getMethodType(methodName) {
    if (/Stationary|Mobile|Fugitive/.test(methodName)) return 'fuel';
    if (/Electricity|Heat|Fuel & Energy/.test(methodName)) return 'electricity';
    if (/Transport|Travel|Commuting/.test(methodName)) return 'transport';
    return 'general';
  }

  function getActivitiesFor(methodName) {
    return ACTIVITY_BANKS[methodName] || generateGeneric(methodName);
  }

  function generateGeneric(methodName) {
    var detail = window._vbMethodDetails && window._vbMethodDetails[methodName];
    if (detail && detail.activityTypes) {
      return detail.activityTypes.map(function (a, i) {
        return { id: 'gen-' + i, name: a.name, group: a.sub.split('_')[0] };
      });
    }
    return [{ id: 'gen-0', name: methodName + ' Default', group: 'General' }];
  }

  // ── Build HTML ──

  function buildStepsBar(step) {
    var steps = [
      { num: 1, label: 'Select activities' },
      { num: 2, label: 'Configure activities' },
      { num: 3, label: 'Review & save' }
    ];
    var html = '<div class="vb-steps">';
    steps.forEach(function (s) {
      var isActive = s.num === step;
      var isComplete = s.num < step;
      var cls = 'vb-stepper-item';
      if (isComplete) cls += ' vb-stepper--complete';
      else if (isActive) cls += ' vb-stepper--active';
      html += '<div class="' + cls + '" data-vb-step="' + s.num + '">';
      html += '<div class="vb-stepper-label">';
      html += '<span>' + s.num + '. ' + s.label + '</span>';
      if (isComplete) html += ' <i class="fa-solid fa-circle-check vb-stepper-check"></i>';
      html += '</div>';
      html += '<div class="vb-stepper-bar"><div class="vb-stepper-bar-fill"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function buildStep1(methodName, activities, selected) {
    var html = '<div class="vb-section vb-section--active" data-vb-section="1">';

    html += '<div class="vb-form-group">';
    html += '<label class="vb-label">Custom method name</label>';
    html += '<input type="text" class="vb-input" id="vb-name" placeholder="e.g., ACME Corp - ' + esc(methodName) + '">';
    html += '</div>';

    html += '<div class="vb-form-group">';
    html += '<label class="vb-label">Based on</label>';
    html += '<div class="vb-base-value">' + esc(methodName) + ' <span class="vb-base-count">' + activities.length + ' activity types</span></div>';
    html += '</div>';

    html += '<div class="vb-form-group">';
    html += '<div class="vb-checklist-toolbar">';
    html += '<label class="vb-label" style="margin:0;">Select activities to include</label>';
    html += '<div class="vb-checklist-actions">';
    html += '<button class="vb-checklist-link" data-vb-action="select-all">Select all</button>';
    html += '<button class="vb-checklist-link" data-vb-action="deselect-all">Deselect all</button>';
    html += '</div></div>';

    html += '<div class="vb-checklist">';
    activities.forEach(function (a) {
      var checked = selected.indexOf(a.id) >= 0;
      html += '<div class="vb-check-item' + (checked ? ' vb-check-item--selected' : '') + '" data-vb-activity="' + esc(a.id) + '">';
      html += '<input type="checkbox" ' + (checked ? 'checked' : '') + '>';
      html += '<div><div class="vb-check-name">' + esc(a.name) + '</div>';
      html += '<div class="vb-check-cat">' + esc(a.group) + '</div></div></div>';
    });
    html += '</div>';
    html += '<div class="vb-check-count"><span id="vb-sel-count">' + selected.length + '</span> of ' + activities.length + ' activities selected</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function buildStep2(activities, selected, checkedIds, primaryId, configState) {
    var selActivities = activities.filter(function (a) { return selected.indexOf(a.id) >= 0; });
    if (!selActivities.length) {
      return '<div class="vb-section" data-vb-section="2"><p style="padding:24px;color:#676f73;">No activities selected. Go back and select at least one.</p></div>';
    }

    if (!primaryId) primaryId = selActivities[0].id;
    var primaryAct = selActivities.find(function (a) { return a.id === primaryId; }) || selActivities[0];
    var multiMode = checkedIds.length > 0;

    var html = '<div class="vb-section" data-vb-section="2">';
    html += '<div class="vb-config-layout">';

    // Sidebar
    html += '<div class="vb-config-sidebar">';
    selActivities.forEach(function (a) {
      var st = configState[a.id] || 'defaults';
      var isPrimary = a.id === primaryId;
      var isExtra = checkedIds.indexOf(a.id) >= 0;
      var highlight = isPrimary || isExtra;
      var itemCls = 'vb-config-sidebar-item';
      if (highlight) itemCls += ' vb-config-sidebar-item--active';
      if (isPrimary) itemCls += ' vb-config-sidebar-item--primary';
      html += '<div class="' + itemCls + '" data-vb-config-id="' + esc(a.id) + '">';
      var checked = isPrimary || isExtra;
      html += '<div class="vb-config-check-zone"><input type="checkbox" class="vb-config-check" ' + (checked ? 'checked' : '') + '><span class="vb-config-divider"></span></div>';
      html += '<span class="vb-config-sidebar-body">';
      html += '<span class="vb-config-sidebar-name">' + esc(a.name) + '</span>';
      html += '<span class="vb-config-sidebar-status' + (st === 'done' ? ' vb-config-sidebar-status--done' : '') + '">' + (st === 'done' ? 'Done' : 'Defaults') + '</span>';
      html += '</span>';
      html += '</div>';
    });
    if (multiMode) {
      html += '<button class="vb-config-clear" data-vb-action="clear-multi">Clear selection</button>';
    }
    html += '</div>';

    // Main panel
    html += '<div class="vb-config-main">';
    var totalSelected = 1 + checkedIds.length;
    var titleText = multiMode
      ? 'Change ' + totalSelected + ' activities'
      : primaryAct.name;
    html += '<h3 style="font-family:\'Nunito Sans\',sans-serif;font-size:16px;font-weight:700;color:#1d201f;margin:0 0 16px;">' + esc(titleText) + '</h3>';

    html += buildDecisionCard(primaryAct, configState);
    html += buildDataPathCard(configState, primaryAct.id);

    html += '</div></div></div>';
    return html;
  }

  function buildDecisionCard(activity, configState) {
    var methodType = getMethodType(activity.group);
    var opts = DECISION_OPTIONS[methodType] || DECISION_OPTIONS.general;
    var currentVal = (configState[activity.id + '_decision']) || opts.options.find(function (o) { return o.default; }).id;

    var html = '<div class="vb-config-card">';
    html += '<div class="vb-config-card-title">' + esc(opts.title) + '</div>';
    html += '<div class="vb-radio-group">';
    opts.options.forEach(function (o) {
      var sel = o.id === currentVal;
      html += '<div class="vb-radio-item' + (sel ? ' vb-radio-item--selected' : '') + '" data-vb-radio="' + esc(o.id) + '" data-vb-radio-group="decision">';
      html += '<input type="radio" name="vb-decision" ' + (sel ? 'checked' : '') + '>';
      html += '<div><div class="vb-radio-label">' + esc(o.label) + '</div>';
      html += '<div class="vb-radio-desc">' + esc(o.desc) + '</div></div></div>';
    });
    html += '</div></div>';
    return html;
  }

  function buildDataPathCard(configState, activityId) {
    var enabledPaths = configState[activityId + '_paths'] || ['direct', 'activity', 'spend'];

    var html = '<div class="vb-config-card">';
    html += '<div class="vb-config-card-title">Data path priority</div>';
    html += '<table class="vb-paths-table"><thead><tr>';
    html += '<th>Priority</th><th>Data path</th><th>Enabled</th><th>Required data</th><th>Compatible EFs</th>';
    html += '</tr></thead><tbody>';

    DATA_PATHS.forEach(function (p, i) {
      var enabled = enabledPaths.indexOf(p.id) >= 0;
      html += '<tr>';
      html += '<td class="vb-path-num">' + (enabled ? (i + 1) : '—') + '</td>';
      html += '<td>' + esc(p.label) + '</td>';
      html += '<td>';
      html += '<span class="vb-toggle' + (enabled ? ' vb-toggle--on' : '') + '"><span class="vb-toggle-knob"></span></span>';
      html += '</td>';
      html += '<td style="color:#676f73;font-size:12px;">' + esc(p.desc) + '</td>';
      html += '<td style="color:#676f73;font-size:12px;">' + esc(p.efCompat) + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
  }


  function buildStep3(methodName, activities, selected, configState) {
    var selActivities = activities.filter(function (a) { return selected.indexOf(a.id) >= 0; });
    var name = document.getElementById('vb-name') ? document.getElementById('vb-name').value : '';
    var doneCount = 0;
    selActivities.forEach(function (a) { if (configState[a.id] === 'done') doneCount++; });

    var html = '<div class="vb-section" data-vb-section="3">';
    html += '<h2 class="vb-section-title">Review & save</h2>';
    html += '<p class="vb-section-sub">Confirm your custom method configuration before saving</p>';

    // Summary cards
    html += '<div class="vb-review-cards">';
    html += '<div class="vb-review-card">';
    html += '<div class="vb-review-card-title">Configuration details</div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Name</span><span class="vb-review-value">' + esc(name || 'Untitled') + '</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Template</span><span class="vb-review-value">' + esc(methodName) + '</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Activities</span><span class="vb-review-value">' + selActivities.length + ' of ' + activities.length + '</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Configured</span><span class="vb-review-value">' + doneCount + ' of ' + selActivities.length + '</span></div>';
    html += '</div>';

    html += '<div class="vb-review-card">';
    html += '<div class="vb-review-card-title">Lifecycle settings</div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Fuel lifecycle</span><span class="vb-review-value">WTT + TTW</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Min specificity</span><span class="vb-review-value">60</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Override delta</span><span class="vb-review-value">15</span></div>';
    html += '</div>';

    html += '<div class="vb-review-card">';
    html += '<div class="vb-review-card-title">Data path priorities</div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">1st</span><span class="vb-review-value">Direct</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">2nd</span><span class="vb-review-value">Activity-based</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">3rd</span><span class="vb-review-value">Spend-based</span></div>';
    html += '<div class="vb-review-row"><span class="vb-review-label">Disabled</span><span class="vb-review-value" style="color:#94a3b8;">Proxy</span></div>';
    html += '</div>';
    html += '</div>';

    // Activity table
    html += '<table class="vb-review-table"><thead><tr>';
    html += '<th>Activity</th><th>Lifecycle decision</th><th>Enabled data paths</th><th>Status</th>';
    html += '</tr></thead><tbody>';

    selActivities.forEach(function (a) {
      var st = configState[a.id] || 'defaults';
      html += '<tr>';
      html += '<td style="font-weight:600;">' + esc(a.name) + '</td>';
      html += '<td>WTT + TTW Decomposed</td>';
      html += '<td>Direct, Activity, Spend</td>';
      html += '<td>' + (st === 'done'
        ? '<span class="vb-status-configured"><i class="fa-solid fa-check"></i> Configured</span>'
        : '<span class="vb-status-defaults">Defaults</span>') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    html += '</div>';
    return html;
  }

  function buildFooter(step) {
    var html = '<div class="vb-footer">';
    html += '<button class="vb-discard" data-vb-action="discard"><i class="fa-solid fa-trash"></i> Discard and exit</button>';
    html += '<div class="vb-footer-actions">';
    html += '<button class="btn btn-outline" data-vb-action="back">Back</button>';
    if (step === 1) {
      html += '<button class="btn btn-primary" data-vb-action="next">Next: configure activities</button>';
    } else if (step === 2) {
      html += '<button class="btn btn-primary" data-vb-action="next">Review</button>';
    } else {
      html += '<button class="btn btn-primary" data-vb-action="publish">Publish configuration</button>';
    }
    html += '</div></div>';
    return html;
  }

  // ── State & Rendering ──

  function openBuilder(methodName) {
    var existing = document.querySelector('.vb-overlay');
    if (existing) existing.remove();

    var activities = getActivitiesFor(methodName);
    var selected = activities.slice(0, 4).map(function (a) { return a.id; });
    var step = 1;
    var configState = {};
    var primaryConfigId = null;
    var checkedConfigIds = [];

    function render() {
      var html = '<div class="vb-overlay">';
      html += '<div class="vb-modal' + (step === 2 ? ' vb-modal--wide' : '') + '">';
      html += '<div class="vb-header"><span class="vb-header-title">Create variation</span>';
      html += '<button class="vb-close-btn" data-vb-action="close"><i class="fa-solid fa-xmark"></i></button></div>';
      html += buildStepsBar(step);
      html += '<div class="vb-body">';
      html += buildStep1(methodName, activities, selected);
      html += buildStep2(activities, selected, checkedConfigIds, primaryConfigId, configState);
      html += buildStep3(methodName, activities, selected, configState);
      html += '</div>';
      html += buildFooter(step);
      html += '</div></div>';

      var container = document.createElement('div');
      container.innerHTML = html;
      var overlay = container.firstChild;
      document.body.appendChild(overlay);

      showStep(overlay, step);

      requestAnimationFrame(function () {
        overlay.classList.add('vb-overlay--open');
      });

      bindEvents(overlay);
      return overlay;
    }

    function showStep(overlay, num) {
      overlay.querySelectorAll('.vb-section').forEach(function (s) {
        s.classList.toggle('vb-section--active', parseInt(s.dataset.vbSection) === num);
      });
    }

    var overlay;

    function rerender() {
      if (overlay) overlay.remove();
      overlay = render();
    }

    function bindEvents(ov) {
      ov.addEventListener('click', function (e) {
        var actionEl = e.target.closest('[data-vb-action]');
        if (actionEl) {
          var action = actionEl.dataset.vbAction;
          if (action === 'close' || action === 'discard') {
            closeOverlay(ov);
            return;
          }
          if (action === 'next') {
            if (step < 3) { step++; rerender(); }
            return;
          }
          if (action === 'back') {
            if (step > 1) { step--; rerender(); }
            return;
          }
          if (action === 'select-all') {
            selected = activities.map(function (a) { return a.id; });
            rerender();
            return;
          }
          if (action === 'deselect-all') {
            selected = [];
            rerender();
            return;
          }
          if (action === 'clear-multi') {
            checkedConfigIds = [];
            rerender();
            return;
          }
          if (action === 'publish') {
            closeOverlay(ov);
            return;
          }
        }

        // Stepper clicks
        var stepItem = e.target.closest('.vb-stepper-item');
        if (stepItem) {
          var target = parseInt(stepItem.dataset.vbStep);
          if (target <= step || target === step + 1) {
            step = target;
            rerender();
          }
          return;
        }

        // Checklist toggle
        var checkItem = e.target.closest('.vb-check-item');
        if (checkItem && step === 1) {
          var actId = checkItem.dataset.vbActivity;
          var idx = selected.indexOf(actId);
          if (idx >= 0) selected.splice(idx, 1);
          else selected.push(actId);
          rerender();
          return;
        }

        // Sidebar interaction (step 2)
        var sideItem = e.target.closest('.vb-config-sidebar-item');
        if (sideItem && step === 2) {
          var cid = sideItem.dataset.vbConfigId;
          var clickedCheckZone = e.target.closest('.vb-config-check-zone');

          if (clickedCheckZone) {
            // Left zone: toggle multi-select (skip if it's the primary)
            if (cid !== primaryConfigId) {
              var idx = checkedConfigIds.indexOf(cid);
              if (idx >= 0) {
                checkedConfigIds.splice(idx, 1);
              } else {
                checkedConfigIds.push(cid);
              }
            }
          } else {
            // Body click: switch primary, clear multi-select
            primaryConfigId = cid;
            checkedConfigIds = [];
          }
          rerender();
          return;
        }

        // Radio select — applies to primary + all checked activities
        var radioItem = e.target.closest('.vb-radio-item');
        if (radioItem) {
          var group = radioItem.closest('.vb-radio-group');
          if (group) {
            group.querySelectorAll('.vb-radio-item').forEach(function (r) {
              r.classList.remove('vb-radio-item--selected');
              r.querySelector('input').checked = false;
            });
            radioItem.classList.add('vb-radio-item--selected');
            radioItem.querySelector('input').checked = true;
            if (primaryConfigId) configState[primaryConfigId] = 'done';
            checkedConfigIds.forEach(function (cid) { configState[cid] = 'done'; });
          }
          return;
        }

        // Click on overlay background
        if (e.target === ov) {
          closeOverlay(ov);
        }
      });
    }

    function closeOverlay(ov) {
      ov.classList.remove('vb-overlay--open');
      setTimeout(function () { ov.remove(); }, 200);
    }

    overlay = render();
  }

  function closeOverlay(ov) {
    ov.classList.remove('vb-overlay--open');
    setTimeout(function () { ov.remove(); }, 200);
  }

  window.openVariationBuilder = function (methodName) {
    openBuilder(methodName);
  };

})();
