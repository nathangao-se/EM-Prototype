// ========================================
// NORMALIZE ACTIVITIES — Modal (from Data management left column or dev menu)
// ========================================

(function () {
  var overlay = document.getElementById('normalize-overlay');
  if (!overlay) return;

  var modal = overlay.querySelector('.normalize-modal');
  var closeBtn = overlay.querySelector('.normalize-close-btn');
  var cardsRow = overlay.querySelector('.normalize-cards-row');
  var catCol = overlay.querySelector('.normalize-categories');
  var leftCol = overlay.querySelector('.normalize-left');
  var rightCol = overlay.querySelector('.normalize-right');

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Category cards — act as parent selectors for the activity list
  var CATEGORIES = [
    { id: 'all',          title: 'All source data',     meta: '230 unmapped activities' },
    { id: 'high-match',   title: '90-100% match',       meta: '39 unmapped activities' },
    { id: 'capital',      title: 'Capital goods',        meta: '6 unmapped activities' },
    { id: 'mobile',       title: 'Mobile combustion',    meta: '3 unmapped activities' },
    { id: 'refrigerants', title: 'Refrigerants',         meta: '2 unmapped activities' },
    { id: 'others',       title: 'Others',               meta: '120 unmapped activities' }
  ];
  var activeCategory = 'all';
  var autoMap = false;

  // Unnormalized activities list — mutable state: selected, done
  var ACTIVITIES_INITIAL = [
    { name: 'Office supplies', meta: '3,420 records across 28 entities', selected: false, done: false, category: 'capital', matchPct: 100 },
    { name: 'Diesel gas', meta: '156 instances', selected: false, done: false, category: 'mobile', matchPct: 96 },
    { name: 'Employee commutes', meta: '892 records', selected: false, done: false, category: 'mobile', matchPct: 98 },
    { name: 'Electricity', meta: '2,301 records', selected: false, done: false, category: 'capital', matchPct: 100 },
    { name: 'Asphalt: Other - Energy recovery', meta: '14 instances', selected: false, done: false, category: 'capital', matchPct: 95 },
    { name: 'Cryogenic Natural Gas', meta: '3 instances', selected: false, done: false, category: 'refrigerants', matchPct: 98 },
    { name: 'Biomass: Agricultural Residues', meta: '7 instances', selected: false, done: false, category: 'others', matchPct: 92 },
    { name: 'Geothermal Energy', meta: '12 instances', selected: false, done: false, category: 'others', matchPct: 88 },
    { name: 'Hydrogen Fuel Cells', meta: '5 instances', selected: false, done: false, category: 'others', matchPct: 82 }
  ];
  var activitiesList = [];

  function getFilteredActivities() {
    if (activeCategory === 'all') return activitiesList;
    if (activeCategory === 'high-match') {
      return activitiesList.filter(function (a) { return a.matchPct >= 90; });
    }
    return activitiesList.filter(function (a) { return a.category === activeCategory; });
  }

  // Activity data match panels (right column) for selected item
  // Different recommendations per activity
  var ACTIVITY_RECOMMENDATIONS = {
    'Office supplies': [
      { score: 100, label: 'Goods_office_mixed (Best match)', isBest: true },
      { score: 85, label: 'Supplies' },
      { score: 75, label: 'Equipment' }
    ],
    'Diesel gas': [
      { score: 96, label: 'Fuel_diesel_automotive (Best match)', isBest: true },
      { score: 89, label: 'Diesel_standard' },
      { score: 82, label: 'Mobile_combustion_fuel' }
    ],
    'Employee commutes': [
      { score: 98, label: 'Transport_employee_commute (Best match)', isBest: true },
      { score: 91, label: 'Business_travel_ground' },
      { score: 79, label: 'Personal_vehicle_use' }
    ],
    'Electricity': [
      { score: 100, label: 'Energy_electricity_grid (Best match)', isBest: true },
      { score: 88, label: 'Purchased_electricity' },
      { score: 76, label: 'Grid_power' }
    ],
    'Asphalt: Other - Energy recovery': [
      { score: 95, label: 'Energy_recovery_asphalt (Best match)', isBest: true },
      { score: 80, label: 'Waste_processing' },
      { score: 70, label: 'Industrial_materials' }
    ],
    'Cryogenic Natural Gas': [
      { score: 98, label: 'Natural_gas_cryogenic (Best match)', isBest: true },
      { score: 88, label: 'Natural_gas_standard' },
      { score: 75, label: 'Liquified_gas' }
    ],
    'Biomass: Agricultural Residues': [
      { score: 92, label: 'Biomass_agricultural (Best match)', isBest: true },
      { score: 85, label: 'Organic_waste' },
      { score: 78, label: 'Renewable_energy' }
    ],
    'Geothermal Energy': [
      { score: 88, label: 'Energy_geothermal (Best match)', isBest: true },
      { score: 76, label: 'Renewable_heat' },
      { score: 68, label: 'District_heating' }
    ],
    'Hydrogen Fuel Cells': [
      { score: 82, label: 'Fuel_hydrogen (Best match)', isBest: true },
      { score: 74, label: 'Alternative_fuel' },
      { score: 65, label: 'Clean_energy' }
    ]
  };

  function openModal() {
    console.log('[NM] openModal called');
    activeCategory = 'all';
    autoMap = false;
    activitiesList = ACTIVITIES_INITIAL.map(function (a) {
      return { name: a.name, meta: a.meta, selected: false, done: false, category: a.category, matchPct: a.matchPct };
    });
    render();
    overlay.classList.add('normalize-overlay--open');
    document.body.style.overflow = 'hidden';
    console.log('[NM] Modal opened with', activitiesList.length, 'activities');
  }

  function closeModal() {
    overlay.classList.remove('normalize-overlay--open');
    document.body.style.overflow = '';
  }

  window.openNormalizeModal = openModal;
  window.closeNormalizeModal = closeModal;

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('normalize-overlay--open')) closeModal();
  });

  modal.querySelector('.normalize-footer .normalize-discard').addEventListener('click', function (e) {
    e.preventDefault();
    closeModal();
  });

  // Delegate: open modal when Normalize is clicked (Data management left column)
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-action="open-normalize"]');
    if (!trigger) return;
    e.preventDefault();
    openModal();
  });

  function getSelectedActivity() {
    for (var i = 0; i < activitiesList.length; i++) {
      if (activitiesList[i].selected) return activitiesList[i];
    }
    return null;
  }

  function getNextPendingIndex(currentIndex) {
    for (var i = currentIndex + 1; i < activitiesList.length; i++) {
      if (!activitiesList[i].done) return i;
    }
    return -1;
  }

  function selectNextPending() {
    var currentIdx = -1;
    activitiesList.forEach(function (a, i) {
      if (a.selected) currentIdx = i;
    });
    var nextIdx = getNextPendingIndex(currentIdx);
    activitiesList.forEach(function (a, i) {
      a.selected = i === nextIdx;
    });
    return nextIdx >= 0 ? activitiesList[nextIdx] : null;
  }

  function renderCategories() {
    var html = '';
    CATEGORIES.forEach(function (c) {
      var cls = 'normalize-category-card' + (c.id === activeCategory ? ' normalize-category-card--active' : '');
      html += '<button class="' + cls + '" data-category="' + c.id + '">';
      html += '<span class="normalize-category-title">' + esc(c.title) + '</span>';
      html += '<span class="normalize-category-meta">' + esc(c.meta) + '</span>';
      html += '</button>';
    });
    catCol.innerHTML = html;
    catCol.querySelectorAll('[data-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.getAttribute('data-category');
        activitiesList.forEach(function (a) { a.selected = false; });
        renderCategories();
        renderLeftList();
        renderRightPanels();
      });
    });
  }

  function getCategoryTitle() {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === activeCategory) return CATEGORIES[i].title;
    }
    return 'All source data';
  }

  function renderLeftList() {
    var filtered = getFilteredActivities();

    // Header with category title + auto-map toggle
    var html =
      '<div class="normalize-left-header">' +
        '<span class="normalize-left-heading">' + esc(getCategoryTitle()) + ':</span>' +
        '<label class="normalize-automap-toggle">' +
          '<span class="normalize-automap-label">Auto-map</span>' +
          '<input type="checkbox" class="normalize-automap-input" ' + (autoMap ? 'checked' : '') + '>' +
          '<span class="normalize-automap-track"><span class="normalize-automap-thumb"></span></span>' +
        '</label>' +
      '</div>';

    // Auto-map banner
    if (autoMap) {
      html +=
        '<div class="normalize-automap-banner">' +
          '<i class="fa-light fa-circle-info normalize-automap-banner-icon"></i>' +
          '<span>All unnormalized activities in this category will be normalized with the top match when you exit this window</span>' +
        '</div>';
    }

    // Activity list
    html += '<div class="normalize-list">';
    filtered.forEach(function (item) {
      if (item.done) {
        html +=
          '<div class="normalize-list-item normalize-list-item--done" data-name="' + esc(item.name) + '">' +
            '<div class="normalize-list-item-name">' + esc(item.name) + ' <i class="fa-solid fa-check normalize-done-icon"></i></div>' +
            '<div class="normalize-list-item-meta">' + esc(item.meta) + '</div>' +
          '</div>';
      } else {
        var cls = 'normalize-list-item' + (item.selected ? ' normalize-list-item--selected' : '');
        html +=
          '<div class="' + cls + '" data-name="' + esc(item.name) + '" data-action="select-activity">' +
            '<div class="normalize-list-item-name">' + esc(item.name) + '</div>' +
            '<div class="normalize-list-item-meta">' + esc(item.meta) + '</div>' +
          '</div>';
      }
    });
    html += '</div>';
    leftCol.innerHTML = html;
    leftCol.classList.toggle('normalize-left--automap', autoMap);
    bindLeftListEvents();

    // Auto-map toggle event
    var toggleInput = leftCol.querySelector('.normalize-automap-input');
    if (toggleInput) {
      toggleInput.addEventListener('change', function () {
        autoMap = toggleInput.checked;
        if (autoMap) {
          activitiesList.forEach(function (a) { a.selected = false; });
        }
        renderLeftList();
        renderRightPanels();
      });
    }
  }

  function bindLeftListEvents() {
    console.log('[NM] bindLeftListEvents called, found', leftCol.querySelectorAll('[data-action="select-activity"]').length, 'clickable items');
    leftCol.querySelectorAll('[data-action="select-activity"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var name = el.getAttribute('data-name');
        console.log('[NM] Activity clicked:', name);
        activitiesList.forEach(function (a) {
          a.selected = a.name === name && !a.done;
        });
        console.log('[NM] Calling renderLeftList()');
        renderLeftList();
        console.log('[NM] Calling renderRightPanels()');
        renderRightPanels(); // Re-render right panel when selection changes
      });
    });
  }

  function scrollListToSelected() {
    var listEl = leftCol.querySelector('.normalize-list');
    var selectedEl = leftCol.querySelector('.normalize-list-item--selected');
    if (listEl && selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function renderRightPanels() {
    var selected = getSelectedActivity();

    // Auto-map ON: right panel is empty
    if (autoMap) {
      rightCol.innerHTML = '<div class="normalize-right-empty"></div>';
      rightCol.classList.add('normalize-right--disabled');
      return;
    }
    rightCol.classList.remove('normalize-right--disabled');

    // No selection: progressive disclosure prompt
    if (!selected) {
      rightCol.innerHTML =
        '<div class="normalize-right-prompt">' +
          '<i class="fa-solid fa-arrow-left"></i>' +
          '<span>Select an activity to view best matches</span>' +
        '</div>';
      return;
    }

    var matchPanels = ACTIVITY_RECOMMENDATIONS[selected.name] || ACTIVITY_RECOMMENDATIONS['Office supplies'];
    console.log('[NM] Using recommendations for:', selected.name, '- panels:', matchPanels.length);
    
    var panelsHtml = 
      '<div class="normalize-panels-title">Best matching normalized activities for <strong>' + esc(selected.name) + '</strong></div>';
    
    matchPanels.forEach(function (p, panelIndex) {
      var scoreClass = p.score >= 90 ? 'normalize-score--high' : p.score >= 70 ? 'normalize-score--mid' : 'normalize-score--low';
      var panelClass = 'normalize-panel' + (p.isBest ? ' normalize-panel--best' : '');
      var btnClass = p.isBest ? 'btn btn-primary btn-small normalize-accept-btn' : 'btn btn-outline btn-small normalize-accept-btn';
      panelsHtml +=
        '<div class="' + panelClass + '" data-panel-index="' + panelIndex + '">' +
          '<div class="normalize-panel-header">' +
            '<span class="normalize-score ' + scoreClass + '">' + p.score + '% <i class="fa-solid fa-check"></i></span>' +
            '<span class="normalize-panel-label">' + esc(p.label) + '</span>' +
          '</div>' +
          '<div class="normalize-panel-actions">' +
            '<button type="button" class="' + btnClass + '"><i class="fa-solid fa-share"></i> Accept and go to next option</button>' +
            (p.isBest ? '' : '<a href="#" class="normalize-create-rule">Create rule</a>') +
          '</div>' +
          '<div class="normalize-underlying">Underlying logic</div>' +
          '<div class="normalize-underlying-desc">This reason over another</div>' +
        '</div>';
    });
    rightCol.innerHTML = panelsHtml;
    rightCol.querySelectorAll('.normalize-accept-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var selected = getSelectedActivity();
        if (!selected) return;
        selected.done = true;
        selectNextPending();
        renderLeftList();
        renderRightPanels(); // Re-render right panel after accepting
        setTimeout(scrollListToSelected, 50);
      });
    });
    rightCol.querySelectorAll('.normalize-create-rule').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }

  function render() {
    cardsRow.innerHTML = '';
    cardsRow.style.display = 'none';
    renderCategories();
    renderLeftList();
    renderRightPanels();
  }

  render();
})();
