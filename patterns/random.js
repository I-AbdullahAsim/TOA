// Random pattern module
// Creates chaotic patterns (classic Langton's ant style)

import { generateColors } from './base.js';

/**
 * Generate turn sequence for random pattern
 * Truly random pattern
 */
export function generateTurns(numStates) {
  const turns = [];
  
  // Random: Truly random
  for (let i = 0; i < numStates; i++) {
    turns.push(Math.random() < 0.5 ? 'L' : 'R');
  }
  
  return turns;
}

/**
 * Initialize turmites for random pattern
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
 * Get configuration for random pattern
 */
export function getConfig() {
  return {
    initType: 'center',
    numTurmites: 1
  };
}

/**
 * Get base hue for color generation (Random)
 */
export function getBaseHue() {
  return Math.floor(Math.random() * 360);
}

/**
 * Generate colors for random pattern
 */
export function getColors(numStates) {
  return generateColors(numStates, getBaseHue());
}

