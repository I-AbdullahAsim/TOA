// Fractal pattern module
// Creates self-similar, recursive-looking patterns

import { generateColors } from './base.js';

/**
 * Generate turn sequence for fractal pattern
 * Groups of same direction create self-similar patterns
 */
export function generateTurns(numStates) {
  const turns = [];
  
  // Fractal: Groups of same direction create self-similar patterns
  const groupSize = 2 + Math.floor(Math.random() * 3); // 2-4
  let currentTurn = Math.random() < 0.5 ? 'R' : 'L';
  
  for (let i = 0; i < numStates; i++) {
    if (i % groupSize === 0 && i > 0) {
      currentTurn = currentTurn === 'R' ? 'L' : 'R';
    }
    turns.push(currentTurn);
  }
  
  return turns;
}

/**
 * Initialize turmites for fractal pattern
 * Single turmite at center with slight randomization
 */
export function initTurmites(W, H) {
  const centerX = Math.floor(W / 2);
  const centerY = Math.floor(H / 2);
  
  // Add slight randomization to starting position and direction for variety
  const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2 pixels
  const initialDir = Math.floor(Math.random() * 4); // Random direction
  
  return [{ 
    x: centerX + jitter, 
    y: centerY + jitter, 
    dir: initialDir 
  }];
}

/**
 * Get configuration for fractal pattern
 */
export function getConfig() {
  return {
    initType: 'center',
    numTurmites: 1
  };
}

/**
 * Get base hue for color generation (Magenta)
 */
export function getBaseHue() {
  return 280; // Magenta
}

/**
 * Generate colors for fractal pattern
 */
export function getColors(numStates) {
  return generateColors(numStates, getBaseHue());
}

