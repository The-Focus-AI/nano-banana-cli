#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'cli.ts');

// Use local tsx from node_modules - no shell to preserve argument strings
const tsxPath = join(__dirname, 'node_modules', '.bin', 'tsx');
const child = spawn(process.execPath, [tsxPath, cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
