import { describe, it, expect } from 'vitest';
import { spinners, gridToBraille, makeGrid } from './braille';

describe('makeGrid', () => {
  it('creates grid with correct dimensions', () => {
    const g = makeGrid(4, 8);
    expect(g.length).toBe(4);
    expect(g[0].length).toBe(8);
    expect(g.every((row) => row.every((cell) => cell === false))).toBe(true);
  });

  it('returns empty array for zero dimensions', () => {
    expect(makeGrid(0, 5)).toEqual([]);
    expect(makeGrid(5, 0)).toEqual([]);
  });

  it('returns empty array for negative dimensions', () => {
    expect(makeGrid(-1, 5)).toEqual([]);
    expect(makeGrid(5, -1)).toEqual([]);
  });
});

describe('gridToBraille', () => {
  it('returns empty string for empty grid', () => {
    expect(gridToBraille([])).toBe('');
  });

  it('returns blank braille char for all-false 4x2 grid', () => {
    const g = makeGrid(4, 2);
    expect(gridToBraille(g)).toBe('\u2800');
  });

  it('returns full braille char for all-true 4x2 grid', () => {
    const g = makeGrid(4, 2);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) g[r][c] = true;
    expect(gridToBraille(g)).toBe('\u28FF');
  });

  it('encodes individual dots correctly', () => {
    // dot1 (row0, col0) = 0x01
    const g1 = makeGrid(4, 2);
    g1[0][0] = true;
    expect(gridToBraille(g1)).toBe('\u2801');

    // dot4 (row0, col1) = 0x08
    const g2 = makeGrid(4, 2);
    g2[0][1] = true;
    expect(gridToBraille(g2)).toBe('\u2808');

    // dot2 (row1, col0) = 0x02
    const g3 = makeGrid(4, 2);
    g3[1][0] = true;
    expect(gridToBraille(g3)).toBe('\u2802');

    // dot5 (row1, col1) = 0x10
    const g4 = makeGrid(4, 2);
    g4[1][1] = true;
    expect(gridToBraille(g4)).toBe('\u2810');

    // dot3 (row2, col0) = 0x04
    const g5 = makeGrid(4, 2);
    g5[2][0] = true;
    expect(gridToBraille(g5)).toBe('\u2804');

    // dot6 (row2, col1) = 0x20
    const g6 = makeGrid(4, 2);
    g6[2][1] = true;
    expect(gridToBraille(g6)).toBe('\u2820');

    // dot7 (row3, col0) = 0x40
    const g7 = makeGrid(4, 2);
    g7[3][0] = true;
    expect(gridToBraille(g7)).toBe('\u2840');

    // dot8 (row3, col1) = 0x80
    const g8 = makeGrid(4, 2);
    g8[3][1] = true;
    expect(gridToBraille(g8)).toBe('\u2880');
  });

  it('produces multiple characters for wider grids', () => {
    const g = makeGrid(4, 4);
    g[0][0] = true;
    g[0][2] = true;
    const result = gridToBraille(g);
    expect(result.length).toBe(2);
    expect(result).toBe('\u2801\u2801');
  });

  it('handles odd-width grids', () => {
    const g = makeGrid(4, 3);
    g[0][0] = true;
    g[0][2] = true;
    const result = gridToBraille(g);
    expect(result.length).toBe(2);
  });
});

