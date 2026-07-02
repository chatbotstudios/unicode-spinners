# unicode-spinners

[![skills.sh](https://skills.sh/b/chatbotstudios/unicode-spinners)](https://skills.sh/chatbotstudios/unicode-spinners)

Unicode spinner animations as raw frame data — no dependencies, works everywhere in Node.js, Deno, Bun, and the browser.

Now upgraded in **v3.1.0** to feature **150+ high-fidelity animations** grouped across 8 thematic categories, dynamic camelCase aliasing, and an interactive, real-time terminal review & database manager.

## Demo & Exploration Suite

Explore the entire database of 150 live animations directly from your command line:

```bash
# 📺 Open the full-terminal live scroll dashboard (use ↑↓ to scroll, q to quit)
npx unicode-spinners --all

# 📄 Output a beautiful categorized index of all 150+ spinners
npx unicode-spinners --list

# 🎮 Navigate through animations one-by-one interactively (use ←→ / n/p keys)
npx unicode-spinners --review

# 🔍 Search by name or category
npx unicode-spinners pulse
npx unicode-spinners --category fun

# 🌐 Launch the local browser playground demo
npx unicode-spinners --web
```

### 🛠️ Interactive TUI Database Manager
Create, edit, delete, and view spinners live with native frame animation rendering inside the console list:
```bash
npm run manage
```
Custom spinners are persistently saved in your environment at `~/.unicode-spinners-custom.json`.

### 🤖 AI Agent Integration (Skills.sh)
This repository is pre-configured with a structured Vercel Agent Skill framework (`SKILL.md` / `UNICODE-SPINNERS-V2-SKILL.MD`). AI coding agents can install and utilize this package directly within their system instructions:
```bash
npx skills add chatbotstudios/unicode-spinners
```

## Install

```bash
npm install unicode-spinners
```

## Quick Start

```js
// ESM / TypeScript
import spinners, { getSpinnersByCategory } from 'unicode-spinners';

// CommonJS
const spinners = require('unicode-spinners').default;
```

Each spinner is represented as a read-only object:
```ts
interface Spinner {
  readonly frames: readonly string[]; // Array of strings representing each animation frame
  readonly interval: number;          // Recommended frame delay in milliseconds
  readonly category?: string;         // Visual category group
}
```

---

## Guide: Running Spinner Animations in the Terminal (CLI)

To integrate premium unicode spinner animations into your own terminal scripts, follow these robust practices to ensure professional cursor management, zero clock-drift frame rendering, and clean exit signals.

### 🚀 Standalone Production-Grade CLI Spinner

Copy this complete standalone template to implement optimal terminal spinner rendering with full cursor and terminal cleanup:

```js
import spinners from 'unicode-spinners';

export function runCliSpinner(message, spinnerName = 'dots-2', duration = 5000) {
  const spinner = spinners[spinnerName] || spinners.braille;
  const { frames, interval } = spinner;
  let frameIndex = 0;

  // 1. Hide terminal cursor (\x1B[?25l) to prevent annoying flickering
  process.stdout.write('\x1B[?25l');

  // 2. Start the frame loop
  const timer = setInterval(() => {
    // \r carriage return resets cursor position to start of the line
    // \x1B[2K clears the entire current line
    // \x1B[95m is light purple ANSI styling
    process.stdout.write(`\r\x1B[2K  \x1B[95m${frames[frameIndex++ % frames.length]}\x1B[0m  ${message}`);
  }, interval);

  // 3. Register graceful termination hooks
  const cleanup = () => {
    clearInterval(timer);
    // Restore cursor (\x1B[?25h) so user's shell isn't left cursorless
    process.stdout.write('\x1B[?25h\r\n');
  };

  // Trigger cleanup on standard exit codes or SIGINT (Ctrl+C)
  process.once('SIGINT', () => {
    cleanup();
    process.exit(0);
  });

  // 4. End spinner after duration
  setTimeout(() => {
    clearInterval(timer);
    // Success marker (\x1B[92m is green ✔)
    process.stdout.write(`\r\x1B[2K  \x1B[92m✔\x1B[0m  Work completed successfully!\n`);
    process.stdout.write('\x1B[?25h'); // Restore cursor
  }, duration);
}
```

### 💡 Core Terminal Best Practices

*   **No Multi-timer clock drift**: For complex multi-spinner TUIs or CLI dashboards, compute frame indexing dynamically off `Date.now()` to avoid cumulative clock drift and memory leaks:
    ```js
    const activeFrame = frames[Math.floor(Date.now() / interval) % frames.length];
    ```
*   **Carriage Reset Blockers**: Always write carriage return (`\r`) and clear-line ANSI code (`\x1B[2K`) before printing frames. Rendering frames on consecutive lines makes the terminal extremely messy.
*   **Restore Cursor**: Always register `SIGINT` (Ctrl+C) and `exit` hooks. If your Node process exits or crashes without writing `\x1B[?25h`, the user's terminal cursor will remain completely invisible.

---

## Powerful New Features in v3.0.0

### 1. 150+ Premium Animations across 8 Categories
The library now offers high-fidelity visual loading states grouped by category:
* **`braille`**: Standard multi-dot procedurally-generated and static arrays.
* **`progress`**: Loading blocks, percentage counters, battery status, and bouncing bars.
* **`emoji`**: High-fidelity animated emoji states (`moon` phases, `clock` times, `runner` paces, `weather` transitions).
* **`fun`**: Retro arcade game frames like `pong` paddles, `pacman` chomping dots, `space-invaders`, and `dino-run`.
* **`geometric`**: Rotating circles, quad blocks, triangles, and mitosis cells.
* **`toggle`**: Binary state triggers (`cross-toggle`, yin-yang, frames).
* **`simple`**: Minimalistic terminal icons (`line`, `dots`, `pipe`, `hamburger`).
* **`legacy`**: Fully preserved classic single-character and grid layouts for complete backward-compatibility.

### 2. Dynamic camelCase Aliasing
You no longer have to worry about dashed names vs camelCase accessors. The spinner registry automatically generates hyphen-free and camelCase versions of all names:
```js
// Both of these resolve to the exact same spinner object!
const spinner1 = spinners['dots-2'];
const spinner2 = spinners.dots2;
```

### 3. Category Queries
You can retrieve all spinners belonging to a specific visual theme:
```js
import { getSpinnersByCategory } from 'unicode-spinners';

const progressSpinners = getSpinnersByCategory('progress');
console.log(Object.keys(progressSpinners)); // ['progress-dots', 'typewriter', 'bouncing-bar', ...]
```

---

## Real-world Examples

### CLI Tool — Basic Spinner
```js
import spinners from 'unicode-spinners';

const { frames, interval } = spinners.dots2;
let i = 0;

const timer = setInterval(() => {
  // \r returns cursor to start of line, \x1B[2K clears line contents
  process.stdout.write(`\r\x1B[2K  \x1B[35m${frames[i++ % frames.length]}\x1B[0m  Syncing repository...`);
}, interval);

await performWork();

clearInterval(timer);
process.stdout.write('\r\x1B[2K  ✔ Repository synced successfully.\n');
```

### Reusable Spinner Helper
```js
import spinners from 'unicode-spinners';

function startSpinner(message, spinnerName = 'dots-circle') {
  const spinner = spinners[spinnerName] || spinners.braille;
  const { frames, interval } = spinner;
  let i = 0;
  let text = message;

  const timer = setInterval(() => {
    process.stdout.write(`\r\x1B[2K  \x1B[36m${frames[i++ % frames.length]}\x1B[0m  ${text}`);
  }, interval);

  return {
    update(newMsg) { text = newMsg; },
    stop(successMsg) {
      clearInterval(timer);
      process.stdout.write(`\r\x1B[2K  ✔  ${successMsg}\n`);
    }
  };
}

const s = startSpinner('Provisioning server...', 'earth');
await delay(1500);
s.update('Installing packages (this might take a second)...');
await delay(2000);
s.stop('Server is live at http://localhost:8080');
```

### React Spinner Component
```jsx
import { useState, useEffect } from 'react';
import spinners from 'unicode-spinners';

export function Spinner({ name = 'helix', color = '#9333ea', children }) {
  const [frame, setFrame] = useState(0);
  const spinner = spinners[name] || spinners.braille;

  useEffect(() => {
    const timer = setInterval(
      () => setFrame(f => (f + 1) % spinner.frames.length),
      spinner.interval
    );
    return () => clearInterval(timer);
  }, [name, spinner.frames.length, spinner.interval]);

  return (
    <span style={{ fontFamily: 'monospace', color }}>
      {spinner.frames[frame]} <span style={{ color: 'initial' }}>{children}</span>
    </span>
  );
}

// Usage: <Spinner name="pong">Loading retro assets...</Spinner>
```

---

## Custom Procedural Generators (Braille Grid)

Create your own infinite custom animations using the procedural Braille grid utilities:
```js
import { gridToBraille, makeGrid } from 'unicode-spinners';

// Create a 4-row × 8-col boolean grid (U+2800 block)
const grid = makeGrid(4, 8);

// Raise specific dots (2 dot-columns are grouped per character)
grid[0][0] = true;
grid[1][2] = true;
grid[2][4] = true;
grid[3][6] = true;

const brailleStr = gridToBraille(grid);
console.log(brailleStr); // Output: "⠁⠂⠄⡀"
```

---

## Version History & Changelog

### **v3.2.0**
* **AI Agent Integration Framework:** Added an installable Agent Skill configuration (`SKILL.md` / `UNICODE-SPINNERS-V2-SKILL.MD`) matching the Vercel prompt framework, enabling other AI Coding Agents to seamlessly load, understand, configure, and code with the spinner library in their target applications.
* **TUI Documentation & Guides:** Updated developer guides and instructions inside the repository to streamline AI agent integration.

### **v3.1.0**
* **Interactive TUI Database Manager:** Integrated an interactive, zero-dependency TUI console utility (`npm run manage`) to search, browse, create, edit, and delete standard and custom spinners.
* **Live Inline List Rendering:** Browsing and searching custom and core spinners renders their animations live at their exact native speeds inside the console selection lists.
* **State-Free Frame Math:** Streamlined animation rendering dynamically off `Date.now()`, eliminating background timer states and memory leaks.
* **Alphanumeric Persistent Storage:** Saved customized/new spinners to user configuration file `~/.unicode-spinners-custom.json` persistently.

### **v3.0.0**
* **Massive Spinner Database Expansion:** Upgraded from 18 to **150+ premium animations**.
* **Categorization:** Introduced 8 semantic categories (`braille`, `radar`, `simple`, `progress`, `emoji`, `fun`, `geometric`, `toggle`, `legacy`).
* **Category Filtering:** Added `getSpinnersByCategory(category)` API export.
* **Intelligent Aliasing:** Automatic fallback for hyphenated names to camelCase keys (e.g. `dots-2` can be accessed as `dots2`).
* **Exploration CLI Suite:** Redesigned terminal demo runner to include dynamic lists, full dashboard dashboard view (`--all`), interactive single-item review (`--review`), and web integration.
* **Full TypeScript support & Bundler Overhaul:** Compiled to highly compressed ESM, CJS, and IIFE formats using `tsup`.
* **Testing:** Expanded test coverage to 1,302 unit assertions.

### **v1.0.3**
* Initial core release containing 18 procedural and static braille spinners.
* Introduction of `gridToBraille` and `makeGrid` grid rendering utilities.

---

## License

MIT

