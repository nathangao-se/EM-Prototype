// ========================================
// MODAL MANAGER — centralised open/close/registry for all overlays
// ========================================

window.ModalManager = (function () {
  'use strict';

  var registry = {};

  function register(id, opts) {
    var overlay = opts.overlay;
    if (!overlay) return;

    var openClass = opts.openClass;
    var onOpen    = opts.onOpen  || function () {};
    var onClose   = opts.onClose || function () {};

    var entry = { id: id, overlay: overlay, openClass: openClass, onOpen: onOpen, onClose: onClose };
    registry[id] = entry;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains(openClass)) close(id);
    });
  }

  function open(id) {
    var entry = registry[id];
    if (!entry) return;
    entry.onOpen();
    entry.overlay.classList.add(entry.openClass);
    document.body.style.overflow = 'hidden';
  }

  function close(id) {
    var entry = registry[id];
    if (!entry) return;
    entry.overlay.classList.remove(entry.openClass);
    document.body.style.overflow = '';
    entry.onClose();
  }

  function closeAll() {
    Object.keys(registry).forEach(function (id) {
      var entry = registry[id];
      if (entry.overlay.classList.contains(entry.openClass)) close(id);
    });
  }

  function isOpen(id) {
    var entry = registry[id];
    return entry ? entry.overlay.classList.contains(entry.openClass) : false;
  }

  return {
    register: register,
    open:     open,
    close:    close,
    closeAll: closeAll,
    isOpen:   isOpen
  };
})();
