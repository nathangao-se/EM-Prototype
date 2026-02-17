(function() {
    "use strict";

    var PAGE_SIZE = 500;

    var csvData = [];
    var colLabels = [];
    var numCols = 0;
    var currentPage = 0;
    var totalPages = 1;

    // Drag state
    var selecting = false;
    var dragMode = "";
    var anchorRow = -1;
    var anchorCol = -1;

    // Selection bounds (1-based display row indices)
    var selMinRow = -1, selMaxRow = -1, selMinCol = -1, selMaxCol = -1;

    // Saved blocks
    var blocks = [];
    var blockIdCounter = 0;

    var BLOCK_PREVIEW_ROWS = 10;
    var BLOCK_PREVIEW_COLS = 20;

    var sampleCSV = [
        "Name,Age,City,Email,Department",
        "John Doe,28,New York,john@example.com,Engineering",
        "Jane Smith,34,Los Angeles,jane@example.com,Marketing",
        "Bob Johnson,42,Chicago,bob@example.com,Finance",
        "Alice Williams,31,Houston,alice@example.com,Engineering",
        "Charlie Brown,29,Phoenix,charlie@example.com,Design",
        "Diana Davis,37,Philadelphia,diana@example.com,Marketing",
        "Eve Wilson,26,San Antonio,eve@example.com,Engineering",
        "Frank Garcia,45,San Diego,frank@example.com,Finance"
    ].join("\n");

    // =========================================================================
    // Utilities
    // =========================================================================

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

    function setStatus(msg) {
        document.getElementById("status").textContent = msg;
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

    // =========================================================================
    // DOM element finders (walk up from event target)
    // =========================================================================

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

    // =========================================================================
    // CSV parsing
    // =========================================================================

    function parseCSV(text) {
        var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ""; });
        csvData = lines.map(function(line) {
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
        clearAll();
        renderPage();
        document.getElementById("tableContainer").classList.remove("hidden");
        document.getElementById("formSection").classList.remove("hidden");
    }

    // =========================================================================
    // Table rendering (paginated)
    // =========================================================================

    function renderPage() {
        var wrapper = document.getElementById("tableWrapper");
        var bounds = pageBounds();

        var parts = [];
        parts.push('<table id="dataTable">');

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

        wrapper.innerHTML = parts.join("");

        setStatus("Showing rows " + bounds.startRow + "\u2013" + bounds.endRow + " of " + totalDataRows() + " (" + numCols + " columns)");
        updatePagination();
        attachTableEvents();
        reapplyVisualSelection();
    }

    function updatePagination() {
        var pag = document.getElementById("pagination");
        if (totalPages <= 1) { pag.classList.add("hidden"); return; }
        pag.classList.remove("hidden");
        pag.style.display = "flex";
        document.getElementById("pageInfo").textContent = "Page " + (currentPage + 1) + " of " + totalPages;
        document.getElementById("prevPage").disabled = (currentPage === 0);
        document.getElementById("nextPage").disabled = (currentPage >= totalPages - 1);
    }

    // =========================================================================
    // Table interaction events
    // =========================================================================

    function attachTableEvents() {
        var table = document.getElementById("dataTable");

        table.addEventListener("mousedown", function(e) {
            e.preventDefault();
            var isShift = e.shiftKey;

            var corner = getCorner(e.target);
            if (corner) {
                anchorRow = 1; anchorCol = 0;
                applyRange(1, totalDataRows(), 0, numCols - 1);
                updatePreview();
                return;
            }

            var cell = getDataCell(e.target);
            if (cell) {
                var r = parseInt(cell.getAttribute("data-r"), 10);
                var c = parseInt(cell.getAttribute("data-c"), 10);
                if (isShift && anchorRow >= 0 && anchorCol >= 0) {
                    applyRange(Math.min(anchorRow, r), Math.max(anchorRow, r), Math.min(anchorCol, c), Math.max(anchorCol, c));
                    updatePreview();
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
                    updatePreview();
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
                    updatePreview();
                } else {
                    selecting = true; dragMode = "col"; anchorRow = 1; anchorCol = col;
                    applyRange(1, totalDataRows(), col, col);
                }
                return;
            }
        });

        table.addEventListener("mouseover", function(e) {
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

        document.addEventListener("mouseup", function() {
            if (selecting) { selecting = false; dragMode = ""; updatePreview(); }
        });
    }

    // =========================================================================
    // Selection
    // =========================================================================

    function applyRange(rMin, rMax, cMin, cMax) {
        selMinRow = rMin; selMaxRow = rMax;
        selMinCol = cMin; selMaxCol = cMax;
        reapplyVisualSelection();
        updateSaveButtons();
    }

    function reapplyVisualSelection() {
        clearVisual();
        if (selMinRow < 0) return;
        var table = document.getElementById("dataTable");
        if (!table) return;

        var cells = table.querySelectorAll("td[data-r][data-c]");
        for (var i = 0; i < cells.length; i++) {
            var r = parseInt(cells[i].getAttribute("data-r"), 10);
            var c = parseInt(cells[i].getAttribute("data-c"), 10);
            if (r >= selMinRow && r <= selMaxRow && c >= selMinCol && c <= selMaxCol) {
                cells[i].classList.add("cell-selected");
            }
        }

        var rowHeaders = table.querySelectorAll("td[data-rowheader]");
        for (var j = 0; j < rowHeaders.length; j++) {
            var rr = parseInt(rowHeaders[j].getAttribute("data-rowheader"), 10);
            if (rr >= selMinRow && rr <= selMaxRow) rowHeaders[j].classList.add("header-selected");
        }

        var colHeaders = table.querySelectorAll("th[data-col]");
        for (var k = 0; k < colHeaders.length; k++) {
            var cc = parseInt(colHeaders[k].getAttribute("data-col"), 10);
            if (cc >= selMinCol && cc <= selMaxCol) colHeaders[k].classList.add("header-selected");
        }
    }

    function clearVisual() {
        var els = document.querySelectorAll(".cell-selected, .header-selected");
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove("cell-selected");
            els[i].classList.remove("header-selected");
        }
    }

    function clearAll() {
        clearVisual();
        selMinRow = selMaxRow = selMinCol = selMaxCol = -1;
        anchorRow = -1; anchorCol = -1;
        document.getElementById("selectionRange").textContent = "None";
        document.getElementById("previewContainer").innerHTML = "";
        updateSaveButtons();
    }

    function updateSaveButtons() {
        var hasSelection = selMinRow >= 0;
        document.getElementById("saveBlockBtn").disabled = !hasSelection;
        document.getElementById("saveHeaderBlockBtn").disabled = !isFullRowSelected();
    }

    // =========================================================================
    // Save blocks
    // =========================================================================

    function saveBlock(withHeader) {
        if (selMinRow < 0) return;

        blockIdCounter++;
        var block = {
            id: blockIdCounter,
            withHeader: withHeader,
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

        blocks.push(block);
        renderBlocks();
    }

    function removeBlock(id) {
        blocks = blocks.filter(function(b) { return b.id !== id; });
        renderBlocks();
    }

    // =========================================================================
    // Block rendering
    // =========================================================================

    function buildBlockTable(b, maxRows, maxCols) {
        var headers = b.withHeader && b.headerData ? b.headerData : b.colLabelsSlice;
        var showCols = Math.min(headers.length, maxCols);
        var showRows = Math.min(b.rows.length, maxRows);
        var colsTruncated = headers.length > maxCols;
        var rowsTruncated = b.rows.length > maxRows;

        var parts = [];
        parts.push('<table class="block-table"><thead><tr>');
        for (var hc = 0; hc < showCols; hc++) {
            parts.push('<th>' + esc(headers[hc]) + '</th>');
        }
        if (colsTruncated) parts.push('<th style="color:#999;">\u2026</th>');
        parts.push('</tr></thead><tbody>');

        for (var ri = 0; ri < showRows; ri++) {
            parts.push('<tr>');
            for (var ci = 0; ci < showCols; ci++) {
                parts.push('<td>' + esc(b.rows[ri][ci] || "") + '</td>');
            }
            if (colsTruncated) parts.push('<td style="color:#999;">\u2026</td>');
            parts.push('</tr>');
        }

        if (rowsTruncated) {
            parts.push('<tr>');
            for (var ti = 0; ti < showCols; ti++) {
                parts.push('<td style="color:#999; text-align:center;">\u22ee</td>');
            }
            if (colsTruncated) parts.push('<td style="color:#999;">\u22ee</td>');
            parts.push('</tr>');
        }

        parts.push('</tbody></table>');
        return parts.join("");
    }

    function renderBlocks() {
        var section = document.getElementById("blocksSection");
        var container = document.getElementById("blocksContainer");

        if (blocks.length === 0) {
            section.classList.add("hidden");
            container.innerHTML = "";
            return;
        }

        section.classList.remove("hidden");
        var parts = [];

        for (var bi = 0; bi < blocks.length; bi++) {
            var b = blocks[bi];
            var colCount = (b.withHeader && b.headerData) ? b.headerData.length : b.colLabelsSlice.length;
            var rowCount = b.rows.length;
            var label = b.withHeader ? "Block " + b.id + " (with header)" : "Block " + b.id;
            var needsExpand = rowCount > BLOCK_PREVIEW_ROWS || colCount > BLOCK_PREVIEW_COLS;

            parts.push('<div class="block-card" data-blockid="' + b.id + '">');
            parts.push('<div class="block-card-header">');
            parts.push('<div>');
            parts.push('<span class="block-card-title">' + esc(label) + '</span> ');
            parts.push('<span class="block-card-meta">' + rowCount + ' rows \u00d7 ' + colCount + ' cols</span>');
            parts.push('</div>');
            parts.push('<div style="display:flex; gap:6px;">');
            if (needsExpand) {
                parts.push('<button class="btn btn-sm block-view-btn" data-blockid="' + b.id + '">View Full</button>');
            }
            parts.push('<button class="btn btn-danger btn-sm block-remove-btn" data-blockid="' + b.id + '">Remove</button>');
            parts.push('</div>');
            parts.push('</div>');

            parts.push('<div class="block-table-wrap">');
            parts.push(buildBlockTable(b, BLOCK_PREVIEW_ROWS, BLOCK_PREVIEW_COLS));
            parts.push('</div>');

            if (needsExpand) {
                var shown = Math.min(rowCount, BLOCK_PREVIEW_ROWS);
                var shownCols = Math.min(colCount, BLOCK_PREVIEW_COLS);
                parts.push('<div class="block-truncation-note">Showing ' + shown + ' of ' + rowCount + ' rows');
                if (colCount > BLOCK_PREVIEW_COLS) {
                    parts.push(', ' + shownCols + ' of ' + colCount + ' columns');
                }
                parts.push('</div>');
            }

            parts.push('</div>');
        }

        container.innerHTML = parts.join("");

        var removeBtns = container.querySelectorAll(".block-remove-btn");
        for (var i = 0; i < removeBtns.length; i++) {
            removeBtns[i].addEventListener("click", function() {
                removeBlock(parseInt(this.getAttribute("data-blockid"), 10));
            });
        }

        var viewBtns = container.querySelectorAll(".block-view-btn");
        for (var j = 0; j < viewBtns.length; j++) {
            viewBtns[j].addEventListener("click", function() {
                openBlockModal(parseInt(this.getAttribute("data-blockid"), 10));
            });
        }
    }

    // =========================================================================
    // Modal
    // =========================================================================

    function openBlockModal(id) {
        var block = null;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === id) { block = blocks[i]; break; }
        }
        if (!block) return;

        var label = block.withHeader ? "Block " + block.id + " (with header)" : "Block " + block.id;
        var colCount = (block.withHeader && block.headerData) ? block.headerData.length : block.colLabelsSlice.length;
        document.getElementById("modalTitle").textContent = label + " \u2014 " + block.rows.length + " rows \u00d7 " + colCount + " cols";
        document.getElementById("modalBody").innerHTML = buildBlockTable(block, block.rows.length, colCount);
        document.getElementById("blockModal").classList.add("active");
    }

    function closeModal() {
        document.getElementById("blockModal").classList.remove("active");
    }

    // =========================================================================
    // Selection preview
    // =========================================================================

    function updatePreview() {
        updateSaveButtons();

        if (selMinRow < 0) {
            document.getElementById("selectionRange").textContent = "None";
            document.getElementById("previewContainer").innerHTML = "";
            return;
        }

        var rMin = selMinRow, rMax = selMaxRow, cMin = selMinCol, cMax = selMaxCol;
        var totalSelectedRows = rMax - rMin + 1;
        var totalSelectedCols = cMax - cMin + 1;

        var rangeText = "";
        if (rMin === rMax && cMin === cMax) {
            rangeText = "Cell: Row " + rMin + ", Col " + colLabels[cMin];
        } else {
            rangeText = "Rows " + rMin + "\u2013" + rMax + ", Cols " + colLabels[cMin] + "\u2013" + colLabels[cMax] +
                " (" + totalSelectedRows + " rows \u00d7 " + totalSelectedCols + " cols)";
        }
        document.getElementById("selectionRange").textContent = rangeText;

        var PREVIEW_LIMIT = 100;
        var previewEnd = Math.min(rMax, rMin + PREVIEW_LIMIT - 1);
        var isTruncated = previewEnd < rMax;

        var parts = [];
        parts.push('<table class="preview-table"><thead><tr>');
        for (var c = cMin; c <= cMax; c++) {
            parts.push("<th>" + colLabels[c] + "</th>");
        }
        parts.push("</tr></thead><tbody>");

        for (var r = rMin; r <= previewEnd; r++) {
            var rd = dataForDisplayRow(r);
            parts.push("<tr>");
            for (var cc = cMin; cc <= cMax; cc++) {
                var val = (rd[cc] !== undefined) ? rd[cc] : "";
                parts.push("<td>" + esc(val) + "</td>");
            }
            parts.push("</tr>");
        }
        parts.push("</tbody></table>");

        if (isTruncated) {
            parts.push('<p style="margin-top:8px; font-size:13px; color:#666;">Showing first ' + PREVIEW_LIMIT + ' of ' + totalSelectedRows + ' selected rows.</p>');
        }

        document.getElementById("previewContainer").innerHTML = parts.join("");
    }

    // =========================================================================
    // Wire up static UI elements
    // =========================================================================

    document.getElementById("csvFile").addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) { parseCSV(ev.target.result); };
        reader.readAsText(file);
    });

    document.getElementById("loadSample").addEventListener("click", function() {
        parseCSV(sampleCSV);
    });

    document.getElementById("clearBtn").addEventListener("click", function() { clearAll(); });
    document.getElementById("clearBtnTop").addEventListener("click", function() { clearAll(); });

    document.getElementById("prevPage").addEventListener("click", function() {
        if (currentPage > 0) { currentPage--; renderPage(); }
    });
    document.getElementById("nextPage").addEventListener("click", function() {
        if (currentPage < totalPages - 1) { currentPage++; renderPage(); }
    });

    document.getElementById("saveBlockBtn").addEventListener("click", function() {
        saveBlock(false);
    });
    document.getElementById("saveHeaderBlockBtn").addEventListener("click", function() {
        saveBlock(true);
    });

    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("blockModal").addEventListener("click", function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeModal();
    });

})();
