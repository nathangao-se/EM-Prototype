// ========================================
// CAMPAIGN WIZARD — Data collection campaign
// ========================================

(function () {

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('dcc-wizard-overlay');
  var wizardEl = overlay.querySelector('.dcc-wizard');
  var titleEl = overlay.querySelector('.wizard-header-title');
  var closeBtn = overlay.querySelector('.wizard-close-btn');
  var body = overlay.querySelector('.wizard-body');
  var footer = overlay.querySelector('.wizard-footer');

  // ===========================================
  // STATE
  // ===========================================
  var currentStep = 0;
  var templatesChecked = false;
  var selectedActivityIdx = 0;
  var entitySelections = {};
  var entityExpanded = {};
  var formData = {
    name: '',
    startDate: '',
    endDate: '',
    prompt: 'Exact semantic and scope match: \'Fuel cell - Natural Gas\' is a direct fuel-cell'
  };
  var collaborators = ['E. Honnig', 'J. Lee'];

  var STEP_WIDTHS = [680, 680, 1000, 680];

  var STEPS = [
    { label: 'Basic info', key: 'basic' },
    { label: 'Campaign targets', key: 'targets' },
    { label: 'Activities selection', key: 'activities' },
    { label: 'Finalize', key: 'finalize' }
  ];

  // ===========================================
  // SAMPLE DATA
  // ===========================================

  var TEMPLATES = [
    { name: 'Main template', categories: 12 },
    { name: 'Template electricity only', categories: 6 },
    { name: 'Template Europe', categories: 4 }
  ];

  var CAMPAIGN_ACTIVITIES = [
    { id: 'elec',  name: 'Electricity',  color: '#008029', totalEntities: 312, selectedEntities: 312 },
    { id: 'gas',   name: 'Natural Gas',  color: '#008029', totalEntities: 203, selectedEntities: 83 },
    { id: 'water', name: 'Water',        color: '#0075a3', totalEntities: 382, selectedEntities: 245 },
    { id: 'fleet', name: 'Fleet Fuel',   color: '#008029', totalEntities: 259, selectedEntities: 156 }
  ];

  // Reuse the same entity tree as inventory wizard
  var ENTITY_TREE = [
    {
      id: 'dcc-americas', name: 'Americas', total: 534, activities: 40, records: 8420,
      children: [
        {
          id: 'dcc-offices', name: 'Offices', total: 127, activities: 8, records: 1632,
          children: [
            { id: 'dcc-boston-a',  name: 'Boston HQ - Building A', total: 0, activities: 1, records: 364, children: [] },
            { id: 'dcc-boston-b',  name: 'Boston HQ - Building B', total: 0, activities: 1, records: 233, children: [] },
            { id: 'dcc-denver-r', name: 'Denver Regional Office',  total: 0, activities: 2, records: 692, children: [] },
            { id: 'dcc-toronto',  name: 'Toronto Office',          total: 0, activities: 1, records: 164, children: [] },
            { id: 'dcc-mexico',   name: 'Mexico City Office',      total: 0, activities: 2, records: 813, children: [] },
            { id: 'dcc-denver-o', name: 'Denver Regional office',  total: 0, activities: 1, records: 197, children: [] }
          ]
        },
        { id: 'dcc-warehouses', name: 'Warehouses', total: 89, activities: 18, records: 4309, children: [] },
        { id: 'dcc-factories',  name: 'Factories',  total: 224, activities: 14, records: 2136, children: [] }
      ]
    },
    { id: 'dcc-emea', name: 'EMEA', total: 489, activities: 11, records: 7230, children: [] },
    { id: 'dcc-apac', name: 'APAC', total: 224, activities: 9,  records: 8420, children: [] }
  ];

  entityExpanded['dcc-americas'] = true;
  entityExpanded['dcc-offices'] = true;

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openWizard() {
    currentStep = 0;
    templatesChecked = false;
    selectedActivityIdx = 0;
    entitySelections = {};
    collaborators = ['E. Honnig', 'J. Lee'];
    render();
    overlay.classList.add('wizard-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('wizard-overlay--open');
    document.body.style.overflow = '';
  }

  window.openCampaignWizard = openWizard;
  window.closeCampaignWizard = closeWizard;

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
    wizardEl.style.width = (STEP_WIDTHS[currentStep] || 680) + 'px';
    switch (currentStep) {
      case 0: renderBasicInfo(); break;
      case 1: renderCampaignTargets(); break;
      case 2: renderActivitiesSelection(); break;
      case 3: renderFinalize(); break;
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
  // STEP 0 — BASIC INFO
  // ===========================================

  function renderBasicInfo() {
    titleEl.textContent = 'Data collection campaign';

    var stepperHTML = buildStepper(0);

    var formHTML =
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">Campaign name</label>' +
          '<input type="text" class="inv-form-input" id="dcc-name" value="' + esc(formData.name) + '">' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">Start date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + esc(formData.startDate) + '">' +
        '</div>' +
        '<div class="inv-form-field inv-form-field--flex1">' +
          '<label class="inv-form-label">End date</label>' +
          '<input type="text" class="inv-form-input" placeholder="mm/dd/yyyy" value="' + esc(formData.endDate) + '">' +
        '</div>' +
      '</div>' +
      '<div class="inv-form-row">' +
        '<div class="inv-form-field" style="width:100%">' +
          '<label class="inv-form-label">What do the respondents need to provide here?</label>' +
          '<textarea class="dcc-textarea">' + esc(formData.prompt) + '</textarea>' +
        '</div>' +
      '</div>' +
      '<label class="dcc-checkbox-row">' +
        '<input type="checkbox" class="dcc-checkbox" id="dcc-templates-check"' + (templatesChecked ? ' checked' : '') + '>' +
        '<span class="dcc-checkbox-label">Add templates for reference</span>' +
      '</label>';

    if (templatesChecked) {
      formHTML += buildTemplateList();
    }

    body.innerHTML = stepperHTML + formHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back" style="visibility:hidden">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: add emissions files</button>';

    bindFooterNav(-1, 1);

    // Template checkbox toggle
    var templateCb = document.getElementById('dcc-templates-check');
    if (templateCb) {
      templateCb.addEventListener('change', function () {
        templatesChecked = this.checked;
        render();
      });
    }
  }

  function buildTemplateList() {
    var html = '<div class="dcc-template-list">';
    TEMPLATES.forEach(function (t) {
      html +=
        '<div class="dcc-template-item">' +
          '<input type="checkbox" class="dcc-checkbox dcc-checkbox--small">' +
          '<span class="dcc-template-name">' + esc(t.name) + '</span>' +
          '<a href="#" class="dcc-template-preview">Preview <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px"></i></a>' +
          '<span class="dcc-template-meta">' + t.categories + ' categories</span>' +
          '<button class="dcc-template-sort"><i class="fa-solid fa-arrows-up-down" style="font-size:12px;color:#676f73"></i></button>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  // ===========================================
  // STEP 1 — CAMPAIGN TARGETS
  // ===========================================

  function renderCampaignTargets() {
    titleEl.textContent = 'Data collection campaign';

    var stepperHTML = buildStepper(1);

    var headerHTML =
      '<div class="inv-tree-header">' +
        '<span class="inv-tree-header-entity">Entities</span>' +
        '<span class="inv-tree-header-act">Activities</span>' +
        '<span class="inv-tree-header-rec">Records</span>' +
      '</div>';
    var treeHTML = '<div class="inv-tree-wrap" style="max-height:300px">' + buildEntityTree(ENTITY_TREE, 0) + '</div>';
    var contentHTML = headerHTML + treeHTML + buildCollaboratorSection();

    body.innerHTML = stepperHTML + contentHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: add emissions files</button>';

    bindFooterNav(0, 2);
    bindTreeInteractions();
  }

  function buildCollaboratorSection() {
    var tagsHTML = '';
    collaborators.forEach(function (c, idx) {
      tagsHTML += '<span class="wizard-collab-tag">' + esc(c) +
        ' <button class="wizard-collab-tag-remove" data-collab-idx="' + idx + '"><i class="fa-solid fa-xmark"></i></button></span>';
    });
    return '<div style="display:flex;flex-direction:column;gap:4px;margin-top:8px">' +
      '<label class="inv-form-label">Select collaborators from your organization</label>' +
      '<input type="text" class="inv-form-input" placeholder="">' +
      '<div class="wizard-collab-tags">' + tagsHTML + '</div>' +
    '</div>';
  }

  // ===========================================
  // STEP 2 — ACTIVITIES SELECTION (split view)
  // ===========================================

  function renderActivitiesSelection() {
    titleEl.textContent = 'Data collection campaign';

    var stepperHTML = buildStepper(2);

    // Left: activity list
    var leftHTML = '<div class="dcc-activity-list">';
    CAMPAIGN_ACTIVITIES.forEach(function (a, idx) {
      var isActive = idx === selectedActivityIdx;
      leftHTML +=
        '<div class="dcc-activity-item' + (isActive ? ' dcc-activity-item--active' : '') + '" data-act-idx="' + idx + '">' +
          '<div class="dcc-activity-item-header">' +
            '<span class="dcc-activity-dot" style="background:' + a.color + '"></span>' +
            '<span class="dcc-activity-item-name">' + esc(a.name) + '</span>' +
            '<a href="#" class="dcc-customize-link">Customize <i class="fa-solid fa-chevron-right" style="font-size:10px"></i></a>' +
          '</div>' +
          '<div class="dcc-activity-item-meta">' +
            (a.selectedEntities === a.totalEntities
              ? 'all ' + a.totalEntities + ' entities selected'
              : a.selectedEntities + ' out of ' + a.totalEntities + ' entities selected') +
          '</div>' +
        '</div>';
    });
    leftHTML += '</div>';

    // Right: entity selection for selected activity
    var rightHTML = '<div class="dcc-detail-panel">';
    rightHTML += '<div class="dcc-detail-header">Entity selection</div>';
    var headerHTML =
      '<div class="inv-tree-header" style="font-size:13px">' +
        '<span class="inv-tree-header-entity">Entities</span>' +
        '<span class="inv-tree-header-act">Activities</span>' +
        '<span class="inv-tree-header-rec">Records</span>' +
      '</div>';
    var treeHTML = '<div class="inv-tree-wrap" style="max-height:500px;padding:8px">' + buildEntityTree(ENTITY_TREE, 0) + '</div>';
    rightHTML += headerHTML + treeHTML + '</div>';

    var splitHTML =
      '<div class="dcc-split-view">' +
        '<div class="dcc-split-left">' + leftHTML + '</div>' +
        '<div class="dcc-split-divider"></div>' +
        '<div class="dcc-split-right">' + rightHTML + '</div>' +
      '</div>';

    body.innerHTML = stepperHTML + splitHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next">Next: add emissions files</button>';

    bindFooterNav(1, 3);
    bindTreeInteractions();

    // Activity item click
    body.querySelectorAll('.dcc-activity-item').forEach(function (el) {
      el.addEventListener('click', function () {
        selectedActivityIdx = parseInt(this.dataset.actIdx, 10);
        render();
      });
    });
  }

  // ===========================================
  // STEP 3 — FINALIZE (Review)
  // ===========================================

  function renderFinalize() {
    titleEl.textContent = 'Data collection campaign';

    var stepperHTML = buildStepper(3);

    var reviewHTML =
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Campaign details</div>' +
        '<div class="inv-review-grid">' +
          '<span class="inv-review-label">Campaign name</span><span class="inv-review-value">' + esc(formData.name || '(not set)') + '</span>' +
          '<span class="inv-review-label">Start date</span><span class="inv-review-value">' + esc(formData.startDate || '(not set)') + '</span>' +
          '<span class="inv-review-label">End date</span><span class="inv-review-value">' + esc(formData.endDate || '(not set)') + '</span>' +
          '<span class="inv-review-label">Request via</span><span class="inv-review-value">Entity &amp; Email</span>' +
        '</div>' +
      '</div>';

    // Selected entities count
    var entCount = 0;
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (entitySelections[n.id]) entCount += (n.total > 0 ? n.total : 1);
        if (n.children) walk(n.children);
      });
    }
    walk(ENTITY_TREE);

    reviewHTML +=
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Targets</div>' +
        '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">' +
          entCount + ' entities selected' +
          (collaborators.length > 0
            ? ' &middot; ' + collaborators.length + ' collaborators'
            : '') +
        '</div>' +
      '</div>';

    // Activities summary
    var actChips = '';
    CAMPAIGN_ACTIVITIES.forEach(function (a) {
      actChips += '<span class="inv-review-chip"><span class="dcc-activity-dot" style="background:' + a.color + ';width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:6px"></span>' + esc(a.name) + ' (' + a.selectedEntities + '/' + a.totalEntities + ')</span>';
    });
    reviewHTML +=
      '<div class="inv-review-section">' +
        '<div class="inv-review-title">Activities (' + CAMPAIGN_ACTIVITIES.length + ')</div>' +
        '<div class="inv-review-list">' + actChips + '</div>' +
      '</div>';

    if (templatesChecked) {
      reviewHTML +=
        '<div class="inv-review-section">' +
          '<div class="inv-review-title">Templates</div>' +
          '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73">' + TEMPLATES.length + ' templates attached</div>' +
        '</div>';
    }

    body.innerHTML = stepperHTML + reviewHTML;

    footer.className = 'wizard-footer';
    footer.innerHTML =
      '<button class="wizard-btn-discard" id="dcc-discard"><i class="fa-regular fa-trash-can"></i> Discard setup</button>' +
      '<div class="wizard-footer-spacer"></div>' +
      '<button class="wizard-btn-outline" id="dcc-back">Back</button>' +
      '<button class="wizard-btn-green" id="dcc-next" style="min-width:180px">Launch campaign</button>';

    var backBtn = footer.querySelector('#dcc-back');
    backBtn.addEventListener('click', function () { currentStep = 2; render(); });
    var discardBtn = footer.querySelector('#dcc-discard');
    discardBtn.addEventListener('click', closeWizard);
    var nextBtn = footer.querySelector('#dcc-next');
    nextBtn.addEventListener('click', closeWizard);
  }

  // ===========================================
  // ENTITY TREE (reuses inv- tree classes)
  // ===========================================

  function buildEntityTree(nodes, depth) {
    var html = '';
    nodes.forEach(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = entityExpanded[node.id];
      var isChecked = entitySelections[node.id];
      var selectedCount = countSelected(node);
      var totalCount = node.total || countTotal(node);

      html += '<div class="inv-tree-node" style="padding-left:' + (depth * 24) + 'px">';

      if (hasChildren) {
        html += '<button class="inv-tree-toggle" data-dcc-toggle="' + node.id + '">' +
          '<i class="fa-solid fa-chevron-' + (isExpanded ? 'down' : 'right') + '"></i>' +
          '</button>';
      } else {
        html += '<span class="inv-tree-toggle inv-tree-toggle--leaf"></span>';
      }

      html += '<input type="checkbox" class="inv-tree-cb" data-dcc-cb="' + node.id + '"' + (isChecked ? ' checked' : '') + '>';

      html += '<span class="inv-tree-name">' + esc(node.name);
      if (hasChildren || totalCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selectedCount + '/' + totalCount + ')</span>';
      }
      html += '</span>';

      html += '<span class="inv-tree-act">' + node.activities + '</span>';
      html += '<span class="inv-tree-rec">' + numberFmt(node.records) + '</span>';
      html += '</div>';

      if (hasChildren) {
        html += '<div class="inv-tree-children' + (isExpanded ? ' inv-tree-children--open' : '') + '" data-dcc-children="' + node.id + '">';
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

  function bindTreeInteractions() {
    body.querySelectorAll('[data-dcc-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.dataset.dccToggle;
        entityExpanded[id] = !entityExpanded[id];
        var childrenEl = body.querySelector('[data-dcc-children="' + id + '"]');
        var icon = this.querySelector('i');
        if (childrenEl) childrenEl.classList.toggle('inv-tree-children--open');
        if (icon) icon.className = entityExpanded[id] ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right';
      });
    });

    body.querySelectorAll('[data-dcc-cb]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        entitySelections[this.dataset.dccCb] = this.checked;
      });
    });
  }

  // ===========================================
  // FOOTER NAVIGATION HELPER
  // ===========================================

  function bindFooterNav(backStep, nextStep) {
    var backBtn = footer.querySelector('#dcc-back');
    var nextBtn = footer.querySelector('#dcc-next');
    var discardBtn = footer.querySelector('#dcc-discard');

    if (discardBtn) {
      discardBtn.addEventListener('click', closeWizard);
    }
    if (backBtn && backStep >= 0) {
      backBtn.addEventListener('click', function () { currentStep = backStep; render(); });
    }
    if (nextBtn && nextStep >= 0 && nextStep <= 3) {
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
