export interface Spinner {
  readonly frames: readonly string[];
  readonly interval: number;
  readonly category?: string;
}

// Procedural generators from braille.ts will be merged dynamically in braille.ts.
// This file registers all 150 standard static and custom composite animations.
export const staticSpinners: Record<string, Spinner> = {
  // 1-18: Core Braille Set
  braille: {
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    interval: 80,
    category: 'braille',
  },
  braillewave: {
    frames: ['⡀⠀', '⢀⠀', '⠠⠀', '⠐⠀', '⠈⠀', '⠁⠀', '⠂⠀', '⠄⠀'],
    interval: 80,
    category: 'braille',
  },
  'dots-2': {
    frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    interval: 80,
    category: 'braille',
  },
  'dots-3': {
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    interval: 80,
    category: 'braille',
  },
  'dots-4': {
    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲'],
    interval: 80,
    category: 'braille',
  },
  'dots-5': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-6': {
    frames: ['⠁', '⠉', '⠙', '⠚', '⠖', '⠦', '⠤', '⠠'],
    interval: 80,
    category: 'braille',
  },
  'dots-7': {
    frames: ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿'],
    interval: 80,
    category: 'braille',
  },
  'dots-8': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-9': {
    frames: ['⢄', '⢂', '⢁', '⡁', '⡂', '⡄', '⡈', '⢈'],
    interval: 80,
    category: 'braille',
  },
  'dots-10': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-11': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-12': {
    frames: ['⢀', '⠠', '⠐', '⠈', '⠁', '⠂', '⠄', '⡀'],
    interval: 80,
    category: 'braille',
  },
  'dots-13': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-14': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'dots-8bit': {
    frames: ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿'],
    interval: 80,
    category: 'braille',
  },
  'dots-circle': {
    frames: ['⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐'],
    interval: 80,
    category: 'braille',
  },
  dna: {
    frames: ['⠋⠉⠙⠚', '⠉⠙⠚⠒', '⠙⠚⠒⠤', '⠚⠒⠤⠭', '⠒⠤⠭⠳', '⠤⠭⠳⡪', '⠭⠳⡪⣜'],
    interval: 100,
    category: 'braille',
  },

  // 19-36: The Radar & Physics Set
  radar: {
    frames: ['⠁', '⠉', '⠙', '⠚', '⠖', '⠦', '⠤', '⠠'],
    interval: 100,
    category: 'braille',
  },
  'radar-2': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 100,
    category: 'braille',
  },
  scan: {
    frames: ['⡇', '⠏', '⠛', '⠹', '⢸', '⣰', '⣤', '⣆'],
    interval: 70,
    category: 'braille',
  },
  scanline: {
    frames: ['⠒⠒⠒', '⠤⠤⠤', '⣀⣀⣀', '⠤⠤⠤'],
    interval: 120,
    category: 'braille',
  },
  rain: {
    frames: ['⠠', '⠐', '⠈', '⠁', '⠂', '⠄', '⡀', '⢀'],
    interval: 100,
    category: 'braille',
  },
  sand: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 120,
    category: 'braille',
  },
  sparkle: {
    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲'],
    interval: 150,
    category: 'braille',
  },
  'checker-board': {
    frames: ['⡒', '⢔', '⡒', '⢔'],
    interval: 250,
    category: 'braille',
  },
  helix: {
    frames: ['⠙⠢⣄⣠', '⠙⠢⣄⣠', '⠚⠔⣠⣄', '⠖⠒⣠⣄'],
    interval: 80,
    category: 'braille',
  },
  waverows: {
    frames: ['⠉', '⠒', '⠤', '⣀', '⠤', '⠒'],
    interval: 90,
    category: 'braille',
  },
  snake: {
    frames: ['⠭⠳⡪⣜', '⢗⠳⡪⣜', '⢗⠹⡪⣜', '⢗⠹⢪⣜'],
    interval: 80,
    category: 'braille',
  },
  random: {
    frames: ['⠂', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 100,
    category: 'braille',
  },
  orbit: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 100,
    category: 'braille',
  },
  bounce: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  breathe: {
    frames: ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿', '⣷', '⣧', '⣇', '⡇', '⠇', '⠃'],
    interval: 100,
    category: 'braille',
  },
  spiral: {
    frames: ['⠟', '⠯', '⠷', '⠾', '⠽', '⠻'],
    interval: 100,
    category: 'braille',
  },
  vortex: {
    frames: ['⠟', '⠯', '⠷', '⠾', '⠽', '⠻'],
    interval: 80,
    category: 'braille',
  },
  cascade: {
    frames: ['⡄', '⠆', '⠃', '⠉', '⠈', '⠐', '⠠', '⢀', '⡀', '⠄', '⠂', '⠁'],
    interval: 60,
    category: 'braille',
  },

  // 37-72: Structural & Fluid Set
  columns: {
    frames: ['⡄⠀', '⠆⠀', '⠃⠀', '⠉⠀'],
    interval: 100,
    category: 'braille',
  },
  fillsweep: {
    frames: ['⣄', '⣆', '⡇', '⠏', '⠛', '⠹', '⢸', '⣰'],
    interval: 80,
    category: 'braille',
  },
  diagswipe: {
    frames: ['⡿', '⠟', '⠻', '⠽', '⡿'],
    interval: 100,
    category: 'braille',
  },
  pendulum: {
    frames: ['⡇', '⠸', '⠴', '⠦', '⠇'],
    interval: 120,
    category: 'braille',
  },
  wipe: {
    frames: ['⡇', '⠏', '⠛', '⠹', '⢸'],
    interval: 100,
    category: 'braille',
  },
  zigzag: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'wave-2': {
    frames: ['⠂', '⠒', '⠲', '⠴', '⠦', '⠖'],
    interval: 100,
    category: 'braille',
  },
  'progress-dots': {
    frames: ['⠀', '⠄', '⠆', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿'],
    interval: 150,
    category: 'progress',
  },
  typewriter: {
    frames: ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿'],
    interval: 120,
    category: 'progress',
  },
  blink: {
    frames: ['⣿', '⠀'],
    interval: 500,
    category: 'simple',
  },
  eyeblink: {
    frames: ['⠶', '⠒', '⠀', '⠒', '⠶'],
    interval: 150,
    category: 'simple',
  },
  heartbeat: {
    frames: ['⣏⣹', '⣟⣻', '⣿⣿', '⣟⣻', '⣏⣹'],
    interval: 120,
    category: 'simple',
  },
  pulse: {
    frames: ['⠰', '⠴', '⠿', '⠴', '⠰'],
    interval: 100,
    category: 'braille',
  },
  'pulse-soft': {
    frames: ['⠠', '⠤', '⠶', '⠤', '⠠'],
    interval: 120,
    category: 'braille',
  },
  'pulse-burst': {
    frames: ['⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐'],
    interval: 80,
    category: 'braille',
  },
  'pulse-square': {
    frames: ['⠤', '⠦', '⠶', '⠴', '⠤'],
    interval: 100,
    category: 'braille',
  },
  'pulse-orbit': {
    frames: ['⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐'],
    interval: 100,
    category: 'braille',
  },
  'pulse-spiral': {
    frames: ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿'],
    interval: 90,
    category: 'braille',
  },
  'pulse-x': {
    frames: ['⠱', '⢎', '⠱', '⢎'],
    interval: 120,
    category: 'braille',
  },
  'x-sync': {
    frames: ['⠱', '⢎'],
    interval: 150,
    category: 'braille',
  },
  'x-sequence': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 80,
    category: 'braille',
  },
  'x-double': {
    frames: ['⠱', '⢎', '⠱', '⢎'],
    interval: 100,
    category: 'braille',
  },
  'x-fill': {
    frames: ['⠱', '⢎', '⡳', '⢞', '⠿'],
    interval: 100,
    category: 'braille',
  },
  'dot-wave': {
    frames: ['⡀', '⠄', '⠂', '⠁', '⠂', '⠄', '⡀'],
    interval: 120,
    category: 'braille',
  },
  'dot-sinewave': {
    frames: ['⡀', '⢀', '⠠', '⠐', '⠈', '⠁', '⠂', '⠄'],
    interval: 100,
    category: 'braille',
  },
  'dot-cross': {
    frames: ['⠁⠂', '⠄⡀', '⢀⠠', '⠐⠈'],
    interval: 120,
    category: 'braille',
  },
  'dot-corners': {
    frames: ['⠁', '⠈', '⢀', '⡀'],
    interval: 150,
    category: 'braille',
  },
  'dot-arrow': {
    frames: ['⠁', '⠉', '⠙', '⠚', '⠖', '⠦', '⠤', '⠠'],
    interval: 100,
    category: 'braille',
  },
  heartpulse: {
    frames: ['⡄', '⠆', '⠃', '⠉', '⠈', '⠐', '⠠', '⢀'],
    interval: 100,
    category: 'braille',
  },
  pyramid: {
    frames: ['⡀', '⣀', '⣄', '⣆', '⡇', '⠏', '⠛', '⠹'],
    interval: 100,
    category: 'braille',
  },
  tetris: {
    frames: ['⡀', '⣀', '⣄', '⣆', '⡇', '⠏'],
    interval: 150,
    category: 'braille',
  },
  ripple: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 100,
    category: 'braille',
  },
  'line-1': {
    frames: ['|', '/', '-', '\\'],
    interval: 100,
    category: 'simple',
  },
  'line-2': {
    frames: ['⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐'],
    interval: 100,
    category: 'simple',
  },
  'rolling-line': {
    frames: ['-', '＼', '|', '／'],
    interval: 100,
    category: 'simple',
  },
  pipe: {
    frames: ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'],
    interval: 100,
    category: 'simple',
  },

  // 73-108: Geometric & Box Mechanics
  'simple-dots': {
    frames: ['.  ', '.. ', '...', ' ..', '  .', '   '],
    interval: 150,
    category: 'simple',
  },
  'scroll-dots': {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 100,
    category: 'simple',
  },
  'star-1': {
    frames: ['✶', '✸', '✹', '✺', '✹', '✷'],
    interval: 80,
    category: 'simple',
  },
  'star-2': {
    frames: ['+', 'x', '*'],
    interval: 100,
    category: 'simple',
  },
  flip: {
    frames: ['_', '⎽', '⎼', '⎻', '⎺', '⎻', '⎼', '⎽'],
    interval: 80,
    category: 'simple',
  },
  hamburger: {
    frames: ['☱', '☲', '☴'],
    interval: 120,
    category: 'simple',
  },
  trigram: {
    frames: ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'],
    interval: 100,
    category: 'simple',
  },
  'grow-vertical': {
    frames: [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂'],
    interval: 120,
    category: 'progress',
  },
  'grow-horizontal': {
    frames: ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '▊', '▋', '▌', '▍', '▎'],
    interval: 120,
    category: 'progress',
  },
  'balloon-1': {
    frames: ['.', 'o', 'O', '@', '*'],
    interval: 120,
    category: 'simple',
  },
  'balloon-2': {
    frames: ['.', 'o', 'O', '°', ' '],
    interval: 120,
    category: 'simple',
  },
  noise: {
    frames: ['▓', '▒', '░'],
    interval: 100,
    category: 'simple',
  },
  'boxbounce-1': {
    frames: ['▖', '▘', '▝', '▗'],
    interval: 100,
    category: 'geometric',
  },
  'boxbounce-2': {
    frames: ['▌', '▀', '▐', '▄'],
    interval: 100,
    category: 'geometric',
  },
  quadblock: {
    frames: ['▙', '▛', '▜', '▟'],
    interval: 120,
    category: 'geometric',
  },
  triangle: {
    frames: ['◢', '◣', '◤', '◥'],
    interval: 120,
    category: 'geometric',
  },
  binary: {
    frames: ['010111', '110011', '001100', '101011', '111001', '010111'],
    interval: 100,
    category: 'simple',
  },
  arc: {
    frames: ['◜', '◝', '◞', '◟'],
    interval: 100,
    category: 'geometric',
  },
  circle: {
    frames: ['◡', '⊙', '◠', '⊙'],
    interval: 150,
    category: 'geometric',
  },
  'square-corners': {
    frames: ['◰', '◱', '◲', '◳'],
    interval: 120,
    category: 'geometric',
  },
  'circle-quarters': {
    frames: ['◴', '◷', '◶', '◵'],
    interval: 120,
    category: 'geometric',
  },
  'circle-half': {
    frames: ['◐', '◓', '◑', '◒'],
    interval: 120,
    category: 'geometric',
  },
  squish: {
    frames: ['╪', '╫'],
    interval: 200,
    category: 'simple',
  },
  'bracket-spin': {
    frames: ['⊏', '⊓', '⊐', '⊔'],
    interval: 120,
    category: 'simple',
  },
  'cross-toggle': {
    frames: ['+', 'x'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-1': {
    frames: ['⊶', '⊷'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-2': {
    frames: ['▪', '▫'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-3': {
    frames: ['■', '□'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-4': {
    frames: ['⬢', '⬡'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-5': {
    frames: ['▮', '▯'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-6': {
    frames: ['☯', '☿'],
    interval: 200,
    category: 'toggle',
  },
  'toggle-7': {
    frames: ['⦿', '○'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-8': {
    frames: ['◌', '◍', '◎', '◍'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-9': {
    frames: ['◎', '⦿'],
    interval: 150,
    category: 'toggle',
  },
  'toggle-10': {
    frames: ['㊀', '㊁', '㊂'],
    interval: 200,
    category: 'toggle',
  },
  'toggle-11': {
    frames: ['⧇', '⧈'],
    interval: 150,
    category: 'toggle',
  },

  // 109-150: The Games & Creatures Set
  'toggle-12': {
    frames: ['☖', '☗'],
    interval: 200,
    category: 'toggle',
  },
  'toggle-13': {
    frames: ['-', '=', '≡'],
    interval: 120,
    category: 'toggle',
  },
  'arrow-1': {
    frames: ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'],
    interval: 80,
    category: 'geometric',
  },
  'arrow-2': {
    frames: ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'],
    interval: 80,
    category: 'emoji',
  },
  'arrow-3': {
    frames: ['▹▹▹▹▸', '▹▹▹▸▹', '▹▹▸▹▹', '▹▸▹▹▹', '▸▹▹▹▹'],
    interval: 100,
    category: 'simple',
  },
  'bouncing-bar': {
    frames: [
      '[    ]',
      '[=   ]',
      '[==  ]',
      '[=== ]',
      '[ ===]',
      '[  ==]',
      '[   =]',
      '[    ]',
      '[   =]',
      '[  ==]',
      '[ ===]',
      '[=== ]',
      '[==  ]',
      '[=   ]',
    ],
    interval: 80,
    category: 'progress',
  },
  'bouncing-ball': {
    frames: [
      '(  ●  )',
      '(   ● )',
      '(    ●)',
      '(   ● )',
      '(  ●  )',
      '( ●   )',
      '(●    )',
      '( ●   )',
    ],
    interval: 80,
    category: 'progress',
  },
  'gradient-sweep': {
    frames: [
      '░░░░░░',
      '▒░░░░░',
      '▓▒░░░░',
      '█▓▒░░░',
      '██▓▒░░',
      '███▓▒░',
      '████▓▒',
      '█████▓',
      '██████',
      '█████▓',
      '████▓▒',
      '███▓▒░',
      '██▓▒░░',
      '█▓▒░░░',
      '▓▒░░░░',
      '▒░░░░░',
    ],
    interval: 100,
    category: 'progress',
  },
  material: {
    frames: ['▁', '▂', '▃', '▄'],
    interval: 100,
    category: 'geometric',
  },
  aesthetics: {
    frames: ['▰▰▰▱▱▱▱', '▱▰▰▰▱▱▱', '▱▱▰▰▰▱▱', '▱▱▱▰▰▰▱'],
    interval: 80,
    category: 'progress',
  },
  smiley: {
    frames: ['😊', '🤩', '🙄', '😆'],
    interval: 200,
    category: 'emoji',
  },
  monkey: {
    frames: ['🙈', '🙉', '🙊'],
    interval: 300,
    category: 'emoji',
  },
  hearts: {
    frames: ['💛', '🧡', '❤', '💜', '💙', '🩵', '💚'],
    interval: 150,
    category: 'emoji',
  },
  clock: {
    frames: ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'],
    interval: 100,
    category: 'emoji',
  },
  earth: {
    frames: ['🌍', '🌎', '🌏'],
    interval: 150,
    category: 'emoji',
  },
  moon: {
    frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
    interval: 100,
    category: 'emoji',
  },
  runner: {
    frames: ['🏃', '🚶'],
    interval: 150,
    category: 'emoji',
  },
  weather: {
    frames: ['☀️', '🌤️', '☁️', '🌧️', '🌩️'],
    interval: 200,
    category: 'emoji',
  },
  christmas: {
    frames: ['🎄', '🎁', '🎅', '❄'],
    interval: 250,
    category: 'emoji',
  },
  hourglass: {
    frames: ['⌛', '⏳'],
    interval: 400,
    category: 'emoji',
  },
  'finger-dance': {
    frames: ['👆', '👉', '👇', '👈'],
    interval: 150,
    category: 'emoji',
  },
  fistbump: {
    frames: ['🤜 🤛', '🤜✨🤛'],
    interval: 200,
    category: 'emoji',
  },
  'soccer-header': {
    frames: ['🧑 ⚽️ 🧑', '🧑⚽️  🧑', '🧑  ⚽️🧑'],
    interval: 150,
    category: 'fun',
  },
  mindblown: {
    frames: ['😧', '🤯'],
    interval: 300,
    category: 'emoji',
  },
  speaker: {
    frames: ['🔈', '🔉', '🔊'],
    interval: 200,
    category: 'emoji',
  },
  'orange-pulse': {
    frames: ['🔸', '🔶', '🔸'],
    interval: 150,
    category: 'emoji',
  },
  'blue-pulse': {
    frames: ['🔹', '🔷', '🔹'],
    interval: 150,
    category: 'emoji',
  },
  'mix-pulse': {
    frames: ['🔸', '🔷', '🔸', '🔶'],
    interval: 150,
    category: 'emoji',
  },
  'time-travel': {
    frames: ['🕐', '🕑', '🕒', '🕓'],
    interval: 80,
    category: 'emoji',
  },
  point: {
    frames: ['∙∙∙', '●∙∙', '∙●∙', '∙∙●'],
    interval: 120,
    category: 'simple',
  },
  layer: {
    frames: ['-', '=', '≡'],
    interval: 120,
    category: 'simple',
  },
  betawave: {
    frames: ['ρββββββ', 'βρβββββ', 'ββρββββ', 'βββρβββ', 'ββββρββ', 'βββββρβ', 'ββββββρ'],
    interval: 100,
    category: 'simple',
  },
  dqpb: {
    frames: ['d', 'q', 'p', 'b'],
    interval: 100,
    category: 'simple',
  },
  tallgrass: {
    frames: ['{////~}', '{///~/}', '{//~//}', '{/~///}'],
    interval: 120,
    category: 'simple',
  },
  sauron: {
    frames: ['(◎)', '(◉)', '(◎)'],
    interval: 200,
    category: 'geometric',
  },
  'jumping-beans': {
    frames: ['∘𓃉𓃉', '𓃉∘𓃉', '𓃉𓃉∘'],
    interval: 100,
    category: 'fun',
  },
  meter: {
    frames: ['▱▱▱▱▱', '▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰'],
    interval: 120,
    category: 'progress',
  },
  pong: {
    frames: [
      '🏓      ·',
      '🏓     · ',
      '🏓    ·  ',
      '🏓   ·   ',
      '🏓  ·    ',
      '🏓 ·     ',
      '🏓·      ',
      '·🏓      ',
    ],
    interval: 80,
    category: 'fun',
  },
  shark: {
    frames: ['▐____|\\___▌', '▐___|\\____▌', '▐__|\\_____▌', '▐_|\\______▌'],
    interval: 100,
    category: 'fun',
  },
  grenade: {
    frames: ['⁎', '⁕', '⁖', '⁘'],
    interval: 100,
    category: 'simple',
  },
  'dwarf-fortress': {
    frames: ['☺░£££', '☺ ░££', '☺  ░£'],
    interval: 150,
    category: 'fun',
  },
  fish: {
    frames: ['~ ><((º> ~', '~  ><((º>~', '~~  ><((º>'],
    interval: 150,
    category: 'fun',
  },
  pacman: {
    frames: [
      'C ∙ ∙ ∙',
      'C∙ ∙ ∙ ',
      '● ∙ ∙  ',
      ' C ∙ ∙ ',
      ' ● ∙ ∙ ',
      '  C ∙  ',
      '  ● ∙  ',
      '   C   ',
      '   ●   ',
      '    C  ',
      '    ●  ',
      '     C ',
      '     ● ',
      '      C',
      '      ●',
    ],
    interval: 120,
    category: 'fun',
  },
  'space-invaders': {
    frames: [
      '👾    ',
      '👾.   ',
      '👾 .  ',
      ' 👾   ',
      ' 👾.  ',
      ' 👾 . ',
      '  👾  ',
      '  👾. ',
      '  👾 .',
    ],
    interval: 150,
    category: 'fun',
  },
  mitosis: {
    frames: ['⠀⠂⠀', '⠀⠒⠀', '⠀⠶⠀', '⠶⠶⠀', '⠶⠀⠶', '⠒⠀⠒', '⠂⠀⠂'],
    interval: 180,
    category: 'geometric',
  },
  'atom-orbit': {
    frames: ['⠔⠋⠢', '⠢⠙⠔', '⠔⠹⠢', '⠢⠸⠔'],
    interval: 100,
    category: 'geometric',
  },
  'beaker-bubble': {
    frames: ['🧪⠠', '🧪⠐', '🧪⠈', '🧪⠁', '🧪⠀'],
    interval: 150,
    category: 'emoji',
  },
  'wifi-search': {
    frames: ['   ', '·  ', '⠂  ', '⠶  ', '⠿  '],
    interval: 180,
    category: 'progress',
  },
  'battery-charge': {
    frames: ['[    ]', '[■   ]', '[■■  ]', '[■■■ ]', '[■■■■]'],
    interval: 200,
    category: 'progress',
  },
  'percent-load': {
    frames: [
      '[  0%]',
      '[ 10%]',
      '[ 20%]',
      '[ 30%]',
      '[ 40%]',
      '[ 50%]',
      '[ 60%]',
      '[ 75%]',
      '[ 90%]',
      '[ 99%]',
      '[100%]',
    ],
    interval: 120,
    category: 'progress',
  },
  'solar-eclipse': {
    frames: ['☀', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'],
    interval: 180,
    category: 'emoji',
  },
  'shooting-star': {
    frames: ['☄️    ', ' ☄️   ', '  ☄️  ', '   ☄️ ', '    ☄️'],
    interval: 100,
    category: 'emoji',
  },
  'space-travel': {
    frames: ['🚀.  ', '🚀 . ', '🚀  .', '🚀   '],
    interval: 120,
    category: 'fun',
  },
  'ghost-float': {
    frames: ['👻  ', ' 👻 ', '  👻', ' 👻 '],
    interval: 150,
    category: 'emoji',
  },
  'wizard-spell': {
    frames: ['🧙‍♂️  ', '🧙‍♂️✨ ', '🧙‍♂️ ✨', '🧙‍♂️  '],
    interval: 150,
    category: 'emoji',
  },
  'butterfly-flap': {
    frames: ['🦋  ', ' 🦋 ', '  🦋', ' 🦋 '],
    interval: 120,
    category: 'emoji',
  },
  'caterpillar-crawl': {
    frames: ['🐛   ', ' 🐛  ', '  🐛 ', '   🐛'],
    interval: 150,
    category: 'emoji',
  },
  'dog-tail': {
    frames: ['🐕  ', '🐕~ ', '🐕~~', '🐕~ '],
    interval: 120,
    category: 'emoji',
  },
  'hourglass-pulse': {
    frames: ['⏳', '⌛'],
    interval: 250,
    category: 'toggle',
  },
  'dino-run': {
    frames: ['🦖  🌵', '🦖 🌵 ', '🦖🌵  ', '🦖  🌵'],
    interval: 120,
    category: 'fun',
  },
  'gym-lift': {
    frames: ['💪  ', ' 💪 ', '  💪', ' 💪 '],
    interval: 150,
    category: 'emoji',
  },
  'ufo-abduct': {
    frames: ['🛸👽🛸', '🛸🐄🛸', '🛸✨🛸'],
    interval: 150,
    category: 'emoji',
  },
  'fire-swirl': {
    frames: ['🔥💨', '💨🔥', '✨🔥', '🔥✨'],
    interval: 150,
    category: 'emoji',
  },
  'love-pulse': {
    frames: ['💖  ', '💖✨ ', '💖✨⚡', '💖✨ '],
    interval: 150,
    category: 'emoji',
  },
  'coffee-steam': {
    frames: ['☕  ', '☕~ ', '☕~~', '☕~ '],
    interval: 150,
    category: 'emoji',
  },
  'ninja-slice': {
    frames: ['🥷🗡️ ', '🥷💥  ', '🥷✨  '],
    interval: 120,
    category: 'emoji',
  },
  'snail-crawl': {
    frames: ['🐌    ', ' 🐌   ', '  🐌  ', '   🐌 ', '    🐌'],
    interval: 150,
    category: 'emoji',
  },
  'storm-flash': {
    frames: ['🌧️  ', '🌧️⚡ ', '🌧️✨ '],
    interval: 150,
    category: 'emoji',
  },
  'music-beat': {
    frames: ['🎵  ', ' 🎵 ', '  🎵', ' 🎵 '],
    interval: 150,
    category: 'emoji',
  },
  'cat-pounce': {
    frames: ['🐱  🐭', '🐱 🐭 ', '🐱🐭  ', '💥   '],
    interval: 150,
    category: 'emoji',
  },
  'robot-search': {
    frames: ['🤖🔴', '🤖🔵', '🤖🟢'],
    interval: 150,
    category: 'emoji',
  },
  'popcorn-pop': {
    frames: ['🍿  ', '🍿💥 ', '🍿🍿 '],
    interval: 150,
    category: 'emoji',
  },
};
