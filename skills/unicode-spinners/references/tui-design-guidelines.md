# TUI Design Guidelines & Best Practices

This guide describes the standard guidelines and best practices for implementing high-performance, non-flickering terminal animations and text interfaces using `unicode-spinners`.

---

## 1. Absolute Golden Rules of Terminal Animation

### 1. Carriage Returns (`\r`) & Clear Lines (`\x1B[2K`)
If you write frames to standard output without clearing the active line or resetting the cursor, they will print on consecutive newlines, causing ugly shell clutter.
*   **Always prefix your write sequence with `\r\x1B[2K`** (returns cursor to column 0, clears all characters in the current line).
*   **Correct:**
    ```js
    process.stdout.write(`\r\x1B[2K  ${frame} Doing work...`);
    ```
*   **Incorrect:**
    ```js
    console.log(`${frame} Doing work...`); // prints on new lines
    ```

### 2. Console Cursor Visibility
Always hide the blinking text cursor before starting a TUI rendering sequence to prevent annoying visual flicker. You **MUST** restore it on exit, error, or process termination.
*   **ANSI Code to Hide Cursor:** `\x1B[?25l`
*   **ANSI Code to Show Cursor:** `\x1B[?25h`
*   **Correct Wrapper Pattern:**
    ```js
    // Hide
    process.stdout.write('\x1B[?25l');
    
    // Register restorers
    const restore = () => process.stdout.write('\x1B[?25h');
    process.on('exit', restore);
    process.on('SIGINT', () => { restore(); process.exit(0); });
    ```

---

## 2. Preventing Flicker & Latency

### 1. Buffer Double-Buffering
For multi-line animations (like grids or scroll views), do not perform multiple `process.stdout.write()` calls per frame. This will cause visible vertical line-by-line drawing lag (flicker).
*   **The Solution:** Build the entire frame content as a single unified string in memory, then flush it to stdout in a single write call.
*   **Double-buffering pattern:**
    ```js
    let buffer = '\x1B[H'; // move cursor to home position
    for (let r = 0; r < height; r++) {
      buffer += renderRow(r) + '\r\n';
    }
    process.stdout.write(buffer); // flush all at once
    ```

### 2. Time-Synchronous Frame Rendering
Spawning independent interval timers (`setInterval`) for multiple animations on screen causes high CPU overhead, clock drift, and unsynchronized visual stutter.
*   **The Solution:** Run a single global animation loop (a "ticker" interval) at a uniform refresh rate (e.g. 50ms or 80ms). In each tick, calculate active frame indices dynamically using `Date.now()` and each animation's individual recommended duration.
*   **Time-synced calculation:**
    ```js
    // Call this inside a single global setInterval() loop
    function drawAll() {
      const elapsed = Date.now();
      const frameA = spinnerA.frames[Math.floor(elapsed / spinnerA.interval) % spinnerA.frames.length];
      const frameB = spinnerB.frames[Math.floor(elapsed / spinnerB.interval) % spinnerB.frames.length];
      // Render frameA and frameB...
    }
    ```

---

## 3. Graceful TTY Checks & Resize Handling

### 1. Checking TTY Support
If your CLI script is run inside a non-interactive environment (such as a piped shell execution, a Docker container build log, or a CI/CD pipeline), `process.stdout.isTTY` will be `false`. In these situations, raw ANSI escape sequences and keyboard input reading will throw errors or pollute logs.
*   **Always check TTY capability:**
    ```js
    if (!process.stdout.isTTY) {
      // Fallback: print static, minimal progress lines and do not write ANSI controls
      console.log('Deploying to production...');
      return;
    }
    ```

### 2. Listening to Terminal Resize Events
Terminal windows can be resized by the user at any point. A TUI that does not handle resizing will break, wrap rows, or draw out-of-bounds artifacts.
*   **Always register a resize listener:**
    ```js
    process.stdout.on('resize', () => {
      // Clear standard buffers, adjust drawing boundaries, and re-draw the layout
      redrawLayout();
    });
    ```
