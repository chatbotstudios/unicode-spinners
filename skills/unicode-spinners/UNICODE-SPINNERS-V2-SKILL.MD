---
name: unicode-spinners
description: Integrate unicode-spinners v3.1.0 into apps/projects. Support 150+ high-fidelity spinner animations across 8 categories (braille, progress, emoji, fun, geometric, toggle, simple, legacy). Render interactive console loading states, CLI status indicators, React/browser loaders, and custom procedural Braille grids. Use when an agent is asked to add a spinner, build an interactive terminal UI (TUI) loading sequence, write a progress bar, show a live emoji indicator, or compose custom Braille animations dynamically.
---

# Unicode Animations Agent Skill

Act as an expert firmware, frontend, and systems developer specialized in terminal graphics, animations, and TUI engineering. Provide optimal, performant, and visual-rich integrations using the `unicode-spinners` library.

## Work Style

*   **Aesthetics First:** Prioritize extremely polished terminal graphics. Tag animations cleanly and use vibrant ANSI color highlights (`\x1B[95m` etc.) to give a premium look.
*   **Zero Dependencies:** Leverage the zero-dependency nature of the library. Do not import third-party visual utilities unless the target project already enforces them.
*   **Responsive layouts:** When designing terminal interfaces, consider visible terminal bounds (`process.stdout.columns` / `process.stdout.rows`) to ensure animations never wrap or cause ugly formatting artifacts.
*   **Time-Synchronous Rendering:** For complex multi-spinner interfaces or scrollable dashboards, compute frame indexing statelessly using `Date.now()` and each spinner's defined `interval` to avoid multi-timer clock drift and memory leaks.

## Non-Negotiable Blockers

*   **No Carriage Artifacts:** Never write a terminal spinner without prefixing the stream write with a carriage return (`\r`) and the clear-line ANSI code (`\x1B[2K`). Printing frames on consecutive newlines is UNACCEPTABLE.
*   **Cursor Management:** You MUST hide the console cursor (`\x1B[?25l`) before starting an animation, and restore it (`\x1B[?25h`) upon termination or crash.
*   **Graceful Exit Handlers:** Always register clean exit hooks for both `SIGINT` (Ctrl+C) and `exit` events to ensure the cursor is restored and standard screen states are preserved.
*   **Type Guard Verification:** When importing `spinners` in TypeScript, explicitly handle the union string types and fallback gracefully if the requested spinner name is not found in the record.

## Execute the Task

1.  **Read Target Environment:** Determine whether the destination is a Node.js CLI, a browser-based frontend, a framework like React, or a TUI terminal view.
2.  **Select Spinner Category:** Align with the visual style requested by the user:
    *   `braille`: Standard procedural and static multi-dot arrays.
    *   `progress`: Visual percentages, bars, and gauges.
    *   `emoji`: Fluid emoji-based transitions (moon phases, clock hands, weather).
    *   `fun`: Retro-arcade game icons (pong paddles, pacman, space-invaders).
    *   `geometric`: Rotators, quad-blocks, triangles, and mitosis.
    *   `simple`: Minimalist piping and lines.
    *   `legacy`: Standard classic single-character frames for older shell limits.
3.  **Validate Import Type:** Implement standard ESM (`import spinners from 'unicode-spinners'`) or CJS (`const spinners = require('unicode-spinners').default`) depending on `package.json` `"type"` value.
4.  **Integrate Exit Hooks:** Ensure `process.on('SIGINT')` or equivalent cleanup hook is integrated into the runner loop.
5.  **Compile & Verify:** Verify compilation builds successfully and verify console output behavior.

---

## API Reference

### 1. Types & Interfaces

```ts
interface Spinner {
  readonly frames: readonly string[]; // Array of animation frames
  readonly interval: number;          // Recommended frame delay in ms
  readonly category?: string;         // Thematic category group
}

type BrailleSpinnerName = string;     // Accepts any valid standard name or alias
```

### 2. Exports from `'unicode-spinners'`

