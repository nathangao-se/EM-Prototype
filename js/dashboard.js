// ========================================
// DASHBOARD MODULE
// Supports:
//   - Tree-based hierarchy (5-level, global admin)
//   - Flat hierarchy (site manager, legacy)
// ========================================

(function() {
  // ===========================================
  // ACTIVE CONFIG
  // ===========================================
  let activeConfig = CONFIG_GLOBAL_OVERSIGHT;
  
  // ===========================================
  // DOM ELEMENTS
  // ===========================================
  const dashboardContent = document.querySelector('.dashboard-content');
  const expandBtn = document.querySelector('.dashboard-expand-btn');
  const collapseBtnNav = document.getElementById('collapse-btn-nav');
  const hierarchyTitleEl = document.querySelector('.dashboard-hierarchy-card .dashboard-card-title');
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
  let useTree = false;       // true if activeConfig has a hierarchy tree
  let currentNode = null;    // current position in tree
  let nodePath = [];         // breadcrumb: array of nodes from root to current
  // Legacy flat state
  let currentSelection = null;
  let currentSite = null;
  
  // ===========================================
  // LEVEL LABEL HELPERS
  // ===========================================
  const levelLabels = {
    region: 'regions',
    country: 'countries',
    local_region: 'local regions',
    city: 'cities',
    zone: 'zones'
  };

  function getChildLabel(node) {
    if (node.children && node.children.length > 0) {
      var childType = node.children[0].type;
      return levelLabels[childType] || 'items';
    }
    return 'sites';
  }

  function getMetaForChild(child) {
    if (!child._computed) return '';
    var parts = [];
    if (child.children && child.children.length > 0) {
      parts.push(child.children.length + ' ' + getChildLabel(child));
    }
    var sc = child._computed.siteCount;
    parts.push(sc + ' site' + (sc !== 1 ? 's' : ''));
    return parts.join(' · ');
  }
  
  // ===========================================
  // VISUALIZATION FOR A TREE NODE
  // ===========================================
  
  function getVisualizationForNode(node) {
    // Org level → use main world map visualization
    if (node.type === 'org' && activeConfig.visualization) {
      return { vizData: activeConfig.visualization, countLabel: 'sites' };
    }
    
    // Region level → find matching subVisualization from world map config
    if (node.type === 'region' && activeConfig.visualization && activeConfig.visualization.regions) {
      var vizRegion = activeConfig.visualization.regions.find(function(r) {
        return r.targetHierarchy === node.name;
      });
      if (vizRegion && vizRegion.subVisualization) {
        return { vizData: vizRegion.subVisualization, countLabel: 'sites' };
      }
    }
    
    // Deeper levels → auto-generate box-mode buttons from children
    if (node.children && node.children.length > 0) {
      return {
        vizData: {
          image: null,
          regions: node.children.map(function(child) {
            var inc = child._computed ? child._computed.incidents : 0;
            var st = inc > 100 ? 'danger' : inc > 20 ? 'warning' : 'blue';
            return {
              label: child.name,
              chipText: inc + ' alert' + (inc !== 1 ? 's' : ''),
              status: st,
              targetHierarchy: child.name
            };
          })
        },
        countLabel: 'sites'
      };
    }
    
    return null;
  }
  
  // ===========================================
  // TREE NAVIGATION
  // ===========================================
  
  function navigateToNode(node) {
    currentNode = node;
    nodePath.push(node);
    currentSite = null;
    dashboardContent.classList.remove('dashboard-content--expanded');
    renderTreeLevel();
  }
  
  function navigateBack() {
    if (nodePath.length <= 1) return;
    nodePath.pop();
    currentNode = nodePath[nodePath.length - 1];
    currentSite = null;
    dashboardContent.classList.remove('dashboard-content--expanded');
    renderTreeLevel();
  }
  
  function navigateToBreadcrumb(index) {
    // Trim path to the given index
    nodePath = nodePath.slice(0, index + 1);
    currentNode = nodePath[nodePath.length - 1];
    currentSite = null;
    dashboardContent.classList.remove('dashboard-content--expanded');
    renderTreeLevel();
  }
  
  // ===========================================
  // BREADCRUMB RENDERING
  // ===========================================
  
  function renderBreadcrumb() {
    if (nodePath.length <= 1) {
      hierarchyTitleEl.innerHTML = currentNode ? currentNode.name : 'Hierarchy';
      return;
    }
    
    var html = nodePath.map(function(node, i) {
      if (i === nodePath.length - 1) {
        // Current (not clickable)
        return '<span class="breadcrumb-current">' + node.name + '</span>';
      }
      return '<a class="breadcrumb-link" data-breadcrumb-index="' + i + '">' + node.name + '</a>';
    }).join(' <span class="breadcrumb-sep">›</span> ');
    
    hierarchyTitleEl.innerHTML = html;
    
    // Attach breadcrumb click handlers
    hierarchyTitleEl.querySelectorAll('.breadcrumb-link').forEach(function(link) {
      link.addEventListener('click', function() {
        var idx = parseInt(link.dataset.breadcrumbIndex);
        navigateToBreadcrumb(idx);
      });
    });
  }
  
  // ===========================================
  // TREE: RENDER CURRENT LEVEL
  // ===========================================
  
  function renderTreeLevel() {
    renderBreadcrumb();
    renderTreeHierarchy();
    renderTreeDetailContent();
    renderTreeVisualization();
  }
  
  function renderTreeHierarchy() {
    if (!currentNode || !currentNode.children || currentNode.children.length === 0) {
      // Leaf node — show sites as hierarchy items instead
      var sites = collectAllSites(currentNode, activeConfig.siteDirectory);
      hierarchyItemsContainer.innerHTML = sites.map(function(site) {
        var sparkColor = getSparklineColor(site.changeDir);
        var changeClass = site.changeDir !== 'neutral' ? ' dashboard-hierarchy-item-change--' + site.changeDir : '';
        return '<div class="dashboard-hierarchy-item" data-site-name="' + site.name + '">' +
          '<div class="dashboard-hierarchy-item-info">' +
            '<span class="dashboard-hierarchy-item-title">' + site.name + '</span>' +
            '<span class="dashboard-hierarchy-item-meta">' + site.location + ' · ' + site.employees + ' emp</span>' +
          '</div>' +
          '<div class="dashboard-hierarchy-item-progress">' +
            generateSparkline(site.spark, sparkColor) +
            '<div class="dashboard-hierarchy-item-numbers">' +
              '<span class="dashboard-hierarchy-item-percent">' + site.incidents + ' alert' + (site.incidents !== 1 ? 's' : '') + '</span>' +
              '<span class="dashboard-hierarchy-item-change' + changeClass + '">' + site.change + ' vs Q3</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="dashboard-hierarchy-divider dashboard-hierarchy-divider--light"></div>';
      }).join('');
      
      // Click → select site and show details
      hierarchyItemsContainer.querySelectorAll('.dashboard-hierarchy-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var siteName = item.dataset.siteName;
          var site = activeConfig.siteDirectory[siteName];
          if (site) {
            hierarchyItemsContainer.querySelectorAll('.dashboard-hierarchy-item').forEach(function(i) {
              i.classList.remove('dashboard-hierarchy-item--selected');
            });
            item.classList.add('dashboard-hierarchy-item--selected');
            currentSite = site;
            showSiteDetail(site);
            dashboardContent.classList.add('dashboard-content--expanded');
          }
        });
      });
      return;
    }
    
    // Show children of current node
    hierarchyItemsContainer.innerHTML = currentNode.children.map(function(child) {
      var c = child._computed || { incidents: 0, siteCount: 0, spark: [0,0,0,0,0], change: '0%', changeDir: 'neutral' };
      var sparkColor = getSparklineColor(c.changeDir);
      var changeClass = c.changeDir !== 'neutral' ? ' dashboard-hierarchy-item-change--' + c.changeDir : '';
      var meta = getMetaForChild(child);
      return '<div class="dashboard-hierarchy-item" data-child-name="' + child.name + '">' +
        '<div class="dashboard-hierarchy-item-info">' +
          '<span class="dashboard-hierarchy-item-title">' + child.name + '</span>' +
          '<span class="dashboard-hierarchy-item-meta">' + meta + '</span>' +
        '</div>' +
        '<div class="dashboard-hierarchy-item-progress">' +
          generateSparkline(c.spark, sparkColor) +
          '<div class="dashboard-hierarchy-item-numbers">' +
            '<span class="dashboard-hierarchy-item-percent">' + c.incidents + ' alert' + (c.incidents !== 1 ? 's' : '') + '</span>' +
            '<span class="dashboard-hierarchy-item-change' + changeClass + '">' + c.change + ' vs Q3</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-hierarchy-divider dashboard-hierarchy-divider--light"></div>';
    }).join('');
    
    // Click handlers: drill into child
    hierarchyItemsContainer.querySelectorAll('.dashboard-hierarchy-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var childName = item.dataset.childName;
        var child = currentNode.children.find(function(c) { return c.name === childName; });
        if (child) {
          navigateToNode(child);
        }
      });
    });
  }
  
  function renderTreeDetailContent() {
    // Collect all sites within current subtree
    var sites = collectAllSites(currentNode, activeConfig.siteDirectory);
    
    // Update nav card title
    var label = currentNode.name;
    detailNavTitle.textContent = label + ' — ' + sites.length + ' site' + (sites.length !== 1 ? 's' : '');
    
    // Reset site selection
    currentSite = null;
    detailExpandedTitle.textContent = 'Select a site';
    detailExpandedTable.style.display = 'none';
    detailPlaceholder.style.display = 'block';
    
    // Render site list
    detailCollapsed.innerHTML = sites.map(function(site, index) {
      var sparkColor = site.changeDir === 'up' ? '#dc2626' : '#008029';
      return '<div class="dashboard-detail-item" data-site-index="' + index + '">' +
        '<div class="dashboard-detail-item-info">' +
          '<span class="dashboard-detail-item-title">' + site.name + '</span>' +
          '<span class="dashboard-detail-item-meta">' + site.location + ' · ' + site.employees + ' employees</span>' +
        '</div>' +
        '<div class="dashboard-detail-item-stats">' +
          generateSparkline(site.spark, sparkColor) +
          '<div class="dashboard-detail-item-numbers">' +
            '<span class="dashboard-detail-item-incidents">' + site.incidents + ' alert' + (site.incidents !== 1 ? 's' : '') + '</span>' +
            '<span class="dashboard-detail-item-change dashboard-detail-item-change--' + site.changeDir + '">' + site.change + ' vs Q3</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-detail-divider dashboard-detail-divider--light"></div>';
    }).join('');
    
    // Attach click handlers to site items
    var sitesCopy = sites; // closure reference
    detailCollapsed.querySelectorAll('.dashboard-detail-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var siteIndex = parseInt(item.dataset.siteIndex);
        var site = sitesCopy[siteIndex];
        if (site) {
          detailCollapsed.querySelectorAll('.dashboard-detail-item').forEach(function(i) {
            i.classList.remove('dashboard-detail-item--selected');
          });
          item.classList.add('dashboard-detail-item--selected');
          currentSite = site;
          showSiteDetail(site);
          dashboardContent.classList.add('dashboard-content--expanded');
        }
      });
    });
  }
  
  function renderTreeVisualization() {
    if (typeof renderVisualization !== 'function') return;
    
    var result = getVisualizationForNode(currentNode);
    if (!result) return;
    
    var showBack = nodePath.length > 1;
    
    renderVisualization(result.vizData, handleTreeVizClick, {
      showBack: showBack,
      onBack: navigateBack,
      countLabel: result.countLabel
    });
  }
  
  function handleTreeVizClick(item) {
    var targetName = item.targetHierarchy;
    
    // Find matching child in current node
    if (currentNode.children) {
      var child = currentNode.children.find(function(c) { return c.name === targetName; });
      if (child) {
        navigateToNode(child);
        return;
      }
    }
    
    // Check if it matches a site name (for leaf-level viz)
    if (activeConfig.siteDirectory && activeConfig.siteDirectory[targetName]) {
      // Find the site item in the detail list and click it
      var siteItems = detailCollapsed.querySelectorAll('.dashboard-detail-item');
      siteItems.forEach(function(el) {
        var titleEl = el.querySelector('.dashboard-detail-item-title');
        if (titleEl && titleEl.textContent === targetName) {
          el.click();
        }
      });
    }
  }
  
  // ===========================================
  // FLAT/LEGACY RENDERING (site manager)
  // ===========================================
  
  function renderFlatHierarchy() {
    hierarchyTitleEl.textContent = 'Hierarchy';
    hierarchyItemsContainer.innerHTML = activeConfig.hierarchyRegions.map(function(region) {
      var sparkColor = getSparklineColor(region.changeDir);
      var selectedClass = region.name === currentSelection ? ' dashboard-hierarchy-item--selected' : '';
      var changeClass = region.changeDir !== 'neutral' ? ' dashboard-hierarchy-item-change--' + region.changeDir : '';
      return '<div class="dashboard-hierarchy-item' + selectedClass + '" data-region="' + region.name + '">' +
        '<div class="dashboard-hierarchy-item-info">' +
          '<span class="dashboard-hierarchy-item-title">' + region.name + '</span>' +
          '<span class="dashboard-hierarchy-item-meta">' + region.meta + '</span>' +
        '</div>' +
        '<div class="dashboard-hierarchy-item-progress">' +
          generateSparkline(region.spark, sparkColor) +
          '<div class="dashboard-hierarchy-item-numbers">' +
            '<span class="dashboard-hierarchy-item-percent">' + region.incidents + ' alert' + (region.incidents !== 1 ? 's' : '') + '</span>' +
            '<span class="dashboard-hierarchy-item-change' + changeClass + '">' + region.change + ' vs Q3</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-hierarchy-divider dashboard-hierarchy-divider--light"></div>';
    }).join('');

    document.querySelectorAll('.dashboard-hierarchy-item').forEach(function(item) {
      item.addEventListener('click', function() {
        document.querySelectorAll('.dashboard-hierarchy-item').forEach(function(i) { i.classList.remove('dashboard-hierarchy-item--selected'); });
        item.classList.add('dashboard-hierarchy-item--selected');
        var regionName = item.dataset.region;
        currentSelection = regionName;
        updateFlatDetailContent(regionName);
      });
    });
  }
  
  function updateFlatDetailContent(regionName) {
    var data = activeConfig.hierarchyData[regionName];
    if (!data) return;

    detailNavTitle.textContent = regionName + ' sites';
    currentSite = null;
    detailExpandedTitle.textContent = 'Select a site';
    detailExpandedTable.style.display = 'none';
    detailPlaceholder.style.display = 'block';

    detailCollapsed.innerHTML = data.sites.map(function(site, index) {
      var sparkColor = site.changeDir === 'up' ? '#dc2626' : '#008029';
      return '<div class="dashboard-detail-item" data-site-index="' + index + '">' +
        '<div class="dashboard-detail-item-info">' +
          '<span class="dashboard-detail-item-title">' + site.name + '</span>' +
          '<span class="dashboard-detail-item-meta">' + site.location + ' · ' + site.employees + ' employees</span>' +
        '</div>' +
        '<div class="dashboard-detail-item-stats">' +
          generateSparkline(site.spark, sparkColor) +
          '<div class="dashboard-detail-item-numbers">' +
            '<span class="dashboard-detail-item-incidents">' + site.incidents + ' alert' + (site.incidents !== 1 ? 's' : '') + '</span>' +
            '<span class="dashboard-detail-item-change dashboard-detail-item-change--' + site.changeDir + '">' + site.change + ' vs Q3</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-detail-divider dashboard-detail-divider--light"></div>';
    }).join('');

    var sitesCopy = data.sites;
    document.querySelectorAll('.dashboard-detail-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var siteIndex = parseInt(item.dataset.siteIndex);
        var site = sitesCopy[siteIndex];
        if (site) {
          document.querySelectorAll('.dashboard-detail-item').forEach(function(i) { i.classList.remove('dashboard-detail-item--selected'); });
          item.classList.add('dashboard-detail-item--selected');
          currentSite = site;
          showSiteDetail(site);
          dashboardContent.classList.add('dashboard-content--expanded');
        }
      });
    });
  }
  
  function handleFlatVizClick(region) {
    if (region.isBackNavigation) {
      currentSelection = activeConfig.defaultSelection;
      renderFlatHierarchy();
      updateFlatDetailContent(currentSelection);
      dashboardContent.classList.remove('dashboard-content--expanded');
      return;
    }
    if (region.isDrillDown) {
      var siteName = region.targetHierarchy;
      var siteItems = document.querySelectorAll('.dashboard-detail-item');
      siteItems.forEach(function(item) {
        var titleEl = item.querySelector('.dashboard-detail-item-title');
        if (titleEl && titleEl.textContent === siteName) item.click();
      });
      return;
    }
    var targetName = region.targetHierarchy;
    var hierarchyItem = document.querySelector('.dashboard-hierarchy-item[data-region="' + targetName + '"]');
    if (hierarchyItem) {
      document.querySelectorAll('.dashboard-hierarchy-item').forEach(function(i) { i.classList.remove('dashboard-hierarchy-item--selected'); });
      hierarchyItem.classList.add('dashboard-hierarchy-item--selected');
      currentSelection = targetName;
      updateFlatDetailContent(targetName);
    }
  }
  
  // ===========================================
  // SHARED: SITE DETAIL RENDERING
  // ===========================================
  
  function showSiteDetail(site) {
    detailExpandedTitle.textContent = site.name + ' — ' + site.incidents + ' alert' + (site.incidents !== 1 ? 's' : '');
    detailExpandedTable.style.display = 'table';
    detailPlaceholder.style.display = 'none';

    var severityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
    
    detailExpandedTbody.innerHTML = site.alerts.map(function(alert) {
      return '<tr>' +
        '<td><span class="dashboard-table-category dashboard-table-category--' + alert.category.toLowerCase() + '">' + alert.category + '</span></td>' +
        '<td class="dashboard-table-issue">' + alert.issue + '</td>' +
        '<td><span class="dashboard-table-severity dashboard-table-severity--' + alert.severity + '">' + severityLabels[alert.severity] + '</span></td>' +
        '<td class="dashboard-table-date">' + alert.date + '</td>' +
      '</tr>';
    }).join('');
  }
  
  // ===========================================
  // EXPAND/COLLAPSE
  // ===========================================
  
  expandBtn.addEventListener('click', function() {
    dashboardContent.classList.add('dashboard-content--expanded');
  });

  collapseBtnNav.addEventListener('click', function() {
    dashboardContent.classList.remove('dashboard-content--expanded');
  });
  
  // ===========================================
  // CONFIG MANAGEMENT
  // ===========================================
  
  window.loadConfig = function(config) {
    activeConfig = config;
    
    if (typeof computeTotals === 'function') {
      computeTotals(config);
    }
    
    currentSite = null;
    dashboardContent.classList.remove('dashboard-content--expanded');
    
    if (typeof renderGoals === 'function') {
      renderGoals(config);
    }
    
    initDashboard();
  };
  
  window.getActiveConfig = function() {
    return activeConfig;
  };
  
  // ===========================================
  // INITIALIZATION
  // ===========================================
  
  function initDashboard() {
    useTree = !!(activeConfig.hierarchy && activeConfig.siteDirectory);
    
    if (useTree) {
      // Tree-based navigation (global admin)
      currentNode = activeConfig.hierarchy;
      nodePath = [currentNode];
      renderTreeLevel();
    } else {
      // Flat navigation (site manager)
      currentSelection = activeConfig.defaultSelection;
      renderFlatHierarchy();
      updateFlatDetailContent(currentSelection);
      
      // Render visualization with flat handler
      if (typeof renderVisualization === 'function') {
        renderVisualization(activeConfig.visualization, handleFlatVizClick, {});
      }
    }
  }
  
  // Compute totals before first render
  if (typeof computeTotals === 'function') {
    computeTotals(activeConfig);
  }
  
  // Render goals
  if (typeof renderGoals === 'function') {
    renderGoals(activeConfig);
  }
  
  // Init dashboard
  initDashboard();
  
})();
