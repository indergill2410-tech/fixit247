import { spawnSync } from 'node:child_process';

const steps = [
  ['npm', ['test']],
  ['npm', ['run', 'typecheck']],
  ['npm', ['run', 'build']],
  ['npm', ['run', 'audit:prod']]
];

for (const [command, args] of steps) {
  const label = `${command} ${args.join(' ')}`;
  console.log(`\n[verify:deploy] Running: ${label}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd()
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
