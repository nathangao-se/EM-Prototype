// ===========================================
// CONFIG: SITE MANAGER
// Perspective: Individual site manager with limited scope
// ===========================================

const CONFIG_SITE_MANAGER = {
  id: 'site-manager',
  name: 'Site Manager',
  description: 'Individual site manager view with single-site focus',
  
  // Default selection when loading
  defaultSelection: 'All Zones',
  
  // ===== VISUALIZATION (button grid - no background image) =====
  visualization: {
    image: null,
    imageAlt: null,
    regions: [
      { label: 'Housekeeping - 20 crew', chipText: '16 alerts', status: 'blue', targetHierarchy: 'Guest Rooms' },
      { label: 'Other supply chain - 14 crew', chipText: '5 alerts', status: 'blue', targetHierarchy: 'Conference Center' },
      { label: 'Engineering - 14 crew', chipText: '13 alerts', status: 'blue', targetHierarchy: 'Back of House' },
      { label: 'Operations - 2 crew', chipText: '1 alerts', status: 'blue', targetHierarchy: 'Lobby & Common' },
      { label: 'Food services - 54 crew', chipText: '203 alerts', status: 'danger', targetHierarchy: 'Kitchen & Dining' }
    ]
  },
  
  // ===== GOALS SECTION =====
  goals: {
    mainGoal: {
      title: 'Q1 Energy Reduction Target',
      metricValue: '12%',
      metricLabel: 'achieved',
      subtitle: '8% HVAC, 4% lighting · Target: 15%',
      progressSegments: [
        { type: 'verified', width: 12 },
        { type: 'pending', width: 3, offset: 12 }
      ]
    },
    alerts: [
      {
        category: 'Maintenance',
        summary: '3 items',
        card: {
          title: 'Equipment inspections',
          icon: 'fa-solid fa-wrench',
          value: '2',
          label: 'overdue',
          subtitle: 'HVAC filter replacement due',
          progress: 40,
          variant: '',
          button: { icon: 'fa-solid fa-clipboard-list', text: 'View schedule' }
        }
      },
      {
        category: 'Data entry',
        summary: 'Weekly',
        card: {
          title: 'Meter readings',
          icon: 'fa-solid fa-gauge',
          value: 'Fri',
          label: 'next due',
          subtitle: '4 of 6 meters logged this week',
          progress: 67,
          variant: '',
          button: { icon: 'fa-solid fa-pen-to-square', text: 'Enter readings' }
        }
      },
      {
        category: 'Compliance',
        summary: '1 upcoming',
        card: {
          title: 'Fire safety audit',
          icon: 'fa-solid fa-circle-check',
          value: 'Feb 20',
          label: 'scheduled',
          subtitle: 'Documentation 90% ready',
          progress: 90,
          variant: 'success',
          button: { icon: 'fa-solid fa-file-lines', text: 'Review checklist' }
        }
      }
    ]
  },
  
  // Hierarchy levels (zones within the site)
  hierarchyRegions: [
    { name: 'All Zones', meta: '5 departments · 124 crew', incidents: 238, change: '-8%', changeDir: 'down', spark: [3, 5, 2, -1, -8] },
    { name: 'Guest Rooms', meta: 'Housekeeping - 20 crew', incidents: 16, change: '+12%', changeDir: 'up', spark: [-2, 3, 5, 8, 12] },
    { name: 'Conference Center', meta: 'Other supply chain - 14 crew', incidents: 5, change: '-20%', changeDir: 'down', spark: [10, 5, -3, -8, -20] },
    { name: 'Kitchen & Dining', meta: 'Food services - 54 crew', incidents: 203, change: '+15%', changeDir: 'up', spark: [2, 8, 12, 14, 15] },
    { name: 'Lobby & Common', meta: 'Operations - 2 crew', incidents: 1, change: '-50%', changeDir: 'down', spark: [15, 8, 2, -10, -50] },
    { name: 'Back of House', meta: 'Engineering - 14 crew', incidents: 13, change: '+5%', changeDir: 'up', spark: [1, 3, 5, 4, 5] }
  ],
  
  // Equipment/sub-areas per zone
  hierarchyData: {
    'All Zones': {
      sites: [
        { name: 'HVAC System', location: 'Building-wide', employees: '—', incidents: 3, change: '+15%', changeDir: 'up', status: 'warning', spark: [2, 5, 8, 10, 15], alerts: [
          { category: 'Energy', issue: 'Chiller running outside optimal range', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'AHU-2 filter pressure drop elevated', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'VAV box calibration needed (Floor 5)', severity: 'low', date: 'Jan 30' }
        ]},
        { name: 'Lighting Controls', location: 'Building-wide', employees: '—', incidents: 2, change: '-5%', changeDir: 'down', status: 'neutral', spark: [3, 5, 0, -2, -5], alerts: [
          { category: 'Energy', issue: 'Daylight sensors offline in lobby', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Occupancy sensor fault (Room 412)', severity: 'low', date: 'Jan 28' }
        ]},
        { name: 'Water Systems', location: 'Building-wide', employees: '—', incidents: 1, change: '-30%', changeDir: 'down', status: 'good', spark: [20, 10, 5, -10, -30], alerts: [
          { category: 'Water', issue: 'Pool backwash cycle extended', severity: 'low', date: 'Jan 29' }
        ]},
        { name: 'Waste Management', location: 'Loading dock', employees: '—', incidents: 1, change: '+5%', changeDir: 'up', status: 'neutral', spark: [-2, 3, 1, 4, 5], alerts: [
          { category: 'Waste', issue: 'Recycling contamination rate above 15%', severity: 'medium', date: 'Feb 1' }
        ]}
      ]
    },
    'Guest Rooms': {
      sites: [
        { name: 'Floor 2-3 (Standard)', location: '48 rooms', employees: '—', incidents: 1, change: '+8%', changeDir: 'up', status: 'neutral', spark: [0, 2, 5, 6, 8], alerts: [
          { category: 'Energy', issue: 'Mini-bar units running warm (6 rooms)', severity: 'low', date: 'Feb 2' }
        ]},
        { name: 'Floor 4-5 (Deluxe)', location: '36 rooms', employees: '—', incidents: 1, change: '+20%', changeDir: 'up', status: 'warning', spark: [2, 5, 10, 15, 20], alerts: [
          { category: 'Energy', issue: 'Thermostat override abuse detected', severity: 'medium', date: 'Feb 3' }
        ]},
        { name: 'Floor 6-8 (Suites)', location: '24 rooms', employees: '—', incidents: 1, change: '+5%', changeDir: 'up', status: 'neutral', spark: [-1, 2, 3, 4, 5], alerts: [
          { category: 'Water', issue: 'Jacuzzi tub leak suspected (Suite 705)', severity: 'medium', date: 'Jan 31' }
        ]}
      ]
    },
    'Conference Center': {
      sites: [
        { name: 'Main Ballroom', location: '500 capacity', employees: '—', incidents: 1, change: '-15%', changeDir: 'down', status: 'good', spark: [5, 10, 2, -5, -15], alerts: [
          { category: 'Energy', issue: 'Pre-cooling schedule too aggressive', severity: 'low', date: 'Feb 1' }
        ]},
        { name: 'Meeting Rooms A-D', location: '4 rooms', employees: '—', incidents: 1, change: '-25%', changeDir: 'down', status: 'good', spark: [15, 5, 0, -10, -25], alerts: [
          { category: 'Energy', issue: 'Room C lights left on overnight', severity: 'low', date: 'Jan 30' }
        ]}
      ]
    },
    'Kitchen & Dining': {
      sites: [
        { name: 'Main Kitchen', location: '—', employees: '—', incidents: 1, change: '+3%', changeDir: 'up', status: 'neutral', spark: [-2, 1, 2, 2, 3], alerts: [
          { category: 'Energy', issue: 'Walk-in freezer door seal degraded', severity: 'medium', date: 'Feb 2' }
        ]},
        { name: 'Restaurant Floor', location: '120 seats', employees: '—', incidents: 0, change: '-10%', changeDir: 'down', status: 'good', spark: [5, 2, 0, -5, -10], alerts: []}
      ]
    },
    'Lobby & Common': {
      sites: [
        { name: 'Main Lobby', location: '—', employees: '—', incidents: 1, change: '-40%', changeDir: 'down', status: 'good', spark: [30, 15, 5, -20, -40], alerts: [
          { category: 'Energy', issue: 'Revolving door motor inefficient', severity: 'low', date: 'Jan 28' }
        ]},
        { name: 'Fitness Center', location: '—', employees: '—', incidents: 0, change: '-60%', changeDir: 'down', status: 'good', spark: [50, 20, 0, -30, -60], alerts: []},
        { name: 'Pool & Spa', location: '—', employees: '—', incidents: 0, change: '+2%', changeDir: 'up', status: 'neutral', spark: [-1, 0, 1, 1, 2], alerts: []}
      ]
    },
    'Back of House': {
      sites: [
        { name: 'Laundry', location: 'Basement', employees: '—', incidents: 0, change: '-5%', changeDir: 'down', status: 'good', spark: [3, 2, 0, -2, -5], alerts: []},
        { name: 'Mechanical Room', location: 'Basement', employees: '—', incidents: 0, change: '0%', changeDir: 'neutral', spark: [1, -1, 1, -1, 0], alerts: []},
        { name: 'Storage', location: 'Basement', employees: '—', incidents: 0, change: '—', changeDir: 'neutral', spark: [0, 0, 0, 0, 0], alerts: []}
      ]
    }
  }
};
