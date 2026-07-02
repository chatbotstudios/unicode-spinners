#!/usr/bin/env node
import { spawn } from 'child_process';
import { staticSpinners as spinnersData } from './spinners_data.js';

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help') {
  console.log(`
Usage:
  npx unicode-spinners list [--json]
  npx unicode-spinners wrap --spinner <name> --text "<msg>" -- <cmd> [args...]

Examples:
  npx unicode-spinners list
  npx unicode-spinners wrap --spinner braille --text "Working..." -- sleep 3
`);
  process.exit(0);
}

if (command === 'list') {
  const isJson = args.includes('--json');
  const allNames = Object.keys(spinnersData);
  if (isJson) {
    console.log(JSON.stringify(allNames, null, 2));
  } else {
    console.log(allNames.join('\n'));
  }
  process.exit(0);
}

if (command === 'wrap') {
  let spinnerName = 'braille';
  let text = 'Loading...';
  let cmdIdx = -1;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--') {
      cmdIdx = i + 1;
      break;
    }
    if (args[i] === '--spinner' && i + 1 < args.length) {
      spinnerName = args[++i];
    } else if (args[i] === '--text' && i + 1 < args.length) {
      text = args[++i];
    }
  }

  if (cmdIdx === -1 || cmdIdx >= args.length) {
    console.error('Error: Please provide a command after --');
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spinner = (spinnersData as any)[spinnerName] || spinnersData.braille;
  const { frames, interval } = spinner;

  let i = 0;
  const timer = setInterval(() => {
    process.stdout.write(`\r\x1B[2K  ${frames[i++ % frames.length]} ${text}`);
  }, interval);

  const cmdArgs = args.slice(cmdIdx);
  const child = spawn(cmdArgs[0], cmdArgs.slice(1), {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  let errOut = '';
  child.stderr?.on('data', (data) => {
    errOut += data.toString();
  });

  child.on('close', (code) => {
    clearInterval(timer);
    if (code === 0) {
      process.stdout.write(
        `\r\x1B[2K  ✔ ${text.replace('ing...', 'ed').replace('...', ' done.')}\n`
      );
    } else {
      process.stdout.write(`\r\x1B[2K  ✖ ${text} (Failed with code ${code})\n`);
      if (errOut) console.error(errOut);
    }
    process.exit(code ?? 1);
  });
}