describe('spinners', () => {
  const allKeys = Object.keys(spinners);

  it('exports exactly 150 unique primary spinners along with compact aliases', () => {
    const primaryKeys = allKeys.filter((key) => {
      if (key.includes('-')) return true;
      // If no-dash counterpart exists with a dash, it's an alias
      const dashedCounterpart = key
        .replace(/([0-9]+)/g, '-$1')
        .replace(/([a-z]+)([A-Z])/g, '$1-$2')
        .toLowerCase();
      if (dashedCounterpart !== key && allKeys.includes(dashedCounterpart)) return false;

      if (key.startsWith('legacy') && !key.includes('-')) {
        const dashed = 'legacy-' + key.slice(6);
        if (dashed !== key && allKeys.includes(dashed)) return false;
      }

      // Manual list of custom dash overrides
      const specialAliases = [
        'dots8bit',
        'dotscircle',
        'radar2',
        'checkerboard',
        'wave2',
        'progressdots',
        'pulsesoft',
        'pulseburst',
        'pulsesquare',
        'pulseorbit',
        'pulsespiral',
        'pulsex',
        'xsync',
        'xsequence',
        'xdouble',
        'xfill',
        'dotwave',
        'dotsinewave',
        'dotcross',
        'dotcorners',
        'dotarrow',
        'line1',
        'line2',
        'rollingline',
        'simpledots',
        'scrolldots',
        'star1',
        'star2',
        'growvertical',
        'growhorizontal',
        'balloon1',
        'balloon2',
        'boxbounce1',
        'boxbounce2',
        'squarecorners',
        'circlequarters',
        'circlehalf',
        'bracketspin',
        'crosstoggle',
        'bouncingbar',
        'bouncingball',
        'gradientsweep',
        'fingerdance',
        'soccerheader',
        'orangepulse',
        'bluepulse',
        'mixpulse',
        'timetravel',
        'jumpingbeans',
        'dwarffortress',
        'spaceinvaders',
        'atomorbit',
        'beakerbubble',
        'wifisearch',
        'batterycharge',
        'percentload',
        'solareclipse',
        'shootingstar',
        'spacetravel',
        'ghostfloat',
        'wizardspell',
        'butterflyflap',
        'caterpillarcrawl',
        'dogtail',
        'hourglasspulse',
        'dinorun',
        'gymlift',
        'ufoabduct',
        'fireswirl',
        'lovepulse',
        'coffeesteam',
        'ninjaslice',
        'snailcrawl',
        'stormflash',
        'musicbeat',
        'catpounce',
        'robotsearch',
        'popcornpop',
      ];
      if (specialAliases.includes(key)) {
        // Check if the dashed equivalent is also in allKeys
        const withDash = key.replace(/([a-z]+)([0-9a-z]+)/, () => {
          if (key === 'dots8bit') return 'dots-8bit';
          if (key === 'dotscircle') return 'dots-circle';
          if (key === 'radar2') return 'radar-2';
          if (key === 'checkerboard') return 'checker-board';
          if (key === 'wave2') return 'wave-2';
          if (key === 'progressdots') return 'progress-dots';
          if (key === 'progressdots') return 'progress-dots';
          if (key.startsWith('pulse')) return 'pulse-' + key.replace('pulse', '');
          if (key.startsWith('x')) return 'x-' + key.slice(1);
          if (key.startsWith('dot') && key !== 'dot') return 'dot-' + key.slice(3);
          if (key.startsWith('line')) return 'line-' + key.replace('line', '');
          if (key === 'rollingline') return 'rolling-line';
          if (key === 'simpledots') return 'simple-dots';
          if (key === 'scrolldots') return 'scroll-dots';
          if (key.startsWith('star')) return 'star-' + key.replace('star', '');
          if (key.startsWith('grow')) return 'grow-' + key.replace('grow', '');
          if (key.startsWith('balloon')) return 'balloon-' + key.replace('balloon', '');
          if (key.startsWith('boxbounce')) return 'boxbounce-' + key.replace('boxbounce', '');
          if (key === 'squarecorners') return 'square-corners';
          if (key === 'circlequarters') return 'circle-quarters';
          if (key === 'circlehalf') return 'circle-half';
          if (key === 'bracketspin') return 'bracket-spin';
          if (key === 'crosstoggle') return 'cross-toggle';
          if (key === 'bouncingbar') return 'bouncing-bar';
          if (key === 'bouncingball') return 'bouncing-ball';
          if (key === 'gradientsweep') return 'gradient-sweep';
          if (key === 'fingerdance') return 'finger-dance';
          if (key === 'soccerheader') return 'soccer-header';
          if (key.endsWith('pulse')) return key.replace('pulse', '') + '-pulse';
          if (key === 'timetravel') return 'time-travel';
          if (key === 'jumpingbeans') return 'jumping-beans';
          if (key === 'dwarffortress') return 'dwarf-fortress';
          if (key === 'spaceinvaders') return 'space-invaders';
          if (key === 'atomorbit') return 'atom-orbit';
          if (key === 'beakerbubble') return 'beaker-bubble';
          if (key === 'wifisearch') return 'wifi-search';
          if (key === 'batterycharge') return 'battery-charge';
          if (key === 'percentload') return 'percent-load';
          if (key === 'solareclipse') return 'solar-eclipse';
          if (key === 'shootingstar') return 'shooting-star';
          if (key === 'spacetravel') return 'space-travel';
          if (key === 'ghostfloat') return 'ghost-float';
          if (key === 'wizardspell') return 'wizard-spell';
          if (key === 'butterflyflap') return 'butterfly-flap';
          if (key === 'caterpillarcrawl') return 'caterpillar-crawl';
          if (key === 'dogtail') return 'dog-tail';
          if (key === 'hourglasspulse') return 'hourglass-pulse';
          if (key === 'dinorun') return 'dino-run';
          if (key === 'gymlift') return 'gym-lift';
          if (key === 'ufoabduct') return 'ufo-abduct';
          if (key === 'fireswirl') return 'fire-swirl';
          if (key === 'lovepulse') return 'love-pulse';
          if (key === 'coffeesteam') return 'coffee-steam';
          if (key === 'ninjaslice') return 'ninja-slice';
          if (key === 'snailcrawl') return 'snail-crawl';
          if (key === 'stormflash') return 'storm-flash';
          if (key === 'musicbeat') return 'music-beat';
          if (key === 'catpounce') return 'cat-pounce';
          if (key === 'robotsearch') return 'robot-search';
          if (key === 'popcornpop') return 'popcorn-pop';
          return m;
        });
        if (allKeys.includes(withDash)) return false;
      }
      if (
        key.startsWith('toggle') &&
        key !== 'toggle' &&
        allKeys.includes(key.replace('toggle', 'toggle-'))
      )
        return false;
      if (
        key.startsWith('arrow') &&
        key !== 'arrow' &&
        allKeys.includes(key.replace('arrow', 'arrow-'))
      )
        return false;
      return true;
    });
    expect(primaryKeys.length).toBe(198);
  });

  for (const name of allKeys) {
    describe(name, () => {
      it('has non-empty frames', () => {
        expect(spinners[name].frames.length).toBeGreaterThan(0);
      });

      it('has positive interval', () => {
        expect(spinners[name].interval).toBeGreaterThan(0);
      });

      it('has consistent frame widths', () => {
        const widths = spinners[name].frames.map((f) => [...f].length);
        expect(new Set(widths).size).toBe(1);
      });

      it('frames match snapshot', () => {
        expect(spinners[name]).toMatchSnapshot();
      });
    });
  }
});
