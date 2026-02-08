// ===========================================
// CONFIG: GLOBAL OVERSIGHT
// Perspective: Executive/Admin with full visibility
// ===========================================

const CONFIG_GLOBAL_OVERSIGHT = {
  id: 'global-oversight',
  name: 'Global Oversight',
  description: 'Executive view with full visibility across all regions and sites',
  
  // Default selection when loading
  defaultSelection: 'Global Portfolio',
  
  // ===== VISUALIZATION (map with clickable region tags) =====
  visualization: {
    image: 'images/world.png',
    imageAlt: 'World map',
    regions: [
      { label: 'Europe', siteCount: '141', chipText: '102', status: 'blue', targetHierarchy: 'Europe', position: { x: 48, y: 32.3 } },
      { label: 'North America', siteCount: '192', chipText: '149', status: 'warning', targetHierarchy: 'North America', position: { x: 22, y: 35.2 } },
      { label: 'South America', siteCount: '203', chipText: '207', status: 'blue', targetHierarchy: 'Latin America', position: { x: 30.3, y: 71.2 } },
      { label: 'Asia Pacific', siteCount: '65', chipText: '203', status: 'danger', targetHierarchy: 'Asia Pacific', position: { x: 78, y: 42 } },
      { label: 'Middle East & Africa', siteCount: '162', chipText: '40', status: 'blue', targetHierarchy: 'Middle East & Africa', position: { x: 55, y: 58.2 } },
      { label: 'Australia/Oceania', siteCount: '50', chipText: '50', status: 'blue', targetHierarchy: 'Asia Pacific', position: { x: 82, y: 72.6 } }
    ]
  },
  
  // ===== GOALS SECTION =====
  goals: {
    mainGoal: {
      title: '2025 Net Zero Roadmap',
      metricValue: '34%',
      metricLabel: 'to target',
      subtitle: '18% Scope 1 & 2, 16% Scope 3',
      progressSegments: [
        { type: 'verified', width: 18 },
        { type: 'pending', width: 16, offset: 18 }
      ]
    },
    alerts: [
      {
        category: 'Daily tasks',
        summary: '5 due today',
        card: {
          title: 'Supplier data requests',
          icon: 'fa-solid fa-circle-exclamation',
          value: '3',
          label: 'responses due',
          subtitle: '60% response rate',
          progress: 60,
          variant: '',
          button: { icon: 'fa-solid fa-list-check', text: 'Review all tasks' }
        }
      },
      {
        category: 'Upcoming audits',
        summary: '2 scheduled',
        card: {
          title: 'ISO 14064 verification',
          icon: 'fa-solid fa-circle-check',
          value: 'Mar 15',
          label: 'ready',
          subtitle: '85% documentation complete',
          progress: 85,
          variant: 'success',
          button: { icon: 'fa-solid fa-file-lines', text: 'Inventories and reports' }
        }
      },
      {
        category: 'Data updates',
        summary: '12 items',
        card: {
          title: 'GHG factors & normalizations',
          icon: 'fa-solid fa-circle-exclamation',
          value: '12',
          label: 'pending review',
          subtitle: '33% reviewed this quarter',
          progress: 33,
          variant: '',
          button: { icon: 'fa-solid fa-database', text: 'Review data library' }
        }
      }
    ]
  },
  
  // Hierarchy levels shown in left panel
  hierarchyRegions: [
    { name: 'Global Portfolio', meta: '813 sites · 6 regions', incidents: 701, change: '+4%', changeDir: 'up', spark: [1, -2, 3, 0, 4] },
    { name: 'Europe', meta: '141 sites', incidents: 102, change: '+8%', changeDir: 'up', spark: [2, -3, 5, 1, 8] },
    { name: 'North America', meta: '192 sites', incidents: 149, change: '-12%', changeDir: 'down', spark: [5, 8, -2, 3, -12] },
    { name: 'Asia Pacific', meta: '65 sites', incidents: 203, change: '-5%', changeDir: 'down', spark: [-2, 3, 1, -3, -5] },
    { name: 'Middle East & Africa', meta: '162 sites', incidents: 40, change: '0%', changeDir: 'neutral', spark: [2, -1, 1, -2, 0] },
    { name: 'Latin America', meta: '203 sites', incidents: 207, change: '-50%', changeDir: 'down', spark: [20, 35, -5, 10, -50] }
  ],
  
  // Sites data per hierarchy level
  hierarchyData: {
    'Global Portfolio': {
      sites: [
        { name: 'Paris HQ', location: 'France', employees: '2,400', incidents: 12, change: '+8%', changeDir: 'up', status: 'warning', spark: [2, -3, 5, 1, 8], alerts: [
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 28' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Water consumption 15% above baseline', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Recycling rate dropped below 60%', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'medium', date: 'Jan 20' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 15' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 12' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'low', date: 'Jan 8' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 5' }
        ]},
        { name: 'London Flagship', location: 'United Kingdom', employees: '1,850', incidents: 8, change: '-15%', changeDir: 'down', status: 'good', spark: [8, 12, 3, -5, -15], alerts: [
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'medium', date: 'Jan 21' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 15' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'high', date: 'Jan 12' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'low', date: 'Jan 9' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'low', date: 'Jan 6' }
        ]},
        { name: 'Berlin Central', location: 'Germany', employees: '1,200', incidents: 6, change: '+3%', changeDir: 'up', status: 'neutral', spark: [1, -2, 4, -1, 3], alerts: [
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'District heating emissions high', severity: 'high', date: 'Jan 25' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'low', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'medium', date: 'Jan 13' }
        ]},
        { name: 'New York Tower', location: 'United States', employees: '2,100', incidents: 5, change: '-8%', changeDir: 'down', status: 'good', spark: [5, 2, 8, -3, -8], alerts: [
          { category: 'Energy', issue: 'Local Law 97 compliance gap', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Tenant sub-metering offline', severity: 'medium', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'low', date: 'Jan 14' }
        ]},
        { name: 'Tokyo Office', location: 'Japan', employees: '980', incidents: 4, change: '-2%', changeDir: 'down', status: 'neutral', spark: [-1, 3, 1, -4, -2], alerts: [
          { category: 'Energy', issue: 'Summer peak demand approaching', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'J-Credit procurement pending', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Jan 18' }
        ]}
      ]
    },
    'Europe': {
      sites: [
        { name: 'Paris HQ', location: 'France', employees: '2,400', incidents: 12, change: '+8%', changeDir: 'up', status: 'warning', spark: [2, -3, 5, 1, 8], alerts: [
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 28' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Water consumption 15% above baseline', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Recycling rate dropped below 60%', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'medium', date: 'Jan 20' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 15' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 12' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'low', date: 'Jan 8' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 5' }
        ]},
        { name: 'London Flagship', location: 'United Kingdom', employees: '1,850', incidents: 8, change: '-15%', changeDir: 'down', status: 'good', spark: [8, 12, 3, -5, -15], alerts: [
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'medium', date: 'Jan 21' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 15' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'high', date: 'Jan 12' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'low', date: 'Jan 9' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'low', date: 'Jan 6' }
        ]},
        { name: 'Berlin Central', location: 'Germany', employees: '1,200', incidents: 6, change: '+3%', changeDir: 'up', status: 'neutral', spark: [1, -2, 4, -1, 3], alerts: [
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'District heating emissions high', severity: 'high', date: 'Jan 25' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'low', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'medium', date: 'Jan 13' }
        ]},
        { name: 'Amsterdam Office', location: 'Netherlands', employees: '890', incidents: 4, change: '-22%', changeDir: 'down', status: 'good', spark: [5, 15, -8, 2, -22], alerts: [
          { category: 'Energy', issue: 'Wind power purchase agreement gap', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Canal water cooling permit review', severity: 'low', date: 'Jan 23' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'low', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Bicycle fleet expansion delayed', severity: 'low', date: 'Jan 17' }
        ]},
        { name: 'Brussels Hub', location: 'Belgium', employees: '650', incidents: 3, change: '+12%', changeDir: 'up', status: 'warning', spark: [-8, 3, -2, 6, 12], alerts: [
          { category: 'Energy', issue: 'Nuclear phase-out impact assessment', severity: 'high', date: 'Jan 27' },
          { category: 'Carbon', issue: 'EU ETS allowance shortfall', severity: 'high', date: 'Jan 24' },
          { category: 'Waste', issue: 'Single-use plastic ban compliance', severity: 'medium', date: 'Jan 21' }
        ]}
      ]
    },
    'North America': {
      sites: [
        { name: 'New York Tower', location: 'United States', employees: '2,100', incidents: 5, change: '-8%', changeDir: 'down', status: 'good', spark: [5, 2, 8, -3, -8], alerts: [
          { category: 'Energy', issue: 'Local Law 97 compliance gap', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Tenant sub-metering offline', severity: 'medium', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'low', date: 'Jan 14' }
        ]},
        { name: 'Toronto Central', location: 'Canada', employees: '1,450', incidents: 3, change: '-20%', changeDir: 'down', status: 'good', spark: [10, -5, 15, 2, -20], alerts: [
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Lake Ontario discharge permit', severity: 'low', date: 'Jan 19' }
        ]},
        { name: 'Chicago Hub', location: 'United States', employees: '890', incidents: 1, change: '-50%', changeDir: 'down', status: 'good', spark: [30, 5, 20, -15, -50], alerts: [
          { category: 'Energy', issue: 'ComEd demand response enrollment', severity: 'low', date: 'Jan 24' }
        ]}
      ]
    },
    'Asia Pacific': {
      sites: [
        { name: 'Tokyo Office', location: 'Japan', employees: '980', incidents: 4, change: '-2%', changeDir: 'down', status: 'neutral', spark: [-1, 3, 1, -4, -2], alerts: [
          { category: 'Energy', issue: 'Summer peak demand approaching', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'J-Credit procurement pending', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Jan 18' }
        ]},
        { name: 'Singapore Hub', location: 'Singapore', employees: '720', incidents: 2, change: '-10%', changeDir: 'down', status: 'good', spark: [2, 8, -3, 5, -10], alerts: [
          { category: 'Energy', issue: 'Solar PV maintenance scheduled', severity: 'low', date: 'Jan 26' },
          { category: 'Water', issue: 'NEWater allocation review', severity: 'medium', date: 'Jan 23' }
        ]}
      ]
    },
    'Middle East & Africa': {
      sites: [
        { name: 'Dubai Center', location: 'UAE', employees: '560', incidents: 2, change: '+5%', changeDir: 'up', status: 'neutral', spark: [-5, 2, -3, 8, 5], alerts: [
          { category: 'Energy', issue: 'District cooling efficiency drop', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'medium', date: 'Jan 24' }
        ]},
        { name: 'Johannesburg Office', location: 'South Africa', employees: '340', incidents: 1, change: '-33%', changeDir: 'down', status: 'good', spark: [20, -10, 15, 5, -33], alerts: [
          { category: 'Energy', issue: 'Load shedding backup review', severity: 'medium', date: 'Jan 25' }
        ]}
      ]
    },
    'Latin America': {
      sites: [
        { name: 'São Paulo HQ', location: 'Brazil', employees: '480', incidents: 1, change: '-50%', changeDir: 'down', status: 'good', spark: [15, 30, -10, 20, -50], alerts: [
          { category: 'Water', issue: 'Drought contingency plan update', severity: 'medium', date: 'Jan 26' }
        ]}
      ]
    }
  }
};
