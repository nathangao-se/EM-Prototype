// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate an SVG sparkline from an array of values
 */
function generateSparkline(values, color) {
  const width = 60;
  const height = 24;
  const padding = 2;
  const maxVal = Math.max(...values.map(Math.abs), 1);
  const midY = height / 2;
  
  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = midY - (val / maxVal) * (height / 2 - padding);
    return `${x},${y}`;
  }).join(' ');
  
  return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <line x1="${padding}" y1="${midY}" x2="${width - padding}" y2="${midY}" stroke="#dfe7eb" stroke-width="1"/>
    <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}"/>
  </svg>`;
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