| Export | Type | Description |
| :--- | :--- | :--- |
| `default` / `spinners` | `Record<string, Spinner>` | Master record containing all 150+ core and custom spinners (including camelCase aliases). |
| `getSpinnersByCategory(cat)` | `(string) => Record<string, Spinner>` | Retrieves all primary spinner configurations belonging to a specific visual category. |
| `gridToBraille(grid)` | `(boolean[][]) => string` | Maps a 2D boolean grid onto a multi-character Unicode Braille block string (U+2800). |
| `makeGrid(rows, cols)` | `(number, number) => boolean[][]` | Creates a blank 2D boolean grid of specified dimensions. |

---

## Curated Code Templates

### 1. Minimal Node.js CLI Spinner
```js
import spinners from 'unicode-spinners';

function runBasicSpinner(name = 'dots-2', duration = 3000) {
  const spinner = spinners[name] || spinners.braille;
  const { frames, interval } = spinner;
  let i = 0;

  // Hide cursor and clear line
  process.stdout.write('\x1B[?25l');

  const timer = setInterval(() => {
    process.stdout.write(`\r\x1B[2K  \x1B[95m${frames[i++ % frames.length]}\x1B[0m  Working...`);
  }, interval);

  setTimeout(() => {
    clearInterval(timer);
    // Restore cursor and print success
    process.stdout.write('\r\x1B[2K  \x1B[92m✔\x1B[0m  Done!\n\x1B[?25h');
  }, duration);
}
```

### 2. Stateful Reusable TUI Spinner (With Graceful Cleanup)
```js
import spinners from 'unicode-spinners';

export function createTuiSpinner(initialMessage, spinnerName = 'helix') {
  const spinner = spinners[spinnerName] || spinners.braille;
  const { frames, interval } = spinner;
  let i = 0;
  let text = initialMessage;

  // Hide cursor immediately
  process.stdout.write('\x1B[?25l');

  const timer = setInterval(() => {
    process.stdout.write(`\r\x1B[2K  \x1B[36m${frames[i++ % frames.length]}\x1B[0m  ${text}`);
  }, interval);

  // Clean exit registration
  const cleanup = () => {
    clearInterval(timer);
    process.stdout.write('\x1B[?25h\r\n');
  };
  process.on('SIGINT', () => { cleanup(); process.exit(0); });

  return {
    update(newMessage) {
      text = newMessage;
    },
    stop(successMessage) {
      clearInterval(timer);
      process.stdout.write(`\r\x1B[2K  \x1B[92m✔\x1B[0m  ${successMessage}\n\x1B[?25h`);
    },
    fail(errorMessage) {
      clearInterval(timer);
      process.stdout.write(`\r\x1B[2K  \x1B[91m✖\x1B[0m  ${errorMessage}\n\x1B[?25h`);
    }
  };
}
```

### 3. Custom Procedural Grid Generator (Math Wave)
```js
import { makeGrid, gridToBraille } from 'unicode-spinners';

// Generates a custom 2D math wave frame in real-time
export function generateWaveFrame(tick, width = 16, height = 4) {
  const grid = makeGrid(height, width);
  for (let c = 0; c < width; c++) {
    // Calculate sine wave trajectory
    const phase = tick * 0.4 + c * 0.5;
    const r = Math.round(((Math.sin(phase) + 1) / 2) * (height - 1));
    if (r >= 0 && r < height) {
      grid[r][c] = true;
    }
  }
  return gridToBraille(grid);
}
```

### 4. Fully Typed React Loader Component
```tsx
import React, { useState, useEffect } from 'react';
import spinners from 'unicode-spinners';

interface SpinnerProps {
  name?: string;
  color?: string;
  children?: React.ReactNode;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  name = 'helix', 
  color = '#a855f7', 
  children 
}) => {
  const [frame, setFrame] = useState(0);
  const activeSpinner = spinners[name] || spinners.braille;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % activeSpinner.frames.length);
    }, activeSpinner.interval);

    return () => clearInterval(timer);
  }, [name, activeSpinner.frames.length, activeSpinner.interval]);

  return (
    <span style={{ fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ color, marginRight: '8px' }}>
        {activeSpinner.frames[frame]}
      </span>
      {children}
    </span>
  );
};

---

## Use the References
*   **API Reference Guide:** [references/api-reference.md](references/api-reference.md)
*   **Spinner Categories Reference Table:** [references/spinner-categories.md](references/spinner-categories.md)
*   **TUI Design Guidelines & Best Practices:** [references/tui-design-guidelines.md](references/tui-design-guidelines.md)
```
