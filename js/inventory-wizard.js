// ========================================
// INVENTORY WIZARD — Create new inventory
// ========================================

(function () {

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('inv-wizard-overlay');
  var wizardEl = overlay.querySelector('.inv-wizard');
  var titleEl = overlay.querySelector('.wizard-header-title');
  var closeBtn = overlay.querySelector('.wizard-close-btn');
  var body = overlay.querySelector('.wizard-body');
  var footer = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================
  var currentStep = 0; // 0-indexed: 0=BasicInfo, 1=Entities, 2=Activities, 3=TrimActivities, 4=Review
  var consolidationChoice = 'operational';
  var activitySelections = {};   // { activityId: true/false }
  var entitySelections = {};     // { entityId: true/false } — Screen 3 selections
  var entityExpanded = {};       // { entityId: true/false }
  var trimEntitySelections = {}; // { entityId: true/false } — Screen 4 entity picks (subset of entitySelections)
  var trimIncluded = {};         // { activityId: true/false } — activities included for selected entities
  var formData = {
    name: '',
    startDate: '01/01/2026',
    endDate: '12/31/2026',
    framework: 'GHG Protocol Corporate Standard',
    gwp: 'ARS 100-year GWP (IPCC 2014)',
    gases: 'Kyoto 7 GHGs (CO\u2082, CH\u2084, N\u2082O, HFCs, PFCs, SF\u2086, NF\u2083)'
  };

  var STEP_WIDTHS = [800, 1000, 1000, 1200, 1000];

  var STEPS = [
    { label: 'Basic info', key: 'basic' },
    { label: 'Add entities', key: 'entities' },
    { label: 'Select activities', key: 'activities' },
    { label: 'Trim activities', key: 'trim' },
    { label: 'Review', key: 'review' }
  ];

  // ===========================================
  // SAMPLE DATA
  // ===========================================

  var ACTIVITIES = [
    // Scope 1
    { id: 'sc',  name: 'Stationary combustion',           scope: 1, entities: 1223, records: 847,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'mc',  name: 'Mobile combustion',                scope: 1, entities: 1223, records: 847,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'fe',  name: 'Fugitive emissions',               scope: 1, entities: 987,  records: 634,  calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'pe2', name: 'Process emissions',                 scope: 1, entities: 412,  records: 283,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    // Scope 2
    { id: 'pe',  name: 'Purchased electricity',             scope: 2, entities: 1223, records: 847,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'sh',  name: 'Purchased steam & heat',            scope: 2, entities: 890,  records: 612,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'pc',  name: 'Purchased cooling',                 scope: 2, entities: 345,  records: 198,  calc: 'GHG Protocol v3.1',  status: 'need' },
    // Scope 3
    { id: 'pgs', name: 'Purchased goods & services',        scope: 3, entities: 1102, records: 4210, calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'cg',  name: 'Capital goods',                     scope: 3, entities: 578,  records: 1340, calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'fera',name: 'Fuel & energy related activities',  scope: 3, entities: 1041, records: 892,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'ut',  name: 'Upstream transportation',           scope: 3, entities: 764,  records: 2105, calc: 'RA+ Standard v2.1',  status: 'need' },
    { id: 'wg',  name: 'Waste generated in operations',     scope: 3, entities: 923,  records: 1570, calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'bt',  name: 'Business travel',                   scope: 3, entities: 645,  records: 423,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'ec',  name: 'Employee commuting',                scope: 3, entities: 645,  records: 389,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'dt',  name: 'Downstream transportation',         scope: 3, entities: 510,  records: 1780, calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'usp', name: 'Use of sold products',              scope: 3, entities: 298,  records: 940,  calc: 'GHG Protocol v3.1',  status: 'need' },
    { id: 'eol', name: 'End-of-life treatment',             scope: 3, entities: 298,  records: 467,  calc: 'GHG Protocol v3.1',  status: 'ready' },
    { id: 'fr',  name: 'Franchises',                        scope: 3, entities: 134,  records: 312,  calc: 'RA+ Standard v2.1',  status: 'ready' },
    { id: 'inv', name: 'Investments',                       scope: 3, entities: 89,   records: 156,  calc: 'RA+ Standard v2.1',  status: 'need' }
  ];

  // Initialize activity selections (all selected by default)
  ACTIVITIES.forEach(function (a) { activitySelections[a.id] = true; });

  var ENTITY_TREE = [
    {
      id: 'americas', name: 'Americas', total: 534, activities: 40, records: 8420,
      children: [
        {
          id: 'offices', name: 'Offices', total: 127, activities: 8, records: 1632,
          children: [
            { id: 'boston-a',  name: 'Boston HQ - Building A', total: 0, activities: 1, records: 364, children: [] },
            { id: 'boston-b',  name: 'Boston HQ - Building B', total: 0, activities: 1, records: 233, children: [] },
            { id: 'denver-r', name: 'Denver Regional Office',  total: 0, activities: 2, records: 692, children: [] },
            { id: 'toronto',  name: 'Toronto Office',          total: 0, activities: 1, records: 164, children: [] },
            { id: 'mexico',   name: 'Mexico City Office',      total: 0, activities: 2, records: 813, children: [] },
            { id: 'denver-o', name: 'Denver Regional office',  total: 0, activities: 1, records: 197, children: [] }
          ]
        },
        { id: 'warehouses', name: 'Warehouses', total: 89, activities: 18, records: 4309, children: [] },
        { id: 'factories',  name: 'Factories',  total: 224, activities: 14, records: 2136, children: [] }
      ]
    },
    { id: 'emea', name: 'EMEA', total: 489, activities: 11, records: 7230, children: [] },
    { id: 'apac', name: 'APAC', total: 224, activities: 9,  records: 8420, children: [] }
  ];

  // Initialize entity expanded states
  entityExpanded['americas'] = true;
  entityExpanded['offices'] = true;

  // Initialize trim included/excluded for demo
  var TRIM_INCLUDED = ['fe', 'pe', 'sh', 'bt', 'pgs', 'wg', 'ec', 'eol'];
  var TRIM_EXCLUDED = ['sc', 'mc'];
  ACTIVITIES.forEach(function (a) { trimIncluded[a.id] = true; }); // default all included
  TRIM_EXCLUDED.forEach(function (id) { trimIncluded[id] = false; }); // then exclude these

  // ===========================================
  // TOTALS — computed dynamically from selections
  // ===========================================
  function getTotals() {
    // Activities: count checked items from step 1 (Select activities)
    var totalActivities = 0;
    ACTIVITIES.forEach(function (a) {
      if (activitySelections[a.id]) totalActivities++;
    });

    // Entities & Records: sum from checked items in step 2 (Add entities)
    var totalEntities = 0;
    var totalRecords = 0;
    function walkSelected(nodes) {
      nodes.forEach(function (n) {
        if (entitySelections[n.id]) {
          // Count this node's own total (leaf count) or 1 for leaf nodes
          totalEntities += (n.total > 0 ? n.total : 1);
          totalRecords += n.records;
        }
        if (n.children && n.children.length) {
          walkSelected(n.children);
        }
      });
    }
    walkSelected(ENTITY_TREE);

    return {
      activities: totalActivities,
      entities: totalEntities,
      records: totalRecords
    };
  }

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    currentStep = 0;
    render();
    overlay.classList.add('wizard-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('wizard-overlay--open');
    document.body.style.overflow = '';
  }

  window.openInventoryWizard = openWizard;
  window.closeInventoryWizard = closeWizard;

  closeBtn.addEventListener('click', closeWizard);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWizard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('wizard-overlay--open')) closeWizard();
  });

  // ===========================================
  // RENDER DISPATCHER
  // ===========================================

  function render() {
    // Update width
    wizardEl.style.width = (STEP_WIDTHS[currentStep] || 800) + 'px';
    switch (currentStep) {
      case 0: renderBasicInfo(); break;
      case 1: renderAddEntities(); break;
      case 2: renderSelectActivities(); break;
      case 3: initTrimSelections(); renderTrimActivities(); break;
      case 4: renderReview(); break;
    }
  }

  // ===========================================
  // STEPPER BUILDER
  // ===========================================

  function buildStepper(activeIndex) {
    var html = '<div class="wizard-stepper">';
    for (var i = 0; i < STEPS.length; i++) {
      var cls = 'wizard-stepper-item';
      if (i < activeIndex) cls += ' wizard-stepper-item--complete';
      else if (i === activeIndex) cls += ' wizard-stepper-item--active';

      html += '<div class="' + cls + '">';
      html += '<div class="wizard-stepper-label">' + (i + 1) + '. ' + esc(STEPS[i].label);
      if (i < activeIndex) {
        html += ' <span class="wizard-stepper-check"><i class="fa-solid fa-check"></i></span>';
      }
      html += '</div>';
      html += '<div class="wizard-stepper-bar"><div class="wizard-stepper-bar-fill"></div></div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===========================================
  // STATS BAR BUILDER
  // ===========================================

  function buildStatsBar() {
    var t = getTotals();
    return '<div class="inv-stats-bar">' +
      '<div class="inv-stat"><span class="inv-stat-value" id="inv-kpi-activities">' + numberFmt(t.activities) + '</span><span class="inv-stat-label">Activities</span></div>' +
      '<div class="inv-stat"><span class="inv-stat-value" id="inv-kpi-entities">' + numberFmt(t.entities) + '</span><span class="inv-stat-label">Entities selected</span></div>' +
      '<div class="inv-stat"><span class="inv-stat-value" id="inv-kpi-records">' + numberFmt(t.records) + '</span><span class="inv-stat-label">Records</span></div>' +
      '</div>';
  }

  function refreshStatsBar() {
    var t = getTotals();
    var elAct = document.getElementById('inv-kpi-activities');
    var elEnt = document.getElementById('inv-kpi-entities');
    var elRec = document.getElementById('inv-kpi-records');
    if (elAct) elAct.textContent = numberFmt(t.activities);
    if (elEnt) elEnt.textContent = numberFmt(t.entities);
    if (elRec) elRec.textContent = numberFmt(t.records);
  }

  // ===========================================
  // STEP 0 — BASIC INFO
  // ===========================================

  function renderBasicInfo() {
    titleEl.textContent = 'Create new inventory: basic info';

    var stepperHTML = buildStepper(0);

    var formHTML =
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--w368">' +
          '<label class="inv-form-label">Inventory name</label>' +
          '<input type="text" class="inv-form-input" id="inv-name" value="' + esc(formData.name) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">Start date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + esc(formData.startDate) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">End date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + esc(formData.endDate) + '">' +
        '</div>' +
      '</div>' +
      '<hr class="inv-form-divider">' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">GHG Framework</label>' +
          '<select class="inv-form-select"><option>' + esc(formData.framework) + '</option></select>' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">GWP Version</label>' +
          '<select class="inv-form-select"><option>' + esc(formData.gwp) + '</option></select>' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">Gases Covered</label>' +
          '<select class="inv-form-select"><option>' + esc(formData.gases) + '</option></select>' +
        '</div>' +
      '</div>' +
      '<hr class="inv-form-divider">' +
      '<div class="inv-consolidation">' +
        '<div class="inv-consolidation-title">Consolidation approach</div>' +
        buildRadioOption('operational', 'Operational control', 'Includes 100% of emissions from operations you control') +
        buildRadioOption('financial', 'Financial control', 'Includes 100% of emissions from operations you financially control') +
        buildRadioOption('equity', 'Equity share', 'Includes emissions proportional to your equity stake') +
      '</div>';

    body.innerHTML = stepperHTML + formHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Select entities</button>';

    bindFooterNav(-1, 1);

    // Radio binding
    body.querySelectorAll('input[name="consolidation"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        consolidationChoice = this.value;
      });
    });
  }

  function buildRadioOption(value, label, desc) {
    var checked = consolidationChoice === value ? ' checked' : '';
    return '<div class="inv-radio-option">' +
      '<label class="inv-radio-row">' +
        '<input type="radio" name="consolidation" value="' + value + '" class="inv-radio"' + checked + '>' +
        '<span class="inv-radio-label">' + esc(label) + '</span>' +
      '</label>' +
      '<div class="inv-radio-desc">' + esc(desc) + '</div>' +
    '</div>';
  }

  // ===========================================
  // STEP 1 — SELECT ACTIVITIES
  // ===========================================

  function renderSelectActivities() {
    titleEl.textContent = 'Create new inventory: Select activities';

    var stepperHTML = buildStepper(2);
    var statsHTML = buildStatsBar();

    var toolbarHTML =
      '<div class="inv-toolbar">' +
        '<input type="text" class="inv-search" placeholder="Search activities...">' +
        '<button class="inv-bulk-btn">Bulk Actions <i class="fa-solid fa-chevron-down" style="font-size:10px"></i></button>' +
      '</div>';

    var allActSelected = ACTIVITIES.every(function (a) { return activitySelections[a.id]; });
    var tableHTML =
      '<div class="inv-table-wrap"><table class="inv-table">' +
        '<thead><tr>' +
          '<th style="width:32px"><input type="checkbox" class="inv-table-checkbox" id="inv-act-select-all"' + (allActSelected ? ' checked' : '') + '></th>' +
          '<th>Activities</th>' +
          '<th>Status</th>' +
          '<th style="text-align:right">Entities</th>' +
          '<th style="text-align:right">Records</th>' +
          '<th>Calc method</th>' +
          '<th></th>' +
          '<th style="width:32px"></th>' +
        '</tr></thead><tbody>';

    ACTIVITIES.forEach(function (a) {
      var scopeClass = a.scope === 1 ? 'inv-scope-badge--s1' : a.scope === 2 ? 'inv-scope-badge--s2' : 'inv-scope-badge--s3';
      var statusClass = a.status === 'ready' ? 'inv-status-badge--ready' : 'inv-status-badge--need';
      var statusIcon = a.status === 'ready' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-info"></i>';
      var statusText = a.status === 'ready' ? 'Ready' : 'Needs data';
      var checked = activitySelections[a.id] ? ' checked' : '';

      tableHTML +=
        '<tr>' +
          '<td><input type="checkbox" class="inv-table-checkbox" data-act-id="' + a.id + '"' + checked + '></td>' +
          '<td>' + esc(a.name) + '</td>' +
          '<td><span class="inv-scope-badge ' + scopeClass + '">Scope ' + a.scope + '</span></td>' +
          '<td style="text-align:right">' + numberFmt(a.entities) + '</td>' +
          '<td style="text-align:right">' + numberFmt(a.records) + '</td>' +
          '<td><span class="inv-calc-select">' + esc(a.calc) + ' <i class="fa-solid fa-chevron-down"></i></span></td>' +
          '<td><span class="inv-status-badge ' + statusClass + '">' + statusIcon + ' ' + statusText + '</span></td>' +
          '<td><button class="inv-more-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>' +
        '</tr>';
    });

    tableHTML += '</tbody></table></div>';

    body.innerHTML = stepperHTML + statsHTML + toolbarHTML + tableHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Trim activities</button>';

    bindFooterNav(1, 3);

    // Individual checkbox binding
    body.querySelectorAll('.inv-table-checkbox[data-act-id]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        activitySelections[this.dataset.actId] = this.checked;
        // Update select-all state
        var selectAll = document.getElementById('inv-act-select-all');
        if (selectAll) {
          selectAll.checked = ACTIVITIES.every(function (a) { return activitySelections[a.id]; });
        }
        refreshStatsBar();
      });
    });

    // Select-all checkbox
    var selectAllAct = document.getElementById('inv-act-select-all');
    if (selectAllAct) {
      selectAllAct.addEventListener('change', function () {
        var checked = this.checked;
        ACTIVITIES.forEach(function (a) { activitySelections[a.id] = checked; });
        body.querySelectorAll('.inv-table-checkbox[data-act-id]').forEach(function (cb) {
          cb.checked = checked;
        });
        refreshStatsBar();
      });
    }
  }

  // ===========================================
  // STEP 2 — ADD ENTITIES
  // ===========================================

  function renderAddEntities() {
    titleEl.textContent = 'Create new inventory: Add entities';

    var stepperHTML = buildStepper(1);
    var statsHTML = buildStatsBar();

    var toolbarHTML =
      '<div class="inv-toolbar">' +
        '<input type="text" class="inv-search" placeholder="Search entities...">' +
        '<button class="inv-bulk-btn">Bulk Actions <i class="fa-solid fa-chevron-down" style="font-size:10px"></i></button>' +
      '</div>';

    var selectAllChecked = isAllEntitiesSelected() ? ' checked' : '';
    var headerHTML =
      '<div class="inv-tree-header">' +
        '<span class="inv-tree-header-entity" style="display:flex;align-items:center;gap:8px">' +
          '<input type="checkbox" class="inv-tree-cb" id="inv-select-all"' + selectAllChecked + '>' +
          'Entities <span class="inv-tree-name-count">(selected/total)</span>' +
        '</span>' +
        '<span class="inv-tree-header-act">Activities</span>' +
        '<span class="inv-tree-header-rec">Records</span>' +
      '</div>';

    var treeHTML = '<div class="inv-tree-wrap" id="inv-entity-tree-wrap">' + buildEntityTree(ENTITY_TREE, 0) + '</div>';

    body.innerHTML = stepperHTML + statsHTML + toolbarHTML + headerHTML + treeHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Select activities</button>';

    bindFooterNav(0, 2);
    bindTreeInteractions();
  }

  function isAllEntitiesSelected() {
    var all = true;
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (!entitySelections[n.id]) all = false;
        if (n.children) walk(n.children);
      });
    }
    walk(ENTITY_TREE);
    return all;
  }

  function buildEntityTree(nodes, depth) {
    var html = '';
    nodes.forEach(function (node, idx) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = entityExpanded[node.id];
      var isLast = idx === nodes.length - 1;
      var isChecked = entitySelections[node.id];
      var selectedCount = countSelected(node);
      var totalCount = node.total || countTotal(node);

      html += '<div class="inv-tree-node" data-node-id="' + node.id + '" style="padding-left:' + (depth * 24) + 'px">';

      // Toggle arrow
      if (hasChildren) {
        html += '<button class="inv-tree-toggle" data-toggle-id="' + node.id + '">' +
          '<i class="fa-solid fa-chevron-' + (isExpanded ? 'down' : 'right') + '"></i>' +
          '</button>';
      } else {
        html += '<span class="inv-tree-toggle inv-tree-toggle--leaf"></span>';
      }

      // Checkbox
      html += '<input type="checkbox" class="inv-tree-cb" data-cb-id="' + node.id + '"' + (isChecked ? ' checked' : '') + '>';

      // Name
      html += '<span class="inv-tree-name">' + esc(node.name);
      if (hasChildren || totalCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selectedCount + '/' + totalCount + ')</span>';
      }
      html += '</span>';

      // Activities & Records
      html += '<span class="inv-tree-act">' + node.activities + '</span>';
      html += '<span class="inv-tree-rec">' + numberFmt(node.records) + '</span>';

      html += '</div>';

      // Children
      if (hasChildren) {
        html += '<div class="inv-tree-children' + (isExpanded ? ' inv-tree-children--open' : '') + '" data-children-id="' + node.id + '">';
        html += buildEntityTree(node.children, depth + 1);
        html += '</div>';
      }
    });
    return html;
  }

  function countSelected(node) {
    var count = 0;
    if (entitySelections[node.id]) count++;
    if (node.children) {
      node.children.forEach(function (c) { count += countSelected(c); });
    }
    return count;
  }

  function countTotal(node) {
    if (node.total > 0) return node.total;
    var count = 0;
    if (node.children) {
      node.children.forEach(function (c) { count += countTotal(c); });
    }
    return count || 1;
  }

  // Helper: find a node by id in the tree
  function findNode(id, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
      if (nodes[i].children) {
        var found = findNode(id, nodes[i].children);
        if (found) return found;
      }
    }
    return null;
  }

  // Cascading: set all descendants to the same checked state
  function setDescendants(node, checked, selectionMap) {
    if (node.children) {
      node.children.forEach(function (c) {
        selectionMap[c.id] = checked;
        setDescendants(c, checked, selectionMap);
      });
    }
  }

  // Refresh the entity tree UI checkboxes to match state
  function refreshEntityTreeUI() {
    body.querySelectorAll('.inv-tree-cb[data-cb-id]').forEach(function (cb) {
      cb.checked = !!entitySelections[cb.dataset.cbId];
    });
    var selectAll = document.getElementById('inv-select-all');
    if (selectAll) selectAll.checked = isAllEntitiesSelected();
  }

  function bindTreeInteractions() {
    // Toggle expand/collapse
    body.querySelectorAll('.inv-tree-toggle[data-toggle-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.dataset.toggleId;
        entityExpanded[id] = !entityExpanded[id];
        var childrenEl = body.querySelector('[data-children-id="' + id + '"]');
        var icon = this.querySelector('i');
        if (childrenEl) {
          childrenEl.classList.toggle('inv-tree-children--open');
        }
        if (icon) {
          icon.className = entityExpanded[id] ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right';
        }
      });
    });

    // Checkbox with cascading selection
    body.querySelectorAll('.inv-tree-cb[data-cb-id]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = this.dataset.cbId;
        var checked = this.checked;
        entitySelections[id] = checked;
        // Cascade to children
        var node = findNode(id, ENTITY_TREE);
        if (node) setDescendants(node, checked, entitySelections);
        refreshEntityTreeUI();
        refreshStatsBar();
      });
    });

    // Select All checkbox
    var selectAll = document.getElementById('inv-select-all');
    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var checked = this.checked;
        function walkAll(nodes) {
          nodes.forEach(function (n) {
            entitySelections[n.id] = checked;
            if (n.children) walkAll(n.children);
          });
        }
        walkAll(ENTITY_TREE);
        refreshEntityTreeUI();
        refreshStatsBar();
      });
    }
  }

  // ===========================================
  // STEP 3 — TRIM / FILTER ACTIVITIES
  // ===========================================

  // On entering step 3, reset trim state
  function initTrimSelections() {
    trimEntitySelections = {};
    // Reset all activities to included; user removes from here
    ACTIVITIES.forEach(function (a) { trimIncluded[a.id] = true; });
  }

  // Check if an entity (or any descendant) was selected on Screen 3
  function isEntityEligible(node) {
    if (entitySelections[node.id]) return true;
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        if (isEntityEligible(node.children[i])) return true;
      }
    }
    return false;
  }

  // Count how many entities are currently picked in Screen 4 trim
  function countTrimSelected() {
    var n = 0;
    for (var k in trimEntitySelections) {
      if (trimEntitySelections[k]) n++;
    }
    return n;
  }

  function renderTrimActivities() {
    titleEl.textContent = 'Create new inventory: Trim activities';

    var stepperHTML = buildStepper(3);
    var statsHTML = buildStatsBar();

    // Build left entity tree
    var leftHTML = buildFilterEntityTree(ENTITY_TREE, 0);

    // Build right activity columns
    var activityColumnsHTML = buildActivityColumns();

    var numSelected = countTrimSelected();
    var entityWord = numSelected === 1 ? 'entity' : 'entities';

    var splitHTML =
      '<div class="inv-filter-split">' +
        '<div class="inv-filter-left">' +
          '<div class="inv-tree-header" style="font-size:13px">' +
            '<span class="inv-tree-header-entity">Entities</span>' +
            '<span class="inv-tree-header-act" style="width:56px">Activities</span>' +
            '<span class="inv-tree-header-rec" style="width:56px">Records</span>' +
          '</div>' +
          '<div class="inv-tree-wrap" style="padding:8px">' + leftHTML + '</div>' +
        '</div>' +
        '<div class="inv-filter-right">' +
          '<div class="inv-filter-right-header">' +
            '<input type="text" class="inv-filter-search" placeholder="Filter activities">' +
          '</div>' +
          '<div id="inv-activity-columns-container">' + activityColumnsHTML + '</div>' +
        '</div>' +
      '</div>';

    body.innerHTML = stepperHTML + statsHTML + splitHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next">Next: Review</button>';

    bindFooterNav(2, 4);
    bindFilterTreeInteractions();
    bindActivityToggles();
  }

  function buildActivityColumns() {
    var numSelected = countTrimSelected();

    if (numSelected === 0) {
      return '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73;padding:16px 0">Select entities on the left to view their activities</div>';
    }

    var includedHTML = '';
    var excludedHTML = '';
    ACTIVITIES.forEach(function (a) {
      var scopeClass = a.scope === 1 ? 'inv-scope-badge--s1' : a.scope === 2 ? 'inv-scope-badge--s2' : 'inv-scope-badge--s3';
      if (trimIncluded[a.id]) {
        // Left column: clickable row to exclude (no checkbox)
        includedHTML +=
          '<div class="inv-activity-row inv-activity-row--included" data-trim-exclude-id="' + a.id + '">' +
            '<span class="inv-activity-row-name">' + esc(a.name) + '</span>' +
            '<span class="inv-scope-badge ' + scopeClass + '">Scope ' + a.scope + '</span>' +
            '<button class="inv-exclude-btn">Exclude</button>' +
          '</div>';
      } else {
        // Right column: no checkbox, just clickable row to restore
        excludedHTML +=
          '<div class="inv-activity-row inv-activity-row--excluded" data-trim-restore-id="' + a.id + '">' +
            '<span class="inv-activity-row-name">' + esc(a.name) + '</span>' +
            '<span class="inv-scope-badge ' + scopeClass + '">Scope ' + a.scope + '</span>' +
            '<button class="inv-restore-btn">Restore</button>' +
          '</div>';
      }
    });

    if (!includedHTML) {
      includedHTML = '<div style="font-size:13px;color:#676f73;padding:4px 0">None</div>';
    }
    if (!excludedHTML) {
      excludedHTML = '<div style="font-size:13px;color:#676f73;padding:4px 0">None</div>';
    }

    return '<div class="inv-activity-columns">' +
      '<div class="inv-activity-col" style="padding-right:16px">' +
        '<div class="inv-activity-col-title">Activities in both entities</div>' +
        includedHTML +
      '</div>' +
      '<div class="inv-activity-col" style="padding-left:16px;border-left:1px solid #d5dde0">' +
        '<div class="inv-activity-col-title">Activities excluded from both entities</div>' +
        excludedHTML +
      '</div>' +
    '</div>';
  }

  function refreshActivityColumns() {
    var container = document.getElementById('inv-activity-columns-container');
    if (container) {
      container.innerHTML = buildActivityColumns();
      bindActivityToggles();
    }
  }

  function bindActivityToggles() {
    // Left column: click "Exclude" to move to excluded
    body.querySelectorAll('[data-trim-exclude-id]').forEach(function (row) {
      row.addEventListener('click', function () {
        trimIncluded[this.dataset.trimExcludeId] = false;
        refreshActivityColumns();
      });
    });
    // Right column: click "Restore" to move back to included
    body.querySelectorAll('[data-trim-restore-id]').forEach(function (row) {
      row.addEventListener('click', function () {
        trimIncluded[this.dataset.trimRestoreId] = true;
        refreshActivityColumns();
      });
    });
  }

  function buildFilterEntityTree(nodes, depth) {
    var html = '';
    nodes.forEach(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = entityExpanded[node.id];
      var eligible = isEntityEligible(node);
      var isTrimSelected = trimEntitySelections[node.id] || false;
      var selectedCount = countSelected(node);
      var totalCount = node.total || countTotal(node);

      var disabledClass = eligible ? '' : ' opacity:0.4;';
      html += '<div class="inv-tree-node" style="padding-left:' + (depth * 20) + 'px;font-size:13px;' + disabledClass + '">';

      if (hasChildren) {
        html += '<button class="inv-tree-toggle" data-filter-toggle-id="' + node.id + '" style="width:20px;font-size:10px">' +
          '<i class="fa-solid fa-chevron-' + (isExpanded ? 'down' : 'right') + '"></i>' +
          '</button>';
      } else {
        html += '<span class="inv-tree-toggle inv-tree-toggle--leaf" style="width:20px"></span>';
      }

      // Checkbox: disabled if not eligible from Screen 3, checked from trimEntitySelections
      var disabledAttr = eligible ? '' : ' disabled';
      var checkedAttr = isTrimSelected ? ' checked' : '';
      html += '<input type="checkbox" class="inv-tree-cb" data-filter-cb-id="' + node.id + '"' + checkedAttr + disabledAttr + '>';

      html += '<span class="inv-tree-name" style="font-size:13px">' + esc(node.name);
      if (totalCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selectedCount + '/' + totalCount + ')</span>';
      }
      html += '</span>';

      html += '<span class="inv-tree-act" style="width:56px;font-size:13px">' + node.activities + '</span>';
      html += '<span class="inv-tree-rec" style="width:56px;font-size:13px">' + numberFmt(node.records) + '</span>';

      html += '</div>';

      if (hasChildren) {
        html += '<div class="inv-tree-children' + (isExpanded ? ' inv-tree-children--open' : '') + '" data-filter-children-id="' + node.id + '">';
        html += buildFilterEntityTree(node.children, depth + 1);
        html += '</div>';
      }
    });
    return html;
  }

  // Refresh Screen 4 filter tree checkboxes to match state
  function refreshFilterTreeUI() {
    body.querySelectorAll('.inv-tree-cb[data-filter-cb-id]').forEach(function (cb) {
      var id = cb.dataset.filterCbId;
      var eligible = isEntityEligible(findNode(id, ENTITY_TREE) || { id: id });
      cb.checked = !!trimEntitySelections[id];
      cb.disabled = !eligible;
    });
  }

  function bindFilterTreeInteractions() {
    // Toggle expand/collapse
    body.querySelectorAll('.inv-tree-toggle[data-filter-toggle-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.dataset.filterToggleId;
        entityExpanded[id] = !entityExpanded[id];
        var childrenEl = body.querySelector('[data-filter-children-id="' + id + '"]');
        var icon = this.querySelector('i');
        if (childrenEl) childrenEl.classList.toggle('inv-tree-children--open');
        if (icon) icon.className = entityExpanded[id] ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right';
      });
    });

    // Checkbox with cascading: updates trimEntitySelections, then refreshes
    body.querySelectorAll('.inv-tree-cb[data-filter-cb-id]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = this.dataset.filterCbId;
        var checked = this.checked;
        trimEntitySelections[id] = checked;
        // Cascade to eligible children
        var node = findNode(id, ENTITY_TREE);
        if (node) {
          (function cascadeFilter(n) {
            if (n.children) {
              n.children.forEach(function (c) {
                if (isEntityEligible(c)) {
                  trimEntitySelections[c.id] = checked;
                }
                cascadeFilter(c);
              });
            }
          })(node);
        }
        refreshFilterTreeUI();
        refreshActivityColumns();
      });
    });
  }

  // ===========================================
  // STEP 4 — REVIEW
  // ===========================================

  function renderReview() {
    titleEl.textContent = 'Create new inventory: Review';

    var stepperHTML = buildStepper(4);
    var statsHTML = buildStatsBar();

    // Basic info review
    var basicReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Basic information</div>' +
        '<div class="inv-review-grid">' +
          '<span class="inv-review-label">Inventory name</span><span class="inv-review-value">' + esc(formData.name || '(not set)') + '</span>' +
          '<span class="inv-review-label">Start date</span><span class="inv-review-value">' + esc(formData.startDate) + '</span>' +
          '<span class="inv-review-label">End date</span><span class="inv-review-value">' + esc(formData.endDate) + '</span>' +
          '<span class="inv-review-label">GHG Framework</span><span class="inv-review-value">' + esc(formData.framework) + '</span>' +
          '<span class="inv-review-label">GWP Version</span><span class="inv-review-value">' + esc(formData.gwp) + '</span>' +
          '<span class="inv-review-label">Gases</span><span class="inv-review-value">' + esc(formData.gases) + '</span>' +
          '<span class="inv-review-label">Consolidation</span><span class="inv-review-value" style="text-transform:capitalize">' + esc(consolidationChoice) + '</span>' +
        '</div>' +
      '</div>';

    // Activities review
    var selectedActivities = ACTIVITIES.filter(function (a) { return activitySelections[a.id]; });
    var actChips = '';
    selectedActivities.forEach(function (a) {
      var scopeClass = a.scope === 1 ? 'inv-scope-badge--s1' : a.scope === 2 ? 'inv-scope-badge--s2' : 'inv-scope-badge--s3';
      actChips += '<span class="inv-review-chip">' + esc(a.name) + ' <span class="inv-scope-badge ' + scopeClass + '" style="margin-left:6px;font-size:11px;padding:1px 6px">S' + a.scope + '</span></span>';
    });
    var actReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Selected activities (' + selectedActivities.length + ')</div>' +
        '<div class="inv-review-list">' + actChips + '</div>' +
      '</div>';

    // Entities review
    var entitiesReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Entities</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">1,241 entities selected across 3 regions (Americas, EMEA, APAC)</div>' +
      '</div>';

    // Trim review
    var trimmedIn = ACTIVITIES.filter(function (a) { return trimIncluded[a.id]; });
    var trimmedOut = ACTIVITIES.filter(function (a) { return !trimIncluded[a.id]; });
    var trimReview =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Activity trim</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#1d201f">' + trimmedIn.length + ' activities included, ' + trimmedOut.length + ' removed for selected entities</div>' +
      '</div>';

    body.innerHTML = stepperHTML + statsHTML + basicReview + actReview + entitiesReview + trimReview;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="inv-back">Back</button>' +
      '<button class="wizard-btn-green" id="inv-next" style="min-width:180px">Complete setup</button>';

    var backBtn = footer.querySelector('#inv-back');
    backBtn.addEventListener('click', function () { currentStep = 3; render(); });

    var nextBtn = footer.querySelector('#inv-next');
    nextBtn.addEventListener('click', function () { closeWizard(); });
  }

  // ===========================================
  // FOOTER NAVIGATION HELPER
  // ===========================================

  function bindFooterNav(backStep, nextStep) {
    var backBtn = footer.querySelector('#inv-back');
    var nextBtn = footer.querySelector('#inv-next');

    if (backBtn && backStep >= 0) {
      backBtn.addEventListener('click', function () { currentStep = backStep; render(); });
    } else if (backBtn) {
      backBtn.style.visibility = 'hidden';
    }

    if (nextBtn && nextStep >= 0 && nextStep <= 4) {
      nextBtn.addEventListener('click', function () { currentStep = nextStep; render(); });
    }
  }

  // ===========================================
  // UTILITIES
  // ===========================================

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function numberFmt(n) {
    if (typeof n !== 'number') return n;
    return n.toLocaleString();
  }

})();
