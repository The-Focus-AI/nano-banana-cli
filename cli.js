#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'cli.ts');

// Check if tsx is available in node_modules
const tsxPath = join(__dirname, 'node_modules', '.bin', 'tsx');
const useLocalTsx = existsSync(tsxPath);

if (useLocalTsx) {
  // Use local tsx from node_modules
  const child = spawn('node', [tsxPath, cliPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  // Fallback to npx tsx (works when installed via npx)
  const child = spawn('npx', ['--yes', 'tsx', cliPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

