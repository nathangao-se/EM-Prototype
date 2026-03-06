// ── SE Palettes (exact hex from Figma — zero interpretation) ──

const SE_PALETTES = {
  "Base Palette": [
    "#42caff", "#2e8db2", "#6c2da6", "#660058",
    "#c800ac", "#80667c", "#93303b", "#de4859",
    "#f38c00", "#ae7d20", "#f7b51b", "#ffe066",
    "#c581d0", "#7d7bda", "#564359"
  ],
  "Divergent": [
    "#a35b00", "#c87d1f", "#ed9f3e", "#f9bb6d",
    "#ecd1ac", "#dfe7eb", "#a0dbf3", "#61d0fb",
    "#35b4e6", "#1a88b3", "#005c80"
  ],
  "Sequential": [
    "#8fdfff", "#50ceff", "#45b8f4", "#48a1e6",
    "#4c8ad8", "#4f73ca", "#535bbc", "#5641ac",
    "#5b2199", "#491678", "#351056"
  ],
  "Semantic (RAG)": [
    "#804700", "#c2491d", "#ff4b38", "#ff7a48",
    "#ffa857", "#ffd766", "#d0d568", "#a0d26b",
    "#3dcd58", "#289257", "#105056"
  ],
};

const SE_PREFIXES = {
  "Base Palette": "Bp",
  "Divergent": "Div",
  "Sequential": "Seq",
  "Semantic (RAG)": "Rag",
};

// Build shorthand lookup: hex → shorthand (first occurrence wins)
const HEX_TO_SHORTHAND = {};
Object.entries(SE_PALETTES).forEach(([name, colors]) => {
  const prefix = SE_PREFIXES[name];
  colors.forEach((hex, i) => {
    const key = hex.toLowerCase();
    if (!HEX_TO_SHORTHAND[key]) {
      HEX_TO_SHORTHAND[key] = `${prefix}${i + 1}`;
    }
  });
});

function shorthandFor(hex) {
  if (!hex) return "";
  return HEX_TO_SHORTHAND[hex.toLowerCase()] || "";
}

// ── Presets ──

const PRESETS = {
  "Default": [
    "#6366f1", "#f43f5e", "#10b981", "#f59e0b",
    "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"
  ],
  "Pastel": [
    "#a3b8ef", "#f0aabc", "#a8e6cf", "#ffd3a5",
    "#b5d4f1", "#d4b5f1", "#f1b5d4", "#b5f1e4"
  ],
  "Vivid": [
    "#ff006e", "#fb5607", "#ffbe0b", "#06d6a0",
    "#118ab2", "#073b4c", "#8338ec", "#3a86ff"
  ],
  "Earth": [
    "#6b4226", "#a67c52", "#c4a35a", "#8c9e5e",
    "#5e7e5e", "#4a6670", "#7a5c58", "#b38867"
  ],
  "Neon": [
    "#00ff87", "#ff00c8", "#00d4ff", "#ffe600",
    "#ff4d00", "#c800ff", "#00ffcc", "#ff2e63"
  ],
  "Ocean": [
    "#023e8a", "#0077b6", "#0096c7", "#00b4d8",
    "#48cae4", "#90e0ef", "#ade8f4", "#caf0f8"
  ],
  "Sunset": [
    "#3d0066", "#7b2d8e", "#c64191", "#f56476",
    "#f8a978", "#fcde9c", "#faf3dd", "#e8e8e4"
  ],
  "Monochrome": [
    "#1a1a2e", "#3a3a5c", "#5a5a8a", "#7a7ab8",
    "#9a9ad0", "#babae0", "#dadaef", "#f0f0f8"
  ],
};

// ── Slot State ──
// Each entry: { hex, label } | null

const INITIAL_SLOT_COUNT = 8;
let slots = Array(INITIAL_SLOT_COUNT).fill(null);

