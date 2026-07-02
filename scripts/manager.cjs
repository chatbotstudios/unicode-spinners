#!/usr/bin/env node

/**
 * Unicode Animations TUI Manager
 * An interactive, high-fidelity Terminal User Interface (TUI) to view, play, search, 
 * create, edit, and delete standard and custom unicode/emoji spinner animations.
 * 
 * Works out-of-the-box with zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const tty = require('tty');

// Resolve local spinners
let S;
try {
  S = require(path.join(__dirname, '..', 'dist', 'index.cjs'));
  S = S.spinners || S.default;
} catch {
  console.error('\x1B[91mError: Core library not built. Running "npm run build" first...\x1B[0m');
  try {
    const { execSync } = require('child_process');
    execSync('npm run build', { cwd: path.join(__dirname, '..') });
    S = require(path.join(__dirname, '..', 'dist', 'index.cjs'));
    S = S.spinners || S.default;
  } catch (err) {
    console.error('\x1B[91mCompilation failed. Cannot run manager.\x1B[0m', err);
    process.exit(1);
  }
}

// Custom spinners storage path
const CUSTOM_SPINNERS_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.unicode-spinners-custom.json');

// Colors & Styling
const BOLD = '\x1B[1m';
const DIM = '\x1B[2m';
const RESET = '\x1B[0m';
const HIDE_CURSOR = '\x1B[?25l';
const SHOW_CURSOR = '\x1B[?25h';
const CLEAR_SCREEN = '\x1B[2J\x1B[H';

const PALETTE = {
  primary: '\x1B[95m',   // Bright Magenta
  secondary: '\x1B[96m', // Cyan
  success: '\x1B[92m',   // Light Green
  warning: '\x1B[93m',   // Yellow
  danger: '\x1B[91m',    // Light Red
  header: '\x1B[35m',    // Dark Purple
  info: '\x1B[94m',      // Light Blue
  gray: '\x1B[90m'       // Dark Gray
};

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
  custom:    '\x1B[92m'
};

// Global state
let customSpinners = {};
let allSpinners = {};
let currentView = 'MENU'; // MENU, BROWSE, SEARCH, CREATE, EDIT, DELETE, STATS, PLAY
let menuSelection = 0;
let browseSelection = 0;
let browseScrollOffset = 0;
let playActiveSpinnerName = null;
let globalTicker = null;
let searchInput = '';
let searchResults = [];

// Input state for spinner creation
let createForm = {
  name: '',
  interval: 100,
  category: 'custom',
  frames: [],
  currentStep: 0 // 0: Name, 1: Interval, 2: Category, 3: Frames
};

// Input state for editor
let editTargetName = '';
let editForm = {
  interval: 100,
  category: 'custom',
  frames: []
};

// Load custom spinners
function loadCustomSpinners() {
  try {
    if (fs.existsSync(CUSTOM_SPINNERS_PATH)) {
      const data = fs.readFileSync(CUSTOM_SPINNERS_PATH, 'utf8');
      customSpinners = JSON.parse(data);
    }
  } catch (e) {
    customSpinners = {};
  }
  mergeSpinners();
}

// Save custom spinners
function saveCustomSpinners() {
  try {
    fs.writeFileSync(CUSTOM_SPINNERS_PATH, JSON.stringify(customSpinners, null, 2), 'utf8');
  } catch (e) {
    // Fail silently or report on status bar
  }
  mergeSpinners();
}

// Merge standard & custom spinners
function mergeSpinners() {
  allSpinners = {};
  // Load standard ones
  for (const [key, val] of Object.entries(S)) {
    allSpinners[key] = { ...val, isCustom: false };
  }
  // Load custom ones
  for (const [key, val] of Object.entries(customSpinners)) {
    allSpinners[key] = { ...val, isCustom: true, category: val.category || 'custom' };
  }
}

// Initialize TTY Stream
let out = process.stdout;
if (!out.isTTY) {
  try {
    const fd = fs.openSync('/dev/tty', 'w+');
    out = new tty.WriteStream(fd);
  } catch {
    console.error('TTY not available. The manager requires an interactive terminal.');
    process.exit(1);
  }
}

function visibleHeight() { return out.rows || 24; }
function visibleWidth() { return out.columns || 80; }

// Keystroke routing
function handleInput(key) {
  // Global exit
  if (key[0] === 0x03) { // Ctrl-C
    shutdown();
  }

  switch (currentView) {
    case 'MENU':
      handleMenuInput(key);
      break;
    case 'BROWSE':
      handleBrowseInput(key);
      break;
    case 'PLAY':
      handlePlayInput(key);
      break;
    case 'SEARCH':
      handleSearchInput(key);
      break;
    case 'CREATE':
      handleCreateInput(key);
      break;
    case 'EDIT':
      handleEditInput(key);
      break;
    case 'DELETE':
      handleDeleteInput(key);
      break;
    case 'STATS':
      handleStatsInput(key);
      break;
  }
}

// Close and restore cursor
function shutdown() {
  if (globalTicker) clearInterval(globalTicker);
  out.write(SHOW_CURSOR + CLEAR_SCREEN);
  process.exit(0);
}

// Start CLI
function init() {
  loadCustomSpinners();
  out.write(HIDE_CURSOR);
  
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', handleInput);
  }

  // Handle terminal resizing
  out.on('resize', render);

  // Global high-fidelity animation ticker (80ms tick rate)
  globalTicker = setInterval(() => {
    if (currentView === 'BROWSE' || currentView === 'SEARCH' || currentView === 'PLAY') {
      render();
    }
  }, 80);
  
  render();
}

// Helper to strip ANSI codes
const stripAnsi = s => s.replace(/\x1B\[[0-9;]*m/g, '');

// Center text in terminal
function centerText(text, width) {
  const clean = stripAnsi(text);
  const pad = Math.max(0, Math.floor((width - clean.length) / 2));
  return ' '.repeat(pad) + text;
}

// ─── RENDERING VIEWS ─────────────────────────────────────────────────────────

function render() {
  out.write(CLEAR_SCREEN);
  
  // Header banner
  const w = visibleWidth();
  const title = ` ${PALETTE.primary}█${RESET} ${BOLD}UNICODE SPINNER MANAGER${RESET} ${PALETTE.primary}█${RESET} `;
  out.write('\r\n' + centerText(title, w) + '\r\n');
  out.write(centerText(`${DIM}────────────────────────────────────────────${RESET}`, w) + '\r\n\r\n');

  switch (currentView) {
    case 'MENU':
      renderMenu();
      break;
    case 'BROWSE':
      renderBrowse();
      break;
    case 'PLAY':
      renderPlay();
      break;
    case 'SEARCH':
      renderSearch();
      break;
    case 'CREATE':
      renderCreate();
      break;
    case 'EDIT':
      renderEdit();
      break;
    case 'DELETE':
      renderDelete();
      break;
    case 'STATS':
      renderStats();
      break;
  }
}

// --- MENU VIEW ---
const MENU_OPTIONS = [
  '🔍 Browse & Play Spinners',
  '📊 Database Statistics',
  '🚪 Quit Manager'
];

function renderMenu() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  // Draw options
  const listHeight = MENU_OPTIONS.length;
  const startRow = Math.max(5, Math.floor((h - listHeight - 8) / 2));
  
  out.write('\n'.repeat(startRow - 5));
  
  for (let i = 0; i < MENU_OPTIONS.length; i++) {
    const isSelected = i === menuSelection;
    const bullet = isSelected ? `${PALETTE.primary}➔${RESET} ` : '  ';
    const text = isSelected ? `${BOLD}${PALETTE.primary}${MENU_OPTIONS[i]}${RESET}` : `${DIM}${MENU_OPTIONS[i]}${RESET}`;
    out.write(centerText(`${bullet}${text}`, w + (isSelected ? 18 : 0)) + '\r\n\n');
  }

  // Footer status bar
  out.write('\n'.repeat(Math.max(1, h - listHeight * 2 - startRow - 4)));
  const footerText = `${DIM}Use ${BOLD}↑↓ / j k${RESET}${DIM} to navigate · ${BOLD}Enter${RESET}${DIM} to select · ${BOLD}Ctrl-C${RESET}${DIM} to quit${RESET}`;
  out.write(centerText(footerText, w) + '\r\n');
}

function handleMenuInput(key) {
  // Escape/q to quit
  if (key[0] === 0x1B && key.length === 1 || key[0] === 0x71) {
    shutdown();
  }

  // Arrow Up or k
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x41) || key[0] === 0x6B) {
    menuSelection = (menuSelection - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
    render();
  }
  // Arrow Down or j
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x42) || key[0] === 0x6A) {
    menuSelection = (menuSelection + 1) % MENU_OPTIONS.length;
    render();
  }

  // Enter
  if (key[0] === 0x0D) {
    switch (menuSelection) {
      case 0:
        currentView = 'BROWSE';
        browseSelection = 0;
        browseScrollOffset = 0;
        break;
      case 1:
        currentView = 'STATS';
        break;
      case 2:
        shutdown();
        break;
    }
    render();
  }
}

// --- BROWSE VIEW ---
function isAlias(key) {
  if (!key.includes('-')) {
    const dashed = key.replace(/([0-9]+)/g, '-$1').replace(/([a-z]+)([A-Z])/g, '$1-$2').toLowerCase();
    if (dashed !== key && allSpinners[dashed]) return true;
  }
  return false;
}

function getPrimarySpinners() {
  return Object.keys(allSpinners).filter(n => !isAlias(n)).sort((a, b) => {
    // Put custom ones first
    const aCustom = allSpinners[a].isCustom;
    const bCustom = allSpinners[b].isCustom;
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;
    return a.localeCompare(b);
  });
}

function renderBrowse() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  const primaries = getPrimarySpinners();
  const total = primaries.length;
  
  const listHeight = h - 9; // margins
  
  // Clamp scrolling
  if (browseSelection >= browseScrollOffset + listHeight) {
    browseScrollOffset = browseSelection - listHeight + 1;
  } else if (browseSelection < browseScrollOffset) {
    browseScrollOffset = browseSelection;
  }
  browseScrollOffset = Math.max(0, Math.min(browseScrollOffset, total - listHeight));

  const visibleSpinners = primaries.slice(browseScrollOffset, browseScrollOffset + listHeight);

  out.write(`  ${BOLD}${PALETTE.secondary}DATABASE EXPLORER${RESET}  ${DIM}(${total} primary spinners)${RESET}\r\n\n`);

  for (let i = 0; i < visibleSpinners.length; i++) {
    const actualIndex = browseScrollOffset + i;
    const name = visibleSpinners[i];
    const isSelected = actualIndex === browseSelection;
    const item = allSpinners[name];
    
    const indicator = isSelected ? `${PALETTE.primary}➔${RESET} ` : '  ';
    const activeColor = isSelected ? BOLD + PALETTE.primary : RESET;
    const category = item.category || 'general';
    const catColor = CAT_COLORS[category] || RESET;
    
    // Calculate live frame index based on timestamp
    const elapsedMs = Date.now();
    const frameIndex = Math.floor(elapsedMs / item.interval) % item.frames.length;
    const liveFrame = item.frames[frameIndex];
    
    const tag = item.isCustom ? ` ${PALETTE.success}[CUSTOM]${RESET}` : '';
    
    const namePadding = name.padEnd(25);
    const line = `${indicator}${activeColor}${namePadding}${RESET} ${DIM}│${RESET} ${catColor}${category.padEnd(10)}${RESET} ${DIM}│${RESET} ${item.interval.toString().padStart(4)}ms ${DIM}│${RESET} ${item.frames.length.toString().padStart(3)}f ${DIM}│${RESET}  ${catColor}${liveFrame}${RESET}${tag}`;
    out.write(line + '\r\n');
  }

  // Fill empty rows if needed
  if (visibleSpinners.length < listHeight) {
    out.write('\r\n'.repeat(listHeight - visibleSpinners.length));
  }

  // Footer status bar
  out.write(`\r\n${DIM}Use ${BOLD}↑↓ / j k${RESET}${DIM} to navigate · ${BOLD}Enter${RESET}${DIM} to Play/Animate · ${BOLD}Esc / q${RESET}${DIM} back to menu${RESET}`);
}

function handleBrowseInput(key) {
  const primaries = getPrimarySpinners();
  const total = primaries.length;

  if (key[0] === 0x1B && key.length === 1 || key[0] === 0x71) { // Esc or q
    currentView = 'MENU';
    render();
    return;
  }

  // Arrow Up or k
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x41) || key[0] === 0x6B) {
    browseSelection = (browseSelection - 1 + total) % total;
    render();
  }
  // Arrow Down or j
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x42) || key[0] === 0x6A) {
    browseSelection = (browseSelection + 1) % total;
    render();
  }

  // Enter to Play
  if (key[0] === 0x0d) {
    const name = primaries[browseSelection];
    startPlayback(name);
  }
}

// --- PLAY VIEW ---
function startPlayback(name) {
  playActiveSpinnerName = name;
  currentView = 'PLAY';
  render();
}

function renderPlay() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  const name = playActiveSpinnerName;
  const s = allSpinners[name];
  
  const elapsedMs = Date.now();
  const frameIndex = Math.floor(elapsedMs / s.interval) % s.frames.length;
  const frame = s.frames[frameIndex];
  
  const cat = s.category || 'general';
  const tag = s.isCustom ? ` ${PALETTE.success}[CUSTOM]${RESET}` : '';

  out.write(`  ${BOLD}${PALETTE.secondary}PLAYBACK VIEW${RESET}\r\n\n`);
  
  const startRow = Math.max(3, Math.floor((h - 10) / 2));
  out.write('\n'.repeat(startRow));

  // Huge Spinner Display
  const frameText = `\x1B[1m\x1B[95m${frame}\x1B[0m`;
  out.write(centerText(frameText, w) + '\r\n\n');
  
  const desc = `${BOLD}${name}${RESET}  ${DIM}(category: ${cat} · ${s.frames.length} frames · ${s.interval}ms)${RESET}${tag}`;
  out.write(centerText(desc, w) + '\r\n');

  out.write('\n'.repeat(Math.max(1, h - startRow - 11)));
  
  const hint = `${DIM}Playing spinner in real-time... Press ${BOLD}Esc / q / Backspace${RESET}${DIM} to stop${RESET}`;
  out.write(centerText(hint, w) + '\r\n');
}

function handlePlayInput(key) {
  if (key[0] === 0x1B || key[0] === 0x71 || key[0] === 0x7F || key[0] === 0x08) { // Esc, q, or Backspace
    currentView = 'BROWSE';
    render();
  }
}

// --- SEARCH VIEW ---
function renderSearch() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  out.write(`  ${BOLD}${PALETTE.secondary}FAST SPINNER SEARCH${RESET}\r\n\n`);
  
  // Search bar
  const searchBar = `  ${BOLD}Search Pattern:${RESET}  \x1B[4m${searchInput.padEnd(30)}\x1B[0m  ${DIM}(Type letters/numbers, Backspace to delete)${RESET}`;
  out.write(searchBar + '\r\n\n');
  
  // Filter results
  const term = searchInput.trim().toLowerCase();
  if (term.length === 0) {
    searchResults = [];
    out.write('\r\n  Enter a name, category, or frame characters to start searching...\r\n');
  } else {
    searchResults = Object.keys(allSpinners).filter(name => {
      if (isAlias(name)) return false;
      const s = allSpinners[name];
      return name.toLowerCase().includes(term) || 
             (s.category && s.category.toLowerCase().includes(term)) ||
             s.frames.some(f => f.includes(term));
    });
  }

  const resultsToShow = searchResults.slice(0, h - 11);
  if (searchResults.length > 0) {
    out.write(`  ${BOLD}${PALETTE.success}${searchResults.length} Match(es) Found:${RESET}\r\n\n`);
    for (let i = 0; i < resultsToShow.length; i++) {
      const name = resultsToShow[i];
      const isSelected = i === menuSelection % resultsToShow.length; // reuse menuSelection
      const indicator = isSelected ? `${PALETTE.primary}➔${RESET} ` : '  ';
      const item = allSpinners[name];
      const activeColor = isSelected ? BOLD + PALETTE.primary : RESET;
      const customTag = item.isCustom ? ` ${PALETTE.success}[CUSTOM]${RESET}` : '';
      
      const elapsedMs = Date.now();
      const frameIndex = Math.floor(elapsedMs / item.interval) % item.frames.length;
      const liveFrame = item.frames[frameIndex];
      const catColor = CAT_COLORS[item.category || 'general'] || RESET;
      
      out.write(`${indicator}${activeColor}${name.padEnd(25)}${RESET} ${DIM}│${RESET} ${item.category.padEnd(10)} ${DIM}│${RESET}  ${catColor}${liveFrame}${RESET}  ${DIM}(${item.frames.length}f · ${item.interval}ms)${customTag}\r\n`);
    }
    
    if (searchResults.length > resultsToShow.length) {
      out.write(`  ${DIM}... and ${searchResults.length - resultsToShow.length} more. Refine your query.${RESET}\r\n`);
    }
  } else if (term.length > 0) {
    out.write(`  ${PALETTE.danger}No spinners found matching "${searchInput}"${RESET}\r\n`);
  }

  // Footer status bar
  out.write('\n'.repeat(Math.max(1, h - resultsToShow.length - 12)));
  const footerText = `${DIM}Keys: ${BOLD}Letters/Digits${RESET}${DIM} search · ${BOLD}Backspace${RESET}${DIM} delete · ${BOLD}↑↓${RESET}${DIM} select match · ${BOLD}Enter${RESET}${DIM} Play · ${BOLD}Esc${RESET}${DIM} Menu${RESET}`;
  out.write(centerText(footerText, w) + '\r\n');
}

function handleSearchInput(key) {
  if (key[0] === 0x1B) { // Esc
    currentView = 'MENU';
    render();
    return;
  }

  // Arrow navigation of matches
  if (searchResults.length > 0) {
    if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x41) { // Up
      menuSelection = (menuSelection - 1 + searchResults.length) % searchResults.length;
      render();
      return;
    }
    if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x42) { // Down
      menuSelection = (menuSelection + 1) % searchResults.length;
      render();
      return;
    }
    if (key[0] === 0x0D) { // Enter to play
      const name = searchResults[menuSelection % searchResults.length];
      startPlayback(name);
      return;
    }
  }

  // Handle character inputs
  if (key[0] === 0x7F || key[0] === 0x08) { // Backspace
    searchInput = searchInput.slice(0, -1);
    menuSelection = 0;
    render();
  } else if (key[0] >= 32 && key[0] <= 126 && key.length === 1) { // Printable chars
    searchInput += key.toString('utf8');
    menuSelection = 0;
    render();
  }
}

// --- CREATE VIEW (Multi-step Wizard) ---
function renderCreate() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  out.write(`  ${BOLD}${PALETTE.secondary}CREATING NEW CUSTOM SPINNER${RESET}\r\n\n`);

  // Progress breadcrumbs
  const steps = ['Name', 'Interval', 'Category', 'Frames'];
  let breadcrumb = '  ';
  for (let i = 0; i < steps.length; i++) {
    const isCurrent = i === createForm.currentStep;
    const isDone = i < createForm.currentStep;
    const color = isCurrent ? BOLD + PALETTE.primary : isDone ? PALETTE.success : DIM;
    breadcrumb += `${color}[Step ${i+1}: ${steps[i]}]${RESET}  `;
  }
  out.write(breadcrumb + '\r\n\r\n');

  // Draw fields
  out.write(`  ${BOLD}1. Spinner Identifier:${RESET}  ${createForm.name || `${DIM}(Enter unique name)${RESET}`}\r\n`);
  out.write(`  ${BOLD}2. Frame Duration:${RESET}      ${createForm.interval} ms\r\n`);
  out.write(`  ${BOLD}3. Category Classification:${RESET} ${createForm.category}\r\n`);
  
  const framePreview = createForm.frames.length > 0 
    ? `${PALETTE.primary}${createForm.frames.join(' ')}${RESET} ${DIM}(${createForm.frames.length} frames total)${RESET}`
    : `${DIM}(No frames entered yet)${RESET}`;
  out.write(`  ${BOLD}4. Animation Frames:${RESET}     ${framePreview}\r\n\n`);

  out.write(`  ${DIM}────────────────────────────────────────────${RESET}\r\n\n`);

  // Step-specific interaction
  switch (createForm.currentStep) {
    case 0:
      out.write(`  ${BOLD}${PALETTE.secondary}Type Spinner Name:${RESET}  \x1B[4m${createForm.name.padEnd(20)}\x1B[0m\r\n\n`);
      out.write(`  ${DIM}Use standard alphanumeric names, e.g. "rocket-blast" or "loading-block".${RESET}\r\n`);
      break;
    case 1:
      out.write(`  ${BOLD}${PALETTE.secondary}Set Interval (ms):${RESET}  ${BOLD}${PALETTE.secondary}◀  ${createForm.interval} ms  ▶${RESET}\r\n\n`);
      out.write(`  ${DIM}Use Left/Right arrows to adjust interval in increments of 10ms.${RESET}\r\n`);
      break;
    case 2:
      out.write(`  ${BOLD}${PALETTE.secondary}Type Category Name:${RESET} \x1B[4m${createForm.category.padEnd(20)}\x1B[0m\r\n\n`);
      out.write(`  ${DIM}Press Enter to accept standard "custom" or type your own tag.${RESET}\r\n`);
      break;
    case 3:
      out.write(`  ${BOLD}${PALETTE.secondary}Animation Frames Builder:${RESET}\r\n\n`);
      out.write(`  ${BOLD}Type individual frames (e.g. emojis or characters):${RESET}\r\n`);
      out.write(`  👉 Enter frame character(s), then press ${BOLD}Enter${RESET} to push to list.\r\n`);
      out.write(`  👉 Press ${BOLD}Backspace${RESET} to delete the last frame.\r\n`);
      out.write(`  👉 Press ${BOLD}d${RESET} when ${BOLD}done${RESET} to save and persist!\r\n`);
      break;
  }

  // Footer status bar
  out.write('\n'.repeat(Math.max(1, h - 18)));
  const footerText = `${DIM}Enter to Proceed · Escape to cancel creation and return to Menu${RESET}`;
  out.write(centerText(footerText, w) + '\r\n');
}

let tempFrameInput = ''; // buffers frame character typed

function handleCreateInput(key) {
  if (key[0] === 0x1B) { // Esc
    currentView = 'MENU';
    render();
    return;
  }

  // STEP 0: NAME
  if (createForm.currentStep === 0) {
    if (key[0] === 0x0D) { // Enter
      createForm.name = createForm.name.trim().toLowerCase().replace(/\s+/g, '-');
      if (createForm.name.length === 0) return;
      // check if exists
      if (allSpinners[createForm.name]) {
        createForm.name = ''; // clear and ask again
        return;
      }
      createForm.currentStep = 1;
      render();
    } else if (key[0] === 0x7F || key[0] === 0x08) { // Backspace
      createForm.name = createForm.name.slice(0, -1);
      render();
    } else if (key[0] >= 32 && key[0] <= 126 && key.length === 1) {
      createForm.name += key.toString('utf8');
      render();
    }
    return;
  }

  // STEP 1: INTERVAL
  if (createForm.currentStep === 1) {
    if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x44) { // Left Arrow
      createForm.interval = Math.max(10, createForm.interval - 10);
      render();
    }
    if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x43) { // Right Arrow
      createForm.interval = Math.min(2000, createForm.interval + 10);
      render();
    }
    if (key[0] === 0x0D) { // Enter
      createForm.currentStep = 2;
      render();
    }
    return;
  }

  // STEP 2: CATEGORY
  if (createForm.currentStep === 2) {
    if (key[0] === 0x0D) { // Enter
      createForm.category = createForm.category.trim().toLowerCase() || 'custom';
      createForm.currentStep = 3;
      tempFrameInput = '';
      render();
    } else if (key[0] === 0x7F || key[0] === 0x08) { // Backspace
      createForm.category = createForm.category.slice(0, -1);
      render();
    } else if (key[0] >= 32 && key[0] <= 126 && key.length === 1) {
      createForm.category += key.toString('utf8');
      render();
    }
    return;
  }

  // STEP 3: FRAMES
  if (createForm.currentStep === 3) {
    // If user types 'd' when not typing frames, it signals completion
    if (key.toString('utf8') === 'd' && createForm.frames.length > 0) {
      // Save and compile!
      customSpinners[createForm.name] = {
        frames: createForm.frames,
        interval: createForm.interval,
        category: createForm.category
      };
      saveCustomSpinners();
      currentView = 'MENU';
      render();
      return;
    }

    if (key[0] === 0x0D) { // Enter: push buffer to frames
      const val = tempFrameInput.trim();
      if (val.length > 0) {
        createForm.frames.push(val);
        tempFrameInput = '';
        render();
      }
    } else if (key[0] === 0x7F || key[0] === 0x08) { // Backspace: remove last frame
      if (tempFrameInput.length > 0) {
        tempFrameInput = tempFrameInput.slice(0, -1);
      } else {
        createForm.frames.pop();
      }
      render();
    } else if (key.length >= 1) { // Accept typed emoji or character string
      // emojis have multi-byte signatures, so read the whole key input
      const chunk = key.toString('utf8');
      if (chunk !== 'd') {
        tempFrameInput += chunk;
        // Auto-push if it looks like a single emoji (e.g. length > 1 or contains specific range)
        // For convenience, push immediately if it is a complete emoji character sequence
        if (chunk.length > 1 || (key[0] === 0xf0 && key.length >= 4)) {
          createForm.frames.push(tempFrameInput.trim());
          tempFrameInput = '';
        }
        render();
      }
    }
  }
}

// --- EDIT VIEW ---
function getCustomSpinnersList() {
  return Object.keys(customSpinners).sort();
}

function renderEdit() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  out.write(`  ${BOLD}${PALETTE.secondary}EDIT CUSTOM SPINNERS${RESET}\r\n\n`);

  const list = getCustomSpinnersList();
  
  if (list.length === 0) {
    out.write(`  ${PALETTE.warning}There are no custom spinners registered in the database yet.${RESET}\r\n`);
    out.write(`  👉 Go to the main menu and select "${BOLD}Create Custom Spinner${RESET}" to add one.\r\n\n`);
    out.write(`\n`.repeat(Math.max(1, h - 10)));
    out.write(centerText(`${DIM}Press any key to return to Main Menu${RESET}`, w) + '\r\n');
    return;
  }

  if (!editTargetName) {
    // Selection mode
    out.write(`  ${BOLD}Select a Custom Spinner to Modify:${RESET}\r\n\n`);
    
    for (let i = 0; i < list.length; i++) {
      const name = list[i];
      const isSelected = i === browseSelection;
      const indicator = isSelected ? `${PALETTE.primary}➔${RESET} ` : '  ';
      const activeColor = isSelected ? BOLD + PALETTE.primary : RESET;
      const s = customSpinners[name];
      
      out.write(`${indicator}${activeColor}${name.padEnd(25)}${RESET} ${DIM}│${RESET} ${s.category.padEnd(10)} ${DIM}│${RESET} ${s.frames.join(' ')} ${DIM}(${s.frames.length}f · ${s.interval}ms)${RESET}\r\n`);
    }

    out.write('\n'.repeat(Math.max(1, h - list.length - 10)));
    out.write(centerText(`${DIM}Use ↑↓ to navigate · Enter to edit · Esc to cancel${RESET}`, w) + '\r\n');
  } else {
    // Editor Form
    out.write(`  ${BOLD}Modifying:${RESET}  ${PALETTE.success}${editTargetName}${RESET}\r\n\n`);
    out.write(`  ${BOLD}1. Frame Duration:${RESET}      ${editForm.interval} ms\r\n`);
    
    const framePreview = editForm.frames.length > 0 
      ? `${PALETTE.primary}${editForm.frames.join(' ')}${RESET} ${DIM}(${editForm.frames.length} frames total)${RESET}`
      : `${DIM}(No frames entered yet)${RESET}`;
    out.write(`  ${BOLD}2. Animation Frames:${RESET}     ${framePreview}\r\n\n`);
    
    out.write(`  ${DIM}────────────────────────────────────────────${RESET}\r\n\n`);

    if (createForm.currentStep === 1) { // re-use step trackers
      out.write(`  ${BOLD}${PALETTE.secondary}Set New Interval (ms):${RESET}  ${BOLD}${PALETTE.secondary}◀  ${editForm.interval} ms  ▶${RESET}\r\n\n`);
      out.write(`  ${DIM}Use Left/Right arrows to adjust, then press Enter.${RESET}\r\n`);
    } else {
      out.write(`  ${BOLD}${PALETTE.secondary}Modifying Frames:${RESET}\r\n\n`);
      out.write(`  👉 Enter frame character(s), then press ${BOLD}Enter${RESET} to push to list.\r\n`);
      out.write(`  👉 Press ${BOLD}Backspace${RESET} to delete the last frame.\r\n`);
      out.write(`  👉 Press ${BOLD}s${RESET} when ${BOLD}done${RESET} to save changes!\r\n`);
    }

    out.write('\n'.repeat(Math.max(1, h - 15)));
    out.write(centerText(`${DIM}Enter to proceed step · Esc to abort editing${RESET}`, w) + '\r\n');
  }
}

function handleEditInput(key) {
  const list = getCustomSpinnersList();
  
  if (list.length === 0) {
    currentView = 'MENU';
    render();
    return;
  }

  if (key[0] === 0x1B) { // Esc
    if (editTargetName) {
      editTargetName = ''; // go back to list
      render();
    } else {
      currentView = 'MENU';
      render();
    }
    return;
  }

  if (!editTargetName) {
    // Arrow navigation
    if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x41) || key[0] === 0x6B) { // Up
      browseSelection = (browseSelection - 1 + list.length) % list.length;
      render();
    }
    if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x42) || key[0] === 0x6A) { // Down
      browseSelection = (browseSelection + 1) % list.length;
      render();
    }
    if (key[0] === 0x0D) { // Enter to select target
      const target = list[browseSelection];
      editTargetName = target;
      editForm = {
        interval: customSpinners[target].interval,
        category: customSpinners[target].category,
        frames: [...customSpinners[target].frames]
      };
      createForm.currentStep = 1; // start with interval step
      render();
    }
  } else {
    // Edit Form Logic
    if (createForm.currentStep === 1) { // INTERVAL
      if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x44) { // Left
        editForm.interval = Math.max(10, editForm.interval - 10);
        render();
      }
      if (key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x43) { // Right
        editForm.interval = Math.min(2000, editForm.interval + 10);
        render();
      }
      if (key[0] === 0x0D) { // Enter
        createForm.currentStep = 3; // jump to frames step
        tempFrameInput = '';
        render();
      }
    } else { // FRAMES
      if (key.toString('utf8') === 's' && editForm.frames.length > 0) {
        customSpinners[editTargetName] = {
          frames: editForm.frames,
          interval: editForm.interval,
          category: editForm.category
        };
        saveCustomSpinners();
        editTargetName = '';
        currentView = 'MENU';
        render();
        return;
      }

      if (key[0] === 0x0D) { // Enter: push frame
        const val = tempFrameInput.trim();
        if (val.length > 0) {
          editForm.frames.push(val);
          tempFrameInput = '';
          render();
        }
      } else if (key[0] === 0x7F || key[0] === 0x08) { // Backspace
        if (tempFrameInput.length > 0) {
          tempFrameInput = tempFrameInput.slice(0, -1);
        } else {
          editForm.frames.pop();
        }
        render();
      } else if (key.length >= 1) {
        const chunk = key.toString('utf8');
        if (chunk !== 's') {
          tempFrameInput += chunk;
          if (chunk.length > 1 || (key[0] === 0xf0 && key.length >= 4)) {
            editForm.frames.push(tempFrameInput.trim());
            tempFrameInput = '';
          }
          render();
        }
      }
    }
  }
}

// --- DELETE VIEW ---
function renderDelete() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  out.write(`  ${BOLD}${PALETTE.danger}DELETE CUSTOM SPINNERS${RESET}\r\n\n`);

  const list = getCustomSpinnersList();
  
  if (list.length === 0) {
    out.write(`  ${PALETTE.warning}There are no custom spinners registered in the database to delete.${RESET}\r\n\n`);
    out.write(`\n`.repeat(Math.max(1, h - 8)));
    out.write(centerText(`${DIM}Press any key to return to Main Menu${RESET}`, w) + '\r\n');
    return;
  }

  out.write(`  ${BOLD}${PALETTE.danger}Select a Custom Spinner to PERMANENTLY Delete:${RESET}\r\n\n`);
  
  for (let i = 0; i < list.length; i++) {
    const name = list[i];
    const isSelected = i === browseSelection;
    const indicator = isSelected ? `${PALETTE.danger}➔${RESET} ` : '  ';
    const activeColor = isSelected ? BOLD + PALETTE.danger : RESET;
    const s = customSpinners[name];
    
    out.write(`${indicator}${activeColor}${name.padEnd(25)}${RESET} ${DIM}│${RESET} ${s.category.padEnd(10)} ${DIM}│${RESET} ${s.frames.join(' ')} ${DIM}(${s.frames.length}f · ${s.interval}ms)${RESET}\r\n`);
  }

  out.write('\n'.repeat(Math.max(1, h - list.length - 10)));
  out.write(centerText(`${BOLD}${PALETTE.danger}WARNING: Deleting cannot be undone. Enter to confirm deletion. Esc to abort.${RESET}`, w) + '\r\n');
}

function handleDeleteInput(key) {
  const list = getCustomSpinnersList();
  
  if (list.length === 0) {
    currentView = 'MENU';
    render();
    return;
  }

  if (key[0] === 0x1B) { // Esc
    currentView = 'MENU';
    render();
    return;
  }

  // Arrow navigation
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x41) || key[0] === 0x6B) { // Up
    browseSelection = (browseSelection - 1 + list.length) % list.length;
    render();
  }
  if ((key.length === 3 && key[0] === 0x1b && key[1] === 0x5b && key[2] === 0x42) || key[0] === 0x6A) { // Down
    browseSelection = (browseSelection + 1) % list.length;
    render();
  }

  // Confirm delete
  if (key[0] === 0x0D) { // Enter
    const target = list[browseSelection];
    delete customSpinners[target];
    saveCustomSpinners();
    browseSelection = 0;
    render();
  }
}

// --- DATABASE STATS VIEW ---
function renderStats() {
  const w = visibleWidth();
  const h = visibleHeight();
  
  out.write(`  ${BOLD}${PALETTE.secondary}DATABASE STATISTICS & AUDIT${RESET}\r\n\n`);

  const total = Object.keys(allSpinners).length;
  const aliasesCount = Object.keys(allSpinners).filter(isAlias).length;
  const primaryCount = total - aliasesCount;
  const customCount = Object.keys(customSpinners).length;

  out.write(`  ${BOLD}Total Registrations:${RESET}   ${BOLD}${total}${RESET} ${DIM}(including camelCase aliases)${RESET}\r\n`);
  out.write(`  ${BOLD}Primary Configurations:${RESET} ${BOLD}${primaryCount}${RESET}\r\n`);
  out.write(`  ${BOLD}Custom Spinners:${RESET}       ${BOLD}${customCount}${RESET} ${DIM}(stored in ~/.unicode-spinners-custom.json)${RESET}\r\n\n`);

  // Category counts
  const categories = {};
  for (const name of Object.keys(allSpinners)) {
    if (isAlias(name)) continue;
    const cat = allSpinners[name].category || 'general';
    categories[cat] = (categories[cat] || 0) + 1;
  }

  out.write(`  ${BOLD}Distribution by Category:${RESET}\r\n`);
  for (const [cat, count] of Object.entries(categories).sort((a,b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.round((count / primaryCount) * 40)) || '▏';
    const catColor = CAT_COLORS[cat] || RESET;
    out.write(`    ${catColor}${cat.padEnd(12)}${RESET} [${count.toString().padStart(3)}] : ${PALETTE.secondary}${bar}${RESET}\r\n`);
  }

  // Audit slowest and fastest
  const primaries = Object.keys(allSpinners).filter(n => !isAlias(n));
  const sortedBySpeed = [...primaries].sort((a, b) => allSpinners[a].interval - allSpinners[b].interval);
  
  out.write(`\n  ${BOLD}Speed Analysis:${RESET}\r\n`);
  out.write(`    ⚡️ ${BOLD}Fastest Animation:${RESET} "${sortedBySpeed[0]}" (${allSpinners[sortedBySpeed[0]].interval}ms)\r\n`);
  out.write(`    🐢 ${BOLD}Slowest Animation:${RESET} "${sortedBySpeed[sortedBySpeed.length - 1]}" (${allSpinners[sortedBySpeed[sortedBySpeed.length - 1]].interval}ms)\r\n`);

  out.write('\n'.repeat(Math.max(1, h - Object.keys(categories).length - 16)));
  out.write(centerText(`${DIM}Press any key to return to Main Menu${RESET}`, w) + '\r\n');
}

function handleStatsInput() {
  currentView = 'MENU';
  render();
}

// ─── STARTUP ─────────────────────────────────────────────────────────────────
init();
