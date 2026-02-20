// ========================================
// UPLOAD WIZARD — Add activity files flow (step 1 of upload branch)
// Triggered from Activity data setup → "Add/upload/migrate activity data"
// ========================================

(function () {
  var overlay = document.getElementById('upload-wizard-overlay');
  if (!overlay) return;

  var wiz = overlay.querySelector('.upload-wiz');
  var closeBtn = overlay.querySelector('.upload-wiz-close');
  var bodyEl = overlay.querySelector('.upload-wiz-body');
  var backBtn = overlay.querySelector('.upload-wiz-back');
  var nextBtn = overlay.querySelector('.upload-wiz-next');
  var discardLink = overlay.querySelector('.upload-wiz-discard');

  var currentStep = 0;

  var ACTIVITY_TYPES = ['All activity types', 'Electricity only', 'Mixed activities', 'Fuel consumption', 'Water usage'];

  var uploadedFiles = [];
  var importedFiles = [];

  var SAMPLE_IMPORTED = [
    { name: 'North America Q4 2024 — Stationary & Electricity', size: '2.1mb', type: 'Mixed activities' },
    { name: 'Southern Europe FY2024 — Combustion & Refrigerants', size: '1.4mb', type: 'Mixed activities' },
    { name: 'Asia Pacific Q4 2024 — Multi-table Export', size: '3.8mb', type: 'All activity types' },
    { name: 'East Africa 2024 — RA+ Raw Export', size: '890kb', type: 'Mixed activities' }
  ];

  // Per-file CSV datasets (varying messiness levels)
  var SAMPLE_CSV_DATA = {
    // Clean-ish: two clearly separated blocks with good headers
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

    // Medium messy: metadata rows, preliminary notes, extra column, second mini-table
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
      'Site,Refrig. Type,Charge Amount (kg),Leakage Rate (%),Estimated Loss (kg),,,'  ,
      'Barcelona DC,R-410A,120,2.4,2.88,,,',
      'Milan Plant,R-22,85,5.1,4.34,,,',
      'Madrid HQ,R-404A,200,1.8,3.60,,,'
    ].join('\n'),

    // Very messy: scattered blocks with offset columns, typos, mixed notes inline
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
      'Business Travel (approx.),,,,,,,,'  ,
      'Traveler ID,Dep.,Dest.,Cabin,Dist. (km),Transport,CO2e,,',
      'EMP-0042,Tokyo,Singapore,Economy,5300,Air,0.82,,',
      'EMP-0117,Shanghai,London,Business,9200,Air,4.12,,',
      'EMP-0089,Sydney,Auckland,Economy,2160,Air,0.28,,'
    ].join('\n'),

    // Moderately messy: one main block but with embedded notes, shifted columns, sparse rows
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

  // Step 2 (columns cleanup) state
  var step1Tab = 'layouts';
  var showTablePreview = false;
  var savedSections = [];
  var SAMPLE_SECTIONS = [
    { range: 'A1:E15' },
    { range: 'P1:R15' }
  ];

  // Step 3 (review / collaborate) state
  var collaborators = [
    { name: 'E. Honnig' },
    { name: 'J. Lee' }
  ];

  var SAMPLE_HISTORICAL = [
    { name: 'Legacy Emissions data 2000-2019', size: '999.5mb' },
    { name: 'Legacy emissions dat 2021-2023', size: '999.5mb' }
  ];

  var normalizeAfterComplete = false;

  // Standard columns loaded from CSV
  var standardColumns = [
    { label: 'Business entity', desc: 'Business Entity name as appears in Resource Advisor+.' },
    { label: 'Start date', desc: 'Start Date of Activity.' },
    { label: 'End date', desc: 'End Date of Activity.' },
    { label: 'Estimation method', desc: 'Method used to estimate emissions.' },
    { label: 'Description', desc: 'Description of the Activity.' },
    { label: 'Record type', desc: 'Select one of the drop-down Record Types.' },
    { label: 'Category', desc: 'Select one of the drop-down Categories.' },
    { label: 'Fuel type/refrigerant', desc: 'Select the fuel type or refrigerant for the activity.' },
    { label: 'Is renewable', desc: 'Indicates if Fuel Type/Power is Renewable.' },
    { label: 'Is generation owned by client', desc: 'Indicates if RE Generator is owned by the client. This field is required when Category is On-Site Energy Generation and Is Renewable is true.' },
    { label: 'Is renewable power used on-site', desc: 'Indicates if renewable power is used on-site. This field is required if Category is On-Site Energy Generation and Is Renewable is true.' },
    { label: 'Are EACs retained by client', desc: 'Indicates if EACs are retained by the client. This field is required when Category is On-Site Energy Generation and Is Renewable is true.' },
    { label: 'Usage value', desc: 'Usage quantity. This field is required when Category is Stationary Combustion or Onsite Energy Generation or Refrigerants.' },
    { label: 'Usage UOM', desc: 'Usage Unit of Measure. This field is required when Category is Stationary Combustion or Onsite Energy Generation or Refrigerants.' },
    { label: 'Distance value', desc: 'Distance traveled for Mobile Combustion. For Mobile Combustion, either Usage value/UOM or Distance value/UOM is required.' },
    { label: 'Distance UOM', desc: 'Distance Unit of Measure for Mobile Combustion. For Mobile Combustion, either Usage value/UOM or Distance value/UOM is required.' },
    { label: 'Spend value', desc: 'The amount spent on the Activity.' },
    { label: 'Spend UOM', desc: 'The unit of measurement (UoM) used for the amount spent on the Activity.' },
    { label: 'Vehicle type', desc: 'Type of vehicle driven. This field is required when Category is Mobile Combustion.' },
    { label: 'Energy type', desc: 'Select the energy type for the activity.' },
    { label: 'Energy attribute type', desc: 'Select one of the drop-down Energy Attribute Types. This field is required if the Category is Off-Site Purchased Energy.' },
    { label: 'Suborganization', desc: 'Suborganization involved in the Activity.' },
    { label: 'Industry', desc: 'Industry related to the Activity.' },
    { label: 'Sectors', desc: 'Sectors involved in the Activity.' },
    { label: 'Products and services', desc: 'Products and services related to the activity.' },
    { label: 'Vendor name', desc: 'Name of the Vendor.' },
    { label: 'Raw material', desc: 'Raw used for the Activity.' },
    { label: 'Item description', desc: 'Description of the item.' },
    { label: 'Is metallic', desc: 'Indicates if the raw material is metallic.' },
    { label: 'Region', desc: 'Region where the Activity took place.' },
    { label: 'Activity type', desc: 'Select one of the drop-down Activity Types.' },
    { label: 'Segment', desc: 'Segment of Activity.' },
    { label: 'Fuel type', desc: 'Select one of the drop-down Fuel Types. This field is required for Storage and Retail Facility activity types. This field is also required when Usage Value and Usage UOM are provided.' },
    { label: 'Origin', desc: 'Starting location of the transport or activity (e.g., city, facility, or site).' },
    { label: 'Destination', desc: 'Ending location of the transport or activity (e.g., city, facility, or site).' },
    { label: 'Is hazardous', desc: 'Indicates whether the Material type is hazardous.' },
    { label: 'Disposal method', desc: 'Select one of the drop-down Disposal Methods.' },
    { label: 'em_template_8e5f6789a0b1c2d3e4f56789a12b3c4d', desc: '' },
    { label: 'Cabin class', desc: 'Select Cabin Class (First Class, Business, etc.) used for Air travel. This field is required when Activity type is \'Air\'.' },
    { label: 'Car type', desc: 'Select Type of Car used for Automobile Travel. This field is required when Activity type is \'Automobile\'.' },
    { label: 'Rail type', desc: 'Select type of Rail used for Rail travel. This field is required when Acitivity type is \'Rail\'.' },
    { label: 'Bus type', desc: 'Select Type of Bus used for Bus travel. This field is required if Activity type is \'Bus\'.' },
    { label: 'Ferry passenger type', desc: 'Select the Type of Ferry travel. This field is required when Activity type is \'Water\'.' },
    { label: 'Room nights', desc: 'Total number of nights for all rooms booked for the Activity.' },
    { label: 'em_template_9f6789a0b1c2d3e4f56789a12b3c4d5e', desc: '' },
    { label: 'Employee ID', desc: 'Identification of the employee as determined by the organization. Only for informational purposes. This field is required if Number of employees is 1.' },
    { label: 'Average distance', desc: 'Average one-way commute distance traveled, either by individual or across all employees.' },
    { label: 'Average distance UOM', desc: 'Unit of measurement (UoM) for Average distance.' },
    { label: 'Days in office per week', desc: 'Average number of days the employee commuted to the office in any given week.' },
    { label: 'Number of weeks', desc: 'Number of weeks commuting.' },
    { label: 'Mode of transportation details', desc: 'Further details of the mode of transport(s) used. i.e. hybrid vehicle, subway train, etc.' },
    { label: 'Number of employees', desc: 'Number of employees. This field is required.' },
    { label: 'em_template_a06789a0b1c2d3e4f56789a12b3c4d5f', desc: '' },
    { label: 'Postal code', desc: 'Postal Code where the Activity took place.' },
    { label: 'em_template_b1789a0b1c2d3e4f56789a12b3c4d5f6', desc: '' },
    { label: 'em_template_c289a0b1c2d3e4f56789a12b3c4d5f67', desc: '' },
    { label: 'Product category', desc: 'The category of the product.' },
    { label: 'Product name', desc: 'The name of the product.' },
    { label: 'Number of uses per lifetime (required)', desc: 'Number of uses during the product\'s lifetime.' },
    { label: 'Quantity sold', desc: 'Number of products products sold.' },
    { label: 'Processing source', desc: 'Select one of the drop-down Processing Sources.' },
    { label: 'Processing usage per unit sold', desc: 'Processing consumed per unit per use. Processing usage per unit per use/UOM is required.' },
    { label: 'Processing usage UOM per unit sold', desc: 'The amount of processing used per unit per use of the product.' },
    { label: 'em_template_d39a0b1c2d3e4f56789a12b3c4d5f678', desc: '' },
    { label: 'Energy per unit per use', desc: 'The amount of energy used per unit per use of the product.' },
    { label: 'Energy use UOM', desc: 'The unit of measure for the energy use.' },
    { label: 'Energy source', desc: 'Select one of the drop-down Energy Sources.' },
    { label: 'em_template_e4a0b1c2d3e4f56789a12b3c4d5f6789', desc: '' },
    { label: 'Revenue value', desc: 'Revenue-based value (not activity) of the activity.' },
    { label: 'Revenue UOM', desc: 'Revenue-based unit of measure (UOM) for the activity value (i.e. USD, EUR, etc)' },
    { label: 'em_template_f5b1c2d3e4f56789a12b3c4d5f6789a0', desc: '' },
    { label: 'em_template_06c2d3e4f56789a12b3c4d5f6789a0b1', desc: '' },
    { label: 'em_template_17d3e4f56789a12b3c4d5f6789a0b1c2', desc: '' },
    { label: 'Investment type', desc: 'Type of investment.' },
    { label: 'Total asset value amount', desc: 'Total value of the investment. This field is required if Equity Share is not given.' },
    { label: 'Total amount invested', desc: 'Total amount invested in the investment. This field is required if Equity Share is not given.' },
    { label: 'Equity share', desc: 'Percent ownership of the investment.' },
    { label: 'Industry of investment', desc: 'Industry of investment.' },
    { label: 'Building type', desc: 'Building type of the investment.' },
    { label: 'Is initial sponsor or lender', desc: 'Indicates if the client is an initial sponsor or lender of the investment. This field is required if Investment Type is Debt Investment or Project Finance.' },
    { label: 'Is proceeds use known', desc: 'Indicates if the use of the proceeds generated by the investment is known. This field is required if Investment Type is Debt Investment.' },
    { label: 'Total debt amount', desc: 'Total debt amount held in the investment. This field is required if "Is the use of the proceeds known?" is No.' },
    { label: 'Total asset revenue', desc: 'Annual asset revenue. This field is required if "Is the client an initial sponsor or lender of the investment?" is Yes.' },
    { label: 'Asset status', desc: 'Status of the asset. This field is required if "Is the client an initial sponsor or lender of the investment?" is Yes.' },
    { label: 'Total asset cost', desc: 'Total asset cost. This field is required if Investment Type is Debt Investment.' },
    { label: 'Annual asset cost', desc: 'Annual asset cost. This field is required if Investment Type is Debt Investment.' },
    { label: 'Projected annual emissions', desc: 'Projected annual emissions of the investment. This field is required if Investment Type is Debt Investment.' },
    { label: 'Projected lifetime in years', desc: 'Projected lifetime in years of the investment. This field is required if Investment Type is Debt Investment.' },
    { label: 'em_template_a3e2c1d45b6f4a8e9c2d7f1b3e4a5c6d', desc: '' },
    { label: 'Emissions of the investment', desc: 'Emissions of the investment. Required for emissions calculations.' },
    { label: 'Emissions UoM', desc: 'Unit of measure for the investment emissions.' },
    { label: 'em_template_e7a2c8b14f3d4e2a9b7c2d1f8a6c5b4e', desc: '' }
  ];
  var unrecognizedNames = ['Date', 'method', 'UOM', 'Total', 'Revenue', 'descrkption'];
  var columnMatches = [];

  function levenshtein(s, t) {
    var m = s.length, n = t.length;
    var d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 0; j <= n; j++) { d[0][j] = j; }
    for (var i2 = 1; i2 <= m; i2++) {
      for (var j2 = 1; j2 <= n; j2++) {
        var cost = s[i2 - 1] === t[j2 - 1] ? 0 : 1;
        d[i2][j2] = Math.min(d[i2 - 1][j2] + 1, d[i2][j2 - 1] + 1, d[i2 - 1][j2 - 1] + cost);
      }
    }
    return d[m][n];
  }

  function correctTypo(input, vocabulary) {
    var lower = input.toLowerCase();
    var bestWord = lower;
    var bestDist = Infinity;
    for (var i = 0; i < vocabulary.length; i++) {
      var w = vocabulary[i].toLowerCase();
      if (w === lower) return lower;
      var d = levenshtein(lower, w);
      if (d < bestDist && d <= Math.ceil(lower.length * 0.4)) {
        bestDist = d;
        bestWord = w;
      }
    }
    return bestWord;
  }

  function buildColumnMatches() {
    var vocabSet = {};
    standardColumns.forEach(function (col) {
      col.label.split(/[\s\/\-(),]+/).forEach(function (w) {
        var lw = w.toLowerCase();
        if (lw.length > 1) vocabSet[lw] = true;
      });
    });
    var vocabulary = Object.keys(vocabSet);

    columnMatches = unrecognizedNames.map(function (name) {
      var corrected = correctTypo(name, vocabulary);

      var matches = [];
      standardColumns.forEach(function (col) {
        var words = col.label.toLowerCase().split(/[\s\/\-(),]+/);
        var found = false;
        for (var i = 0; i < words.length; i++) {
          if (words[i] === corrected) { found = true; break; }
        }
        if (!found && col.label.toLowerCase().indexOf(corrected) >= 0) found = true;
        if (found) {
          matches.push({
            label: col.label,
            desc: col.desc,
            value: col.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          });
        }
      });

      var seen = {};
      var unique = [];
      matches.forEach(function (m) {
        if (!seen[m.label]) { seen[m.label] = true; unique.push(m); }
      });

      var best = unique.slice(0, 1);
      var other = unique.slice(1, 6);

      return { name: name, bestMatches: best, otherOptions: other, selected: '' };
    });

    if (currentStep === 1 && step1Tab === 'columns') renderStep1();
  }

  buildColumnMatches();

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function openWizard() {
    currentStep = 0;
    uploadedFiles = [];
    importedFiles = [];
    step1Tab = 'layouts';
    showTablePreview = false;
    savedSections = [];
    columnMatches.forEach(function (c) { c.selected = ''; });
    render();
    overlay.classList.add('upload-wiz-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    overlay.classList.remove('upload-wiz-overlay--open');
    document.body.style.overflow = '';
  }

  window.openUploadWizard = openWizard;
  window.closeUploadWizard = closeWizard;

  window.getColumnsTabHTML = function () { return renderColumnsTab(); };
  window.bindColumnsTabEvents = function (container) {
    container.querySelectorAll('input[type="radio"][data-col]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var ci = parseInt(radio.getAttribute('data-col'), 10);
        columnMatches[ci].selected = radio.value;
      });
    });
  };

  closeBtn.addEventListener('click', closeWizard);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWizard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('upload-wiz-overlay--open')) closeWizard();
  });
  discardLink.addEventListener('click', function (e) {
    e.preventDefault();
    closeWizard();
  });

  backBtn.addEventListener('click', function () {
    if (currentStep > 0) {
      currentStep--;
      render();
    } else {
      closeWizard();
      if (typeof window.openActivityDataSetupModal === 'function') {
        window.openActivityDataSetupModal();
      }
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentStep === 2) {
      closeWizard();
    } else if (currentStep < 2) {
      currentStep++;
      render();
    }
  });

  function updateStepTabs() {
    var stepsContainer = overlay.querySelector('.upload-wiz-steps');
    if (!stepsContainer) return;

    var stepData = [
      { num: 1, label: 'Add activity files' },
      { num: 2, label: 'Columns cleanup' },
      { num: 3, label: 'Review / collaborate' }
    ];

    var html = '';
    stepData.forEach(function (s, i) {
      var isComplete = i < currentStep;
      var isActive = i === currentStep;
      var cls = 'upload-wiz-stepper-item';
      if (isComplete) cls += ' upload-wiz-stepper--complete';
      else if (isActive) cls += ' upload-wiz-stepper--active';

      html += '<div class="' + cls + '" data-step="' + i + '">';
      html += '<div class="upload-wiz-stepper-label">';
      html += '<span>' + s.num + '. ' + s.label + '</span>';
      if (isComplete) html += ' <i class="fa-solid fa-circle-check upload-wiz-stepper-check"></i>';
      html += '</div>';
      html += '<div class="upload-wiz-stepper-bar"><div class="upload-wiz-stepper-bar-fill"></div></div>';
      html += '</div>';
    });

    stepsContainer.innerHTML = html;

    stepsContainer.querySelectorAll('.upload-wiz-stepper-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var s = parseInt(item.getAttribute('data-step'), 10);
        if (!isNaN(s) && s >= 0 && s <= 2) {
          currentStep = s;
          render();
        }
      });
    });
  }

  function updateFooter() {
    backBtn.textContent = 'Back';
    if (currentStep === 2) {
      nextBtn.textContent = 'Complete and exit';
    } else {
      if (currentStep === 1) {
        nextBtn.textContent = 'Review';
      } else {
        nextBtn.textContent = 'Next: add emissions files';
      }
    }

    // Toggle the normalize checkbox row
    var checkRow = overlay.querySelector('.uw-s2-check-row');
    if (checkRow) {
      checkRow.style.display = currentStep === 2 ? 'flex' : 'none';
    }
  }

  function updateModalWidth() {
    wiz.classList.toggle('upload-wiz--wide', currentStep === 1 && showTablePreview);
  }

  // ========================================
  // STEP 0 — Add activity files
  // ========================================

  function addSampleFiles() {
    var names = [
      'Southern Europe Measure Data Point Data 1',
      'Asia Measure Data Point Data 1',
      'North America Measure Data Point Data 1',
      'East Africa Measure Data Point Data 1'
    ];
    names.forEach(function (n) {
      uploadedFiles.push({ name: n, size: '999.5mb', type: 'All activity types' });
    });
    renderStep0();
  }

  function removeFile(list, idx) {
    list.splice(idx, 1);
    renderStep0();
  }

  function buildFileListHTML(files, listId) {
    if (!files.length) {
      return '<div class="upload-wiz-file-list"><div class="upload-wiz-empty-row">No files currently imported from other projects</div></div>';
    }
    var html = '<div class="upload-wiz-file-list">';
    files.forEach(function (f, i) {
      var typeOptions = '';
      ACTIVITY_TYPES.forEach(function (t) {
        typeOptions += '<option' + (f.type === t ? ' selected' : '') + '>' + esc(t) + '</option>';
      });
      html +=
        '<div class="upload-wiz-file-row" data-list="' + listId + '" data-index="' + i + '">' +
          '<span class="upload-wiz-file-name">' + esc(f.name) + '</span>' +
          '<span class="upload-wiz-file-size">' + esc(f.size) + '</span>' +
          '<span class="upload-wiz-file-type"><select>' + typeOptions + '</select></span>' +
          '<button type="button" class="upload-wiz-file-menu" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderStep0() {
    var html = '';

    html += '<p class="upload-wiz-desc">Add your activity files here by uploading a spreadsheet/CSV, importing it from another project, or typing in your own field. If you\'re not familiar with what this document looks like, we wrote <a href="#">a guide for you here</a>.</p>';
    html += '<p class="upload-wiz-hint">If your files is running into validation errors, try entering your data into our downloadable excel template</p>';

    html += '<div class="upload-wiz-section">';
    html += '<div class="upload-wiz-section-header">';
    html += '<span class="upload-wiz-section-title">Uploaded</span>';
    html += '<div class="upload-wiz-section-actions">';
    html += '<a href="#" data-action="type-own">A Type in your own field</a>';
    html += '<a href="#" data-action="add-more">+ Add files</a>';
    html += '</div>';
    html += '</div>';

    if (uploadedFiles.length === 0) {
      html +=
        '<div class="upload-wiz-dropzone" data-action="dropzone">' +
          '<div class="upload-wiz-dropzone-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>' +
          '<div class="upload-wiz-dropzone-text">Drop your Activity files here, or <a data-action="browse">browse</a></div>' +
          '<div class="upload-wiz-dropzone-meta">Supports: pdf, xls, json, xml, csv<br>Max file size 100MB</div>' +
        '</div>';
    } else {
      html += buildFileListHTML(uploadedFiles, 'uploaded');
    }
    html += '</div>';

    html += '<div class="upload-wiz-section">';
    html += '<div class="upload-wiz-section-header">';
    html += '<span class="upload-wiz-section-title">From other projects</span>';
    html += '<div class="upload-wiz-section-actions">';
    html += '<a href="#" class="upload-wiz-import-toggle" data-action="import-toggle">Import data from other projects <i class="fa-solid fa-chevron-down"></i></a>';
    html += '</div>';
    html += '</div>';
    html += buildFileListHTML(importedFiles, 'imported');
    html += '</div>';

    bodyEl.innerHTML = html;
    bindStep0Events();
  }

  function bindStep0Events() {
    var dropzone = bodyEl.querySelector('[data-action="dropzone"]');
    if (dropzone) {
      dropzone.addEventListener('click', addSampleFiles);
      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropzone.classList.add('upload-wiz-dropzone--active');
      });
      dropzone.addEventListener('dragleave', function () {
        dropzone.classList.remove('upload-wiz-dropzone--active');
      });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropzone.classList.remove('upload-wiz-dropzone--active');
        addSampleFiles();
      });
    }

    bodyEl.querySelectorAll('[data-action="add-more"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        addSampleFiles();
      });
    });

    bodyEl.querySelectorAll('[data-action="browse"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        addSampleFiles();
      });
    });

    bodyEl.querySelectorAll('[data-action="import-toggle"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (importedFiles.length === 0) {
          importedFiles = SAMPLE_IMPORTED.map(function (f) { return { name: f.name, size: f.size, type: f.type }; });
        } else {
          importedFiles = [];
        }
        renderStep0();
      });
    });

    bodyEl.querySelectorAll('.upload-wiz-file-menu').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('.upload-wiz-file-row');
        var listId = row.getAttribute('data-list');
        var idx = parseInt(row.getAttribute('data-index'), 10);
        if (listId === 'uploaded') removeFile(uploadedFiles, idx);
        else if (listId === 'imported') removeFile(importedFiles, idx);
      });
    });
  }

  // ========================================
  // STEP 1 — Columns cleanup
  // ========================================

  function renderStep1() {
    var html = '';

    // Body — two-col when preview is on, single col otherwise
    if (showTablePreview) {
      html += '<div class="uw-s1-two-col">';

      // Left: file selector + save buttons + table preview
      html += '<div class="uw-s1-preview-col">';
      var allFiles = uploadedFiles.length > 0 ? uploadedFiles : SAMPLE_IMPORTED;
      html += '<div class="uw-s1-file-select-wrap">';
      html += '<select class="uw-s1-file-select">';
      allFiles.forEach(function (f) {
        html += '<option>' + esc(f.name) + '</option>';
      });
      html += '</select>';
      html += '<i class="fa-solid fa-chevron-down uw-s1-file-select-chevron"></i>';
      html += '</div>';

      // Save buttons — right under the dropdown
      html += '<div class="uw-s1-save-actions">';
      html += '<button type="button" class="btn btn-outline btn-small uw-s1-save-btn" data-action="save-block" disabled><i class="fa-solid fa-table"></i> Save block</button>';
      html += '<button type="button" class="btn btn-outline btn-small uw-s1-save-btn" data-action="save-headers" disabled><i class="fa-solid fa-table-list"></i> Use selected row as header</button>';
      html += '</div>';

      html += '<div class="uw-s1-table-preview" id="ep-container"></div>';

      // Saved blocks list
      if (savedSections.length > 0) {
        html += '<div class="uw-s1-section-list">';
        savedSections.forEach(function (s, i) {
          html += '<div class="uw-s1-section-item" data-idx="' + i + '">';
          html += '<span class="uw-s1-section-range">' + esc(s.range) + '</span>';
          html += '<button type="button" class="uw-s1-section-remove" data-idx="' + i + '" title="Remove"><i class="fa-solid fa-trash"></i></button>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';

      // Right: intro + toggle + column mapping cards
      html += '<div class="uw-s1-map-col">';
      html += '<div class="uw-s1-intro">';
      html += '<p>For accurate calculations, your data columns need to conform to our standard data set. We found mismatches that you\'ll need to reconcile before you continue.</p>';
      html += '<p>Your original data will be preserved in our records and will not be lost.</p>';
      html += '</div>';
      html += '<div class="uw-s1-toggle-row">';
      html += '<span class="uw-s1-toggle-label">Show how we\'re reading your tables</span>';
      html += '<button type="button" class="uw-s1-toggle uw-s1-toggle--on" data-action="toggle-preview" aria-pressed="true">';
      html += '<span class="uw-s1-toggle-handle"></span>';
      html += '</button>';
      html += '</div>';
      html += renderColumnsTab();
      html += '</div>';

      html += '</div>';
    } else {
      // Single col: intro + toggle + mapping cards
      html += '<div class="uw-s1-intro">';
      html += '<p>For accurate calculations, your data columns need to conform to our standard data set. We found mismatches that you\'ll need to reconcile before you continue.</p>';
      html += '<p>Your original data will be preserved in our records and will not be lost.</p>';
      html += '</div>';
      html += '<div class="uw-s1-toggle-row">';
      html += '<span class="uw-s1-toggle-label">Show how we\'re reading your tables</span>';
      html += '<button type="button" class="uw-s1-toggle" data-action="toggle-preview" aria-pressed="false">';
      html += '<span class="uw-s1-toggle-handle"></span>';
      html += '</button>';
      html += '</div>';
      html += renderColumnsTab();
    }

    bodyEl.classList.toggle('upload-wiz-body--split', showTablePreview);
    bodyEl.innerHTML = html;
    bindStep1Events();
  }

  function renderLayoutsTab() {
    var html = '';
    html += '<div class="uw-s1-split">';

    html += '<div class="uw-s1-left">';
    if (savedSections.length === 0) {
      html += '<p class="uw-s1-left-desc">We\'re having trouble identifying where the relevant data lives in your spreadsheet. Please help us by selecting a section on the right to capture</p>';
      html += '<div class="uw-s1-select-field"><span class="uw-s1-select-text">No sections selected</span></div>';
    } else {
      html += '<div class="uw-s1-section-list">';
      savedSections.forEach(function (s, i) {
        html += '<div class="uw-s1-section-item" data-idx="' + i + '">';
        html += '<span class="uw-s1-section-range">' + esc(s.range) + '</span>';
        html += '<button type="button" class="uw-s1-section-remove" data-idx="' + i + '" title="Remove"><i class="fa-solid fa-trash"></i></button>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div class="uw-s1-save-actions">';
    html += '<button type="button" class="btn btn-sm btn-outline uw-s1-save-btn" data-action="save-block" disabled><i class="fa-solid fa-table"></i> Save block</button>';
    html += '<button type="button" class="btn btn-sm btn-outline uw-s1-save-btn" data-action="save-headers" disabled><i class="fa-solid fa-table-list"></i> Use row as header</button>';
    html += '</div>';

    html += '</div>';

    html += '<div class="uw-s1-right">';
    html += '<div class="uw-s1-parser-container" id="ep-container"></div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderColumnsTab() {
    var html = '';
    html += '<div class="uw-s1-columns">';

    columnMatches.forEach(function (col, ci) {
      html += '<div class="uw-s1-col-card">';
      html += '<div class="uw-s1-col-card-name">' + esc(col.name) + '</div>';
      html += '<div class="uw-s1-col-card-divider"></div>';
      html += '<div class="uw-s1-col-card-body">';

      // Best matches group
      html += '<div class="uw-s1-col-group">';
      if (col.bestMatches.length === 0) {
        html += '<div class="uw-s1-col-group-label">No results found</div>';
      } else {
        html += '<div class="uw-s1-col-group-label">Best matches in our standard data</div>';
        col.bestMatches.forEach(function (opt) {
          var checked = col.selected === opt.value ? ' checked' : '';
          html += '<div class="uw-s1-col-row">';
          html += '<label class="uw-s1-col-radio"><input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '"><span>' + esc(opt.label) + '</span></label>';
          html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
          html += '</div>';
        });
      }
      html += '</div>';

      if (col.otherOptions.length > 0) {
        html += '<div class="uw-s1-col-separator"></div>';
        html += '<div class="uw-s1-col-group">';
        html += '<div class="uw-s1-col-group-label">Other options</div>';
        col.otherOptions.forEach(function (opt) {
          var checked = col.selected === opt.value ? ' checked' : '';
          html += '<div class="uw-s1-col-row">';
          html += '<label class="uw-s1-col-radio"><input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '"><span>' + esc(opt.label) + '</span></label>';
          html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function bindStep1Events() {
    // Toggle preview
    var toggleBtn = bodyEl.querySelector('[data-action="toggle-preview"]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        showTablePreview = !showTablePreview;
        render();
      });
    }

    // Radio selections
    bodyEl.querySelectorAll('input[type="radio"][data-col]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var ci = parseInt(radio.getAttribute('data-col'), 10);
        columnMatches[ci].selected = radio.value;
      });
    });

    // Save block buttons
    var saveBlockBtn = bodyEl.querySelector('[data-action="save-block"]');
    var saveHeadersBtn = bodyEl.querySelector('[data-action="save-headers"]');

    function updateSaveBtns() {
      if (!window.ExcelParser) return;
      var hasSel = window.ExcelParser.hasSelection();
      var canHeader = window.ExcelParser.canSaveWithHeader();
      if (saveBlockBtn) saveBlockBtn.disabled = !hasSel;
      if (saveHeadersBtn) saveHeadersBtn.disabled = !canHeader;
    }

    if (saveBlockBtn) {
      saveBlockBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.hasSelection()) {
          var sel = window.ExcelParser.getSelection();
          var block = window.ExcelParser.saveBlock();
          if (block && sel) {
            savedSections.push({ range: block.rangeLabel, sel: sel, block: block });
            render();
          }
        }
      });
    }

    if (saveHeadersBtn) {
      saveHeadersBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.canSaveWithHeader()) {
          var sel = window.ExcelParser.getSelection();
          var block = window.ExcelParser.saveBlockWithHeader();
          if (block && sel) {
            var endRow = sel.minRow + (block.rows ? block.rows.length : 0);
            savedSections.push({
              range: block.rangeLabel,
              sel: { minRow: sel.minRow, maxRow: endRow, minCol: sel.minCol, maxCol: sel.maxCol },
              block: block
            });
            render();
          }
        }
      });
    }

    // Saved block removal
    bodyEl.querySelectorAll('.uw-s1-section-remove').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        savedSections.splice(idx, 1);
        render();
      });
    });

    bodyEl.querySelectorAll('.uw-s1-section-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = parseInt(item.getAttribute('data-idx'), 10);
        var section = savedSections[idx];
        if (section && section.sel && window.ExcelParser) {
          window.ExcelParser.setSelection(section.sel.minRow, section.sel.maxRow, section.sel.minCol, section.sel.maxCol);
        }
      });
    });

    // Initialize excel parser in preview panel if visible
    if (showTablePreview) {
      var epContainer = bodyEl.querySelector('#ep-container');
      var fileSelect = bodyEl.querySelector('.uw-s1-file-select');

      if (epContainer && window.ExcelParser) {
        var allFiles = uploadedFiles.length > 0 ? uploadedFiles : SAMPLE_IMPORTED;
        var initialName = allFiles[0] ? allFiles[0].name : '';
        var initialCSV = SAMPLE_CSV_DATA[initialName];

        window.ExcelParser.init(epContainer, {
          onSelectionChange: function () { updateSaveBtns(); }
        });
        if (initialCSV) window.ExcelParser.loadCSV(initialCSV);
        updateSaveBtns();
      }

      if (fileSelect && window.ExcelParser) {
        fileSelect.addEventListener('change', function () {
          var csv = SAMPLE_CSV_DATA[fileSelect.value];
          if (csv) {
            window.ExcelParser.loadCSV(csv);
            updateSaveBtns();
          }
        });
      }
    }
  }

  // ========================================
  // STEP 2 — Review / collaborate
  // ========================================

  function renderStep2() {
    var html = '';

    // Collaborator selector
    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Select collaborators from your organization</div>';
    html += '<div class="uw-s2-collab-field">';
    html += '<div class="uw-s2-collab-tags">';
    collaborators.forEach(function (c, i) {
      html += '<button type="button" class="uw-s2-tag" data-collab-idx="' + i + '">' + esc(c.name) + ' <i class="fa-solid fa-xmark"></i></button>';
    });
    html += '<input type="text" class="uw-s2-collab-input" placeholder="" />';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Activities data
    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Activities data</div>';
    html += '<div class="uw-s2-file-group">';

    var actFiles = uploadedFiles.length > 0 ? uploadedFiles : [
      { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' },
      { name: 'Asia Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' },
      { name: 'North America Measure Data Point Data 1', size: '999.5mb', type: 'Electricity only' },
      { name: 'East Africa Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' }
    ];

    actFiles.forEach(function (f, i) {
      var typeOptions = '';
      ACTIVITY_TYPES.forEach(function (t) {
        typeOptions += '<option' + (f.type === t ? ' selected' : '') + '>' + esc(t) + '</option>';
      });
      html += '<div class="uw-s2-file-row">';
      html += '<span class="uw-s2-file-name">' + esc(f.name) + '</span>';
      html += '<span class="uw-s2-file-size">' + esc(f.size) + '</span>';
      html += '<span class="uw-s2-file-type"><div class="uw-s2-type-btn">';
      if (f.type === 'Electricity only') {
        html += '<i class="fa-solid fa-bolt"></i> ';
      }
      html += esc(f.type) + ' <i class="fa-solid fa-chevron-down uw-s2-chevron"></i></div></span>';
      html += '<button type="button" class="uw-s2-file-menu"><i class="fa-solid fa-ellipsis-vertical"></i></button>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    // Historical emissions data
    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Historical emissions data</div>';
    html += '<div class="uw-s2-file-group">';

    SAMPLE_HISTORICAL.forEach(function (f) {
      html += '<div class="uw-s2-file-row">';
      html += '<span class="uw-s2-file-name">' + esc(f.name) + '</span>';
      html += '<span class="uw-s2-file-size">' + esc(f.size) + '</span>';
      html += '<button type="button" class="uw-s2-file-menu"><i class="fa-solid fa-ellipsis-vertical"></i></button>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    bodyEl.innerHTML = html;
    bindStep2Events();
  }

  function bindStep2Events() {
    bodyEl.querySelectorAll('.uw-s2-tag').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-collab-idx'), 10);
        collaborators.splice(idx, 1);
        renderStep2();
      });
    });
  }

  // ========================================
  // RENDER
  // ========================================

  function render() {
    updateStepTabs();
    updateFooter();
    updateModalWidth();
    if (currentStep === 0) renderStep0();
    else if (currentStep === 1) renderStep1();
    else renderStep2();
  }

  render();
})();
