#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const tty = require('tty');
const os = require('os');

let S;
try {
  S = require(path.join(__dirname, '..', 'dist', 'index.cjs'));
  S = S.spinners || S.default;
} catch {
  console.error('Run `npm run build` first.');
  process.exit(1);
}

let names = Object.keys(S);
const args = process.argv.slice(2);

// --web: open browser demo
if (args.includes('--web') || args.includes('-w')) {
  const { exec } = require('child_process');
  const demoPath = path.join(__dirname, 'demo.html');
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} "${demoPath}"`);
  console.log(`Opening ${demoPath}`);
  process.exit(0);
}

// Extract category filter
let categoryFilter = null;
const catIdx = args.findIndex(a => a === '--category' || a === '-c');
if (catIdx !== -1 && args[catIdx + 1]) {
  categoryFilter = args[catIdx + 1].toLowerCase();
  args.splice(catIdx, 2);
}

// Extract search query
let searchQuery = args.filter(a => !a.startsWith('-'))[0] || null;
if (searchQuery) {
  searchQuery = searchQuery.toLowerCase();
}

// Apply category filtering
if (categoryFilter) {
  names = names.filter(n => S[n].category && S[n].category.toLowerCase() === categoryFilter);
  if (names.length === 0) {
    console.error(`No spinners found in category "${categoryFilter}".`);
    process.exit(1);
  }
}

// Apply fuzzy/substring search
if (searchQuery) {
  names = names.filter(n => n.toLowerCase().includes(searchQuery));
  if (names.length === 0) {
    console.error(`No spinners matching keyword "${searchQuery}".`);
    process.exit(1);
  }
}
// Get a writable stream
let out = process.stdout;

// ─── ALL MODE ────────────────────────────────────────────────────────────────
if (args.includes('--all') || args.includes('-a')) {
  const bold    = '\x1B[1m';
  const dim     = '\x1B[2m';
  const reset   = '\x1B[0m';
  const green   = '\x1B[92m';

  const CAT_COLORS = {
    braille:   '\x1B[96m',
    progress:  '\x1B[93m',
    simple:    '\x1B[92m',
    geometric: '\x1B[95m',
    toggle:    '\x1B[94m',
    emoji:     '\x1B[91m',
    fun:       '\x1B[35m',
    legacy:    '\x1B[90m',
    general:   '\x1B[97m',
  };
  function catColor(cat) { return CAT_COLORS[cat] || '\x1B[97m'; }

  function isAlias(key) {
    if (!key.includes('-')) {
      const dashed = key.replace(/([0-9]+)/g, '-$1').replace(/([a-z]+)([A-Z])/g, '$1-$2').toLowerCase();
      if (dashed !== key && S[dashed]) return true;
    }
    return false;
  }

  const primaryNames = Object.keys(S).filter(n => !isAlias(n));
  const catMap = {};
  for (const name of primaryNames) {
    const cat = S[name].category || 'general';
    if (!catMap[cat]) catMap[cat] = [];
    catMap[cat].push(name);
  }

  // Build a flat list of display lines:
  // type 'header' → { cat, label }
  // type 'spinner' → { name, cat, entryIdx }
  const displayLines = [];
  const allEntries   = [];  // parallel flat list for frame tracking

  for (const [cat, catNames] of Object.entries(catMap)) {
    displayLines.push({ type: 'header', cat, label: `${cat.toUpperCase()}  (${catNames.length})` });
    for (const name of catNames) {
      const entryIdx = allEntries.length;
      allEntries.push({ name, cat, _acc: 0 });
      displayLines.push({ type: 'spinner', name, cat, entryIdx });
    }
  }

  const frameIdxs = new Array(allEntries.length).fill(0);
  const TICK_MS   = 80;
  const stripAnsi = s => s.replace(/\x1B\[[0-9;]*m/g, '');

  // Open TTY
  if (!out.isTTY) {
    try {
      const fd = fs.openSync('/dev/tty', 'w+');
      out = new tty.WriteStream(fd);
    } catch {
      console.error('No TTY available.');
      process.exit(1);
    }
  }

  function termHeight() { return out.rows || process.stdout.rows || 24; }
  function termWidth()  { return out.columns || process.stdout.columns || 80; }

  const FOOTER_LINES = 2; // status bar at bottom
  let scrollTop = 0;      // index of first visible displayLine

  function visibleRows() { return Math.max(1, termHeight() - FOOTER_LINES); }

  function clampScroll() {
    const maxScroll = Math.max(0, displayLines.length - visibleRows());
    scrollTop = Math.max(0, Math.min(scrollTop, maxScroll));
  }

  function renderLine(dl, lineWidth) {
    if (dl.type === 'header') {
      const cc  = catColor(dl.cat);
      const raw = `  ${cc}${bold}▸ ${dl.label}${reset}`;
      const vis = stripAnsi(raw);
      return raw + ' '.repeat(Math.max(0, lineWidth - vis.length));
    }
    // spinner row  — name · frame · meta
    const s      = S[dl.name];
    const frame  = s.frames[frameIdxs[dl.entryIdx] % s.frames.length];
    const cc     = catColor(dl.cat);
    const namePad = dl.name.padEnd(30);
    const raw    = `  ${bold}${namePad}${reset}  ${cc}${frame}${reset}  ${dim}${s.frames.length}f · ${s.interval}ms${reset}`;
    const vis    = stripAnsi(raw);
    return raw + ' '.repeat(Math.max(0, lineWidth - vis.length));
  }

  function renderScrollbar(visRows, total, top) {
    // Returns array of chars, one per visible row
    const bar = new Array(visRows).fill(' ');
    if (total <= visRows) return bar;
    const thumbSize = Math.max(1, Math.round((visRows / total) * visRows));
    const thumbPos  = Math.round((top / (total - visRows)) * (visRows - thumbSize));
    for (let i = thumbPos; i < thumbPos + thumbSize && i < visRows; i++) {
      bar[i] = '\x1B[2m█\x1B[0m';
    }
    return bar;
  }

  function draw() {
    clampScroll();
    const visRows  = visibleRows();
    const lw       = termWidth() - 2; // leave 1 col for scrollbar + gap
    const slice    = displayLines.slice(scrollTop, scrollTop + visRows);
    const scrollbar = renderScrollbar(visRows, displayLines.length, scrollTop);
    const pct      = displayLines.length <= visRows ? 100
                   : Math.round((scrollTop / (displayLines.length - visRows)) * 100);

    // spinners visible on screen
    const visibleSpinnerCount = slice.filter(d => d.type === 'spinner').length;

    let output = '\x1B[H'; // move to home
    for (let i = 0; i < visRows; i++) {
      const dl  = slice[i];
      const bar = scrollbar[i];
      const row = dl ? renderLine(dl, lw) : ' '.repeat(lw);
      output += `\x1B[2K${row} ${bar}\r\n`;
    }

    // Footer / status bar
    const total   = primaryNames.length;
    const status  = `${dim}  ↑↓ / j k  scroll · PgUp PgDn  half page · q  quit · ${green}${pct}%${dim} · ${total} animations${reset}`;
    output += `\x1B[2K${status}\r\n`;

    out.write(output);
  }

  out.write('\x1B[2J\x1B[H\x1B[?25l'); // clear + hide cursor
  const cleanup = () => { try { out.write('\x1B[?25h\x1B[2J\x1B[H'); } catch {} };
  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('exit',   cleanup);

  // Keyboard handler
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', key => {
      // q / Ctrl-C / Esc
      if (key[0] === 0x71 || key[0] === 0x03 || (key[0] === 0x1B && key.length === 1)) {
        cleanup(); process.exit(0);
      }
      const half = Math.max(1, Math.floor(visibleRows() / 2));
      // Up arrow or k
      if ((key.length === 3 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x41) || key[0] === 0x6B) {
        scrollTop = Math.max(0, scrollTop - 1);
      }
      // Down arrow or j
      if ((key.length === 3 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x42) || key[0] === 0x6A) {
        scrollTop = Math.min(displayLines.length - visibleRows(), scrollTop + 1);
      }
      // PgUp
      if (key.length === 4 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x35 && key[3] === 0x7E) {
        scrollTop = Math.max(0, scrollTop - half);
      }
      // PgDn
      if (key.length === 4 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x36 && key[3] === 0x7E) {
        scrollTop = Math.min(Math.max(0, displayLines.length - visibleRows()), scrollTop + half);
      }
    });
  }

  // Resize support
  out.on('resize', draw);

  setInterval(() => {
    for (let idx = 0; idx < allEntries.length; idx++) {
      const s = S[allEntries[idx].name];
      allEntries[idx]._acc += TICK_MS / s.interval;
      const steps = Math.floor(allEntries[idx]._acc);
      if (steps > 0) {
        frameIdxs[idx] = (frameIdxs[idx] + steps) % s.frames.length;
        allEntries[idx]._acc -= steps;
      }
    }
    draw();
  }, TICK_MS);

  return;
}

if (args.includes('--list') || args.includes('-l')) {
  const bold = '\x1B[1m';
  const dim = '\x1B[2m';
  const magenta = '\x1B[35m';
  const reset = '\x1B[0m';
  
  function isAlias(key) {
    if (!key.includes('-')) {
      const dashed = key.replace(/([0-9]+)/g, '-$1').replace(/([a-z]+)([A-Z])/g, '$1-$2').toLowerCase();
      if (dashed !== key && S[dashed]) return true;
      
      const specialAliases = [
        'dots8bit', 'dotscircle', 'radar2', 'checkerboard', 'wave2', 'progressdots',
        'pulsesoft', 'pulseburst', 'pulsesquare', 'pulseorbit', 'pulsespiral', 'pulsex',
        'xsync', 'xsequence', 'xdouble', 'xfill', 'dotwave', 'dotsinewave', 'dotcross',
        'dotcorners', 'dotarrow', 'line1', 'line2', 'rollingline', 'simpledots', 'scrolldots',
        'star1', 'star2', 'growvertical', 'growhorizontal', 'balloon1', 'balloon2',
        'boxbounce1', 'boxbounce2', 'squarecorners', 'circlequarters', 'circlehalf',
        'bracketspin', 'crosstoggle', 'bouncingbar', 'bouncingball', 'gradientsweep',
        'fingerdance', 'soccerheader', 'orangepulse', 'bluepulse', 'mixpulse', 'timetravel',
        'jumpingbeans', 'dwarffortress',
        'spaceinvaders', 'atomorbit', 'beakerbubble', 'wifisearch', 'batterycharge',
        'percentload', 'solareclipse', 'shootingstar', 'spacetravel', 'ghostfloat',
        'wizardspell', 'butterflyflap', 'caterpillarcrawl', 'dogtail', 'hourglasspulse',
        'dinorun',
        'gymlift', 'ufoabduct', 'fireswirl', 'lovepulse', 'coffeesteam',
        'ninjaslice', 'snailcrawl', 'stormflash', 'musicbeat', 'catpounce',
        'robotsearch', 'popcornpop'
      ];
      if (specialAliases.includes(key)) return true;
      if (key.startsWith('toggle') && key !== 'toggle' && S[key.replace('toggle', 'toggle-')]) return true;
      if (key.startsWith('arrow') && key !== 'arrow' && S[key.replace('arrow', 'arrow-')]) return true;
      if (key.startsWith('legacy') && !key.includes('-') && S['legacy-' + key.slice(6)]) return true;
    }
    return false;
  }

  const primaries = names.filter(n => !isAlias(n));
  const aliases = names.filter(n => isAlias(n));
  
  const categories = {};
  for (const name of primaries) {
    const s = S[name];
    const cat = s.category || 'general';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }
  
  out.write(`\n${bold}${primaries.length} primary animations available${reset} ${dim}(plus ${aliases.length} camelCase aliases)${reset}\n`);
  
  for (const [cat, items] of Object.entries(categories).sort()) {
    out.write(`\n${bold}${magenta}━━━ Category: ${cat} (${items.length}) ━━━${reset}\n`);
    
    for (let j = 0; j < items.length; j += 2) {
      const renderItem = (name) => {
        if (!name) return '';
        const s = S[name];
        const frame = s.frames[0];
        
        const itemAliases = [];
        if (name.includes('-')) {
          const a = name.replace(/-/g, '');
          if (aliases.includes(a)) itemAliases.push(a);
        } else {
          const potentialAlias = name.replace(/-/g, '').replace('toggle-', 'toggle').replace('arrow-', 'arrow').replace('legacy-', 'legacy');
          if (aliases.includes(potentialAlias) && potentialAlias !== name) itemAliases.push(potentialAlias);
        }
        
        const aliasText = itemAliases.length > 0 ? ` ${dim}(alias: ${itemAliases.join(', ')})${reset}` : '';
        const preview = `${magenta}${frame}${reset}`;
        const label = `${bold}${name}${reset}`;
        const meta = `${dim}${s.frames.length}f · ${s.interval}ms${reset}`;
        return `  ${preview}  ${label} [${meta}]${aliasText}`;
      };
      
      const col1 = renderItem(items[j]);
      const col2 = renderItem(items[j+1]);
      
      const stripAnsi = (str) => str.replace(/\x1B\[\d+m/g, '');
      const visibleLength = stripAnsi(col1).length;
      const padAmount = Math.max(0, 52 - visibleLength);
      
      if (col2) {
        out.write(`${col1}${' '.repeat(padAmount)}${col2}\n`);
      } else {
        out.write(`${col1}\n`);
      }
    }
  }
  
  out.write('\n');
  process.exit(0);
}

// Get a writable TTY stream
if (!out.isTTY) {
  try {
    const fd = fs.openSync('/dev/tty', 'w');
    out = new tty.WriteStream(fd);
  } catch {
    // Fallback: no TTY available, list matched spinners and exit
    console.log(`${names.length} spinners matching filter: ${names.join(', ')}`);
    process.exit(0);
  }
}

const hide = '\x1B[?25l';
const show = '\x1B[?25h';
const bold = '\x1B[1m';
const dim = '\x1B[2m';
const magenta = '\x1B[35m';
const reset = '\x1B[0m';

out.write(hide);
const cleanup = () => { try { out.write(show); } catch {} };
process.on('SIGINT', () => { cleanup(); out.write('\n'); process.exit(0); });
process.on('exit', cleanup);

// Check for review mode
let reviewMode = args.includes('--review') || args.includes('-r');
if (reviewMode) {
  args = args.filter(a => a !== '--review' && a !== '-r');
}

let current = 0;
const single = names.length === 1;
let i = 0;
let ticksOnCurrent = 0;

// Enable raw mode so keypresses (q, Ctrl+C, Esc) are caught immediately
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    // q, Ctrl+C, or Escape
    if (key[0] === 0x71 || key[0] === 0x03 || key[0] === 0x1B && key.length === 1) {
      cleanup();
      out.write('\n');
      process.exit(0);
    }
    
    if (reviewMode) {
      // Right arrow: \x1b[C, Left arrow: \x1b[D, 'n': 0x6e, 'p': 0x70
      if (key[0] === 0x6e || (key.length === 3 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x43)) {
        current = (current + 1) % names.length;
        i = 0;
      } else if (key[0] === 0x70 || (key.length === 3 && key[0] === 0x1B && key[1] === 0x5B && key[2] === 0x44)) {
        current = (current - 1 + names.length) % names.length;
        i = 0;
      }
    }
  });
}

const TICKS_PER_SPINNER = 40;

const timer = setInterval(() => {
  const name = names[current];
  const s = S[name];
  const frame = s.frames[i % s.frames.length];
  const count = single ? '' : `${dim}[${current + 1}/${names.length}]${reset}`;
  const reviewHint = reviewMode ? `  ${dim}[n/→: next, p/←: prev, q: quit]${reset}` : '';

  out.write(`\r\x1B[2K  ${magenta}${frame}${reset}  ${bold}${name}${reset} ${dim}${s.interval}ms [${s.category || 'general'}]${reset}  ${count}${reviewHint}`);

  i++;
  ticksOnCurrent++;

  if (!single && !reviewMode && ticksOnCurrent >= TICKS_PER_SPINNER) {
    ticksOnCurrent = 0;
    i = 0;
    current = (current + 1) % names.length;
  }
}, 80);
