// ========================================
// MODAL MODULE
// Reusable modal for alert category drill-downs
// ========================================

(function () {

  // ===========================================
  // DOM — injected once at startup
  // ===========================================
  const overlay = document.getElementById('modal-overlay');
  const titleEl = overlay.querySelector('.modal-header-title');
  const closeBtn = overlay.querySelector('.modal-close-btn');
  const listScroll = overlay.querySelector('.modal-list-scroll');
  const detailPlaceholder = overlay.querySelector('.modal-detail-placeholder');
  const detailContent = overlay.querySelector('.modal-detail-content');
  const detailTitle = overlay.querySelector('.modal-detail-title');
  const detailHeaderMeta = overlay.querySelector('.modal-detail-header-meta');
  const detailDescription = overlay.querySelector('.modal-detail-description');
  const historyContainer = overlay.querySelector('.modal-history');

  // ===========================================
  // STATE
  // ===========================================
  let currentItems = [];
  let selectedIndex = -1;

  // ===========================================
  // OPEN / CLOSE
  // ===========================================

  function openModal(categoryName, items) {
    currentItems = items || [];
    selectedIndex = -1;

    // Header
    titleEl.textContent = categoryName;

    // Render list
    renderList();

    // Reset detail to placeholder
    showPlaceholder();

    // Auto-select first item if available
    if (currentItems.length > 0) {
      selectItem(0);
    }

    // Show
    overlay.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
  }

  // Expose globally so goals.js can call it
  window.openCategoryModal = openModal;

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('modal-overlay--open')) closeModal();
  });

  // ===========================================
  // LIST RENDERING
  // ===========================================

  function renderList() {
    listScroll.innerHTML = currentItems.map(function (item, index) {
      return '<div class="modal-list-item" data-index="' + index + '">' +
        '<div class="modal-list-item-title">' + escapeHTML(item.title) + '</div>' +
        '<div class="modal-list-item-meta">' +
          '<span class="modal-status-badge modal-status-badge--' + item.status + '">' + formatStatus(item.status) + '</span>' +
          '<span class="modal-list-item-date">' + escapeHTML(item.date) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    // Attach click handlers
    listScroll.querySelectorAll('.modal-list-item').forEach(function (el) {
      el.addEventListener('click', function () {
        selectItem(parseInt(el.dataset.index, 10));
      });
    });
  }

  // ===========================================
  // ITEM SELECTION
  // ===========================================

  function selectItem(index) {
    if (index < 0 || index >= currentItems.length) return;
    selectedIndex = index;
    var item = currentItems[index];

    // Update list selection visual
    listScroll.querySelectorAll('.modal-list-item').forEach(function (el, i) {
      el.classList.toggle('modal-list-item--selected', i === index);
    });

    // Show detail
    showDetail(item);
  }

  // ===========================================
  // DETAIL RENDERING
  // ===========================================

  function showPlaceholder() {
    detailPlaceholder.style.display = 'flex';
    detailContent.classList.remove('modal-detail-content--visible');
  }

  function showDetail(item) {
    detailPlaceholder.style.display = 'none';
    detailContent.classList.add('modal-detail-content--visible');

    // Title
    detailTitle.textContent = item.title;

    // Meta: severity dot + label + date
    var severityLabel = item.severity.charAt(0).toUpperCase() + item.severity.slice(1) + ' priority';
    detailHeaderMeta.innerHTML =
      '<span class="modal-severity-dot modal-severity-dot--' + item.severity + '"></span>' +
      '<span class="modal-detail-severity-label">' + severityLabel + '</span>' +
      '<span class="modal-detail-date">' + escapeHTML(item.date) + '</span>' +
      '<span class="modal-status-badge modal-status-badge--' + item.status + '">' + formatStatus(item.status) + '</span>';

    // Description
    detailDescription.textContent = item.description;

    // History timeline
    if (item.history && item.history.length > 0) {
      historyContainer.innerHTML =
        '<div class="modal-history-heading">Activity history</div>' +
        item.history.slice().reverse().map(function (h) {
          return '<div class="modal-history-item">' +
            '<div class="modal-history-dot"></div>' +
            '<div class="modal-history-body">' +
              '<div class="modal-history-event">' + escapeHTML(h.event) + '</div>' +
              '<div class="modal-history-date">' + escapeHTML(h.date) + '</div>' +
            '</div>' +
          '</div>';
        }).join('');
    } else {
      historyContainer.innerHTML = '<div class="modal-history-heading">No history available</div>';
    }
  }

  // ===========================================
  // HELPERS
  // ===========================================

  function formatStatus(status) {
    return status.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
