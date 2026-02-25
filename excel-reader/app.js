(function () {
    "use strict";

    var workbook = null;
    var allSheetData = {};
    var activeSheet = null;
    var namedRangesMap = {};

    // Notes extracted from ZIP, keyed by sheet name then cell address
    var zipNotes = {};

    var fileInput = document.getElementById("fileInput");
    var dropZone = document.getElementById("dropZone");
    var output = document.getElementById("output");
    var sheetTabs = document.getElementById("sheetTabs");
    var thead = document.querySelector("#resultTable thead");
    var tbody = document.querySelector("#resultTable tbody");
    var statsEl = document.getElementById("stats");
    var notesOnlyToggle = document.getElementById("notesOnlyToggle");
    var copyBtn = document.getElementById("copyBtn");
    var downloadBtn = document.getElementById("downloadBtn");

    // =========================================================================
    // File handling
    // =========================================================================

    fileInput.addEventListener("change", function () {
        if (fileInput.files[0]) loadFile(fileInput.files[0]);
    });

    dropZone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", function () {
        dropZone.classList.remove("dragover");
    });
    dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        var file = e.dataTransfer.files[0];
        if (file) loadFile(file);
    });

    function showStatus(msg, isError) {
        var el = document.getElementById("loadStatus");
        el.textContent = msg;
        el.className = "load-status" + (isError ? " load-status--error" : "");
        el.classList.remove("hidden");
    }

    function hideStatus() {
        document.getElementById("loadStatus").classList.add("hidden");
    }

    function loadFile(file) {
        showStatus("Reading file: " + file.name + " (" + (file.size / 1024).toFixed(1) + " KB)...");
        output.classList.add("hidden");

        var reader = new FileReader();
        reader.onerror = function () {
            showStatus("Error: FileReader failed — " + (reader.error ? reader.error.message : "unknown error"), true);
        };
        reader.onload = function (e) {
            var arrayBuf = e.target.result;
            var data = new Uint8Array(arrayBuf);

            try {
                showStatus("Parsing Excel structure...");
                workbook = XLSX.read(data, { type: "array" });
            } catch (err) {
                showStatus("Error parsing file: " + err.message, true);
                return;
            }

            showStatus("Scanning for cell notes...");
            JSZip.loadAsync(arrayBuf).then(function (zip) {
                return extractNotesFromZip(zip);
            }).then(function () {
                showStatus("Extracting cells and notes from " + workbook.SheetNames.length + " sheet(s)...");
                parseWorkbook();
                hideStatus();
            }).catch(function (err) {
                showStatus("Error reading notes from ZIP: " + err.message, true);
                parseWorkbook();
                hideStatus();
            });
        };
        reader.readAsArrayBuffer(file);
    }

    // =========================================================================
    // Extract notes directly from xlsx ZIP structure
    // =========================================================================

    function extractNotesFromZip(zip) {
        zipNotes = {};

        var relFiles = [];
        var commentFiles = [];
        var sheetFiles = [];

        zip.forEach(function (path) {
            if (/^xl\/worksheets\/_rels\/sheet\d+\.xml\.rels$/i.test(path)) {
                relFiles.push(path);
            }
            if (/^xl\/comments\d*\.xml$/i.test(path)) {
                commentFiles.push(path);
            }
            if (/^xl\/threadedComments\//i.test(path)) {
                commentFiles.push(path);
            }
            if (/^xl\/worksheets\/sheet\d+\.xml$/i.test(path)) {
                sheetFiles.push(path);
            }
        });

        var sheetCommentMap = {};

        var promises = relFiles.map(function (relPath) {
            return zip.file(relPath).async("string").then(function (xml) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(xml, "application/xml");
                var rels = doc.getElementsByTagName("Relationship");

                var match = relPath.match(/sheet(\d+)\.xml\.rels/i);
                if (!match) return;
                var sheetIndex = parseInt(match[1], 10) - 1;

                for (var i = 0; i < rels.length; i++) {
                    var target = rels[i].getAttribute("Target") || "";
                    var type = rels[i].getAttribute("Type") || "";
                    if (type.indexOf("/comments") !== -1 || target.indexOf("comments") !== -1) {
                        var commentFile = target.replace(/^\.\.\//, "xl/");
                        sheetCommentMap[sheetIndex] = commentFile;
                    }
                }
            });
        });

        return Promise.all(promises).then(function () {
            var commentPromises = [];
            Object.keys(sheetCommentMap).forEach(function (idxStr) {
                var sheetIndex = parseInt(idxStr, 10);
                var commentPath = sheetCommentMap[sheetIndex];
                var sheetName = workbook.SheetNames[sheetIndex] || ("Sheet" + (sheetIndex + 1));

                var zipEntry = zip.file(commentPath);
                if (!zipEntry) return;

                commentPromises.push(
                    zipEntry.async("string").then(function (xml) {
                        parseCommentsXml(xml, sheetName);
                    })
                );
            });

            commentFiles.forEach(function (path) {
                var alreadyMapped = false;
                Object.keys(sheetCommentMap).forEach(function (k) {
                    if (sheetCommentMap[k] === path) alreadyMapped = true;
                });
                if (alreadyMapped) return;

                var match = path.match(/comments(\d+)\.xml/i);
                var sheetIndex = match ? parseInt(match[1], 10) - 1 : 0;
                var sheetName = workbook.SheetNames[sheetIndex] || ("Sheet" + (sheetIndex + 1));

                var zipEntry = zip.file(path);
                if (!zipEntry) return;

                commentPromises.push(
                    zipEntry.async("string").then(function (xml) {
                        if (!zipNotes[sheetName]) {
                            parseCommentsXml(xml, sheetName);
                        }
                    })
                );
            });

            return Promise.all(commentPromises);
        }).then(function () {
            // Parse sheet XML for data validation input messages
            var sheetPromises = sheetFiles.map(function (sheetPath) {
                var match = sheetPath.match(/sheet(\d+)\.xml$/i);
                var sheetIndex = match ? parseInt(match[1], 10) - 1 : 0;
                var sheetName = workbook.SheetNames[sheetIndex] || ("Sheet" + (sheetIndex + 1));

                return zip.file(sheetPath).async("string").then(function (xml) {
                    parseSheetXmlForNotes(xml, sheetName);
                });
            });
            return Promise.all(sheetPromises);
        });
    }

    function parseCommentsXml(xml, sheetName) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, "application/xml");

        var authors = [];
        var authorEls = doc.getElementsByTagName("author");
        for (var i = 0; i < authorEls.length; i++) {
            authors.push(authorEls[i].textContent || "");
        }

        var comments = doc.getElementsByTagName("comment");
        if (!zipNotes[sheetName]) zipNotes[sheetName] = {};

        for (var i = 0; i < comments.length; i++) {
            var ref = comments[i].getAttribute("ref");
            var authorId = parseInt(comments[i].getAttribute("authorId") || "0", 10);
            var author = authors[authorId] || "";

            var tEls = comments[i].getElementsByTagName("t");
            var textParts = [];
            for (var j = 0; j < tEls.length; j++) {
                var t = tEls[j].textContent || "";
                if (t.trim()) textParts.push(t.trim());
            }
            var noteText = textParts.join(" ");

            if (author && noteText.indexOf(author) !== 0) {
                noteText = author + ": " + noteText;
            }

            if (ref && noteText) {
                zipNotes[sheetName][ref] = noteText;
            }
        }
    }

    function parseSheetXmlForNotes(xml, sheetName) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, "application/xml");

        if (!zipNotes[sheetName]) zipNotes[sheetName] = {};

        var dvs = doc.getElementsByTagName("dataValidation");
        for (var i = 0; i < dvs.length; i++) {
            var sqref = dvs[i].getAttribute("sqref") || "";
            var prompt = dvs[i].getAttribute("prompt") || "";
            var promptTitle = dvs[i].getAttribute("promptTitle") || "";
            var errorTitle = dvs[i].getAttribute("errorTitle") || "";
            var errorMsg = dvs[i].getAttribute("error") || "";

            var noteText = "";
            if (promptTitle && prompt) noteText = promptTitle + ": " + prompt;
            else if (prompt) noteText = prompt;
            else if (promptTitle) noteText = promptTitle;

            if (errorMsg) {
                var errPart = errorTitle ? errorTitle + ": " + errorMsg : errorMsg;
                noteText = noteText ? noteText + " [Error: " + errPart + "]" : errPart;
            }

            if (!noteText) continue;

            // Clean up Excel escape sequences
            noteText = noteText.replace(/_x000d_/g, "").replace(/_x000a_/g, "\n").trim();

            var refs = expandSqref(sqref);
            refs.forEach(function (cellAddr) {
                if (!zipNotes[sheetName][cellAddr]) {
                    zipNotes[sheetName][cellAddr] = noteText;
                }
            });
        }
    }

    function expandSqref(sqref) {
        var results = [];
        var parts = sqref.split(/\s+/);
        parts.forEach(function (part) {
            if (part.indexOf(":") === -1) {
                results.push(part);
                return;
            }
            try {
                var range = XLSX.utils.decode_range(part);
                for (var r = range.s.r; r <= range.e.r; r++) {
                    for (var c = range.s.c; c <= range.e.c; c++) {
                        results.push(XLSX.utils.encode_cell({ r: r, c: c }));
                    }
                }
            } catch (e) {
                results.push(part);
            }
        });
        return results;
    }

    // =========================================================================
    // Parse workbook: extract cell values, notes, named ranges
    // =========================================================================

    function parseWorkbook() {
        allSheetData = {};
        namedRangesMap = {};

        if (workbook.Workbook && workbook.Workbook.Names) {
            workbook.Workbook.Names.forEach(function (def) {
                if (def.Hidden) return;
                var ref = def.Ref || "";
                var key = ref.replace(/\$/g, "");
                if (!namedRangesMap[key]) namedRangesMap[key] = [];
                namedRangesMap[key].push(def.Name);

                var parts = ref.split("!");
                if (parts.length === 2) {
                    var cellPart = parts[1].replace(/\$/g, "");
                    var sheetPart = parts[0].replace(/'/g, "");
                    var fullKey = sheetPart + "!" + cellPart;
                    if (!namedRangesMap[fullKey]) namedRangesMap[fullKey] = [];
                    if (namedRangesMap[fullKey].indexOf(def.Name) === -1) {
                        namedRangesMap[fullKey].push(def.Name);
                    }
                }
            });
        }

        workbook.SheetNames.forEach(function (name) {
            allSheetData[name] = parseSheet(name);
        });

        activeSheet = workbook.SheetNames[0];
        output.classList.remove("hidden");
        renderSheetTabs();
        renderTable();
    }

    function parseSheet(sheetName) {
        var sheet = workbook.Sheets[sheetName];
        var range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
        var rows = [];
        var noteCount = 0;
        var sheetNotes = zipNotes[sheetName] || {};

        for (var r = range.s.r; r <= range.e.r; r++) {
            for (var c = range.s.c; c <= range.e.c; c++) {
                var addr = XLSX.utils.encode_cell({ r: r, c: c });
                var cell = sheet[addr];
                var value = "";
                var note = "";
                var names = [];

                if (cell) {
                    value = cell.w !== undefined ? cell.w : (cell.v !== undefined ? String(cell.v) : "");

                    if (cell.c && cell.c.length > 0) {
                        note = cell.c.map(function (cm) {
                            var author = cm.a || "";
                            var text = cm.t || "";
                            if (!text && cm.r) text = cm.r.replace(/<[^>]*>/g, "");
                            return author ? author + ": " + text : text;
                        }).filter(Boolean).join(" | ");
                    }
                }

                // Fall back to ZIP-extracted notes
                if (!note && sheetNotes[addr]) {
                    note = sheetNotes[addr];
                }

                if (note) noteCount++;

                var fullRef = sheetName + "!" + addr;
                if (namedRangesMap[fullRef]) {
                    names = namedRangesMap[fullRef];
                }

                if (!value && !note && names.length === 0) continue;

                rows.push({
                    addr: addr,
                    row: r,
                    col: c,
                    value: value,
                    note: note,
                    names: names
                });
            }
        }

        return { rows: rows, noteCount: noteCount };
    }

    // =========================================================================
    // Rendering
    // =========================================================================

    function renderSheetTabs() {
        sheetTabs.innerHTML = "";
        workbook.SheetNames.forEach(function (name) {
            var btn = document.createElement("button");
            btn.className = "sheet-tab" + (name === activeSheet ? " sheet-tab--active" : "");
            btn.textContent = name;
            var noteCount = allSheetData[name].noteCount;
            if (noteCount > 0) {
                btn.textContent += " (" + noteCount + " notes)";
            }
            btn.addEventListener("click", function () {
                activeSheet = name;
                renderSheetTabs();
                renderTable();
            });
            sheetTabs.appendChild(btn);
        });
    }

    function renderTable() {
        var data = allSheetData[activeSheet];
        if (!data) return;

        var notesOnly = notesOnlyToggle.checked;
        var rows = notesOnly ? data.rows.filter(function (r) { return r.note; }) : data.rows;

        thead.innerHTML = "<tr><th>Cell</th><th>Value</th><th>Note</th><th>Named Range</th></tr>";

        var parts = [];
        rows.forEach(function (r) {
            var noteClass = r.note ? " has-note-cell" : "";
            parts.push("<tr>");
            parts.push('<td>' + esc(r.addr) + '</td>');
            parts.push('<td>' + esc(r.value) + '</td>');
            parts.push('<td class="' + noteClass + '"><span class="note-text">' + esc(r.note) + '</span></td>');
            parts.push('<td>' + r.names.map(function (n) {
                return '<span class="named-range-chip">' + esc(n) + '</span>';
            }).join("") + '</td>');
            parts.push("</tr>");
        });
        tbody.innerHTML = parts.join("");

        var totalCells = data.rows.length;
        var withNotes = data.rows.filter(function (r) { return r.note; }).length;
        var withNames = data.rows.filter(function (r) { return r.names.length > 0; }).length;
        statsEl.textContent = totalCells + " cells" +
            (withNotes > 0 ? ", " + withNotes + " with notes" : "") +
            (withNames > 0 ? ", " + withNames + " with named ranges" : "") +
            (notesOnly ? " (filtered: notes only)" : "");
    }

    notesOnlyToggle.addEventListener("change", renderTable);

    // =========================================================================
    // Export
    // =========================================================================

    function getExportRows() {
        var data = allSheetData[activeSheet];
        if (!data) return [];
        var notesOnly = notesOnlyToggle.checked;
        var rows = notesOnly ? data.rows.filter(function (r) { return r.note; }) : data.rows;
        var lines = [["Cell", "Value", "Note", "Named Range"].join("\t")];
        rows.forEach(function (r) {
            lines.push([r.addr, r.value, r.note, r.names.join(", ")].join("\t"));
        });
        return lines;
    }

    copyBtn.addEventListener("click", function () {
        var text = getExportRows().join("\n");
        navigator.clipboard.writeText(text).then(function () {
            var orig = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(function () { copyBtn.textContent = orig; }, 1500);
        });
    });

    downloadBtn.addEventListener("click", function () {
        var lines = getExportRows();
        var csv = lines.map(function (line) {
            return line.split("\t").map(function (cell) {
                if (cell.indexOf(",") !== -1 || cell.indexOf('"') !== -1 || cell.indexOf("\n") !== -1) {
                    return '"' + cell.replace(/"/g, '""') + '"';
                }
                return cell;
            }).join(",");
        }).join("\n");

        var blob = new Blob([csv], { type: "text/csv" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = (activeSheet || "export") + "_cells_notes.csv";
        a.click();
        URL.revokeObjectURL(url);
    });

    // =========================================================================
    // Utilities
    // =========================================================================

    var esc = window.DomUtils.esc;
})();