function getActivePalette() {
  const filled = slots.filter(s => s !== null).map(s => s.hex);
  return filled.length > 0 ? filled : ["#555"];
}

// ── Sample Data ──

// ── Density Configs ──
// points: bar/line/area/pie/radar labels, series: multi-line/scatter groups, stacks: stacked bar series

const DENSITY = {
  "less":      { points: 4,  series: 2, stacks: 3, scatterPer: 8  },
  "medium":    { points: 8,  series: 4, stacks: 5, scatterPer: 12 },
  "more":      { points: 12, series: 6, stacks: 7, scatterPer: 16 },
  "even-more": { points: 20, series: 8, stacks: 10, scatterPer: 20 },
};

let currentDensity = "medium";

function genLabels(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(`${i + 1}`);
  return out;
}

function vals(count, min = 10, max = 100) {
  return Array.from({ length: count }, () =>
    Math.round(min + Math.random() * (max - min))
  );
}

function scatterPts(count, max = 100) {
  return Array.from({ length: count }, () => ({
    x: Math.round(Math.random() * max),
    y: Math.round(Math.random() * max),
  }));
}

let DATA = {};

function generateData() {
  const d = DENSITY[currentDensity];
  const n = d.points;
  DATA.LABELS = genLabels(n);
  DATA.STACK_LABELS = genLabels(d.stacks);
  DATA.barData = vals(n);
  DATA.lineData = vals(n, 20, 90);
  DATA.areaData = vals(n, 15, 80);
  DATA.pieData = vals(n, 10, 60);
  DATA.radarData = vals(n, 30, 95);
  DATA.radarDataB = vals(n, 20, 85);
  DATA.multiLineData = Array.from({ length: d.series }, () => vals(n, 5, 90));
  DATA.stackedData = Array.from({ length: d.stacks }, () => vals(n, 10, 40));
  DATA.scatterSets = Array.from({ length: d.series }, () => scatterPts(d.scatterPer));
}

generateData();

// ── Color Helpers ──

let palette = getActivePalette();

