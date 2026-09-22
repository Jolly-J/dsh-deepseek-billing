import assert from 'node:assert/strict'
import test from 'node:test'
import { selectActiveSessionId } from '../src/client/session.ts'

void test('selects the Session the main view retains', () => {
  const list = {
    byId: {
      'session-a': { id: 'session-a', retainedBy: { mainView: 1 } },
      'session-b': { id: 'session-b', retainedBy: {} },
    },
  }

  assert.equal(selectActiveSessionId(list), 'session-a')
})

void test('ignores rows retained by other sources only', () => {
  const list = {
    byId: {
      'session-a': { id: 'session-a', retainedBy: { sidebar: 2 } },
      'session-b': { id: 'session-b', retainedBy: { sidebar: 1, mainView: 0 } },
    },
  }

  assert.equal(selectActiveSessionId(list), null)
})

void test('tolerates an empty, absent, or partially filled snapshot', () => {
  assert.equal(selectActiveSessionId(null), null)
  assert.equal(selectActiveSessionId(undefined), null)
  assert.equal(selectActiveSessionId({ byId: {} }), null)
  assert.equal(selectActiveSessionId({ byId: { 'session-a': undefined } }), null)
})

void test('reads the legacy selection field of releases before 0.1.6-alpha.2', () => {
  const list = {
    byId: { 'session-a': { id: 'session-a' } },
    current: 'session-a',
  }

  assert.equal(selectActiveSessionId(list), 'session-a')
})

void test('falls back to null when neither projection carries a selection', () => {
  assert.equal(selectActiveSessionId({ byId: { 'session-a': { id: 'session-a' } } }), null)
  assert.equal(selectActiveSessionId({ byId: {}, current: undefined }), null)
  assert.equal(selectActiveSessionId({ byId: {}, current: null }), null)
})

void test('returns the id as a plain string', () => {
  const list = { byId: { 'session-a': { id: 'session-a', retainedBy: { mainView: 3 } } } }

  assert.equal(typeof selectActiveSessionId(list), 'string')
})
