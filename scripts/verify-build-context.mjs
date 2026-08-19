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