function c(i) { return palette[i % palette.length]; }
function cAlpha(i, a) {
  let hex = c(i);
  if (!hex || !hex.startsWith("#")) return hex || "rgba(85,85,85," + a + ")";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function syncPalette() {
  palette = getActivePalette();
}

// ── Theme State ──

let isDark = false;

function themeColors() {
  if (isDark) {
    return {
      textColor: "#8b8fa3",
      axisLine: "rgba(255,255,255,0.06)",
      splitLine: "rgba(255,255,255,0.06)",
      tooltipBg: "#1a1d27",
      tooltipBorder: "#2e3244",
      tooltipText: "#e4e6f0",
      pieBorder: "#1a1d27",
    };
  }
  return {
    textColor: "#62656e",
    axisLine: "rgba(0,0,0,0.12)",
    splitLine: "rgba(0,0,0,0.08)",
    tooltipBg: "#ffffff",
    tooltipBorder: "#d4d6dd",
    tooltipText: "#1a1b1e",
    pieBorder: "#ffffff",
  };
}

// ── ECharts Common ──

function axisCommon() {
  const t = themeColors();
  return {
    axisLine: { lineStyle: { color: t.axisLine } },
    axisTick: { lineStyle: { color: t.axisLine } },
    axisLabel: { color: t.textColor, fontSize: 11 },
    splitLine: { lineStyle: { color: t.splitLine } },
  };
}

function legendCommon(show = false) {
  const t = themeColors();
  return { show, textStyle: { color: t.textColor, fontSize: 11 }, icon: "roundRect", itemWidth: 12, itemHeight: 8 };
}

function tooltipCommon() {
  const t = themeColors();
  return { trigger: "axis", backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, textStyle: { color: t.tooltipText, fontSize: 12 } };
}

function initChart(id) {
  return echarts.init(document.getElementById(id));
}

// ── Chart Instances ──

const charts = {};

function buildCharts() {
  const { LABELS, barData, lineData, areaData, pieData, radarData, radarDataB,
          multiLineData, stackedData, scatterSets, STACK_LABELS } = DATA;
  const t = themeColors();

  charts.bar = initChart("chart-bar");
  charts.bar.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item" },
    xAxis: { type: "category", data: LABELS, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: [{ type: "bar", data: barData.map((v, i) => ({ value: v, itemStyle: { color: c(i) } })), barWidth: "55%", itemStyle: { borderRadius: [4, 4, 0, 0] } }],
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
  });

  charts.barH = initChart("chart-bar-h");
  charts.barH.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item" },
    xAxis: { type: "value", ...axisCommon() },
    yAxis: { type: "category", data: LABELS, inverse: true, ...axisCommon() },
    series: [{ type: "bar", data: barData.map((v, i) => ({ value: v, itemStyle: { color: c(i) } })), barWidth: "55%", itemStyle: { borderRadius: [0, 4, 4, 0] } }],
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
  });

  charts.line = initChart("chart-line");
  charts.line.setOption({
    tooltip: tooltipCommon(),
    xAxis: { type: "category", data: LABELS, boundaryGap: false, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: [{ type: "line", data: lineData, smooth: 0.35, lineStyle: { color: c(0), width: 2.5 }, itemStyle: { color: c(0) }, symbolSize: 6 }],
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
  });

  charts.area = initChart("chart-area-chart");
  charts.area.setOption({
    tooltip: tooltipCommon(),
    xAxis: { type: "category", data: LABELS, boundaryGap: false, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: [{ type: "line", data: areaData, smooth: 0.4, lineStyle: { color: c(2), width: 2 }, itemStyle: { color: c(2) }, areaStyle: { color: cAlpha(2, 0.18) }, symbol: "none" }],
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
  });

  charts.pie = initChart("chart-pie");
  charts.pie.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { ...legendCommon(true), orient: "vertical", right: 8, top: "middle" },
    series: [{
      type: "pie", radius: "70%", center: ["40%", "50%"],
      data: LABELS.map((label, i) => ({ value: pieData[i], name: label, itemStyle: { color: c(i) } })),
      label: { show: true, color: t.textColor, fontSize: 11, formatter: "{b}\n{d}%" },
      labelLine: { lineStyle: { color: t.textColor } },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" }, label: { fontSize: 13, fontWeight: "bold" } },
      itemStyle: { borderColor: t.pieBorder, borderWidth: 2 },
      animationType: "scale", animationEasing: "elasticOut",
    }],
  });

  const doughnutData = pieData.map(v => v + 5);
  charts.doughnut = initChart("chart-doughnut");
  charts.doughnut.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { ...legendCommon(true), orient: "vertical", right: 8, top: "middle" },
    series: [{
      type: "pie", radius: ["45%", "75%"], center: ["40%", "50%"],
      data: LABELS.map((label, i) => ({ value: doughnutData[i], name: label, itemStyle: { color: c(i) } })),
      label: { show: true, color: t.textColor, fontSize: 11, formatter: "{b}\n{d}%" },
      labelLine: { lineStyle: { color: t.textColor } },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" }, label: { fontSize: 13, fontWeight: "bold" } },
      itemStyle: { borderColor: t.pieBorder, borderWidth: 2 },
      animationType: "scale", animationEasing: "elasticOut",
    }],
  });

  charts.radar = initChart("chart-radar");
  charts.radar.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item" },
    legend: { ...legendCommon(true), bottom: 4 },
    radar: {
      indicator: LABELS.map(l => ({ name: l, max: 100 })), shape: "circle",
      axisName: { color: t.textColor, fontSize: 10 },
      splitArea: { areaStyle: { color: "transparent" } },
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLine: { lineStyle: { color: t.splitLine } },
    },
    series: [{
      type: "radar",
      data: [
        { value: radarData, name: "Series A", lineStyle: { color: c(0), width: 2 }, areaStyle: { color: cAlpha(0, 0.15) }, itemStyle: { color: c(0) }, symbol: "circle", symbolSize: 5 },
        { value: radarDataB, name: "Series B", lineStyle: { color: c(1), width: 2 }, areaStyle: { color: cAlpha(1, 0.15) }, itemStyle: { color: c(1) }, symbol: "circle", symbolSize: 5 },
      ],
    }],
  });

  charts.polar = initChart("chart-polar");
  charts.polar.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item", formatter: "{b}: {c}" },
    series: [{
      type: "pie", roseType: "area", radius: ["12%", "70%"], center: ["50%", "50%"],
      data: LABELS.map((label, i) => ({ value: pieData[i], name: label, itemStyle: { color: cAlpha(i, 0.75) } })),
      label: { show: true, color: t.textColor, fontSize: 10 },
      labelLine: { lineStyle: { color: t.textColor } },
      itemStyle: { borderColor: t.pieBorder, borderWidth: 2 },
      animationType: "scale", animationEasing: "elasticOut",
    }],
  });

  charts.scatter = initChart("chart-scatter");
  charts.scatter.setOption({
    tooltip: { ...tooltipCommon(), trigger: "item", formatter: (p) => `${p.seriesName}<br/>x: ${p.value[0]}, y: ${p.value[1]}` },
    legend: { ...legendCommon(true), bottom: 4 },
    xAxis: { type: "value", ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: scatterSets.map((pts, i) => ({
      type: "scatter", name: `Group ${i + 1}`, data: pts.map(p => [p.x, p.y]),
      symbolSize: 10, itemStyle: { color: cAlpha(i, 0.7), borderColor: c(i), borderWidth: 1.5 },
    })),
    grid: { left: 40, right: 16, top: 16, bottom: 36 },
  });

  charts.stacked = initChart("chart-stacked");
  charts.stacked.setOption({
    tooltip: { ...tooltipCommon(), trigger: "axis" },
    legend: { ...legendCommon(true), bottom: 4 },
    xAxis: { type: "category", data: LABELS, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: stackedData.map((d, i) => ({
      type: "bar", name: `Series ${i + 1}`, data: d, stack: "total",
      itemStyle: { color: c(i), borderRadius: i === stackedData.length - 1 ? [4, 4, 0, 0] : 0 }, barWidth: "50%",
    })),
    grid: { left: 40, right: 16, top: 16, bottom: 36 },
  });

  charts.multiline = initChart("chart-multiline");
  charts.multiline.setOption({
    tooltip: tooltipCommon(),
    legend: { ...legendCommon(true), bottom: 4 },
    xAxis: { type: "category", data: LABELS, boundaryGap: false, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: multiLineData.map((d, i) => ({
      type: "line", name: `Series ${i + 1}`, data: d, smooth: 0.35,
      lineStyle: { color: c(i), width: 2.5 }, itemStyle: { color: c(i) }, symbolSize: 5,
    })),
    grid: { left: 40, right: 16, top: 16, bottom: 36 },
  });

  charts.mixed = initChart("chart-mixed");
  charts.mixed.setOption({
    tooltip: tooltipCommon(),
    legend: { ...legendCommon(true), bottom: 4 },
    xAxis: { type: "category", data: LABELS, ...axisCommon() },
    yAxis: { type: "value", ...axisCommon() },
    series: [
      { type: "bar", name: "Revenue", data: barData.map((v, i) => ({ value: v, itemStyle: { color: cAlpha(i, 0.55) } })), barWidth: "50%", itemStyle: { borderRadius: [4, 4, 0, 0] }, z: 1 },
      { type: "line", name: "Trend", data: lineData, smooth: 0.35, lineStyle: { color: c(4), width: 2.5 }, itemStyle: { color: c(4) }, symbolSize: 6, z: 2 },
    ],
    grid: { left: 40, right: 16, top: 16, bottom: 36 },
  });
}

// ── Recolor ──

function recolorCharts() {
  syncPalette();
  const { LABELS, barData, lineData, pieData, radarData, radarDataB,
          multiLineData, stackedData, scatterSets } = DATA;

  charts.bar.setOption({ series: [{ data: barData.map((v, i) => ({ value: v, itemStyle: { color: c(i) } })) }] });
  charts.barH.setOption({ series: [{ data: barData.map((v, i) => ({ value: v, itemStyle: { color: c(i) } })) }] });
  charts.line.setOption({ series: [{ lineStyle: { color: c(0) }, itemStyle: { color: c(0) } }] });
  charts.area.setOption({ series: [{ lineStyle: { color: c(2) }, itemStyle: { color: c(2) }, areaStyle: { color: cAlpha(2, 0.18) } }] });
  charts.pie.setOption({ series: [{ data: LABELS.map((label, i) => ({ value: pieData[i], name: label, itemStyle: { color: c(i) } })) }] });
  const doughnutData = pieData.map(v => v + 5);
  charts.doughnut.setOption({ series: [{ data: LABELS.map((label, i) => ({ value: doughnutData[i], name: label, itemStyle: { color: c(i) } })) }] });
  charts.radar.setOption({ series: [{ data: [
    { value: radarData, name: "Series A", lineStyle: { color: c(0) }, areaStyle: { color: cAlpha(0, 0.15) }, itemStyle: { color: c(0) } },
    { value: radarDataB, name: "Series B", lineStyle: { color: c(1) }, areaStyle: { color: cAlpha(1, 0.15) }, itemStyle: { color: c(1) } },
  ] }] });
  charts.polar.setOption({ series: [{ data: LABELS.map((label, i) => ({ value: pieData[i], name: label, itemStyle: { color: cAlpha(i, 0.75) } })) }] });
  charts.scatter.setOption({ series: scatterSets.map((pts, i) => ({ itemStyle: { color: cAlpha(i, 0.7), borderColor: c(i) } })) });
  charts.stacked.setOption({ series: stackedData.map((d, i) => ({ itemStyle: { color: c(i), borderRadius: i === stackedData.length - 1 ? [4, 4, 0, 0] : 0 } })) });
  charts.multiline.setOption({ series: multiLineData.map((d, i) => ({ lineStyle: { color: c(i) }, itemStyle: { color: c(i) } })) });
  charts.mixed.setOption({ series: [
    { data: barData.map((v, i) => ({ value: v, itemStyle: { color: cAlpha(i, 0.55) } })) },
    { lineStyle: { color: c(4) }, itemStyle: { color: c(4) } },
  ] });
}

// ── Resize Handler ──

function resizeAllCharts() {
  Object.values(charts).forEach(ch => ch.resize());
}

window.addEventListener("resize", resizeAllCharts);

new ResizeObserver(resizeAllCharts).observe(document.getElementById("chart-grid"));

// ═══════════════════════════════════════
//  UI: Active Slots
// ═══════════════════════════════════════

let dragSourceType = null;
let dragPayload = null;
let dragSlotIndex = null;

function renderSlots() {
  const container = document.getElementById("active-slots");
  container.innerHTML = "";

  slots.forEach((entry, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "slot" + (entry ? " filled" : "");
    wrapper.dataset.index = i;

    const colorDiv = document.createElement("div");
    colorDiv.className = "slot-color";
    if (entry) colorDiv.style.background = entry.hex;

    // Drop target (on the color square)
    colorDiv.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      colorDiv.classList.add("drag-over");
    });
    colorDiv.addEventListener("dragleave", () => colorDiv.classList.remove("drag-over"));
    colorDiv.addEventListener("drop", (e) => {
      e.preventDefault();
      colorDiv.classList.remove("drag-over");
      let data;
      try { data = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { return; }
      if (!data || !data.hex) return;

      if (dragSourceType === "slot" && dragSlotIndex !== null && dragSlotIndex !== i) {
        const tmp = slots[i];
        slots[i] = slots[dragSlotIndex];
        slots[dragSlotIndex] = tmp;
      } else {
        slots[i] = { hex: data.hex, label: data.label || shorthandFor(data.hex) };
      }
      renderSlots();
      recolorCharts();
    });

    if (entry) {
      colorDiv.draggable = true;
      colorDiv.addEventListener("dragstart", (e) => {
        dragSourceType = "slot";
        dragPayload = entry;
        dragSlotIndex = i;
        e.dataTransfer.setData("text/plain", JSON.stringify(entry));
        e.dataTransfer.effectAllowed = "move";
        requestAnimationFrame(() => colorDiv.classList.add("dragging-source"));
      });
      colorDiv.addEventListener("dragend", () => {
        colorDiv.classList.remove("dragging-source");
        dragSourceType = null;
        dragPayload = null;
        dragSlotIndex = null;
      });

      const clearBtn = document.createElement("button");
      clearBtn.className = "slot-clear";
      clearBtn.textContent = "×";
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        slots[i] = null;
        renderSlots();
        recolorCharts();
      });
      colorDiv.appendChild(clearBtn);
    }

    const labelSpan = document.createElement("span");
    labelSpan.className = "slot-label";
    labelSpan.textContent = entry ? (entry.label || "") : "";

    wrapper.appendChild(colorDiv);
    wrapper.appendChild(labelSpan);
    container.appendChild(wrapper);
  });
}

