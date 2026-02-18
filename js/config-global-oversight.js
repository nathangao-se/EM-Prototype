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
    image: 'images/world.svg',
    imageAlt: 'World map',
    regions: [
      { label: 'Europe', siteCount: '141', chipText: '102', status: 'blue', targetHierarchy: 'Europe', position: { x: 51, y: 24.3 },
        subVisualization: {
          image: 'images/Europe.svg',
          imageAlt: 'Europe regional map',
          regions: [
            { label: 'France', siteCount: '2', chipText: '95', status: 'warning', targetHierarchy: 'France', position: { x: 44, y: 58 } },
            { label: 'United Kingdom', siteCount: '1', chipText: '3', status: 'blue', targetHierarchy: 'United Kingdom', position: { x: 38, y: 40 } },
            { label: 'Germany', siteCount: '1', chipText: '3', status: 'blue', targetHierarchy: 'Germany', position: { x: 54, y: 42 } },
            { label: 'Netherlands', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Netherlands', position: { x: 44, y: 36 } },
            { label: 'Spain', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Spain', position: { x: 36, y: 74 } }
          ]
        }
      },
      { label: 'North America', siteCount: '192', chipText: '149', status: 'warning', targetHierarchy: 'North America', position: { x: 25, y: 30.2 },
        subVisualization: {
          image: 'images/North America.svg',
          imageAlt: 'North America regional map',
          regions: [
            { label: 'United States', siteCount: '5', chipText: '149', status: 'warning', targetHierarchy: 'United States', position: { x: 45, y: 48 } },
            { label: 'Canada', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Canada', position: { x: 60, y: 30 } }
          ]
        }
      },
      { label: 'South America', siteCount: '203', chipText: '207', status: 'blue', targetHierarchy: 'South America', position: { x: 33.3, y: 66.2 },
        subVisualization: {
          image: 'images/South America.svg',
          imageAlt: 'South America regional map',
          regions: [
            { label: 'Brazil', siteCount: '2', chipText: '195', status: 'warning', targetHierarchy: 'Brazil', position: { x: 65, y: 48 } },
            { label: 'Argentina', siteCount: '1', chipText: '10', status: 'warning', targetHierarchy: 'Argentina', position: { x: 50, y: 70 } },
            { label: 'Chile', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Chile', position: { x: 32, y: 68 } },
            { label: 'Peru', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Peru', position: { x: 30, y: 30 } }
          ]
        }
      },
      { label: 'Asia Pacific', siteCount: '65', chipText: '203', status: 'danger', targetHierarchy: 'Asia Pacific', position: { x: 78, y: 37 },
        subVisualization: {
          image: 'images/Asia Pacific.svg',
          imageAlt: 'Asia Pacific regional map',
          regions: [
            { label: 'China', siteCount: '2', chipText: '181', status: 'danger', targetHierarchy: 'China', position: { x: 47, y: 47 } },
            { label: 'Japan', siteCount: '1', chipText: '13', status: 'warning', targetHierarchy: 'Japan', position: { x: 76, y: 40 } },
            { label: 'Philippines', siteCount: '1', chipText: '5', status: 'blue', targetHierarchy: 'Philippines', position: { x: 66, y: 72 } },
            { label: 'India', siteCount: '1', chipText: '3', status: 'blue', targetHierarchy: 'India', position: { x: 37, y: 67 } },
            { label: 'Thailand', siteCount: '1', chipText: '2', status: 'blue', targetHierarchy: 'Thailand', position: { x: 53, y: 76 } }
          ]
        }
      },
      { label: 'Middle East & Africa', siteCount: '162', chipText: '40', status: 'blue', targetHierarchy: 'Middle East & Africa', position: { x: 55, y: 53.2 },
        subVisualization: {
          image: 'images/Africa/Middle East.svg',
          imageAlt: 'Middle East & Africa regional map',
          regions: [
            { label: 'UAE', siteCount: '1', chipText: '32', status: 'warning', targetHierarchy: 'UAE', position: { x: 78, y: 22 } },
            { label: 'Saudi Arabia', siteCount: '1', chipText: '4', status: 'blue', targetHierarchy: 'Saudi Arabia', position: { x: 68, y: 18 } },
            { label: 'South Africa', siteCount: '2', chipText: '3', status: 'blue', targetHierarchy: 'South Africa', position: { x: 50, y: 75 } },
            { label: 'Qatar', siteCount: '1', chipText: '1', status: 'blue', targetHierarchy: 'Qatar', position: { x: 72, y: 24 } }
          ]
        }
      },
      { label: 'Australia/Oceania', siteCount: '50', chipText: '50', status: 'blue', targetHierarchy: 'Australia/Oceania', position: { x: 85, y: 72.6 },
        subVisualization: {
          image: 'images/Australia/Oceania.svg',
          imageAlt: 'Australia/Oceania regional map',
          regions: [
            { label: 'Australia', siteCount: '4', chipText: '47', status: 'warning', targetHierarchy: 'Australia', position: { x: 80, y: 78 } }
          ]
        }
      }
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
        },
        modalItems: [
          {
            title: 'Supplier data requests',
            description: '3 Scope 3 suppliers have not responded to Q1 data collection forms. Follow-up emails queued for Feb 10.',
            status: 'overdue',
            date: 'Feb 8',
            severity: 'high',
            history: [
              { event: 'Initial data request sent to 8 suppliers', date: 'Jan 10' },
              { event: '5 of 8 suppliers responded', date: 'Jan 25' },
              { event: 'First reminder sent to remaining 3', date: 'Feb 1' },
              { event: 'Second reminder sent — responses still pending', date: 'Feb 6' },
              { event: 'Flagged as overdue — escalation recommended', date: 'Feb 8' }
            ]
          },
          {
            title: 'Monthly energy reconciliation',
            description: 'January meter data across 6 regions needs reconciliation against utility invoices before close.',
            status: 'pending',
            date: 'Feb 8',
            severity: 'medium',
            history: [
              { event: 'Utility invoices received for 4 of 6 regions', date: 'Feb 3' },
              { event: 'Europe and Asia Pacific invoices still outstanding', date: 'Feb 5' },
              { event: 'Reconciliation template distributed to regional leads', date: 'Feb 7' }
            ]
          },
          {
            title: 'Scope 2 market-based recalculation',
            description: 'Updated residual mix factors for EU require Scope 2 market-based totals to be recalculated for Q4 2024.',
            status: 'in-progress',
            date: 'Feb 8',
            severity: 'medium',
            history: [
              { event: 'New EU residual mix factors published by AIB', date: 'Jan 18' },
              { event: 'Recalculation initiated for EU portfolio', date: 'Feb 2' },
              { event: '60% of sites recalculated', date: 'Feb 7' }
            ]
          },
          {
            title: 'Fleet fuel log submission',
            description: 'Regional fleet managers need to submit January fuel consumption logs for Scope 1 mobile combustion.',
            status: 'pending',
            date: 'Feb 8',
            severity: 'low',
            history: [
              { event: 'Fuel log template sent to 6 fleet managers', date: 'Feb 1' },
              { event: '2 of 6 submissions received', date: 'Feb 5' },
              { event: 'Reminder sent to remaining managers', date: 'Feb 8' }
            ]
          },
          {
            title: 'Waste diversion data validation',
            description: 'Q4 waste diversion rates flagged for 14 sites with >20% variance from previous quarters.',
            status: 'pending',
            date: 'Feb 8',
            severity: 'medium',
            history: [
              { event: 'Automated variance check flagged 14 sites', date: 'Feb 4' },
              { event: 'Validation tickets created for regional teams', date: 'Feb 6' },
              { event: 'Due today — 0 of 14 resolved', date: 'Feb 8' }
            ]
          }
        ]
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
        },
        modalItems: [
          {
            title: 'ISO 14064 verification audit',
            description: 'Third-party verification of 2024 GHG inventory covering Scope 1, 2, and material Scope 3 categories. Bureau Veritas engagement.',
            status: 'on-track',
            date: 'Mar 15',
            severity: 'low',
            history: [
              { event: 'Engagement letter signed with Bureau Veritas', date: 'Nov 20' },
              { event: 'Pre-audit documentation package submitted', date: 'Jan 8' },
              { event: 'Desktop review completed — minor findings issued', date: 'Jan 30' },
              { event: 'Management response to findings submitted', date: 'Feb 5' },
              { event: 'On-site audit dates confirmed: Mar 15-17', date: 'Feb 7' }
            ]
          },
          {
            title: 'Scope 3 supply chain verification',
            description: 'Limited assurance engagement for Category 1 (Purchased Goods) and Category 4 (Upstream Transport) data quality.',
            status: 'at-risk',
            date: 'Apr 2',
            severity: 'medium',
            history: [
              { event: 'Scope 3 data collection launched across suppliers', date: 'Dec 1' },
              { event: '62% supplier response rate as of Jan 31', date: 'Jan 31' },
              { event: 'Gap analysis identified 18 missing data points', date: 'Feb 3' },
              { event: 'Verification firm requested additional documentation', date: 'Feb 6' },
              { event: 'Risk flag: supplier response rate needs to reach 80% by Mar 1', date: 'Feb 8' }
            ]
          }
        ]
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
        },
        modalItems: [
          {
            title: 'IEA 2024 grid emission factors',
            description: 'International Energy Agency published updated country-level grid emission factors for 2024. Affects Scope 2 location-based calculations across all regions.',
            status: 'pending',
            date: 'Feb 6',
            severity: 'high',
            history: [
              { event: 'IEA published 2024 Emission Factors dataset', date: 'Jan 22' },
              { event: 'Data team flagged for integration review', date: 'Jan 28' },
              { event: 'Impact assessment initiated — 813 sites affected', date: 'Feb 3' }
            ]
          },
          {
            title: 'EPA eGRID subregion update',
            description: 'US EPA eGRID 2023 data released with revised subregional factors. Impacts 192 North American sites.',
            status: 'pending',
            date: 'Feb 5',
            severity: 'high',
            history: [
              { event: 'eGRID 2023 dataset published by EPA', date: 'Jan 15' },
              { event: 'Mapped to internal subregion taxonomy', date: 'Feb 1' },
              { event: 'Awaiting approval to update calculation engine', date: 'Feb 5' }
            ]
          },
          {
            title: 'DEFRA 2025 conversion factors',
            description: 'UK DEFRA released 2025 GHG conversion factors for company reporting. Covers fuels, refrigerants, and transport.',
            status: 'reviewed',
            date: 'Feb 4',
            severity: 'low',
            history: [
              { event: 'DEFRA 2025 factors published', date: 'Jan 10' },
              { event: 'Review completed by EU sustainability lead', date: 'Feb 1' },
              { event: 'Awaiting final sign-off for deployment', date: 'Feb 4' }
            ]
          },
          {
            title: 'Refrigerant GWP AR6 alignment',
            description: 'IPCC AR6 global warming potentials for HFCs differ from AR5 values currently in use. 24 refrigerant types affected.',
            status: 'pending',
            date: 'Feb 3',
            severity: 'medium',
            history: [
              { event: 'AR6 GWP discrepancy flagged during audit prep', date: 'Jan 20' },
              { event: 'Impact analysis: affects 340 HVAC and refrigeration assets', date: 'Feb 1' },
              { event: 'Decision pending on AR5 vs AR6 reporting basis', date: 'Feb 3' }
            ]
          },
          {
            title: 'Natural gas heating value update',
            description: 'Regional natural gas composition changes require updated net calorific values for 3 pipeline supply zones.',
            status: 'pending',
            date: 'Feb 2',
            severity: 'medium',
            history: [
              { event: 'Gas utility published updated composition data', date: 'Jan 25' },
              { event: 'Engineering team reviewed heating value impact', date: 'Feb 1' }
            ]
          },
          {
            title: 'Water intensity normalization',
            description: 'Occupancy-based water intensity normalization factors need recalibration following 2024 guest-night methodology change.',
            status: 'pending',
            date: 'Feb 1',
            severity: 'medium',
            history: [
              { event: 'New guest-night methodology adopted for 2025 reporting', date: 'Jan 5' },
              { event: 'Water intensity baseline recalculation started', date: 'Jan 20' },
              { event: 'Draft normalization factors under review', date: 'Feb 1' }
            ]
          },
          {
            title: 'Waste-to-energy emission factors',
            description: 'Municipal waste-to-energy facility operator provided updated stack emission measurements affecting waste disposal factors.',
            status: 'reviewed',
            date: 'Jan 30',
            severity: 'low',
            history: [
              { event: 'WtE operator shared 2024 annual emissions report', date: 'Jan 18' },
              { event: 'Factors reviewed and compared to IPCC defaults', date: 'Jan 28' },
              { event: 'Approved for integration — pending deployment', date: 'Jan 30' }
            ]
          },
          {
            title: 'Air travel emission methodology',
            description: 'ICAO updated carbon offsetting methodology affecting business travel Scope 3 Category 6 calculations.',
            status: 'pending',
            date: 'Jan 28',
            severity: 'low',
            history: [
              { event: 'ICAO CORSIA methodology update published', date: 'Jan 12' },
              { event: 'Travel data team notified of change', date: 'Jan 22' }
            ]
          },
          {
            title: 'Diesel fleet emission factor',
            description: 'Updated well-to-tank factors for European diesel B7 blend following EN 16258 revision.',
            status: 'pending',
            date: 'Jan 25',
            severity: 'low',
            history: [
              { event: 'EN 16258 revision published', date: 'Jan 8' },
              { event: 'Fleet management team flagged for review', date: 'Jan 18' }
            ]
          },
          {
            title: 'Steam generation factor revision',
            description: 'District heating steam factors for 3 European cities updated by local energy providers.',
            status: 'reviewed',
            date: 'Jan 22',
            severity: 'low',
            history: [
              { event: 'New district heating factors received', date: 'Jan 10' },
              { event: 'Reviewed and approved by EU regional lead', date: 'Jan 20' },
              { event: 'Scheduled for next calculation engine update', date: 'Jan 22' }
            ]
          },
          {
            title: 'Renewable energy certificate tracking',
            description: 'Market-based accounting requires updated REC/GO certificate registry data for Q4 2024 procurement.',
            status: 'pending',
            date: 'Jan 20',
            severity: 'medium',
            history: [
              { event: 'Q4 2024 certificate procurement records requested', date: 'Jan 5' },
              { event: '4 of 6 regions submitted certificate data', date: 'Jan 15' }
            ]
          },
          {
            title: 'Fugitive emissions estimation method',
            description: 'Transitioning from mass-balance to direct measurement for fugitive refrigerant emissions at 45 high-risk sites.',
            status: 'in-progress',
            date: 'Jan 18',
            severity: 'medium',
            history: [
              { event: 'Pilot direct measurement program launched at 10 sites', date: 'Dec 1' },
              { event: 'Pilot results: 15% higher than mass-balance estimates', date: 'Jan 10' },
              { event: 'Methodology change proposal under review', date: 'Jan 18' }
            ]
          }
        ]
      }
    ]
  },
  
  // ===== 5-LEVEL HIERARCHY TREE =====
  // org → region → country → local_region → city
  // Sites referenced by name; resolved via siteDirectory (built after config)
  hierarchy: {
    name: 'Global Portfolio',
    type: 'org',
    sites: [],
    children: [
      // ────── EUROPE ──────
      {
        name: 'Europe', type: 'region', sites: [],
        children: [
          { name: 'France', type: 'country', sites: ['France ESG Compliance Office'],
            children: [
              { name: 'Île-de-France', type: 'local_region', sites: [],
                children: [
                  { name: 'Paris', type: 'city', sites: ['Paris Le Grand Hôtel'], children: [] }
                ]
              }
            ]
          },
          { name: 'United Kingdom', type: 'country', sites: [],
            children: [
              { name: 'England', type: 'local_region', sites: [],
                children: [
                  { name: 'London', type: 'city', sites: ['London Pinnacle Tower'], children: [] }
                ]
              }
            ]
          },
          { name: 'Germany', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Berlin', type: 'city', sites: ['Berlin Alexanderplatz Hotel'], children: [] }
                ]
              }
            ]
          },
          { name: 'Netherlands', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Amsterdam', type: 'city', sites: ['Amsterdam Canal House'], children: [] }
                ]
              }
            ]
          },
          { name: 'Spain', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Madrid', type: 'city', sites: ['Madrid Sol Plaza'], children: [] }
                ]
              }
            ]
          }
        ]
      },
      // ────── NORTH AMERICA ──────
      {
        name: 'North America', type: 'region', sites: [],
        children: [
          { name: 'United States', type: 'country', sites: ['US Sustainability Coordination Hub'],
            children: [
              { name: 'Northeast', type: 'local_region', sites: [],
                children: [
                  { name: 'New York City', type: 'city', sites: ['New York Midtown Tower'], children: [] }
                ]
              },
              { name: 'West Coast', type: 'local_region', sites: [],
                children: [
                  { name: 'Los Angeles', type: 'city', sites: ['Los Angeles Sunset Resort'], children: [] }
                ]
              },
              { name: 'Midwest', type: 'local_region', sites: [],
                children: [
                  { name: 'Chicago', type: 'city', sites: ['Chicago Lakefront Hotel'], children: [] }
                ]
              },
              { name: 'Southeast', type: 'local_region', sites: [],
                children: [
                  { name: 'Miami', type: 'city', sites: ['Miami Beach Resort'], children: [] }
                ]
              }
            ]
          },
          { name: 'Canada', type: 'country', sites: [],
            children: [
              { name: 'Ontario', type: 'local_region', sites: [],
                children: [
                  { name: 'Toronto', type: 'city', sites: ['Toronto Financial Center'], children: [] }
                ]
              }
            ]
          }
        ]
      },
      // ────── SOUTH AMERICA ──────
      {
        name: 'South America', type: 'region', sites: [],
        children: [
          { name: 'Brazil', type: 'country', sites: [],
            children: [
              { name: 'São Paulo State', type: 'local_region', sites: [],
                children: [
                  { name: 'São Paulo', type: 'city', sites: ['São Paulo Jardins Tower'], children: [] }
                ]
              },
              { name: 'Rio de Janeiro State', type: 'local_region', sites: [],
                children: [
                  { name: 'Rio de Janeiro', type: 'city', sites: ['Rio de Janeiro Copacabana'], children: [] }
                ]
              }
            ]
          },
          { name: 'Argentina', type: 'country', sites: [],
            children: [
              { name: 'Buenos Aires Province', type: 'local_region', sites: [],
                children: [
                  { name: 'Buenos Aires', type: 'city', sites: ['Buenos Aires Puerto Madero'], children: [] }
                ]
              }
            ]
          },
          { name: 'Chile', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Santiago', type: 'city', sites: ['Santiago Las Condes'], children: [] }
                ]
              }
            ]
          },
          { name: 'Peru', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Lima', type: 'city', sites: ['Lima Miraflores Resort'], children: [] }
                ]
              }
            ]
          }
        ]
      },
      // ────── ASIA PACIFIC ──────
      {
        name: 'Asia Pacific', type: 'region', sites: [],
        children: [
          { name: 'China', type: 'country', sites: ['East China Regional Office'],
            children: [
              { name: 'East China', type: 'local_region', sites: [],
                children: [
                  { name: 'Shanghai', type: 'city', sites: ['Shanghai Bund Tower'], children: [] }
                ]
              }
            ]
          },
          { name: 'Japan', type: 'country', sites: [],
            children: [
              { name: 'Kantō', type: 'local_region', sites: [],
                children: [
                  { name: 'Tokyo', type: 'city', sites: ['Tokyo Ginza Palace'], children: [] }
                ]
              }
            ]
          },
          { name: 'Philippines', type: 'country', sites: [],
            children: [
              { name: 'Metro Manila', type: 'local_region', sites: [],
                children: [
                  { name: 'Manila', type: 'city', sites: ['Manila Bay Resort'], children: [] }
                ]
              }
            ]
          },
          { name: 'India', type: 'country', sites: [],
            children: [
              { name: 'Maharashtra', type: 'local_region', sites: [],
                children: [
                  { name: 'Mumbai', type: 'city', sites: ['Mumbai Gateway Hotel'], children: [] }
                ]
              }
            ]
          },
          { name: 'Thailand', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Bangkok', type: 'city', sites: ['Bangkok Riverside Resort'], children: [] }
                ]
              }
            ]
          }
        ]
      },
      // ────── MIDDLE EAST & AFRICA ──────
      {
        name: 'Middle East & Africa', type: 'region', sites: [],
        children: [
          { name: 'UAE', type: 'country', sites: [],
            children: [
              { name: 'Dubai Emirate', type: 'local_region', sites: [],
                children: [
                  { name: 'Dubai', type: 'city', sites: ['Dubai Marina Tower'], children: [] }
                ]
              }
            ]
          },
          { name: 'Saudi Arabia', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Riyadh', type: 'city', sites: ['Riyadh Business Gate'], children: [] }
                ]
              }
            ]
          },
          { name: 'South Africa', type: 'country', sites: [],
            children: [
              { name: 'Gauteng', type: 'local_region', sites: [],
                children: [
                  { name: 'Johannesburg', type: 'city', sites: ['Johannesburg Sandton Hotel'], children: [] }
                ]
              },
              { name: 'Western Cape', type: 'local_region', sites: [],
                children: [
                  { name: 'Cape Town', type: 'city', sites: ['Cape Town Waterfront Hotel'], children: [] }
                ]
              }
            ]
          },
          { name: 'Qatar', type: 'country', sites: [],
            children: [
              { name: 'Other', type: 'local_region', sites: [],
                children: [
                  { name: 'Doha', type: 'city', sites: ['Doha Pearl Resort'], children: [] }
                ]
              }
            ]
          }
        ]
      },
      // ────── AUSTRALIA/OCEANIA ──────
      {
        name: 'Australia/Oceania', type: 'region', sites: [],
        children: [
          { name: 'Australia', type: 'country', sites: [],
            children: [
              { name: 'New South Wales', type: 'local_region', sites: [],
                children: [
                  { name: 'Sydney', type: 'city', sites: ['Sydney Harbour View'], children: [] }
                ]
              },
              { name: 'Victoria', type: 'local_region', sites: [],
                children: [
                  { name: 'Melbourne', type: 'city', sites: ['Melbourne Southbank Hotel'], children: [] }
                ]
              },
              { name: 'Queensland', type: 'local_region', sites: [],
                children: [
                  { name: 'Brisbane', type: 'city', sites: ['Brisbane Riverside Hotel'], children: [] }
                ]
              },
              { name: 'Western Australia', type: 'local_region', sites: [],
                children: [
                  { name: 'Perth', type: 'city', sites: ['Perth Waterfront Hotel'], children: [] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // (kept for site data lookup — siteDirectory built after config)
  hierarchyRegions: [
    { name: 'Global Portfolio', meta: '813 sites · 6 regions', incidents: 701, change: '+4%', changeDir: 'up', spark: [1, -2, 3, 0, 4] },
    { name: 'Europe', meta: '141 sites', incidents: 102, change: '+8%', changeDir: 'up', spark: [2, -3, 5, 1, 8] },
    { name: 'North America', meta: '192 sites', incidents: 149, change: '-12%', changeDir: 'down', spark: [5, 8, -2, 3, -12] },
    { name: 'Asia Pacific', meta: '65 sites', incidents: 203, change: '-5%', changeDir: 'down', spark: [-2, 3, 1, -3, -5] },
    { name: 'Middle East & Africa', meta: '162 sites', incidents: 40, change: '0%', changeDir: 'neutral', spark: [2, -1, 1, -2, 0] },
    { name: 'South America', meta: '203 sites', incidents: 207, change: '-50%', changeDir: 'down', spark: [20, 35, -5, 10, -50] },
    { name: 'Australia/Oceania', meta: '50 sites', incidents: 50, change: '-3%', changeDir: 'down', spark: [4, -2, 3, -1, -3] }
  ],
  
  // Sites data per hierarchy level
  hierarchyData: {
    'Global Portfolio': {
      sites: [
        { name: 'São Paulo Jardins Tower', location: 'Brazil', employees: '1,800', incidents: 192, change: '+14%', changeDir: 'up', status: 'warning', spark: [8, -3, 12, 5, 14], alerts: [
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'low', date: 'Feb 8' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Feb 5' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'high', date: 'Feb 4' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Feb 2' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'low', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 29' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 28' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'low', date: 'Jan 27' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'high', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 25' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'high', date: 'Jan 23' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'medium', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Jan 20' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'medium', date: 'Jan 19' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'high', date: 'Jan 17' },
          { category: 'Energy', issue: 'Power factor correction required', severity: 'medium', date: 'Jan 16' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'low', date: 'Jan 15' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'high', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'medium', date: 'Jan 13' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'low', date: 'Jan 12' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'high', date: 'Jan 11' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Jan 9' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Jan 8' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'medium', date: 'Jan 7' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Jan 5' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Jan 4' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'low', date: 'Jan 3' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 1' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'low', date: 'Feb 8' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'medium', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'low', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'high', date: 'Feb 1' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'medium', date: 'Jan 31' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'high', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'high', date: 'Jan 26' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'high', date: 'Jan 23' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'medium', date: 'Jan 22' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'low', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'high', date: 'Jan 20' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'low', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'high', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'medium', date: 'Jan 16' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'high', date: 'Jan 14' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'medium', date: 'Jan 13' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'low', date: 'Jan 12' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'high', date: 'Jan 11' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'low', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'high', date: 'Jan 8' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'medium', date: 'Jan 7' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'low', date: 'Jan 6' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'high', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'medium', date: 'Jan 4' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'low', date: 'Jan 3' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'high', date: 'Jan 2' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'medium', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'low', date: 'Jan 27' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'high', date: 'Jan 23' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'low', date: 'Jan 21' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'high', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'high', date: 'Jan 17' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Jan 15' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Jan 14' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'medium', date: 'Jan 13' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Jan 11' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Jan 10' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'low', date: 'Jan 9' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 7' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 6' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'high', date: 'Jan 5' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 3' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 2' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'medium', date: 'Jan 1' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'low', date: 'Feb 5' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'high', date: 'Feb 1' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'medium', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'high', date: 'Jan 29' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'low', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'high', date: 'Jan 26' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'medium', date: 'Jan 25' },
          { category: 'Water', issue: 'Water balance audit incomplete', severity: 'low', date: 'Jan 24' },
          { category: 'Waste', issue: 'Used linen donation pickup delayed', severity: 'high', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Supplier SBT alignment low', severity: 'medium', date: 'Jan 22' },
          { category: 'Energy', issue: 'Capacitor bank failure detected', severity: 'low', date: 'Jan 21' },
          { category: 'Water', issue: 'Domestic hot water temperature low', severity: 'high', date: 'Jan 20' },
          { category: 'Waste', issue: 'Scrap metal collection scheduled', severity: 'medium', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Avoided emissions claim unverified', severity: 'low', date: 'Jan 18' },
          { category: 'Energy', issue: 'Harmonic distortion above limit', severity: 'high', date: 'Jan 17' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'medium', date: 'Jan 16' },
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'low', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'high', date: 'Jan 14' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'medium', date: 'Jan 13' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'low', date: 'Jan 12' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'high', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'medium', date: 'Jan 10' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'low', date: 'Jan 9' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'high', date: 'Jan 8' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'medium', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'low', date: 'Jan 6' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'high', date: 'Jan 5' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'medium', date: 'Jan 4' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'low', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'high', date: 'Jan 2' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'medium', date: 'Jan 1' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'low', date: 'Feb 8' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'low', date: 'Feb 5' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'high', date: 'Feb 4' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'low', date: 'Feb 2' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'low', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'high', date: 'Jan 29' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'medium', date: 'Jan 28' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'low', date: 'Jan 27' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'high', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'medium', date: 'Jan 25' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'high', date: 'Jan 23' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'medium', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 19' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'high', date: 'Jan 17' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 16' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 15' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'high', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 13' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'low', date: 'Jan 12' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'high', date: 'Jan 11' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'low', date: 'Jan 9' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'high', date: 'Jan 8' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'medium', date: 'Jan 7' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'low', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'high', date: 'Jan 5' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'medium', date: 'Jan 4' }
        ]},
        { name: 'Shanghai Bund Tower', location: 'China', employees: '2,200', incidents: 180, change: '+15%', changeDir: 'up', status: 'warning', spark: [10, -2, 15, 8, 18], alerts: [
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'high', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'low', date: 'Feb 6' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'high', date: 'Feb 2' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'low', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'high', date: 'Jan 30' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'low', date: 'Jan 28' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'high', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'low', date: 'Jan 25' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'high', date: 'Jan 24' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'high', date: 'Jan 21' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'medium', date: 'Jan 20' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'high', date: 'Jan 18' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'medium', date: 'Jan 17' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'low', date: 'Jan 16' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'high', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'medium', date: 'Jan 14' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'low', date: 'Jan 13' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'high', date: 'Jan 12' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'medium', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Jan 10' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Jan 9' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Jan 8' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'low', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Jan 6' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Jan 5' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Jan 4' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'high', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 2' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 1' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Feb 8' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'medium', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Feb 6' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Feb 5' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'low', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'high', date: 'Feb 2' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'low', date: 'Jan 31' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'medium', date: 'Jan 29' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'low', date: 'Jan 28' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'high', date: 'Jan 27' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'medium', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'low', date: 'Jan 25' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'high', date: 'Jan 24' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'high', date: 'Jan 21' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'medium', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Jan 19' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'high', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Jan 17' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Jan 16' },
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'high', date: 'Jan 15' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'medium', date: 'Jan 14' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Jan 13' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Jan 12' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'medium', date: 'Jan 11' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'low', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 9' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 8' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'low', date: 'Jan 7' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'high', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 5' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 4' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'high', date: 'Jan 3' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'medium', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 1' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Feb 8' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'medium', date: 'Feb 7' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'low', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'high', date: 'Feb 5' },
          { category: 'Energy', issue: 'Power factor correction required', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'low', date: 'Feb 3' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'high', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'high', date: 'Jan 30' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Jan 27' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'medium', date: 'Jan 26' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Jan 24' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Jan 23' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'low', date: 'Jan 22' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 20' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'low', date: 'Jan 19' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'high', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'medium', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'low', date: 'Jan 16' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'high', date: 'Jan 15' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'medium', date: 'Jan 14' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'low', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'high', date: 'Jan 12' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'medium', date: 'Jan 11' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'low', date: 'Jan 10' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'high', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'medium', date: 'Jan 8' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'low', date: 'Jan 7' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'high', date: 'Jan 6' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'medium', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'low', date: 'Jan 4' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'medium', date: 'Jan 2' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'low', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'high', date: 'Feb 8' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'medium', date: 'Feb 7' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'low', date: 'Feb 6' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'low', date: 'Feb 3' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'high', date: 'Feb 2' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'low', date: 'Jan 31' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'high', date: 'Jan 30' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'medium', date: 'Jan 29' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'low', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'high', date: 'Jan 27' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'low', date: 'Jan 25' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'high', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'medium', date: 'Jan 23' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'high', date: 'Jan 21' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'medium', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'low', date: 'Jan 19' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'high', date: 'Jan 18' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'medium', date: 'Jan 17' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'low', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'high', date: 'Jan 15' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Jan 14' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'low', date: 'Jan 13' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'high', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'medium', date: 'Jan 11' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'low', date: 'Jan 10' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'high', date: 'Jan 9' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'medium', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'low', date: 'Jan 7' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'high', date: 'Jan 6' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'medium', date: 'Jan 5' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'low', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'medium', date: 'Jan 2' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'low', date: 'Jan 1' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'high', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'low', date: 'Feb 6' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Feb 2' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Jan 30' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'low', date: 'Jan 28' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 25' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'high', date: 'Jan 24' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 21' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'medium', date: 'Jan 20' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Jan 18' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Jan 17' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'low', date: 'Jan 16' }
        ]},
        { name: 'New York Midtown Tower', location: 'United States', employees: '2,400', incidents: 140, change: '+10%', changeDir: 'up', status: 'warning', spark: [5, -2, 10, 4, 14], alerts: [
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'medium', date: 'Feb 8' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'low', date: 'Feb 7' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'high', date: 'Feb 6' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'medium', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'high', date: 'Feb 3' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'medium', date: 'Feb 2' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'low', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'high', date: 'Jan 31' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'medium', date: 'Jan 30' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'low', date: 'Jan 29' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'high', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'medium', date: 'Jan 27' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'low', date: 'Jan 26' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'high', date: 'Jan 25' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'medium', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'high', date: 'Jan 22' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'medium', date: 'Jan 21' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'low', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'high', date: 'Jan 19' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'medium', date: 'Jan 18' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'low', date: 'Jan 17' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'high', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'medium', date: 'Jan 15' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'low', date: 'Jan 14' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'high', date: 'Jan 13' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'medium', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'low', date: 'Jan 11' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'high', date: 'Jan 10' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'medium', date: 'Jan 9' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'low', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'high', date: 'Jan 7' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'medium', date: 'Jan 6' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'low', date: 'Jan 5' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'high', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'medium', date: 'Jan 3' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'low', date: 'Jan 2' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'high', date: 'Jan 1' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'low', date: 'Jan 29' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'high', date: 'Jan 28' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'medium', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Supplier SBT alignment low', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Capacitor bank failure detected', severity: 'high', date: 'Jan 25' },
          { category: 'Water', issue: 'Water balance audit incomplete', severity: 'medium', date: 'Jan 24' },
          { category: 'Waste', issue: 'Used linen donation pickup delayed', severity: 'low', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Avoided emissions claim unverified', severity: 'high', date: 'Jan 22' },
          { category: 'Energy', issue: 'Harmonic distortion above limit', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Domestic hot water temperature low', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Scrap metal collection scheduled', severity: 'high', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'medium', date: 'Jan 18' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'low', date: 'Jan 17' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'high', date: 'Jan 16' },
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'medium', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'high', date: 'Jan 13' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'low', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'high', date: 'Jan 10' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'low', date: 'Jan 8' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'high', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'medium', date: 'Jan 6' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'low', date: 'Jan 5' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'high', date: 'Jan 4' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'medium', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'low', date: 'Jan 2' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'high', date: 'Jan 1' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'medium', date: 'Feb 8' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'low', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'low', date: 'Feb 4' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'high', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'low', date: 'Feb 1' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'high', date: 'Jan 31' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'medium', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Jan 28' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'low', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Jan 25' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Jan 24' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Jan 23' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'high', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 21' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Jan 19' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'medium', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Jan 17' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Jan 16' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'medium', date: 'Jan 15' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'low', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'high', date: 'Jan 13' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Jan 12' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'low', date: 'Jan 11' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'high', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'medium', date: 'Jan 9' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'low', date: 'Jan 8' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'high', date: 'Jan 7' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'medium', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'low', date: 'Jan 5' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'high', date: 'Jan 4' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'medium', date: 'Jan 3' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'low', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'high', date: 'Jan 1' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'medium', date: 'Feb 8' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Feb 7' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Feb 4' },
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Feb 1' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Jan 31' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'medium', date: 'Jan 30' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'low', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 28' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'low', date: 'Jan 26' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'high', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 24' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 23' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'high', date: 'Jan 22' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'medium', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Jan 19' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'medium', date: 'Jan 18' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'low', date: 'Jan 17' }
        ]},
        { name: 'Paris Le Grand Hôtel', location: 'France', employees: '2,100', incidents: 94, change: '+8%', changeDir: 'up', status: 'warning', spark: [3, -2, 8, 4, 10], alerts: [
          { category: 'Energy', issue: 'Power factor correction required', severity: 'low', date: 'Feb 8' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'medium', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'low', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'high', date: 'Feb 1' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'medium', date: 'Jan 31' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'high', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'high', date: 'Jan 26' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'high', date: 'Jan 23' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'medium', date: 'Jan 22' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'low', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'high', date: 'Jan 20' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'low', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'high', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'medium', date: 'Jan 16' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'high', date: 'Jan 14' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'medium', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'low', date: 'Jan 12' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'high', date: 'Jan 11' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'low', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'high', date: 'Jan 8' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'medium', date: 'Jan 7' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'low', date: 'Jan 6' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'high', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'medium', date: 'Jan 4' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'low', date: 'Jan 3' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'high', date: 'Jan 2' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'medium', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'low', date: 'Jan 27' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'high', date: 'Jan 23' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'low', date: 'Jan 21' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'high', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'high', date: 'Jan 17' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'medium', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'low', date: 'Jan 15' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'high', date: 'Jan 14' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'medium', date: 'Jan 13' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'high', date: 'Jan 11' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'medium', date: 'Jan 10' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'low', date: 'Jan 9' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'high', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'medium', date: 'Jan 7' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'low', date: 'Jan 6' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'high', date: 'Jan 5' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'medium', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'low', date: 'Jan 3' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'high', date: 'Jan 2' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'medium', date: 'Jan 1' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'low', date: 'Feb 5' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'high', date: 'Feb 1' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'medium', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'high', date: 'Jan 29' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'low', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'high', date: 'Jan 26' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'medium', date: 'Jan 25' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'low', date: 'Jan 24' }
        ]},
        { name: 'Sydney Harbour View', location: 'Australia', employees: '980', incidents: 40, change: '+5%', changeDir: 'up', status: 'warning', spark: [2, -1, 5, 3, 7], alerts: [
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'high', date: 'Feb 8' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'medium', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'low', date: 'Feb 6' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'high', date: 'Feb 5' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'low', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'high', date: 'Feb 2' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'low', date: 'Jan 31' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'medium', date: 'Jan 29' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'low', date: 'Jan 28' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'high', date: 'Jan 27' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'medium', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'low', date: 'Jan 25' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 24' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'high', date: 'Jan 21' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 20' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 19' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'high', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 17' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'low', date: 'Jan 16' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'high', date: 'Jan 15' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'medium', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'low', date: 'Jan 13' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'high', date: 'Jan 12' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'medium', date: 'Jan 11' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'low', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'high', date: 'Jan 9' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'medium', date: 'Jan 8' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'low', date: 'Jan 7' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'high', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'medium', date: 'Jan 5' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'low', date: 'Jan 4' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'medium', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'low', date: 'Jan 1' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'high', date: 'Feb 8' }
        ]},
        { name: 'Dubai Marina Tower', location: 'UAE', employees: '1,200', incidents: 32, change: '+4%', changeDir: 'up', status: 'warning', spark: [2, -1, 4, 1, 6], alerts: [
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 29' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'high', date: 'Jan 28' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 25' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'medium', date: 'Jan 24' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Jan 22' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'high', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'medium', date: 'Jan 18' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'low', date: 'Jan 17' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'high', date: 'Jan 16' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'medium', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'high', date: 'Jan 13' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'low', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'high', date: 'Jan 10' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'low', date: 'Jan 8' }
        ]},
        { name: 'Tokyo Ginza Palace', location: 'Japan', employees: '1,600', incidents: 13, change: '+4%', changeDir: 'up', status: 'warning', spark: [4, -1, 9, 3, 4], alerts: [
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Jan 27' }
        ]},
        { name: 'Buenos Aires Puerto Madero', location: 'Argentina', employees: '920', incidents: 10, change: '+6%', changeDir: 'up', status: 'warning', spark: [3, -2, 6, 1, 8], alerts: [
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 30' }
        ]}
      ]
    },
    'Europe': {
      sites: [
        { name: 'Paris Le Grand Hôtel', location: 'France', employees: '2,100', incidents: 94, change: '+8%', changeDir: 'up', status: 'warning', spark: [3, -2, 8, 4, 10], alerts: [
          { category: 'Energy', issue: 'Power factor correction required', severity: 'low', date: 'Feb 8' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'medium', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'low', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'high', date: 'Feb 1' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'medium', date: 'Jan 31' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'high', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'high', date: 'Jan 26' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'high', date: 'Jan 23' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'medium', date: 'Jan 22' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'low', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'high', date: 'Jan 20' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'low', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'high', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'medium', date: 'Jan 16' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'high', date: 'Jan 14' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'medium', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'low', date: 'Jan 12' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'high', date: 'Jan 11' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'low', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'high', date: 'Jan 8' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'medium', date: 'Jan 7' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'low', date: 'Jan 6' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'high', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'medium', date: 'Jan 4' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'low', date: 'Jan 3' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'high', date: 'Jan 2' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'medium', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'low', date: 'Jan 27' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'high', date: 'Jan 23' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'low', date: 'Jan 21' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'high', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'high', date: 'Jan 17' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'medium', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'low', date: 'Jan 15' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'high', date: 'Jan 14' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'medium', date: 'Jan 13' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'high', date: 'Jan 11' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'medium', date: 'Jan 10' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'low', date: 'Jan 9' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'high', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'medium', date: 'Jan 7' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'low', date: 'Jan 6' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'high', date: 'Jan 5' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'medium', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'low', date: 'Jan 3' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'high', date: 'Jan 2' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'medium', date: 'Jan 1' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'low', date: 'Feb 5' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'high', date: 'Feb 1' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'medium', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'high', date: 'Jan 29' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'low', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'high', date: 'Jan 26' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'medium', date: 'Jan 25' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'low', date: 'Jan 24' }
        ]},
        { name: 'London Pinnacle Tower', location: 'United Kingdom', employees: '1,400', incidents: 3, change: '-5%', changeDir: 'down', status: 'good', spark: [2, -1, 3, -1, -5], alerts: [
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'medium', date: 'Feb 8' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'low', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'high', date: 'Feb 6' }
        ]},
        { name: 'Berlin Alexanderplatz Hotel', location: 'Germany', employees: '680', incidents: 3, change: '-3%', changeDir: 'down', status: 'good', spark: [4, -2, 1, -3, -3], alerts: [
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'high', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'low', date: 'Feb 6' }
        ]},
        { name: 'Amsterdam Canal House', location: 'Netherlands', employees: '350', incidents: 1, change: '-10%', changeDir: 'down', status: 'good', spark: [2, -3, 1, -2, -10], alerts: [
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'low', date: 'Feb 8' }
        ]},
        { name: 'Madrid Sol Plaza', location: 'Spain', employees: '420', incidents: 1, change: '-8%', changeDir: 'down', status: 'good', spark: [3, -1, 2, -3, -8], alerts: [
          { category: 'Energy', issue: 'Capacitor bank failure detected', severity: 'medium', date: 'Feb 8' }
        ]}
      ]
    },
    'North America': {
      sites: [
        { name: 'New York Midtown Tower', location: 'United States', employees: '2,400', incidents: 140, change: '+10%', changeDir: 'up', status: 'warning', spark: [5, -2, 10, 4, 14], alerts: [
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'medium', date: 'Feb 8' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'low', date: 'Feb 7' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'high', date: 'Feb 6' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'medium', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'low', date: 'Feb 4' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'high', date: 'Feb 3' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'medium', date: 'Feb 2' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'low', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'high', date: 'Jan 31' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'medium', date: 'Jan 30' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'low', date: 'Jan 29' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'high', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'medium', date: 'Jan 27' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'low', date: 'Jan 26' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'high', date: 'Jan 25' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'medium', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'low', date: 'Jan 23' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'high', date: 'Jan 22' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'medium', date: 'Jan 21' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'low', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'high', date: 'Jan 19' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'medium', date: 'Jan 18' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'low', date: 'Jan 17' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'high', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'medium', date: 'Jan 15' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'low', date: 'Jan 14' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'high', date: 'Jan 13' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'medium', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'low', date: 'Jan 11' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'high', date: 'Jan 10' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'medium', date: 'Jan 9' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'low', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'high', date: 'Jan 7' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'medium', date: 'Jan 6' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'low', date: 'Jan 5' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'high', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'medium', date: 'Jan 3' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'low', date: 'Jan 2' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'high', date: 'Jan 1' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'low', date: 'Jan 29' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'high', date: 'Jan 28' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'medium', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Supplier SBT alignment low', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Capacitor bank failure detected', severity: 'high', date: 'Jan 25' },
          { category: 'Water', issue: 'Water balance audit incomplete', severity: 'medium', date: 'Jan 24' },
          { category: 'Waste', issue: 'Used linen donation pickup delayed', severity: 'low', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Avoided emissions claim unverified', severity: 'high', date: 'Jan 22' },
          { category: 'Energy', issue: 'Harmonic distortion above limit', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Domestic hot water temperature low', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Scrap metal collection scheduled', severity: 'high', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'medium', date: 'Jan 18' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'low', date: 'Jan 17' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'high', date: 'Jan 16' },
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'medium', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'high', date: 'Jan 13' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'low', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'high', date: 'Jan 10' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'low', date: 'Jan 8' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'high', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'medium', date: 'Jan 6' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'low', date: 'Jan 5' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'high', date: 'Jan 4' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'medium', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'low', date: 'Jan 2' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'high', date: 'Jan 1' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'medium', date: 'Feb 8' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'low', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'high', date: 'Feb 6' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'medium', date: 'Feb 5' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'low', date: 'Feb 4' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'high', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'medium', date: 'Feb 2' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'low', date: 'Feb 1' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'high', date: 'Jan 31' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'medium', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Jan 29' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Jan 28' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Jan 27' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'low', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Jan 25' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Jan 24' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Jan 23' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'high', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 21' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Jan 19' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'medium', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Jan 17' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Jan 16' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'medium', date: 'Jan 15' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'low', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'high', date: 'Jan 13' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Jan 12' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'low', date: 'Jan 11' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'high', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'medium', date: 'Jan 9' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'low', date: 'Jan 8' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'high', date: 'Jan 7' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'medium', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'low', date: 'Jan 5' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'high', date: 'Jan 4' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'medium', date: 'Jan 3' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'low', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'high', date: 'Jan 1' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'medium', date: 'Feb 8' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Feb 7' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Feb 4' },
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'high', date: 'Feb 3' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'medium', date: 'Feb 2' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Feb 1' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Jan 31' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'medium', date: 'Jan 30' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'low', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 28' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 27' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'low', date: 'Jan 26' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'high', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 24' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 23' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'high', date: 'Jan 22' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'medium', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 20' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Jan 19' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'medium', date: 'Jan 18' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'low', date: 'Jan 17' }
        ]},
        { name: 'Los Angeles Sunset Resort', location: 'United States', employees: '1,100', incidents: 4, change: '-4%', changeDir: 'down', status: 'good', spark: [3, -1, 5, -2, -4], alerts: [
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'high', date: 'Feb 8' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'medium', date: 'Feb 7' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'low', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'high', date: 'Feb 5' }
        ]},
        { name: 'Chicago Lakefront Hotel', location: 'United States', employees: '780', incidents: 3, change: '-7%', changeDir: 'down', status: 'good', spark: [4, -3, 2, -1, -7], alerts: [
          { category: 'Water', issue: 'Domestic hot water temperature low', severity: 'low', date: 'Feb 8' },
          { category: 'Waste', issue: 'Scrap metal collection scheduled', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Avoided emissions claim unverified', severity: 'medium', date: 'Feb 6' }
        ]},
        { name: 'Toronto Financial Center', location: 'Canada', employees: '650', incidents: 1, change: '-11%', changeDir: 'down', status: 'good', spark: [3, -2, 1, -3, -11], alerts: [
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'medium', date: 'Feb 8' }
        ]},
        { name: 'Miami Beach Resort', location: 'United States', employees: '520', incidents: 1, change: '-15%', changeDir: 'down', status: 'good', spark: [2, -4, 3, -1, -15], alerts: [
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'high', date: 'Feb 8' }
        ]}
      ]
    },
    'Asia Pacific': {
      sites: [
        { name: 'Shanghai Bund Tower', location: 'China', employees: '2,200', incidents: 180, change: '+15%', changeDir: 'up', status: 'warning', spark: [10, -2, 15, 8, 18], alerts: [
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'high', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'low', date: 'Feb 6' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'high', date: 'Feb 2' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'low', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'high', date: 'Jan 30' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'low', date: 'Jan 28' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'high', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'low', date: 'Jan 25' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'high', date: 'Jan 24' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'high', date: 'Jan 21' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'medium', date: 'Jan 20' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'high', date: 'Jan 18' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'medium', date: 'Jan 17' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'low', date: 'Jan 16' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'high', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'medium', date: 'Jan 14' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'low', date: 'Jan 13' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'high', date: 'Jan 12' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'medium', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Jan 10' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Jan 9' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Jan 8' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'low', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Jan 6' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Jan 5' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Jan 4' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'high', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 2' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 1' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Feb 8' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'medium', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Feb 6' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'high', date: 'Feb 5' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'low', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'high', date: 'Feb 2' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'low', date: 'Jan 31' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'medium', date: 'Jan 29' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'low', date: 'Jan 28' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'high', date: 'Jan 27' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'medium', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'low', date: 'Jan 25' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'high', date: 'Jan 24' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'high', date: 'Jan 21' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'medium', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Jan 19' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'high', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Jan 17' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Jan 16' },
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'high', date: 'Jan 15' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'medium', date: 'Jan 14' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Jan 13' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Jan 12' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'medium', date: 'Jan 11' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'low', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 9' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 8' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'low', date: 'Jan 7' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'high', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 5' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 4' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'high', date: 'Jan 3' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'medium', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 1' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Feb 8' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'medium', date: 'Feb 7' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'low', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'high', date: 'Feb 5' },
          { category: 'Energy', issue: 'Power factor correction required', severity: 'medium', date: 'Feb 4' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'low', date: 'Feb 3' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'high', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'medium', date: 'Feb 1' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'low', date: 'Jan 31' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'high', date: 'Jan 30' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Jan 28' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Jan 27' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'medium', date: 'Jan 26' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Jan 24' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Jan 23' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'low', date: 'Jan 22' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 20' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'low', date: 'Jan 19' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'high', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'medium', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'low', date: 'Jan 16' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'high', date: 'Jan 15' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'medium', date: 'Jan 14' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'low', date: 'Jan 13' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'high', date: 'Jan 12' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'medium', date: 'Jan 11' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'low', date: 'Jan 10' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'high', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'medium', date: 'Jan 8' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'low', date: 'Jan 7' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'high', date: 'Jan 6' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'medium', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'low', date: 'Jan 4' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'medium', date: 'Jan 2' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'low', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'high', date: 'Feb 8' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'medium', date: 'Feb 7' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'low', date: 'Feb 6' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'high', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'medium', date: 'Feb 4' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'low', date: 'Feb 3' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'high', date: 'Feb 2' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'medium', date: 'Feb 1' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'low', date: 'Jan 31' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'high', date: 'Jan 30' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'medium', date: 'Jan 29' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'low', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'high', date: 'Jan 27' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'medium', date: 'Jan 26' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'low', date: 'Jan 25' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'high', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'medium', date: 'Jan 23' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'low', date: 'Jan 22' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'high', date: 'Jan 21' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'medium', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'low', date: 'Jan 19' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'high', date: 'Jan 18' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'medium', date: 'Jan 17' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'low', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'high', date: 'Jan 15' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Jan 14' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'low', date: 'Jan 13' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'high', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'medium', date: 'Jan 11' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'low', date: 'Jan 10' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'high', date: 'Jan 9' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'medium', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'low', date: 'Jan 7' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'high', date: 'Jan 6' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'medium', date: 'Jan 5' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'low', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'medium', date: 'Jan 2' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'low', date: 'Jan 1' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'high', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'medium', date: 'Feb 7' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'low', date: 'Feb 6' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'high', date: 'Feb 5' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Feb 3' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Feb 2' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'medium', date: 'Feb 1' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Jan 30' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Jan 29' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'low', date: 'Jan 28' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 26' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 25' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'high', date: 'Jan 24' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 22' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 21' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'medium', date: 'Jan 20' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Jan 18' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Jan 17' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'low', date: 'Jan 16' }
        ]},
        { name: 'Tokyo Ginza Palace', location: 'Japan', employees: '1,600', incidents: 13, change: '+4%', changeDir: 'up', status: 'warning', spark: [4, -1, 9, 3, 4], alerts: [
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'low', date: 'Jan 27' }
        ]},
        { name: 'Manila Bay Resort', location: 'Philippines', employees: '950', incidents: 5, change: '-3%', changeDir: 'down', status: 'good', spark: [2, -3, 5, -1, -3], alerts: [
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'medium', date: 'Feb 8' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'low', date: 'Feb 7' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'high', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'medium', date: 'Feb 5' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Feb 4' }
        ]},
        { name: 'Mumbai Gateway Hotel', location: 'India', employees: '680', incidents: 3, change: '-6%', changeDir: 'down', status: 'good', spark: [3, -2, 1, -4, -6], alerts: [
          { category: 'Water', issue: 'Leak detection system fault', severity: 'high', date: 'Feb 8' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'medium', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'low', date: 'Feb 6' }
        ]},
        { name: 'Bangkok Riverside Resort', location: 'Thailand', employees: '420', incidents: 2, change: '-9%', changeDir: 'down', status: 'good', spark: [5, -3, 2, -4, -9], alerts: [
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'high', date: 'Feb 7' }
        ]}
      ]
    },
    'Middle East & Africa': {
      sites: [
        { name: 'Dubai Marina Tower', location: 'UAE', employees: '1,200', incidents: 32, change: '+4%', changeDir: 'up', status: 'warning', spark: [2, -1, 4, 1, 6], alerts: [
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 30' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 29' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'high', date: 'Jan 28' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 26' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 25' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'medium', date: 'Jan 24' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Jan 22' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Jan 21' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'low', date: 'Jan 20' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'high', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'medium', date: 'Jan 18' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'low', date: 'Jan 17' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'high', date: 'Jan 16' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'medium', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'low', date: 'Jan 14' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'high', date: 'Jan 13' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'medium', date: 'Jan 12' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'low', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'high', date: 'Jan 10' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'medium', date: 'Jan 9' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'low', date: 'Jan 8' }
        ]},
        { name: 'Riyadh Business Gate', location: 'Saudi Arabia', employees: '580', incidents: 4, change: '0%', changeDir: 'neutral', status: 'neutral', spark: [3, -2, 1, -1, 0], alerts: [
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'high', date: 'Feb 8' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'medium', date: 'Feb 7' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'low', date: 'Feb 6' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'high', date: 'Feb 5' }
        ]},
        { name: 'Johannesburg Sandton Hotel', location: 'South Africa', employees: '420', incidents: 2, change: '-5%', changeDir: 'down', status: 'good', spark: [4, -3, 2, -2, -5], alerts: [
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'low', date: 'Feb 8' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'high', date: 'Feb 7' }
        ]},
        { name: 'Doha Pearl Resort', location: 'Qatar', employees: '310', incidents: 1, change: '-9%', changeDir: 'down', status: 'good', spark: [2, -4, 3, -1, -9], alerts: [
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'medium', date: 'Feb 8' }
        ]},
        { name: 'Cape Town Waterfront Hotel', location: 'South Africa', employees: '250', incidents: 1, change: '-12%', changeDir: 'down', status: 'good', spark: [5, -2, 1, -4, -12], alerts: [
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'high', date: 'Feb 8' }
        ]}
      ]
    },
    'South America': {
      sites: [
        { name: 'São Paulo Jardins Tower', location: 'Brazil', employees: '1,800', incidents: 192, change: '+14%', changeDir: 'up', status: 'warning', spark: [8, -3, 12, 5, 14], alerts: [
          { category: 'Water', issue: 'Stormwater reuse system offline', severity: 'low', date: 'Feb 8' },
          { category: 'Waste', issue: 'Plastic reduction target at risk', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Scope 3 freight emissions unverified', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Boiler efficiency below threshold', severity: 'low', date: 'Feb 5' },
          { category: 'Water', issue: 'Desalination reliance increase', severity: 'high', date: 'Feb 4' },
          { category: 'Waste', issue: 'Circular economy metrics missing', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'EV fleet transition delay', severity: 'low', date: 'Feb 2' },
          { category: 'Energy', issue: 'Chiller plant optimization needed', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Drought contingency plan update needed', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Composting facility maintenance needed', severity: 'low', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Fugitive emissions monitoring gap', severity: 'high', date: 'Jan 29' },
          { category: 'Energy', issue: 'Building envelope heat loss detected', severity: 'medium', date: 'Jan 28' },
          { category: 'Water', issue: 'Steam condensate loss detected', severity: 'low', date: 'Jan 27' },
          { category: 'Waste', issue: 'Landfill diversion rate dropped', severity: 'high', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Methane leak detection overdue', severity: 'medium', date: 'Jan 25' },
          { category: 'Energy', issue: 'Variable speed drive malfunction', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'high', date: 'Jan 23' },
          { category: 'Waste', issue: 'Chemical waste storage limit approaching', severity: 'medium', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'high', date: 'Jan 20' },
          { category: 'Water', issue: 'Water recycling rate declined', severity: 'medium', date: 'Jan 19' },
          { category: 'Waste', issue: 'Paper waste reduction target missed', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Carbon disclosure deadline approaching', severity: 'high', date: 'Jan 17' },
          { category: 'Energy', issue: 'Power factor correction required', severity: 'medium', date: 'Jan 16' },
          { category: 'Water', issue: 'Leak detection system fault', severity: 'low', date: 'Jan 15' },
          { category: 'Waste', issue: 'Textile waste recycling pending', severity: 'high', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Science-based target review needed', severity: 'medium', date: 'Jan 13' },
          { category: 'Energy', issue: 'Generator emissions exceeded limits', severity: 'low', date: 'Jan 12' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'high', date: 'Jan 11' },
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Jan 9' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Jan 8' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'medium', date: 'Jan 7' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Jan 5' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Jan 4' },
          { category: 'Water', issue: 'Water quality monitoring overdue', severity: 'low', date: 'Jan 3' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 1' },
          { category: 'Energy', issue: 'LED retrofit schedule delayed', severity: 'low', date: 'Feb 8' },
          { category: 'Water', issue: 'Water meter calibration needed', severity: 'high', date: 'Feb 7' },
          { category: 'Waste', issue: 'Waste sorting contamination detected', severity: 'medium', date: 'Feb 6' },
          { category: 'Carbon', issue: 'Third-party verification overdue', severity: 'low', date: 'Feb 5' },
          { category: 'Energy', issue: 'Substation transformer overloaded', severity: 'high', date: 'Feb 4' },
          { category: 'Water', issue: 'Backflow preventer inspection due', severity: 'medium', date: 'Feb 3' },
          { category: 'Waste', issue: 'Medical waste disposal overdue', severity: 'low', date: 'Feb 2' },
          { category: 'Carbon', issue: 'Carbon intensity ratio worsening', severity: 'high', date: 'Feb 1' },
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'medium', date: 'Jan 31' },
          { category: 'Water', issue: 'Chilled water loop pressure drop', severity: 'low', date: 'Jan 30' },
          { category: 'Waste', issue: 'Grease trap cleaning scheduled', severity: 'high', date: 'Jan 29' },
          { category: 'Carbon', issue: 'Green procurement target missed', severity: 'medium', date: 'Jan 28' },
          { category: 'Energy', issue: 'Compressed air leak identified', severity: 'low', date: 'Jan 27' },
          { category: 'Water', issue: 'Condensate recovery rate low', severity: 'high', date: 'Jan 26' },
          { category: 'Waste', issue: 'Battery collection bin full', severity: 'medium', date: 'Jan 25' },
          { category: 'Carbon', issue: 'Upstream transportation data gap', severity: 'low', date: 'Jan 24' },
          { category: 'Energy', issue: 'Motor replacement overdue', severity: 'high', date: 'Jan 23' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'medium', date: 'Jan 22' },
          { category: 'Waste', issue: 'Furniture disposal request pending', severity: 'low', date: 'Jan 21' },
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'high', date: 'Jan 20' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'medium', date: 'Jan 19' },
          { category: 'Water', issue: 'Fire suppression system test overdue', severity: 'low', date: 'Jan 18' },
          { category: 'Waste', issue: 'Waste compactor malfunction', severity: 'high', date: 'Jan 17' },
          { category: 'Carbon', issue: 'Scope 1 reporting discrepancy', severity: 'medium', date: 'Jan 16' },
          { category: 'Energy', issue: 'UPS battery replacement needed', severity: 'low', date: 'Jan 15' },
          { category: 'Water', issue: 'Landscape irrigation waste detected', severity: 'high', date: 'Jan 14' },
          { category: 'Waste', issue: 'Cooking oil recycling pickup late', severity: 'medium', date: 'Jan 13' },
          { category: 'Carbon', issue: 'GHG inventory data missing', severity: 'low', date: 'Jan 12' },
          { category: 'Energy', issue: 'HVAC zone imbalance reported', severity: 'high', date: 'Jan 11' },
          { category: 'Water', issue: 'Cooling tower blowdown excessive', severity: 'medium', date: 'Jan 10' },
          { category: 'Waste', issue: 'Demolition waste manifest missing', severity: 'low', date: 'Jan 9' },
          { category: 'Carbon', issue: 'Emission factor update required', severity: 'high', date: 'Jan 8' },
          { category: 'Energy', issue: 'Rooftop unit cycling excessively', severity: 'medium', date: 'Jan 7' },
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'low', date: 'Jan 6' },
          { category: 'Waste', issue: 'Bulky waste collection overdue', severity: 'high', date: 'Jan 5' },
          { category: 'Carbon', issue: 'Net zero roadmap deviation noted', severity: 'medium', date: 'Jan 4' },
          { category: 'Energy', issue: 'Grid carbon intensity spike', severity: 'low', date: 'Jan 3' },
          { category: 'Water', issue: 'Boiler feedwater quality low', severity: 'high', date: 'Jan 2' },
          { category: 'Waste', issue: 'Sharps container replacement needed', severity: 'medium', date: 'Jan 1' },
          { category: 'Carbon', issue: 'Purchased electricity factor change', severity: 'low', date: 'Feb 8' },
          { category: 'Energy', issue: 'EV charger utilization low', severity: 'high', date: 'Feb 7' },
          { category: 'Water', issue: 'Sewer discharge limit approaching', severity: 'medium', date: 'Feb 6' },
          { category: 'Waste', issue: 'Toner cartridge recycling pending', severity: 'low', date: 'Feb 5' },
          { category: 'Carbon', issue: 'Market-based accounting gap', severity: 'high', date: 'Feb 4' },
          { category: 'Energy', issue: 'Heat pump COP below optimal', severity: 'medium', date: 'Feb 3' },
          { category: 'Water', issue: 'Water reuse permit renewal due', severity: 'low', date: 'Feb 2' },
          { category: 'Waste', issue: 'Mattress recycling pickup delayed', severity: 'high', date: 'Feb 1' },
          { category: 'Carbon', issue: 'Location-based reporting mismatch', severity: 'medium', date: 'Jan 31' },
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'low', date: 'Jan 30' },
          { category: 'Water', issue: 'Hydrant flow test scheduled', severity: 'high', date: 'Jan 29' },
          { category: 'Waste', issue: 'Paint waste accumulation noted', severity: 'medium', date: 'Jan 28' },
          { category: 'Carbon', issue: 'Carbon removal credit expired', severity: 'low', date: 'Jan 27' },
          { category: 'Energy', issue: 'Lighting schedule override active', severity: 'high', date: 'Jan 26' },
          { category: 'Water', issue: 'Pressure reducing valve fault', severity: 'medium', date: 'Jan 25' },
          { category: 'Waste', issue: 'Fluorescent tube disposal needed', severity: 'low', date: 'Jan 24' },
          { category: 'Carbon', issue: 'Offset project audit overdue', severity: 'high', date: 'Jan 23' },
          { category: 'Energy', issue: 'District heating supply variance', severity: 'medium', date: 'Jan 22' },
          { category: 'Water', issue: 'Water main vibration detected', severity: 'low', date: 'Jan 21' },
          { category: 'Waste', issue: 'Solvent waste drum nearly full', severity: 'high', date: 'Jan 20' },
          { category: 'Carbon', issue: 'Biogenic emission tracking gap', severity: 'medium', date: 'Jan 19' },
          { category: 'Energy', issue: 'Backup generator test overdue', severity: 'low', date: 'Jan 18' },
          { category: 'Water', issue: 'Deionized water system offline', severity: 'high', date: 'Jan 17' },
          { category: 'Waste', issue: 'Cardboard baler maintenance due', severity: 'medium', date: 'Jan 16' },
          { category: 'Carbon', issue: 'Scope 2 dual reporting incomplete', severity: 'low', date: 'Jan 15' },
          { category: 'Energy', issue: 'Energy metering calibration needed', severity: 'high', date: 'Jan 14' },
          { category: 'Water', issue: 'Legionella risk assessment overdue', severity: 'medium', date: 'Jan 13' },
          { category: 'Waste', issue: 'Glass recycling bin contaminated', severity: 'low', date: 'Jan 12' },
          { category: 'Carbon', issue: 'Value chain engagement low', severity: 'high', date: 'Jan 11' },
          { category: 'Energy', issue: 'Thermal storage system fault', severity: 'medium', date: 'Jan 10' },
          { category: 'Water', issue: 'Plumbing fixture leak reported', severity: 'low', date: 'Jan 9' },
          { category: 'Waste', issue: 'Compost temperature out of range', severity: 'high', date: 'Jan 8' },
          { category: 'Carbon', issue: 'Decarbonization target slippage', severity: 'medium', date: 'Jan 7' },
          { category: 'Energy', issue: 'Smart grid response delay', severity: 'low', date: 'Jan 6' },
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'high', date: 'Jan 5' },
          { category: 'Waste', issue: 'Waste oil storage tank full', severity: 'medium', date: 'Jan 4' },
          { category: 'Carbon', issue: 'Residual emissions plan missing', severity: 'low', date: 'Jan 3' },
          { category: 'Energy', issue: 'Solar inverter efficiency drop', severity: 'high', date: 'Jan 2' },
          { category: 'Water', issue: 'Cross-connection survey needed', severity: 'medium', date: 'Jan 1' },
          { category: 'Waste', issue: 'Aerosol can disposal required', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Carbon budget overrun detected', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'Wind turbine output below forecast', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Water tank overflow detected', severity: 'low', date: 'Feb 5' },
          { category: 'Waste', issue: 'Wood pallet accumulation noted', severity: 'high', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Transition risk assessment overdue', severity: 'medium', date: 'Feb 3' },
          { category: 'Energy', issue: 'Battery storage degradation alert', severity: 'low', date: 'Feb 2' },
          { category: 'Water', issue: 'Effluent monitoring gap noted', severity: 'high', date: 'Feb 1' },
          { category: 'Waste', issue: 'Styrofoam collection overdue', severity: 'medium', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Climate scenario analysis outdated', severity: 'low', date: 'Jan 30' },
          { category: 'Energy', issue: 'Power quality disturbance logged', severity: 'high', date: 'Jan 29' },
          { category: 'Water', issue: 'Brine discharge above limit', severity: 'medium', date: 'Jan 28' },
          { category: 'Waste', issue: 'Universal waste storage limit near', severity: 'low', date: 'Jan 27' },
          { category: 'Carbon', issue: 'Internal carbon price review due', severity: 'high', date: 'Jan 26' },
          { category: 'Energy', issue: 'Transformer oil temperature high', severity: 'medium', date: 'Jan 25' },
          { category: 'Water', issue: 'Water balance audit incomplete', severity: 'low', date: 'Jan 24' },
          { category: 'Waste', issue: 'Used linen donation pickup delayed', severity: 'high', date: 'Jan 23' },
          { category: 'Carbon', issue: 'Supplier SBT alignment low', severity: 'medium', date: 'Jan 22' },
          { category: 'Energy', issue: 'Capacitor bank failure detected', severity: 'low', date: 'Jan 21' },
          { category: 'Water', issue: 'Domestic hot water temperature low', severity: 'high', date: 'Jan 20' },
          { category: 'Waste', issue: 'Scrap metal collection scheduled', severity: 'medium', date: 'Jan 19' },
          { category: 'Carbon', issue: 'Avoided emissions claim unverified', severity: 'low', date: 'Jan 18' },
          { category: 'Energy', issue: 'Harmonic distortion above limit', severity: 'high', date: 'Jan 17' },
          { category: 'Water', issue: 'Reclaimed water quality alert', severity: 'medium', date: 'Jan 16' },
          { category: 'Waste', issue: 'Biohazard waste manifest gap', severity: 'low', date: 'Jan 15' },
          { category: 'Carbon', issue: 'Reforestation project delay noted', severity: 'high', date: 'Jan 14' },
          { category: 'Energy', issue: 'Voltage regulation issue noted', severity: 'medium', date: 'Jan 13' },
          { category: 'Water', issue: 'Potable water backflow risk', severity: 'low', date: 'Jan 12' },
          { category: 'Waste', issue: 'Ash disposal from incinerator due', severity: 'high', date: 'Jan 11' },
          { category: 'Carbon', issue: 'Carbon footprint label update needed', severity: 'medium', date: 'Jan 10' },
          { category: 'Energy', issue: 'Frequency deviation recorded', severity: 'low', date: 'Jan 9' },
          { category: 'Water', issue: 'Cooling tower drift eliminator worn', severity: 'high', date: 'Jan 8' },
          { category: 'Waste', issue: 'Tire disposal request pending', severity: 'medium', date: 'Jan 7' },
          { category: 'Carbon', issue: 'Voluntary registry submission late', severity: 'low', date: 'Jan 6' },
          { category: 'Energy', issue: 'Load balancing optimization needed', severity: 'high', date: 'Jan 5' },
          { category: 'Water', issue: 'Grease interceptor capacity reached', severity: 'medium', date: 'Jan 4' },
          { category: 'Waste', issue: 'Concrete rubble removal needed', severity: 'low', date: 'Jan 3' },
          { category: 'Carbon', issue: 'Verified carbon unit expiring soon', severity: 'high', date: 'Jan 2' },
          { category: 'Energy', issue: 'Cooling tower fan motor overheating', severity: 'medium', date: 'Jan 1' },
          { category: 'Water', issue: 'Rainwater tank sediment buildup', severity: 'low', date: 'Feb 8' },
          { category: 'Waste', issue: 'Carpet recycling vendor needed', severity: 'high', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Product carbon footprint data gap', severity: 'medium', date: 'Feb 6' },
          { category: 'Energy', issue: 'Air handling unit filter clogged', severity: 'low', date: 'Feb 5' },
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'high', date: 'Feb 4' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'medium', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'low', date: 'Feb 2' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'high', date: 'Feb 1' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'medium', date: 'Jan 31' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'low', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'high', date: 'Jan 29' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'medium', date: 'Jan 28' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'low', date: 'Jan 27' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'high', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'medium', date: 'Jan 25' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'low', date: 'Jan 24' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'high', date: 'Jan 23' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'medium', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'low', date: 'Jan 21' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 20' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 19' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'high', date: 'Jan 17' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 16' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 15' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'high', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 13' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'low', date: 'Jan 12' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'high', date: 'Jan 11' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'medium', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'low', date: 'Jan 9' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'high', date: 'Jan 8' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'medium', date: 'Jan 7' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'low', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'high', date: 'Jan 5' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'medium', date: 'Jan 4' }
        ]},
        { name: 'Buenos Aires Puerto Madero', location: 'Argentina', employees: '920', incidents: 10, change: '+6%', changeDir: 'up', status: 'warning', spark: [3, -2, 6, 1, 8], alerts: [
          { category: 'Waste', issue: 'Waste audit documentation incomplete', severity: 'medium', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Supply chain carbon footprint gap', severity: 'low', date: 'Feb 7' },
          { category: 'Energy', issue: 'Steam trap failure detected', severity: 'high', date: 'Feb 6' },
          { category: 'Water', issue: 'Hot water recirculation pump failure', severity: 'medium', date: 'Feb 5' },
          { category: 'Waste', issue: 'Dumpster overflow reported', severity: 'low', date: 'Feb 4' },
          { category: 'Carbon', issue: 'Air travel policy compliance low', severity: 'high', date: 'Feb 3' },
          { category: 'Energy', issue: 'Cogeneration unit maintenance overdue', severity: 'medium', date: 'Feb 2' },
          { category: 'Water', issue: 'Reverse osmosis membrane replacement due', severity: 'low', date: 'Feb 1' },
          { category: 'Waste', issue: 'Hazardous waste pickup overdue', severity: 'high', date: 'Jan 31' },
          { category: 'Carbon', issue: 'Carbon credit retirement pending', severity: 'medium', date: 'Jan 30' }
        ]},
        { name: 'Rio de Janeiro Copacabana', location: 'Brazil', employees: '780', incidents: 3, change: '-5%', changeDir: 'down', status: 'good', spark: [2, -1, 4, -3, -5], alerts: [
          { category: 'Carbon', issue: 'Carbon neutrality milestone at risk', severity: 'high', date: 'Feb 8' },
          { category: 'Energy', issue: 'Electrical panel overheating detected', severity: 'medium', date: 'Feb 7' },
          { category: 'Water', issue: 'Pool water treatment imbalance', severity: 'low', date: 'Feb 6' }
        ]},
        { name: 'Santiago Las Condes', location: 'Chile', employees: '340', incidents: 1, change: '-12%', changeDir: 'down', status: 'good', spark: [3, -2, 1, -3, -12], alerts: [
          { category: 'Energy', issue: 'Server room PUE above threshold', severity: 'low', date: 'Feb 8' }
        ]},
        { name: 'Lima Miraflores Resort', location: 'Peru', employees: '280', incidents: 1, change: '-8%', changeDir: 'down', status: 'good', spark: [2, -4, 1, -2, -8], alerts: [
          { category: 'Water', issue: 'Water hammer event recorded', severity: 'medium', date: 'Feb 8' }
        ]}
      ]
    },
    'Australia/Oceania': {
      sites: [
        { name: 'Sydney Harbour View', location: 'Australia', employees: '980', incidents: 40, change: '+5%', changeDir: 'up', status: 'warning', spark: [2, -1, 5, 3, 7], alerts: [
          { category: 'Water', issue: 'Water treatment chemical low', severity: 'high', date: 'Feb 8' },
          { category: 'Waste', issue: 'Soap dispenser waste reduction gap', severity: 'medium', date: 'Feb 7' },
          { category: 'Carbon', issue: 'Life cycle assessment outdated', severity: 'low', date: 'Feb 6' },
          { category: 'Energy', issue: 'Economizer damper malfunction', severity: 'high', date: 'Feb 5' },
          { category: 'Water', issue: 'Membrane bioreactor maintenance due', severity: 'medium', date: 'Feb 4' },
          { category: 'Waste', issue: 'Amenity packaging waste increase', severity: 'low', date: 'Feb 3' },
          { category: 'Carbon', issue: 'Carbon accounting software migration due', severity: 'high', date: 'Feb 2' },
          { category: 'Energy', issue: 'Duct leakage above threshold', severity: 'medium', date: 'Feb 1' },
          { category: 'Water', issue: 'UV disinfection lamp replacement needed', severity: 'low', date: 'Jan 31' },
          { category: 'Waste', issue: 'Coffee grounds composting paused', severity: 'high', date: 'Jan 30' },
          { category: 'Carbon', issue: 'Board climate report pending', severity: 'medium', date: 'Jan 29' },
          { category: 'Energy', issue: 'Refrigeration system inefficiency', severity: 'low', date: 'Jan 28' },
          { category: 'Water', issue: 'Water consumption above baseline', severity: 'high', date: 'Jan 27' },
          { category: 'Waste', issue: 'Recycling rate dropped below target', severity: 'medium', date: 'Jan 26' },
          { category: 'Carbon', issue: 'Missing Scope 3 supplier data', severity: 'low', date: 'Jan 25' },
          { category: 'Energy', issue: 'Scope 2 emissions exceeded monthly target', severity: 'high', date: 'Jan 24' },
          { category: 'Water', issue: 'Cooling tower makeup water high', severity: 'medium', date: 'Jan 23' },
          { category: 'Waste', issue: 'Food waste diversion below target', severity: 'low', date: 'Jan 22' },
          { category: 'Carbon', issue: 'Fleet emissions data incomplete', severity: 'high', date: 'Jan 21' },
          { category: 'Energy', issue: 'HVAC system inefficiency detected', severity: 'medium', date: 'Jan 20' },
          { category: 'Water', issue: 'Irrigation system leak detected', severity: 'low', date: 'Jan 19' },
          { category: 'Waste', issue: 'E-waste collection needed', severity: 'high', date: 'Jan 18' },
          { category: 'Carbon', issue: 'Business travel emissions up', severity: 'medium', date: 'Jan 17' },
          { category: 'Energy', issue: 'Peak demand charge warning', severity: 'low', date: 'Jan 16' },
          { category: 'Water', issue: 'Rainwater harvesting system offline', severity: 'high', date: 'Jan 15' },
          { category: 'Waste', issue: 'Packaging waste increase detected', severity: 'medium', date: 'Jan 14' },
          { category: 'Carbon', issue: 'Renewable certificate expiring', severity: 'low', date: 'Jan 13' },
          { category: 'Energy', issue: 'Solar panel output degraded', severity: 'high', date: 'Jan 12' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'medium', date: 'Jan 11' },
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'low', date: 'Jan 10' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'high', date: 'Jan 9' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'medium', date: 'Jan 8' },
          { category: 'Water', issue: 'Water discharge permit review needed', severity: 'low', date: 'Jan 7' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'high', date: 'Jan 6' },
          { category: 'Carbon', issue: 'Carbon tax liability increase', severity: 'medium', date: 'Jan 5' },
          { category: 'Energy', issue: 'Natural gas consumption spike', severity: 'low', date: 'Jan 4' },
          { category: 'Water', issue: 'Cooling water treatment overdue', severity: 'high', date: 'Jan 3' },
          { category: 'Waste', issue: 'Construction debris permit expiring', severity: 'medium', date: 'Jan 2' },
          { category: 'Carbon', issue: 'Commuter survey response low', severity: 'low', date: 'Jan 1' },
          { category: 'Energy', issue: 'Building energy rating declined', severity: 'high', date: 'Feb 8' }
        ]},
        { name: 'Melbourne Southbank Hotel', location: 'Australia', employees: '620', incidents: 5, change: '-2%', changeDir: 'down', status: 'good', spark: [3, -2, 1, -3, -2], alerts: [
          { category: 'Waste', issue: 'Single-use plastic compliance gap', severity: 'low', date: 'Feb 8' },
          { category: 'Carbon', issue: 'Carbon offset verification pending', severity: 'high', date: 'Feb 7' },
          { category: 'Energy', issue: 'BMS communication fault', severity: 'medium', date: 'Feb 6' },
          { category: 'Water', issue: 'Greywater system maintenance due', severity: 'low', date: 'Feb 5' },
          { category: 'Waste', issue: 'Organic waste diversion below target', severity: 'high', date: 'Feb 4' }
        ]},
        { name: 'Auckland Viaduct Resort', location: 'New Zealand', employees: '340', incidents: 3, change: '-6%', changeDir: 'down', status: 'good', spark: [4, -3, 2, -1, -6], alerts: [
          { category: 'Carbon', issue: 'Refrigerant leak reported', severity: 'medium', date: 'Feb 8' },
          { category: 'Energy', issue: 'Demand response enrollment pending', severity: 'low', date: 'Feb 7' },
          { category: 'Water', issue: 'Process water consumption up', severity: 'high', date: 'Feb 6' }
        ]},
        { name: 'Brisbane Riverside Hotel', location: 'Australia', employees: '280', incidents: 1, change: '-11%', changeDir: 'down', status: 'good', spark: [2, -4, 1, -2, -11], alerts: [
          { category: 'Energy', issue: 'Energy dashboard data gap detected', severity: 'high', date: 'Feb 8' }
        ]},
        { name: 'Perth Waterfront Hotel', location: 'Australia', employees: '190', incidents: 1, change: '-14%', changeDir: 'down', status: 'good', spark: [5, -3, 2, -5, -14], alerts: [
          { category: 'Water', issue: 'Water softener regeneration overdue', severity: 'low', date: 'Feb 8' }
        ]}
      ]
    }
  }
};

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
        { label: 'Review activity data', icon: 'fa-solid fa-map', actionId: 'open-activity-map' }
      ]
    },
    {
      label: 'Emissions calculations',
      value: '38.64%',
      unit: 'EF Map rate',
      subtitle: '84 total emissions, 46 mapped, using 4 methods',
      progress: 46,
      actions: [
        { label: 'Review EF progress', icon: 'fa-solid fa-chart-simple' },
        { label: 'Calculations', icon: 'fa-solid fa-plus' }
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
        { label: 'Create inventory projections', icon: 'fa-solid fa-chart-simple' }
      ]
    }
  ]
};
