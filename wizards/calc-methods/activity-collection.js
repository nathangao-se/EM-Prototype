// ========================================
// ACTIVITY COLLECTION — modal for method detail view
// ========================================

(function () {

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function getCollection(methodName) {
    var details = window._vbMethodDetails;
    if (!details) return null;
    var detail = details[methodName];
    if (!detail) return null;
    var collection = { main: detail, variations: detail.variations || [] };
    collection.variations = collection.variations.map(function (v) {
      return {
        title: v.title,
        decisions: v.decisions || detail.decisions,
        dataPaths: v.dataPaths || detail.dataPaths,
        lifecycle: v.lifecycle || detail.lifecycle,
        activityTypes: v.activityTypes || detail.activityTypes
      };
    });
    return collection;
  }

  // ── Label column (left side) ──

  function buildLabelColumn(data) {
    var html = '<div class="ac-col ac-col--labels">';

    // Same title element as value columns for vertical alignment
    html += '<div class="ac-col-title"></div>';

    // Decision points
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">Decision points</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.decisions.forEach(function (d) {
      html += '<div class="ac-row ac-row--label">';
      html += '<div class="ac-label-name">' + esc(d.label) + '</div>';
      html += '<div class="ac-label-sub">' + esc(d.sub) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    // Data path priority
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">Data path priority</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.dataPaths.forEach(function (d, i) {
      html += '<div class="ac-row ac-row--path">';
      html += '<span class="ac-path-num">' + (i + 1) + '.</span>';
      html += '<span class="ac-label-name">' + esc(d.label) + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    // Lifecycle stages
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">Lifecycle stages</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.lifecycle.forEach(function (l) {
      html += '<div class="ac-row ac-row--label">';
      html += '<div class="ac-label-name">' + esc(l.stage) + '</div>';
      html += '<div class="ac-label-sub">' + esc(l.sub) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    // Spacer (fills the space where value columns have activity types)
    html += '<div class="ac-col-spacer"></div>';

    // Footer with Exit
    html += '<div class="ac-col-footer ac-col-footer--labels">';
    html += '<button class="btn btn-outline btn-small ac-btn-exit" data-ac-action="exit">Exit</button>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // ── Value column (one per method/variation) ──

  function buildValueColumn(data, title, isMain) {
    var html = '<div class="ac-col ac-col--values">';

    // Title
    html += '<div class="ac-col-title">' + esc(title) + '</div>';

    // Decision point values
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">&nbsp;</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.decisions.forEach(function (d) {
      html += '<div class="ac-row ac-row--label">';
      html += '<span class="ac-value ac-value--green">' + esc(d.chip) + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    // Data path values
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">&nbsp;</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.dataPaths.forEach(function (d, i) {
      var isPrimary = d.chipLabel === 'Primary';
      var altClass = (i % 2 === 1) ? ' ac-row--alt' : '';
      html += '<div class="ac-row ac-row--path' + altClass + '">';
      html += '<span class="ac-value' + (isPrimary ? ' ac-value--primary' : ' ac-value--fallback') + '">' + esc(d.chipLabel) + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    // Lifecycle scope values
    html += '<div class="ac-section">';
    html += '<div class="ac-section-header"><span class="ac-section-title">&nbsp;</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.lifecycle.forEach(function (l) {
      html += '<div class="ac-row ac-row--label">';
      html += '<span class="ac-value ac-value--scope">' + esc(l.scope) + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    // Activity types
    html += '<div class="ac-section ac-section--activities">';
    html += '<div class="ac-section-header"><span class="ac-section-title">' + data.activityTypes.length + ' Activity types</span></div>';
    html += '<div class="ac-section-line"></div>';
    html += '<div class="ac-section-body">';
    data.activityTypes.forEach(function (a) {
      html += '<div class="ac-activity-item">';
      html += '<div class="ac-activity-name">' + esc(a.name) + '</div>';
      html += '<div class="ac-activity-sub">' + esc(a.sub) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    // Footer
    html += '<div class="ac-col-footer">';
    if (isMain) {
      html += '<button class="btn btn-primary btn-small ac-btn-add">+ Add variation</button>';
    } else {
      html += '<button class="ac-btn-delete"><i class="fa-regular fa-trash-can"></i> Delete</button>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  // ── Assemble modal ──

  function buildACModal(methodName) {
    var collection = getCollection(methodName);
    if (!collection) return null;

    var isSingle = collection.variations.length === 0;
    var modalClass = 'ac-modal' + (isSingle ? ' ac-modal--single' : '');

    var html = '<div class="ac-overlay">';
    html += '<div class="' + modalClass + '">';
    html += '<div class="ac-modal-body">';

    html += buildLabelColumn(collection.main);
    html += buildValueColumn(collection.main, methodName, true);

    collection.variations.forEach(function (v) {
      html += buildValueColumn(v, 'Variation: ' + v.title, false);
    });

    html += '</div></div></div>';
    return html;
  }

  // ── Row equalization ──

  function equalizeRows(overlay) {
    var cols = overlay.querySelectorAll('.ac-col');
    if (cols.length < 2) return;

    // Equalize titles
    var titles = overlay.querySelectorAll('.ac-col-title');
    var maxTitle = 0;
    titles.forEach(function (t) { t.style.minHeight = ''; var h = t.offsetHeight; if (h > maxTitle) maxTitle = h; });
    titles.forEach(function (t) { t.style.minHeight = maxTitle + 'px'; });

    // Equalize each section (4 sections: decisions, data paths, lifecycle, activities)
    var allBodies = [];
    cols.forEach(function (col) {
      allBodies.push(col.querySelectorAll('.ac-section'));
    });

    var sectionCount = 4;
    for (var i = 0; i < sectionCount; i++) {
      var maxH = 0;
      var sections = [];
      allBodies.forEach(function (secs) {
        var sec = secs[i];
        if (sec) {
          sec.style.minHeight = '';
          sections.push(sec);
          var h = sec.offsetHeight;
          if (h > maxH) maxH = h;
        }
      });
      sections.forEach(function (sec) {
        sec.style.minHeight = maxH + 'px';
      });
    }

    // Equalize footers
    var footers = overlay.querySelectorAll('.ac-col-footer');
    var maxFooter = 0;
    footers.forEach(function (f) { f.style.minHeight = ''; var h = f.offsetHeight; if (h > maxFooter) maxFooter = h; });
    footers.forEach(function (f) { f.style.minHeight = maxFooter + 'px'; });
  }

  // ── Open / close ──

  window.openACModal = function (methodName) {
    var existing = document.querySelector('.ac-overlay');
    if (existing) existing.remove();

    var modalHTML = buildACModal(methodName);
    if (!modalHTML) return;

    var container = document.createElement('div');
    container.innerHTML = modalHTML;
    var overlay = container.firstChild;
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add('ac-overlay--open');
      equalizeRows(overlay);
    });

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('[data-ac-action="exit"]') || e.target === overlay) {
        overlay.classList.remove('ac-overlay--open');
        setTimeout(function () { overlay.remove(); }, 200);
        return;
      }
      if (e.target.closest('.ac-btn-add')) {
        overlay.classList.remove('ac-overlay--open');
        setTimeout(function () {
          overlay.remove();
          if (window.openVariationBuilder) window.openVariationBuilder(methodName);
        }, 200);
      }
    });
  };

})();
