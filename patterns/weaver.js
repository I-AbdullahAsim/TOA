// Weaver pattern module
// Creates textile-like highway patterns

import { generateColors } from './base.js';

/**
 * Generate turn sequence for Weaver pattern
 * Logic: "Lane Shifting"
 * Base pattern is alternating R/L (Highway).
 * Periodic mutations (RR or LL) shift the highway's direction.
 */
export function generateTurns(numStates) {
    const turns = [];

    // Base: Alternating (Highway)
    for (let i = 0; i < numStates; i++) {
        turns.push(i % 2 === 0 ? 'R' : 'L');
    }

    // Mutate: "Shift Lanes"
    // Swap about 20% of turns to break the straight line
    const numMutations = Math.max(1, Math.floor(numStates * 0.25));

    for (let i = 0; i < numMutations; i++) {
        const idx = Math.floor(Math.random() * numStates);
        // Flip it
        turns[idx] = turns[idx] === 'R' ? 'L' : 'R';
    }

    console.log(`Generated Weaver Rule (${numStates}):`, turns.join(''));
    return turns;
}

/**
 * Initialize turmites for Weaver pattern
 * Line of turmites to create a "Loom" effect
 */
export function initTurmites(W, H) {
    const cx = Math.floor(W / 2);
    const cy = Math.floor(H / 2);
    const spacing = 10;

    const turmites = [];
    // Create a row of 5 turmites
    for (let i = -2; i <= 2; i++) {
        turmites.push({
            x: cx + (i * spacing),
            y: cy,
            dir: i % 2 === 0 ? 0 : 2 // Facing North/South alternately
        });
    }

    return turmites;
}

export function getConfig() {
    return {
        initType: 'loom',
        numTurmites: 5
    };
}

export function getBaseHue() {
    return 160; // Teal/Cyan colors
}

export function getColors(numStates) {
    return generateColors(numStates, getBaseHue());
}
