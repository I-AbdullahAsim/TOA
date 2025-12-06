// Maze pattern module
// Creates maze-like branching structures

import { generateColors } from './base.js';

/**
 * Generate turn sequence for maze pattern
 * Mixed pattern creates branching structures
 */
export function generateTurns(numStates) {
  const turns = [];
  
  // Maze: Mixed pattern creates branching structures
  // Use patterns that create paths
  const mazePatterns = [
    ['L', 'R', 'R', 'L', 'R'],
    ['L', 'R', 'L', 'R', 'R'],
    ['R', 'L', 'L', 'R', 'L'],
  ];
  const pattern = mazePatterns[Math.floor(Math.random() * mazePatterns.length)];
  
  for (let i = 0; i < numStates; i++) {
    turns.push(pattern[i % pattern.length]);
  }
  
  return turns;
}

/**
 * Initialize turmites for maze pattern
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
 * Get configuration for maze pattern
 */
export function getConfig() {
  return {
    initType: 'center',
    numTurmites: 1
  };
}

/**
 * Get base hue for color generation (Oranges)
 */
export function getBaseHue() {
  return 30; // Orange
}

/**
 * Generate colors for maze pattern
 */
export function getColors(numStates) {
  return generateColors(numStates, getBaseHue());
}

