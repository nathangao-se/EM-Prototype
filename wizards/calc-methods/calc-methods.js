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
      activities: 4, config: 'Location + Market', variations: 0, variationLabel: '+ Add variation' },
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
      activities: 12, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },
    { group: 'transport', name: 'Employee Commuting', subtitle: 'Daily commute and WFH (Cat 7)',
      category: 'Transport', categoryIcon: 'fa-solid fa-car', catLabel: 'Cat 7',
      activities: 6, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },
    { group: 'transport', name: 'Downstream Transportation', subtitle: 'Outbound logistics (Cat 9)',
      category: 'Transport', categoryIcon: 'fa-solid fa-truck', catLabel: 'Cat 9',
      activities: 8, config: 'TTW + WTT', variations: 0, variationLabel: '+ Add variation' },

    // ── Goods & Services ──
    { group: 'goods', name: 'Purchased Goods & Services', subtitle: 'Upstream goods and services (Cat 1)',
      category: 'Goods', categoryIcon: 'fa-solid fa-boxes-stacked', catLabel: 'Cat 1',
      activities: 14, config: 'Cradle-to-Gate', variations: 0, variationLabel: '+ Add variation' },
    { group: 'goods', name: 'Capital Goods', subtitle: 'Purchased capital assets (Cat 2)',
      category: 'Goods', categoryIcon: 'fa-solid fa-boxes-stacked', catLabel: 'Cat 2',
      activities: 10, config: 'Cradle-to-Gate', variations: 0, variationLabel: '+ Add variation' },
    { group: 'goods', name: 'Waste in Operations', subtitle: 'Waste disposal and treatment (Cat 5)',
      category: 'Goods', categoryIcon: 'fa-solid fa-recycle', catLabel: 'Cat 5',
      activities: 7, config: 'Treatment', variations: 0, variationLabel: '+ Add variation' },

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
        { title: 'ACME Corp - Stationary Combustion' },
        { title: 'ACME Corp - Stationary Combustion' }
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

  function getCollectionForMethod(methodName) {
    var detail = METHOD_DETAILS[methodName];
    if (!detail) return null;
    var collection = { main: detail, variations: detail.variations || [] };
    collection.variations = collection.variations.map(function (v) {
      return {
        title: v.title,
        decisions: v.decisions || detail.decisions,
        dataPaths: v.dataPaths || detail.dataPaths,
        lifecycle: v.lifecycle || detail.lifecycle,
        activityTypes: v.activityTypes || detail.activityTypes
      };
    });
    return collection;
  }

  function chipHTML(label, type) {
    var cls = 'ac-chip';
    if (type === 'green') cls += ' ac-chip--green';
    else if (type === 'orange') cls += ' ac-chip--orange';
    else if (type === 'blue') cls += ' ac-chip--blue';
    else cls += ' ac-chip--grey';
    return '<span class="' + cls + '">' + esc(label) + '</span>';
  }

  function buildACSection(title, bodyHTML) {
    return '<div class="ac-section">' +
      '<div class="ac-section-header"><span class="ac-section-title">' + esc(title) + '</span><div class="ac-section-line"></div></div>' +
      '<div class="ac-section-body">' + bodyHTML + '</div></div>';
  }

  function buildACCard(data, isMain, methodName) {
    var title = isMain ? methodName : ('Variation: ' + data.title);
    var html = '<div class="ac-card' + (isMain ? '' : ' ac-card--variation') + '">';

    html += '<div class="ac-card-title">' + esc(title) + '</div>';
    html += '<div class="ac-card-divider"></div>';
    html += '<div class="ac-card-body">';

    // Decision points
    var dpHTML = '';
    data.decisions.forEach(function (d) {
      dpHTML += '<div class="ac-list-item">' +
        '<div class="ac-list-item-text"><div class="ac-list-item-label">' + esc(d.label) + '</div>' +
        '<div class="ac-list-item-sub">' + esc(d.sub) + '</div></div>' +
        chipHTML(d.chip, d.chipType) + '</div>';
    });
    html += buildACSection('Decision points', dpHTML);

    // Data path priority
    var pathHTML = '';
    data.dataPaths.forEach(function (d, i) {
      pathHTML += '<div class="ac-list-item ac-list-item--numbered">' +
        '<span class="ac-list-num">' + (i + 1) + '.</span>' +
        '<span class="ac-list-item-label">' + esc(d.label) + '</span>' +
        chipHTML(d.chipLabel, d.chipType) + '</div>';
    });
    html += buildACSection('Data path priority', pathHTML);

    // Lifecycle stages → Scope assignment
    var lcHTML = '';
    data.lifecycle.forEach(function (l) {
      lcHTML += '<div class="ac-list-item ac-list-item--lifecycle">' +
        '<div class="ac-list-item-text"><div class="ac-list-item-label">' + esc(l.stage) + '</div>' +
        '<div class="ac-list-item-sub">' + esc(l.sub) + '</div></div>' +
        '<span class="ac-lifecycle-arrow"><i class="fa-solid fa-arrow-right"></i></span>' +
        chipHTML(l.scope, l.scopeType) + '</div>';
    });
    html += buildACSection('Lifecycle stages  \u2192  Scope assignment', lcHTML);

    // Activity types
    var atHTML = '';
    data.activityTypes.forEach(function (a) {
      atHTML += '<div class="ac-list-item">' +
        '<div class="ac-list-item-text"><div class="ac-list-item-label">' + esc(a.name) + '</div>' +
        '<div class="ac-list-item-sub">' + esc(a.sub) + '</div></div></div>';
    });
    var atTitle = 'Activity types';
    var atHeaderExtra = '<span class="ac-chip ac-chip--grey" style="margin-left:8px;">' + data.activityTypes.length + ' types</span>';
    html += '<div class="ac-section">' +
      '<div class="ac-section-header"><span class="ac-section-title">' + esc(atTitle) + '</span>' + atHeaderExtra + '<div class="ac-section-line"></div></div>' +
      '<div class="ac-section-body">' + atHTML + '</div></div>';

    html += '</div>';

    // Footer
    html += '<div class="ac-card-footer">';
    if (isMain) {
      html += '<button class="btn btn-outline btn-small ac-btn-exit" data-ac-action="exit">Exit</button>';
      html += '<button class="btn btn-primary btn-small ac-btn-add">+ Add variation</button>';
    } else {
      html += '<div class="ac-card-footer-spacer"></div>';
      html += '<button class="ac-btn-delete"><i class="fa-regular fa-trash-can"></i> Delete</button>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function buildACModal(methodName) {
    var collection = getCollectionForMethod(methodName);
    if (!collection) return null;

    var html = '<div class="ac-overlay">';
    html += '<div class="ac-modal">';
    html += '<div class="ac-modal-body">';

    html += buildACCard(collection.main, true, methodName);

    collection.variations.forEach(function (v) {
      html += buildACCard(v, false, methodName);
    });

    html += '</div></div></div>';
    return html;
  }

  function equalizeACRows(overlay) {
    var allCards = overlay.querySelectorAll('.ac-card');
    if (allCards.length < 2) return;

    // Equalize titles
    var titles = overlay.querySelectorAll('.ac-card-title');
    var maxTitle = 0;
    titles.forEach(function (t) { t.style.minHeight = ''; var h = t.offsetHeight; if (h > maxTitle) maxTitle = h; });
    titles.forEach(function (t) { t.style.minHeight = maxTitle + 'px'; });

    // Equalize body sections
    var bodies = overlay.querySelectorAll('.ac-card-body');
    var sectionCount = 4;
    for (var i = 0; i < sectionCount; i++) {
      var maxH = 0;
      var sections = [];
      bodies.forEach(function (card) {
        var sec = card.children[i];
        if (sec) {
          sec.style.minHeight = '';
          sections.push(sec);
          var h = sec.offsetHeight;
          if (h > maxH) maxH = h;
        }
      });
      sections.forEach(function (sec) {
        sec.style.minHeight = maxH + 'px';
      });
    }

    // Equalize footers
    var footers = overlay.querySelectorAll('.ac-card-footer');
    var maxFooter = 0;
    footers.forEach(function (f) { f.style.minHeight = ''; var h = f.offsetHeight; if (h > maxFooter) maxFooter = h; });
    footers.forEach(function (f) { f.style.minHeight = maxFooter + 'px'; });
  }

  // ── Sidebar ──

  function buildSidebar(activeId) {
    var html = '<div class="cm-sidebar">';
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
    var html = '<div class="cm-toolbar">';
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

    html += '<td class="cm-cell-config">';
    html += '<span class="cm-chip cm-chip--plain">';
    html += '<i class="fa-solid fa-gear cm-chip-icon"></i>';
    html += '<span>' + esc(m.config) + '</span>';
    html += '</span>';
    html += '</td>';

    html += '<td class="cm-cell-var">';
    if (m.variations > 0) {
      html += '<span class="cm-chip cm-chip--highlight cm-variation-chip" data-method-name="' + esc(m.name) + '">' + esc(m.variationLabel) + '</span>';
    } else {
      html += '<button class="cm-add-variation">' + esc(m.variationLabel) + '</button>';
    }
    html += '</td>';

    html += '</tr>';

    return html;
  }

  function buildTable(groupId) {
    var filtered = groupId === 'all' ? METHODS : METHODS.filter(function (m) { return m.group === groupId; });

    var html = '<div class="cm-table-wrap">';
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
    var html = '<h1 class="cm-page-title">Calculation methods</h1>';
    html += '<div class="cm-layout">';
    html += buildSidebar(activeId);
    html += '<div class="cm-content">';
    html += buildToolbar() + buildTable(activeId);
    html += '</div>';
    html += '</div>';
    return html;
  }

  function openACModal(methodName) {
    var existing = document.querySelector('.ac-overlay');
    if (existing) existing.remove();

    var modalHTML = buildACModal(methodName);
    if (!modalHTML) return;

    var container = document.createElement('div');
    container.innerHTML = modalHTML;
    var overlay = container.firstChild;
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add('ac-overlay--open');
      equalizeACRows(overlay);
    });

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('[data-ac-action="exit"]') || e.target === overlay) {
        overlay.classList.remove('ac-overlay--open');
        setTimeout(function () { overlay.remove(); }, 200);
        return;
      }
      // "Add variation" inside AC modal → close modal, open builder
      if (e.target.closest('.ac-btn-add')) {
        overlay.classList.remove('ac-overlay--open');
        setTimeout(function () {
          overlay.remove();
          if (window.openVariationBuilder) window.openVariationBuilder(methodName);
        }, 200);
      }
    });
  }

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
      // "Add variation" button in table → open builder
      var addBtn = e.target.closest('.cm-add-variation');
      if (addBtn) {
        e.stopPropagation();
        var row = addBtn.closest('.cm-row');
        var name = row && row.getAttribute('data-method-name');
        if (name && window.openVariationBuilder) window.openVariationBuilder(name);
        return;
      }

      var row = e.target.closest('.cm-row');
      if (row) {
        var name = row.getAttribute('data-method-name');
        if (name) openACModal(name);
      }
    });

    return wrap;
  };

  window._vbMethodDetails = METHOD_DETAILS;

})();
