// ========================================
// VISUALIZATION COMPONENT
// Stateless renderer — dashboard controls what to show
// Supports map mode (image + pins) and box mode (button grid)
// ========================================

(function() {
  
  const container = document.getElementById('visualization-container');
  
  /**
   * Get the chip status class
   */
  function chipClass(status, standalone) {
    if (status === 'danger' && standalone) return 'viz-chip--danger-standalone';
    if (status === 'warning') return 'viz-chip--warning';
    if (status === 'danger') return 'viz-chip--danger';
    return 'viz-chip--blue';
  }
  
  /**
   * Get the Font Awesome icon class for a status chip
   */
  function statusIcon(status) {
    if (status === 'danger') return 'fa-solid fa-triangle-exclamation';
    if (status === 'warning') return 'fa-solid fa-triangle-exclamation';
    return 'fa-solid fa-circle-exclamation';
  }
  
  /**
   * Render pin HTML for map mode
   */
  function renderMapPin(region, countLabel) {
    const status = region.status || 'blue';
    return `
      <button 
        class="viz-tag" 
        data-target="${region.targetHierarchy}"
        style="left: ${region.position.x}%; top: ${region.position.y}%;"
      >
        <div class="viz-tag-hover-bg"></div>
        <div class="viz-tag-container">
          <span class="viz-tag-label">${region.label} - ${region.siteCount} ${countLabel}</span>
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
  }
  
  /**
   * Render box button HTML for box mode
   */
  function renderBoxButton(region) {
    const status = region.status || 'blue';
    return `
      <button 
        class="viz-box" 
        data-target="${region.targetHierarchy}"
      >
        <span class="viz-box-label">${region.label}</span>
        <div class="viz-chip ${chipClass(status, true)}">
          <i class="viz-chip-icon ${statusIcon(status)}"></i>
          <span class="viz-chip-text">${region.chipText || ''}</span>
        </div>
      </button>
    `;
  }
  
  /**
   * Render a visualization.
   * @param {Object} vizData - { image, imageAlt, regions }
   * @param {Function} onItemClick - Callback when an item is clicked: onItemClick({ targetHierarchy })
   * @param {Object} options - { showBack, onBack, countLabel }
   *   showBack: boolean — show back button
   *   onBack: function — called when back button clicked
   *   countLabel: string — 'sites' or 'employees' for pin hover text
   */
  function renderVisualization(vizData, onItemClick, options) {
    options = options || {};
    var showBack = options.showBack || false;
    var onBack = options.onBack || null;
    var countLabel = options.countLabel || 'sites';

    if (!vizData || !vizData.regions || vizData.regions.length === 0) {
      container.innerHTML = '<div class="visualization-empty">No visualization configured</div>';
      return;
    }
    
    const { image, imageAlt, regions } = vizData;
    const hasImage = !!image;
    
    const backBtnHtml = showBack
      ? `<button class="viz-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>`
      : '';
    
    let html = '';
    
    if (hasImage) {
      // ===== MAP MODE =====
      html = `
        <div class="visualization visualization--image">
          ${backBtnHtml}
          <img src="${image}" alt="${imageAlt || 'Visualization'}" class="visualization-image" />
          <div class="visualization-regions">
            ${regions.map(r => renderMapPin(r, countLabel)).join('')}
          </div>
        </div>
      `;
    } else {
      // ===== BOX MODE =====
      html = `
        <div class="visualization visualization--buttons">
          ${backBtnHtml}
          <div class="visualization-grid">
            ${regions.map(r => renderBoxButton(r)).join('')}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Back button handler
    const backBtn = container.querySelector('.viz-back-btn');
    if (backBtn && onBack) {
      backBtn.addEventListener('click', onBack);
    }
    
    // Item click handlers
    container.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && typeof onItemClick === 'function') {
          onItemClick({ targetHierarchy: target });
        }
      });
    });
  }
  
  // Expose globally
  window.renderVisualization = renderVisualization;
  
})();
