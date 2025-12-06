// Base pattern interface and utilities
// All pattern modules should implement this interface

/**
 * Base pattern interface
 * Each pattern module should export:
 * - generateTurns(numStates) -> Array of 'L' or 'R'
 * - initTurmites(W, H) -> Array of {x, y, dir}
 * - getConfig() -> {initType, numTurmites}
 * - getBaseHue() -> number (0-360)
 */

// Helper function for HSL to HEX conversion
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate colors based on pattern's base hue
export function generateColors(numStates, baseHue) {
  const colors = ['#000000']; // Always start with black background
  
  // Generate colors evenly distributed in HSL space
  for (let i = 0; i < numStates - 1; i++) {
    const hue = (baseHue + (i * 360 / (numStates - 1))) % 360;
    const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
    const lightness = 40 + (i * 10); // Increasing lightness
    colors.push(hslToHex(hue, saturation, Math.min(lightness, 80)));
  }
  
  return colors;
}

