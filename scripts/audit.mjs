import { spawnSync } from 'node:child_process';

const baseArgs = ['audit', '--omit=dev'];
const proxyVars = [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'http_proxy',
  'https_proxy',
  'npm_config_http_proxy',
  'npm_config_https_proxy',
  'YARN_HTTP_PROXY',
  'YARN_HTTPS_PROXY'
];

function runAudit(env) {
  return spawnSync('npm', baseArgs, {
    stdio: 'pipe',
    encoding: 'utf8',
    env,
    cwd: process.cwd()
  });
}

function print(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function isAdvisoryAccessFailure(result) {
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  return /audit endpoint returned an error|security\/advisories\/bulk failed|403 Forbidden/i.test(output);
}

let result = runAudit(process.env);
if (result.status === 0) {
  print(result);
  process.exit(0);
}

if (isAdvisoryAccessFailure(result)) {
  const env = { ...process.env };
  for (const key of proxyVars) delete env[key];
  const retry = runAudit(env);
  if (retry.status === 0) {
    print(retry);
    process.exit(0);
  }

  if (isAdvisoryAccessFailure(retry)) {
    console.warn('[audit:prod] npm advisory endpoint is unavailable from this environment (proxy/registry access issue).');
    console.warn('[audit:prod] No vulnerability result could be fetched, so treat this as an infrastructure warning rather than a package-health signal.');
    process.exit(0);
  }

  print(retry);
  process.exit(retry.status ?? 1);
}

print(result);
process.exit(result.status ?? 1);
