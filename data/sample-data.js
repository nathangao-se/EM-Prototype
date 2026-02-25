// ========================================
// SAMPLE DATA — centralised test/demo data used across wizards
// ========================================

window.SampleData = {};

// ---------- Upload wizard: imported file list ----------
window.SampleData.UPLOAD_FILES = [
  { name: 'North America Q4 2024 — Stationary & Electricity', size: '2.1mb', type: 'Mixed activities' },
  { name: 'Southern Europe FY2024 — Combustion & Refrigerants', size: '1.4mb', type: 'Mixed activities' },
  { name: 'Asia Pacific Q4 2024 — Multi-table Export', size: '3.8mb', type: 'All activity types' },
  { name: 'East Africa 2024 — RA+ Raw Export', size: '890kb', type: 'Mixed activities' }
];

// ---------- Upload wizard: per-file CSV datasets ----------
window.SampleData.UPLOAD_CSV = {
  'North America Q4 2024 — Stationary & Electricity': [
    'North America Operations - Q4 2024,,,,,',
    'Generated: 2024-12-01,,,,,',
    ',,,,,',
    'Date,Facility,Fuel Type,Usage Value,Usage UOM,tCO2e',
    '2024-10-01,Chicago HQ,Natural Gas,18420,MMBtu,975.3',
    '2024-10-01,Detroit Plant,Diesel,4210,Gallons,41.2',
    '2024-11-01,Chicago HQ,Natural Gas,19850,MMBtu,1050.8',
    '2024-11-01,Detroit Plant,Diesel,3890,Gallons,38.1',
    '2024-12-01,Chicago HQ,Natural Gas,21300,MMBtu,1127.6',
    ',,,,,',
    ',,,,,',
    'EMEA Electricity Consumption,,,,,',
    'Location,Start Date,End Date,kWh,Renewable (Y/N),tCO2e',
    'London Office,2024-10-01,2024-10-31,128400,Y,0',
    'Frankfurt DC,2024-10-01,2024-10-31,342800,N,121.3',
    'Paris Office,2024-10-01,2024-10-31,97200,Y,0',
    'London Office,2024-11-01,2024-11-30,134100,Y,0',
    'Frankfurt DC,2024-11-01,2024-11-30,361200,N,127.8',
    'Paris Office,2024-11-01,2024-11-30,102600,Y,0'
  ].join('\n'),

  'Southern Europe FY2024 — Combustion & Refrigerants': [
    'Report: Southern Europe Facilities,,,,,,,',
    'Reporting Period: FY2024,,,,,,,',
    'NOTE: Values are preliminary - subject to audit,,,,,,,',
    ',,,,,,,',
    'Site,Country,Fuel Type,Qty,Unit,Emissn Factor,tCO2e,Data Source',
    'Barcelona DC,Spain,Natural Gas,29340,MMBtu,53.06,155.7,Utility bill',
    'Madrid HQ,Spain,Diesel,1820,Litres,2.68,4.9,Fleet log',
    'Rome Office,Italy,Electricity,482000,kWh,0.233,112.3,Utility bill',
    'Milan Plant,Italy,Natural Gas,38200,MMBtu,53.06,202.6,Utility bill',
    'Lisbon Site,Portugal,Electricity,214000,kWh,0.249,53.3,Utility bill',
    ',,,,,,,',
    '[See tab: Scope 3 for upstream data],,,,,,,',
    ',,,,,,,',
    'Refrigerants (leak events),,,,,,,',
    'Site,Refrig. Type,Charge Amount (kg),Leakage Rate (%),Estimated Loss (kg),,,',
    'Barcelona DC,R-410A,120,2.4,2.88,,,',
    'Milan Plant,R-22,85,5.1,4.34,,,',
    'Madrid HQ,R-404A,200,1.8,3.60,,,'
  ].join('\n'),

  'Asia Pacific Q4 2024 — Multi-table Export': [
    'ASIA PACIFIC EMISSIONS INVENTORY,,,,,,,,',
    'Export Date: 2024-12-10 | Source: Facilities ERP,,,,,,,,',
    ',,,,,,,,',
    '[BLOCK 1 - Stationary Combustion],,,,,,,,',
    ',,,,,,,,',
    'Loction,Fuel,Amount Used,Amt UOM,Start Dt,End Dt,CO2e (metric t),,',
    'Tokyo HQ,LNG,18200,MMBtu,Oct-24,Dec-24,963.8,,',
    'Shanghai Fac.,Coal,142000,kg,Oct-24,Dec-24,407.2,,',
    'Sydney Office,Natl. Gas,7400,MMBtu,Oct-24,Dec-24,391.9,,',
    'Mumbai Plant,HFO,28500,kg,Oct-24,Dec-24,86.3,,',
    ',,,,,,,,',
    ',,,,,,,,',
    ',,,,Purchased Electricity (Scope 2),,,,',
    ',,,,Facility Name,Billing Period,kWh Consumed,Scope 2 (t),',
    ',,,,Tokyo HQ,Q4 2024,284000,38.1,',
    ',,,,Shanghai Fac.,Q4 2024,921000,595.1,',
    ',,,,Seoul Branch,Q4 2024,183000,86.0,',
    ',,,,Singapore DC,Q4 2024,412000,91.1,',
    ',,,,Sydney Office,Q4 2024,97000,9.4,',
    ',,,,,,,,',
    'NOTE: Shanghai grid factor updated Nov 2024,,,,,,,,',
    ',,,,,,,,',
    'Business Travel (approx.),,,,,,,,',
    'Traveler ID,Dep.,Dest.,Cabin,Dist. (km),Transport,CO2e,,',
    'EMP-0042,Tokyo,Singapore,Economy,5300,Air,0.82,,',
    'EMP-0117,Shanghai,London,Business,9200,Air,4.12,,',
    'EMP-0089,Sydney,Auckland,Economy,2160,Air,0.28,,'
  ].join('\n'),

  'East Africa 2024 — RA+ Raw Export': [
    'East Africa Activity Data Export,,,,,,',
    'Source: RA+ Export 2024-12-15,,,,,,',
    ',,,,,,',
    'Category,Activity,Location,Value,UOM,,',
    'Stationary Combustion,Diesel generator,Nairobi HQ,12400,Litres,,',
    'Stationary Combustion,Diesel generator,Kampala Office,8200,Litres,,',
    '** Note: Mombasa site excluded - data pending **,,,,,,',
    'Purchased Electricity,Grid electricity,Nairobi HQ,186000,kWh,,',
    'Purchased Electricity,Grid electricity,Dar es Salaam,94000,kWh,,',
    'Purchased Electricity,Solar (on-site),Nairobi HQ,28000,kWh,,',
    ',,,,,,',
    ',Vhcl Type,Fuel,Distance (km),Litres,Location,',
    ',Company fleet,Petrol,142000,14820,Kenya,',
    ',Company fleet,Diesel,98000,9150,Uganda,',
    ',Field vehicles,Diesel,218000,23400,Tanzania,',
    ',,,,,,',
    '[ END OF EXPORT — 3 sites, partial Q4 data ],,,,,,',
  ].join('\n')
};

