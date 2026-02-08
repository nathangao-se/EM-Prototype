// ========================================
// DASHBOARD MODULE
// ========================================

(function() {
  // ===========================================
  // ACTIVE CONFIG - swap this to change perspective
  // ===========================================
  let activeConfig = CONFIG_GLOBAL_OVERSIGHT;
  
  // ===========================================
  // DOM ELEMENTS
  // ===========================================
  const dashboardContent = document.querySelector('.dashboard-content');
  const expandBtn = document.querySelector('.dashboard-expand-btn');
  const collapseBtnNav = document.getElementById('collapse-btn-nav');
  const hierarchyItemsContainer = document.querySelector('.dashboard-hierarchy-items');
  const detailNavTitle = document.querySelector('.dashboard-detail-nav .dashboard-card-title');
  const detailCollapsed = document.querySelector('.dashboard-detail-collapsed');
  const detailExpandedTitle = document.querySelector('.dashboard-detail-expanded-title');
  const detailExpandedTable = document.querySelector('.dashboard-detail-expanded-content .dashboard-table');
  const detailExpandedTbody = document.querySelector('.dashboard-detail-expanded-content tbody');
  const detailPlaceholder = document.querySelector('.dashboard-detail-placeholder');
  
  // ===========================================
  // STATE
  // ===========================================
  let currentSelection = activeConfig.defaultSelection;
  let currentSite = null;
  
  // ===========================================
  // CONFIG MANAGEMENT
  // ===========================================
  
  /**
   * Load/swap configuration
   * @param {Object} config - Configuration object to load
   */
  window.loadConfig = function(config) {
    activeConfig = config;
    
    // Reset to default selection
    currentSelection = config.defaultSelection;
    currentSite = null;
    
    // Re-render goals section
    if (typeof renderGoals === 'function') {
      renderGoals(config);
    }
    
    // Re-render visualization
    if (typeof renderVisualization === 'function') {
      renderVisualization(config, handleVisualizationClick);
    }
    
    // Re-render dashboard with new config
    renderHierarchy();
    updateDetailContent(currentSelection);
    
    // Collapse to condensed state
    dashboardContent.classList.remove('dashboard-content--expanded');
  };
  
  /**
   * Get the currently active config
   * @returns {Object} The active configuration
   */
  window.getActiveConfig = function() {
    return activeConfig;
  };
  
  // ===========================================
  // EXPAND/COLLAPSE
  // ===========================================
  
  expandBtn.addEventListener('click', () => {
    dashboardContent.classList.add('dashboard-content--expanded');
  });

  collapseBtnNav.addEventListener('click', () => {
    dashboardContent.classList.remove('dashboard-content--expanded');
  });
  
  // ===========================================
  // VISUALIZATION CLICK HANDLER
  // ===========================================
  
  function handleVisualizationClick(region) {
    // Find and select the matching hierarchy item
    const targetName = region.targetHierarchy;
    const hierarchyItem = document.querySelector(`.dashboard-hierarchy-item[data-region="${targetName}"]`);
    
    if (hierarchyItem) {
      // Update visual selection
      document.querySelectorAll('.dashboard-hierarchy-item').forEach(i => i.classList.remove('dashboard-hierarchy-item--selected'));
      hierarchyItem.classList.add('dashboard-hierarchy-item--selected');
      
      // Update state and content
      currentSelection = targetName;
      updateDetailContent(targetName);
    }
  }
  
  // ===========================================
  // HIERARCHY RENDERING
  // ===========================================
  
  function renderHierarchy() {
    hierarchyItemsContainer.innerHTML = activeConfig.hierarchyRegions.map((region, index) => {
      const sparkColor = getSparklineColor(region.changeDir);
      const selectedClass = region.name === currentSelection ? ' dashboard-hierarchy-item--selected' : '';
      const changeClass = region.changeDir !== 'neutral' ? ` dashboard-hierarchy-item-change--${region.changeDir}` : '';
      return `
      <div class="dashboard-hierarchy-item${selectedClass}" data-region="${region.name}">
        <div class="dashboard-hierarchy-item-info">
          <span class="dashboard-hierarchy-item-title">${region.name}</span>
          <span class="dashboard-hierarchy-item-meta">${region.meta}</span>
        </div>
        <div class="dashboard-hierarchy-item-progress">
          ${generateSparkline(region.spark, sparkColor)}
          <div class="dashboard-hierarchy-item-numbers">
            <span class="dashboard-hierarchy-item-percent">${region.incidents} alert${region.incidents !== 1 ? 's' : ''}</span>
            <span class="dashboard-hierarchy-item-change${changeClass}">${region.change} vs Q3</span>
          </div>
        </div>
      </div>
      <div class="dashboard-hierarchy-divider dashboard-hierarchy-divider--light"></div>
    `}).join('');

    // Attach click handlers
    document.querySelectorAll('.dashboard-hierarchy-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.dashboard-hierarchy-item').forEach(i => i.classList.remove('dashboard-hierarchy-item--selected'));
        item.classList.add('dashboard-hierarchy-item--selected');
        const regionName = item.dataset.region;
        currentSelection = regionName;
        updateDetailContent(regionName);
      });
    });
  }
  
  // ===========================================
  // DETAIL CONTENT RENDERING
  // ===========================================
  
  function updateDetailContent(regionName) {
    const data = activeConfig.hierarchyData[regionName];
    if (!data) return;

    // Update nav card title
    detailNavTitle.textContent = `${regionName} sites`;

    // Reset site selection
    currentSite = null;
    detailExpandedTitle.textContent = 'Select a site';
    detailExpandedTable.style.display = 'none';
    detailPlaceholder.style.display = 'block';

    // Update collapsed view with clickable items
    detailCollapsed.innerHTML = data.sites.map((site, index) => {
      const sparkColor = site.changeDir === 'up' ? '#dc2626' : '#008029';
      return `
      <div class="dashboard-detail-item" data-site-index="${index}">
        <div class="dashboard-detail-item-info">
          <span class="dashboard-detail-item-title">${site.name}</span>
          <span class="dashboard-detail-item-meta">${site.location} · ${site.employees} employees</span>
        </div>
        <div class="dashboard-detail-item-stats">
          ${generateSparkline(site.spark, sparkColor)}
          <div class="dashboard-detail-item-numbers">
            <span class="dashboard-detail-item-incidents">${site.incidents} alert${site.incidents !== 1 ? 's' : ''}</span>
            <span class="dashboard-detail-item-change dashboard-detail-item-change--${site.changeDir}">${site.change} vs Q3</span>
          </div>
        </div>
      </div>
      <div class="dashboard-detail-divider dashboard-detail-divider--light"></div>
    `}).join('');

    // Attach click handlers to site items
    document.querySelectorAll('.dashboard-detail-item').forEach(item => {
      item.addEventListener('click', () => {
        const siteIndex = parseInt(item.dataset.siteIndex);
        const site = data.sites[siteIndex];
        if (site) {
          // Update selection state
          document.querySelectorAll('.dashboard-detail-item').forEach(i => i.classList.remove('dashboard-detail-item--selected'));
          item.classList.add('dashboard-detail-item--selected');
          currentSite = site;
          showSiteDetail(site);
          // Expand into [expanded] state
          dashboardContent.classList.add('dashboard-content--expanded');
        }
      });
    });
  }
  
  // ===========================================
  // SITE DETAIL RENDERING
  // ===========================================
  
  function showSiteDetail(site) {
    // Update expanded card title
    detailExpandedTitle.textContent = `${site.name} — ${site.incidents} alert${site.incidents !== 1 ? 's' : ''}`;
    
    // Show table, hide placeholder
    detailExpandedTable.style.display = 'table';
    detailPlaceholder.style.display = 'none';

    // Severity styling
    const severityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
    
    // Render alerts
    detailExpandedTbody.innerHTML = site.alerts.map(alert => `
      <tr>
        <td><span class="dashboard-table-category dashboard-table-category--${alert.category.toLowerCase()}">${alert.category}</span></td>
        <td class="dashboard-table-issue">${alert.issue}</td>
        <td><span class="dashboard-table-severity dashboard-table-severity--${alert.severity}">${severityLabels[alert.severity]}</span></td>
        <td class="dashboard-table-date">${alert.date}</td>
      </tr>
    `).join('');
  }
  
  // ===========================================
  // INITIALIZATION
  // ===========================================
  
  // Render goals (if goals.js is loaded)
  if (typeof renderGoals === 'function') {
    renderGoals(activeConfig);
  }
  
  // Render visualization (if visualization.js is loaded)
  if (typeof renderVisualization === 'function') {
    renderVisualization(activeConfig, handleVisualizationClick);
  }
  
  renderHierarchy();
  updateDetailContent(activeConfig.defaultSelection);
  
})();
