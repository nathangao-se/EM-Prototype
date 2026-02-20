/* ============================================
   CLICKABLE HINTS — animated purple rings
   Marks buttons/links that open a modal or page.

   TO DISABLE at runtime:
     window.CLICKABLE_HINTS_ENABLED = false;
     (set before this script loads)

   TO REMOVE permanently: delete this file,
   its CSS, and the two tags in index.html.
   ============================================ */
(function () {
  'use strict';
  if (window.CLICKABLE_HINTS_ENABLED === false) return;

  var SELECTORS = [
    '[data-action-id="open-activity-data-setup"]',
    '[data-action-id="open-activity-map"]',
    '[data-action-id="open-calc-methods"]',
    '[data-action-id="open-ef-library"]',
    '[data-action-id="open-inventory-wizard"]',
    '.project-bar__dropdown-toggle',
    '[data-action="open-activity-data-setup"]',
    '[data-action="open-columns-modal"]',
    '[data-action="open-normalize"]',
    '.activity-data-setup-card[data-option="upload"]',
    '.cm-var-group',
    '.cm-add-variation'
  ];

  var QUERY = SELECTORS.join(', ');

  function applyHints() {
    document.querySelectorAll(QUERY).forEach(function (el) {
      if (el.classList.contains('clickable-hint')) return;
      el.classList.add('clickable-hint');
    });
  }

  applyHints();

  var raf = 0;
  new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      applyHints();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