// ═══════════════════════════════════════
//  UI: SE Palettes (all expanded, horizontal rows)
// ═══════════════════════════════════════

const selectedPerPalette = {};
Object.keys(SE_PALETTES).forEach(name => { selectedPerPalette[name] = new Set(); });

function renderSEPalettes() {
  const container = document.getElementById("se-palettes");
  container.innerHTML = "";

  Object.entries(SE_PALETTES).forEach(([name, colors]) => {
    const prefix = SE_PREFIXES[name];
    const block = document.createElement("div");
    block.className = "se-palette-block";

    // Header
    const header = document.createElement("div");
    header.className = "se-palette-header";

    const h3 = document.createElement("h3");
    h3.textContent = name;

    const actions = document.createElement("div");
    actions.className = "se-header-actions";

    const addSelBtn = document.createElement("button");
    addSelBtn.className = "se-add-all";
    addSelBtn.textContent = "Add Selected";
    addSelBtn.addEventListener("click", () => {
      const sel = selectedPerPalette[name];
      if (sel.size === 0) return;
      const sorted = [...sel].sort((a, b) => a - b);
      sorted.forEach(idx => {
        const sh = `${prefix}${idx + 1}`;
        addColorToNextSlot(colors[idx], sh);
      });
      sel.clear();
      renderSEPalettes();
      renderSlots();
      recolorCharts();
    });

    const addAllBtn = document.createElement("button");
    addAllBtn.className = "se-add-all";
    addAllBtn.textContent = "Add All";
    addAllBtn.addEventListener("click", () => {
      colors.forEach((hex, idx) => {
        addColorToNextSlot(hex, `${prefix}${idx + 1}`);
      });
      renderSlots();
      recolorCharts();
    });

    actions.appendChild(addSelBtn);
    actions.appendChild(addAllBtn);
    header.appendChild(h3);
    header.appendChild(actions);
    block.appendChild(header);

    const row = document.createElement("div");
    row.className = "se-color-list";

    colors.forEach((hex, i) => {
      const sh = `${prefix}${i + 1}`;
      const swatch = document.createElement("div");
      swatch.className = "source-swatch";
      if (selectedPerPalette[name].has(i)) swatch.classList.add("selected");
      swatch.draggable = true;

      const chip = document.createElement("div");
      chip.className = "color-chip";
      chip.style.background = hex;

      const textWrap = document.createElement("div");
      textWrap.className = "swatch-text";

      const shLabel = document.createElement("span");
      shLabel.className = "shorthand-label";
      shLabel.textContent = sh;

      const hexLabel = document.createElement("span");
      hexLabel.className = "hex-label";
      hexLabel.textContent = hex.toUpperCase();

      textWrap.appendChild(shLabel);
      textWrap.appendChild(hexLabel);

      swatch.appendChild(chip);
      swatch.appendChild(textWrap);

      // Drag
      swatch.addEventListener("dragstart", (e) => {
        dragSourceType = "source";
        dragPayload = { hex, label: sh };
        dragSlotIndex = null;
        e.dataTransfer.setData("text/plain", JSON.stringify({ hex, label: sh }));
        e.dataTransfer.effectAllowed = "copy";
      });
      swatch.addEventListener("dragend", () => {
        dragSourceType = null;
        dragPayload = null;
      });

      // Click
      swatch.addEventListener("click", (e) => {
        if (e.shiftKey || e.metaKey || e.ctrlKey) {
          const sel = selectedPerPalette[name];
          if (sel.has(i)) sel.delete(i);
          else sel.add(i);
          renderSEPalettes();
        } else {
          addColorToNextSlot(hex, sh);
          renderSlots();
          recolorCharts();
        }
      });

      row.appendChild(swatch);
    });

    block.appendChild(row);
    container.appendChild(block);
  });
}

