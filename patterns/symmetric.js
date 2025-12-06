// Symmetric pattern module
// Creates symmetric mandala-like patterns with multiple turmites

import { generateColors } from './base.js';

/**
 * Generate turn sequence for symmetric pattern
 * Alternating pattern creates symmetry
 */
export function generateTurns(numStates) {
  const turns = [];
  
  // Symmetric: Alternating pattern creates symmetry
  for (let i = 0; i < numStates; i++) {
    turns.push(i % 2 === 0 ? 'L' : 'R');
  }
  
  // Add slight variation
  for (let i = 0; i < Math.floor(numStates * 0.2); i++) {
    const idx = Math.floor(Math.random() * numStates);
    turns[idx] = turns[idx] === 'R' ? 'L' : 'R';
  }
  
  return turns;
}

/**
 * Initialize turmites for symmetric pattern
 * 4 turmites at corners, facing inward
 */
export function initTurmites(W, H) {
  const offset = Math.min(W, H) * 0.1; // 10% offset from edges
  
  // Symmetric: 4 turmites at corners, facing inward
  return [
    { x: offset, y: offset, dir: 1 },           // Top-left, facing East
    { x: W - 1 - offset, y: offset, dir: 2 },   // Top-right, facing South
    { x: W - 1 - offset, y: H - 1 - offset, dir: 3 }, // Bottom-right, facing West
    { x: offset, y: H - 1 - offset, dir: 0 }     // Bottom-left, facing North
  ];
}

/**
 * Get configuration for symmetric pattern
 */
export function getConfig() {
  return {
    initType: 'corners',
    numTurmites: 4
  };
}

/**
 * Get base hue for color generation (Greens)
 */
export function getBaseHue() {
  return 120; // Green
}

/**
 * Generate colors for symmetric pattern
 */
export function getColors(numStates) {
  return generateColors(numStates, getBaseHue());
}

