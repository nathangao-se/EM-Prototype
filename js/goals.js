// ========================================
// GOALS SECTION - Dynamic Rendering
// ========================================

(function() {
  
  // DOM Elements
  const goalsSection = document.querySelector('.goals');
  
  /**
   * Render the entire goals section from config
   * @param {Object} config - The active configuration object
   */
  function renderGoals(config) {
    if (!config.goals) {
      goalsSection.innerHTML = '<p style="color: #888; padding: 20px;">No goals configured</p>';
      return;
    }
    
    const { mainGoal, alerts } = config.goals;
    
    // Build main goal card
    const mainGoalHTML = mainGoal.title ? `
      <div class="goals-card">
        <h2 class="goals-title">${mainGoal.title}</h2>
        <div class="goals-card-content">
          <div class="goals-metric">
            <span class="goals-metric-value">${mainGoal.metricValue}</span>
            <span class="goals-metric-label">${mainGoal.metricLabel}</span>
          </div>
          <p class="goals-subtitle">${mainGoal.subtitle}</p>
          <div class="goals-progress">
            <div class="goals-progress-track"></div>
            ${mainGoal.progressSegments.map(seg => `
              <div class="goals-progress-segment goals-progress-${seg.type}" style="width: ${seg.width}%;${seg.offset ? ` left: ${seg.offset}%;` : ''}"></div>
            `).join('')}
          </div>
          <div class="goals-actions">
            <button class="btn btn-outline btn-small">
              <i class="fa-regular fa-plus"></i>
              <span>Upload/request</span>
            </button>
            <button class="btn btn-outline btn-small">
              <i class="fa-solid fa-compass"></i>
              <span>Strategies and initiatives</span>
            </button>
          </div>
        </div>
      </div>
    ` : `
      <div class="goals-card">
        <div class="goals-card-content" style="color: #888; text-align: center; padding: 40px 20px;">
          <p>No main goal configured</p>
        </div>
      </div>
    `;
    
    // Build alert cards
    const alertsHTML = alerts.length > 0 ? `
      <div class="goals-alerts">
        <div class="goals-alerts-list">
          ${alerts.map((alert, alertIndex) => `
            <div class="alert-group">
              <div class="alert-group-header">
                <span class="alert-group-category">${alert.category}</span>
                <a href="#" class="alert-group-summary-link" data-alert-index="${alertIndex}">${alert.summary}</a>
              </div>
              <article class="alert-card${alert.card.variant ? ` alert-card--${alert.card.variant}` : ''}" style="--progress: ${alert.card.progress};">
                <p class="alert-card-title">${alert.card.title}</p>
                <div class="alert-card-metric">
                  <i class="${alert.card.icon} alert-card-icon"></i>
                  <span class="alert-card-value">${alert.card.value}</span>
                  <span class="alert-card-label">${alert.card.label}</span>
                </div>
                <p class="alert-card-subtitle">${alert.card.subtitle}</p>
                <div class="alert-card-progress">
                  <div class="alert-card-progress-track"></div>
                  <div class="alert-card-progress-fill"></div>
                </div>
                <button class="btn btn-outline btn-small"><i class="${alert.card.button.icon}"></i> ${alert.card.button.text}</button>
              </article>
            </div>
          `).join('')}
        </div>
      </div>
    ` : `
      <div class="goals-alerts">
        <div class="goals-alerts-list" style="color: #888; text-align: center; padding: 40px 20px;">
          <p>No alerts configured</p>
        </div>
      </div>
    `;
    
    goalsSection.innerHTML = mainGoalHTML + alertsHTML;
    
    // Attach click-through handlers to summary links
    goalsSection.querySelectorAll('.alert-group-summary-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var idx = parseInt(link.dataset.alertIndex, 10);
        var alert = alerts[idx];
        if (alert && alert.modalItems && typeof window.openCategoryModal === 'function') {
          if (typeof window.closeAllOverlays === 'function') window.closeAllOverlays();
          window.openCategoryModal(alert.category, alert.modalItems);
        }
      });
    });
  }
  
  // Expose for external use
  window.renderGoals = renderGoals;
  
  // Initial render (will be called after dashboard.js sets activeConfig)
  // Note: dashboard.js calls renderGoals on init and config change
  
})();