// ═══════════════════════════════════════
//  UI: Presets
// ═══════════════════════════════════════

function renderPresets() {
  const container = document.getElementById("preset-list");
  container.innerHTML = "";

  Object.entries(PRESETS).forEach(([name, colors]) => {
    const btn = document.createElement("button");
    btn.className = "preset-btn";

    const dots = document.createElement("span");
    dots.className = "preset-dots";
    colors.slice(0, 6).forEach(hex => {
      const dot = document.createElement("span");
      dot.className = "preset-dot";
      dot.style.background = hex;
      dots.appendChild(dot);
    });

    const label = document.createElement("span");
    label.className = "preset-name";
    label.textContent = name;

    btn.appendChild(dots);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      colors.forEach(hex => addColorToNextSlot(hex, null));
      renderSlots();
      recolorCharts();
    });

    container.appendChild(btn);
  });
}

// ═══════════════════════════════════════
//  Slot Helpers
// ═══════════════════════════════════════

function addColorToNextSlot(hex, label) {
  const entry = { hex, label: label || shorthandFor(hex) || null };
  const emptyIdx = slots.indexOf(null);
  if (emptyIdx !== -1) {
    slots[emptyIdx] = entry;
  } else {
    slots.push(entry);
  }
}

// ═══════════════════════════════════════
//  Saved Sets (localStorage + JSON export/import)
// ═══════════════════════════════════════

