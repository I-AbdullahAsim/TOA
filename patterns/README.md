# Patterns Module

This directory contains modular pattern implementations for the Turing Drawings project. Each pattern type is separated into its own file, making it easy to work on one pattern without affecting others.

## Structure

- `base.js` - Base utilities and color generation functions
- `spiral.js` - Spiral pattern implementation
- `symmetric.js` - Symmetric/mandala pattern implementation
- `maze.js` - Maze pattern implementation
- `fractal.js` - Fractal pattern implementation
- `random.js` - Random/chaotic pattern implementation
- `index.js` - Pattern registry and exports

## Pattern Interface

Each pattern module exports the following functions:

### `generateTurns(numStates)`
Generates a turn sequence array of 'L' (left) or 'R' (right) based on the number of states.

**Parameters:**
- `numStates` (number): Number of states (2-10)

**Returns:**
- Array of 'L' or 'R' strings

### `initTurmites(W, H)`
Initializes turmites for the pattern.

**Parameters:**
- `W` (number): Canvas width
- `H` (number): Canvas height

**Returns:**
- Array of turmite objects: `[{x, y, dir}, ...]`

### `getConfig()`
Returns configuration for the pattern.

**Returns:**
- Object with `initType` and `numTurmites` properties

### `getBaseHue()`
Returns the base hue for color generation (0-360).

**Returns:**
- Number (0-360)

### `getColors(numStates)`
Generates colors for the pattern based on number of states.

**Parameters:**
- `numStates` (number): Number of states

**Returns:**
- Array of hex color strings

## Adding a New Pattern

1. Create a new file in this directory (e.g., `newpattern.js`)
2. Import base utilities: `import { generateColors } from './base.js';`
3. Implement all required functions (see interface above)
4. Export the functions
5. Add the pattern to `index.js` registry

## Example: Working on Spiral Pattern

To modify the spiral pattern, simply edit `spiral.js`:

```javascript
// patterns/spiral.js
export function generateTurns(numStates) {
  // Your spiral-specific logic here
  // Changes here won't affect maze, fractal, or symmetric patterns
}
```

The main engine (`turmite.js`) will automatically use your changes.

