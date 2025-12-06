# Turmite (2D Turing Machine) Visual Representation

This document contains visual representations of the Turmite implementation in the codebase.

## Overview

The code implements a **2D Turmite** (also called a "Langton's Ant" variant), which is a type of cellular automaton that acts like a 2D Turing machine. Unlike traditional 1D Turing machines that move along a tape, turmites move on a 2D grid and can turn left or right based on the cell state they're standing on.

### Key Differences from Traditional Turing Machines:
- **2D Grid** instead of 1D tape
- **Movement** is forward in current direction (N/E/S/W)
- **Turning** happens before moving (L or R based on cell state)
- **State** is stored in grid cells, not in the machine head
- **Multiple turmites** can run simultaneously

## 1. State Transition Diagram

The core Turing machine logic: cell states and transitions

```mermaid
stateDiagram-v2
    [*] --> State0: Initialize Grid
    
    State0 --> State1: Read 0, Turn L/R, Write 1
    State1 --> State2: Read 1, Turn L/R, Write 2
    State2 --> State3: Read 2, Turn L/R, Write 3
    State3 --> State4: Read 3, Turn L/R, Write 4
    State4 --> State0: Read 4, Turn L/R, Write 0
    
    note right of State0
        State = 0
        Color = colors[0]
        Turn = turns[0]
        Write: (0+1) mod N
    end note
    
    note right of State1
        State = 1
        Color = colors[1]
        Turn = turns[1]
        Write: (1+1) mod N
    end note
    
    note right of State2
        State = 2
        Color = colors[2]
        Turn = turns[2]
        Write: (2+1) mod N
    end note
```

## 2. Turmite Algorithm Flowchart

Complete step-by-step process of a single turmite operation

```mermaid
flowchart TD
    Start([Start Turmite Step]) --> ReadCell["Read Cell State<br/>state = grid at position"]
    ReadCell --> GetColor["Get Color<br/>color = colors array"]
    GetColor --> Draw["Draw Pixel<br/>fillRect on canvas"]
    Draw --> GetTurn["Get Turn Direction<br/>turn = turns array"]
    GetTurn --> CheckTurn{Turn == R?}
    
    CheckTurn -->|Yes| TurnRight["Turn Right<br/>dir = dir + 1 mod 4"]
    CheckTurn -->|No| TurnLeft["Turn Left<br/>dir = dir - 1 mod 4"]
    
    TurnRight --> UpdateState["Update Cell State<br/>grid = state + 1 mod N"]
    TurnLeft --> UpdateState
    
    UpdateState --> MoveForward["Move Forward<br/>update x and y coordinates"]
    
    MoveForward --> CheckBounds{Check Boundaries}
    
    CheckBounds -->|x < 0| WrapX1["x = W - 1"]
    CheckBounds -->|x >= W| WrapX2["x = 0"]
    CheckBounds -->|y < 0| WrapY1["y = H - 1"]
    CheckBounds -->|y >= H| WrapY2["y = 0"]
    CheckBounds -->|In bounds| Continue
    
    WrapX1 --> Continue
    WrapX2 --> Continue
    WrapY1 --> Continue
    WrapY2 --> Continue
    
    Continue --> End([End Step])
    
    style Start fill:#2d7a3e
    style End fill:#2d7a3e
    style ReadCell fill:#4A90E2
    style Draw fill:#FF8C42
    style UpdateState fill:#8B5FBF
```

## 3. Direction State Machine

Turmite direction transitions (N=0, E=1, S=2, W=3)

```mermaid
stateDiagram-v2
    [*] --> North: dir = 0
    
    North --> East: Turn Right (R)
    North --> West: Turn Left (L)
    
    East --> South: Turn Right (R)
    East --> North: Turn Left (L)
    
    South --> West: Turn Right (R)
    South --> East: Turn Left (L)
    
    West --> North: Turn Right (R)
    West --> South: Turn Left (L)
    
    note right of North
        Direction: (0, -1)
        Move: Up
    end note
    
    note right of East
        Direction: (1, 0)
        Move: Right
    end note
    
    note right of South
        Direction: (0, 1)
        Move: Down
    end note
    
    note right of West
        Direction: (-1, 0)
        Move: Left
    end note
```

