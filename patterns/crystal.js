// Crystal pattern module
// Creates dense, blocky, city-like structures

import { generateColors } from './base.js';

/**
 * Generate turn sequence for Crystal pattern
 * logic: "Room Builder"
 * Use sequences of R's to build walls, separated by L's to turn corners.
 * This tends to create dense, growing geometric shapes.
 */
export function generateTurns(numStates) {
    const turns = [];

    // Crystal Logic:
    // Build "Rooms" of size 2-5
    // e.g. RRR L RRR L ...

    let steps = 0;
    while (steps < numStates) {
        // 1. Build a wall (Right turns)
        const wallLen = 2 + Math.floor(Math.random() * 4); // 2-5
        for (let i = 0; i < wallLen && steps < numStates; i++) {
            turns.push('R');
            steps++;
        }

        // 2. Turn a corner (Left)
        if (steps < numStates) {
            turns.push('L');
            steps++;
        }

        // 3. Occasional "Doorway" (Double Left = U-turn)
        if (steps < numStates && Math.random() < 0.3) {
            turns.push('L'); // Second L makes a U-turn
            steps++;
        }
    }

    console.log(`Generated Crystal Rule (${numStates}):`, turns.join(''));
    return turns;
}

/**
 * Initialize turmites for Crystal pattern
 * start with 4 turmites in a cross formation to encourage "city" growth
 */
export function initTurmites(W, H) {
    const cx = Math.floor(W / 2);
    const cy = Math.floor(H / 2);
    const offset = 4;

    return [
        { x: cx, y: cy - offset, dir: 0 }, // North
        { x: cx + offset, y: cy, dir: 1 }, // East
        { x: cx, y: cy + offset, dir: 2 }, // South
        { x: cx - offset, y: cy, dir: 3 }  // West
    ];
}

export function getConfig() {
    return {
        initType: 'center_cross',
        numTurmites: 4
    };
}

export function getBaseHue() {
    return 30; // Amber/Gold/Orange colors for "Crystal" feel
}

export function getColors(numStates) {
    return generateColors(numStates, getBaseHue());
}
