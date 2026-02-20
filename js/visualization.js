// ========================================
// VISUALIZATION COMPONENT
// Stateless renderer — dashboard controls what to show
// Supports map mode (image + pins) and box mode (button grid)
//
// Applies the same stagger dissolve as page-transition.js
// when swapping content (drill-down / back).
// ========================================

(function() {
  
  const container = document.getElementById('visualization-container');

  // --- Transition timing (mirrors page-transition.js) ---
  var VIZ_STAGGER  = 22;
  var VIZ_DURATION = 160;
  var VIZ_BETWEEN  = 40;

  var vizTransitioning = false;

  // ------------------------------------------------------------------
  // Chip helpers
  // ------------------------------------------------------------------

  function chipClass(status, standalone) {
    if (status === 'danger' && standalone) return 'viz-chip--danger-standalone';
    if (status === 'warning') return 'viz-chip--warning';
    if (status === 'danger') return 'viz-chip--danger';
    return 'viz-chip--blue';
  }

  function statusIcon(status) {
    if (status === 'danger') return 'fa-solid fa-triangle-exclamation';
    if (status === 'warning') return 'fa-solid fa-triangle-exclamation';
    return 'fa-solid fa-circle-exclamation';
  }

  // ------------------------------------------------------------------
  // HTML builders
  // ------------------------------------------------------------------

  function renderMapPin(region, countLabel) {
    const status = region.status || 'blue';
    return `
      <button 
        class="viz-tag viz-pin-item" 
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

  // ------------------------------------------------------------------
  // Transition helpers (reuse page-transition.css classes)
  // ------------------------------------------------------------------

  function isPin(el) {
    return el.classList.contains('viz-tag');
  }

  function collectVizItems() {
    var items = [];
    var img = container.querySelector('.visualization-image');
    if (img) items.push(img);
    container.querySelectorAll('.viz-tag').forEach(function (el) { items.push(el); });
    container.querySelectorAll('.viz-box').forEach(function (el) { items.push(el); });
    var back = container.querySelector('.viz-back-btn');
    if (back) items.push(back);
    return items;
  }

  function sortVizItems(arr, bottomToTop) {
    arr.sort(function (a, b) {
      var rA = a.getBoundingClientRect();
      var rB = b.getBoundingClientRect();
      if (rA.left !== rB.left) return rA.left - rB.left;
      return bottomToTop ? rB.top - rA.top : rA.top - rB.top;
    });
    return arr;
  }

  function vizStaggerOut(items, done) {
    var sorted = sortVizItems(items, true);
    sorted.forEach(function (el, i) {
      setTimeout(function () {
        if (isPin(el)) {
          // viz-pin-item is already on the element (baked into HTML),
          // so adding --out immediately triggers the upward-fly transition
          el.classList.add('viz-pin-item--out');
        } else {
          el.classList.add('pt-item', 'pt-item--out');
        }
      }, i * VIZ_STAGGER);
    });
    var total = Math.max((sorted.length - 1) * VIZ_STAGGER + VIZ_DURATION, 0);
    setTimeout(done, total);
  }

  function vizStaggerIn(items, done) {
    var sorted = sortVizItems(items, false);
    sorted.forEach(function (el, i) {
      setTimeout(function () {
        if (isPin(el)) {
          // Restore class-based transition (was suppressed during hide),
          // reflow to lock in the pre-in position, then remove it to
          // trigger the upward-into-position animation
          el.style.transition = '';
          void el.offsetWidth;
          el.classList.remove('viz-pin-item--pre-in');
        } else {
          el.classList.add('pt-item', 'pt-item--in-start');
          void el.offsetWidth;
          el.classList.remove('pt-item--out', 'pt-item--in-start');
        }
      }, i * VIZ_STAGGER);
    });
    var total = Math.max((sorted.length - 1) * VIZ_STAGGER + VIZ_DURATION, 0);
    setTimeout(done, total);
  }

  function vizHideInstantly(items) {
    items.forEach(function (el) {
      if (isPin(el)) {
        // Suppress the transition so the pin snaps to pre-in position
        el.style.transition = 'none';
        el.classList.add('viz-pin-item--pre-in');
      } else {
        el.classList.add('pt-item', 'pt-item--out');
      }
    });
  }

  function vizCleanAll(items) {
    items.forEach(function (el) {
      el.style.transition = '';
      el.classList.remove(
        'pt-item', 'pt-item--out', 'pt-item--in-start',
        'viz-pin-item--out', 'viz-pin-item--pre-in'
      );
    });
  }

  // ------------------------------------------------------------------
  // Core render (innerHTML + event binding)
  // ------------------------------------------------------------------

  function doRender(vizData, onItemClick, options) {
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

    const backBtn = container.querySelector('.viz-back-btn');
    if (backBtn && onBack) {
      backBtn.addEventListener('click', onBack);
    }

    container.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && typeof onItemClick === 'function') {
          onItemClick({ targetHierarchy: target });
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // Public API — transitions old content out, swaps, transitions in
  // ------------------------------------------------------------------

  function renderVisualization(vizData, onItemClick, options) {
    options = options || {};

    var oldItems = collectVizItems();
    var shouldTransition = oldItems.length > 0
                        && !vizTransitioning
                        && container.offsetParent !== null;

    if (!shouldTransition) {
      doRender(vizData, onItemClick, options);
      return;
    }

    vizTransitioning = true;

    vizStaggerOut(oldItems, function () {
      doRender(vizData, onItemClick, options);

      var newItems = collectVizItems();
      vizHideInstantly(newItems);

      setTimeout(function () {
        vizStaggerIn(newItems, function () {
          vizCleanAll(newItems);
          vizTransitioning = false;
        });
      }, VIZ_BETWEEN);
    });
  }

  // Expose globally
  window.renderVisualization = renderVisualization;
  
})();