## 4. Complete Turmite System Architecture

High-level system view showing all components

```mermaid
graph TB
    subgraph "Pattern Module"
        Pattern["Pattern Module<br/>spiral/symmetric/maze/etc"]
        Pattern --> GenerateTurns["generateTurns numStates"]
        Pattern --> InitTurmites["initTurmites W, H"]
        Pattern --> GetColors["getColors numStates"]
    end
    
    subgraph "Turmite Engine"
        Engine["Turmite Engine"]
        Grid["2D Grid<br/>Uint8Array W×H"]
        Turmites["Turmites Array<br/>x, y, dir"]
        Rules["Turn Rules<br/>Array of L/R"]
        Palette["Color Palette<br/>Array of hex colors"]
    end
    
    subgraph "Execution Loop"
        Read["Read Cell State"]
        DrawOp["Draw Pixel"]
        Turn["Turn Direction"]
        Write["Write New State"]
        Move["Move Forward"]
        Wrap["Wrap Boundaries"]
    end
    
    subgraph "Display"
        CanvasDisplay["HTML5 Canvas<br/>800×800 default"]
    end
    
    Pattern --> Engine
    GenerateTurns --> Rules
    InitTurmites --> Turmites
    GetColors --> Palette
    
    Engine --> Grid
    Engine --> Turmites
    Engine --> Rules
    Engine --> Palette
    
    Engine --> Read
    Read --> DrawOp
    DrawOp --> Turn
    Turn --> Write
    Write --> Move
    Move --> Wrap
    Wrap --> Read
    
    DrawOp --> CanvasDisplay
    
    style Pattern fill:#4A90E2
    style Engine fill:#2d7a3e
    style CanvasDisplay fill:#FF8C42
```

## 5. Example: Spiral Pattern State Machine

Specific example with 4 states (typical spiral pattern)

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn R, Write 1
    S1 --> S2: Read 1, Turn R, Write 2
    S2 --> S3: Read 2, Turn R, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: R R R L
        (N-1) Rights, 1 Left
        Creates expanding polygon
        Move Forward after each step
    end note
    
    note right of S1
        Color: Blue shades
        Creates spiral arms
        State transitions: 0→1→2→3→0
    end note
```

## 6. Grid and Turmite Movement Visualization

```mermaid
graph LR
    subgraph "2D Toroidal Grid"
        G1["Cell 0,0"] --- G2["Cell 1,0"] --- G3["Cell 2,0"]
        G4["Cell 0,1"] --- G5["Cell 1,1"] --- G6["Cell 2,1"]
        G7["Cell 0,2"] --- G8["Cell 1,2"] --- G9["Cell 2,2"]
    end
    
    subgraph "Turmite State"
        T1["Turmite<br/>x, y, dir"]
        T2["Cell State<br/>0 to N-1"]
        T3["Direction<br/>N/E/S/W"]
    end
    
    T1 --> G5
    T2 --> G5
    T3 --> G5
    
    G5 -->|Read| T2
    G5 -->|Write| T2
    G5 -->|Move| G6
    
    style G5 fill:#FF8C42
    style T1 fill:#4A90E2
    style T2 fill:#8B5FBF
```

## 7. Complete Execution Cycle

```mermaid
sequenceDiagram
    participant UI as User Interface
    participant Engine as Turmite Engine
    participant Pattern as Pattern Module
    participant Grid as 2D Grid
    participant Canvas as HTML5 Canvas
    
    UI->>Engine: Start (mode, states, size)
    Engine->>Pattern: getPattern(mode)
    Pattern->>Engine: generateTurns(numStates)
    Pattern->>Engine: initTurmites(W, H)
    Pattern->>Engine: getColors(numStates)
    
    loop Each Frame (requestAnimationFrame)
        loop stepsPerFrame times
            Engine->>Grid: Read cell state at (x, y)
            Grid-->>Engine: state (0 to N-1)
            Engine->>Canvas: Draw pixel with color[state]
            Engine->>Engine: Get turn = turns[state]
            Engine->>Engine: Update direction (L/R)
            Engine->>Grid: Write (state + 1) mod N
            Engine->>Engine: Move forward
            Engine->>Engine: Wrap boundaries
        end
    end
    
    Engine-->>UI: Pattern complete
