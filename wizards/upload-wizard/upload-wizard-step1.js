// ========================================
// UPLOAD WIZARD — Step 1: Columns cleanup
// ========================================

(function () {
  var ctx = window._uwCtx;
  if (!ctx) return;

  var esc = ctx.esc;
  var overlay = ctx.overlay;
  var bodyEl = ctx.bodyEl;

  // ── Layouts tab (left pane) ─────────────────────────────────────

  function renderLayoutsTab() {
    var html = '';
    html += '<div class="uw-s1-split">';

    html += '<div class="uw-s1-left">';
    if (ctx.savedSections.length === 0) {
      html += '<p class="uw-s1-left-desc">We\'re having trouble identifying where the relevant data lives in your spreadsheet. Please help us by selecting a section on the right to capture</p>';
      html += '<div class="uw-s1-select-field"><span class="uw-s1-select-text">No sections selected</span></div>';
    } else {
      html += '<div class="uw-s1-section-list">';
      ctx.savedSections.forEach(function (s, i) {
        html += '<div class="uw-s1-section-item" data-idx="' + i + '">';
        html += '<span class="uw-s1-section-range">' + esc(s.range) + '</span>';
        html += '<button type="button" class="uw-s1-section-remove" data-idx="' + i + '" title="Remove"><i class="fa-solid fa-trash"></i></button>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div class="uw-s1-save-actions">';
    html += '<button type="button" class="btn btn-outline uw-s1-save-btn" data-action="save-block" disabled><i class="fa-solid fa-table"></i> Designate selection</button>';
    html += '<button type="button" class="btn btn-outline uw-s1-save-btn" data-action="save-headers" disabled><i class="fa-solid fa-table-list"></i> Designate using selected row as header</button>';
    html += '</div>';

    html += '</div>';

    html += '<div class="uw-s1-right">';
    html += '<div class="uw-s1-parser-container" id="ep-container"></div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // ── Columns tab (mapping cards) ─────────────────────────────────

  function renderColumnsTab() {
    var html = '';
    html += '<div class="uw-s1-columns">';

    ctx.savedSections.forEach(function (sec, si) {
      var selJson = JSON.stringify(sec.sel);
      var radioName = 'block-' + si;
      var m = sec.match;
      html += '<div class="uw-s1-col-card uw-s1-col-card--block" data-block-idx="' + si + '" data-block-sel=\'' + selJson + '\'>';
      html += '<button type="button" class="uw-s1-block-delete" data-block-del="' + si + '" title="Remove"><i class="fa-solid fa-trash"></i></button>';
      html += '<div class="uw-s1-col-card-left">';
      html += '<div class="uw-s1-col-card-name">' + esc(sec.title) + '</div>';
      html += '<span class="uw-s1-col-card-range">' + esc(sec.range) + '</span>';
      html += '<span class="uw-s1-col-card-tag-new">New</span>';
      html += '</div>';
      html += '<div class="uw-s1-col-card-divider"></div>';
      html += '<div class="uw-s1-col-card-body">';
      if (m && (m.bestMatches.length > 0 || m.otherOptions.length > 0)) {
        if (m.bestMatches.length > 0) {
          html += '<div class="uw-s1-col-group">';
          html += '<div class="uw-s1-col-group-label">Best matches in our standard data</div>';
          m.bestMatches.forEach(function (opt) {
            html += '<div class="uw-s1-col-row">';
            html += '<label class="uw-s1-col-radio"><input type="radio" name="' + radioName + '" value="' + esc(opt.value) + '"><span>' + esc(opt.label) + '</span></label>';
            html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
            html += '</div>';
          });
          html += '</div>';
        }
        if (m.otherOptions.length > 0) {
          html += '<div class="uw-s1-col-separator"></div>';
          html += '<div class="uw-s1-col-group">';
          html += '<div class="uw-s1-col-group-label">Other options</div>';
          m.otherOptions.forEach(function (opt) {
            html += '<div class="uw-s1-col-row">';
            html += '<label class="uw-s1-col-radio"><input type="radio" name="' + radioName + '" value="' + esc(opt.value) + '"><span>' + esc(opt.label) + '</span></label>';
            html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
            html += '</div>';
          });
          html += '</div>';
        }
      } else {
        html += '<div class="uw-s1-col-group"><div class="uw-s1-col-group-label">No results found</div></div>';
      }
      html += '</div>';
      html += '</div>';
    });

    ctx.columnMatches.forEach(function (col, ci) {
      html += '<div class="uw-s1-col-card">';
      html += '<div class="uw-s1-col-card-name">' + esc(col.name) + '</div>';
      html += '<div class="uw-s1-col-card-divider"></div>';
      html += '<div class="uw-s1-col-card-body">';

      html += '<div class="uw-s1-col-group">';
      if (col.bestMatches.length === 0) {
        html += '<div class="uw-s1-col-group-label">No results found</div>';
      } else {
        html += '<div class="uw-s1-col-group-label">Best matches in our standard data</div>';
        col.bestMatches.forEach(function (opt) {
          var checked = col.selected === opt.value ? ' checked' : '';
          html += '<div class="uw-s1-col-row">';
          html += '<label class="uw-s1-col-radio"><input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '"><span>' + esc(opt.label) + '</span></label>';
          html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
          html += '</div>';
        });
      }
      html += '</div>';

      if (col.otherOptions.length > 0) {
        html += '<div class="uw-s1-col-separator"></div>';
        html += '<div class="uw-s1-col-group">';
        html += '<div class="uw-s1-col-group-label">Other options</div>';
        col.otherOptions.forEach(function (opt) {
          var checked = col.selected === opt.value ? ' checked' : '';
          html += '<div class="uw-s1-col-row">';
          html += '<label class="uw-s1-col-radio"><input type="radio" name="col-' + ci + '"' + checked + ' value="' + esc(opt.value) + '" data-col="' + ci + '"><span>' + esc(opt.label) + '</span></label>';
          html += '<span class="uw-s1-col-row-desc">' + esc(opt.desc) + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  // ── Render ──────────────────────────────────────────────────────

  function renderStep1() {
    var html = '';
    var isNew = window.uploadWizardVersion === 'a';

    if (ctx.showTablePreview) {
      html += '<div class="uw-s1-two-col">';

      html += '<div class="uw-s1-toolbar">';
      html += '<div class="uw-s1-toolbar-left">';
      html += '<p class="uw-s1-disclaimer">Some of your files have complex structures and we\'re not sure which part is relevant. Please select each file, then highlight and designate the section/headers we should treat as the correct data.</p>';
      var allFiles = ctx.uploadedFiles.length > 0 ? ctx.uploadedFiles : ctx.SAMPLE_IMPORTED;
      html += '<div class="uw-s1-file-select-wrap">';
      html += '<select class="uw-s1-file-select">';
      allFiles.forEach(function (f) {
        html += '<option>' + esc(f.name) + '</option>';
      });
      html += '</select>';
      html += '<i class="fa-solid fa-chevron-down uw-s1-file-select-chevron"></i>';
      html += '</div>';
      html += '</div>';
      html += '<div class="uw-s1-toolbar-right">';
      html += '<div class="uw-s1-active-ranges">';
      if (ctx.savedRanges.length > 0) {
        html += '<span class="uw-s1-ranges-label">Active ranges</span>';
        ctx.savedRanges.forEach(function (r, i) {
          html += '<span class="uw-s1-range-chip" data-range-idx="' + i + '">' + esc(r.range) + ' <i class="fa-solid fa-xmark uw-s1-range-chip-x"></i></span>';
        });
      } else {
        html += '<span class="uw-s1-ranges-label uw-s1-ranges-label--empty">No data designated</span>';
      }
      html += '</div>';
      html += '<div class="uw-s1-save-actions">';
      html += '<button type="button" class="btn btn-outline uw-s1-save-btn" data-action="save-block" disabled><i class="fa-solid fa-table"></i> Designate selection</button>';
      html += '<button type="button" class="btn btn-outline uw-s1-save-btn" data-action="save-headers" disabled><i class="fa-solid fa-table-list"></i> Designate using selected row as header</button>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="uw-s1-header-right">';
      html += '<div class="uw-s1-intro">';
      html += '<p>For accurate calculations, your data columns need to conform to our standard data set. We found mismatches that you\'ll need to reconcile before you continue.</p>';
      html += '<p>Your original data will be preserved in our records and will not be lost.</p>';
      html += '</div>';
      if (!isNew) {
        html += '<div class="uw-s1-toggle-row">';
        html += '<span class="uw-s1-toggle-label">Resolve ambiguous data in your files</span>';
        html += '<button type="button" class="uw-s1-toggle uw-s1-toggle--on" data-action="toggle-preview" aria-pressed="true">';
        html += '<span class="uw-s1-toggle-handle"></span>';
        html += '</button>';
        html += '</div>';
      }
      html += '</div>';

      html += '<div class="uw-s1-table-preview" id="ep-container"></div>';

      html += '<div class="uw-s1-cards-col">';
      html += renderColumnsTab();
      html += '</div>';

      html += '</div>';
    } else {
      html += '<div class="uw-s1-intro">';
      html += '<p>For accurate calculations, your data columns need to conform to our standard data set. We found mismatches that you\'ll need to reconcile before you continue.</p>';
      html += '<p>Your original data will be preserved in our records and will not be lost.</p>';
      html += '</div>';
      if (!isNew) {
        html += '<div class="uw-s1-toggle-row">';
        html += '<span class="uw-s1-toggle-label">Resolve ambiguous data in your files</span>';
        html += '<button type="button" class="uw-s1-toggle" data-action="toggle-preview" aria-pressed="false">';
        html += '<span class="uw-s1-toggle-handle"></span>';
        html += '</button>';
        html += '</div>';
      }
      html += renderColumnsTab();
    }

    bodyEl.classList.toggle('upload-wiz-body--split', ctx.showTablePreview);
    bodyEl.innerHTML = html;
    bindStep1Events();
  }

  // ── Bind events ─────────────────────────────────────────────────

  function bindStep1Events() {
    var toggleBtn = bodyEl.querySelector('[data-action="toggle-preview"]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        ctx.showTablePreview = !ctx.showTablePreview;
        ctx.render();
      });
    }

    bodyEl.querySelectorAll('input[type="radio"][data-col]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var ci = parseInt(radio.getAttribute('data-col'), 10);
        ctx.columnMatches[ci].selected = radio.value;
      });
    });

    var saveBlockBtn = bodyEl.querySelector('[data-action="save-block"]');
    var saveHeadersBtn = bodyEl.querySelector('[data-action="save-headers"]');

    function updateSaveBtns() {
      if (!window.ExcelParser) return;
      var hasSel = window.ExcelParser.hasSelection();
      var canHeader = window.ExcelParser.canSaveWithHeader();
      if (saveBlockBtn) saveBlockBtn.disabled = !hasSel;
      if (saveHeadersBtn) saveHeadersBtn.disabled = !canHeader;
      if (canHeader) {
        var sel = window.ExcelParser.getSelection();
        var endRow = window.ExcelParser.getHeaderBlockEnd();
        if (endRow > sel.minRow) {
          window.ExcelParser.setPreview(sel.minRow + 1, endRow, sel.minCol, sel.maxCol);
        }
      } else {
        window.ExcelParser.clearPreview();
      }
    }

    if (saveBlockBtn) {
      saveBlockBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.hasSelection()) {
          var sel = window.ExcelParser.getSelection();
          var block = window.ExcelParser.saveBlock();
          if (block && sel) {
            ctx.savedRanges.push({ range: block.rangeLabel, sel: sel });
            var numCols = block.colLabelsSlice ? block.colLabelsSlice.length : 0;
            for (var ci = 0; ci < numCols; ci++) {
              var firstCell = '';
              for (var ri = 0; ri < block.rows.length; ri++) {
                if (block.rows[ri][ci] && block.rows[ri][ci].toString().trim()) {
                  firstCell = block.rows[ri][ci].toString().trim();
                  break;
                }
              }
              if (!firstCell) continue;
              if (ctx.isExactColumnMatch(firstCell)) continue;
              ctx.savedSections.unshift({
                range: block.rangeLabel,
                sel: { minRow: sel.minRow, maxRow: sel.maxRow, minCol: sel.minCol + ci, maxCol: sel.minCol + ci },
                title: firstCell,
                match: ctx.matchSingleColumn(firstCell)
              });
            }
            ctx.render();
          }
        }
      });
    }

    if (saveHeadersBtn) {
      saveHeadersBtn.addEventListener('mouseenter', function () {
        if (window.ExcelParser) window.ExcelParser.intensifyPreview();
      });
      saveHeadersBtn.addEventListener('mouseleave', function () {
        if (window.ExcelParser) window.ExcelParser.dimPreview();
      });
      saveHeadersBtn.addEventListener('click', function () {
        if (window.ExcelParser && window.ExcelParser.canSaveWithHeader()) {
          var sel = window.ExcelParser.getSelection();
          var block = window.ExcelParser.saveBlockWithHeader();
          if (block && sel) {
            var endRow = sel.minRow + (block.rows ? block.rows.length : 0);
            ctx.savedRanges.push({ range: block.rangeLabel, sel: { minRow: sel.minRow, maxRow: endRow, minCol: sel.minCol, maxCol: sel.maxCol } });
            var headerCells = block.headerData || [];
            for (var ci = 0; ci < headerCells.length; ci++) {
              var cell = headerCells[ci] ? headerCells[ci].trim() : '';
              if (!cell) continue;
              if (ctx.isExactColumnMatch(cell)) continue;
              ctx.savedSections.unshift({
                range: block.rangeLabel,
                sel: { minRow: sel.minRow, maxRow: endRow, minCol: sel.minCol + ci, maxCol: sel.minCol + ci },
                title: cell,
                match: ctx.matchSingleColumn(cell)
              });
            }
            ctx.render();
          }
        }
      });
    }

    bodyEl.querySelectorAll('.uw-s1-col-card--block').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        try {
          var sel = JSON.parse(card.getAttribute('data-block-sel'));
          if (sel && window.ExcelParser) {
            window.ExcelParser.setSelection(sel.minRow, sel.maxRow, sel.minCol, sel.maxCol);
          }
        } catch (e) {}
      });
      card.addEventListener('mouseleave', function () {
        if (window.ExcelParser) window.ExcelParser.clearSelection();
      });
    });

    bodyEl.querySelectorAll('.uw-s1-block-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-block-del'), 10);
        ctx.savedSections.splice(idx, 1);
        ctx.render();
      });
    });

    bodyEl.querySelectorAll('.uw-s1-range-chip').forEach(function (chip) {
      var idx = parseInt(chip.getAttribute('data-range-idx'), 10);
      var rng = ctx.savedRanges[idx];
      chip.addEventListener('mouseenter', function () {
        if (rng && rng.sel && window.ExcelParser) {
          window.ExcelParser.setSelection(rng.sel.minRow, rng.sel.maxRow, rng.sel.minCol, rng.sel.maxCol);
        }
      });
      chip.addEventListener('mouseleave', function () {
        if (window.ExcelParser) window.ExcelParser.clearSelection();
      });
      chip.addEventListener('click', function () {
        ctx.savedRanges.splice(idx, 1);
        ctx.savedSections = ctx.savedSections.filter(function (sec) {
          var col = sec.sel.minCol;
          var row = sec.sel.minRow;
          return ctx.savedRanges.some(function (r) {
            return col >= r.sel.minCol && col <= r.sel.maxCol &&
                   row >= r.sel.minRow && row <= r.sel.maxRow;
          });
        });
        ctx.render();
      });
    });

    if (ctx.showTablePreview) {
      var epContainer = bodyEl.querySelector('#ep-container');
      var fileSelect = bodyEl.querySelector('.uw-s1-file-select');

      if (epContainer && window.ExcelParser) {
        var allFiles = ctx.uploadedFiles.length > 0 ? ctx.uploadedFiles : ctx.SAMPLE_IMPORTED;
        var initialName = allFiles[0] ? allFiles[0].name : '';
        var initialCSV = ctx.SAMPLE_CSV_DATA[initialName];

        window.ExcelParser.init(epContainer, {
          onSelectionChange: function () { updateSaveBtns(); }
        });
        if (initialCSV) window.ExcelParser.loadCSV(initialCSV);
        updateSaveBtns();
      }

      if (fileSelect && window.ExcelParser) {
        fileSelect.addEventListener('change', function () {
          var csv = ctx.SAMPLE_CSV_DATA[fileSelect.value];
          if (csv) {
            window.ExcelParser.loadCSV(csv);
            updateSaveBtns();
          }
        });
      }
    }
  }

  // ── Register on context ─────────────────────────────────────────

  ctx.renderStep1 = renderStep1;

  window.getColumnsTabHTML = function () { return renderColumnsTab(); };
  window.bindColumnsTabEvents = function (container) {
    container.querySelectorAll('input[type="radio"][data-col]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var ci = parseInt(radio.getAttribute('data-col'), 10);
        ctx.columnMatches[ci].selected = radio.value;
      });
    });
  };
})();
