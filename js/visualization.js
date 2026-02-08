// ========================================
// VISUALIZATION COMPONENT
// Map tags with status chips + generic button grid
// ========================================

(function() {
  
  const container = document.getElementById('visualization-container');
  
  /**
   * Get the chip status class
   * @param {string} status - 'blue', 'warning', 'danger'
   * @param {boolean} standalone - If true, uses standalone variant (white text on danger)
   * @returns {string} CSS class
   */
  function chipClass(status, standalone) {
    if (status === 'danger' && standalone) return 'viz-chip--danger-standalone';
    if (status === 'warning') return 'viz-chip--warning';
    if (status === 'danger') return 'viz-chip--danger';
    return 'viz-chip--blue';
  }
  
  /**
   * Get the Font Awesome icon class for a status chip
   * @param {string} status - 'blue', 'warning', 'danger'
   * @returns {string} FA icon class
   */
  function statusIcon(status) {
    if (status === 'danger') return 'fa-solid fa-triangle-exclamation';
    if (status === 'warning') return 'fa-solid fa-triangle-exclamation';
    return 'fa-solid fa-circle-exclamation';
  }
  
  /**
   * Render the visualization from config
   * @param {Object} config - The active configuration object
   * @param {Function} onRegionClick - Callback when a region is clicked
   */
  function renderVisualization(config, onRegionClick) {
    if (!config.visualization || !config.visualization.regions || config.visualization.regions.length === 0) {
      container.innerHTML = '<div class="visualization-empty">No visualization configured</div>';
      return;
    }
    
    const { image, imageAlt, regions } = config.visualization;
    const hasImage = !!image;
    
    let html = '';
    
    if (hasImage) {
      // ===== MAP MODE =====
      // Tag structure: outer pill → neutral chip (count) + status chip (alerts)
      // Hover: expands to rectangle with label + single chip + faint blue bg circle
      html = `
        <div class="visualization visualization--image">
          <img src="${image}" alt="${imageAlt || 'Visualization'}" class="visualization-image" />
          <div class="visualization-regions">
            ${regions.map(region => {
              const status = region.status || 'blue';
              return `
                <button 
                  class="viz-tag" 
                  data-target="${region.targetHierarchy}"
                  style="left: ${region.position.x}%; top: ${region.position.y}%;"
                >
                  <div class="viz-tag-hover-bg"></div>
                  <div class="viz-tag-container">
                    <span class="viz-tag-label">${region.label} - ${region.siteCount} sites</span>
                    <div class="viz-chip viz-chip--neutral">
                      <i class="viz-chip-icon fa-solid fa-building"></i>
                      <span class="viz-chip-text">${region.siteCount || ''}</span>
                    </div>
                    <div class="viz-chip ${chipClass(status, false)}">
                      <i class="viz-chip-icon ${statusIcon(status)}"></i>
                      <span class="viz-chip-text viz-chip-text--default">${region.chipText || ''}</span>
                      <span class="viz-chip-text viz-chip-text--hover">${region.chipText || ''} alerts</span>
                    </div>
                  </div>
                  <div class="viz-tag-pin"></div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      // ===== GENERIC MODE =====
      // Container: label text above, qsb-chip below
      html = `
        <div class="visualization visualization--buttons">
          <div class="visualization-grid">
            ${regions.map(region => {
              const status = region.status || 'blue';
              return `
                <button 
                  class="viz-generic" 
                  data-target="${region.targetHierarchy}"
                >
                  <span class="viz-generic-label">${region.label}</span>
                  <div class="viz-chip ${chipClass(status, true)}">
                    <i class="viz-chip-icon ${statusIcon(status)}"></i>
                    <span class="viz-chip-text">${region.chipText || ''}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Attach click handlers
    container.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && typeof onRegionClick === 'function') {
          onRegionClick({ targetHierarchy: target });
        }
      });
    });
  }
  
  // Expose globally
  window.renderVisualization = renderVisualization;
  
})();
