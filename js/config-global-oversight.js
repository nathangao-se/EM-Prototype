// ===========================================
// CONFIG: GLOBAL OVERSIGHT — derived logic
// Depends on CONFIG_GLOBAL_OVERSIGHT from config-global-oversight-data.js
// ===========================================

// ===== BUILD SITE DIRECTORY =====
// Flat lookup of all sites by name, used by the tree-based dashboard
CONFIG_GLOBAL_OVERSIGHT.siteDirectory = {};
Object.values(CONFIG_GLOBAL_OVERSIGHT.hierarchyData).forEach(function(region) {
  if (region.sites) {
    region.sites.forEach(function(site) {
      CONFIG_GLOBAL_OVERSIGHT.siteDirectory[site.name] = site;
    });
  }
});

// ===== ADD INTERMEDIATE-LEVEL SITES =====
// These sit at country level to demonstrate sites dispersed across hierarchy levels
CONFIG_GLOBAL_OVERSIGHT.siteDirectory['France ESG Compliance Office'] = {
  name: 'France ESG Compliance Office', location: 'France', employees: '45', incidents: 1,
  change: '0%', changeDir: 'neutral', status: 'good', spark: [0, 0, 1, 0, 0],
  alerts: [{ category: 'Carbon', issue: 'Annual ESG compliance report overdue', severity: 'low', date: 'Feb 8' }]
};
CONFIG_GLOBAL_OVERSIGHT.siteDirectory['US Sustainability Coordination Hub'] = {
  name: 'US Sustainability Coordination Hub', location: 'United States', employees: '30', incidents: 1,
  change: '0%', changeDir: 'neutral', status: 'good', spark: [0, 1, 0, 0, 0],
  alerts: [{ category: 'Carbon', issue: 'Quarterly sustainability sync pending', severity: 'low', date: 'Feb 7' }]
};
CONFIG_GLOBAL_OVERSIGHT.siteDirectory['East China Regional Office'] = {
  name: 'East China Regional Office', location: 'China', employees: '20', incidents: 1,
  change: '0%', changeDir: 'neutral', status: 'good', spark: [0, 0, 0, 1, 0],
  alerts: [{ category: 'Energy', issue: 'Regional energy audit coordination needed', severity: 'low', date: 'Feb 6' }]
};

// ===== PROJECT STATUS BAR =====
CONFIG_GLOBAL_OVERSIGHT.projectBar = {
  title: 'Project: Q2 global audit',
  cards: [
    {
      label: 'File collection and activities',
      value: '50%',
      unit: 'Activities normalized',
      icon: 'fa-solid fa-triangle-exclamation',
      iconBg: 'warning',
      subtitle: '5 files uploaded, 45/90 normalized',
      progress: 50,
      actions: [
        { label: 'Add files', icon: 'fa-solid fa-plus', actionId: 'open-activity-data-setup' },
        { label: 'Review activity data', icon: 'fa-solid fa-map', actionId: 'open-activity-map', slot: 'left' }
      ]
    },
    {
      label: 'Emissions calculations',
      value: '38.64%',
      unit: 'EF Map rate',
      subtitle: '84 total emissions, 46 mapped, using 4 methods',
      progress: 46,
      actions: [
        { label: 'EF library', icon: 'fa-solid fa-chart-simple', actionId: 'open-ef-library' },
        { label: 'Calculation methods', icon: 'fa-solid fa-flask', actionId: 'open-calc-methods', slot: 'left' }
      ]
    },
    {
      label: 'Inventory and Statements',
      value: '0',
      unit: 'Inventories completed',
      chip: 'Planning',
      chipIcon: 'fa-regular fa-clock',
      subtitle: '3 inventories projections waiting',
      progress: 43,
      actions: [
        { label: 'Create projections', icon: 'fa-solid fa-chart-simple', actionId: 'open-inventory-wizard' }
      ],
      dropdown: {
        label: 'See inventory',
        icon: 'fa-solid fa-book-open',
        slot: 'left',
        items: [
          { label: 'Q4 2025 Corporate Inventory', meta: '1,061.9 tCO₂e', badge: 'Calculated', badgeType: 'success', actionId: 'open-ghg-inventory' },
          { label: 'Q3 2025 Corporate Inventory', meta: '987.3 tCO₂e', badge: 'Locked', badgeType: 'success', actionId: 'open-ghg-inventory' },
          { label: 'FY 2025 Annual Report', meta: 'Not calculated', badge: 'Draft', badgeType: 'warning', actionId: 'open-ghg-inventory' }
        ]
      }
    }
  ]
};
