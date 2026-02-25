// ========================================
// DOM UTILITIES — shared helpers used across the prototype
// ========================================

window.DomUtils = (function () {
  'use strict';

  var _escDiv = document.createElement('div');

  function esc(str) {
    if (!str) return '';
    _escDiv.textContent = str;
    return _escDiv.innerHTML;
  }

  return { esc: esc };
})();