```

## Key Concepts

### State Transition Formula
```
New State = (Current State + 1) mod numStates
```

### Direction Update Formula
```
New Direction = (Current Direction + (turn == 'R' ? 1 : -1) + 4) mod 4
```

### Movement Formula
```
New Position = (x + DIRS[dir][0], y + DIRS[dir][1])
```

### Toroidal Wrapping
```
if x < 0: x = W - 1
if x >= W: x = 0
if y < 0: y = H - 1
if y >= H: y = 0
```

## 8. Turing Machine Table Representation

Traditional Turing machine transition table format

### Generic Turmite Transition Table

| Current State | Read Symbol | Write Symbol | Move Direction | Next State |
|--------------|-------------|--------------|----------------|------------|
| q₀ (State 0) | 0 | 1 | L or R | q₁ (State 1) |
| q₁ (State 1) | 1 | 2 | L or R | q₂ (State 2) |
| q₂ (State 2) | 2 | 3 | L or R | q₃ (State 3) |
| q₃ (State 3) | 3 | 0 | L or R | q₀ (State 0) |

**Note:** In this 2D Turmite implementation:
- **Read Symbol** = Current cell state (0 to N-1)
- **Write Symbol** = (Current state + 1) mod N
- **Move Direction** = Turn L or R based on `turns[state]`, then move forward
- **Next State** = The new cell state after writing

### Spiral Pattern Example (4 states)

| State | Turn Rule | Write | Color | Visual Effect |
|-------|-----------|-------|-------|---------------|
| 0 | R | 1 | #000000 (Black) | Background |
| 1 | R | 2 | Blue shade 1 | Spiral arm |
| 2 | R | 3 | Blue shade 2 | Spiral arm |
| 3 | L | 0 | Blue shade 3 | Corner turn |

**Rule Sequence:** `R R R L` → Creates expanding polygon (triangle with 4 states)

### Symmetric Pattern Example (4 states)

| State | Turn Rule | Write | Color | Visual Effect |
|-------|-----------|-------|-------|---------------|
| 0 | L | 1 | #000000 (Black) | Background |
| 1 | R | 2 | Green shade 1 | Symmetric path |
| 2 | L | 3 | Green shade 2 | Symmetric path |
| 3 | R | 0 | Green shade 3 | Symmetric path |

**Rule Sequence:** `L R L R` → Creates alternating symmetric patterns

## 9. Detailed State Machine with Actions

```mermaid
stateDiagram-v2
    [*] --> Q0
    
    Q0 --> Q1: Read 0, Turn R/L, Write 1, Move Forward
    Q1 --> Q2: Read 1, Turn R/L, Write 2, Move Forward
    Q2 --> Q3: Read 2, Turn R/L, Write 3, Move Forward
    Q3 --> Q0: Read 3, Turn R/L, Write 0, Move Forward
    
    note right of Q0
        State 0
        Cell contains: 0
        Rule: turns[0]
        Output: colors[0]
        Action: Turn based on rule, Write 1, Draw pixel
    end note
    
    note right of Q1
        State 1
        Cell contains: 1
        Rule: turns[1]
        Output: colors[1]
        Action: Turn based on rule, Write 2, Draw pixel
    end note
    
    note right of Q2
        State 2
        Cell contains: 2
        Rule: turns[2]
        Output: colors[2]
        Action: Turn based on rule, Write 3, Draw pixel
    end note
    
    note right of Q3
        State 3
        Cell contains: 3
        Rule: turns[3]
        Output: colors[3]
        Action: Turn based on rule, Write 0, Draw pixel
    end note
