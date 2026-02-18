// ========================================
// DATA MANAGEMENT — page content (rendered via page transition from project bar)
// ========================================

(function () {

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ========== UNNORMALIZED DATA FOR NORMALIZE VIEW ==========
  var UNNORMALIZED_COLUMNS = [
    { name: 'Elec_Consumption', recommendations: [
      { text: 'Electricity consumption', score: 97, category: 'Scope 2 – Purchased electricity' },
      { text: 'Grid electricity usage', score: 82, category: 'Scope 2 – Indirect energy' },
      { text: 'Purchased electricity (kWh)', score: 78, category: 'Scope 2 – Market-based' }
    ]},
    { name: 'NatGas_Use', recommendations: [
      { text: 'Natural gas consumption', score: 95, category: 'Scope 1 – Stationary combustion' },
      { text: 'Natural gas (therms)', score: 84, category: 'Scope 1 – Direct fuel use' },
      { text: 'Stationary combustion – NG', score: 71, category: 'Scope 1 – Fuel combustion' }
    ]},
    { name: 'H2O_Usage', recommendations: [
      { text: 'Water withdrawal', score: 93, category: 'Water – Municipal supply' },
      { text: 'Water consumption (m³)', score: 85, category: 'Water – Total intake' },
      { text: 'Freshwater use', score: 68, category: 'Water – Operational use' }
    ]},
    { name: 'Dsl_Fuel', recommendations: [
      { text: 'Diesel fuel consumption', score: 96, category: 'Scope 1 – Mobile combustion' },
      { text: 'Distillate fuel oil No. 2', score: 74, category: 'Scope 1 – Petroleum fuels' },
      { text: 'Mobile combustion – diesel', score: 70, category: 'Scope 1 – Transport fuels' }
    ]},
    { name: 'Emp_Commute_Mi', recommendations: [
      { text: 'Employee commuting (distance)', score: 94, category: 'Scope 3.7 – Employee commuting' },
      { text: 'Employee commuting – vehicle miles', score: 86, category: 'Scope 3 – Downstream transport' },
      { text: 'Commuting – private vehicle', score: 62, category: 'Scope 3 – Indirect transport' }
    ]},
    { name: 'Wst_Landfill_T', recommendations: [
      { text: 'Waste to landfill (tonnes)', score: 95, category: 'Scope 3.5 – Waste in operations' },
      { text: 'Solid waste disposal', score: 81, category: 'Scope 3 – Waste treatment' },
      { text: 'Waste generated in operations', score: 73, category: 'Scope 3 – Operational waste' }
    ]}
  ];

  var UNNORMALIZED_DATA = [
    { name: 'Natural-gas', entity: 'New York office', recommendations: [
      { text: 'Natural gas', score: 98, category: 'Scope 1 – Stationary combustion' },
      { text: 'Natural gas combustion (therms)', score: 88, category: 'Scope 1 – Direct fuel use' },
      { text: 'Stationary combustion – natural gas', score: 76, category: 'Scope 1 – Fuel combustion' }
    ]},
    { name: 'Diesel gas', entity: 'Boston regional HQ', recommendations: [
      { text: 'Diesel fuel', score: 92, category: 'Scope 1 – Mobile combustion' },
      { text: 'Diesel combustion (gallons)', score: 80, category: 'Scope 1 – Petroleum products' },
      { text: 'Mobile combustion – diesel', score: 69, category: 'Scope 1 – Transport fuels' }
    ]},
    { name: 'Employee commutes', entity: 'Boston regional HQ', recommendations: [
      { text: 'Employee commuting', score: 96, category: 'Scope 3.7 – Employee commuting' },
      { text: 'Commuting – private vehicle', score: 79, category: 'Scope 3 – Downstream transport' },
      { text: 'Employee travel – commuting', score: 64, category: 'Scope 3 – Indirect transport' }
    ]},
    { name: 'Electricty', entity: 'Chicago office', recommendations: [
      { text: 'Electricity consumption', score: 94, category: 'Scope 2 – Purchased electricity' },
      { text: 'Purchased electricity (kWh)', score: 85, category: 'Scope 2 – Market-based' },
      { text: 'Grid electricity', score: 77, category: 'Scope 2 – Location-based' }
    ]},
    { name: 'Natrl gas', entity: 'San Francisco branch', recommendations: [
      { text: 'Natural gas', score: 89, category: 'Scope 1 – Stationary combustion' },
      { text: 'Natural gas combustion', score: 75, category: 'Scope 1 – Direct fuel use' },
      { text: 'Stationary combustion – NG', score: 61, category: 'Scope 1 – Fuel combustion' }
    ]},
    { name: 'Biz travel', entity: 'Los Angeles HQ', recommendations: [
      { text: 'Business travel – air', score: 82, category: 'Scope 3.6 – Business travel' },
      { text: 'Business travel (all modes)', score: 78, category: 'Scope 3 – Business travel' },
      { text: 'Business travel – ground transport', score: 63, category: 'Scope 3 – Upstream transport' }
    ]},
    { name: 'H2O use', entity: 'Seattle office', recommendations: [
      { text: 'Water consumption', score: 91, category: 'Water – Municipal supply' },
      { text: 'Water withdrawal (m³)', score: 83, category: 'Water – Total intake' },
      { text: 'Municipal water supply', score: 66, category: 'Water – Utility-supplied' }
    ]},
    { name: 'Refrig', entity: 'Miami branch', recommendations: [
      { text: 'Refrigerant leakage', score: 87, category: 'Scope 1 – Fugitive emissions' },
      { text: 'Refrigerants (kg CO₂e)', score: 76, category: 'Scope 1 – HFC/PFC emissions' },
      { text: 'Fugitive emissions – refrigerants', score: 68, category: 'Scope 1 – Process emissions' }
    ]},
    { name: 'Paper', entity: 'Denver office', recommendations: [
      { text: 'Paper consumption', score: 93, category: 'Scope 3.1 – Purchased goods' },
      { text: 'Office paper (tonnes)', score: 81, category: 'Scope 3 – Purchased materials' },
      { text: 'Purchased goods – paper products', score: 65, category: 'Scope 3 – Upstream materials' }
    ]},
    { name: 'Waste disposal', entity: 'Phoenix office', recommendations: [
      { text: 'Waste to landfill', score: 95, category: 'Scope 3.5 – Waste in operations' },
      { text: 'Solid waste disposal (tonnes)', score: 84, category: 'Scope 3 – Waste treatment' },
      { text: 'Waste generated in operations', score: 72, category: 'Scope 3 – Operational waste' }
    ]},
    { name: 'Fleet fuel', entity: 'Dallas office', recommendations: [
      { text: 'Fleet vehicle fuel', score: 94, category: 'Scope 1 – Mobile combustion' },
      { text: 'Mobile combustion – company fleet', score: 82, category: 'Scope 1 – Owned transport' },
      { text: 'Company vehicles – fuel use', score: 67, category: 'Scope 1 – Direct transport' }
    ]},
    { name: 'AC coolant', entity: 'Houston branch', recommendations: [
      { text: 'HVAC refrigerant leakage', score: 90, category: 'Scope 1 – Fugitive emissions' },
      { text: 'Refrigerant emissions – cooling', score: 77, category: 'Scope 1 – HFC emissions' },
      { text: 'Fugitive emissions – HVAC systems', score: 60, category: 'Scope 1 – Process losses' }
    ]}
  ];

  // ========== NORMALIZE — swaps into the right-side content area ==========

  function scoreClass(score) {
    if (score >= 90) return 'nm-score--high';
    if (score >= 75) return 'nm-score--med';
    return 'nm-score--low';
  }

  function buildRecDOM(item) {
    var frag = document.createDocumentFragment();

    var source = document.createElement('div');
    source.className = 'nm-rec-source';
    source.innerHTML = '<span class="nm-rec-label">Source value:</span><span class="nm-rec-value">' + esc(item.name) + '</span>';
    frag.appendChild(source);

    if (item.entity) {
      var entity = document.createElement('div');
      entity.className = 'nm-rec-entity';
      entity.innerHTML = '<span class="nm-rec-label">Entity:</span><span class="nm-rec-entity-value">' + esc(item.entity) + '</span>';
      frag.appendChild(entity);
    }

    var title = document.createElement('div');
    title.className = 'nm-rec-title';
    title.textContent = 'Recommended normalizations';
    frag.appendChild(title);

    var list = document.createElement('div');
    list.className = 'nm-rec-list';

    item.recommendations.forEach(function (rec, i) {
      var isBest = (i === 0);
      var label = document.createElement('label');
      label.className = 'nm-rec-option' + (isBest ? ' nm-rec-option--best' : '');

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'nm-rec';
      radio.value = String(i);
      if (isBest) radio.checked = true;
      label.appendChild(radio);

      var dot = document.createElement('span');
      dot.className = 'nm-rec-radio';
      label.appendChild(dot);

      var textBlock = document.createElement('div');
      textBlock.className = 'nm-rec-text-block';

      var txt = document.createElement('span');
      txt.className = 'nm-rec-text';
      txt.textContent = rec.text;
      textBlock.appendChild(txt);

      if (rec.category) {
        var cat = document.createElement('span');
        cat.className = 'nm-rec-category';
        cat.textContent = rec.category;
        textBlock.appendChild(cat);
      }
      label.appendChild(textBlock);

      var chip = document.createElement('span');
      chip.className = 'nm-rec-score ' + scoreClass(rec.score);
      chip.textContent = rec.score + '%';
      label.appendChild(chip);

      if (isBest) {
        var badge = document.createElement('span');
        badge.className = 'nm-rec-badge';
        badge.textContent = 'Best match';
        label.appendChild(badge);
      }

      var optActions = document.createElement('div');
      optActions.className = 'nm-rec-opt-actions';

      if (isBest) {
        var acceptBtn = document.createElement('button');
        acceptBtn.className = 'nm-accept-btn';
        acceptBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i> Accept and go to next option';
        optActions.appendChild(acceptBtn);
      } else {
        var selectBtn = document.createElement('button');
        selectBtn.className = 'nm-select-btn';
        selectBtn.textContent = 'Select this option';
        optActions.appendChild(selectBtn);
      }

      var ruleLink = document.createElement('button');
      ruleLink.className = 'nm-rule-link';
      ruleLink.textContent = 'Create rule';
      optActions.appendChild(ruleLink);

      label.appendChild(optActions);
      list.appendChild(label);
    });

    var customLabel = document.createElement('label');
    customLabel.className = 'nm-rec-option nm-rec-custom';
    customLabel.innerHTML = '<input type="radio" name="nm-rec" value="custom"><span class="nm-rec-radio"></span><div class="nm-rec-text-block"><span class="nm-rec-text">Custom name...</span></div>';
    list.appendChild(customLabel);

    frag.appendChild(list);
    return frag;
  }

  function showNormalizeView(type, contextEl) {
    var items = type === 'columns' ? UNNORMALIZED_COLUMNS : UNNORMALIZED_DATA;
    var viewTitle = type === 'columns' ? 'Unnormalized columns' : 'Unnormalized activity data';

    var rightPanel = contextEl ? contextEl.closest('.dm-layout').querySelector('.dm-right') : null;
    if (!rightPanel) rightPanel = document.querySelector('.pt-page-section .dm-right') || document.querySelector('.dm-right');
    if (!rightPanel) return;

    rightPanel.innerHTML = '';

    var headerRow = document.createElement('div');
    headerRow.className = 'nm-header-row';

    var backBtn = document.createElement('button');
    backBtn.className = 'nm-back-btn';
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Back to all data';
    backBtn.addEventListener('click', function () {
      restoreDataListView(rightPanel);
    });
    headerRow.appendChild(backBtn);

    var heading = document.createElement('h3');
    heading.className = 'dm-view-title';
    heading.textContent = viewTitle;
    headerRow.appendChild(heading);

    rightPanel.appendChild(headerRow);

    var split = document.createElement('div');
    split.className = 'nm-split';

    var listEl = document.createElement('div');
    listEl.className = 'nm-list';

    var detailEl = document.createElement('div');
    detailEl.className = 'nm-detail';

    detailEl.appendChild(buildRecDOM(items[0]));

    var listItemNodes = [];

    function selectItem(idx) {
      listItemNodes.forEach(function (node) {
        node.classList.remove('nm-list-item--active');
      });
      listItemNodes[idx].classList.add('nm-list-item--active');
      while (detailEl.firstChild) detailEl.removeChild(detailEl.firstChild);
      detailEl.appendChild(buildRecDOM(items[idx]));
    }

    items.forEach(function (item, idx) {
      var row = document.createElement('div');
      row.className = 'nm-list-item' + (idx === 0 ? ' nm-list-item--active' : '');

      var nameDiv = document.createElement('div');
      nameDiv.className = 'nm-list-item-name';
      nameDiv.textContent = item.name;
      row.appendChild(nameDiv);

      if (item.entity) {
        var entityDiv = document.createElement('div');
        entityDiv.className = 'nm-list-item-entity';
        entityDiv.textContent = item.entity;
        row.appendChild(entityDiv);
      }

      row.addEventListener('click', function () {
        selectItem(idx);
      });

      listEl.appendChild(row);
      listItemNodes.push(row);
    });

    split.appendChild(listEl);
    split.appendChild(detailEl);
    rightPanel.appendChild(split);
  }

  function restoreDataListView(rightPanel) {
    if (!rightPanel) rightPanel = document.querySelector('.pt-page-section .dm-right') || document.querySelector('.dm-right');
    if (!rightPanel) return;

    var html = '';
    html += '<h3 class="dm-view-title">All data list</h3>';
    html += '<div class="dm-table-wrap">';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<select class="dm-select"><option>Display: list</option></select>';
    html += '<select class="dm-select"><option>All scope</option></select>';
    html += '<select class="dm-select"><option>All entities</option></select>';
    html += '<select class="dm-select"><option>Normalized and unnormalized</option></select>';
    html += '</div>';
    html += '<div class="dm-table-scroll">';
    html += '<table class="dm-table">';
    html += '<thead><tr>';
    html += '<th>Normalized name</th><th>Original name</th><th>Entity</th><th>Scope</th><th>Source file</th><th>Author</th><th>Updated</th><th></th>';
    html += '</tr></thead><tbody>';
    TABLE_ROWS.forEach(function (r) {
      var scopeClass = r.scope === 1 ? 'dm-scope-1' : r.scope === 2 ? 'dm-scope-2' : 'dm-scope-3';
      html += '<tr>';
      html += '<td>' + esc(r.normalizedName) + '</td>';
      html += '<td>' + esc(r.originalName) + '</td>';
      html += '<td>' + esc(r.entity) + '</td>';
      html += '<td><span class="dm-scope-pill ' + scopeClass + '">' + esc(r.scopeLabel) + '</span></td>';
      html += '<td>' + esc(r.sourceFile) + '</td>';
      html += '<td>' + esc(r.author) + '</td>';
      html += '<td>' + esc(r.updated) + '</td>';
      html += '<td><button class="dm-more"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '</div>';
    html += '</div>';

    rightPanel.innerHTML = html;
  }

  // Normalize link delegation
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-action="open-normalize"]');
    if (!link) return;
    e.preventDefault();
    var row = link.closest('.dm-filter-row');
    if (!row) return;
    var titleEl = row.querySelector('.dm-filter-title');
    if (titleEl && titleEl.textContent.indexOf('Columns') !== -1) {
      showNormalizeView('columns', link);
    } else {
      showNormalizeView('data', link);
    }
  });

  // ========== TABLE DATA ==========
  var TABLE_ROWS = [
    { normalizedName: 'Natural-gas', originalName: 'Natural-gas', entity: 'New York office', scope: 1, scopeLabel: 'Scope 1', sourceFile: 'Scope 1 HP - EF Matched.xl...', author: 'J. Reinhardt', updated: '1/4/2026' },
    { normalizedName: 'Disl', originalName: 'Diesel gas', entity: 'Boston regional HQ', scope: 1, scopeLabel: 'Scope 1', sourceFile: 'Scope 1 HP - EF Matched.xl...', author: 'R. Arsalan', updated: '1/16/2026' },
    { normalizedName: 'Commute trips', originalName: 'Employee commutes', entity: 'Boston regional HQ', scope: 3, scopeLabel: 'Scope 3.17', sourceFile: 'Scope 1 HP - EF Matched.xl...', author: 'R. Arsalan', updated: '1/16/2026' },
    { normalizedName: 'Electric power', originalName: 'Electricity', entity: 'Chicago office', scope: 2, scopeLabel: 'Scope 2', sourceFile: 'Scope 2 HP - EF Matched.xl...', author: 'L. Patel', updated: '2/10/2026' },
    { normalizedName: 'Gas consumption', originalName: 'Natural gas', entity: 'San Francisco branch', scope: 1, scopeLabel: 'Scope 1', sourceFile: 'Scope 1 HP - EF Matched.xl...', author: 'M. Johnson', updated: '2/15/2026' },
    { normalizedName: 'Travel expenses', originalName: 'Business travel', entity: 'Los Angeles headqu...', scope: 3, scopeLabel: 'Scope 3', sourceFile: 'Scope 3 HP - EF Matched.xl...', author: 'A. Thompson', updated: '3/1/2026' },
    { normalizedName: 'Water consumption', originalName: 'Water usage', entity: 'Seattle office', scope: 2, scopeLabel: 'Scope 2', sourceFile: 'Scope 2 HP - EF Matched.xl...', author: 'B. Lee', updated: '3/20/2026' },
    { normalizedName: 'Cooling systems', originalName: 'Refrigeration', entity: 'Miami branch', scope: 1, scopeLabel: 'Scope 1', sourceFile: 'Scope 1 HP - EF Matched.xl...', author: 'C. Smith', updated: '4/5/2026' },
    { normalizedName: 'Printing materials', originalName: 'Paper usage', entity: 'Denver office', scope: 3, scopeLabel: 'Scope 3', sourceFile: 'Scope 3 HP - EF Matched.xl...', author: 'D. Kim', updated: '4/12/2026' },
    { normalizedName: 'Waste management', originalName: 'Waste disposal', entity: 'Phoenix office', scope: 3, scopeLabel: 'Scope 3', sourceFile: 'Scope 3 HP - EF Matched.xl...', author: 'E. Harris', updated: '5/1/2026' }
  ];

  /** Returns the body HTML string (dm-layout) for the Data management page. */
  function getBodyHTML() {
    var html = '<div class="dm-layout">';

    html += '<div class="dm-top-row">';
    html += '<div class="goals-card">';
    html += '<h2 class="goals-title">Active campaigns</h2>';
    html += '<div class="goals-card-content">';
    html += '<div class="goals-metric">';
    html += '<span class="goals-metric-value">3 Active 5% past due</span>';
    html += '</div>';
    html += '<p class="goals-subtitle">19,832 records requested, 992 past due</p>';
    html += '<div class="goals-progress">';
    html += '<div class="goals-progress-track"></div>';
    html += '<div class="goals-progress-segment goals-progress-pending" style="width:5%"></div>';
    html += '</div>';
    html += '<div class="goals-actions">';
    html += '<button class="btn btn-outline btn-small">Review campaigns</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="goals-card">';
    html += '<h2 class="goals-title">All activity records</h2>';
    html += '<div class="goals-card-content">';
    html += '<div class="goals-metric">';
    html += '<span class="goals-metric-value">86%</span>';
    html += '<span class="goals-metric-label">Activities normalized</span>';
    html += '</div>';
    html += '<p class="goals-subtitle">12 files uploaded, 8,923 records, 45/90 normalized</p>';
    html += '<div class="goals-progress">';
    html += '<div class="goals-progress-track"></div>';
    html += '<div class="goals-progress-segment goals-progress-pending" style="width:86%"></div>';
    html += '</div>';
    html += '<div class="goals-actions">';
    html += '<button class="btn btn-primary btn-small" data-action="open-activity-data-setup">+ Add files/data</button>';
    html += '<button class="btn btn-outline btn-small">Rules library</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-bottom">';
    html += '<div class="dm-left">';
    html += '<div class="dm-filter-card">';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title">Category overview</div>';
    html += '<div class="dm-filter-meta">8,923 records</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title">All data list</div>';
    html += '<div class="dm-filter-meta">8,923 records, 184 missing</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '<span class="dm-filter-title">Unnormalized Columns</span>';
    html += '</div>';
    html += '<div class="dm-filter-meta">6 instances</div>';
    html += '</div>';
    html += '<div class="dm-filter-action">';
    html += '<a href="#" class="dm-filter-link" data-action="open-normalize">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-row">';
    html += '<div class="dm-filter-content">';
    html += '<div class="dm-filter-title-row">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-filter-warn-icon"></i>';
    html += '<span class="dm-filter-title">Unnormalized data</span>';
    html += '</div>';
    html += '<div class="dm-filter-meta">1,249 records</div>';
    html += '</div>';
    html += '<div class="dm-filter-action">';
    html += '<a href="#" class="dm-filter-link" data-action="open-normalize">Normalize <i class="fa-solid fa-chevron-right"></i></a>';
    html += '</div>';
    html += '</div>';

    html += '<div class="dm-filter-footer">';
    html += '<button class="dm-filter-btn"><i class="fa-solid fa-book"></i> Rules library</button>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    html += '<div class="dm-right">';
    html += '<h3 class="dm-view-title">All data list</h3>';
    html += '<div class="dm-table-wrap">';
    html += '<div class="dm-toolbar">';
    html += '<input type="text" class="dm-search" placeholder="Search">';
    html += '<select class="dm-select"><option>Display: list</option></select>';
    html += '<select class="dm-select"><option>All scope</option></select>';
    html += '<select class="dm-select"><option>All entities</option></select>';
    html += '<select class="dm-select"><option>Normalized and unnormalized</option></select>';
    html += '</div>';
    html += '<div class="dm-table-scroll">';
    html += '<table class="dm-table">';
    html += '<thead><tr>';
    html += '<th>Normalized name</th><th>Original name</th><th>Entity</th><th>Scope</th><th>Source file</th><th>Author</th><th>Updated</th><th></th>';
    html += '</tr></thead><tbody>';
    TABLE_ROWS.forEach(function (r) {
      var scopeClass = r.scope === 1 ? 'dm-scope-1' : r.scope === 2 ? 'dm-scope-2' : 'dm-scope-3';
      html += '<tr>';
      html += '<td>' + esc(r.normalizedName) + '</td>';
      html += '<td>' + esc(r.originalName) + '</td>';
      html += '<td>' + esc(r.entity) + '</td>';
      html += '<td><span class="dm-scope-pill ' + scopeClass + '">' + esc(r.scopeLabel) + '</span></td>';
      html += '<td>' + esc(r.sourceFile) + '</td>';
      html += '<td>' + esc(r.author) + '</td>';
      html += '<td>' + esc(r.updated) + '</td>';
      html += '<td><button class="dm-more"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Build a DOM tree for the Data management page (for use in page transition).
   */
  window.getActivityMapPageContent = function () {
    var wrap = document.createElement('div');
    wrap.className = 'dm-page';
    wrap.innerHTML = getBodyHTML();
    return wrap;
  };

})();
