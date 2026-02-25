// ========================================
// ACTIVITY DATA SETUP — Upload flow entry modal
// Opens from [Upload] or dev panel. Branches into upload / API / campaign (not implemented yet).
// ========================================

(function () {
  var overlay = document.getElementById('activity-data-setup-overlay');
  if (!overlay) return;

  ModalManager.register('activity-data-setup', {
    overlay: overlay,
    openClass: 'activity-data-setup-overlay--open'
  });

  var closeBtn = overlay.querySelector('.activity-data-setup-close');
  var cancelBtn = overlay.querySelector('.activity-data-setup-cancel');
  var cards = overlay.querySelectorAll('.activity-data-setup-card');

  function openModal() {
    ModalManager.open('activity-data-setup');
  }

  function closeModal() {
    ModalManager.close('activity-data-setup');
  }

  window.openActivityDataSetupModal = openModal;
  window.closeActivityDataSetupModal = closeModal;

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Delegated: "Add files/data" button on Data management page opens this modal
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-action="open-activity-data-setup"]');
    if (!trigger) return;
    e.preventDefault();
    openModal();
  });

  // Card click: placeholder for future flows (upload / API / campaign)
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var option = card.getAttribute('data-option');
      if (option === 'upload') {
        closeModal();
        if (typeof window.openUploadWizard === 'function') window.openUploadWizard();
      } else if (option === 'api') {
        // TODO: import via API flow
      } else if (option === 'campaign') {
        closeModal();
        if (typeof window.openCampaignWizard === 'function') window.openCampaignWizard();
      }
    });
  });
})();
