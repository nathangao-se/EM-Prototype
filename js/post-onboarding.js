// ========================================
// POST-ONBOARDING FRONT PAGE
// Builds a zero-state config and feeds it
// through the existing loadConfig() pipeline
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

  function buildConfig(data) {
    var projectName = data.projectName || 'Untitled project';
    var typeLabel = data.projectType || PROJECT_TYPE_DISPLAY[data.selectedProject] || 'Project';
    var lengthLabel = data.projectLength || '';
    var schedule = buildScheduleSummary(data);
    var title = 'Project: ' + projectName;

    return {
      id: 'post-onboarding',
      name: 'Post-onboarding',

      goals: null,

      // ===== PROJECT BAR — zero-state KPI cards =====
      projectBar: {
        title: title,
        cards: [
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
        ]
      },

      // ===== VISUALIZATION — empty state =====
      visualization: {
        image: null,
        imageAlt: null,
        regions: []
      },

      // ===== DASHBOARD — single placeholder entry =====
      defaultSelection: 'Overview',
      hierarchyRegions: [
        { name: 'Overview', meta: 'No data yet', incidents: 0, change: '0%', changeDir: 'neutral', spark: [0, 0, 0, 0, 0] }
      ],
      hierarchyData: {
        'Overview': {
          sites: [
            {
              name: 'No activity data',
              location: 'Upload files to populate this view',
              employees: '\u2014',
              incidents: 0,
              change: '0%',
              changeDir: 'neutral',
              status: 'good',
              spark: [0, 0, 0, 0, 0],
              alerts: []
            }
          ]
        }
      }
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
