// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate a sparkline placeholder div that will be rendered by ECharts.
 * Falls back to inline SVG if ECharts is not loaded.
 */
function generateSparkline(values, color) {
  var encoded = encodeURIComponent(JSON.stringify(values));
  return '<div class="sparkline" data-sparkline-values="' + encoded + '" data-sparkline-color="' + color + '" style="width:60px;height:24px;"></div>';
}

/**
 * Initialize all sparkline placeholders as ECharts mini-line charts.
 * Call after DOM content is rendered.
 */
function initSparklines(root) {
  if (typeof echarts === 'undefined') return;
  var container = root || document;
  container.querySelectorAll('[data-sparkline-values]').forEach(function (el) {
    if (el._sparkInited) return;
    if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
    el._sparkInited = true;
    var values = JSON.parse(decodeURIComponent(el.getAttribute('data-sparkline-values')));
    var color = el.getAttribute('data-sparkline-color') || '#676f73';
    var chart = echarts.init(el);
    chart.setOption({
      grid: { top: 2, right: 2, bottom: 2, left: 2 },
      xAxis: { type: 'category', show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false },
      series: [{
        type: 'line',
        data: values,
        symbol: 'none',
        smooth: true,
        lineStyle: { color: color, width: 2 },
        areaStyle: { color: 'transparent' },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: '#dfe7eb', width: 1, type: 'solid' },
          data: [{ yAxis: 0 }]
        }
      }],
      tooltip: { show: false },
      animation: true,
      animationDuration: 400,
      animationEasing: 'cubicOut'
    });
    if (typeof window._sparkCharts === 'undefined') window._sparkCharts = [];
    window._sparkCharts.push(chart);
  });
}

/**
 * Get sparkline color based on change direction
 */
function getSparklineColor(changeDir) {
  if (changeDir === 'up') return '#dc2626';
  if (changeDir === 'down') return '#008029';
  return '#676f73';
}

// ========================================
// TREE-BASED HIERARCHY TOTALS
// ========================================

/**
 * Recursively compute totals for a hierarchy tree node.
 * Populates node._computed = { incidents, siteCount, spark, change, changeDir }
 * @param {Object} node - A hierarchy tree node
 * @param {Object} siteDirectory - Flat lookup { siteName: siteObject }
 */
function computeTreeTotals(node, siteDirectory) {
  let totalIncidents = 0;
  let totalSites = 0;
  var allSparks = [];

  // Direct sites at this node
  (node.sites || []).forEach(function(siteName) {
    var site = siteDirectory[siteName];
    if (site) {
      totalIncidents += site.incidents;
      totalSites++;
      if (site.spark) allSparks.push(site.spark);
    }
  });

  // Recurse into children
  (node.children || []).forEach(function(child) {
    computeTreeTotals(child, siteDirectory);
    totalIncidents += child._computed.incidents;
    totalSites += child._computed.siteCount;
    if (child._computed.spark) allSparks.push(child._computed.spark);
  });

  // Average sparklines
  var avgSpark = [0, 0, 0, 0, 0];
  if (allSparks.length > 0) {
    for (var i = 0; i < 5; i++) {
      var sum = 0;
      for (var j = 0; j < allSparks.length; j++) {
        sum += (allSparks[j][i] || 0);
      }
      avgSpark[i] = Math.round(sum / allSparks.length);
    }
  }

  // Derive change from last sparkline value
  var lastVal = avgSpark[4] || 0;
  var changeDir = lastVal > 0 ? 'up' : lastVal < 0 ? 'down' : 'neutral';
  var changeStr = (lastVal >= 0 ? '+' : '') + lastVal + '%';

  node._computed = {
    incidents: totalIncidents,
    siteCount: totalSites,
    spark: avgSpark,
    change: changeStr,
    changeDir: changeDir
  };
}

/**
 * Recursively collect ALL site objects from a tree node (at all depths).
 * @param {Object} node - A hierarchy tree node
 * @param {Object} siteDirectory - Flat lookup { siteName: siteObject }
 * @returns {Object[]} Array of site objects
 */
function collectAllSites(node, siteDirectory) {
  var result = [];
  (node.sites || []).forEach(function(siteName) {
    var site = siteDirectory[siteName];
    if (site) result.push(site);
  });
  (node.children || []).forEach(function(child) {
    result = result.concat(collectAllSites(child, siteDirectory));
  });
  return result;
}

// ========================================
// FLAT TOTALS (legacy, for site manager)
// ========================================

/**
 * Compute hierarchy and visualization totals from flat hierarchyData.
 */
function computeTotals(config) {
  // If config has a hierarchy tree, compute tree totals
  if (config.hierarchy && config.siteDirectory) {
    computeTreeTotals(config.hierarchy, config.siteDirectory);
  }

  // Legacy flat computation (for site manager or backward compat)
  if (!config.hierarchyData || !config.hierarchyRegions || config.hierarchyRegions.length < 2) return;

  var isMapMode = !!(config.visualization && config.visualization.image);
  var topLevel = config.hierarchyRegions[0];
  var grandTotal = 0;

  for (var i = 1; i < config.hierarchyRegions.length; i++) {
    var region = config.hierarchyRegions[i];
    var data = config.hierarchyData[region.name];

    if (data && data.sites) {
      var total = data.sites.reduce(function(sum, site) { return sum + site.incidents; }, 0);
      region.incidents = total;
      grandTotal += total;
    }
  }

  topLevel.incidents = grandTotal;

  if (config.visualization && config.visualization.regions) {
    config.visualization.regions.forEach(function(vizRegion) {
      var match = config.hierarchyRegions.find(function(r) { return r.name === vizRegion.targetHierarchy; });
      if (match) {
        if (isMapMode) {
          vizRegion.chipText = String(match.incidents);
        } else {
          vizRegion.chipText = match.incidents + ' alert' + (match.incidents !== 1 ? 's' : '');
        }
      }
    });
  }
}
