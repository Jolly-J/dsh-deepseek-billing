import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const bundle = await readFile('lib/client.js', 'utf8')
const stylesheet = await readFile('src/client/BillingPanel.module.css', 'utf8')

assert.equal(await exists('BillingPanel.tsx'), false, 'root BillingPanel.tsx duplicates src/client')
assert.equal(await exists('client.js'), false, 'root client.js duplicates lib/client.js')
assert.equal(await exists('client.js.map'), false, 'root client.js.map duplicates lib/client.js.map')
assert.equal(await exists('lib/client.js.map'), true, 'official clientBundle sourcemap must ship')
assert.ok(packageJson.files.includes('lib/client.js.map'), 'package files must include the client sourcemap')
assert.match(bundle, /sidebar\.footer\.action/)
assert.doesNotMatch(bundle, /sidebar\.header\.action/)
assert.match(bundle, /sourceMappingURL=client\.js\.map/)
assert.match(stylesheet, /width:\s*calc\(100% - 4px\)/)
assert.doesNotMatch(stylesheet.match(/\.card\s*\{[^}]+\}/s)?.[0] ?? '', /position:\s*(absolute|fixed)/)

console.log('verify-artifacts: release tree and sidebar layout contract are consistent')
