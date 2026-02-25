// ========================================
// UPLOAD WIZARD — Step 2: Review / collaborate
// ========================================

(function () {
  var ctx = window._uwCtx;
  if (!ctx) return;

  var esc = ctx.esc;
  var bodyEl = ctx.bodyEl;

  // ── Render ──────────────────────────────────────────────────────

  function renderStep2() {
    var html = '';

    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Select collaborators from your organization</div>';
    html += '<div class="uw-s2-collab-field">';
    html += '<div class="uw-s2-collab-tags">';
    ctx.collaborators.forEach(function (c, i) {
      html += '<button type="button" class="uw-s2-tag" data-collab-idx="' + i + '">' + esc(c.name) + ' <i class="fa-solid fa-xmark"></i></button>';
    });
    html += '<input type="text" class="uw-s2-collab-input" placeholder="" />';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Activities data</div>';
    html += '<div class="uw-s2-file-group">';

    var actFiles = ctx.uploadedFiles.length > 0 ? ctx.uploadedFiles : [
      { name: 'Southern Europe Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' },
      { name: 'Asia Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' },
      { name: 'North America Measure Data Point Data 1', size: '999.5mb', type: 'Electricity only' },
      { name: 'East Africa Measure Data Point Data 1', size: '999.5mb', type: 'Mixed activities' }
    ];

    actFiles.forEach(function (f, i) {
      var typeOptions = '';
      ctx.ACTIVITY_TYPES.forEach(function (t) {
        typeOptions += '<option' + (f.type === t ? ' selected' : '') + '>' + esc(t) + '</option>';
      });
      html += '<div class="uw-s2-file-row">';
      html += '<span class="uw-s2-file-name">' + esc(f.name) + '</span>';
      html += '<span class="uw-s2-file-size">' + esc(f.size) + '</span>';
      html += '<span class="uw-s2-file-type"><div class="uw-s2-type-btn">';
      if (f.type === 'Electricity only') {
        html += '<i class="fa-solid fa-bolt"></i> ';
      }
      html += esc(f.type) + ' <i class="fa-solid fa-chevron-down uw-s2-chevron"></i></div></span>';
      html += '<button type="button" class="uw-s2-file-menu"><i class="fa-solid fa-ellipsis-vertical"></i></button>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    html += '<div class="uw-s2-section">';
    html += '<div class="uw-s2-label">Historical emissions data</div>';
    html += '<div class="uw-s2-file-group">';

    ctx.SAMPLE_HISTORICAL.forEach(function (f) {
      html += '<div class="uw-s2-file-row">';
      html += '<span class="uw-s2-file-name">' + esc(f.name) + '</span>';
      html += '<span class="uw-s2-file-size">' + esc(f.size) + '</span>';
      html += '<button type="button" class="uw-s2-file-menu"><i class="fa-solid fa-ellipsis-vertical"></i></button>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    bodyEl.innerHTML = html;
    bindStep2Events();
  }

  function bindStep2Events() {
    bodyEl.querySelectorAll('.uw-s2-tag').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-collab-idx'), 10);
        ctx.collaborators.splice(idx, 1);
        renderStep2();
      });
    });
  }

  // ── Register on context & run initial render ────────────────────

  ctx.renderStep2 = renderStep2;

  ctx.render();
})();
