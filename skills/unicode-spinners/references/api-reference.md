# API Reference Guide

This reference outlines the available exports, types, and utility interfaces of the `unicode-spinners` library.

---

## 1. Imports

### ESM (ECMAScript Modules)
Recommended for modern Node.js, Deno, Bun, and browser bundlers (Vite, Webpack).
```js
import spinners, { 
  getSpinnersByCategory, 
  gridToBraille, 
  makeGrid 
} from 'unicode-spinners';
```

### CommonJS (Legacy Node.js)
```js
const spinners = require('unicode-spinners').default;
const { 
  getSpinnersByCategory, 
  gridToBraille, 
  makeGrid 
} = require('unicode-spinners');
```

---

## 2. Core Spinner Dictionary (`spinners`)

The default export is a dictionary mapped by unique spinner identifiers:
```ts
const spinners: Record<string, Spinner>;
```

Each `Spinner` matches the following read-only interface:
```ts
interface Spinner {
  readonly frames: readonly string[]; // Array of character/string frames
  readonly interval: number;          // Recommended frame delay in milliseconds
  readonly category?: string;         // Visual category group
}
```

### Hyphen-Free Alias Support
Every standard animation in the dictionary that contains a hyphen (e.g., `dots-2`) is also registered with a hyphen-free, camelCase accessor (e.g., `dots2`) for seamless integration in environments that prohibit array bracket-access styles.
```js
// These are equivalent
const s1 = spinners['dots-2'];
const s2 = spinners.dots2;
```

---

## 3. API Utilities

### `getSpinnersByCategory(category)`
Filter and fetch all primary animations belonging to a visual theme.
*   **Parameters:** `category: string`
*   **Returns:** `Record<string, Spinner>`
*   **Example:**
    ```js
    import { getSpinnersByCategory } from 'unicode-spinners';
    
    const emojiSpinners = getSpinnersByCategory('emoji');
    console.log(Object.keys(emojiSpinners)); // ['arrow-2', 'smiley', 'hearts', ...]
    ```

### `makeGrid(rows, cols)`
Create an empty 2D boolean grid for custom Braille procedural generation.
*   **Parameters:**
    *   `rows: number` (Height of the dot grid, max 4 rows)
    *   `cols: number` (Width of the dot grid, must be even for standard alignment)
*   **Returns:** `boolean[][]` (A 2D array pre-filled with `false`)
*   **Example:**
    ```js
    const grid = makeGrid(4, 8); // 4 rows, 8 columns
    ```

### `gridToBraille(grid)`
Convert a 2D boolean grid into a multi-character Braille block string.
*   **Bitmapping rules:**
    ```
      Row 0:  dot 1 (0x01)  |  dot 4 (0x08)
      Row 1:  dot 2 (0x02)  |  dot 5 (0x10)
      Row 2:  dot 3 (0x04)  |  dot 6 (0x20)
      Row 3:  dot 7 (0x40)  |  dot 8 (0x80)
    ```
*   **Parameters:** `grid: boolean[][]`
*   **Returns:** `string` (Braille characters U+2800 block)
*   **Example:**
    ```js
    import { makeGrid, gridToBraille } from 'unicode-spinners';
    
    const grid = makeGrid(4, 2);
    grid[0][0] = true; // dot 1
    grid[0][1] = true; // dot 4
    
    console.log(gridToBraille(grid)); // Output: "⠉"
    ```
