/* ========================================
   GHG Calculation Engine – Isolated JS
   Works standalone (ghg-engine.html) AND
   embedded via page transition from main app.

   Exposed API:
     window.getGhgEnginePageContent() → DOM node
     window.bindGhgEngine(container)  → wires interactivity
   ======================================== */
(function () {
  'use strict';

  var esc = window.DomUtils.esc;

  /* ==============================================
     DATA
     ============================================== */

  var BREAKDOWN_DATA = [
    { entity: 'North America HQ', s1: 52.3, s2: 18.4, s3: 312.6, total: 383.3, pct: 36.1,
      children: [
        { cat: 'Stationary Combustion', s1: 34.1, s2: 0, s3: 0, total: 34.1, pct: 3.2 },
        { cat: 'Purchased Electricity', s1: 0, s2: 18.4, s3: 0, total: 18.4, pct: 1.7 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 186.2, total: 186.2, pct: 17.5 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 78.4, total: 78.4, pct: 7.4 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 48.0, total: 48.0, pct: 4.5 }
      ] },
    { entity: 'EMEA Regional Office', s1: 28.1, s2: 12.6, s3: 248.3, total: 289.0, pct: 27.2,
      children: [
        { cat: 'Stationary Combustion', s1: 18.2, s2: 0, s3: 0, total: 18.2, pct: 1.7 },
        { cat: 'Purchased Electricity', s1: 0, s2: 12.6, s3: 0, total: 12.6, pct: 1.2 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 142.1, total: 142.1, pct: 13.4 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 56.2, total: 56.2, pct: 5.3 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 50.0, total: 50.0, pct: 4.7 }
      ] },
    { entity: 'APAC Manufacturing', s1: 36.4, s2: 10.8, s3: 224.6, total: 271.8, pct: 25.6,
      children: [
        { cat: 'Mobile Combustion', s1: 22.4, s2: 0, s3: 0, total: 22.4, pct: 2.1 },
        { cat: 'Fugitive Emissions', s1: 4.0, s2: 0, s3: 0, total: 4.0, pct: 0.4 },
        { cat: 'Purchased Electricity', s1: 0, s2: 10.8, s3: 0, total: 10.8, pct: 1.0 },
        { cat: 'Purchased Goods & Services', s1: 0, s2: 0, s3: 84.0, total: 84.0, pct: 7.9 },
        { cat: 'Upstream Transport', s1: 0, s2: 0, s3: 84.2, total: 84.2, pct: 7.9 },
        { cat: 'Waste in Operations', s1: 0, s2: 0, s3: 52.7, total: 52.7, pct: 5.0 }
      ] },
    { entity: 'LATAM Distribution', s1: 7.8, s2: 3.4, s3: 106.6, total: 117.8, pct: 11.1,
      children: [
        { cat: 'Stationary Combustion', s1: 5.9, s2: 0, s3: 0, total: 5.9, pct: 0.6 },
        { cat: 'Purchased Electricity', s1: 0, s2: 3.4, s3: 0, total: 3.4, pct: 0.3 },
        { cat: 'Business Travel', s1: 0, s2: 0, s3: 22.2, total: 22.2, pct: 2.1 },
        { cat: 'Employee Commuting', s1: 0, s2: 0, s3: 41.4, total: 41.4, pct: 3.9 },
        { cat: 'Fuel & Energy Activities', s1: 0, s2: 0, s3: 46.7, total: 46.7, pct: 4.4 }
      ] }
  ];

  var LINEAGE_DATA = [
    { activity: 'Natural Gas Heating – Building A', entity: 'North America HQ', method: 'Activity-Based',
      value: '14,200 m\u00B3', ef: '2.02 kg CO\u2082e/m\u00B3', emissions: 28.7, status: 'success',
      lineage: { source: 'Utility Bill – ConEd Dec 2025', sourceType: 'Primary Data', period: 'Oct–Dec 2025',
        efName: 'Natural Gas – Pipeline', efSource: 'EPA GHG EF Hub 2024', efRegion: 'United States',
        formula: '14,200 m\u00B3 \u00D7 2.02 kg CO\u2082e/m\u00B3 = 28,684 kg = 28.7 tCO\u2082e',
        checks: ['Source data validated', 'EF within expected range', 'Period aligned', 'Unit conversion verified'] } },
    { activity: 'Electricity Consumption – All Floors', entity: 'North America HQ', method: 'Activity-Based',
      value: '82,400 kWh', ef: '0.223 kg CO\u2082e/kWh', emissions: 18.4, status: 'success',
      lineage: { source: 'Smart Meter Data – Q4 Aggregate', sourceType: 'Metered Data', period: 'Oct–Dec 2025',
        efName: 'US Grid Average – NERC RFC', efSource: 'eGRID 2024', efRegion: 'RFC East',
        formula: '82,400 kWh \u00D7 0.223 kg CO\u2082e/kWh = 18,375 kg = 18.4 tCO\u2082e',
        checks: ['Source data validated', 'EF region-specific', 'Period aligned', 'Cross-checked with billing'] } },
    { activity: 'Business Travel – Flights', entity: 'EMEA Regional Office', method: 'Distance-Based',
      value: '234,000 km', ef: '0.24 kg CO\u2082e/km', emissions: 56.2, status: 'warning',
      lineage: { source: 'Travel Management System – SAP Concur', sourceType: 'System Extract', period: 'Oct–Dec 2025',
        efName: 'Short-Haul Flight – Economy', efSource: 'DEFRA 2024', efRegion: 'United Kingdom',
        formula: '234,000 km \u00D7 0.24 kg CO\u2082e/km = 56,160 kg = 56.2 tCO\u2082e',
        checks: ['Source data validated', 'Mixed distance classes applied', 'Radiative forcing included'] } },
    { activity: 'IT Equipment Purchase', entity: 'APAC Manufacturing', method: 'Spend-Based',
      value: '$420,000', ef: '0.20 kg CO\u2082e/$', emissions: 84.0, status: 'info',
      lineage: { source: 'ERP System – SAP S/4HANA', sourceType: 'Financial Data', period: 'Oct–Dec 2025',
        efName: 'EEIO – Electronic Equipment', efSource: 'USEEIO v2.0', efRegion: 'Global',
        formula: '$420,000 \u00D7 0.20 kg CO\u2082e/$ = 84,000 kg = 84.0 tCO\u2082e',
        checks: ['Spend verified against POs', 'Currency converted to USD', 'EEIO category mapped'] } },
    { activity: 'Fleet Diesel Consumption', entity: 'LATAM Distribution', method: 'Activity-Based',
      value: '8,200 liters', ef: '2.68 kg CO\u2082e/L', emissions: 22.0, status: 'success',
      lineage: { source: 'Fleet Management System', sourceType: 'Primary Data', period: 'Oct–Dec 2025',
        efName: 'Diesel – Mobile Sources', efSource: 'GHG Protocol EF Database 2024', efRegion: 'Latin America',
        formula: '8,200 L \u00D7 2.68 kg CO\u2082e/L = 21,976 kg = 22.0 tCO\u2082e',
        checks: ['Fuel receipts matched', 'EF region-appropriate', 'Odometer cross-check passed'] } }
  ];

  var EAD_DATA = [
    { entity: 'All Entities', activity: 'Purchased Goods', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$2.4M', tco2e: '412.0', efSource: 'EEIO 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Spend-based', breadcrumb: ['All Entities', 'Purchased Goods', 'Scope 3'],
      result: '412.0', resultUnit: 'kg tCO\u2082e',
      input: '$2.4M', period: 'Oct-Dec 2025', dataSource: 'API/Procurement', specificity: '62/100',
      efVal: '0.172', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Electricity', scope: 'Scope 2', scopeCls: 's2',
      scopeLabel: 'Scope 2', actData: '890.0k kWh', tco2e: '323.9', efSource: 'eGRID 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Manufacturing', 'Electricity', 'Scope 2'],
      result: '323.9', resultUnit: 'kg tCO\u2082e',
      input: '890.0k kWh', period: 'Oct-Dec 2025', dataSource: 'Smart Meter', specificity: '88/100',
      efVal: '0.364', efUnit: 'kg tCO\u2082e/kWh', efSrc: 'eGRID 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'All Entities', activity: 'Purchased Goods', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$1.8M', tco2e: '309.0', efSource: 'EEIO 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Spend-based', breadcrumb: ['All Entities', 'Purchased Goods', 'Scope 3'],
      result: '309.0', resultUnit: 'kg tCO\u2082e',
      input: '$1.8M', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '54/100',
      efVal: '0.172', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'All Entities', activity: 'Use of Products', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$1.5M', tco2e: '255.0', efSource: 'EEIO 2024', quality: 'Low', qualityCls: 'low',
      method: 'Spend-based', breadcrumb: ['All Entities', 'Use of Products', 'Scope 3'],
      result: '255.0', resultUnit: 'kg tCO\u2082e',
      input: '$1.5M', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '42/100',
      efVal: '0.170', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Natural Gas', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '45.0k therms', tco2e: '238.9', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Manufacturing', 'Natural Gas', 'Scope 1'],
      result: '238.9', resultUnit: 'kg tCO\u2082e',
      input: '45.0k therms', period: 'Oct-Dec 2025', dataSource: 'Utility Bills', specificity: '90/100',
      efVal: '5.311', efUnit: 'kg tCO\u2082e/therm', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Capital Goods', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$1.2M', tco2e: '285.2', efSource: 'EEIO 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Spend-based', breadcrumb: ['Manufacturing', 'Capital Goods', 'Scope 3'],
      result: '285.2', resultUnit: 'kg tCO\u2082e',
      input: '$1.2M', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '50/100',
      efVal: '0.238', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Refrigerants', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '125 kg', tco2e: '156.3', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Manufacturing', 'Refrigerants', 'Scope 1'],
      result: '156.3', resultUnit: 'kg tCO\u2082e',
      input: '125 kg', period: 'Oct-Dec 2025', dataSource: 'Maintenance Logs', specificity: '85/100',
      efVal: '1.250', efUnit: 'kg tCO\u2082e/kg', efSrc: 'EPA 2024', gases: 'HFCs', gwp: 'AR5 (100-year)' },
    { entity: 'HQ Building', activity: 'Capital Goods', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$850k', tco2e: '145.2', efSource: 'EEIO 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Spend-based', breadcrumb: ['HQ Building', 'Capital Goods', 'Scope 3'],
      result: '145.2', resultUnit: 'kg tCO\u2082e',
      input: '$850k', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '48/100',
      efVal: '0.171', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Fleet Vehicles', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '15.2k gallons', tco2e: '135.1', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Distribution', 'Fleet Vehicles', 'Scope 1'],
      result: '135.1', resultUnit: 'kg tCO\u2082e',
      input: '15.2k gallons', period: 'Oct-Dec 2025', dataSource: 'Fleet Management', specificity: '92/100',
      efVal: '8.887', efUnit: 'kg tCO\u2082e/gal', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Processing of Products', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$650k', tco2e: '110.5', efSource: 'EEIO 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Spend-based', breadcrumb: ['Distribution', 'Processing of Products', 'Scope 3'],
      result: '110.5', resultUnit: 'kg tCO\u2082e',
      input: '$650k', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '46/100',
      efVal: '0.170', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Refrigerants', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '85 kg', tco2e: '106.3', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Manufacturing', 'Refrigerants', 'Scope 1'],
      result: '106.3', resultUnit: 'kg tCO\u2082e',
      input: '85 kg', period: 'Oct-Dec 2025', dataSource: 'Maintenance Logs', specificity: '85/100',
      efVal: '1.250', efUnit: 'kg tCO\u2082e/kg', efSrc: 'EPA 2024', gases: 'HFCs', gwp: 'AR5 (100-year)' },
    { entity: 'All Entities', activity: 'Upstream Transport', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '320.0k ton-miles', tco2e: '89.6', efSource: 'EPA 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Activity-based', breadcrumb: ['All Entities', 'Upstream Transport', 'Scope 3'],
      result: '89.6', resultUnit: 'kg tCO\u2082e',
      input: '320.0k ton-miles', period: 'Oct-Dec 2025', dataSource: 'Logistics System', specificity: '60/100',
      efVal: '0.000280', efUnit: 'kg tCO\u2082e/ton-mi', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'HQ Building', activity: 'Electricity', scope: 'Scope 2', scopeCls: 's2',
      scopeLabel: 'Scope 2', actData: '245.0k kWh', tco2e: '89.2', efSource: 'eGRID 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['HQ Building', 'Electricity', 'Scope 2'],
      result: '89.2', resultUnit: 'kg tCO\u2082e',
      input: '245.0k kWh', period: 'Oct-Dec 2025', dataSource: 'Smart Meter', specificity: '88/100',
      efVal: '0.364', efUnit: 'kg tCO\u2082e/kWh', efSrc: 'eGRID 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'All Entities', activity: 'Franchises', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$450k', tco2e: '76.5', efSource: 'EEIO 2024', quality: 'Low', qualityCls: 'low',
      method: 'Spend-based', breadcrumb: ['All Entities', 'Franchises', 'Scope 3'],
      result: '76.5', resultUnit: 'kg tCO\u2082e',
      input: '$450k', period: 'Oct-Dec 2025', dataSource: 'ERP System', specificity: '35/100',
      efVal: '0.170', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Waste Disposal', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '450 tons', tco2e: '67.2', efSource: 'EPA 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Activity-based', breadcrumb: ['Distribution', 'Waste Disposal', 'Scope 3'],
      result: '67.2', resultUnit: 'kg tCO\u2082e',
      input: '450 tons', period: 'Oct-Dec 2025', dataSource: 'Waste Hauler', specificity: '65/100',
      efVal: '0.149', efUnit: 'kg tCO\u2082e/ton', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'HQ Building', activity: 'Natural Gas', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '12.4k therms', tco2e: '66.1', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['HQ Building', 'Natural Gas', 'Scope 1'],
      result: '66.1', resultUnit: 'kg tCO\u2082e',
      input: '12.4k therms', period: 'Oct-Dec 2025', dataSource: 'Utility Bills', specificity: '90/100',
      efVal: '5.311', efUnit: 'kg tCO\u2082e/therm', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Investments', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '$320k', tco2e: '54.4', efSource: 'EEIO 2024', quality: 'Low', qualityCls: 'low',
      method: 'Spend-based', breadcrumb: ['Distribution', 'Investments', 'Scope 3'],
      result: '54.4', resultUnit: 'kg tCO\u2082e',
      input: '$320k', period: 'Oct-Dec 2025', dataSource: 'Financial System', specificity: '30/100',
      efVal: '0.170', efUnit: 'kg tCO\u2082e', efSrc: 'EEIO 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Downstream Transport', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '180.0k ton-miles', tco2e: '50.4', efSource: 'EPA 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Activity-based', breadcrumb: ['Distribution', 'Downstream Transport', 'Scope 3'],
      result: '50.4', resultUnit: 'kg tCO\u2082e',
      input: '180.0k ton-miles', period: 'Oct-Dec 2025', dataSource: 'Logistics System', specificity: '58/100',
      efVal: '0.000280', efUnit: 'kg tCO\u2082e/ton-mi', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Manufacturing', activity: 'Waste Disposal', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '320 tons', tco2e: '47.7', efSource: 'EPA 2024', quality: 'Medium', qualityCls: 'medium',
      method: 'Activity-based', breadcrumb: ['Manufacturing', 'Waste Disposal', 'Scope 3'],
      result: '47.7', resultUnit: 'kg tCO\u2082e',
      input: '320 tons', period: 'Oct-Dec 2025', dataSource: 'Waste Hauler', specificity: '65/100',
      efVal: '0.149', efUnit: 'kg tCO\u2082e/ton', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Electricity', scope: 'Scope 2', scopeCls: 's2',
      scopeLabel: 'Scope 2', actData: '125.0k kWh', tco2e: '45.5', efSource: 'eGRID 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Distribution', 'Electricity', 'Scope 2'],
      result: '45.5', resultUnit: 'kg tCO\u2082e',
      input: '125.0k kWh', period: 'Oct-Dec 2025', dataSource: 'Smart Meter', specificity: '88/100',
      efVal: '0.364', efUnit: 'kg tCO\u2082e/kWh', efSrc: 'eGRID 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'HQ Building', activity: 'Upstream Leased Assets', scope: 'Scope 3', scopeCls: 's3',
      scopeLabel: 'Scope 3', actData: '125.0k kWh', tco2e: '45.5', efSource: 'eGRID 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['HQ Building', 'Upstream Leased Assets', 'Scope 3'],
      result: '45.5', resultUnit: 'kg tCO\u2082e',
      input: '125.0k kWh', period: 'Oct-Dec 2025', dataSource: 'Smart Meter', specificity: '75/100',
      efVal: '0.364', efUnit: 'kg tCO\u2082e/kWh', efSrc: 'eGRID 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' },
    { entity: 'Distribution', activity: 'Natural Gas', scope: 'Scope 1', scopeCls: 's1',
      scopeLabel: 'Scope 1', actData: '8.5k therms', tco2e: '45.1', efSource: 'EPA 2024', quality: 'High', qualityCls: 'high',
      method: 'Activity-based', breadcrumb: ['Distribution', 'Natural Gas', 'Scope 1'],
      result: '45.1', resultUnit: 'kg tCO\u2082e',
      input: '8.5k therms', period: 'Oct-Dec 2025', dataSource: 'Utility Bills', specificity: '90/100',
      efVal: '5.311', efUnit: 'kg tCO\u2082e/therm', efSrc: 'EPA 2024', gases: 'CO\u2082, CH\u2084, N\u2082O', gwp: 'AR5 (100-year)' }
  ];

  function buildEadDetail(d) {
    return '' +
      '<div style="display:flex;flex-direction:column;gap:8px">' +
        '<div class="ghg-ead-section-label">Lineage, methodology, and decisions</div>' +
        '<div class="ghg-ead-breadcrumb">' + d.breadcrumb.map(function (b, i) {
          return (i > 0 ? '<span class="ghg-ead-arrow"><i class="fa-solid fa-arrow-right" style="font-size:10px"></i></span>' : '') + '<span class="ghg-ead-crumb">' + esc(b) + '</span>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="ghg-ead-divider"></div>' +
      '<div style="display:flex;flex-direction:column;gap:16px">' +
        '<div style="display:flex;flex-direction:column;gap:1px"><div class="ghg-ead-pair-label">Calculation method</div>' +
          '<div style="display:flex;gap:16px;align-items:center"><div class="ghg-ead-pair-value" style="flex:1;min-width:0">' + esc(d.method) + '</div>' +
          '<span class="ghg-scope-chip ghg-scope-chip--' + d.scopeCls + '" style="width:80px;flex-shrink:0">' + esc(d.scopeLabel) + '</span></div></div>' +
        '<div class="ghg-ead-row-pair">' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:4px"><div class="ghg-ead-pair-label">Quality</div><div class="ghg-ead-pair-value">' + esc(d.quality) + '</div></div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:4px"><div class="ghg-ead-pair-label">EF Source</div><div class="ghg-ead-pair-value">' + esc(d.efSource) + '</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="ghg-ead-divider"></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' +
        '<div class="ghg-ead-section-label">Calculations</div>' +
        '<div class="ghg-ead-calc-result"><div class="ghg-ead-calc-result-label">Final result</div><div class="ghg-ead-calc-result-val">' + esc(d.result) + ' <span>' + d.resultUnit + '</span></div></div>' +
      '<div class="ghg-ead-details-card">' +
        '<div class="ghg-ead-details-top">' +
          '<div class="ghg-ead-details-top-col"><div class="ghg-ead-details-top-label">Input</div><div class="ghg-ead-details-top-val">' + esc(d.input) + '</div></div>' +
          '<div class="ghg-ead-details-top-vdiv"></div>' +
          '<div class="ghg-ead-details-top-col"><div class="ghg-ead-details-top-label">Emissions factors</div><div class="ghg-ead-details-top-val">' + esc(d.efVal) + ' <span>' + d.efUnit + '</span></div></div>' +
          '<div class="ghg-ead-details-multiply"><i class="fa-solid fa-xmark"></i></div>' +
        '</div>' +
        '<div class="ghg-ead-details-bottom">' +
          '<div class="ghg-ead-details-col">' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">Period</div><div class="ghg-ead-calc-meta-val">' + esc(d.period) + '</div></div>' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">Data source</div><div class="ghg-ead-calc-meta-val">' + esc(d.dataSource) + '</div></div>' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">Specificity score</div><div class="ghg-ead-calc-meta-val">' + esc(d.specificity) + '</div></div>' +
          '</div>' +
          '<div class="ghg-ead-details-vdiv"></div>' +
          '<div class="ghg-ead-details-col">' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">Source</div><div class="ghg-ead-calc-meta-val">' + esc(d.efSrc) + '</div></div>' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">Gases covered</div><div class="ghg-ead-calc-meta-val">' + d.gases + '</div></div>' +
            '<div class="ghg-ead-calc-meta"><div class="ghg-ead-calc-meta-label">GWP Version</div><div class="ghg-ead-calc-meta-val">' + esc(d.gwp) + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>' +
      '<div class="ghg-ead-divider"></div>' +
      '<div class="ghg-ead-validation">' +
        '<div class="ghg-ead-section-label">Validation</div>' +
        '<div class="ghg-ead-vcheck"><i class="fa-solid fa-circle-check"></i> Scope attribution verified</div>' +
        '<div class="ghg-ead-vcheck"><i class="fa-solid fa-circle-check"></i> No double-counting detected</div>' +
        '<div class="ghg-ead-vcheck"><i class="fa-solid fa-circle-check"></i> Boundary: Operational control applied</div>' +
      '</div>';
  }

  function buildEadTableRows() {
    return EAD_DATA.map(function (d, i) {
      return '<tr class="ghg-ead-row' + (i === 0 ? ' ghg-ead-row--selected' : '') + '" data-ead="' + i + '">' +
        '<td>' + esc(d.entity) + '</td>' +
        '<td>' + esc(d.activity) + '</td>' +
        '<td><span class="ghg-scope-chip ghg-scope-chip--' + d.scopeCls + '">' + esc(d.scopeLabel) + '</span></td>' +
        '<td>' + esc(d.actData) + '</td>' +
        '<td class="num">' + esc(d.tco2e) + '</td>' +
        '<td>' + esc(d.efSource) + '</td>' +
        '<td><span class="ghg-ead-badge ghg-ead-badge--' + d.qualityCls + '">' + esc(d.quality) + '</span></td>' +
      '</tr>';
    }).join('');
  }

  /* ==============================================
     HTML BUILDERS
     ============================================== */

  function buildBreakdownHTML() {
    var html = '';
    BREAKDOWN_DATA.forEach(function (g, gi) {
      html += '<tr class="ghg-group-header" data-group="' + gi + '">' +
        '<td><span class="ghg-group-toggle"><i class="fa-solid fa-chevron-down"></i></span>' + esc(g.entity) + '</td>' +
        '<td class="num">' + g.s1.toFixed(1) + '</td><td class="num">' + g.s2.toFixed(1) + '</td>' +
        '<td class="num">' + g.s3.toFixed(1) + '</td><td class="num"><strong>' + g.total.toFixed(1) + '</strong></td>' +
        '<td class="num">' + g.pct.toFixed(1) + '%</td></tr>';
      g.children.forEach(function (c) {
        html += '<tr class="ghg-group-child" data-group-parent="' + gi + '">' +
          '<td>' + esc(c.cat) + '</td>' +
          '<td class="num">' + (c.s1 ? c.s1.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + (c.s2 ? c.s2.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + (c.s3 ? c.s3.toFixed(1) : '\u2014') + '</td>' +
          '<td class="num">' + c.total.toFixed(1) + '</td><td class="num">' + c.pct.toFixed(1) + '%</td></tr>';
      });
    });
    return html;
  }

  function statusBadge(s) {
    var map = { success: { cls: 'ghg-badge--success', icon: 'fa-circle-check', label: 'Verified' },
      warning: { cls: 'ghg-badge--warning', icon: 'fa-triangle-exclamation', label: 'Review' },
      info: { cls: 'ghg-badge--info', icon: 'fa-circle-info', label: 'Estimated' } };
    var m = map[s] || map.success;
    return '<span class="ghg-badge ' + m.cls + '"><i class="fa-solid ' + m.icon + '"></i> ' + m.label + '</span>';
  }

  function buildLineageHTML() {
    var html = '';
    LINEAGE_DATA.forEach(function (r, i) {
      html += '<tr class="ghg-expand-row" data-lineage="' + i + '">' +
        '<td><span class="ghg-expand-icon"><i class="fa-solid fa-chevron-right"></i></span></td>' +
        '<td>' + esc(r.activity) + '</td><td>' + esc(r.entity) + '</td><td>' + esc(r.method) + '</td>' +
        '<td class="num">' + esc(r.value) + '</td><td class="num">' + esc(r.ef) + '</td>' +
        '<td class="num"><strong>' + r.emissions.toFixed(1) + '</strong></td><td>' + statusBadge(r.status) + '</td></tr>';
      var l = r.lineage;
      html += '<tr class="ghg-expanded-content" data-lineage-detail="' + i + '"><td colspan="8"><div class="ghg-expanded-inner"><div class="ghg-lineage-panel">' +
        '<div class="ghg-lineage-header"><h4><i class="fa-solid fa-diagram-project"></i> Calculation Lineage</h4><p>' + esc(r.activity) + ' \u2013 ' + esc(r.entity) + '</p></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-database"></i> Source Data</div><div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.source) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Type</div><div class="ghg-lineage-item-value">' + esc(l.sourceType) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Period</div><div class="ghg-lineage-item-value">' + esc(l.period) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Activity Value</div><div class="ghg-lineage-item-value">' + esc(r.value) + '</div></div></div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-scale-balanced"></i> Emission Factor</div><div class="ghg-lineage-grid">' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Factor Name</div><div class="ghg-lineage-item-value">' + esc(l.efName) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Source</div><div class="ghg-lineage-item-value">' + esc(l.efSource) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Region</div><div class="ghg-lineage-item-value">' + esc(l.efRegion) + '</div></div>' +
        '<div class="ghg-lineage-item"><div class="ghg-lineage-item-label">Value</div><div class="ghg-lineage-item-value">' + esc(r.ef) + '</div></div></div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-calculator"></i> Calculation</div>' +
        '<div class="ghg-lineage-calc">' + esc(l.formula) + '</div></div>' +
        '<div class="ghg-lineage-section"><div class="ghg-lineage-section-title"><i class="fa-solid fa-shield-check"></i> Validation</div><div class="ghg-lineage-checks">' +
        l.checks.map(function (c) { return '<div class="ghg-lineage-check"><i class="fa-solid fa-circle-check"></i> ' + esc(c) + '</div>'; }).join('') +
        '</div></div></div></div></td></tr>';
    });
    return html;
  }

  /* ==============================================
     EFA TAB — data & builders
     ============================================== */

  var EFA_ENTITIES = [
    { name: 'Paris HQ', sub: 'Headquarters \u2022 Undefined', region: 'EU', type: 'Headquarters', actCount: 12, records: '45,230', coverage: 96, issues: [],
      activities: [
        { name: 'Diesel - Fleet vehicles', value: '2,450L', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Natural Gas - Heating', value: '1,200 m\u00B3', date: 'Jan 2026', tag: 'geo', tagLabel: 'Geo' },
        { name: 'Electricity - Grid', value: '45,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Business Travel - Air', value: '$12,500', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Diesel - Fleet Vehicles', entity: 'Paris HQ', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'Fleet_Data_Q1.xlsx', specificity: 75,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Diesel - Fleet vehicles'],['Sanitized value','2,450 L'],['EF_ActivityID','Fuel_Diesel_Mobile'],['Scope','Scope 1 - Direct Emissions']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','Diesel (100% Mineral)'],['Dataset Source','DEFRA 2024'],['Emission Factor','2.02 kg CO\u2082e/m\u00B3'],['Lifecycle','WTT: 0.34 + TTW: 1.68 = 2.02']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 3/5 per method' },
          { icon: 'check', text: 'FR factors for FR entity', note: 'exact geo match' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'London Office', sub: 'Regional Office \u2022 Undefined', region: 'EU', type: 'Regional Office', actCount: 8, records: '23,000', coverage: 89,
      issues: [{ label: 'geo (0.01)', cls: 'geo' }],
      activities: [
        { name: 'Electricity - Grid', value: '32,000 kWh', date: 'Jan 2026', tag: 'geo', tagLabel: 'Geo' },
        { name: 'Natural Gas - Heating', value: '800 m\u00B3', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'London Office', method: 'Activity-based', date: 'Jan 2026',
        tag: 'geo', tagLabel: 'Geo', file: 'UK_Energy_Q1.xlsx', specificity: 60,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','32,000 kWh'],['EF_ActivityID','Grid_Electricity_UK'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','UK Grid Average 2024'],['Dataset Source','DEFRA 2024'],['Emission Factor','0.207 kg CO\u2082e/kWh'],['Lifecycle','Generation only']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'Berlin Factory', sub: 'Manufacturing \u2022 Undefined', region: 'EU', type: 'Manufacturing', actCount: 15, records: '312,000', coverage: 72,
      issues: [{ label: 'eur (3.40)', cls: 'old' }, { label: 'geo (2.10)', cls: 'geo' }],
      activities: [
        { name: 'Diesel - Fleet vehicles', value: '18,200L', date: 'Jan 2026', tag: 'old', tagLabel: 'Old' },
        { name: 'Electricity - Grid', value: '890,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Natural Gas - Heating', value: '5,400 m\u00B3', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Diesel - Fleet vehicles', entity: 'Berlin Factory', method: 'Activity-based', date: 'Jan 2026',
        tag: 'old', tagLabel: 'Old', file: 'DE_Fleet_Q1.xlsx', specificity: 55,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Diesel - Fleet vehicles'],['Sanitized value','18,200 L'],['EF_ActivityID','Fuel_Diesel_Mobile'],['Scope','Scope 1 - Direct Emissions']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','Diesel (100% Mineral)'],['Dataset Source','DEFRA 2022'],['Emission Factor','2.02 kg CO\u2082e/m\u00B3'],['Lifecycle','WTT: 0.34 + TTW: 1.68 = 2.02']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 3/5 per method' },
          { icon: 'warn', text: 'Outdated 2022 factor set', note: '2024 available' },
          { icon: 'check', text: 'DE factors for DE entity', note: 'exact geo match' }
        ]
      }
    },
    { name: 'NYC Branch', sub: 'Regional Office \u2022 Undefined', region: 'Americas', type: 'Regional Office', actCount: 10, records: '18,500', coverage: 100, issues: [],
      activities: [
        { name: 'Electricity - Grid', value: '65,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Business Travel - Air', value: '$8,900', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'NYC Branch', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'US_Energy_Q1.xlsx', specificity: 82,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','65,000 kWh'],['EF_ActivityID','Grid_Electricity_US'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','eGRID US Average 2024'],['Dataset Source','eGRID (EPA)'],['Emission Factor','0.386 kg CO\u2082e/kWh'],['Lifecycle','Generation + T&D']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: 'US factors for US entity', note: 'exact geo match' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'Tokyo Office', sub: 'Regional Office \u2022 Undefined', region: 'Asia-Pacific', type: 'Regional Office', actCount: 6, records: '12,400', coverage: 91, issues: [],
      activities: [
        { name: 'Electricity - Grid', value: '28,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Natural Gas - Heating', value: '600 m\u00B3', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'Tokyo Office', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'JP_Energy_Q1.xlsx', specificity: 70,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','28,000 kWh'],['EF_ActivityID','Grid_Electricity_JP'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','Japan Grid Average 2024'],['Dataset Source','MOE Japan'],['Emission Factor','0.457 kg CO\u2082e/kWh'],['Lifecycle','Generation + T&D']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'Sydney Office', sub: 'Regional Office \u2022 Undefined', region: 'Asia-Pacific', type: 'Regional Office', actCount: 5, records: '8,900', coverage: 94, issues: [],
      activities: [
        { name: 'Electricity - Grid', value: '18,500 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Business Travel - Air', value: '$6,200', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'Sydney Office', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'AU_Energy_Q1.xlsx', specificity: 72,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','18,500 kWh'],['EF_ActivityID','Grid_Electricity_AU'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','AU NEM Average 2024'],['Dataset Source','Clean Energy Regulator'],['Emission Factor','0.68 kg CO\u2082e/kWh'],['Lifecycle','Generation + T&D']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'Shanghai Plant', sub: 'Manufacturing \u2022 Undefined', region: 'Asia-Pacific', type: 'Manufacturing', actCount: 14, records: '156,000', coverage: 78,
      issues: [{ label: 'geo (3.20)', cls: 'geo' }],
      activities: [
        { name: 'Electricity - Grid', value: '1,200,000 kWh', date: 'Jan 2026', tag: 'geo', tagLabel: 'Geo' },
        { name: 'Natural Gas - Heating', value: '8,400 m\u00B3', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Diesel - Fleet vehicles', value: '12,800L', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'Shanghai Plant', method: 'Activity-based', date: 'Jan 2026',
        tag: 'geo', tagLabel: 'Geo', file: 'CN_Energy_Q1.xlsx', specificity: 50,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','1,200,000 kWh'],['EF_ActivityID','Grid_Electricity_CN'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','China Grid Average 2023'],['Dataset Source','IEA'],['Emission Factor','0.555 kg CO\u2082e/kWh'],['Lifecycle','Generation only']],
        rationale: [
          { icon: 'warn', text: 'Regional proxy factor used', note: 'partial geo match' },
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' }
        ]
      }
    },
    { name: 'Dubai Office', sub: 'Regional Office \u2022 Undefined', region: 'MEA', type: 'Regional Office', actCount: 4, records: '5,600', coverage: 65, issues: [],
      activities: [
        { name: 'Electricity - Grid', value: '42,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'District Cooling', value: '15,000 ton-hr', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'Dubai Office', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'AE_Energy_Q1.xlsx', specificity: 58,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','42,000 kWh'],['EF_ActivityID','Grid_Electricity_AE'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','UAE Grid Average 2024'],['Dataset Source','EAD'],['Emission Factor','0.42 kg CO\u2082e/kWh'],['Lifecycle','Generation only']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'S\u00E3o Paulo Office', sub: 'Regional Office \u2022 Undefined', region: 'Americas', type: 'Regional Office', actCount: 7, records: '14,200', coverage: 88, issues: [],
      activities: [
        { name: 'Electricity - Grid', value: '22,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Business Travel - Air', value: '$9,800', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Electricity - Grid', entity: 'S\u00E3o Paulo Office', method: 'Activity-based', date: 'Jan 2026',
        tag: 'mapped', tagLabel: 'Mapped', file: 'BR_Energy_Q1.xlsx', specificity: 68,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Electricity - Grid'],['Sanitized value','22,000 kWh'],['EF_ActivityID','Grid_Electricity_BR'],['Scope','Scope 2 - Indirect']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','Brazil SIN Average 2024'],['Dataset Source','MCTI Brazil'],['Emission Factor','0.056 kg CO\u2082e/kWh'],['Lifecycle','Generation + T&D']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 2/5 per method' },
          { icon: 'check', text: '2024 dataset', note: 'current year match' }
        ]
      }
    },
    { name: 'Amsterdam Warehouse', sub: 'Warehouse \u2022 Undefined', region: 'EU', type: 'Warehouse', actCount: 9, records: '67,800', coverage: 82,
      issues: [{ label: 'age (0.96)', cls: 'old' }],
      activities: [
        { name: 'Electricity - Grid', value: '120,000 kWh', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' },
        { name: 'Natural Gas - Heating', value: '3,200 m\u00B3', date: 'Jan 2026', tag: 'old', tagLabel: 'Old' },
        { name: 'Diesel - Fleet vehicles', value: '5,600L', date: 'Jan 2026', tag: 'mapped', tagLabel: 'Mapped' }
      ],
      detail: {
        title: 'Natural Gas - Heating', entity: 'Amsterdam Warehouse', method: 'Activity-based', date: 'Jan 2026',
        tag: 'old', tagLabel: 'Old', file: 'NL_Warehouse_Q1.xlsx', specificity: 62,
        stage1Label: 'Activity \u2192 Activity_ID',
        stage1: [['Raw activity label','Natural Gas - Heating'],['Sanitized value','3,200 m\u00B3'],['EF_ActivityID','Fuel_NatGas_Stationary'],['Scope','Scope 1 - Direct Emissions']],
        stage2Label: 'System - Selected',
        stage2: [['Selected Factor','Natural Gas (NL)'],['Dataset Source','DEFRA 2023'],['Emission Factor','2.02 kg CO\u2082e/m\u00B3'],['Lifecycle','WTT: 0.34 + TTW: 1.68 = 2.02']],
        rationale: [
          { icon: 'check', text: 'Activity-based data path', note: 'rank 3/5 per method' },
          { icon: 'warn', text: 'Outdated 2023 factor set', note: '2024 available' },
          { icon: 'check', text: 'NL factors for NL entity', note: 'exact geo match' }
        ]
      }
    }
  ];

  function buildEfaTableRows() {
    return EFA_ENTITIES.map(function (e, i) {
      var bar = '<div class="ghg-efa-cov"><div class="ghg-efa-cov-bar"><div class="ghg-efa-cov-fill" style="width:' + e.coverage + '%"></div></div><span>' + e.coverage + '%</span></div>';
      var chips = e.issues.length ? e.issues.map(function (is) { return '<span class="ghg-efa-chip ghg-efa-chip--' + is.cls + '">' + esc(is.label) + '</span>'; }).join(' ') : '\u2014';
      return '<tr class="ghg-efa-row" data-efa-entity="' + i + '"><td>' + esc(e.name) + '</td><td>' + esc(e.region) + '</td><td>' + esc(e.type) + '</td><td class="num">' + e.actCount + '</td><td class="num">' + esc(e.records) + '</td><td>' + bar + '</td><td>' + chips + '</td></tr>';
    }).join('');
  }

  function buildEfaActivities(entityIdx) {
    var e = EFA_ENTITIES[entityIdx];
    if (!e) return '';
    return e.activities.map(function (a, ai) {
      var tagCls = a.tag === 'mapped' ? 'ghg-efa-tag--mapped' : a.tag === 'geo' ? 'ghg-efa-tag--geo' : 'ghg-efa-tag--old';
      return '<div class="ghg-efa-act" data-efa-act="' + ai + '" data-efa-entity="' + entityIdx + '">' +
        '<div class="ghg-efa-act-name">' + esc(a.name) + '</div>' +
        '<div class="ghg-efa-act-meta"><span>' + esc(a.value) + '</span><span>' + esc(a.date) + '</span><span class="ghg-efa-tag ' + tagCls + '">' + esc(a.tagLabel) + '</span></div>' +
      '</div>';
    }).join('');
  }

  function buildEfaDetail(entityIdx) {
    var d = EFA_ENTITIES[entityIdx] && EFA_ENTITIES[entityIdx].detail;
    if (!d) return '';
    var tagCls = d.tag === 'mapped' ? 'ghg-efa-tag--mapped' : d.tag === 'geo' ? 'ghg-efa-tag--geo' : 'ghg-efa-tag--old';
    var html = '<a class="ghg-efa-back" data-action="efa-back"><i class="fa-solid fa-arrow-left"></i> Back</a>' +
      '<div class="ghg-efa-detail-title">' + esc(d.title) + '</div>' +
      '<div class="ghg-efa-detail-meta"><span>' + esc(d.entity) + '</span><span>' + esc(d.method) + '</span><span>' + esc(d.date) + '</span><span class="ghg-efa-tag ' + tagCls + '">' + esc(d.tagLabel) + '</span></div>' +
      '<div class="ghg-efa-detail-file">' + esc(d.file) + '</div>' +
      '<div class="ghg-efa-detail-spec-row"><span class="ghg-efa-detail-spec-label">Specificity score</span><span class="ghg-efa-detail-audit"><i class="fa-solid fa-magnifying-glass"></i> Audit trail</span></div>' +
      '<div class="ghg-efa-detail-spec-bar"><div class="ghg-efa-detail-spec-fill" style="width:' + d.specificity + '%"></div></div>' +
      '<div class="ghg-efa-detail-spec-val">' + d.specificity + '%</div>';
    html += '<div class="ghg-efa-stage"><div class="ghg-efa-stage-header"><span class="ghg-efa-stage-title">Stage 1: Classification</span><span class="ghg-efa-stage-chip">' + d.stage1Label + '</span></div>';
    d.stage1.forEach(function (r) { html += '<div class="ghg-efa-stage-row"><span class="ghg-efa-stage-key">' + esc(r[0]) + '</span><span class="ghg-efa-stage-val">' + esc(r[1]) + '</span></div>'; });
    html += '</div>';
    html += '<div class="ghg-efa-stage"><div class="ghg-efa-stage-header"><span class="ghg-efa-stage-title">Stage 2: EF Selection</span><span class="ghg-efa-stage-chip">' + d.stage2Label + '</span></div>';
    d.stage2.forEach(function (r) { html += '<div class="ghg-efa-stage-row"><span class="ghg-efa-stage-key">' + esc(r[0]) + '</span><span class="ghg-efa-stage-val">' + esc(r[1]) + '</span></div>'; });
    html += '</div>';
    html += '<div class="ghg-efa-rationale-label">Rationale</div>';
    d.rationale.forEach(function (r) {
      var ic = r.icon === 'check' ? 'fa-circle-check ghg-efa-mi--green' : 'fa-circle-exclamation ghg-efa-mi--amber';
      html += '<div class="ghg-efa-rationale-item"><i class="fa-solid ' + ic + '"></i><span><strong>' + esc(r.text) + '</strong> <span class="ghg-efa-rationale-note">(' + esc(r.note) + ')</span></span></div>';
    });
    return html;
  }

  /* ==============================================
     BIND INTERACTIVITY to a container
     ============================================== */

  function bindGhgEngine(ctx) {
    var breakdownBody = ctx.querySelector('#ghg-breakdown-body') || ctx.querySelector('[data-ghg-breakdown-body]');
    if (breakdownBody) breakdownBody.innerHTML = buildBreakdownHTML();
    var lineageBody = ctx.querySelector('#ghg-lineage-body') || ctx.querySelector('[data-ghg-lineage-body]');
    if (lineageBody) lineageBody.innerHTML = buildLineageHTML();

    var efaBody = ctx.querySelector('#ghg-efa-tbody');
    var efaActivities = ctx.querySelector('#ghg-efa-activities');
    var efaDetail = ctx.querySelector('#ghg-efa-detail');
    var efaSelectedEntity = -1;
    if (efaBody) efaBody.innerHTML = buildEfaTableRows();

    function efaReset() {
      efaSelectedEntity = -1;
      if (efaActivities) efaActivities.innerHTML = '';
      if (efaDetail) efaDetail.innerHTML = '';
      ctx.querySelectorAll('.ghg-efa-row').forEach(function (r) { r.classList.remove('ghg-efa-row--selected'); });
      var layout = ctx.querySelector('.ghg-efa-layout');
      if (layout) { layout.classList.remove('ghg-efa-layout--drilled'); layout.classList.remove('ghg-efa-layout--detail'); }
    }

    function bindViewSwitching() {
      function switchView(id) {
        var views = ctx.querySelectorAll('.ghg-view');
        views.forEach(function (v) { v.classList.remove('ghg-view--active'); });
        var target = ctx.querySelector('#ghg-view-' + id) || ctx.querySelector('[data-ghg-view="' + id + '"]');
        if (target) target.classList.add('ghg-view--active');
      }
      ctx.querySelectorAll('.ghg-inv-card').forEach(function (card) {
        card.addEventListener('click', function () { switchView('results'); });
      });
      ctx.addEventListener('click', function (e) {
        var backLink = e.target.closest('[data-action="back-to-list"]');
        if (backLink) { e.preventDefault(); switchView('list'); }
      });
    }

    function bindTabs() {
      var statsRowOverview = ctx.querySelector('#ghg-stats-row-overview');
      var statsRowActivities = ctx.querySelector('#ghg-stats-row-activities');
      ctx.querySelectorAll('.ghg-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var tabId = tab.getAttribute('data-ghg-tab');
          ctx.querySelectorAll('.ghg-tab').forEach(function (t) { t.classList.remove('ghg-tab--active'); });
          tab.classList.add('ghg-tab--active');
          ctx.querySelectorAll('.ghg-tab-content').forEach(function (c) { c.classList.remove('ghg-tab-content--active'); });
          var target = ctx.querySelector('#ghg-tab-' + tabId) || ctx.querySelector('[data-ghg-tab-content="' + tabId + '"]');
          if (target) target.classList.add('ghg-tab-content--active');
          if (statsRowOverview && statsRowActivities) {
            var isOverview = tabId === 'overview';
            statsRowOverview.style.display = isOverview ? '' : 'none';
            statsRowActivities.style.display = isOverview ? 'none' : 'flex';
          }
          if (tabId === 'ef-selection') efaReset();
        });
      });
    }

    function bindBreakdownToggle() {
      ctx.addEventListener('click', function (e) {
        var header = e.target.closest('.ghg-group-header');
        if (!header) return;
        var gi = header.getAttribute('data-group');
        var isCollapsed = header.classList.toggle('ghg-collapsed');
        ctx.querySelectorAll('.ghg-group-child[data-group-parent="' + gi + '"]').forEach(function (row) {
          row.classList.toggle('ghg-hidden', isCollapsed);
        });
      });
    }

    function bindEadSelection() {
      var eadDetail = ctx.querySelector('[data-ghg-ead-detail]');
      if (eadDetail) {
        eadDetail.innerHTML = buildEadDetail(EAD_DATA[0]);
        ctx.addEventListener('click', function (e) {
          var row = e.target.closest('.ghg-ead-row');
          if (!row) return;
          var idx = parseInt(row.getAttribute('data-ead'), 10);
          ctx.querySelectorAll('.ghg-ead-row').forEach(function (r) { r.classList.remove('ghg-ead-row--selected'); });
          row.classList.add('ghg-ead-row--selected');
          eadDetail.innerHTML = buildEadDetail(EAD_DATA[idx]);
        });
      }
    }

    function bindLineageAccordion() {
      ctx.addEventListener('click', function (e) {
        var row = e.target.closest('.ghg-expand-row');
        if (!row) return;
        var idx = row.getAttribute('data-lineage');
        var detail = ctx.querySelector('[data-lineage-detail="' + idx + '"]');
        if (!detail) return;
        var isExpanded = row.classList.toggle('ghg-expanded');
        detail.classList.toggle('ghg-expanded-content--open', isExpanded);
        if (isExpanded) {
          ctx.querySelectorAll('.ghg-expand-row').forEach(function (other) {
            if (other !== row && other.classList.contains('ghg-expanded')) {
              other.classList.remove('ghg-expanded');
              var oi = other.getAttribute('data-lineage');
              var od = ctx.querySelector('[data-lineage-detail="' + oi + '"]');
              if (od) od.classList.remove('ghg-expanded-content--open');
            }
          });
        }
      });
    }

    function bindEfaInteractivity() {
      function efaShowActivities(entityIdx) {
        efaSelectedEntity = entityIdx;
        if (efaActivities) efaActivities.innerHTML = buildEfaActivities(entityIdx);
        if (efaDetail) efaDetail.innerHTML = '';
        var layout = ctx.querySelector('.ghg-efa-layout');
        if (layout) { layout.classList.add('ghg-efa-layout--drilled'); layout.classList.remove('ghg-efa-layout--detail'); }
      }
      function efaShowDetail(entityIdx) {
        if (efaDetail) efaDetail.innerHTML = buildEfaDetail(entityIdx);
        var layout = ctx.querySelector('.ghg-efa-layout');
        if (layout) layout.classList.add('ghg-efa-layout--detail');
      }
      ctx.addEventListener('click', function (e) {
        var row = e.target.closest('.ghg-efa-row');
        if (row) {
          var idx = parseInt(row.getAttribute('data-efa-entity'), 10);
          ctx.querySelectorAll('.ghg-efa-row').forEach(function (r) { r.classList.remove('ghg-efa-row--selected'); });
          row.classList.add('ghg-efa-row--selected');
          efaShowActivities(idx);
          return;
        }
        var act = e.target.closest('.ghg-efa-act');
        if (act) {
          var ei = parseInt(act.getAttribute('data-efa-entity'), 10);
          efaShowDetail(ei);
          return;
        }
        var back = e.target.closest('[data-action="efa-back"]');
        if (back) {
          e.preventDefault();
          if (efaDetail) efaDetail.innerHTML = '';
          var layout = ctx.querySelector('.ghg-efa-layout');
          if (layout) layout.classList.remove('ghg-efa-layout--detail');
          return;
        }
      });
    }

    bindViewSwitching();
    bindTabs();
    bindBreakdownToggle();
    bindEadSelection();
    bindLineageAccordion();
    bindEfaInteractivity();
  }

  window.bindGhgEngine = bindGhgEngine;

  /* ==============================================
     getGhgEnginePageContent() — for page transition
     ============================================== */

  window.getGhgEnginePageContent = function (options) {
    options = options || {};
    var wrap = document.createElement('div');
    wrap.className = 'ghg-page ghg-page--embedded';
    wrap.innerHTML = document.querySelector('.ghg-page') ?
      document.querySelector('.ghg-page').innerHTML :
      getGhgHTML();
    bindGhgEngine(wrap);
    if (options.skipList) {
      var listView = wrap.querySelector('#ghg-view-list');
      if (listView) listView.remove();
      var resultsView = wrap.querySelector('#ghg-view-results');
      if (resultsView) resultsView.classList.add('ghg-view--active');
    }
    return wrap;
  };

  var GHG_OV_TABLE_ROWS =
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s1">Scope 1</span></td><td class="ghg-ov-activity">Stationary Combustion (Natural Gas)</td><td class="num">78.2</td><td class="num">7.4%</td><td class="num">48</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s1">Scope 1</span></td><td class="ghg-ov-activity">Mobile Combustion (Company Fleet)</td><td class="num">42.4</td><td class="num">4.0%</td><td class="num">24</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s1">Scope 1</span></td><td class="ghg-ov-activity">Fugitive Emissions</td><td class="num">4.0</td><td class="num">0.4%</td><td class="num">4</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s2">Scope 2</span></td><td class="ghg-ov-activity">Purchased Electricity (Location-Based)</td><td class="num">42.1</td><td class="num">4.0%</td><td class="num">48</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s2">Scope 2</span></td><td class="ghg-ov-activity">Purchased Heat/Steam</td><td class="num">3.1</td><td class="num">0.3%</td><td class="num">12</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 1: Purchased Goods &amp; Services</td><td class="num">412.0</td><td class="num">38.8%</td><td class="num">156</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 3: Fuel &amp; Energy Related Activities</td><td class="num">28.5</td><td class="num">2.7%</td><td class="num">72</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 4: Upstream Transportation</td><td class="num">186.4</td><td class="num">17.6%</td><td class="num">48</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 5: Waste Generated in Operations</td><td class="num">24.8</td><td class="num">2.3%</td><td class="num">36</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 6: Business Travel</td><td class="num">89.2</td><td class="num">8.4%</td><td class="num">84</td></tr>' +
    '<tr><td><span class="ghg-scope-chip ghg-scope-chip--s3">Scope 3</span></td><td class="ghg-ov-activity">Cat 7: Employee Commuting</td><td class="num">151.2</td><td class="num">14.2%</td><td class="num">96</td></tr>';

  var GHG_OV_TABLE_HEAD =
    '<thead><tr>' +
      '<th class="ghg-ov-col-scope">Scope</th>' +
      '<th>Category</th>' +
      '<th class="num">Emissions (tCO\u2082e)</th>' +
      '<th class="num">% of total</th>' +
      '<th class="num">Records</th>' +
    '</tr></thead>';

  function getGhgOverviewV1() {
    return '' +
      '<div class="ghg-tab-content ghg-tab-content--active" id="ghg-tab-overview">' +
        '<div class="ghg-overview-cols pt-stagger-item">' +
          '<div class="ghg-overview-left">' +
            '<div class="ghg-overview-meta-list">' +
              '<div class="ghg-meta-row"><i class="fa-regular fa-calendar"></i><span>10/1/25 - 12/31/25 (91 days)</span></div>' +
              '<div class="ghg-meta-row"><i class="fa-regular fa-file-lines"></i><span>GHG Protocol Corporate Standard</span></div>' +
              '<div class="ghg-meta-row"><i class="fa-solid fa-sitemap"></i><span>Financial Control</span></div>' +
              '<div class="ghg-meta-row"><i class="fa-solid fa-people-group"></i><span>4 entities</span></div>' +
            '</div>' +
            '<div class="ghg-overview-divider"></div>' +
            '<div class="ghg-ov-quality-label">Data quality score</div>' +
            '<div class="ghg-ov-quality-score"><i class="fa-solid fa-circle-check ghg-ov-quality-icon"></i><span class="ghg-ov-quality-val">87</span><span class="ghg-ov-quality-unit">out of 100</span></div>' +
            '<p class="ghg-ov-quality-desc">Based on data completeness, source quality, and validation status</p>' +
            '<div class="ghg-ov-quality-items">' +
              '<div class="ghg-ov-qi"><i class="fa-solid fa-circle-check ghg-ov-qi-ok"></i><span>892 of 920 records complete</span></div>' +
              '<div class="ghg-ov-qi"><i class="fa-solid fa-triangle-exclamation ghg-ov-qi-warn"></i><span>156 records using spend-based estimates (17%)</span></div>' +
              '<div class="ghg-ov-qi"><i class="fa-solid fa-circle-check ghg-ov-qi-ok"></i><span>All emission factors current (&lt;12 mo)</span></div>' +
              '<div class="ghg-ov-qi"><i class="fa-solid fa-triangle-exclamation ghg-ov-qi-warn"></i><span>28 high-emission records pending review</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="ghg-overview-right">' +
            '<table class="ghg-ov-table">' + GHG_OV_TABLE_HEAD + '<tbody>' + GHG_OV_TABLE_ROWS + '</tbody></table>' +
          '</div>' +
        '</div></div>';
  }

  function getGhgOverviewV2() {
    return '' +
      '<div class="ghg-tab-content ghg-tab-content--active" id="ghg-tab-overview">' +
        '<div class="ghg-overview-cols pt-stagger-item">' +
          '<div class="ghg-ov-col-left">' +
            '<div class="ghg-ov-col-card">' +
              '<div class="ghg-ov-top-row">' +
                '<div class="ghg-ov-meta-col">' +
                  '<div class="ghg-meta-row"><i class="fa-light fa-calendar"></i><span>10/1/25 - 12/31/25 (91 days)</span></div>' +
                  '<div class="ghg-meta-row"><i class="fa-light fa-book-blank"></i><span>GHG Protocol Corporate Standard</span></div>' +
                  '<div class="ghg-meta-row"><i class="fa-light fa-sitemap"></i><span>Financial Control</span></div>' +
                  '<div class="ghg-meta-row"><i class="fa-light fa-sitemap"></i><span>4 entities</span></div>' +
                '</div>' +
                '<div class="ghg-ov-vdivider"></div>' +
                '<div class="ghg-ov-quality-col">' +
                  '<div class="ghg-ov-quality-label">Data quality score</div>' +
                  '<div class="ghg-ov-quality-score"><i class="fa-solid fa-circle-check ghg-ov-quality-icon"></i><span class="ghg-ov-quality-val">87</span><span class="ghg-ov-quality-unit">out of 100</span></div>' +
                  '<p class="ghg-ov-quality-desc">Based on data completeness, source quality, and validation status</p>' +
                  '<div class="ghg-ov-quality-items">' +
                    '<div class="ghg-ov-qi"><i class="fa-solid fa-circle-check ghg-ov-qi-ok"></i><span class="ghg-ov-qi-val">892 of 920</span><span class="ghg-ov-qi-desc">records complete</span></div>' +
                    '<div class="ghg-ov-qi"><i class="fa-solid fa-circle-check ghg-ov-qi-ok"></i><span class="ghg-ov-qi-val">100%</span><span class="ghg-ov-qi-desc">emission factors (&lt;12 mo)</span></div>' +
                    '<div class="ghg-ov-qi"><i class="fa-solid fa-triangle-exclamation ghg-ov-qi-warn"></i><span class="ghg-ov-qi-val">156 (17%)</span><span class="ghg-ov-qi-desc">records using spend-based estimates</span></div>' +
                    '<div class="ghg-ov-qi"><i class="fa-solid fa-triangle-exclamation ghg-ov-qi-warn"></i><span class="ghg-ov-qi-val">32,598</span><span class="ghg-ov-qi-desc">Unassigned records</span></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="ghg-ov-table-card">' +
              '<table class="ghg-ov-table">' + GHG_OV_TABLE_HEAD + '<tbody>' + GHG_OV_TABLE_ROWS + '</tbody></table>' +
            '</div>' +
          '</div>' +
          '<div class="ghg-ov-col-right">' +
            '<div class="ghg-ov-col-card">' +
              '<p class="ghg-audit-title">Audit trail and traceability</p>' +
              '<p class="ghg-audit-desc">Complete calculation logs for external auditor verification. Every emission record traces back to source data, emission factor, and methodology.</p>' +
              '<div class="ghg-audit-banner"><i class="fa-solid fa-circle-info"></i><span>Audit-Ready Status: All 628 emission records in this inventory have complete lineage documentation including inputs, conversions, EF source, boundary decisions, and calculation steps.</span></div>' +
              '<div class="ghg-ov-audit-tables">' +
                buildAuditTablesHTML() +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div></div>';
  }

  function getGhgOverviewTabHTML() {
    return (window.ghgOverviewVersion === 'v1') ? getGhgOverviewV1() : getGhgOverviewV2();
  }

  function buildDonutSVG(cls) {
    return '<svg class="ghg-efa-donut' + (cls ? ' ' + cls : '') + '" viewBox="0 0 164 164">' +
      '<circle cx="82" cy="82" r="41" fill="none" stroke="#008029" stroke-width="82" stroke-dasharray="247.75 257.61" transform="rotate(-90 82 82)"/>' +
      '<circle cx="82" cy="82" r="41" fill="none" stroke="#d4790a" stroke-width="82" stroke-dasharray="3.16 257.61" stroke-dashoffset="-247.75" transform="rotate(-90 82 82)"/>' +
      '<circle cx="82" cy="82" r="41" fill="none" stroke="#d42a1a" stroke-width="82" stroke-dasharray="6.70 257.61" stroke-dashoffset="-250.91" transform="rotate(-90 82 82)"/>' +
    '</svg>';
  }

  var METRICS_ASSIGN = [
    { icon: 'fa-circle-check', cls: 'ghg-efa-mi--green', val: '1,206,234', label: 'Records assigned with EF' },
    { icon: 'fa-circle-exclamation', cls: 'ghg-efa-mi--amber', val: '15,402', label: 'Assignment needing review' },
    { icon: 'fa-triangle-exclamation', cls: 'ghg-efa-mi--red', val: '32,598', label: 'Unassigned records' }
  ];
  var METRICS_ISSUES = [
    { icon: 'fa-bullseye', cls: 'ghg-efa-mi--grey', val: '6,283', label: 'Low specificity' },
    { icon: 'fa-location-dot', cls: 'ghg-efa-mi--grey', val: '5,230', label: 'Geographic mismatch' },
    { icon: 'fa-clock', cls: 'ghg-efa-mi--grey', val: '3,890', label: 'Outdated factors' }
  ];
  var METRICS_QUALITY = [
    { icon: 'fa-bullseye', cls: 'ghg-efa-mi--grey', val: '76.4', label: 'Average specifity score' },
    { icon: 'fa-location-dot', cls: 'ghg-efa-mi--grey', val: '84.2%', label: 'Geographic match rate' },
    { icon: 'fa-clock', cls: 'ghg-efa-mi--grey', val: '92.1%', label: 'Data freshness' },
    { icon: 'fa-pen', cls: 'ghg-efa-mi--grey', val: '0.11%', label: 'Manual override rate' }
  ];

  function buildMetricsBlock(items) {
    return '<div class="ghg-efa-metrics">' + items.map(function (m) {
      return '<div class="ghg-efa-metric"><i class="fa-solid ' + m.icon + ' ' + m.cls + '"></i><span class="ghg-efa-mv">' + m.val + '</span><span class="ghg-efa-ml">' + m.label + '</span></div>';
    }).join('') + '</div>';
  }

  function buildAuditTablesHTML() {
    return '<div class="ghg-audit-table-card"><table class="ghg-ov-table"><thead><tr><th>Source</th><th style="width:80px">Version</th><th>Categories covered</th><th class="num" style="width:112px">Records using</th></tr></thead><tbody>' +
      '<tr><td>eGRID (EPA)</td><td>2024</td><td>EEIO 2024</td><td class="num">192</td></tr>' +
      '<tr><td>EPA GHG Emission Factor Hub</td><td>2024</td><td>Electricity</td><td class="num">144</td></tr>' +
      '<tr><td>EEIO (EPA)</td><td>2024</td><td>Electricity</td><td class="num">156</td></tr>' +
      '<tr><td>DEFRA</td><td>2024</td><td>Electricity</td><td class="num">136</td></tr>' +
      '</tbody></table></div>' +
      '<div class="ghg-audit-table-card"><table class="ghg-ov-table"><thead><tr><th style="width:160px">Method</th><th>Description</th><th class="num" style="width:64px">Records</th><th class="num" style="width:88px">% Coverage</th></tr></thead><tbody>' +
      '<tr><td>Activity-based</td><td>Activity \u00D7 Emission Factor (measured data)</td><td class="num">336</td><td class="num">53.5%</td></tr>' +
      '<tr><td>Spend-based</td><td>Spend \u00D7 EEIO Factor (economic input-output)</td><td class="num">156</td><td class="num">24.8%</td></tr>' +
      '<tr><td>Distance-based</td><td>Distance \u00D7 Mode Factor (travel/transport)</td><td class="num">136</td><td class="num">21.7%</td></tr>' +
      '</tbody></table></div>';
  }

  function getGhgEfaDonutBlockHTML() {
    return '' +
      '<div class="ghg-efa-donut-area">' +
        buildDonutSVG() +
        '<div class="ghg-efa-donut-text"><span class="ghg-efa-donut-pct">87 <span>%</span></span><span class="ghg-efa-donut-label">Records assigned<br>with EF</span></div>' +
      '</div>' +
      buildMetricsBlock(METRICS_ASSIGN);
  }

  function getGhgEfaDonutOnlyHTML() {
    return '' +
      '<div class="ghg-qsb-kpi-donut">' +
        buildDonutSVG('ghg-efa-donut--strip') +
        '<div class="ghg-qsb-kpi-donut-text">' +
          '<div class="ghg-qsb-kpi-value-row"><span class="ghg-qsb-kpi-value">87</span><span class="ghg-qsb-kpi-uom">%</span></div>' +
          '<p class="ghg-qsb-kpi-donut-label">Records assigned with EF</p>' +
        '</div>' +
      '</div>';
  }

  function getGhgEfaAssignmentMetricsHTML() {
    return buildMetricsBlock(METRICS_ASSIGN);
  }

  function getGhgEfaIssuesBlockHTML() {
    return buildMetricsBlock(METRICS_ISSUES);
  }

  function getGhgEfaQualityBlockHTML() {
    return buildMetricsBlock(METRICS_QUALITY);
  }

  function getGhgEfaSummaryInnerHTML() {
    return getGhgEfaDonutBlockHTML() +
      '<div class="ghg-efa-divider"></div>' +
      getGhgEfaIssuesBlockHTML() +
      '<div class="ghg-efa-divider"></div>' +
      getGhgEfaQualityBlockHTML();
  }

  function getGhgEfaKpiStripCardHTML() {
    return '' +
      '<div class="ghg-qsb-kpi" data-node-id="794:173162">' +
        getGhgEfaDonutOnlyHTML() +
        '<div class="ghg-qsb-kpi-divider"></div>' +
        '<div class="ghg-qsb-kpi-section ghg-qsb-kpi-section--assign">' + getGhgEfaAssignmentMetricsHTML() + '</div>' +
        '<div class="ghg-qsb-kpi-divider"></div>' +
        '<div class="ghg-qsb-kpi-section ghg-qsb-kpi-section--issues">' + getGhgEfaIssuesBlockHTML() + '</div>' +
        '<div class="ghg-qsb-kpi-divider"></div>' +
        '<div class="ghg-qsb-kpi-section ghg-qsb-kpi-section--quality">' + getGhgEfaQualityBlockHTML() + '</div>' +
      '</div>';
  }

  function buildListViewHTML() {
    return '' +
    '<div id="ghg-view-list" class="ghg-view ghg-view--active">' +
      '<div class="ghg-page-header pt-stagger-item"><div class="ghg-page-header-left">' +
        '<div class="ghg-breadcrumb"><a href="#">Monitor</a> <i class="fa-solid fa-chevron-right"></i> <span>GHG Inventories</span></div>' +
        '<h1 class="ghg-page-title">GHG Inventories</h1>' +
        '<p class="ghg-page-subtitle">Create, calculate, and manage your emissions inventories</p>' +
      '</div><div class="ghg-page-header-actions"><button class="btn btn-primary btn-small"><i class="fa-solid fa-plus"></i> Create Inventory</button></div></div>' +
      '<div class="ghg-search-bar pt-stagger-item"><div class="ghg-search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="ghg-search-input" placeholder="Search inventories..."></div>' +
      '<button class="btn btn-outline btn-small"><i class="fa-solid fa-filter"></i> Filter</button></div>' +
      '<div class="ghg-inventory-list pt-stagger-item">' +
        '<div class="ghg-inv-card" data-inv="q4-2025"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--calc"><i class="fa-solid fa-calculator"></i></div><div><h3 class="ghg-inv-title">Q4 2025 Corporate Inventory</h3><div class="ghg-inv-meta">Oct 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">1,061.9</div><div class="ghg-inv-stat-label">tCO\u2082e Total</div></div><span class="ghg-badge ghg-badge--success"><i class="fa-solid fa-circle-check"></i> Calculated</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
        '<div class="ghg-inv-card" data-inv="q3-2025"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--locked"><i class="fa-solid fa-lock"></i></div><div><h3 class="ghg-inv-title">Q3 2025 Corporate Inventory</h3><div class="ghg-inv-meta">Jul 1 \u2013 Sep 30, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">987.3</div><div class="ghg-inv-stat-label">tCO\u2082e Total</div></div><span class="ghg-badge ghg-badge--success"><i class="fa-solid fa-lock"></i> Locked</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
        '<div class="ghg-inv-card" data-inv="draft"><div class="ghg-inv-card-left"><div class="ghg-inv-icon ghg-inv-icon--draft"><i class="fa-solid fa-pencil"></i></div><div><h3 class="ghg-inv-title">FY 2025 Annual Report</h3><div class="ghg-inv-meta">Jan 1 \u2013 Dec 31, 2025 \u2022 GHG Protocol \u2022 4 entities</div></div></div><div class="ghg-inv-card-right"><div class="ghg-inv-stat"><div class="ghg-inv-stat-value">\u2014</div><div class="ghg-inv-stat-label">Not calculated</div></div><span class="ghg-badge ghg-badge--warning"><i class="fa-solid fa-clock"></i> Draft</span><i class="fa-solid fa-chevron-right"></i></div></div>' +
      '</div>' +
    '</div>';
  }

  function buildStatsRowHTML() {
    return '' +
      '<div class="ghg-stats-row-wrap">' +
        '<div class="ghg-stats-row ghg-stats-row--overview pt-stagger-item" id="ghg-stats-row-overview">' +
          '<div class="ghg-stat-card ghg-stat-card--wide">' +
            '<div class="ghg-stat-label">Total emissions</div>' +
            '<div class="ghg-stat-value ghg-stat-value--xl">1,061.9 <span class="ghg-stat-unit ghg-stat-unit--xl">tCO\u2082e</span></div>' +
            '<div class="ghg-stat-scopes">' +
              '<div class="ghg-stat-scope-box"><div class="ghg-stat-scope-title">Scope 1 - 11.7%</div><div class="ghg-stat-scope-val">124.6 <span>tCO\u2082e</span></div></div>' +
              '<div class="ghg-stat-scope-box"><div class="ghg-stat-scope-title">Scope 2 - 4.3%</div><div class="ghg-stat-scope-val">45.2 <span>tCO\u2082e</span></div></div>' +
              '<div class="ghg-stat-scope-box"><div class="ghg-stat-scope-title">Scope 3 - 84%</div><div class="ghg-stat-scope-val">892.1 <span>tCO\u2082e</span></div></div>' +
            '</div>' +
          '</div>' +
          '<div class="ghg-stat-card ghg-stat-card--side">' +
            '<div class="ghg-stat-label">Location-based</div>' +
            '<div class="ghg-stat-value ghg-stat-value--xl">45.2 <span class="ghg-stat-unit ghg-stat-unit--xl">tCO\u2082e</span></div>' +
            '<div class="ghg-stat-divider"></div>' +
            '<div class="ghg-stat-note">Uses <strong>Grid-average emissions factors</strong></div>' +
          '</div>' +
          '<div class="ghg-stat-card ghg-stat-card--side">' +
            '<div class="ghg-stat-label">Market-based</div>' +
            '<div class="ghg-stat-value ghg-stat-value--xl">38.1 <span class="ghg-stat-unit ghg-stat-unit--xl">tCO\u2082e</span></div>' +
            '<div class="ghg-stat-divider"></div>' +
            '<div class="ghg-stat-note">Accounts for <strong>RECs and supplier contracts</strong></div>' +
          '</div>' +
        '</div>' +
        '<div class="ghg-stats-row ghg-stats-row--activities pt-stagger-item" id="ghg-stats-row-activities" style="display:none">' +
          '<div class="ghg-stat-card ghg-stat-card--wide ghg-stat-card--activities-left" data-node-id="794:173132">' +
            '<div class="ghg-stat-label">Total emissions</div>' +
            '<div class="ghg-stat-value ghg-stat-value--xl">1,061.9 <span class="ghg-stat-unit ghg-stat-unit--xl">tCO\u2082e</span></div>' +
            '<div class="ghg-stat-bar-wrap">' +
              '<div class="ghg-stat-bar">' +
                '<div class="ghg-stat-bar-seg ghg-stat-bar-seg--s1" style="width:11.7%"></div>' +
                '<div class="ghg-stat-bar-seg ghg-stat-bar-seg--s2" style="width:4.3%"></div>' +
                '<div class="ghg-stat-bar-seg ghg-stat-bar-seg--s3" style="width:84%"></div>' +
              '</div>' +
              '<div class="ghg-stat-bar-legend">' +
                '<span class="ghg-stat-bar-legend-item"><span class="ghg-stat-bar-dot ghg-stat-bar-dot--s1"></span>Scope 1</span>' +
                '<span class="ghg-stat-bar-legend-item"><span class="ghg-stat-bar-dot ghg-stat-bar-dot--s2"></span>Scope 2</span>' +
                '<span class="ghg-stat-bar-legend-item"><span class="ghg-stat-bar-dot ghg-stat-bar-dot--s3"></span>Scope 3</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ghg-qsb-kpi-wrap">' + getGhgEfaKpiStripCardHTML() + '</div>' +
        '</div>' +
      '</div>';
  }

  function buildEadTabHTML() {
    return '' +
      '<div class="ghg-tab-content" id="ghg-tab-breakdown">' +
        '<div class="ghg-ead-layout">' +
          '<div class="ghg-ead-table-wrap">' +
            '<table class="ghg-ov-table ghg-ead-table"><thead><tr>' +
              '<th>Entities</th><th>Activities</th><th>Scope</th><th>Activity data</th><th class="num">tCO\u2082e</th><th>EF Source</th><th>Quality</th>' +
            '</tr></thead><tbody data-ghg-ead-body>' +
              buildEadTableRows() +
            '</tbody></table>' +
          '</div>' +
          '<div class="ghg-ead-detail" data-ghg-ead-detail>' +
            '<div class="ghg-ead-detail-placeholder">Select a row to view lineage details</div>' +
          '</div>' +
        '</div></div>';
  }

  function buildLineageTabHTML() {
    return '' +
      '<div class="ghg-tab-content" id="ghg-tab-lineage">' +
        '<div class="ghg-audit-content">' +
          '<p class="ghg-audit-title">Audit trail and traceability</p>' +
          '<p class="ghg-audit-desc">Complete calculation logs for external auditor verification. Every emission record traces back to source data, emission factor, and methodology.</p>' +
          '<div class="ghg-audit-banner"><i class="fa-solid fa-circle-info"></i><span>Audit-Ready Status: All 628 emission records in this inventory have complete lineage documentation including inputs, conversions, EF source, boundary decisions, and calculation steps.</span></div>' +
          '<div class="ghg-audit-tables">' +
            buildAuditTablesHTML() +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function buildEfaTabHTML() {
    return '' +
      '<div class="ghg-tab-content" id="ghg-tab-ef-selection">' +
        '<div class="ghg-efa-layout">' +
          '<div class="ghg-efa-summary" id="ghg-efa-summary">' + getGhgEfaSummaryInnerHTML() + '</div>' +
          '<div class="ghg-efa-table-wrap" id="ghg-efa-table-wrap">' +
            '<table class="ghg-ov-table ghg-efa-table"><thead><tr><th>Entities</th><th>Region</th><th>Type</th><th class="num" style="width:64px">Activity</th><th class="num" style="width:88px">Records</th><th style="width:200px">Successful EF Coverage</th><th>Prominent issues</th></tr></thead>' +
            '<tbody id="ghg-efa-tbody"></tbody></table>' +
          '</div>' +
          '<div class="ghg-efa-panel" id="ghg-efa-panel">' +
            '<div class="ghg-efa-panel-activities" id="ghg-efa-activities"></div>' +
            '<div class="ghg-efa-panel-detail" id="ghg-efa-detail"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function getGhgHTML() {
    return '' +
    buildListViewHTML() +
    '<div id="ghg-view-results" class="ghg-view">' +
      buildStatsRowHTML() +
      '<div class="ghg-tabs-container"><div class="ghg-tabs pt-stagger-item">' +
        '<button class="ghg-tab ghg-tab--active" data-ghg-tab="overview">' + (window.ghgOverviewVersion === 'v1' ? 'Overview' : 'Overview and audit trail') + '</button>' +
        '<button class="ghg-tab" data-ghg-tab="breakdown">Entities and activities details</button>' +
        '<button class="ghg-tab" data-ghg-tab="ef-selection">Emissions factors assignment</button>' +
        '<button class="ghg-tab" data-ghg-tab="lineage"' + (window.ghgOverviewVersion === 'v1' ? '' : ' style="display:none"') + '>Audit trail and traceability</button></div>' +
      getGhgOverviewTabHTML() +
      buildEadTabHTML() +
      buildLineageTabHTML() +
      buildEfaTabHTML() +
      '</div>' +
    '</div>';
  }

  /* ==============================================
     AUTO-INIT for standalone page
     ============================================== */
  var standaloneRoot = document.querySelector('.ghg-page');
  if (standaloneRoot && !standaloneRoot.classList.contains('ghg-page--embedded')) {
    bindGhgEngine(standaloneRoot);

    var headerActions = standaloneRoot.querySelector('#ghg-header-actions');
    var headerTitle = standaloneRoot.querySelector('#ghg-header-title');
    standaloneRoot.querySelectorAll('.ghg-inv-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (headerActions) headerActions.style.display = 'flex';
        if (headerTitle) headerTitle.textContent = 'Q4 2025 Corporate Inventory';
      });
    });
    standaloneRoot.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="back-to-list"]')) {
        if (headerActions) headerActions.style.display = 'none';
        if (headerTitle) headerTitle.textContent = 'GHG Calculation Engine';
      }
    });
  }

})();
