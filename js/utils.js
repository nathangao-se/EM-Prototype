// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate an SVG sparkline from an array of values
 * @param {number[]} values - Array of numeric values (5 time periods recommended)
 * @param {string} color - Stroke color for the line
 * @returns {string} SVG markup string
 */
function generateSparkline(values, color) {
  const width = 60;
  const height = 24;
  const padding = 2;
  const maxVal = Math.max(...values.map(Math.abs), 1);
  const midY = height / 2;
  
  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = midY - (val / maxVal) * (height / 2 - padding);
    return `${x},${y}`;
  }).join(' ');
  
  return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <line x1="${padding}" y1="${midY}" x2="${width - padding}" y2="${midY}" stroke="#dfe7eb" stroke-width="1"/>
    <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}"/>
  </svg>`;
}

/**
 * Get sparkline color based on change direction
 * @param {string} changeDir - 'up', 'down', or 'neutral'
 * @returns {string} Hex color code
 */
function getSparklineColor(changeDir) {
  if (changeDir === 'up') return '#dc2626';
  if (changeDir === 'down') return '#008029';
  return '#676f73';
}