const STORAGE_KEY = "chartColorTester_savedSets";

function loadSavedSets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveSetsToStorage(sets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
}

function saveCurrentSet() {
  const filled = slots.filter(s => s !== null);
  if (filled.length === 0) return;
  const name = prompt("Name this set:");
  if (!name || !name.trim()) return;
  const sets = loadSavedSets();
  sets.push({ name: name.trim(), slots: slots.slice() });
  saveSetsToStorage(sets);
  renderSavedSets();
}

function loadSet(index) {
  const sets = loadSavedSets();
  const set = sets[index];
  if (!set) return;
  slots = set.slots.map(s => s ? { hex: s.hex, label: s.label || null } : null);
  renderSlots();
  recolorCharts();
}

function deleteSet(index) {
  const sets = loadSavedSets();
  sets.splice(index, 1);
  saveSetsToStorage(sets);
  renderSavedSets();
}

function exportSets() {
  const sets = loadSavedSets();
  if (sets.length === 0) { alert("No saved sets to export."); return; }
  const blob = new Blob([JSON.stringify(sets, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "color-sets.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importSets() {
  document.getElementById("import-file").click();
}

document.getElementById("import-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      const existing = loadSavedSets();
      const merged = existing.concat(imported);
      saveSetsToStorage(merged);
      renderSavedSets();
    } catch {
      alert("Invalid JSON file. Expected an array of saved sets.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

function renderSavedSets() {
  const container = document.getElementById("saved-sets-list");
  container.innerHTML = "";
  const sets = loadSavedSets();

  if (sets.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "font-size:0.82rem;color:var(--text-muted);padding:4px 0;";
    empty.textContent = "No saved sets yet.";
    container.appendChild(empty);
    return;
  }

  sets.forEach((set, idx) => {
    const item = document.createElement("div");
    item.className = "saved-set-item";

    const dots = document.createElement("span");
    dots.className = "saved-set-dots";
    const filled = (set.slots || []).filter(s => s !== null);
    filled.slice(0, 8).forEach(s => {
      const dot = document.createElement("span");
      dot.className = "saved-set-dot";
      dot.style.background = s.hex;
      dots.appendChild(dot);
    });
    if (filled.length > 8) {
      const more = document.createElement("span");
      more.style.cssText = "font-size:0.7rem;color:var(--text-muted);align-self:center;";
      more.textContent = `+${filled.length - 8}`;
      dots.appendChild(more);
    }

    const nameSpan = document.createElement("span");
    nameSpan.className = "saved-set-name";
    nameSpan.textContent = set.name;

    const actions = document.createElement("span");
    actions.className = "saved-set-actions";

    const loadBtn = document.createElement("button");
    loadBtn.title = "Load this set";
    loadBtn.textContent = "↗";
    loadBtn.addEventListener("click", () => loadSet(idx));

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.title = "Delete this set";
    delBtn.textContent = "×";
    delBtn.addEventListener("click", () => {
      if (confirm(`Delete "${set.name}"?`)) deleteSet(idx);
    });

    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);

    item.appendChild(dots);
    item.appendChild(nameSpan);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

document.getElementById("btn-save-set").addEventListener("click", saveCurrentSet);
document.getElementById("btn-export").addEventListener("click", exportSets);
document.getElementById("btn-import").addEventListener("click", importSets);

// ═══════════════════════════════════════
//  Slot Action Buttons
// ═══════════════════════════════════════

document.getElementById("btn-add-slot").addEventListener("click", () => {
  slots.push(null);
  renderSlots();
});

document.getElementById("btn-remove-slot").addEventListener("click", () => {
  if (slots.length > 1) {
    slots.pop();
    renderSlots();
    recolorCharts();
  }
});

document.getElementById("btn-clear-slots").addEventListener("click", () => {
  slots = slots.map(() => null);
  renderSlots();
  recolorCharts();
});

// ═══════════════════════════════════════
//  Theme Toggle
// ═══════════════════════════════════════

function rebuildAllCharts() {
  Object.values(charts).forEach(ch => ch.dispose());
  Object.keys(charts).forEach(k => delete charts[k]);
  buildCharts();
}

document.getElementById("btn-theme").addEventListener("click", () => {
  isDark = !isDark;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.getElementById("btn-theme").textContent = isDark ? "Light" : "Dark";
  rebuildAllCharts();
});

// ═══════════════════════════════════════
//  Density Toggle
// ═══════════════════════════════════════

document.getElementById("density-toggle").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-density]");
  if (!btn) return;
  currentDensity = btn.dataset.density;
  document.querySelectorAll("#density-toggle button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  generateData();
  rebuildAllCharts();
});

// ═══════════════════════════════════════
//  Init
// ═══════════════════════════════════════

document.documentElement.setAttribute("data-theme", "light");
document.getElementById("btn-theme").textContent = "Dark";
renderSlots();
renderSEPalettes();
renderPresets();
renderSavedSets();
syncPalette();
buildCharts();