// ---------- Upload wizard: template catalog ----------
window.SampleData.TEMPLATE_CATALOG = [
  { section: 'Scope 1 & 2 — Direct & Indirect Emissions', title: 'Scope 1 Stationary Combustion Activities', subtitle: 'Carbon · Emissions', desc: 'Direct GHG emissions from stationary combustion of fuels (natural gas, diesel, propane, etc.) at owned or controlled facilities.', api: true, cols: 15, rules: 15, imports: 42 },
  { section: 'Scope 1 & 2 — Direct & Indirect Emissions', title: 'Scope 2 Purchased Electricity Activities', subtitle: 'Carbon · Emissions', desc: 'Indirect emissions from purchased electricity, steam, heating, and cooling. Location-based and market-based calculation support.', api: true, cols: 15, rules: 15, imports: 0 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.1 Purchased Goods & Services', subtitle: 'Carbon · Emissions', desc: 'Upstream emissions from purchased goods and services. Supports spend-based, average-data, and supplier-specific calculation methods per GHG Protocol.', api: true, cols: 14, rules: 14, imports: 28 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.2 Capital Goods', subtitle: 'Carbon · Emissions', desc: 'Cradle-to-gate emissions from capital goods purchased during the reporting period. Covers equipment, machinery, buildings, and vehicles.', api: true, cols: 13, rules: 13, imports: 8 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.3 Fuel- & Energy-Related Activities', subtitle: 'Carbon · Emissions', desc: 'Upstream emissions from fuel and energy procurement not already counted in Scope 1 or 2. Includes extraction, production, and T&D losses.', api: true, cols: 14, rules: 14, imports: 19 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.4 Upstream Transportation & Distribution', subtitle: 'Carbon · Emissions', desc: 'Emissions from transportation and distribution of purchased goods between tier 1 suppliers and the reporting company\'s operations.', api: true, cols: 15, rules: 15, imports: 24 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.5 Waste Generated in Operations', subtitle: 'Carbon · Emissions', desc: 'Emissions from third-party disposal and treatment of waste generated in the reporting company\'s operations. Covers landfill, recycling, incineration, and composting.', api: true, cols: 13, rules: 13, imports: 31 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.6 Business Travel', subtitle: 'Carbon · Emissions', desc: 'Emissions from employee business travel including flights, rail, rental cars, and hotel stays. Supports distance-based and spend-based methods.', api: true, cols: 14, rules: 14, imports: 47 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.7 Employee Commuting', subtitle: 'Carbon · Emissions', desc: 'Emissions from employees commuting between home and work. Covers transportation mode, distance, and remote work adjustments.', api: true, cols: 13, rules: 13, imports: 22 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.8 Upstream Leased Assets', subtitle: 'Carbon · Emissions', desc: 'Emissions from operation of assets leased by the reporting company (lessee). Covers office space, warehouses, and equipment leases.', api: true, cols: 12, rules: 12, imports: 6 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.9 Downstream Transportation & Distribution', subtitle: 'Carbon · Emissions', desc: 'Emissions from transportation and distribution of sold products to end consumers. Covers outbound logistics not paid for by the reporting company.', api: true, cols: 14, rules: 14, imports: 11 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.10 Processing of Sold Products', subtitle: 'Carbon · Emissions', desc: 'Emissions from processing of intermediate products sold by the reporting company. Applies when sold products require further processing before end use.', api: true, cols: 13, rules: 13, imports: 5 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.11 Use of Sold Products', subtitle: 'Carbon · Emissions', desc: 'Emissions from end-use of goods and services sold by the reporting company. Covers direct use-phase energy consumption and fugitive emissions.', api: true, cols: 14, rules: 14, imports: 9 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.12 End-of-Life Treatment of Sold Products', subtitle: 'Carbon · Emissions', desc: 'Emissions from waste disposal and treatment of products sold by the reporting company at the end of their useful life.', api: true, cols: 13, rules: 13, imports: 7 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.13 Downstream Leased Assets', subtitle: 'Carbon · Emissions', desc: 'Emissions from operation of assets owned by the reporting company and leased to other entities. Covers commercial real estate and equipment leases.', api: true, cols: 12, rules: 12, imports: 4 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.14 Franchises', subtitle: 'Carbon · Emissions', desc: 'Emissions from operation of franchises not included in Scope 1 and 2. Applicable to franchisors reporting franchisee emissions.', api: true, cols: 12, rules: 12, imports: 3 },
  { section: 'Scope 3 — Value Chain Emissions', title: 'S3.15 Investments', subtitle: 'Carbon · Emissions', desc: 'Emissions associated with the reporting company\'s investments including equity, debt, project finance, and managed investments.', api: true, cols: 13, rules: 13, imports: 6 },
  { section: 'Other Data Templates', title: 'Utility Bills', subtitle: 'Energy', desc: 'Monthly utility bill data for electricity, natural gas, water, steam, and chilled water. Includes account, usage, and cost columns.', api: true, cols: 12, rules: 18, imports: 64 },
  { section: 'Other Data Templates', title: 'Facility Register', subtitle: 'Facilities', desc: 'Facility metadata, characteristics, and organizational boundary configuration. Covers location, floor area, headcount, and control type.', api: false, cols: 14, rules: 10, imports: 38 },
  { section: 'Other Data Templates', title: 'ESG KPI Dataset', subtitle: 'Reporting', desc: 'ESG key performance indicator values aligned to GRI, SASB, CDP, TCFD, and CSRD/ESRS frameworks. Covers environmental, social, and governance metrics.', api: false, cols: 10, rules: 5, imports: 7 }
];

// ---------- Activity map: table columns & rows ----------
window.SampleData.ACTIVITY_TABLE_COLS = ['ID','Business Entity','Scope','Category','Activity Type','Emissions Factor','Start Date','End Date','Record Type','Description','Fuel Type','Usage Value','Usage UoM','Factor Set','Factor Set Version','\u2082e','Alerts'];

window.SampleData.ACTIVITY_TABLE_ROWS = [
  ['86f7c8','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Estimate','Heating Source 6','Refinery Gas','1,000','Liter','','','',''],
  ['dfc393','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Estimate','Heating Source 3','Liquefied Petroleum Gas','1,000','Cubic Meter','','','',''],
  ['cd7e03','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Meter Reading','Heating Source 14','Landfill Gas','1,000','Kilogram','','','',''],
  ['6aae5c','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Meter Reading','Heating Source 8','Heating Oil','1,000','Gallon','','','',''],
  ['24042f','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 10','Petrol Stationary','1,000','Kilogram','','','',''],
  ['c59202','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.12','Natural Gas','1,003','Kilowatt-hour','','','','1 issue'],
  ['362dcc','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 1','Furnace Oil','1,000','Liter','','','',''],
  ['c7bd6c','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.13','Natural Gas','1,003','Kilowatt-hour','','','','1 issue'],
  ['6c6a5d','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','','1/1/24','1/31/24','Meter Reading','Energy Gen.11','','1,003','Kilowatt-hour','','','','1 issue'],
  ['301976','Besana','1','','','','1/1/24','1/31/24','Invoice','Heating Source 17','','1,000','Liter','','','','1 issue'],
  ['65f64f','Besana','1','0','Stationary Combustion','','1/1/24','1/31/24','Invoice','Heating Source 18','','1,000','Liter','','','','1 issue'],
  ['8eac9c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','','1/1/24','1/31/24','Estimate','Mobile Comb. Source 11','','1,000','Kilogram','','','','1 issue'],
  ['c9ac41','Besana','1','0','Stationary Combustion','Other bituminous coal','1/1/24','1/31/24','Estimate','Heating Source 12','Coal Bituminous','1,000','Short Tons','IEA','2024','18,885.91',''],
  ['104f29','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gaseous fuels - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 12','Compressed Natural Gas','1,000','Kilogram','UK DESZN (ex-DEFRA)','2024','3.099',''],
  ['4c8919','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Geothermal-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.4','Geothermal','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
  ['37cd90','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Wind-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.3','Wind','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
  ['818361','Besana','1','0','Stationary Combustion','Liquefied petroleum gases','1/1/24','1/31/24','Invoice','Heating Source 4','Propane','1,000','Kilogram','IEA','2024','44.953',''],
  ['48756c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gaseous fuels - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 1','Compressed Natural Gas','1,000','Kilogram','UK DESZN (ex-DEFRA)','2024','3.099',''],
  ['7eb6fd','Besana','1','0','Stationary Combustion','Biomass - Wood chips','1/1/24','1/31/24','Estimate','Heating Source 18','Biomass Wood','1,000','Short Tons','UK DESZN (ex-DEFRA)','2024','1,239.31',''],
  ['c0044d','Besana','1','0','Stationary Combustion','Biofuel - Dev diesel','1/1/24','1/31/24','Meter Reading','Heating Source 20','Diesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.254',''],
  ['e47b8f','Besana','1','0','Stationary Combustion','Fuels - Gas oil','1/1/24','1/31/24','Invoice','Heating Source 22','Kerosene','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.383',''],
  ['61e741','Besana','1','0','Stationary Combustion','Natural gas','1/1/24','1/31/24','Meter Reading','Heating Source 2','Liquefied Natural Gas','1,000','Cubic Meter','IEA','2024','8.037',''],
  ['ae1698','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 6','Kerosene','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.921',''],
  ['f88db6','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 9','Lubricant Oil','1,000','Gallon','IEA','2024','44.665',''],
  ['5.68E+03','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Fuels - Gas oil','1/1/24','1/31/24','Estimate','Mobile Comb. Source 3','Gas Oil','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.383',''],
  ['7dcdd9','Besana','1','0','Stationary Combustion','Petroleum coke','1/1/24','1/31/24','Invoice','Heating Source 16','Pet Coke','1,000','Short Tons','IEA','2024','10,253.57',''],
  ['8ae196','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Upper medium - Diesel','1/1/24','1/31/24','Invoice','Mobile Comb. Source 17','Diesel','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.161',''],
  ['efa448','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Large car - CNG','1/1/24','1/31/24','Estimate','Mobile Comb. Source 16','Compressed Natural Gas','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.237',''],
  ['bda2ec','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Invoice','Heating Source 13','Biomass Agri. Byproducts','1,000','Kilogram','IEA','2024','12.769',''],
  ['52a36c','Besana','1','Cat 3: Fuel & Energy','On-site Energy Generation','Photovoltaic Solar-2024','1/1/24','1/31/24','Meter Reading','Energy Gen.1','Photovoltaic Solar','1,000','Kilowatt-hour','Non-Emission Source','2024','0',''],
  ['07be92','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev diesel','1/1/24','1/31/24','Invoice','Mobile Comb. Source 2','Diesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.254',''],
  ['c34679','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Biofuel - Dev petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 4','Petrol','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.947',''],
  ['435ac8','Besana','1','0','Stationary Combustion','Biofuel - Biodiesel ME','1/1/24','1/31/24','Meter Reading','Heating Source 23','Biodiesel','1,000','Liter','UK DESZN (ex-DEFRA)','2024','2.871',''],
  ['47a72f','Besana','1','0','Stationary Combustion','Fuels - Fuel oil','1/1/24','1/31/24','Invoice','Heating Source 7','Fuel Oil','1,000','Liter','UK DESZN (ex-DEFRA)','2024','3.87',''],
  ['744676','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 15','Butane','1,000','Kilogram','IEA','2024','13.044',''],
  ['ba513f','Besana','1','0','Stationary Combustion','Anthracite','1/1/24','1/31/24','Meter Reading','Heating Source 11','Coal Anthracite','1,000','Short Tons','IEA','2024','19,702.37',''],
  ['04cf5a','Besana','1','0','Stationary Combustion','Non-specified oil products','1/1/24','1/31/24','Estimate','Heating Source 21','Petrol','1,000','Kilogram','IEA','2024','13.516',''],
  ['43ebca','Besana','1','0','Stationary Combustion','Coke oven coke','1/1/24','1/31/24','Invoice','Heating Source 19','Coke Mixed Industrial','1,000','Short Tons','IEA','2024','20,595.48',''],
  ['6e1b3f','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Aviation turbine fuel','1/1/24','1/31/24','Estimate','Mobile Comb. Source 7','Aviation Gasoline','1,000','Gallon','UK DESZN (ex-DEFRA)','2024','10.783',''],
  ['bd9d9c','Besana','1','Cat 1: Purchased Goods','Mobile Combustion','Upper medium - Petrol','1/1/24','1/31/24','Invoice','Mobile Comb. Source 19','Petrol','1,000','Kilometer','UK DESZN (ex-DEFRA)','2024','0.19','']
];
