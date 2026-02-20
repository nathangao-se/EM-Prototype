// ========================================
// NORMALIZE ACTIVITIES — Modal (from Data management left column or dev menu)
// ========================================

(function () {
  var overlay = document.getElementById('normalize-overlay');
  if (!overlay) return;

  var modal = overlay.querySelector('.normalize-modal');
  var closeBtn = overlay.querySelector('.normalize-close-btn');
  var cardsRow = overlay.querySelector('.normalize-cards-row');
  var leftCol = overlay.querySelector('.normalize-left');
  var rightCol = overlay.querySelector('.normalize-right');

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Top summary cards (Figma: All source data, 90-100% match, Capital goods, Mobile combustion, …)
  var SUMMARY_CARDS = [
    { title: 'All source data', meta: '49 unmapped activities' },
    { title: '90-100% match', meta: '39 unmapped activities' },
    { title: 'Capital goods', meta: '12 unmapped activities' },
    { title: 'Mobile combustion', meta: '8 unmapped activities' }
  ];

  // Unnormalized activities list (left column) — mutable state: selected, done
  var ACTIVITIES_INITIAL = [
    { name: 'Office supplies', meta: '3,420 records across 28 entities', selected: true, done: false },
    { name: 'Diesel gas', meta: '156 instances', selected: false, done: false },
    { name: 'Employee commutes', meta: '892 records', selected: false, done: false },
    { name: 'Electricity', meta: '2,301 records', selected: false, done: false },
    { name: 'Asphalt: Other - Energy recovery', meta: '14 instances', selected: false, done: false },
    { name: 'Cryogenic Natural Gas', meta: '3 instances', selected: false, done: false },
    { name: 'Biomass: Agricultural Residues', meta: '7 instances', selected: false, done: false }
  ];
  var activitiesList = [];

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
    ]
  };

  function openModal() {
    console.log('[NM] openModal called');
    activitiesList = ACTIVITIES_INITIAL.map(function (a) {
      return { name: a.name, meta: a.meta, selected: a.selected, done: a.done };
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

  function renderLeftList() {
    var listHtml =
      '<div class="normalize-list-header">' +
        '<span class="normalize-list-title">Unnormalized activities:</span>' +
        '<span class="normalize-list-meta">' + activitiesList.length + ' instances</span>' +
      '</div>' +
      '<div class="normalize-list">';
    activitiesList.forEach(function (item) {
      if (item.done) {
        listHtml +=
          '<div class="normalize-list-item normalize-list-item--done" data-name="' + esc(item.name) + '">' +
            '<div class="normalize-list-item-name">' + esc(item.name) + ' <i class="fa-solid fa-check normalize-done-icon"></i></div>' +
            '<div class="normalize-list-item-meta">' + esc(item.meta) + '</div>' +
          '</div>';
      } else {
        var cls = 'normalize-list-item' + (item.selected ? ' normalize-list-item--selected' : '');
        listHtml +=
          '<div class="' + cls + '" data-name="' + esc(item.name) + '" data-action="select-activity">' +
            '<div class="normalize-list-item-name">' + esc(item.name) + '</div>' +
            '<div class="normalize-list-item-meta">' + esc(item.meta) + '</div>' +
          '</div>';
      }
    });
    listHtml += '</div>';
    leftCol.innerHTML = listHtml;
    bindLeftListEvents();
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
    console.log('[NM] renderRightPanels called, selected activity:', selected ? selected.name : 'NONE');
    if (!selected) {
      rightCol.innerHTML = '<div class="normalize-panels-title">Select an activity to view recommendations</div>';
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
    // Top cards row (goals-card style)
    var cardsHtml = '';
    SUMMARY_CARDS.forEach(function (c) {
      cardsHtml +=
        '<div class="normalize-card goals-card">' +
          '<h3 class="goals-title">' + esc(c.title) + '</h3>' +
          '<div class="goals-card-content">' +
            '<p class="goals-subtitle">' + esc(c.meta) + '</p>' +
          '</div>' +
        '</div>';
    });
    cardsRow.innerHTML = cardsHtml;

    renderLeftList();
    renderRightPanels();
  }

  render();
})();
