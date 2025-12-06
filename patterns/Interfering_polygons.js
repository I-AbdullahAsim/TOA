// Spiral pattern module
// Creates expanding spiral patterns

import { generateColors } from './base.js';

/**
 * Generate turn sequence for spiral pattern
 * Uses "Interfering Polygon" Logic.
 * Rule: (N-1) Rights, 1 Left.
 * GUARANTEES a spiral shape (Triangle, Square, etc.) that expands.
 */
export function generateTurns(numStates) {
  const turns = [];

  // 1. Build the Polygon Rule
  // Push (N-1) 'R's
  for (let i = 0; i < numStates - 1; i++) {
    turns.push('R');
  }

  // Push 1 'L' (The "Corner" of the polygon)
  if (turns.length < numStates) {
    turns.push('L');
  } else {
    turns[numStates - 1] = 'L';
  }

  // Log for debugging
  console.log(`Generated Polygon Rule (${numStates}):`, turns.join(''));

  return turns;
}

/**
 * Initialize turmites for spiral pattern
 * "Interfering Spirals": Spawn 1 to 5 turmites close together.
 * Their collisions create unique "Interference Patterns" 
 * while adhering to the overall spiral expansion.
 */
export function initTurmites(W, H) {
  const centerX = Math.floor(W / 2);
  const centerY = Math.floor(H / 2);

  // Random number of turmites (1 to 5)
  // 1 = Perfect geometric spiral
  // 5 = Complex chaotic spiral
  const numTurmites = 1 + Math.floor(Math.random() * 5);

  const turmites = [];

  for (let i = 0; i < numTurmites; i++) {
    // Tight cluster in the center
    const spread = 5 + Math.floor(Math.random() * 10); // 5-15px spread
    const x = centerX + Math.floor(Math.random() * spread) - spread / 2;
    const y = centerY + Math.floor(Math.random() * spread) - spread / 2;
    const dir = Math.floor(Math.random() * 4);

    turmites.push({ x, y, dir });
  }

  return turmites;
}

/**
 * Get configuration for spiral pattern
 */
export function getConfig() {
  return {
    initType: 'center',
    numTurmites: 1 // This is just a hint, we return more in initTurmites
  };
}

/**
 * Get base hue for color generation (Blues)
 */
export function getBaseHue() {
  return 200; // Blue
}

/**
 * Generate colors for spiral pattern
 */
export function getColors(numStates) {
  return generateColors(numStates, getBaseHue());
}
