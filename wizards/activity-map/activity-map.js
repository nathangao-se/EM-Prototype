// ========================================
// RECONCILE SOURCE DATA — Activity mapping modal
// ========================================

(function () {

  // ===========================================
  // DOM
  // ===========================================
  var overlay = document.getElementById('rec-overlay');
  var modal = overlay.querySelector('.rec-modal');
  var closeBtn = overlay.querySelector('.rec-close-btn');

  // ===========================================
  // STATE
  // ===========================================
  var selectedIdx = 1; // default to "Office supplies" (first non-completed)
  var activeFilter = 'all';

  // ===========================================
  // SAMPLE DATA
  // ===========================================

  var FILTERS = [
    { key: 'all',      title: 'All source data',     subtitle: '49 unmapped activities' },
    { key: '90-100',   title: '90-100%',   titleSuffix: 'match', subtitle: '39 unmapped activities' },
    { key: 'capital',  title: 'Capital goods',        subtitle: '6 unmapped activities' },
    { key: 'mobile',   title: 'Mobile combustion',    subtitle: '3 unmapped activities' },
    { key: 'refrig',   title: 'Refrigerants',         subtitle: '2 unmapped activities' }
  ];

  var ACTIVITIES = [
    { name: 'Diesel',                              meta: '38 instances',                      status: 'completed' },
    { name: 'Office supplies',                      meta: '3,420 records across 28 entities',  status: null },
    { name: 'Asphalt: Other - Energy recovery',     meta: '14 instances',                      status: null },
    { name: 'Cryogenic Natural Gas',                meta: '3 instances',                       status: null },
    { name: 'Biomass: Agricultural Residues',       meta: '5 instances',                       status: null },
    { name: 'Geothermal Energy',                    meta: '7 instances',                       status: null },
    { name: 'Hydrogen Fuel Cells',                  meta: '2 instances',                       status: null },
    { name: 'Nuclear Fusion',                       meta: '1 instance',                        status: null },
    { name: 'Ocean Thermal Energy Conversion',      meta: '4 instances',                       status: null },
    { name: 'Solar Photovoltaic',                   meta: '11 instances',                      status: null },
    { name: 'Tidal Energy',                         meta: '6 instances',                       status: null },
    { name: 'Wind Turbines',                        meta: '9 instances',                       status: null },
    { name: 'Waste to Energy',                      meta: '10 instances',                      status: null },
    { name: 'Hydropower: Small Scale',              meta: '12 instances',                      status: null },
    { name: 'Carbon Capture and Storage',           meta: '8 instances',                       status: null }
  ];

  // Match data per activity index
  var MATCHES = {
    0: {
      likely: 2, poor: 0,
      items: [
        { name: 'Diesel_fleet_EU', pct: 98, tier: 'high', unit: 'in L', source: 'Accor fleet management', date: '18/12/2025 09:14:22', logic: 'Exact semantic match: Diesel fuel for owned fleet vehicles' },
        { name: 'Diesel_generators', pct: 91, tier: 'high', unit: 'in L', source: 'Schneider sustainability', date: '17/12/2025 14:30:01', logic: 'Fuel type match: Diesel for backup power generation' }
      ]
    },
    1: {
      likely: 2, poor: 5,
      items: [
        { name: 'Goods_office_mixed', pct: 95, tier: 'high', unit: 'in Kg', source: 'Schneider sustainability', date: '21/12/2025 18:25:56', logic: 'Exact semantic and scope match: office consumables aggregated' },
        { name: 'Data', pct: 85, tier: 'medium', unit: 'in Kg', source: 'Schneider sustainability', date: '21/12/2025 18:25:56', logic: 'Broad category match: general procurement data', showAutoMap: true }
      ]
    },
    2: {
      likely: 1, poor: 2,
      items: [
        { name: 'Asphalt_production_recovery', pct: 88, tier: 'medium', unit: 'in MJ', source: 'Accor facilities DB', date: '19/12/2025 11:42:18', logic: 'Process match: energy recovery from asphalt production waste' },
        { name: 'Waste_thermal_recovery', pct: 62, tier: 'low', unit: 'in kWh', source: 'EcoInvent v3.9', date: '15/12/2025 08:10:44', logic: 'Partial overlap: thermal recovery from mixed waste streams', showAutoMap: true }
      ]
    },
    3: {
      likely: 1, poor: 1,
      items: [
        { name: 'CNG_industrial_use', pct: 92, tier: 'high', unit: 'in m³', source: 'Schneider sustainability', date: '20/12/2025 16:05:33', logic: 'Direct fuel match: cryogenic natural gas for industrial cooling' },
        { name: 'LNG_transport', pct: 54, tier: 'low', unit: 'in Kg', source: 'GaBi database', date: '14/12/2025 09:22:11', logic: 'Partial match: liquefied natural gas in transport context' }
      ]
    },
    4: {
      likely: 1, poor: 3,
      items: [
        { name: 'Biomass_agri_residue_EU', pct: 93, tier: 'high', unit: 'in tonnes', source: 'Accor biomass registry', date: '18/12/2025 13:55:09', logic: 'Exact match: agricultural residue biomass combustion for heat' },
        { name: 'Biogas_mixed_feedstock', pct: 71, tier: 'medium', unit: 'in m³', source: 'EcoInvent v3.9', date: '16/12/2025 10:30:00', logic: 'Related category: biogas derived from mixed agricultural inputs' },
        { name: 'Wood_pellets_heating', pct: 48, tier: 'low', unit: 'in Kg', source: 'Schneider sustainability', date: '12/12/2025 07:45:22', logic: 'Weak overlap: solid biomass for heating, different residue type', showAutoMap: true }
      ]
    },
    5: {
      likely: 2, poor: 1,
      items: [
        { name: 'Geothermal_direct_use', pct: 96, tier: 'high', unit: 'in kWh', source: 'Accor energy portfolio', date: '19/12/2025 15:12:48', logic: 'Direct match: geothermal energy for district heating systems' },
        { name: 'Geothermal_electricity', pct: 89, tier: 'medium', unit: 'in MWh', source: 'Schneider sustainability', date: '17/12/2025 11:08:36', logic: 'Scope variant: geothermal power for electricity generation' }
      ]
    },
    6: {
      likely: 1, poor: 1,
      items: [
        { name: 'H2_fuel_cell_stationary', pct: 90, tier: 'high', unit: 'in Kg H₂', source: 'Schneider sustainability', date: '20/12/2025 09:33:14', logic: 'Technology match: hydrogen fuel cells for stationary backup power' },
        { name: 'H2_electrolysis_green', pct: 58, tier: 'low', unit: 'in kWh', source: 'GaBi database', date: '13/12/2025 14:20:55', logic: 'Upstream process: green hydrogen production via electrolysis', showAutoMap: true }
      ]
    },
    7: {
      likely: 0, poor: 1,
      items: [
        { name: 'Nuclear_experimental', pct: 42, tier: 'low', unit: 'in MWh', source: 'EcoInvent v3.9', date: '10/12/2025 08:00:00', logic: 'Speculative match: experimental fusion energy research output', showAutoMap: true }
      ]
    },
    8: {
      likely: 1, poor: 2,
      items: [
        { name: 'OTEC_pilot_pacific', pct: 87, tier: 'medium', unit: 'in MWh', source: 'Accor renewables tracker', date: '18/12/2025 10:45:30', logic: 'Technology match: ocean thermal energy conversion pilot in Pacific region' },
        { name: 'Marine_tidal_mixed', pct: 52, tier: 'low', unit: 'in kWh', source: 'GaBi database', date: '11/12/2025 16:22:08', logic: 'Broad marine energy overlap: combines tidal and thermal sources' }
      ]
    },
    9: {
      likely: 2, poor: 1,
      items: [
        { name: 'Solar_PV_rooftop', pct: 97, tier: 'high', unit: 'in kWh', source: 'Accor energy portfolio', date: '21/12/2025 07:15:42', logic: 'Exact match: rooftop solar photovoltaic generation at owned properties' },
        { name: 'Solar_PV_ground_mount', pct: 94, tier: 'high', unit: 'in MWh', source: 'Schneider sustainability', date: '20/12/2025 12:50:19', logic: 'Installation variant: ground-mounted solar PV at leased sites' },
        { name: 'Solar_thermal_hybrid', pct: 65, tier: 'low', unit: 'in kWh', source: 'EcoInvent v3.9', date: '15/12/2025 09:30:00', logic: 'Technology overlap: solar thermal with PV hybrid systems', showAutoMap: true }
      ]
    },
    10: {
      likely: 1, poor: 2,
      items: [
        { name: 'Tidal_barrage_EU', pct: 91, tier: 'high', unit: 'in MWh', source: 'Accor renewables tracker', date: '19/12/2025 14:28:55', logic: 'Direct match: tidal barrage energy generation in European coastal sites' },
        { name: 'Wave_energy_atlantic', pct: 55, tier: 'low', unit: 'in kWh', source: 'GaBi database', date: '12/12/2025 11:05:33', logic: 'Related marine energy: wave energy converters in Atlantic region' }
      ]
    },
    11: {
      likely: 2, poor: 0,
      items: [
        { name: 'Wind_onshore_EU', pct: 96, tier: 'high', unit: 'in MWh', source: 'Schneider sustainability', date: '21/12/2025 10:20:15', logic: 'Exact match: onshore wind turbine electricity from EU PPAs' },
        { name: 'Wind_offshore_mixed', pct: 88, tier: 'medium', unit: 'in MWh', source: 'Accor energy portfolio', date: '19/12/2025 08:44:02', logic: 'Scope variant: offshore wind from mixed PPA and grid sources' }
      ]
    },
    12: {
      likely: 1, poor: 3,
      items: [
        { name: 'WtE_incineration_EU', pct: 90, tier: 'high', unit: 'in MWh', source: 'Accor waste management', date: '20/12/2025 13:10:28', logic: 'Process match: waste-to-energy incineration with energy recovery' },
        { name: 'Landfill_gas_capture', pct: 72, tier: 'medium', unit: 'in m³', source: 'EcoInvent v3.9', date: '16/12/2025 15:55:41', logic: 'Related process: landfill gas capture and utilisation' },
        { name: 'Waste_anaerobic_digest', pct: 49, tier: 'low', unit: 'in kWh', source: 'GaBi database', date: '11/12/2025 09:12:30', logic: 'Weak overlap: anaerobic digestion of organic waste fraction', showAutoMap: true }
      ]
    },
    13: {
      likely: 2, poor: 1,
      items: [
        { name: 'Small_hydro_run_river', pct: 95, tier: 'high', unit: 'in MWh', source: 'Accor energy portfolio', date: '20/12/2025 11:35:07', logic: 'Exact match: small-scale run-of-river hydropower installations' },
        { name: 'Micro_hydro_off_grid', pct: 82, tier: 'medium', unit: 'in kWh', source: 'Schneider sustainability', date: '18/12/2025 16:48:22', logic: 'Scale variant: micro-hydro off-grid generation at remote sites' }
      ]
    },
    14: {
      likely: 1, poor: 2,
      items: [
        { name: 'CCS_post_combustion', pct: 86, tier: 'medium', unit: 'in tonnes CO₂', source: 'Schneider sustainability', date: '19/12/2025 10:05:50', logic: 'Technology match: post-combustion carbon capture at industrial facilities' },
        { name: 'CCS_direct_air', pct: 68, tier: 'medium', unit: 'in tonnes CO₂', source: 'Accor offset registry', date: '17/12/2025 13:22:15', logic: 'Related technology: direct air capture with geological storage' },
        { name: 'BECCS_experimental', pct: 41, tier: 'low', unit: 'in tonnes CO₂', source: 'EcoInvent v3.9', date: '10/12/2025 07:30:00', logic: 'Speculative: bioenergy with CCS experimental programme', showAutoMap: true }
      ]
    }
  };

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openModal() {
    selectedIdx = 1;
    activeFilter = 'all';
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

  // ===========================================
  // RENDER
  // ===========================================

  function render() {
    var html = '';

    // KPI filter cards
    html += buildFilterBar();

    // Divider
    html += '<div class="rec-divider"></div>';

    // Summary line
    var matchData = MATCHES[selectedIdx];
    var likelyCount = matchData ? matchData.likely : 0;
    var poorCount = matchData ? matchData.poor : 0;

    html += '<div class="rec-summary-line">';
    html += '<span class="rec-summary-title">' + ACTIVITIES.length + ' Activities to reconcile</span>';
    html += '<span class="rec-summary-title">' + likelyCount + ' likely matches, ' + poorCount + ' poor matches</span>';
    html += '<button class="rec-btn-auto"><i class="fa-solid fa-check-double"></i> Auto map best options</button>';
    html += '</div>';

    // Split panel
    html += '<div class="rec-split">';
    html += '<div class="rec-split-left">' + buildActivityList() + '</div>';
    html += '<div class="rec-split-right">' + buildMatchPanel() + '</div>';
    html += '</div>';

    modal.querySelector('.rec-body').innerHTML = html;
    bindInteractions();
  }

  // ===========================================
  // FILTER BAR
  // ===========================================

  function buildFilterBar() {
    var html = '<div class="rec-filter-bar">';
    FILTERS.forEach(function (f) {
      var cls = 'rec-kpi-card';
      if (f.key === activeFilter) cls += ' rec-kpi-card--active';
      html += '<div class="' + cls + '" data-filter="' + f.key + '">';
      html += '<div class="rec-kpi-title">';
      html += '<span class="rec-kpi-main">' + esc(f.title) + '</span>';
      if (f.titleSuffix) {
        html += ' <span class="rec-kpi-suffix">' + esc(f.titleSuffix) + '</span>';
      }
      html += '</div>';
      html += '<div class="rec-kpi-sub">' + esc(f.subtitle) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // ===========================================
  // ACTIVITY LIST (left panel)
  // ===========================================

  function buildActivityList() {
    var html = '';
    ACTIVITIES.forEach(function (a, idx) {
      var isSelected = idx === selectedIdx;
      var cls = 'rec-activity';
      if (isSelected) cls += ' rec-activity--selected';
      if (a.status === 'completed') cls += ' rec-activity--completed';

      html += '<div class="' + cls + '" data-act-idx="' + idx + '">';
      html += '<div class="rec-activity-name">' + esc(a.name) + '</div>';
      html += '<div class="rec-activity-meta">' + esc(a.meta) + '</div>';
      if (a.status === 'completed') {
        html += '<span class="rec-chip rec-chip--completed"><i class="fa-solid fa-check"></i> Completed</span>';
      }
      html += '</div>';
    });
    return html;
  }

  // ===========================================
  // MATCH PANEL (right panel)
  // ===========================================

  function buildMatchPanel() {
    var matchData = MATCHES[selectedIdx];
    if (!matchData || !matchData.items || matchData.items.length === 0) {
      return '<div class="rec-empty">No matches available for this activity.</div>';
    }

    var html = '';
    matchData.items.forEach(function (m) {
      var cardCls = 'rec-match-card';
      if (m.tier === 'high') cardCls += ' rec-match-card--high';

      html += '<div class="' + cardCls + '">';

      // Header: name + chip
      html += '<div class="rec-match-header">';
      html += '<span class="rec-match-name">' + esc(m.name) + '</span>';
      var chipCls = 'rec-chip ' + (m.tier === 'high' ? 'rec-chip--match-high' : m.tier === 'medium' ? 'rec-chip--match-med' : 'rec-chip--match-low');
      html += '<span class="' + chipCls + '"><i class="fa-solid fa-check"></i> ' + m.pct + '% match</span>';
      html += '</div>';

      // Meta row
      html += '<div class="rec-match-meta">';
      html += '<span>' + esc(m.unit) + '</span>';
      html += '<span class="rec-match-sep"></span>';
      html += '<span>' + esc(m.source) + '</span>';
      html += '<span class="rec-match-date">' + esc(m.date) + '</span>';
      html += '</div>';

      // Divider
      html += '<div class="rec-match-divider"></div>';

      // Underlying logic
      html += '<div class="rec-match-logic">';
      html += '<div class="rec-match-logic-label">Underlying logic</div>';
      html += '<div class="rec-match-logic-value">' + esc(m.logic) + '</div>';
      html += '</div>';

      // Auto-map button (only for some)
      if (m.showAutoMap) {
        html += '<button class="rec-btn-auto rec-btn-auto--card"><i class="fa-solid fa-check-double"></i> Auto map best options</button>';
      }

      html += '</div>';
    });
    return html;
  }

  // ===========================================
  // INTERACTIONS
  // ===========================================

  function bindInteractions() {
    // Activity selection
    modal.querySelectorAll('[data-act-idx]').forEach(function (el) {
      el.addEventListener('click', function () {
        selectedIdx = parseInt(this.dataset.actIdx, 10);
        render();
      });
    });

    // Filter cards
    modal.querySelectorAll('[data-filter]').forEach(function (el) {
      el.addEventListener('click', function () {
        activeFilter = this.dataset.filter;
        render();
      });
    });
  }

  // ===========================================
  // UTILITY
  // ===========================================

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