```

## 10. Symmetric Pattern State Machine

Creates mandala-like symmetric patterns with 4 turmites at corners

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn L, Write 1
    S1 --> S2: Read 1, Turn R, Write 2
    S2 --> S3: Read 2, Turn L, Write 3
    S3 --> S0: Read 3, Turn R, Write 0
    
    note right of S0
        Pattern: L R L R
        Alternating turns
        Creates symmetric paths
        Base hue: 120 (Green)
    end note
    
    note right of S1
        4 turmites at corners
        Facing inward
        Creates radial symmetry
        Mandala-like patterns
    end note
```

## 11. Maze Pattern State Machine

Creates maze-like branching structures

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn L, Write 1
    S1 --> S2: Read 1, Turn R, Write 2
    S2 --> S3: Read 2, Turn R, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: L R R L R
        (One of three maze patterns)
        Creates branching paths
        Base hue: 30 (Orange)
    end note
    
    note right of S1
        Single turmite at center
        Creates maze-like corridors
        Branching tree structures
        Path-finding patterns
    end note
```

## 12. Fractal Pattern State Machine

Creates self-similar, recursive-looking patterns

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn R, Write 1
    S1 --> S2: Read 1, Turn R, Write 2
    S2 --> S3: Read 2, Turn L, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: R R L L
        Groups of same direction
        Group size: 2-4 random
        Creates self-similarity
        Base hue: 280 (Magenta)
    end note
    
    note right of S1
        Single turmite at center
        Recursive branching
        Fractal-like structures
        Self-repeating patterns
    end note
```

## 13. Crystal Pattern State Machine

