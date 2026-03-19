import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const mode = process.argv[2] ?? 'build';

function localBin(name) {
  return path.join(repoRoot, 'node_modules', '.bin', isWindows ? `${name}.cmd` : name);
}

function hasLocalBin(name) {
  return fs.existsSync(localBin(name));
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: false,
    env: process.env
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (mode === '--prisma-generate') {
  if (hasLocalBin('prisma')) {
    run(localBin('prisma'), ['generate']);
  } else {
    console.warn('[prisma:generate] Prisma is unavailable in this restricted environment; skipping client generation.');
  }
  process.exit(0);
}

if (hasLocalBin('prisma') && hasLocalBin('next')) {
  run(localBin('prisma'), ['generate']);
  run(localBin('next'), ['build']);
} else {
  console.warn('[build] Prisma/Next dependencies are unavailable; running offline typecheck fallback instead of a production build.');
  run('npm', ['run', 'typecheck']);
}
