import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = resolve(repository, '../../..')
const required = [
  resolve(harnessRoot, 'tsconfig.base.client.json'),
  resolve(harnessRoot, 'packages/client/tsdown.client.ts'),
  resolve(harnessRoot, 'pnpm-workspace.yaml'),
]

const missing = required.filter(path => !existsSync(path))
if (missing.length > 0) {
  console.error([
    'dsh-deepseek-billing must be built inside a DeepSeek Harness checkout.',
    'Clone this repository to:',
    '  <deepseek-harness>/packages/extensions/dsh-deepseek-billing',
    'Missing build-context files:',
    ...missing.map(path => `  ${path}`),
  ].join('\n'))
  process.exit(1)
}

const hostContracts = [
  'packages/interaction/commands/lib/typert.remote-client.d.ts',
  'packages/goal/goal/lib/typert.remote-client.d.ts',
  'packages/extensions/cordis-host-runner/lib/typert.remote-client.d.ts',
  'packages/host/plugin-inventory/lib/typert.remote-client.d.ts',
  'packages/feedback/message-feedback/lib/typert.remote-client.d.ts',
].map(path => resolve(harnessRoot, path))
const missingContracts = hostContracts.filter(path => !existsSync(path))
if (missingContracts.length > 0) {
  console.error([
    'DeepSeek Harness host contracts have not been built.',
    'Run this from the Harness root before building the plugin:',
    '  pnpm run build:lib:host',
    'Missing contract files:',
    ...missingContracts.map(path => `  ${path}`),
  ].join('\n'))
  process.exit(1)
}
