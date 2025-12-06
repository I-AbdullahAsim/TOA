// Pattern registry
// Central registry for all pattern modules

import * as spiral from './spiral.js';
import * as symmetric from './symmetric.js';
import * as maze from './maze.js';
import * as fractal from './fractal.js';
import * as random from './random.js';
import * as crystal from './crystal.js';
import * as weaver from './weaver.js';

/**
 * Pattern registry
 * Maps pattern names to their modules
 */
export const PATTERNS = {
  spiral,
  symmetric,
  maze,
  fractal,
  crystal,
  weaver,
  random
};

/**
 * Get pattern module by name
 */
export function getPattern(patternName) {
  return PATTERNS[patternName] || PATTERNS.random;
}

/**
 * Check if pattern exists
 */
export function hasPattern(patternName) {
  return patternName in PATTERNS;
}

/**
 * Get all available pattern names
 */
export function getPatternNames() {
  return Object.keys(PATTERNS);
}
