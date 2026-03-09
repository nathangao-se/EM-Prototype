// ========================================
// POST-ONBOARDING FRONT PAGE
// Builds a config (zero-state or populated)
// and feeds it through the existing loadConfig()
// ========================================

(function () {
  'use strict';

  var active = false;
  var goalsEl = document.querySelector('.goals');

  var PROJECT_TYPE_DISPLAY = {
    continuous: 'Continuous or ad hoc',
    seasonal: 'Seasonal',
    ghg: 'Greenhouse Gas audit'
  };

  function buildScheduleSummary(data) {
    if (!data) return '';
    var parts = [];
    var len = data.projectLength || '';

    if (len === 'Daily/perm' || len === 'daily') {
      if (data.days) parts.push(data.days);
      if (data.time) parts.push('at ' + data.time);
    } else if (len === 'Weekly' || len === 'weekly') {
      if (data.day) parts.push('Every ' + data.day);
      if (data.time) parts.push('at ' + data.time);
    } else if (len === 'Monthly' || len === 'monthly') {
      if (data.monthMode) parts.push(data.monthMode);
      if (data.monthValue) parts.push(data.monthValue);
    } else if (len === 'Annual/custom' || len === 'annual') {
      if (data.startDate && data.endDate) parts.push(data.startDate + ' \u2013 ' + data.endDate);
    }

    return parts.length ? ', ' + parts.join(' ') : '';
  }

  // Simulated activity data derived from uploaded files
  var SIM_ACTIVITIES = [
    { name: 'Stationary Combustion — Natural Gas', scope: 'Scope 1', type: 'Fuel consumption', records: 42, status: 'Normalized' },
    { name: 'Purchased Electricity', scope: 'Scope 2', type: 'Electricity', records: 38, status: 'Normalized' },
    { name: 'Business Travel — Air', scope: 'Scope 3', type: 'Travel', records: 27, status: 'Pending review' },
    { name: 'Employee Commuting', scope: 'Scope 3', type: 'Travel', records: 19, status: 'Pending review' },
    { name: 'Purchased Goods & Services', scope: 'Scope 3', type: 'Spend-based', records: 64, status: 'Normalized' },
    { name: 'Waste Generated in Operations', scope: 'Scope 3', type: 'Waste', records: 15, status: 'Needs attention' },
    { name: 'Mobile Combustion — Fleet', scope: 'Scope 1', type: 'Fuel consumption', records: 22, status: 'Normalized' },
    { name: 'Upstream Transportation', scope: 'Scope 3', type: 'Logistics', records: 11, status: 'Pending review' }
  ];

  function buildConfig(data) {
    var projectName = data.projectName || 'Untitled project';
    var typeLabel = data.projectType || PROJECT_TYPE_DISPLAY[data.selectedProject] || 'Project';
    var lengthLabel = data.projectLength || '';
    var schedule = buildScheduleSummary(data);
    var title = 'Project: ' + projectName;
    var files = data.uploadedFiles || [];
    var hasFiles = files.length > 0;

    var fileCount = files.length;
    var totalActivities = 0;
    var normalizedCount = 0;
    SIM_ACTIVITIES.forEach(function (a) {
      totalActivities += a.records;
      if (a.status === 'Normalized') normalizedCount += a.records;
    });
    var normPct = totalActivities > 0 ? Math.round((normalizedCount / totalActivities) * 100) : 0;

    var projectBarCards;
    var hierarchyRegions;
    var hierarchyData;
    var visualization;

    if (hasFiles) {
      projectBarCards = [
        {
          label: 'File collection and activities',
          value: normPct + '%',
          unit: 'Activities normalized',
          icon: 'fa-solid fa-triangle-exclamation',
          iconBg: 'warning',
          subtitle: fileCount + ' files uploaded, ' + normalizedCount + '/' + totalActivities + ' normalized',
          progress: normPct,
          actions: [
            { label: 'Add files', icon: 'fa-solid fa-plus', actionId: 'open-activity-data-setup' },
            { label: 'Review activity data', icon: 'fa-solid fa-map', actionId: 'open-activity-map', slot: 'left' }
          ]
        },
        {
          label: 'Emissions calculations',
          value: '0%',
          unit: 'EF Map rate',
          subtitle: totalActivities + ' activities discovered, 0 mapped',
          progress: 0,
          actions: [
            { label: 'EF library', icon: 'fa-solid fa-chart-simple', actionId: 'open-ef-library' },
            { label: 'Calculation methods', icon: 'fa-solid fa-flask', actionId: 'open-calc-methods', slot: 'left' }
          ]
        },
        {
          label: 'Inventory and Statements',
          value: '0',
          unit: 'Inventories completed',
          chip: 'Draft',
          chipIcon: 'fa-regular fa-file-lines',
          subtitle: 'Normalize activities and assign EFs first',
          progress: 0,
          actions: [
            { label: 'Create projections', icon: 'fa-solid fa-chart-simple', actionId: 'open-inventory-wizard' }
          ]
        }
      ];

      // Build hierarchy from simulated activities grouped by scope
      var scopeGroups = {};
      SIM_ACTIVITIES.forEach(function (a) {
        if (!scopeGroups[a.scope]) scopeGroups[a.scope] = { activities: [], totalRecords: 0 };
        scopeGroups[a.scope].activities.push(a);
        scopeGroups[a.scope].totalRecords += a.records;
      });

      var scopeNames = Object.keys(scopeGroups);
      var allAlertCount = 0;
      SIM_ACTIVITIES.forEach(function (a) {
        if (a.status === 'Needs attention' || a.status === 'Pending review') allAlertCount += 1;
      });

      hierarchyRegions = [
        { name: 'All Scopes', meta: scopeNames.length + ' scopes \u00B7 ' + totalActivities + ' records', incidents: allAlertCount, change: 'New', changeDir: 'neutral', spark: [0, 0, 0, 0, 0] }
      ];

      scopeNames.forEach(function (scope) {
        var g = scopeGroups[scope];
        var alerts = 0;
        g.activities.forEach(function (a) {
          if (a.status === 'Needs attention' || a.status === 'Pending review') alerts++;
        });
        hierarchyRegions.push({
          name: scope,
          meta: g.activities.length + ' activity types \u00B7 ' + g.totalRecords + ' records',
          incidents: alerts,
          change: 'New',
          changeDir: 'neutral',
          spark: [0, 0, 0, 0, 0]
        });
      });

      hierarchyData = {};
      hierarchyData['All Scopes'] = {
        sites: SIM_ACTIVITIES.map(function (a) {
          var sev = a.status === 'Needs attention' ? 1 : (a.status === 'Pending review' ? 1 : 0);
          return {
            name: a.name,
            location: a.scope + ' \u00B7 ' + a.type,
            employees: a.records + ' records',
            incidents: sev,
            change: 'New',
            changeDir: 'neutral',
            status: a.status === 'Normalized' ? 'good' : 'warning',
            spark: [0, 0, 0, 0, 0],
            alerts: sev > 0 ? [{ category: 'Data quality', issue: a.status + ' \u2014 ' + a.records + ' records require review', severity: a.status === 'Needs attention' ? 'high' : 'medium', date: 'Today' }] : []
          };
        })
      };

      scopeNames.forEach(function (scope) {
        var g = scopeGroups[scope];
        hierarchyData[scope] = {
          sites: g.activities.map(function (a) {
            var sev = a.status === 'Needs attention' ? 1 : (a.status === 'Pending review' ? 1 : 0);
            return {
              name: a.name,
              location: a.type,
              employees: a.records + ' records',
              incidents: sev,
              change: 'New',
              changeDir: 'neutral',
              status: a.status === 'Normalized' ? 'good' : 'warning',
              spark: [0, 0, 0, 0, 0],
              alerts: sev > 0 ? [{ category: 'Data quality', issue: a.status + ' \u2014 ' + a.records + ' records require review', severity: a.status === 'Needs attention' ? 'high' : 'medium', date: 'Today' }] : []
            };
          })
        };
      });

      visualization = {
        image: null,
        imageAlt: null,
        regions: scopeNames.map(function (scope) {
          var g = scopeGroups[scope];
          var alerts = 0;
          g.activities.forEach(function (a) {
            if (a.status !== 'Normalized') alerts++;
          });
          return {
            label: scope + ' \u2014 ' + g.activities.length + ' types',
            chipText: g.totalRecords + ' records',
            status: alerts > 0 ? 'warning' : 'blue',
            targetHierarchy: scope
          };
        })
      };

    } else {
      // Zero-state
      projectBarCards = [
        {
          label: 'File collection and activities',
          value: '0%',
          unit: 'Activities normalized',
          icon: 'fa-regular fa-folder-open',
          iconBg: 'neutral',
          subtitle: '0 files uploaded, 0 activities discovered',
          progress: 0,
          actions: [
            { label: 'Add files', icon: 'fa-solid fa-plus', actionId: 'open-activity-data-setup' }
          ]
        },
        {
          label: 'Emissions calculations',
          value: '0%',
          unit: 'EF Map rate',
          subtitle: '0 emissions factors assigned',
          progress: 0,
          actions: [
            { label: 'EF library', icon: 'fa-solid fa-chart-simple', actionId: 'open-ef-library' }
          ]
        },
        {
          label: 'Inventory and Statements',
          value: '0',
          unit: 'Inventories completed',
          chip: 'Draft',
          chipIcon: 'fa-regular fa-file-lines',
          subtitle: 'Create your first inventory after data collection',
          progress: 0,
          actions: [
            { label: 'Create projections', icon: 'fa-solid fa-chart-simple', actionId: 'open-inventory-wizard' }
          ]
        }
      ];

      visualization = { image: null, imageAlt: null, regions: [] };

      hierarchyRegions = [
        { name: 'Overview', meta: 'No data yet', incidents: 0, change: '0%', changeDir: 'neutral', spark: [0, 0, 0, 0, 0] }
      ];

      hierarchyData = {
        'Overview': {
          sites: [{
            name: 'No activity data',
            location: 'Upload files to populate this view',
            employees: '\u2014',
            incidents: 0,
            change: '0%',
            changeDir: 'neutral',
            status: 'good',
            spark: [0, 0, 0, 0, 0],
            alerts: []
          }]
        }
      };
    }

    return {
      id: 'post-onboarding',
      name: 'Post-onboarding',
      goals: null,
      projectBar: { title: title, cards: projectBarCards },
      visualization: visualization,
      defaultSelection: hasFiles ? 'All Scopes' : 'Overview',
      hierarchyRegions: hierarchyRegions,
      hierarchyData: hierarchyData
    };
  }

  window.renderPostOnboarding = function () {
    var data = window.onboardingProject || {};
    var config = buildConfig(data);

    if (typeof window.loadConfig === 'function') {
      window.loadConfig(config);
    }

    if (goalsEl) goalsEl.style.display = 'none';
    active = true;
  };

  window.exitPostOnboarding = function () {
    if (!active) return;
    if (goalsEl) goalsEl.style.display = '';
    active = false;
  };

})();
