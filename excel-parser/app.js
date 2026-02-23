// ========================================
// EXCEL PARSER — Embeddable CSV table viewer with cell selection
// Can be mounted into any container element via window.ExcelParser.init(container)
// ========================================

window.ExcelParser = (function () {
  "use strict";

  var PAGE_SIZE = 500;

  var container = null;
  var csvData = [];
  var colLabels = [];
  var numCols = 0;
  var currentPage = 0;
  var totalPages = 1;

  var selecting = false;
  var dragMode = "";
  var anchorRow = -1;
  var anchorCol = -1;

  var selMinRow = -1, selMaxRow = -1, selMinCol = -1, selMaxCol = -1;

  var onSelectionChange = null;

  var sampleCSV = "";

  function colLabelFor(index) {
    var label = "";
    var n = index;
    while (true) {
      label = String.fromCharCode(65 + (n % 26)) + label;
      n = Math.floor(n / 26) - 1;
      if (n < 0) break;
    }
    return label;
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function dataForDisplayRow(displayRow) {
    return csvData[displayRow - 1] || [];
  }

  function totalDataRows() {
    return csvData.length;
  }

  function pageBounds() {
    var startRow = currentPage * PAGE_SIZE + 1;
    var endRow = Math.min(startRow + PAGE_SIZE - 1, totalDataRows());
    return { startRow: startRow, endRow: endRow };
  }

  function isFullRowSelected() {
    return selMinRow >= 0 && selMinCol === 0 && selMaxCol === numCols - 1;
  }

  function isRowEmpty(displayRow) {
    var rd = dataForDisplayRow(displayRow);
    for (var c = 0; c < numCols; c++) {
      if (rd[c] !== undefined && rd[c] !== "") return false;
    }
    return true;
  }

  // DOM walkers
  function getCorner(el) {
    while (el && el.tagName) {
      if (el.tagName === "TH" && el.hasAttribute("data-corner")) return el;
      if (el.tagName === "TABLE") return null;
      el = el.parentElement;
    }
    return null;
  }

  function getDataCell(el) {
    while (el && el.tagName) {
      if (el.tagName === "TD" && el.hasAttribute("data-r") && el.hasAttribute("data-c")) return el;
      if (el.tagName === "TABLE") return null;
      el = el.parentElement;
    }
    return null;
  }

  function getRowHeader(el) {
    while (el && el.tagName) {
      if (el.tagName === "TD" && el.hasAttribute("data-rowheader")) return el;
      if (el.tagName === "TABLE") return null;
      el = el.parentElement;
    }
    return null;
  }

  function getColHeader(el) {
    while (el && el.tagName) {
      if (el.tagName === "TH" && el.hasAttribute("data-col")) return el;
      if (el.tagName === "TABLE") return null;
      el = el.parentElement;
    }
    return null;
  }

  // CSV parsing
  function parseCSV(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim() !== ""; });
    csvData = lines.map(function (line) {
      var cells = [];
      var cur = "";
      var inQ = false;
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cells.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
      cells.push(cur.trim());
      return cells;
    });

    numCols = 0;
    for (var i = 0; i < csvData.length; i++) {
      if (csvData[i].length > numCols) numCols = csvData[i].length;
    }

    colLabels = [];
    for (var c = 0; c < numCols; c++) {
      colLabels.push(colLabelFor(c));
    }

    totalPages = Math.max(1, Math.ceil(csvData.length / PAGE_SIZE));
    currentPage = 0;
    clearSelection();
    renderTable();
  }

  // Table rendering
  function renderTable() {
    if (!container) return;
    var bounds = pageBounds();

    var parts = [];

    // Status bar
    parts.push('<div class="ep-status">Showing rows ' + bounds.startRow + '\u2013' + bounds.endRow + ' of ' + totalDataRows() + ' (' + numCols + ' columns)</div>');

    parts.push('<div class="ep-table-wrapper">');
    parts.push('<table class="ep-table">');

    parts.push("<thead><tr>");
    parts.push('<th data-corner="1"></th>');
    for (var c = 0; c < numCols; c++) {
      parts.push('<th data-col="' + c + '">' + colLabels[c] + "</th>");
    }
    parts.push("</tr></thead>");

    parts.push("<tbody>");
    for (var r = bounds.startRow; r <= bounds.endRow; r++) {
      var rowData = dataForDisplayRow(r);
      parts.push("<tr>");
      parts.push('<td data-rowheader="' + r + '">' + r + "</td>");
      for (var cc = 0; cc < numCols; cc++) {
        var val = (rowData[cc] !== undefined) ? rowData[cc] : "";
        parts.push('<td data-r="' + r + '" data-c="' + cc + '">' + esc(val) + "</td>");
      }
      parts.push("</tr>");
    }
    parts.push("</tbody></table>");
    parts.push("</div>");

    // Pagination
    if (totalPages > 1) {
      parts.push('<div class="ep-pagination">');
      parts.push('<button class="ep-page-btn" data-ep-action="prev"' + (currentPage === 0 ? ' disabled' : '') + '>Previous</button>');
      parts.push('<span class="ep-page-info">Page ' + (currentPage + 1) + ' of ' + totalPages + '</span>');
      parts.push('<button class="ep-page-btn" data-ep-action="next"' + (currentPage >= totalPages - 1 ? ' disabled' : '') + '>Next</button>');
      parts.push("</div>");
    }

    container.innerHTML = parts.join("");
    attachTableEvents();
    reapplyVisualSelection();
  }

  function attachTableEvents() {
    var table = container.querySelector(".ep-table");
    if (!table) return;

    table.addEventListener("mousedown", function (e) {
      e.preventDefault();
      var isShift = e.shiftKey;

      var corner = getCorner(e.target);
      if (corner) {
        anchorRow = 1; anchorCol = 0;
        applyRange(1, totalDataRows(), 0, numCols - 1);
        return;
      }

      var cell = getDataCell(e.target);
      if (cell) {
        var r = parseInt(cell.getAttribute("data-r"), 10);
        var c = parseInt(cell.getAttribute("data-c"), 10);
        if (isShift && anchorRow >= 0 && anchorCol >= 0) {
          applyRange(Math.min(anchorRow, r), Math.max(anchorRow, r), Math.min(anchorCol, c), Math.max(anchorCol, c));
        } else {
          selecting = true; dragMode = "cell"; anchorRow = r; anchorCol = c;
          applyRange(r, r, c, c);
        }
        return;
      }

      var rh = getRowHeader(e.target);
      if (rh) {
        var row = parseInt(rh.getAttribute("data-rowheader"), 10);
        if (isShift && anchorRow >= 0) {
          applyRange(Math.min(anchorRow, row), Math.max(anchorRow, row), 0, numCols - 1);
        } else {
          selecting = true; dragMode = "row"; anchorRow = row; anchorCol = 0;
          applyRange(row, row, 0, numCols - 1);
        }
        return;
      }

      var ch = getColHeader(e.target);
      if (ch) {
        var col = parseInt(ch.getAttribute("data-col"), 10);
        if (isShift && anchorCol >= 0) {
          applyRange(1, totalDataRows(), Math.min(anchorCol, col), Math.max(anchorCol, col));
        } else {
          selecting = true; dragMode = "col"; anchorRow = 1; anchorCol = col;
          applyRange(1, totalDataRows(), col, col);
        }
        return;
      }
    });

    table.addEventListener("mouseover", function (e) {
      if (!selecting) return;
      if (dragMode === "cell") {
        var cell = getDataCell(e.target);
        if (!cell) return;
        var r = parseInt(cell.getAttribute("data-r"), 10);
        var c = parseInt(cell.getAttribute("data-c"), 10);
        applyRange(Math.min(anchorRow, r), Math.max(anchorRow, r), Math.min(anchorCol, c), Math.max(anchorCol, c));
      } else if (dragMode === "row") {
        var rh = getRowHeader(e.target);
        if (!rh) return;
        var row = parseInt(rh.getAttribute("data-rowheader"), 10);
        applyRange(Math.min(anchorRow, row), Math.max(anchorRow, row), 0, numCols - 1);
      } else if (dragMode === "col") {
        var ch = getColHeader(e.target);
        if (!ch) return;
        var col = parseInt(ch.getAttribute("data-col"), 10);
        applyRange(1, totalDataRows(), Math.min(anchorCol, col), Math.max(anchorCol, col));
      }
    });

    // Pagination
    var prevBtn = container.querySelector('[data-ep-action="prev"]');
    var nextBtn = container.querySelector('[data-ep-action="next"]');
    if (prevBtn) prevBtn.addEventListener("click", function () { if (currentPage > 0) { currentPage--; renderTable(); } });
    if (nextBtn) nextBtn.addEventListener("click", function () { if (currentPage < totalPages - 1) { currentPage++; renderTable(); } });
  }

  // Global mouseup
  document.addEventListener("mouseup", function () {
    if (selecting) { selecting = false; dragMode = ""; }
  });

  // Selection
  function applyRange(rMin, rMax, cMin, cMax) {
    selMinRow = rMin; selMaxRow = rMax;
    selMinCol = cMin; selMaxCol = cMax;
    reapplyVisualSelection();
    if (onSelectionChange) onSelectionChange(getSelection());
  }

  function reapplyVisualSelection() {
    clearVisual();
    if (selMinRow < 0 || !container) return;
    var table = container.querySelector(".ep-table");
    if (!table) return;

    var cells = table.querySelectorAll("td[data-r][data-c]");
    for (var i = 0; i < cells.length; i++) {
      var r = parseInt(cells[i].getAttribute("data-r"), 10);
      var c = parseInt(cells[i].getAttribute("data-c"), 10);
      if (r >= selMinRow && r <= selMaxRow && c >= selMinCol && c <= selMaxCol) {
        cells[i].classList.add("ep-cell-selected");
      }
    }

    var rowHeaders = table.querySelectorAll("td[data-rowheader]");
    for (var j = 0; j < rowHeaders.length; j++) {
      var rr = parseInt(rowHeaders[j].getAttribute("data-rowheader"), 10);
      if (rr >= selMinRow && rr <= selMaxRow) rowHeaders[j].classList.add("ep-header-selected");
    }

    var colHeaders = table.querySelectorAll("th[data-col]");
    for (var k = 0; k < colHeaders.length; k++) {
      var cc = parseInt(colHeaders[k].getAttribute("data-col"), 10);
      if (cc >= selMinCol && cc <= selMaxCol) colHeaders[k].classList.add("ep-header-selected");
    }
  }

  function clearVisual() {
    if (!container) return;
    var els = container.querySelectorAll(".ep-cell-selected, .ep-header-selected");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("ep-cell-selected");
      els[i].classList.remove("ep-header-selected");
    }
  }

  function setPreview(rMin, rMax, cMin, cMax) {
    clearPreview();
    if (!container || rMin < 0) return;
    var table = container.querySelector(".ep-table");
    if (!table) return;
    var cells = table.querySelectorAll("td[data-r][data-c]");
    for (var i = 0; i < cells.length; i++) {
      var r = parseInt(cells[i].getAttribute("data-r"), 10);
      var c = parseInt(cells[i].getAttribute("data-c"), 10);
      if (r >= rMin && r <= rMax && c >= cMin && c <= cMax) {
        cells[i].classList.add("ep-cell-preview");
      }
    }
  }

  function clearPreview() {
    if (!container) return;
    var els = container.querySelectorAll(".ep-cell-preview");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("ep-cell-preview");
      els[i].classList.remove("ep-cell-preview--intense");
    }
  }

  function intensifyPreview() {
    if (!container) return;
    var els = container.querySelectorAll(".ep-cell-preview");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("ep-cell-preview--intense");
    }
  }

  function dimPreview() {
    if (!container) return;
    var els = container.querySelectorAll(".ep-cell-preview--intense");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("ep-cell-preview--intense");
    }
  }

  function getHeaderBlockEnd() {
    if (selMinRow < 0 || selMinRow !== selMaxRow) return -1;
    var r = selMinRow + 1;
    var maxR = totalDataRows();
    while (r <= maxR && !isRowEmpty(r)) { r++; }
    return r - 1;
  }

  function clearSelection() {
    clearVisual();
    selMinRow = selMaxRow = selMinCol = selMaxCol = -1;
    anchorRow = -1; anchorCol = -1;
    if (onSelectionChange) onSelectionChange(null);
  }

  function getSelection() {
    if (selMinRow < 0) return null;
    return {
      minRow: selMinRow, maxRow: selMaxRow,
      minCol: selMinCol, maxCol: selMaxCol,
      rangeLabel: colLabels[selMinCol] + selMinRow + ':' + colLabels[selMaxCol] + selMaxRow,
      isFullRow: isFullRowSelected()
    };
  }

  function saveBlock(withHeader) {
    if (selMinRow < 0) return null;

    var block = {
      withHeader: withHeader,
      rangeLabel: colLabels[selMinCol] + selMinRow + ':' + colLabels[selMaxCol] + selMaxRow,
      headerData: null,
      rows: [],
      colLabelsSlice: colLabels.slice(selMinCol, selMaxCol + 1)
    };

    if (withHeader) {
      var headerRow = selMinRow;
      var hRow = dataForDisplayRow(headerRow);
      block.headerData = [];
      for (var hc = selMinCol; hc <= selMaxCol; hc++) {
        block.headerData.push((hRow[hc] !== undefined) ? hRow[hc] : "");
      }
      var r = headerRow + 1;
      var maxR = totalDataRows();
      while (r <= maxR && !isRowEmpty(r)) {
        var rd = dataForDisplayRow(r);
        var rowSlice = [];
        for (var c = selMinCol; c <= selMaxCol; c++) {
          rowSlice.push((rd[c] !== undefined) ? rd[c] : "");
        }
        block.rows.push(rowSlice);
        r++;
      }
      var lastDataRow = r - 1;
      if (lastDataRow < headerRow) lastDataRow = headerRow;
      block.rangeLabel = colLabels[selMinCol] + headerRow + ':' + colLabels[selMaxCol] + lastDataRow;
    } else {
      for (var rr = selMinRow; rr <= selMaxRow; rr++) {
        var rrd = dataForDisplayRow(rr);
        var slice = [];
        for (var cc = selMinCol; cc <= selMaxCol; cc++) {
          slice.push((rrd[cc] !== undefined) ? rrd[cc] : "");
        }
        block.rows.push(slice);
      }
    }

    return block;
  }

  // Public API
  return {
    init: function (el, opts) {
      container = el;
      onSelectionChange = (opts && opts.onSelectionChange) || null;
      clearSelection();
      container.innerHTML = '';
    },
    loadCSV: function (text) { parseCSV(text); },
    loadSample: function () { parseCSV(sampleCSV); },
    getSelection: getSelection,
    saveBlock: function () { return saveBlock(false); },
    saveBlockWithHeader: function () { return saveBlock(true); },
    clearSelection: clearSelection,
    hasSelection: function () { return selMinRow >= 0; },
    canSaveWithHeader: function () { return selMinRow >= 0 && selMinRow === selMaxRow && isFullRowSelected(); },
    setSelection: function (rMin, rMax, cMin, cMax) {
      if (rMin >= 0 && cMin >= 0) {
        anchorRow = rMin; anchorCol = cMin;
        applyRange(rMin, rMax, cMin, cMax);
      }
    },
    setPreview: setPreview,
    clearPreview: clearPreview,
    intensifyPreview: intensifyPreview,
    dimPreview: dimPreview,
    getHeaderBlockEnd: getHeaderBlockEnd,
    destroy: function () { if (container) container.innerHTML = ""; container = null; }
  };
})();
