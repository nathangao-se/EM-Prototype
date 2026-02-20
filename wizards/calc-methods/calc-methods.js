// ========================================
// CALCULATION METHODS — page content (rendered via page transition from project bar)
// ========================================

(function () {

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  var CATEGORIES = [
    { id: 'all',        name: 'All',                    icon: 'fa-solid fa-border-all' },
    { id: 'combustion', name: 'Combustion',            icon: 'fa-solid fa-fire-flame-curved' },
    { id: 'purchased',  name: 'Purchased Energy',      icon: 'fa-solid fa-bolt-lightning' },
    { id: 'transport',  name: 'Transport & Logistics',  icon: 'fa-solid fa-plane-departure' },
    { id: 'goods',      name: 'Goods & Services',       icon: 'fa-solid fa-boxes-stacked' },
    { id: 'additional', name: 'Additional Categories',   icon: 'fa-solid fa-layer-group' }
  ];

  var METHODS = [
    // ── Combustion ──
    { group: 'combustion', name: 'Stationary Combustion', subtitle: 'Boilers, furnaces, heaters, generators',
      category: 'Combustion', categoryIcon: 'fa-solid fa-fire-flame-curved', catLabel: '25 types',
      activities: 25, config: 'TTW + WTT', variations: 2, variationLabel: '2 variations' },
    { group: 'combustion', name: 'Mobile Combustion', subtitle: 'Company vehicles and mobile equipment',
      category: 'Combustion', categoryIcon: 'fa-solid fa-fire-flame-curved', catLabel: '15 types',
      activities: 15, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },
    { group: 'combustion', name: 'Fugitive Emissions', subtitle: 'Refrigerants and leaked gases',
      category: 'Fugitive', categoryIcon: 'fa-solid fa-wind', catLabel: '5 types',
      activities: 5, config: 'GWP-based', variations: 0, variationLabel: '+ Add variation' },

    // ── Purchased Energy ──
    { group: 'purchased', name: 'Purchased Electricity', subtitle: 'Grid electricity consumption',
      category: 'Energy', categoryIcon: 'fa-solid fa-bolt-lightning', catLabel: '4 types',
      activities: 4, config: 'Location + Market', variations: 1, variationLabel: '1 variation' },
    { group: 'purchased', name: 'Purchased Heat & Steam', subtitle: 'District heating, cooling, chilled water',
      category: 'Energy', categoryIcon: 'fa-solid fa-bolt-lightning', catLabel: '4 types',
      activities: 4, config: 'Location/Market', variations: 0, variationLabel: '+ Add variation' },
    { group: 'purchased', name: 'Fuel & Energy Activities', subtitle: 'Upstream fuel, T&D losses (Cat 3)',
      category: 'Energy', categoryIcon: 'fa-solid fa-bolt-lightning', catLabel: 'Cat 3',
      activities: 6, config: 'WTT + T&D', variations: 0, variationLabel: '+ Add variation' },

    // ── Transport & Logistics ──
    { group: 'transport', name: 'Upstream Transportation', subtitle: 'Inbound logistics (Cat 4)',
      category: 'Transport', categoryIcon: 'fa-solid fa-truck', catLabel: 'Cat 4',
      activities: 8, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },
    { group: 'transport', name: 'Business Travel', subtitle: 'Flights, hotels, ground transport (Cat 6)',
      category: 'Transport', categoryIcon: 'fa-solid fa-plane-departure', catLabel: 'Cat 6',
      activities: 12, config: 'TTW + WTT', variations: 3, variationLabel: '3 variations' },
    { group: 'transport', name: 'Employee Commuting', subtitle: 'Daily commute and WFH (Cat 7)',
      category: 'Transport', categoryIcon: 'fa-solid fa-car', catLabel: 'Cat 7',
      activities: 6, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },
    { group: 'transport', name: 'Downstream Transportation', subtitle: 'Outbound logistics (Cat 9)',
      category: 'Transport', categoryIcon: 'fa-solid fa-truck', catLabel: 'Cat 9',
      activities: 8, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },

    // ── Goods & Services ──
    { group: 'goods', name: 'Purchased Goods & Services', subtitle: 'Upstream goods and services (Cat 1)',
      category: 'Goods', categoryIcon: 'fa-solid fa-boxes-stacked', catLabel: 'Cat 1',
      activities: 14, config: 'Cradle-to-Gate', variations: 1, variationLabel: '1 variation' },
    { group: 'goods', name: 'Capital Goods', subtitle: 'Purchased capital assets (Cat 2)',
      category: 'Goods', categoryIcon: 'fa-solid fa-boxes-stacked', catLabel: 'Cat 2',
      activities: 10, config: 'Cradle-to-Gate', variations: 0, variationLabel: '+ Add variation' },
    { group: 'goods', name: 'Waste in Operations', subtitle: 'Waste disposal and treatment (Cat 5)',
      category: 'Goods', categoryIcon: 'fa-solid fa-recycle', catLabel: 'Cat 5',
      activities: 7, config: 'Treatment', variations: 2, variationLabel: '2 variations' },

    // ── Additional Categories ──
    { group: 'additional', name: 'Upstream Leased Assets', subtitle: 'Leased assets (Cat 8)',
      category: 'Assets', categoryIcon: 'fa-solid fa-building', catLabel: 'Cat 8',
      activities: 3, config: 'Operational', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'Processing of Sold Products', subtitle: 'Intermediate processing (Cat 10)',
      category: 'Products', categoryIcon: 'fa-solid fa-industry', catLabel: 'Cat 10',
      activities: 4, config: 'Downstream', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'Use of Sold Products', subtitle: 'End-use emissions (Cat 11)',
      category: 'Products', categoryIcon: 'fa-solid fa-industry', catLabel: 'Cat 11',
      activities: 5, config: 'Use Phase', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'End-of-Life Treatment', subtitle: 'Product disposal (Cat 12)',
      category: 'Products', categoryIcon: 'fa-solid fa-industry', catLabel: 'Cat 12',
      activities: 4, config: 'End-of-Life', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'Downstream Leased Assets', subtitle: 'Leased to others (Cat 13)',
      category: 'Assets', categoryIcon: 'fa-solid fa-building', catLabel: 'Cat 13',
      activities: 3, config: 'Operational', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'Franchises', subtitle: 'Franchise operations (Cat 14)',
      category: 'Franchise', categoryIcon: 'fa-solid fa-store', catLabel: 'Cat 14',
      activities: 2, config: 'Operational', variations: 0, variationLabel: '+ Add variation' },
    { group: 'additional', name: 'Investments', subtitle: 'Financial investments (Cat 15)',
      category: 'Finance', categoryIcon: 'fa-solid fa-chart-line', catLabel: 'Cat 15',
      activities: 3, config: 'Attribution', variations: 0, variationLabel: '+ Add variation' }
  ];

  // ── Activity Collection data ──
  // Per-method detail data for the modal. Keyed by method name.

  var METHOD_DETAILS = {
    'Stationary Combustion': {
      decisions: [
        { label: 'Fuel combustion lifecycle', sub: 'Which lifecycle stages to include for fuel combustion', chip: 'TTW + WTT', chipType: 'blue' },
        { label: 'Heating value type', sub: 'Heating value basis for energy-based EFs', chip: 'LHV', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' },
        { label: 'Direct measurement', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel direct combustion', scope: 'Scope 1', scopeType: 'green' },
        { stage: 'WTT', sub: 'Well-to-Tank upstream fuel', scope: 'Scope 3 Cat 3', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Natural Gas (Grid Average)', sub: 'StationaryCombustion_NaturalGas' },
        { name: 'LNG', sub: 'StationaryCombustion_LNG' },
        { name: 'Diesel', sub: 'StationaryCombustion_Diesel' },
        { name: 'Fuel Oil', sub: 'StationaryCombustion_FuelOil' }
      ],
      variations: [
        {
          title: 'ACME Corp - Stationary Combustion',
          decisions: [
            { label: 'Fuel combustion lifecycle', sub: 'Which lifecycle stages to include for fuel combustion', chip: 'TTW + WTT', chipType: 'blue' },
            { label: 'Heating value type', sub: 'Heating value basis for energy-based EFs', chip: 'HHV', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Activity-based', chipLabel: 'Fallback', chipType: 'grey' },
            { label: 'Spend-based', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Direct measurement', chipLabel: 'Fallback', chipType: 'grey' }
          ],
          activityTypes: [
            { name: 'Natural Gas (Grid Average)', sub: 'StationaryCombustion_NaturalGas' },
            { name: 'LNG', sub: 'StationaryCombustion_LNG' },
            { name: 'Propane', sub: 'StationaryCombustion_Propane' },
            { name: 'Biomass Wood', sub: 'StationaryCombustion_BiomassWood' }
          ]
        },
        {
          title: 'EU Plants - Stationary Combustion',
          decisions: [
            { label: 'Fuel combustion lifecycle', sub: 'Which lifecycle stages to include for fuel combustion', chip: 'TTW only', chipType: 'blue' },
            { label: 'Heating value type', sub: 'Heating value basis for energy-based EFs', chip: 'LHV', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' },
            { label: 'Direct measurement', chipLabel: 'Primary', chipType: 'green' }
          ],
          lifecycle: [
            { stage: 'TTW', sub: 'Tank-to-wheel direct combustion', scope: 'Scope 1', scopeType: 'green' }
          ]
        }
      ]
    },
    'Mobile Combustion': {
      decisions: [
        { label: 'Fuel combustion lifecycle', sub: 'Which lifecycle stages to include for mobile sources', chip: 'TTW + WTT', chipType: 'blue' },
        { label: 'Heating value type', sub: 'Heating value basis for energy-based EFs', chip: 'LHV', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' },
        { label: 'Direct measurement', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel vehicle combustion', scope: 'Scope 1', scopeType: 'green' },
        { stage: 'WTT', sub: 'Well-to-Tank upstream fuel', scope: 'Scope 3 Cat 3', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Diesel (Road)', sub: 'MobileCombustion_DieselRoad' },
        { name: 'Gasoline (Road)', sub: 'MobileCombustion_GasolineRoad' },
        { name: 'CNG', sub: 'MobileCombustion_CNG' },
        { name: 'LPG', sub: 'MobileCombustion_LPG' }
      ]
    },
    'Fugitive Emissions': {
      decisions: [
        { label: 'GWP reference', sub: 'Which global warming potential values to apply', chip: 'AR6', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Screening estimate', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Direct', sub: 'Fugitive release to atmosphere', scope: 'Scope 1', scopeType: 'green' }
      ],
      activityTypes: [
        { name: 'R-410A', sub: 'FugitiveEmissions_R410A' },
        { name: 'R-134a', sub: 'FugitiveEmissions_R134a' },
        { name: 'R-404A', sub: 'FugitiveEmissions_R404A' },
        { name: 'SF6', sub: 'FugitiveEmissions_SF6' },
        { name: 'CO2 (fire suppression)', sub: 'FugitiveEmissions_CO2' }
      ]
    },
    'Purchased Electricity': {
      decisions: [
        { label: 'Reporting method', sub: 'Location-based, market-based, or both', chip: 'Location + Market', chipType: 'blue' },
        { label: 'Grid factor source', sub: 'Grid emission factor dataset', chip: 'eGRID / IEA', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Generation', sub: 'Electricity generation at plant', scope: 'Scope 2', scopeType: 'green' }
      ],
      activityTypes: [
        { name: 'Grid Electricity', sub: 'PurchasedElectricity_Grid' },
        { name: 'Renewable (RECs)', sub: 'PurchasedElectricity_RECs' },
        { name: 'On-site Solar', sub: 'PurchasedElectricity_Solar' },
        { name: 'PPA Electricity', sub: 'PurchasedElectricity_PPA' }
      ],
      variations: [
        {
          title: 'EU Grid - Market Based',
          decisions: [
            { label: 'Reporting method', sub: 'Location-based, market-based, or both', chip: 'Market only', chipType: 'blue' },
            { label: 'Grid factor source', sub: 'Grid emission factor dataset', chip: 'AIB / GO', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
          ],
          activityTypes: [
            { name: 'Grid Electricity (EU)', sub: 'PurchasedElectricity_GridEU' },
            { name: 'GO-backed Renewable', sub: 'PurchasedElectricity_GO' },
            { name: 'PPA Electricity (EU)', sub: 'PurchasedElectricity_PPA_EU' }
          ]
        }
      ]
    },
    'Purchased Heat & Steam': {
      decisions: [
        { label: 'Reporting method', sub: 'Location-based or market-based', chip: 'Location/Market', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Generation', sub: 'Heat/steam generation at district plant', scope: 'Scope 2', scopeType: 'green' }
      ],
      activityTypes: [
        { name: 'District Heating', sub: 'PurchasedHeat_DistrictHeating' },
        { name: 'District Cooling', sub: 'PurchasedHeat_DistrictCooling' },
        { name: 'Steam', sub: 'PurchasedHeat_Steam' },
        { name: 'Chilled Water', sub: 'PurchasedHeat_ChilledWater' }
      ]
    },
    'Fuel & Energy Activities': {
      decisions: [
        { label: 'Upstream stages', sub: 'WTT and T&D loss stages to include', chip: 'WTT + T&D', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'WTT', sub: 'Well-to-Tank upstream extraction and refining', scope: 'Scope 3 Cat 3', scopeType: 'orange' },
        { stage: 'T&D', sub: 'Transmission and distribution losses', scope: 'Scope 3 Cat 3', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'WTT Natural Gas', sub: 'FEREA_WTT_NaturalGas' },
        { name: 'WTT Diesel', sub: 'FEREA_WTT_Diesel' },
        { name: 'T&D Electricity', sub: 'FEREA_TD_Electricity' },
        { name: 'WTT Gasoline', sub: 'FEREA_WTT_Gasoline' },
        { name: 'WTT Coal', sub: 'FEREA_WTT_Coal' },
        { name: 'T&D Heat/Steam', sub: 'FEREA_TD_Heat' }
      ]
    },
    'Upstream Transportation': {
      decisions: [
        { label: 'Transport mode split', sub: 'How to allocate across transport modes', chip: 'TTW + WTT', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Distance-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel vehicle operation', scope: 'Scope 3 Cat 4', scopeType: 'orange' },
        { stage: 'WTT', sub: 'Well-to-Tank fuel production', scope: 'Scope 3 Cat 4', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Road Freight (HGV)', sub: 'UpstreamTransport_RoadHGV' },
        { name: 'Road Freight (LGV)', sub: 'UpstreamTransport_RoadLGV' },
        { name: 'Rail Freight', sub: 'UpstreamTransport_Rail' },
        { name: 'Sea Freight', sub: 'UpstreamTransport_Sea' },
        { name: 'Air Freight', sub: 'UpstreamTransport_Air' }
      ]
    },
    'Business Travel': {
      decisions: [
        { label: 'Distance class split', sub: 'Short-haul vs long-haul classification', chip: 'TTW + WTT', chipType: 'blue' },
        { label: 'Radiative forcing', sub: 'Whether to include aviation RF multiplier', chip: 'Included', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Distance-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel transport operation', scope: 'Scope 3 Cat 6', scopeType: 'orange' },
        { stage: 'WTT', sub: 'Well-to-Tank fuel production', scope: 'Scope 3 Cat 6', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Domestic Flight', sub: 'BusinessTravel_DomesticFlight' },
        { name: 'Short-Haul Flight', sub: 'BusinessTravel_ShortHaul' },
        { name: 'Long-Haul Flight', sub: 'BusinessTravel_LongHaul' },
        { name: 'Rail', sub: 'BusinessTravel_Rail' },
        { name: 'Taxi / Rideshare', sub: 'BusinessTravel_Taxi' },
        { name: 'Hotel Stay', sub: 'BusinessTravel_Hotel' }
      ],
      variations: [
        {
          title: 'APAC Region',
          decisions: [
            { label: 'Distance class split', sub: 'Short-haul vs long-haul classification', chip: 'TTW + WTT', chipType: 'blue' },
            { label: 'Radiative forcing', sub: 'Whether to include aviation RF multiplier', chip: 'Included', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Distance-based', chipLabel: 'Fallback', chipType: 'grey' },
            { label: 'Spend-based', chipLabel: 'Primary', chipType: 'green' }
          ],
          activityTypes: [
            { name: 'Short-Haul Flight', sub: 'BusinessTravel_ShortHaul' },
            { name: 'Long-Haul Flight', sub: 'BusinessTravel_LongHaul' },
            { name: 'Rail (HSR)', sub: 'BusinessTravel_HSR' },
            { name: 'Hotel Stay', sub: 'BusinessTravel_Hotel' }
          ]
        },
        {
          title: 'EU Region - No RF',
          decisions: [
            { label: 'Distance class split', sub: 'Short-haul vs long-haul classification', chip: 'TTW only', chipType: 'blue' },
            { label: 'Radiative forcing', sub: 'Whether to include aviation RF multiplier', chip: 'Excluded', chipType: 'blue' }
          ],
          lifecycle: [
            { stage: 'TTW', sub: 'Tank-to-wheel transport operation', scope: 'Scope 3 Cat 6', scopeType: 'orange' }
          ],
          activityTypes: [
            { name: 'Short-Haul Flight', sub: 'BusinessTravel_ShortHaul' },
            { name: 'Rail (EU)', sub: 'BusinessTravel_RailEU' },
            { name: 'Taxi / Rideshare', sub: 'BusinessTravel_Taxi' },
            { name: 'Hotel Stay', sub: 'BusinessTravel_Hotel' }
          ]
        },
        {
          title: 'Executive Travel',
          decisions: [
            { label: 'Distance class split', sub: 'Short-haul vs long-haul classification', chip: 'TTW + WTT', chipType: 'blue' },
            { label: 'Radiative forcing', sub: 'Whether to include aviation RF multiplier', chip: 'Included', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Distance-based', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Spend-based', chipLabel: 'Primary', chipType: 'green' }
          ],
          activityTypes: [
            { name: 'Long-Haul Flight (Business)', sub: 'BusinessTravel_LongHaulBiz' },
            { name: 'Private Charter', sub: 'BusinessTravel_Charter' },
            { name: 'Hotel Stay (Premium)', sub: 'BusinessTravel_HotelPremium' }
          ]
        }
      ]
    },
    'Employee Commuting': {
      decisions: [
        { label: 'Survey method', sub: 'How commute data is collected', chip: 'TTW + WTT', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Distance-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel commute operation', scope: 'Scope 3 Cat 7', scopeType: 'orange' },
        { stage: 'WTT', sub: 'Well-to-Tank fuel production', scope: 'Scope 3 Cat 7', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Car (Gasoline)', sub: 'Commuting_CarGasoline' },
        { name: 'Car (Diesel)', sub: 'Commuting_CarDiesel' },
        { name: 'Car (EV)', sub: 'Commuting_CarEV' },
        { name: 'Bus', sub: 'Commuting_Bus' },
        { name: 'Rail / Subway', sub: 'Commuting_Rail' },
        { name: 'WFH', sub: 'Commuting_WFH' }
      ]
    },
    'Downstream Transportation': {
      decisions: [
        { label: 'Transport mode split', sub: 'How to allocate across transport modes', chip: 'TTW + WTT', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Distance-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'TTW', sub: 'Tank-to-wheel vehicle operation', scope: 'Scope 3 Cat 9', scopeType: 'orange' },
        { stage: 'WTT', sub: 'Well-to-Tank fuel production', scope: 'Scope 3 Cat 9', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Road Freight (HGV)', sub: 'DownstreamTransport_RoadHGV' },
        { name: 'Road Freight (LGV)', sub: 'DownstreamTransport_RoadLGV' },
        { name: 'Rail Freight', sub: 'DownstreamTransport_Rail' },
        { name: 'Sea Freight', sub: 'DownstreamTransport_Sea' },
        { name: 'Air Freight', sub: 'DownstreamTransport_Air' }
      ]
    },
    'Purchased Goods & Services': {
      decisions: [
        { label: 'Boundary approach', sub: 'Cradle-to-gate vs cradle-to-grave', chip: 'Cradle-to-Gate', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Supplier-specific', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Cradle-to-Gate', sub: 'Raw materials through manufacturing', scope: 'Scope 3 Cat 1', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'IT Equipment', sub: 'PGS_ITEquipment' },
        { name: 'Office Supplies', sub: 'PGS_OfficeSupplies' },
        { name: 'Professional Services', sub: 'PGS_ProfessionalServices' },
        { name: 'Cloud Services', sub: 'PGS_CloudServices' },
        { name: 'Raw Materials', sub: 'PGS_RawMaterials' }
      ],
      variations: [
        {
          title: 'Direct Suppliers Only',
          decisions: [
            { label: 'Boundary approach', sub: 'Cradle-to-gate vs cradle-to-grave', chip: 'Cradle-to-Grave', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Supplier-specific', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
          ],
          lifecycle: [
            { stage: 'Cradle-to-Grave', sub: 'Full lifecycle including end-of-life', scope: 'Scope 3 Cat 1', scopeType: 'orange' }
          ],
          activityTypes: [
            { name: 'Steel & Metals', sub: 'PGS_SteelMetals' },
            { name: 'Plastics & Polymers', sub: 'PGS_Plastics' },
            { name: 'Chemicals', sub: 'PGS_Chemicals' },
            { name: 'Packaging Materials', sub: 'PGS_Packaging' },
            { name: 'Electronic Components', sub: 'PGS_Electronics' },
            { name: 'Textiles', sub: 'PGS_Textiles' }
          ]
        }
      ]
    },
    'Capital Goods': {
      decisions: [
        { label: 'Boundary approach', sub: 'Cradle-to-gate for capital assets', chip: 'Cradle-to-Gate', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Supplier-specific', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Cradle-to-Gate', sub: 'Manufacturing and delivery of capital assets', scope: 'Scope 3 Cat 2', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Machinery', sub: 'CapitalGoods_Machinery' },
        { name: 'Buildings', sub: 'CapitalGoods_Buildings' },
        { name: 'Vehicles', sub: 'CapitalGoods_Vehicles' },
        { name: 'IT Infrastructure', sub: 'CapitalGoods_ITInfra' }
      ]
    },
    'Waste in Operations': {
      decisions: [
        { label: 'Treatment method', sub: 'Landfill, incineration, recycling, composting', chip: 'Treatment', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Treatment', sub: 'Waste disposal and processing', scope: 'Scope 3 Cat 5', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Landfill (Mixed)', sub: 'Waste_LandfillMixed' },
        { name: 'Incineration', sub: 'Waste_Incineration' },
        { name: 'Recycling', sub: 'Waste_Recycling' },
        { name: 'Composting', sub: 'Waste_Composting' },
        { name: 'Wastewater Treatment', sub: 'Waste_Wastewater' }
      ],
      variations: [
        {
          title: 'Zero Waste Sites',
          decisions: [
            { label: 'Treatment method', sub: 'Landfill, incineration, recycling, composting', chip: 'Recycling', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
            { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
          ],
          activityTypes: [
            { name: 'Recycling (Mixed)', sub: 'Waste_RecyclingMixed' },
            { name: 'Composting (Organic)', sub: 'Waste_CompostOrganic' },
            { name: 'Anaerobic Digestion', sub: 'Waste_AnaerobicDigestion' }
          ]
        },
        {
          title: 'EU Compliance',
          decisions: [
            { label: 'Treatment method', sub: 'Landfill, incineration, recycling, composting', chip: 'EU WFD Hierarchy', chipType: 'blue' }
          ],
          dataPaths: [
            { label: 'Activity-based', chipLabel: 'Fallback', chipType: 'grey' },
            { label: 'Spend-based', chipLabel: 'Primary', chipType: 'green' }
          ],
          lifecycle: [
            { stage: 'Treatment', sub: 'EU Waste Framework Directive compliant', scope: 'Scope 3 Cat 5', scopeType: 'orange' }
          ],
          activityTypes: [
            { name: 'Incineration (EfW)', sub: 'Waste_IncinerationEfW' },
            { name: 'Recycling (Sorted)', sub: 'Waste_RecyclingSorted' },
            { name: 'Landfill (Residual)', sub: 'Waste_LandfillResidual' },
            { name: 'Hazardous Waste', sub: 'Waste_Hazardous' }
          ]
        }
      ]
    },
    'Upstream Leased Assets': {
      decisions: [
        { label: 'Control approach', sub: 'Operational vs financial control', chip: 'Operational', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Spend-based', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Operations', sub: 'Leased asset operations', scope: 'Scope 3 Cat 8', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Leased Office', sub: 'LeasedAssets_Office' },
        { name: 'Leased Warehouse', sub: 'LeasedAssets_Warehouse' },
        { name: 'Leased Vehicle', sub: 'LeasedAssets_Vehicle' }
      ]
    },
    'Processing of Sold Products': {
      decisions: [
        { label: 'Processing boundary', sub: 'Downstream processing stages', chip: 'Downstream', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Processing', sub: 'Intermediate processing by third parties', scope: 'Scope 3 Cat 10', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Chemical Processing', sub: 'SoldProducts_Chemical' },
        { name: 'Assembly', sub: 'SoldProducts_Assembly' },
        { name: 'Refining', sub: 'SoldProducts_Refining' },
        { name: 'Packaging', sub: 'SoldProducts_Packaging' }
      ]
    },
    'Use of Sold Products': {
      decisions: [
        { label: 'Use phase method', sub: 'Direct use vs lifetime assessment', chip: 'Use Phase', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Use', sub: 'End-user product operation', scope: 'Scope 3 Cat 11', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Energy-using Products', sub: 'UseSold_EnergyUsing' },
        { name: 'Fuel-using Products', sub: 'UseSold_FuelUsing' },
        { name: 'GHG-containing Products', sub: 'UseSold_GHGContaining' },
        { name: 'Indirect Use', sub: 'UseSold_Indirect' },
        { name: 'Non-energy Products', sub: 'UseSold_NonEnergy' }
      ]
    },
    'End-of-Life Treatment': {
      decisions: [
        { label: 'EOL method', sub: 'End-of-life treatment pathways', chip: 'End-of-Life', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'EOL', sub: 'Disposal and recycling of sold products', scope: 'Scope 3 Cat 12', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Landfill', sub: 'EOL_Landfill' },
        { name: 'Incineration', sub: 'EOL_Incineration' },
        { name: 'Recycling', sub: 'EOL_Recycling' },
        { name: 'Reuse', sub: 'EOL_Reuse' }
      ]
    },
    'Downstream Leased Assets': {
      decisions: [
        { label: 'Control approach', sub: 'Operational vs financial control', chip: 'Operational', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Operations', sub: 'Lessee operations of leased-out assets', scope: 'Scope 3 Cat 13', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Leased Building', sub: 'DownLease_Building' },
        { name: 'Leased Equipment', sub: 'DownLease_Equipment' },
        { name: 'Leased Vehicle', sub: 'DownLease_Vehicle' }
      ]
    },
    'Franchises': {
      decisions: [
        { label: 'Control approach', sub: 'Franchisee operational control', chip: 'Operational', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Activity-based', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Operations', sub: 'Franchise location operations', scope: 'Scope 3 Cat 14', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Franchise Electricity', sub: 'Franchise_Electricity' },
        { name: 'Franchise Heating', sub: 'Franchise_Heating' }
      ]
    },
    'Investments': {
      decisions: [
        { label: 'Attribution method', sub: 'Equity share vs investment-specific', chip: 'Attribution', chipType: 'blue' }
      ],
      dataPaths: [
        { label: 'Investment-specific', chipLabel: 'Primary', chipType: 'green' },
        { label: 'Average data', chipLabel: 'Fallback', chipType: 'grey' }
      ],
      lifecycle: [
        { stage: 'Attributable', sub: 'Proportional share of investee emissions', scope: 'Scope 3 Cat 15', scopeType: 'orange' }
      ],
      activityTypes: [
        { name: 'Equity Investments', sub: 'Investments_Equity' },
        { name: 'Debt Investments', sub: 'Investments_Debt' },
        { name: 'Project Finance', sub: 'Investments_ProjectFinance' }
      ]
    }
  };

  // AC modal functions are in activity-collection.js

  // ── Sidebar ──

  function buildSidebar(activeId) {
    var html = '<div class="cm-sidebar pt-stagger-item">';
    CATEGORIES.forEach(function (cat) {
      var activeClass = cat.id === activeId ? ' cm-sidebar-item--active' : '';
      var count = 0;
      METHODS.forEach(function (m) { if (cat.id === 'all' || m.group === cat.id) count++; });
      html += '<div class="cm-sidebar-item' + activeClass + '" data-cat-id="' + esc(cat.id) + '">';
      html += '<i class="' + esc(cat.icon) + ' cm-sidebar-icon"></i>';
      html += '<span class="cm-sidebar-label">' + esc(cat.name) + '</span>';
      html += '<span class="cm-sidebar-count">' + count + '</span>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // ── Toolbar ──

  function buildToolbar() {
    var html = '<div class="cm-toolbar pt-stagger-item">';
    html += '<input type="text" class="cm-search" placeholder="Search">';
    html += '<select class="cm-select"><option>Display: list</option></select>';
    html += '<select class="cm-select"><option>All scope</option></select>';
    html += '<select class="cm-select"><option>All entities</option></select>';
    html += '<select class="cm-select"><option>Normalized and unnormalized</option></select>';
    html += '</div>';
    return html;
  }

  // ── Table ──

  function buildMethodRow(m) {
    var html = '<tr class="cm-row" data-method-name="' + esc(m.name) + '">';

    html += '<td class="cm-cell-name">';
    html += '<div class="cm-name-primary">' + esc(m.name) + '</div>';
    html += '<div class="cm-name-sub">' + esc(m.subtitle) + '</div>';
    html += '</td>';

    html += '<td class="cm-cell-cat1">';
    html += '<span class="cm-chip cm-chip--outlined">';
    html += '<i class="' + esc(m.categoryIcon) + ' cm-chip-icon"></i>';
    html += '<span>' + esc(m.category) + '</span>';
    html += '</span>';
    html += '</td>';

    html += '<td class="cm-cell-cat2">' + esc(m.catLabel) + '</td>';

    html += '<td class="cm-cell-act">' + m.activities + '</td>';

    html += '<td class="cm-cell-config">' + esc(m.config) + '</td>';

    html += '<td class="cm-cell-var">';
    if (m.variations > 0) {
      html += '<span class="cm-var-group">';
      html += '<span class="cm-chip cm-chip--highlight cm-variation-chip" data-method-name="' + esc(m.name) + '">' + esc(m.variationLabel) + '</span>';
      html += '<button class="cm-chip cm-chip--highlight cm-var-add-btn" data-method-name="' + esc(m.name) + '"><i class="fa-solid fa-plus"></i></button>';
      html += '</span>';
    } else {
      html += '<button class="cm-add-variation" data-method-name="' + esc(m.name) + '">' + esc(m.variationLabel) + '</button>';
    }
    html += '</td>';

    html += '</tr>';

    return html;
  }

  function buildTable(groupId) {
    var filtered = groupId === 'all' ? METHODS : METHODS.filter(function (m) { return m.group === groupId; });

    var html = '<div class="cm-table-wrap pt-stagger-item">';
    html += '<table class="cm-table">';
    html += '<thead><tr>';
    html += '<th class="cm-th-name">Method</th>';
    html += '<th class="cm-th-cat1">Category</th>';
    html += '<th class="cm-th-cat2"></th>';
    html += '<th class="cm-th-act">Activities</th>';
    html += '<th class="cm-th-config">Default Config</th>';
    html += '<th class="cm-th-var">Variations</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    filtered.forEach(function (m) {
      html += buildMethodRow(m);
    });

    html += '</tbody></table></div>';
    return html;
  }

  // ── Page assembly ──

  function renderContent(wrap, groupId) {
    var contentEl = wrap.querySelector('.cm-content');
    if (!contentEl) return;
    contentEl.innerHTML = buildToolbar() + buildTable(groupId);
  }

  function getBodyHTML(activeId) {
    var html = '<h1 class="cm-page-title pt-stagger-item">Calculation methods</h1>';
    html += '<div class="cm-layout">';
    html += buildSidebar(activeId);
    html += '<div class="cm-content">';
    html += buildToolbar() + buildTable(activeId);
    html += '</div>';
    html += '</div>';
    return html;
  }

  // openACModal is now in activity-collection.js (window.openACModal)

  window.getCalcMethodsPageContent = function () {
    var activeGroup = 'all';
    var wrap = document.createElement('div');
    wrap.className = 'cm-page';
    wrap.innerHTML = getBodyHTML(activeGroup);

    wrap.querySelectorAll('.cm-sidebar-item').forEach(function (item) {
      item.addEventListener('click', function () {
        activeGroup = item.dataset.catId;
        wrap.querySelectorAll('.cm-sidebar-item').forEach(function (i) {
          i.classList.remove('cm-sidebar-item--active');
        });
        item.classList.add('cm-sidebar-item--active');
        renderContent(wrap, activeGroup);
      });
    });

    wrap.addEventListener('click', function (e) {
      // "+ Add variation" text link or "+" icon button → open builder
      var addBtn = e.target.closest('.cm-add-variation') || e.target.closest('.cm-var-add-btn');
      if (addBtn) {
        e.stopPropagation();
        var name = addBtn.getAttribute('data-method-name') || (addBtn.closest('.cm-row') && addBtn.closest('.cm-row').getAttribute('data-method-name'));
        if (name && window.openVariationBuilder) window.openVariationBuilder(name);
        return;
      }

      var row = e.target.closest('.cm-row');
      if (row) {
        var name = row.getAttribute('data-method-name');
        if (name && window.openACModal) window.openACModal(name);
      }
    });

    return wrap;
  };

  window._vbMethodDetails = METHOD_DETAILS;

})();