Creates dense, blocky, city-like structures

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn R, Write 1
    S1 --> S2: Read 1, Turn R, Write 2
    S2 --> S3: Read 2, Turn R, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: R R R L
        Room Builder logic
        Walls (2-5 R's) + Corner (L)
        Occasional doorway (LL)
        Base hue: 30 (Amber/Gold)
    end note
    
    note right of S1
        4 turmites in cross formation
        Dense geometric growth
        City-like block structures
        Room and wall patterns
    end note
```

## 14. Weaver Pattern State Machine

Creates textile-like highway patterns

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn R, Write 1
    S1 --> S2: Read 1, Turn L, Write 2
    S2 --> S3: Read 2, Turn R, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: R L R L
        Base: Alternating highway
        Mutations: 25% flipped
        Lane shifting effect
        Base hue: 160 (Teal/Cyan)
    end note
    
    note right of S1
        5 turmites in a row
        Loom formation
        Highway-like paths
        Textile weaving patterns
        Parallel lane structures
    end note
```

## 15. Random Pattern State Machine

Creates chaotic, unpredictable patterns (classic Langton's ant style)

```mermaid
stateDiagram-v2
    [*] --> S0: State 0 Black
    
    S0 --> S1: Read 0, Turn R, Write 1
    S1 --> S2: Read 1, Turn L, Write 2
    S2 --> S3: Read 2, Turn R, Write 3
    S3 --> S0: Read 3, Turn L, Write 0
    
    note right of S0
        Pattern: Random L/R
        Example: R L R L
        (Changes each run)
        Truly random sequence
        Base hue: Random 0-360
    end note
    
    note right of S1
        Single turmite at center
        Unpredictable behavior
        Chaotic patterns
        Classic Langton's Ant
        Highway formation possible
    end note
```

## Pattern Examples Summary

### Spiral Pattern (4 states)
- Turns: `['R', 'R', 'R', 'L']`
- Creates: Expanding polygon spirals
- Formula: (N-1) Rights, 1 Left
- Turmites: 1-5 clustered at center
- Base hue: 200 (Blue)

### Symmetric Pattern (4 states)
- Turns: `['L', 'R', 'L', 'R']` (with 20% variation)
- Creates: Mandala-like symmetric patterns
- Formula: Alternating L/R
- Turmites: 4 at corners facing inward
- Base hue: 120 (Green)

### Maze Pattern (4 states)
- Turns: `['L', 'R', 'R', 'L', 'R']` (one of three patterns)
- Creates: Maze-like branching structures
- Formula: Mixed path-creating patterns
- Turmites: 1 at center
- Base hue: 30 (Orange)

### Fractal Pattern (4 states)
- Turns: `['R', 'R', 'L', 'L']` (groups of 2-4)
- Creates: Self-similar recursive patterns
- Formula: Groups of same direction
- Turmites: 1 at center
- Base hue: 280 (Magenta)

### Crystal Pattern (4 states)
- Turns: `['R', 'R', 'R', 'L']` (room builder)
- Creates: Dense blocky city-like structures
- Formula: Walls (2-5 R's) + Corner (L) + Doorway (LL)
- Turmites: 4 in cross formation
- Base hue: 30 (Amber/Gold)

### Weaver Pattern (4 states)
- Turns: `['R', 'L', 'R', 'L']` (with 25% mutations)
- Creates: Textile-like highway patterns
- Formula: Alternating base with lane shifts
- Turmites: 5 in a row (loom)
- Base hue: 160 (Teal/Cyan)

### Random Pattern (4 states)
- Turns: Random sequence (changes each run)
- Creates: Chaotic unpredictable patterns
- Formula: Random L/R for each state
- Turmites: 1 at center
- Base hue: Random (0-360)

## 16. Complete Pattern Comparison Table

Side-by-side comparison of all Turing machine patterns

| Pattern | Turn Sequence (4 states) | Turmites | Initialization | Base Hue | Visual Effect |
|---------|-------------------------|----------|----------------|----------|--------------|
| **Spiral** | R R R L | 1-5 | Center cluster | 200 (Blue) | Expanding polygon spirals |
| **Symmetric** | L R L R | 4 | Corners inward | 120 (Green) | Mandala-like radial symmetry |
| **Maze** | L R R L R | 1 | Center | 30 (Orange) | Branching maze corridors |
| **Fractal** | R R L L | 1 | Center | 280 (Magenta) | Self-similar recursive patterns |
| **Crystal** | R R R L | 4 | Cross formation | 30 (Amber) | Dense blocky city structures |
| **Weaver** | R L R L | 5 | Row (loom) | 160 (Teal) | Highway textile patterns |
| **Random** | Random | 1 | Center | Random | Chaotic unpredictable paths |

## 17. Pattern Characteristics Matrix

```mermaid
graph TB
    subgraph "Pattern Types"
        Spiral["Spiral<br/>Geometric Expansion"]
        Symmetric["Symmetric<br/>Radial Patterns"]
        Maze["Maze<br/>Branching Paths"]
        Fractal["Fractal<br/>Self-Similar"]
        Crystal["Crystal<br/>Dense Structures"]
        Weaver["Weaver<br/>Highway Patterns"]
        Random["Random<br/>Chaotic"]
    end
    
    subgraph "Turmite Count"
        Single["Single Turmite<br/>Maze, Fractal, Random"]
        Multiple["Multiple Turmites<br/>Spiral, Symmetric, Crystal, Weaver"]
    end
    
    subgraph "Pattern Structure"
        Ordered["Ordered Rules<br/>Spiral, Symmetric, Crystal, Weaver"]
        Grouped["Grouped Rules<br/>Fractal, Maze"]
        Chaotic["Chaotic Rules<br/>Random"]
    end
    
    Spiral --> Multiple
    Symmetric --> Multiple
    Crystal --> Multiple
    Weaver --> Multiple
    
    Maze --> Single
    Fractal --> Single
    Random --> Single
    
    Spiral --> Ordered
    Symmetric --> Ordered
    Crystal --> Ordered
    Weaver --> Ordered
    
    Fractal --> Grouped
    Maze --> Grouped
    
    Random --> Chaotic
    
    style Spiral fill:#4A90E2
    style Symmetric fill:#2d7a3e
    style Maze fill:#FF8C42
    style Fractal fill:#8B5FBF
    style Crystal fill:#FFD700
    style Weaver fill:#00B3A4
    style Random fill:#FF006E
```

