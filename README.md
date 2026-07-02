# unicode-spinners

[![skills.sh](https://skills.sh/b/chatbotstudios/unicode-spinners)](https://skills.sh/chatbotstudios/unicode-spinners)
[![npm version](https://badge.fury.io/js/unicode-spinners.svg)](https://badge.fury.io/js/unicode-spinners)

Unicode spinner animations as raw frame data — no dependencies, works everywhere in Node.js, Deno, Bun, and the browser.

Now upgraded to **v3.2.0**, featuring **150+ high-fidelity animations**, dynamic camelCase aliasing, a powerful AI-ready CLI wrapper, and an interactive, real-time terminal review dashboard.

## 🌐 Live Web Demo
**Explore the interactive React playground:**
👉 **[https://chatbotstudios.github.io/unicode-spinners/](https://chatbotstudios.github.io/unicode-spinners/)**

---

## 🛠️ Installation

```bash
npm install unicode-spinners
```

---

## 🚀 The AI-Ready CLI Wrapper

Need to run a long bash script or deployment command with a beautiful spinner? You don't even need to write JavaScript!
Our built-in CLI acts as a native wrapper for your tasks:

```bash
npx unicode-spinners wrap --spinner earth --text "Deploying to production..." -- npm publish
```

This will run `npm publish` in the background while rendering a flawless, zero-flicker animated `earth` spinner. Once the command finishes, it automatically exits with a clean success or failure message.

### CLI Commands:
```bash
# 📦 Wrap a command in a spinner
npx unicode-spinners wrap --spinner pacman --text "Compiling..." -- tsc

# 📄 Output a JSON list of all 150+ spinners (Perfect for LLM scripts)
npx unicode-spinners list --json

# 📺 Open the full-terminal live scroll dashboard (use ↑↓ to scroll, q to quit)
npx unicode-spinners --all
```

---

## 🤖 AI Agent Integration (AI-Ready)
This library is fully optimized for consumption by AI Agents (like Cursor, Copilot, or CLI Agents).
1. **Agent Skill System**: The repository includes `.agents/skills/use-unicode-spinners/SKILL.md`, providing declarative instructions to any compliant agent on how to integrate the library correctly.
2. **`llms.txt`**: A standardized `/llms.txt` file is included in the repo root for ultra-fast RAG indexing by LLMs.

---

## 💻 JavaScript / TypeScript API

```ts
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

### 150+ Premium Animations across 8 Categories
* **`braille`**: Standard multi-dot procedurally-generated and static arrays.
* **`progress`**: Loading blocks, percentage counters, battery status, and bouncing bars.
* **`emoji`**: High-fidelity animated emoji states (`moon` phases, `clock` times, `runner` paces, `weather` transitions).
* **`fun`**: Retro arcade game frames like `pong` paddles, `pacman` chomping dots, `space-invaders`, and `dino-run`.
* **`geometric`**: Rotating circles, quad blocks, triangles, and mitosis cells.
* **`toggle`**: Binary state triggers (`cross-toggle`, yin-yang, frames).
* **`simple`**: Minimalistic terminal icons (`line`, `dots`, `pipe`, `hamburger`).
* **`legacy`**: Fully preserved classic single-character and grid layouts for complete backward-compatibility.

*(Note: Dashed names and camelCase names resolve to the same object! `spinners['dots-2'] === spinners.dots2`)*

---

## 👨‍💻 Writing Custom CLI Spinners in Node.js

To integrate premium unicode spinner animations natively into your scripts, follow these robust practices to ensure professional cursor management and clean exits:

```js
import spinners from 'unicode-spinners';

const spinner = spinners.dots2;
const { frames, interval } = spinner;
let frameIndex = 0;

// 1. Hide terminal cursor (\x1B[?25l) to prevent annoying flickering
process.stdout.write('\x1B[?25l');

// 2. Start the frame loop
const timer = setInterval(() => {
  // \r carriage return resets cursor position to start of the line
  // \x1B[2K clears the entire current line
  // \x1B[95m is light purple ANSI styling
  process.stdout.write(`\r\x1B[2K  \x1B[95m${frames[frameIndex++ % frames.length]}\x1B[0m  Syncing repository...`);
}, interval);

// 3. Register graceful termination
process.once('SIGINT', () => {
  clearInterval(timer);
  process.stdout.write('\x1B[?25h\r\n'); // Restore cursor
  process.exit(0);
});

await performWork();

clearInterval(timer);
process.stdout.write(`\r\x1B[2K  \x1B[92m✔\x1B[0m  Repository synced successfully!\n`);
process.stdout.write('\x1B[?25h'); // Restore cursor
```

---

## ⚛️ React Spinner Component

The raw string-array format makes building UI components incredibly trivial:

```tsx
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

## 🎨 Custom Procedural Generators (Braille Grid)

Create your own infinite custom animations using the procedural Braille grid utilities:
```ts
import { gridToBraille, makeGrid } from 'unicode-spinners';

// Create a 4-row × 8-col boolean grid (U+2800 block)
const grid = makeGrid(4, 8);

// Raise specific dots
grid[0][0] = true;
grid[1][2] = true;
grid[2][4] = true;
grid[3][6] = true;

console.log(gridToBraille(grid)); // Output: "⠁⠂⠄⡀"
```

---

## Version History & Changelog

### **v3.2.0**
* **Live React Web Demo:** Hosted interactive dashboard to easily find and copy spinners.
* **Agent Integration Framework:** Built-in `SKILL.md` and `llms.txt` support for AI coding agents.
* **CLI Wrapper:** Added `npx unicode-spinners wrap` allowing developers and agents to wrap their bash commands in a beautiful spinner natively without writing any code.

### **v3.1.0**
* **Interactive TUI Database Manager:** Zero-dependency TUI console utility (`npm run manage`).
* **Live Inline List Rendering:** Browsing and searching spinners renders their animations live at their exact native speeds.
* **State-Free Frame Math:** Streamlined animation rendering dynamically off `Date.now()`.

### **v3.0.0**
* **Massive Spinner Database Expansion:** Upgraded to **150+ premium animations**.
* **Categorization:** Introduced 8 semantic categories with `getSpinnersByCategory(category)`.
* **Intelligent Aliasing:** Automatic fallback for hyphenated names to camelCase keys.
* **Full TypeScript support:** Compiled to compressed ESM, CJS, and IIFE formats using `tsup`.

---

## License

MIT
