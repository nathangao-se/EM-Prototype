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
          button: { icon: 'fa-solid fa-list-check', text: 'Review all tasks' }
        },
        modalItems: [
          {
            title: 'HVAC filter replacement — AHU-3',
            description: 'Air handling unit 3 filter differential pressure at 280 Pa (limit 250 Pa). Replacement overdue by 4 days. Spare filters in stock.',
            status: 'overdue',
            date: 'Feb 4',
            severity: 'high',
            history: [
              { event: 'Filter installed (new)', date: 'Nov 15' },
              { event: 'Differential pressure reached 200 Pa', date: 'Jan 10' },
              { event: 'Replacement scheduled for Feb 4', date: 'Jan 28' },
              { event: 'Missed schedule — technician reassigned to boiler issue', date: 'Feb 4' },
              { event: 'Flagged overdue — pressure now at 280 Pa', date: 'Feb 8' }
            ]
          },
          {
            title: 'Cooling tower chemical treatment',
            description: 'Weekly biocide and scale inhibitor dosing log shows missed treatment on Feb 3. Conductivity reading trending above setpoint.',
            status: 'overdue',
            date: 'Feb 3',
            severity: 'medium',
            history: [
              { event: 'Treatment completed normally', date: 'Jan 27' },
              { event: 'Treatment missed — chemical drum empty', date: 'Feb 3' },
              { event: 'New drum delivered to loading dock', date: 'Feb 6' },
              { event: 'Conductivity at 2,800 µS/cm (target: 2,500)', date: 'Feb 8' }
            ]
          },
          {
            title: 'Elevator #2 annual safety inspection',
            description: 'State-mandated annual inspection due Feb 28. Pre-inspection checklist 70% complete. Hydraulic fluid sample sent to lab.',
            status: 'on-track',
            date: 'Feb 28',
            severity: 'low',
            history: [
              { event: 'Last annual inspection passed', date: 'Mar 2, 2024' },
              { event: 'Pre-inspection checklist initiated', date: 'Jan 15' },
              { event: 'Hydraulic fluid sample sent to lab', date: 'Feb 1' },
              { event: 'Inspector visit confirmed for Feb 28', date: 'Feb 5' }
            ]
          }
        ]
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
          button: { icon: 'fa-solid fa-file-lines', text: 'Inventories and reports' }
        },
        modalItems: [
          {
            title: 'Main electric meter — Building',
            description: 'Weekly kWh reading from main utility meter. Current reading logged. Consumption tracking 3% above seasonal baseline.',
            status: 'completed',
            date: 'Feb 7',
            severity: 'low',
            history: [
              { event: 'Reading: 48,220 kWh (week of Jan 27)', date: 'Jan 31' },
              { event: 'Reading: 49,115 kWh (week of Feb 3)', date: 'Feb 7' },
              { event: 'Variance flag: +3% vs seasonal model', date: 'Feb 7' }
            ]
          },
          {
            title: 'Natural gas meter — Boiler room',
            description: 'Weekly therms reading for heating plant. Current reading logged. Consumption within normal range for heating season.',
            status: 'completed',
            date: 'Feb 7',
            severity: 'low',
            history: [
              { event: 'Reading: 3,840 therms (week of Jan 27)', date: 'Jan 31' },
              { event: 'Reading: 3,650 therms (week of Feb 3)', date: 'Feb 7' }
            ]
          },
          {
            title: 'Natural gas meter — Kitchen',
            description: 'Weekly therms reading for kitchen cooking equipment. Current reading logged. Slight uptick correlated with banquet bookings.',
            status: 'completed',
            date: 'Feb 7',
            severity: 'low',
            history: [
              { event: 'Reading: 1,120 therms (week of Jan 27)', date: 'Jan 31' },
              { event: 'Reading: 1,280 therms (week of Feb 3)', date: 'Feb 7' },
              { event: 'Note: 2 banquet events this week', date: 'Feb 7' }
            ]
          },
          {
            title: 'Main water meter — Building',
            description: 'Weekly m³ reading from municipal supply. Current reading logged. 8% above target — pool backwash volume suspected.',
            status: 'completed',
            date: 'Feb 7',
            severity: 'medium',
            history: [
              { event: 'Reading: 412 m³ (week of Jan 27)', date: 'Jan 31' },
              { event: 'Reading: 445 m³ (week of Feb 3)', date: 'Feb 7' },
              { event: 'Variance flag: +8% vs target — investigation needed', date: 'Feb 7' }
            ]
          },
          {
            title: 'Chiller sub-meter — HVAC plant',
            description: 'Not yet logged this week. Due by Friday close of business.',
            status: 'pending',
            date: 'Due Feb 7',
            severity: 'medium',
            history: [
              { event: 'Reading: 12,400 kWh (week of Jan 27)', date: 'Jan 31' },
              { event: 'Not yet logged for this week', date: 'Feb 8' }
            ]
          },
          {
            title: 'Diesel generator run-hours',
            description: 'Not yet logged this week. Monthly generator test occurred Feb 2 — run-hours to be captured.',
            status: 'pending',
            date: 'Due Feb 7',
            severity: 'low',
            history: [
              { event: 'Reading: 14.2 hrs cumulative (week of Jan 27)', date: 'Jan 31' },
              { event: 'Monthly test run: 0.5 hrs on Feb 2', date: 'Feb 2' },
              { event: 'Not yet logged for this week', date: 'Feb 8' }
            ]
          }
        ]
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
          button: { icon: 'fa-solid fa-database', text: 'Review data library' }
        },
        modalItems: [
          {
            title: 'Fire safety systems audit',
            description: 'Annual fire safety inspection covering suppression systems, alarm panels, emergency lighting, and egress routes. Inspector confirmed Feb 20.',
            status: 'on-track',
            date: 'Feb 20',
            severity: 'low',
            history: [
              { event: 'Last audit passed with 2 minor findings', date: 'Feb 22, 2024' },
              { event: 'Prior findings remediated and documented', date: 'Apr 10, 2024' },
              { event: 'Pre-audit self-inspection completed', date: 'Jan 25' },
              { event: 'Kitchen suppression system serviced', date: 'Feb 1' },
              { event: 'Emergency lighting battery test passed', date: 'Feb 5' },
              { event: 'Documentation package 90% assembled', date: 'Feb 8' }
            ]
          }
        ]
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
    // -------------------------------------------------------
    // ALL ZONES — top building-wide system categories (sum = 238)
    // 50 + 45 + 40 + 38 + 35 + 30 = 238
    // -------------------------------------------------------
    'All Zones': {
      sites: [
        // --- 1. Kitchen Exhaust & Ventilation: 50 incidents ---
        { name: 'Kitchen Exhaust & Ventilation', location: 'Kitchen / Rooftop', employees: '—', incidents: 50, change: '+18%', changeDir: 'up', status: 'warning', spark: [5, 12, 18, 22, 18], alerts: [
          { category: 'Energy', issue: 'Exhaust hood capture velocity below specification on line 1', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Kitchen hood energy consumption spiked during dinner service', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Make-up air unit running at full capacity outside peak hours', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Exhaust fan VFD stuck at 100% — not modulating with demand', severity: 'high', date: 'Feb 5' },
          { category: 'Energy', issue: 'Hood lighting circuit drawing excessive standby power', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Ventilation energy usage 20% above monthly baseline', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Rooftop exhaust unit #2 pulling excess amperage', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Supply air tempering coil energy waste during mild weather', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Kitchen ventilation demand-control sensors offline', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Exhaust fan belt slippage increasing motor power draw', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Make-up air heating coil cycling every 90 seconds', severity: 'low', date: 'Feb 1' },
          { category: 'Energy', issue: 'Hood activation running outside scheduled operating hours', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Exhaust system not ramping down during idle kitchen periods', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Ventilation pre-conditioning consuming unplanned energy', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Rooftop unit #1 condenser fan running continuously overnight', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Kitchen hood circuit breaker tripping — restart energy loss', severity: 'high', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Charbroiler carbon emissions above regulatory threshold', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Incomplete combustion detected in main grill exhaust', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Flue gas CO₂ concentration elevated on line 2', severity: 'medium', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Kitchen exhaust carbon intensity rising week over week', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Wok station emissions exceeding ventilation capture rate', severity: 'high', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Carbon filter media saturated — breakthrough pollutants detected', severity: 'high', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Rooftop exhaust dispersal pattern drifting toward air intake', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Grease-laden vapor escaping hood capture zone at peak', severity: 'medium', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Charcoal grill flue gas analyzer returning high readings', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Kitchen stack emissions exceed quarterly carbon target', severity: 'high', date: 'Jan 25' },
          { category: 'Carbon', issue: 'CO monitor triggered near fryer exhaust duct junction', severity: 'high', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Exhaust carbon intensity per meal served trending upward', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Pollution control unit efficiency degraded to 68%', severity: 'medium', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Kitchen section carbon footprint up 12% versus last month', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Grease filter #3 saturated — replacement overdue by 5 days', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Grease trap approaching capacity at 87% full', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Exhaust duct grease accumulation at critical fire-risk level', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Grease interceptor overflow risk detected on line 1', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Used filter disposal not completed on weekly schedule', severity: 'low', date: 'Jan 31' },
          { category: 'Waste', issue: 'Grease waste hauling delayed — storage drum at capacity', severity: 'medium', date: 'Jan 29' },
          { category: 'Waste', issue: 'Duct cleaning residue containment failure on south riser', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Grease filter auto-wash system nozzle clogged', severity: 'medium', date: 'Jan 24' },
          { category: 'Waste', issue: 'Hood baffle filters misaligned — grease bypass detected', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Grease recovery unit output quality below reuse standard', severity: 'low', date: 'Jan 16' },
          { category: 'Waste', issue: 'Exhaust system cleaning chemical waste above disposal limit', severity: 'low', date: 'Jan 12' },
          { category: 'Waste', issue: 'Disposable filter stockpile creating storage and waste issue', severity: 'low', date: 'Jan 8' },
          { category: 'Water', issue: 'Hood fire suppression system pressure low — possible leak', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Grease trap rinse water volume 40% above target', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Make-up air humidifier consuming unmetered water supply', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Exhaust duct condensation dripping into food prep area', severity: 'medium', date: 'Jan 30' },
          { category: 'Water', issue: 'Wet scrubber water recirculation pump failing intermittently', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Fire suppression test discharge water not being recaptured', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Kitchen hood wash-down using potable water unnecessarily', severity: 'low', date: 'Jan 17' },
          { category: 'Water', issue: 'Condensate from exhaust stack pooling on roof membrane', severity: 'low', date: 'Jan 10' }
        ]},

        // --- 2. Commercial Refrigeration: 45 incidents ---
        { name: 'Commercial Refrigeration', location: 'Kitchen / Storage', employees: '—', incidents: 45, change: '+12%', changeDir: 'up', status: 'warning', spark: [3, 8, 14, 16, 12], alerts: [
          { category: 'Energy', issue: 'Walk-in cooler compressor short-cycling — excess energy use', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Reach-in freezer running continuously — defrost timer fault', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Walk-in freezer evaporator fan motor pulling excess amps', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Cooler condenser coil dirty — compressor working overtime', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Walk-in door heater strip energized when door is sealed', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Reach-in cooler interior light circuit on after closing', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Refrigeration rack energy consumption up 18% this week', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Walk-in cooler anti-sweat heater active during low humidity', severity: 'low', date: 'Feb 2' },
          { category: 'Energy', issue: 'Freezer compressor superheat out of range — efficiency loss', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Cooler evaporator partially frosted — airflow restriction', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Condenser fan cycling abnormally — irregular energy draw', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Refrigeration controller not entering night setback mode', severity: 'medium', date: 'Jan 27' },
          { category: 'Energy', issue: 'Walk-in freezer strip curtain missing — cold loss at door', severity: 'medium', date: 'Jan 24' },
          { category: 'Energy', issue: 'Cooler compressor oil return issue — elevated power draw', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Under-counter refrigeration energy spike detected in bar', severity: 'low', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Walk-in cooler R-404A level low — possible refrigerant leak', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Freezer refrigerant charge below spec — HFC emissions risk', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Reach-in unit showing signs of slow refrigerant seepage', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Refrigeration rack CO₂-equivalent emissions flagged high', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Cooler compressor seal weeping refrigerant at shaft', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GWP impact from refrigerant top-up exceeds quarterly budget', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Walk-in system refrigerant pressure trending down weekly', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Freezer suction line frosting suggests low charge', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Refrigerant reclaim required before scheduled compressor work', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Condenser high-pressure cutout triggered — linked to low charge', severity: 'medium', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Cooler maintenance log shows repeated refrigerant additions', severity: 'low', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Reach-in freezer door gasket leak accelerating charge loss', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Walk-in cooler condensate drain line clogged with debris', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Freezer defrost water overflowing drain pan to floor', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Condensate pooling under reach-in refrigerator base', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Cooler defrost cycle producing excess condensate volume', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Walk-in floor drain backing up near cooler compressor', severity: 'medium', date: 'Jan 28' },
          { category: 'Water', issue: 'Ice machine drain tied to cooler condensate — overflow risk', severity: 'medium', date: 'Jan 24' },
          { category: 'Water', issue: 'Freezer condensate heater failed — ice dam blocking drain', severity: 'high', date: 'Jan 19' },
          { category: 'Water', issue: 'Walk-in humidity sensor fault causing condensation on product', severity: 'medium', date: 'Jan 14' },
          { category: 'Water', issue: 'Evaporator drain pan corroded — water dripping on stored goods', severity: 'medium', date: 'Jan 8' },
          { category: 'Water', issue: 'Condensate pump float switch stuck — backup water imminent', severity: 'medium', date: 'Jan 5' },
          { category: 'Waste', issue: 'Walk-in cooler temperature excursion — product spoilage risk', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Freezer temperature alarm — $2.4K product inventory at risk', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Reach-in cooler shelf collapse caused product damage', severity: 'high', date: 'Feb 2' },
          { category: 'Waste', issue: 'Walk-in cooler door gasket failure — product temp drifting', severity: 'medium', date: 'Jan 30' },
          { category: 'Waste', issue: 'Freezer defrost cycle too aggressive — partial thaw of goods', severity: 'medium', date: 'Jan 26' },
          { category: 'Waste', issue: 'Expired product discovered — cooler temp logging gap', severity: 'medium', date: 'Jan 22' },
          { category: 'Waste', issue: 'Cooler FIFO organization audit failed — rotation issues', severity: 'low', date: 'Jan 17' },
          { category: 'Waste', issue: 'Reach-in freezer product over-frosted — labels unreadable', severity: 'low', date: 'Jan 12' }
        ]},

        // --- 3. Dishwashing & Sanitation: 40 incidents ---
        { name: 'Dishwashing & Sanitation', location: 'Kitchen / Stewarding', employees: '—', incidents: 40, change: '+8%', changeDir: 'up', status: 'warning', spark: [2, 5, 8, 10, 8], alerts: [
          { category: 'Water', issue: 'Final rinse water temperature below 82°C sanitization minimum', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Pre-rinse spray valve flow rate exceeding 6 LPM target', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Dishwasher cycle using 22% more water than rated spec', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Rinse water heat recovery not recapturing for pre-wash', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Booster heater consuming excess water during warm-up phase', severity: 'low', date: 'Feb 4' },
          { category: 'Water', issue: 'Dishwasher leak detected at water supply connection point', severity: 'high', date: 'Feb 3' },
          { category: 'Water', issue: 'Pot wash station running water continuously during service', severity: 'high', date: 'Feb 2' },
          { category: 'Water', issue: 'Glasswasher rinse arm partially blocked — water waste', severity: 'low', date: 'Feb 1' },
          { category: 'Water', issue: 'Water softener regeneration cycle running twice daily', severity: 'medium', date: 'Jan 31' },
          { category: 'Water', issue: 'Dishwasher drain valve not fully sealing between cycles', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Pre-soak sink overflowing during peak lunch service', severity: 'high', date: 'Jan 27' },
          { category: 'Water', issue: 'Hot water supply temperature fluctuating — extended cycles', severity: 'medium', date: 'Jan 24' },
          { category: 'Water', issue: 'Rinse aid dispenser over-dosing — extra water to clear', severity: 'low', date: 'Jan 20' },
          { category: 'Water', issue: 'Conveyor dishwasher curtain leaking rinse water to floor', severity: 'low', date: 'Jan 15' },
          { category: 'Energy', issue: 'Booster heater element degraded — 8-minute recovery time', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Dishwasher heat recovery exchanger fouled with scale', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Conveyor dishwasher idle mode consuming full rated power', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Pot wash station water heater cycling inefficiently', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Glasswasher heater element partially failed — slow heat', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Dishwasher not entering standby mode between services', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Hot water recirculation pump active during off-hours', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Booster heater thermostat overshooting by 8°C', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Dishwasher exhaust fan running without machine active', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Wash tank heater scale buildup reducing output by 20%', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Conveyor speed too slow — extended energy per rack', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Undercounter unit heater relay stuck in on position', severity: 'medium', date: 'Jan 9' },
          { category: 'Waste', issue: 'Chemical dispenser pump dosing 15% above recommended rate', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Detergent concentrate waste from leaking pump tube', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Rinse aid container disposal not following waste protocol', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Food particle screen not emptied — contaminating wash water', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Sanitizer concentration above required level — chemical waste', severity: 'low', date: 'Jan 25' },
          { category: 'Waste', issue: 'Dish rack breakage rate 3x normal — replacement waste', severity: 'low', date: 'Jan 21' },
          { category: 'Waste', issue: 'Single-use plastic wraps entering dish line — contamination', severity: 'low', date: 'Jan 16' },
          { category: 'Waste', issue: 'Wash tank drain strainer bypassed — food waste to sewer', severity: 'medium', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Natural gas booster heater showing incomplete combustion', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Dishwasher energy per rack above carbon budget allocation', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Water heating carbon intensity rising with scale buildup', severity: 'medium', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Extended rinse cycles increasing carbon footprint per cover', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Chemical transport carbon cost up — delivery frequency doubled', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Steam losses from dishwasher contributing to HVAC carbon load', severity: 'low', date: 'Jan 10' }
        ]},

        // --- 4. Gas & Cooking Equipment: 38 incidents ---
        { name: 'Gas & Cooking Equipment', location: 'Kitchen / Cooking Line', employees: '—', incidents: 38, change: '+22%', changeDir: 'up', status: 'warning', spark: [4, 10, 15, 20, 22], alerts: [
          { category: 'Energy', issue: 'Convection oven door seal degraded — significant heat escape', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Griddle thermostat overshooting set point by 15°C', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Gas range pilot lights consuming fuel when equipment off', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Combi oven preheating 45 minutes before service start time', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Fryer #3 not reaching 180°C — heating element weak', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Salamander broiler left running between lunch and dinner', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Gas tilting skillet burner flame yellow — poor air mixture', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Range hood heat recovery bypass valve stuck in open position', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Oven cavity insulation degraded on unit #3 — hot exterior', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Gas burner BTU output below rated — extending cook times', severity: 'low', date: 'Jan 25' },
          { category: 'Energy', issue: 'Wok range pilot lights consuming 8% of total gas usage', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Warming drawer maintaining 30°C above required hold temp', severity: 'low', date: 'Jan 16' },
          { category: 'Energy', issue: 'Double-deck oven bottom burner cycling irregularly', severity: 'low', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Charbroiler CO reading elevated at 35 ppm during peak', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Gas range combustion efficiency at 78% — target is 85%', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Fryer flue gas analysis showing incomplete combustion', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Oven burner producing visible yellow flame — carbon concern', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Combi oven steam vent releasing unburned hydrocarbons', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Gas supply regulator fluctuating — uneven combustion', severity: 'medium', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Wok range updraft capturing only 80% of combustion gases', severity: 'medium', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Carbon intensity per meal served up 6% this quarter', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Griddle surface carbon residue indicating combustion issues', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Salamander ceramic element producing CO at each ignition', severity: 'low', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Gas pilot flame quality deteriorating across all stations', severity: 'medium', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Cooking line carbon footprint exceeding departmental target', severity: 'high', date: 'Jan 6' },
          { category: 'Waste', issue: 'Fryer oil degradation accelerated by burner hot spot', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Oven malfunction ruined batch — 14 kg prepared food wasted', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Griddle uneven heating causing product inconsistency waste', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Combi oven probe failure — batch overcooked and discarded', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Charbroiler grate warped — food falling into fire box', severity: 'low', date: 'Jan 24' },
          { category: 'Waste', issue: 'Range burner failure mid-service — menu items wasted', severity: 'high', date: 'Jan 19' },
          { category: 'Waste', issue: 'Tilt skillet scorching on bottom — ongoing product loss', severity: 'medium', date: 'Jan 13' },
          { category: 'Waste', issue: 'Fryer filtration system not cycling — shortened oil life', severity: 'low', date: 'Jan 7' },
          { category: 'Water', issue: 'Combi oven steam generator descale overdue by 2 weeks', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Pasta cooker water usage 30% above benchmark volume', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Steam kettle blowdown frequency excessive — water waste', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Combi oven drain line partially blocked with limescale', severity: 'medium', date: 'Jan 15' },
          { category: 'Water', issue: 'Gas equipment fire suppression system pressure below spec', severity: 'high', date: 'Jan 8' }
        ]},

        // --- 5. Building HVAC Network: 35 incidents ---
        { name: 'Building HVAC Network', location: 'Building-wide', employees: '—', incidents: 35, change: '-5%', changeDir: 'down', status: 'neutral', spark: [8, 6, 4, 2, -5], alerts: [
          { category: 'Energy', issue: 'Chiller COP dropped to 3.8 — seasonal target is 5.2', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'AHU-1 supply fan VFD fault — running at fixed speed only', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'VAV box actuator stuck open on floor 4 east wing', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Cooling tower approach temperature rising above design', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Condenser water pump seal leaking — increased pump runtime', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'BMS night setback schedule not engaging on weekends', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'AHU-2 economizer damper stuck at 30% open position', severity: 'low', date: 'Feb 1' },
          { category: 'Energy', issue: 'Heat pump defrost cycle consuming excess energy per event', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Chiller condenser tubes fouled — elevated head pressure', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Lobby AHU return air damper leaking outside air in', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Boiler plant lead-lag sequencing not optimizing properly', severity: 'medium', date: 'Jan 23' },
          { category: 'Energy', issue: 'Rooftop unit compressor staging sequence incorrect', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Duct leakage test shows 18% loss on floor 3 supply', severity: 'medium', date: 'Jan 16' },
          { category: 'Energy', issue: 'VFD on cooling tower fan producing harmonic distortion', severity: 'low', date: 'Jan 11' },
          { category: 'Carbon', issue: 'R-410A refrigerant level low in chiller — leak suspected', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Boiler stack CO₂ emissions above seasonal baseline target', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'HVAC system carbon intensity per sq meter increasing', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Cooling tower chemical treatment carbon cost trending up', severity: 'low', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Chiller refrigerant charge requiring top-up — GWP impact', severity: 'high', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Building energy carbon factor worse than local grid average', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Heating plant natural gas consumption up 12% year-on-year', severity: 'medium', date: 'Jan 21' },
          { category: 'Carbon', issue: 'AHU filter resistance increasing overall HVAC carbon load', severity: 'low', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Rooftop unit refrigerant showing slow pressure decay', severity: 'medium', date: 'Jan 12' },
          { category: 'Carbon', issue: 'HVAC contributing 45% of building carbon — target is 38%', severity: 'high', date: 'Jan 7' },
          { category: 'Water', issue: 'Cooling tower blowdown water exceeding cycle targets', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Chiller condenser water treatment chemical overdose event', severity: 'low', date: 'Feb 1' },
          { category: 'Water', issue: 'Humidifier consuming 25% more water than winter baseline', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Cooling tower drift eliminator degraded — water loss visible', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Condensate recovery from AHU cooling coils not captured', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Steam system trap failure — water and energy loss combined', severity: 'high', date: 'Jan 9' },
          { category: 'Waste', issue: 'AHU filter replacement generating excess landfill waste', severity: 'low', date: 'Feb 3' },
          { category: 'Waste', issue: 'Chiller oil disposal not following hazardous waste protocol', severity: 'medium', date: 'Jan 29' },
          { category: 'Waste', issue: 'Cooling tower chemical containers accumulating on-site', severity: 'low', date: 'Jan 24' },
          { category: 'Waste', issue: 'Refrigerant reclaim cylinders not returned for reuse cycle', severity: 'low', date: 'Jan 18' },
          { category: 'Waste', issue: 'HVAC maintenance parts packaging waste volume increasing', severity: 'low', date: 'Jan 10' }
        ]},

        // --- 6. Water & Plumbing Systems: 30 incidents ---
        { name: 'Water & Plumbing Systems', location: 'Building-wide', employees: '—', incidents: 30, change: '-12%', changeDir: 'down', status: 'good', spark: [15, 10, 5, 0, -12], alerts: [
          { category: 'Water', issue: 'Hot water recirculation pump running 24/7 — should be scheduled', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Guest floor 6 water meter showing anomaly — possible leak', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Pool backwash cycle extended 40% beyond optimal duration', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Irrigation system zone C sprinklers running during rainfall', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Water softener brine tank overflowing at regeneration', severity: 'high', date: 'Feb 3' },
          { category: 'Water', issue: 'Basement pipe insulation degraded — condensation dripping', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Main water meter reading 15% above expected monthly baseline', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Fire system test discharge water going straight to drain', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Cooling tower make-up water exceeding calculated intake rate', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Guest room low-flow retrofit incomplete on floors 2-3', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Kitchen pot wash faucet dripping continuously after closing', severity: 'low', date: 'Jan 25' },
          { category: 'Water', issue: 'Laundry water reuse system bypass valve stuck in open', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Pool chemical feeder overdosing — excess dilution water used', severity: 'low', date: 'Jan 19' },
          { category: 'Water', issue: 'Loading dock hose bib left running after wash-down shift', severity: 'medium', date: 'Jan 15' },
          { category: 'Water', issue: 'Spa overflow drain running continuously during off-hours', severity: 'medium', date: 'Jan 11' },
          { category: 'Energy', issue: 'Hot water heater cycling excessively due to scale buildup', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Water booster pump energy consumption trending upward', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Pool heater gas consumption above seasonal energy model', severity: 'low', date: 'Feb 1' },
          { category: 'Energy', issue: 'Domestic hot water set point 5°C above code minimum', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Recirculation pump running constant speed — VFD not installed', severity: 'medium', date: 'Jan 24' },
          { category: 'Energy', issue: 'Water heating energy per guest night increasing monthly', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Pool pump oversized for current filtration load demand', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Hot water pipe heat losses from degraded insulation wraps', severity: 'medium', date: 'Jan 8' },
          { category: 'Waste', issue: 'Water treatment chemical containers not being recycled', severity: 'low', date: 'Feb 4' },
          { category: 'Waste', issue: 'Pool filter backwash water volume excessive — media waste', severity: 'medium', date: 'Jan 30' },
          { category: 'Waste', issue: 'Water softener salt delivery packaging creating waste', severity: 'low', date: 'Jan 23' },
          { category: 'Waste', issue: 'Plumbing fixture replacement rate increasing — waste issue', severity: 'low', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Water heating natural gas consumption rising above target', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Embedded carbon in municipal water supply increasing', severity: 'low', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Pool heating carbon intensity above property-level target', severity: 'medium', date: 'Jan 12' }
        ]}
      ]
    },

    // -------------------------------------------------------
    // GUEST ROOMS (sum = 16)
    // 7 + 4 + 3 + 2 = 16
    // -------------------------------------------------------
    'Guest Rooms': {
      sites: [
        // --- In-Room HVAC Units: 7 incidents ---
        { name: 'In-Room HVAC Units', location: 'Floors 2-8', employees: '—', incidents: 7, change: '+12%', changeDir: 'up', status: 'warning', spark: [-2, 3, 5, 8, 12], alerts: [
          { category: 'Energy', issue: 'Room 412 thermostat override running AC at 16°C continuously', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Floor 5 fan coil units cycling every 3 minutes — short cycle', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Room 308 PTAC compressor running in unoccupied room', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Floor 3 HVAC refrigerant pressure low — leak suspected', severity: 'high', date: 'Jan 30' },
          { category: 'Energy', issue: 'Room 615 window unit set point conflicting with BMS', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Floor 7 corridor FCU filter differential pressure high', severity: 'low', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Suite 801 split system showing refrigerant subcooling drop', severity: 'medium', date: 'Jan 22' }
        ]},

        // --- Bathroom Plumbing: 4 incidents ---
        { name: 'Bathroom Plumbing', location: 'Floors 2-8', employees: '—', incidents: 4, change: '+5%', changeDir: 'up', status: 'neutral', spark: [0, 2, 3, 4, 5], alerts: [
          { category: 'Water', issue: 'Room 504 toilet flapper valve running continuously', severity: 'high', date: 'Feb 5' },
          { category: 'Water', issue: 'Floor 6 supply riser pressure anomaly — concealed leak possible', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Room 217 faucet aerator flow rate above 5 LPM limit', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Room 410 shower diverter dripping when in off position', severity: 'medium', date: 'Jan 20' }
        ]},

        // --- Mini-Bar Refrigerators: 3 incidents ---
        { name: 'Mini-Bar Refrigerators', location: 'Floors 3-6', employees: '—', incidents: 3, change: '-8%', changeDir: 'down', status: 'good', spark: [5, 3, 1, -3, -8], alerts: [
          { category: 'Energy', issue: 'Rooms 301-312 mini-bar units running 5°C below set point', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Room 605 mini-bar compressor cycling abnormally every 2 min', severity: 'low', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Floor 4 mini-bar refrigerant type flagged for GWP review', severity: 'low', date: 'Jan 18' }
        ]},

        // --- Room Lighting & Electrical: 2 incidents ---
        { name: 'Room Lighting & Electrical', location: 'Floors 2-8', employees: '—', incidents: 2, change: '-15%', changeDir: 'down', status: 'good', spark: [10, 5, 0, -8, -15], alerts: [
          { category: 'Energy', issue: 'Floor 3 hallway occupancy sensors not triggering — lights always on', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Room 712 bathroom exhaust fan running continuously 24/7', severity: 'low', date: 'Jan 26' }
        ]}
      ]
    },

    // -------------------------------------------------------
    // CONFERENCE CENTER (sum = 5)
    // 2 + 2 + 1 = 5
    // -------------------------------------------------------
    'Conference Center': {
      sites: [
        // --- AV & Projection Systems: 2 incidents ---
        { name: 'AV & Projection Systems', location: 'Ground Floor', employees: '—', incidents: 2, change: '-20%', changeDir: 'down', status: 'good', spark: [10, 5, -3, -8, -20], alerts: [
          { category: 'Energy', issue: 'Ballroom projector array on standby 18 hrs/day — no auto-off', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Meeting room B speaker amplifier drawing power when unused', severity: 'low', date: 'Jan 29' }
        ]},

        // --- Ballroom Climate Control: 2 incidents ---
        { name: 'Ballroom Climate Control', location: 'Ground Floor', employees: '—', incidents: 2, change: '-15%', changeDir: 'down', status: 'good', spark: [8, 3, 0, -8, -15], alerts: [
          { category: 'Energy', issue: 'Ballroom pre-cooling started 3 hours early for evening event', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Ballroom AHU at full speed for 60-person event in 500-seat space', severity: 'low', date: 'Jan 25' }
        ]},

        // --- Meeting Room Lighting: 1 incident ---
        { name: 'Meeting Room Lighting', location: 'Ground Floor', employees: '—', incidents: 1, change: '-30%', changeDir: 'down', status: 'good', spark: [20, 10, 0, -15, -30], alerts: [
          { category: 'Energy', issue: 'Meeting room D lights left on overnight — cleaning schedule conflict', severity: 'low', date: 'Feb 1' }
        ]}
      ]
    },

    // -------------------------------------------------------
    // KITCHEN & DINING (sum = 203)
    // 55 + 48 + 40 + 35 + 25 = 203
    // -------------------------------------------------------
    'Kitchen & Dining': {
      sites: [
        // --- 1. Grease Trap & Exhaust Hood: 55 incidents ---
        { name: 'Grease Trap & Exhaust Hood', location: 'Main Kitchen', employees: '—', incidents: 55, change: '+20%', changeDir: 'up', status: 'warning', spark: [3, 8, 14, 18, 20], alerts: [
          { category: 'Energy', issue: 'Exhaust hood fan #1 drawing 22A — rated for 18A max', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Kitchen hood energy usage 25% over weekly baseline', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Make-up air unit not modulating with hood demand signal', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Exhaust fan VFD bypass engaged — running at full speed', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Hood lighting circuit fault — emergency backup lights active', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Rooftop exhaust motor bearing failure causing excess draw', severity: 'high', date: 'Feb 5' },
          { category: 'Energy', issue: 'Supply air tempering coil energized during mild outdoor temps', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Demand-control ventilation sensor calibration drift detected', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Exhaust system not entering reduced mode after dinner service', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Hood activation sensor triggering during deep clean — waste', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Make-up air gas burner ignition failure — multiple retries', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Rooftop exhaust unit #2 fan belt worn — slipping under load', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Ventilation pre-heat cycle running 30 minutes too early', severity: 'low', date: 'Jan 31' },
          { category: 'Energy', issue: 'Kitchen exhaust override switch left in manual position', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Hood fan contactor chattering — increased cycling energy', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Full exhaust capacity for half-kitchen breakfast service', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Make-up air damper actuator sluggish — overcooling kitchen', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Rooftop exhaust unit power factor dropped below 0.85', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Grease-laden emissions from charbroiler exceeding air limits', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Kitchen stack opacity test approaching regulatory threshold', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Activated carbon filter end-of-life — pollutants breaking through', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Hood capture efficiency dropped to 82% — spec requires 95%', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Wok station smoke escaping hood capture zone at peak', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Charbroiler CO emissions elevated during dinner service', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Flue gas analyzer reading high on south exhaust riser', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Kitchen emissions contributing to local ambient air alert', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Rooftop exhaust plume visible — grease carryover detected', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Pollution control unit catalyst degraded below threshold', severity: 'medium', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Carbon intensity per cover above target 3 weeks running', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Kitchen exhaust odor complaints from adjacent building', severity: 'low', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Electrostatic precipitator efficiency down to 72%', severity: 'medium', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Grease vapor escape contributing to rooftop buildup deposit', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Kitchen carbon budget 90% consumed with 40% of Q1 remaining', severity: 'high', date: 'Jan 8' },
          { category: 'Waste', issue: 'Grease trap at 82% capacity — pump-out needed within 48 hrs', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Grease filter #2 saturated beyond cleaning threshold', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Exhaust duct accumulation test shows 40μm — cleaning due', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Grease interceptor FOG levels above discharge permit limit', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Used filter disposal bin overflowing at loading dock', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Grease hauler invoice frequency up 40% — volume increasing', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Duct cleaning postponed — grease at fire code limit', severity: 'high', date: 'Jan 28' },
          { category: 'Waste', issue: 'Grease filter auto-wash system nozzle clogged on line 2', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Hood baffle misalignment allowing grease bypass to duct', severity: 'low', date: 'Jan 22' },
          { category: 'Waste', issue: 'Grease recovery system output contaminated — not reusable', severity: 'medium', date: 'Jan 18' },
          { category: 'Waste', issue: 'Duct cleaning chemical residue above disposal limits', severity: 'low', date: 'Jan 14' },
          { category: 'Waste', issue: 'Grease trap lid not sealed — odor and waste leaking out', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Disposable pre-filter usage rate doubled versus last month', severity: 'low', date: 'Jan 6' },
          { category: 'Water', issue: 'Fire suppression system pressure reading below minimum', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Grease trap water seal evaporating — sewer gas risk', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Hood wash-down using 340L per session — target is 200L', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Exhaust duct condensation causing ceiling stain in dining room', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Wet scrubber recirculation water quality below standard', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Fire suppression test waste water not properly contained', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Grease trap effluent pH outside permitted discharge range', severity: 'medium', date: 'Jan 20' },
          { category: 'Water', issue: 'Condensation from exhaust duct corroding roof flashing', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Hood wash-down hose left dripping after evening cleaning', severity: 'low', date: 'Jan 9' }
        ]},

        // --- 2. Walk-in Cooler & Freezer: 48 incidents ---
        { name: 'Walk-in Cooler & Freezer', location: 'Kitchen Basement', employees: '—', incidents: 48, change: '+15%', changeDir: 'up', status: 'warning', spark: [2, 6, 10, 13, 15], alerts: [
          { category: 'Energy', issue: 'Walk-in cooler compressor runtime increased 25% this week', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Freezer evaporator fan motor drawing high amperage on startup', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'Cooler condenser coils overdue for cleaning — high head pressure', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Walk-in door heater strip energized continuously', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Reach-in cooler door left open — compressor running nonstop', severity: 'high', date: 'Feb 5' },
          { category: 'Energy', issue: 'Freezer anti-sweat heater consuming energy during low humidity', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Walk-in cooler interior light switch stuck in on position', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Refrigeration rack suction pressure low — compressor overwork', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Freezer compressor short-cycling — potential refrigerant overcharge', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Walk-in strip curtain damaged — significant cold air loss', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Cooler evaporator defrost heater element resistance high', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Condenser fan motor intermittent — causing compressor stress', severity: 'medium', date: 'Jan 27' },
          { category: 'Energy', issue: 'Walk-in ECM fan replaced with standard motor — energy increase', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'Freezer compressor oil carryover reducing heat transfer', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Under-counter prep cooler compressor running excessively hot', severity: 'medium', date: 'Jan 17' },
          { category: 'Energy', issue: 'Walk-in insulated panel joint leaking cold air — energy waste', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Walk-in cooler R-404A pressure below normal — leak check needed', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Freezer refrigerant charge declining — GWP impact increasing', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Reach-in unit compressor shaft seal suspect — oil stain visible', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Refrigerant leak detector triggered in walk-in mechanical area', severity: 'high', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Cooler suction line frost pattern abnormal — charge issue', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GWP report: refrigerant top-ups exceeding annual budget', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Walk-in requires 2 kg R-404A top-up — 3,922 kg CO₂e impact', severity: 'high', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Freezer high-side pressure trending down over 4 weeks', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Refrigerant reclaim required before planned compressor work', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Condenser approach temp suggests low refrigerant charge', severity: 'medium', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Cooler service history: 4 refrigerant adds in past 6 months', severity: 'medium', date: 'Jan 14' },
          { category: 'Carbon', issue: 'HFC phase-down compliance at risk — replacement planning due', severity: 'high', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Walk-in cooler circuit showing subcooling drop at condenser', severity: 'medium', date: 'Jan 6' },
          { category: 'Water', issue: 'Walk-in cooler condensate drain backing up behind unit', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Freezer defrost water flooding walk-in floor area', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Reach-in unit condensate pan overflowing to kitchen floor', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Cooler defrost cycle producing excess water — drain undersized', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Walk-in floor drain emitting odor near cooler compressor area', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Ice machine sharing drain with cooler — capacity exceeded', severity: 'medium', date: 'Jan 23' },
          { category: 'Water', issue: 'Freezer condensate line frozen at exterior wall penetration', severity: 'high', date: 'Jan 19' },
          { category: 'Water', issue: 'Walk-in humidity above spec — condensation forming on product', severity: 'medium', date: 'Jan 14' },
          { category: 'Water', issue: 'Evaporator drain pan corrosion causing drip onto stored goods', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Condensate pump float switch stuck — water backup imminent', severity: 'medium', date: 'Jan 5' },
          { category: 'Waste', issue: 'Walk-in cooler door gasket tear — temperature excursion risk', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Freezer alarm: -12°C sustained 45 min — $3.2K product at risk', severity: 'high', date: 'Feb 4' },
          { category: 'Waste', issue: 'Walk-in shelving unit unstable — product damage and fall risk', severity: 'medium', date: 'Feb 2' },
          { category: 'Waste', issue: 'Cooler temperature logging gap — food safety compliance risk', severity: 'medium', date: 'Jan 29' },
          { category: 'Waste', issue: 'Freezer defrost cycle too aggressive — partial thaw of goods', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Product rotation failure — $800 worth of expired items found', severity: 'high', date: 'Jan 20' },
          { category: 'Waste', issue: 'Cooler organization audit failed — cross-contamination risk', severity: 'medium', date: 'Jan 15' },
          { category: 'Waste', issue: 'Walk-in freezer door closer spring broken — frequent alarms', severity: 'low', date: 'Jan 10' },
          { category: 'Waste', issue: 'Reach-in cooler compressor failure — emergency product relocation', severity: 'high', date: 'Jan 6' }
        ]},

        // --- 3. Commercial Dishwasher Line: 40 incidents ---
        { name: 'Commercial Dishwasher Line', location: 'Stewarding Area', employees: '—', incidents: 40, change: '+10%', changeDir: 'up', status: 'warning', spark: [1, 4, 7, 9, 10], alerts: [
          { category: 'Water', issue: 'Final rinse temperature at 78°C — below 82°C sanitization min', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Pre-rinse spray valve exceeding 6.5 LPM flow target', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Dishwasher #1 using 28% more water per rack than rated', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Rinse water heat recovery bypass valve open — water wasted', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Conveyor dishwasher curtain torn — water spraying to floor', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Pot sink faucet aerator missing — running at full flow rate', severity: 'low', date: 'Feb 3' },
          { category: 'Water', issue: 'Glasswasher fill valve not shutting off fully between cycles', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Water softener regenerating twice per day — excessive frequency', severity: 'low', date: 'Feb 1' },
          { category: 'Water', issue: 'Dishwasher drain valve leaking between wash cycles', severity: 'medium', date: 'Jan 30' },
          { category: 'Water', issue: 'Pre-soak basin overflow during peak lunch service rush', severity: 'high', date: 'Jan 28' },
          { category: 'Water', issue: 'Hot water supply to dishwasher fluctuating by 10°C', severity: 'medium', date: 'Jan 25' },
          { category: 'Water', issue: 'Rinse aid overdose requiring extra water to clear residue', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Conveyor trough water level sensor fault — tank overfilling', severity: 'medium', date: 'Jan 18' },
          { category: 'Energy', issue: 'Booster heater recovery time extended to 8 min — target 4 min', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Dishwasher heat exchanger fouled with mineral scale', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Conveyor dishwasher in active mode during 3-hour service gap', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Pot wash heater cycling every 90 seconds — control fault', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Glasswasher heater element partially failed — slow heat-up', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Dishwasher not entering standby between lunch and dinner', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Hot water recirculation pump running during closed hours', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Booster heater thermostat overshooting to 93°C regularly', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Dishwasher exhaust fan running without machine being active', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Wash tank heater scale reducing thermal output by 20%', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Conveyor speed inconsistent — energy per rack varying 35%', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Undercounter unit heater relay stuck in on position', severity: 'medium', date: 'Jan 9' },
          { category: 'Waste', issue: 'Detergent pump over-dosing by 15% — chemical waste generated', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Rinse aid concentrate leaking from cracked supply tube', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Food particle screen #2 clogged — contaminating wash water', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Chemical container disposal not following waste stream rules', severity: 'low', date: 'Jan 28' },
          { category: 'Waste', issue: 'Sanitizer concentration 40% above minimum — excess chemicals', severity: 'low', date: 'Jan 24' },
          { category: 'Waste', issue: 'Dish rack breakage rate 3x normal — replacement waste high', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Single-use items entering machine — downstream contamination', severity: 'low', date: 'Jan 15' },
          { category: 'Waste', issue: 'Wash tank strainer bypassed — food solids going to sewer', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Detergent drum not fully emptied before disposal — waste', severity: 'low', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Gas booster heater combustion check overdue — compliance risk', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Dishwasher energy per rack at 1.8 kWh — target is 1.2 kWh', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Water heating carbon contribution rising with descale need', severity: 'medium', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Extended wash cycles increasing carbon footprint per cover', severity: 'low', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Chemical transport carbon cost up — delivery frequency doubled', severity: 'low', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Steam losses from dishwasher adding to kitchen HVAC load', severity: 'low', date: 'Jan 10' }
        ]},

        // --- 4. Gas Range & Oven Bank: 35 incidents ---
        { name: 'Gas Range & Oven Bank', location: 'Cooking Line', employees: '—', incidents: 35, change: '+18%', changeDir: 'up', status: 'warning', spark: [3, 7, 12, 16, 18], alerts: [
          { category: 'Energy', issue: 'Convection oven #2 door seal letting heat escape to kitchen', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Griddle surface temperature 18°C above set point', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Six pilot lights burning overnight — 28 kWh/day wasted', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Combi oven starts preheating at 5:00 AM — service at 6:30', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Fryer #3 not reaching 180°C — element degraded', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Salamander left on between lunch and dinner service periods', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Tilt skillet gas valve not fully closing when switched off', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Range top burner flame pattern uneven — poor heat transfer', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Oven #1 insulation compressed — exterior surface hot', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Gas supply pressure low — all equipment running extended times', severity: 'high', date: 'Jan 22' },
          { category: 'Energy', issue: 'Wok range burner orifice partially blocked with debris', severity: 'low', date: 'Jan 18' },
          { category: 'Energy', issue: 'Holding cabinet maintaining 75°C — set point is 63°C', severity: 'low', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Charbroiler CO reading at 35 ppm — limit is 25 ppm', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Gas range combustion efficiency test: 76% (target 85%)', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Fryer exhaust showing incomplete combustion byproducts', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Oven #3 flame yellow and lazy — air shutter needs adjustment', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Combi oven steam vent releasing trace hydrocarbons', severity: 'medium', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Gas manifold pressure regulator hunting — uneven combustion', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Wok updraft hood capturing only 78% of combustion gases', severity: 'medium', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Carbon cost per meal served up 8% versus last month', severity: 'medium', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Griddle producing visible smoke at idle — surface carbon buildup', severity: 'low', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Salamander ceramic element producing trace CO at ignition', severity: 'low', date: 'Jan 10' },
          { category: 'Waste', issue: 'Fryer oil degradation rate doubled — suspected burner hot spot', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Oven temperature spike ruined 22 kg prepared protein batch', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Griddle cold spot causing inconsistent product — waste result', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Combi oven probe failure — entire batch overcooked and disposed', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Charbroiler grate warped — food falling into fire box', severity: 'low', date: 'Jan 23' },
          { category: 'Waste', issue: 'Range burner failure mid-service — prepared menu items wasted', severity: 'high', date: 'Jan 18' },
          { category: 'Waste', issue: 'Tilt skillet scorching on bottom — product loss each use', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Fryer filtration system not cycling — shortened oil lifespan', severity: 'low', date: 'Jan 7' },
          { category: 'Water', issue: 'Combi oven steam generator showing heavy scale deposits', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Pasta cooker water usage 30% above benchmark consumption', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Steam kettle blowdown valve dripping — constant water loss', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Combi oven drain line partially blocked with limescale', severity: 'medium', date: 'Jan 15' },
          { category: 'Water', issue: 'Gas equipment fire suppression system pressure reading low', severity: 'high', date: 'Jan 8' }
        ]},

        // --- 5. Food Waste Compactor: 25 incidents ---
        { name: 'Food Waste Compactor', location: 'Loading Dock', employees: '—', incidents: 25, change: '+25%', changeDir: 'up', status: 'warning', spark: [5, 10, 15, 20, 25], alerts: [
          { category: 'Waste', issue: 'Compactor ram jammed — food waste backing up at loading dock', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Organic diversion rate dropped to 52% — target is 70%', severity: 'high', date: 'Feb 6' },
          { category: 'Waste', issue: 'Contamination in compost stream: plastics found in bin', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Food waste bin #3 overflowing before scheduled pickup', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Pre-consumer waste audit shows 14% plate waste — target 8%', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Compactor bag tearing — leachate pooling on dock floor', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Kitchen trim waste not separated for stock production use', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Banquet overproduction: 45 kg food waste from Saturday event', severity: 'high', date: 'Feb 1' },
          { category: 'Waste', issue: 'Buffet line food waste up 30% compared to à la carte service', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Prep waste bins not sorted — compostable mixed with general', severity: 'low', date: 'Jan 29' },
          { category: 'Waste', issue: 'Food donation program pickup missed — 30 kg had to be disposed', severity: 'medium', date: 'Jan 26' },
          { category: 'Waste', issue: 'Compactor odor complaints from receiving area staff', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Compactor motor cycling frequently — undersized for volume', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Waste cooler running continuously due to door seal gap', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Compactor hydraulic system running hot — oil viscosity low', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Loading dock exhaust fan running 24/7 due to odor issues', severity: 'low', date: 'Jan 27' },
          { category: 'Energy', issue: 'Waste processing area lighting on failed motion sensor', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Compactor control panel in manual override — no auto-cycle', severity: 'medium', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Organic waste to landfill generating est. 120 kg CO₂e/week', severity: 'high', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Waste hauler making 3 extra trips this month versus plan', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Compactor diesel backup power used during outage event', severity: 'low', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Anaerobic conditions in waste bin creating methane emissions', severity: 'medium', date: 'Jan 14' },
          { category: 'Water', issue: 'Compactor wash-down water running to storm drain untreated', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'Leachate from food waste contaminating loading dock drain', severity: 'high', date: 'Jan 25' },
          { category: 'Water', issue: 'Waste bin cleaning water usage not metered or tracked', severity: 'low', date: 'Jan 16' }
        ]}
      ]
    },

    // -------------------------------------------------------
    // LOBBY & COMMON (sum = 1)
    // 1 + 0 + 0 = 1
    // -------------------------------------------------------
    'Lobby & Common': {
      sites: [
        // --- Revolving Door Motor: 1 incident ---
        { name: 'Revolving Door Motor', location: 'Main Entrance', employees: '—', incidents: 1, change: '-40%', changeDir: 'down', status: 'good', spark: [30, 15, 5, -20, -40], alerts: [
          { category: 'Energy', issue: 'Revolving door motor efficiency degraded — drawing 40% above rated', severity: 'low', date: 'Jan 28' }
        ]},

        // --- Atrium Chandelier: 0 incidents ---
        { name: 'Atrium Chandelier', location: 'Lobby Atrium', employees: '—', incidents: 0, change: '-5%', changeDir: 'down', status: 'good', spark: [3, 2, 0, -2, -5], alerts: []},

        // --- Decorative Water Feature: 0 incidents ---
        { name: 'Decorative Water Feature', location: 'Lobby Atrium', employees: '—', incidents: 0, change: '0%', changeDir: 'neutral', status: 'good', spark: [0, 0, 1, 0, 0], alerts: []}
      ]
    },

    // -------------------------------------------------------
    // BACK OF HOUSE (sum = 13)
    // 5 + 4 + 3 + 1 = 13
    // -------------------------------------------------------
    'Back of House': {
      sites: [
        // --- Laundry Equipment: 5 incidents ---
        { name: 'Laundry Equipment', location: 'Basement', employees: '—', incidents: 5, change: '+8%', changeDir: 'up', status: 'warning', spark: [1, 3, 5, 7, 8], alerts: [
          { category: 'Energy', issue: 'Industrial dryer #2 exhaust temperature high — vent blockage suspected', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Commercial washer #1 using 18% more water per cycle than rated', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Ironer press steam trap failed — energy and steam loss', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Lint trap accumulation at fire hazard level — cleaning overdue', severity: 'high', date: 'Jan 28' },
          { category: 'Water', issue: 'Laundry water reuse system offline — using fresh water only', severity: 'medium', date: 'Jan 24' }
        ]},

        // --- Boiler & Hot Water System: 4 incidents ---
        { name: 'Boiler & Hot Water System', location: 'Basement', employees: '—', incidents: 4, change: '+3%', changeDir: 'up', status: 'neutral', spark: [0, 1, 2, 2, 3], alerts: [
          { category: 'Energy', issue: 'Boiler #1 combustion efficiency at 82% — annual tuning overdue', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Boiler stack CO₂ readings 12% above last calibration baseline', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'Hot water storage tank T&P valve weeping intermittently', severity: 'medium', date: 'Jan 27' },
          { category: 'Energy', issue: 'Boiler #2 cycling on/off every 4 minutes — short-cycling', severity: 'low', date: 'Jan 19' }
        ]},

        // --- Elevator Machinery: 3 incidents ---
        { name: 'Elevator Machinery', location: 'Shaft / Basement', employees: '—', incidents: 3, change: '-10%', changeDir: 'down', status: 'good', spark: [8, 4, 0, -5, -10], alerts: [
          { category: 'Energy', issue: 'Elevator #1 regenerative drive not returning energy to grid', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'Elevator #2 standby power consumption 40% above spec', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Elevator hydraulic fluid disposal overdue — storage drum full', severity: 'low', date: 'Jan 22' }
        ]},

        // --- Emergency Generator: 1 incident ---
        { name: 'Emergency Generator', location: 'Basement', employees: '—', incidents: 1, change: '0%', changeDir: 'neutral', status: 'neutral', spark: [1, -1, 1, -1, 0], alerts: [
          { category: 'Carbon', issue: 'Monthly generator test produced 45 kg CO₂ — run time exceeded', severity: 'low', date: 'Feb 2' }
        ]}
      ]
    }
  }
};
