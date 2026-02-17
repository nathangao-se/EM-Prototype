// ========================================
// DATA MANAGEMENT — Activity Map (replaces previous reconcile screen)
// ========================================

(function () {
  var overlay = document.getElementById('rec-overlay');
  var modal = overlay.querySelector('.rec-modal');
  var headerTitle = overlay.querySelector('.rec-header-title');
  var closeBtn = overlay.querySelector('.rec-close-btn');
  var bodyEl = modal.querySelector('.rec-body');

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function openModal() {
    render();
    overlay.classList.add('rec-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('rec-overlay--open');
    document.body.style.overflow = '';
  }

  window.openReconcileModal = openModal;
  window.closeReconcileModal = closeModal;

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('rec-overlay--open')) closeModal();
  });

  // ========== SPECIFIC DATA (from Figma) ==========
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

  function render() {
    headerTitle.textContent = 'Project name / Data management';

    var html = '<div class="dm-layout">';

    // ---------- LEFT COLUMN ----------
    html += '<div class="dm-left">';

    html += '<div class="dm-card">';
    html += '<div class="dm-card-heading">Active campaigns</div>';
    html += '<div class="dm-kpi-row">';
    html += '<span class="dm-kpi-value">3 Active 5% past due</span>';
    html += '<i class="fa-solid fa-arrow-trend-up dm-kpi-trend"></i>';
    html += '</div>';
    html += '<div class="dm-sub">19,832 records requested, 992 past due</div>';
    html += '<div class="dm-progress"><div class="dm-progress-fill" style="width:5%"></div><div class="dm-progress-bg"></div></div>';
    html += '<button class="dm-btn dm-btn-outline">Review campaigns</button>';
    html += '</div>';

    html += '<div class="dm-block">';
    html += '<div class="dm-block-title">Category overview</div>';
    html += '<div class="dm-block-meta">8,923 records</div>';
    html += '</div>';

    html += '<div class="dm-block">';
    html += '<div class="dm-block-title">All data list</div>';
    html += '<div class="dm-block-meta">8,923 records, 184 missing</div>';
    html += '</div>';

    html += '<div class="dm-card dm-card-warn">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-warn-icon"></i>';
    html += '<div class="dm-warn-text">6 instances</div>';
    html += '<a href="#" class="dm-link">Normalize &gt;</a>';
    html += '</div>';
    html += '<div class="dm-card-label">Unnormalized Columns</div>';

    html += '<div class="dm-card dm-card-warn">';
    html += '<i class="fa-solid fa-triangle-exclamation dm-warn-icon"></i>';
    html += '<div class="dm-warn-text">1,249 records</div>';
    html += '<a href="#" class="dm-link">Normalize &gt;</a>';
    html += '</div>';
    html += '<div class="dm-card-label">Unnormalized data</div>';

    html += '<button class="dm-btn dm-btn-outline dm-btn-block"><i class="fa-solid fa-list-check"></i> Rules library</button>';

    html += '</div>';

    // ---------- RIGHT COLUMN ----------
    html += '<div class="dm-right">';

    html += '<div class="dm-card dm-card-main">';
    html += '<div class="dm-card-heading">All activity records</div>';
    html += '<div class="dm-kpi-row">';
    html += '<span class="dm-kpi-value">86% Activities normalized</span>';
    html += '<i class="fa-solid fa-arrow-trend-up dm-kpi-trend"></i>';
    html += '</div>';
    html += '<div class="dm-sub">12 files uploaded, 8,923 records, 45/90 normalized</div>';
    html += '<div class="dm-progress"><div class="dm-progress-fill" style="width:86%"></div><div class="dm-progress-bg"></div></div>';
    html += '<div class="dm-actions">';
    html += '<button class="dm-btn dm-btn-green">+ Add files/data</button>';
    html += '<button class="dm-btn dm-btn-outline">Create campaign</button>';
    html += '<button class="dm-btn dm-btn-outline">Rules library</button>';
    html += '</div>';
    html += '</div>';

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

    bodyEl.innerHTML = html;
  }

  render();
})();
