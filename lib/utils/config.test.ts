import { describe, expect, it } from 'vitest'

import { isReadonly } from './config'

describe('isReadonly', () => {
  it('should return true if readonly is true', () => {
    expect(isReadonly(true)).toBe(true)
  })

  it('should return true if readonly is a regex array and path match one or more of the regex', () => {
    // Match only regex
    expect(isReadonly([/^key1/], 'key1.key2')).toBe(true)

    // Match one of many
    expect(
      isReadonly(
        [/somethingnotmatching/, /key1\.key2/, /somethingelsenotmatching/],
        'key1.key2',
      ),
    ).toBe(true)

    // Match multiple of many
    expect(
      isReadonly([/somethingnotmatching/, /^key1\.key2$/, /^key/], 'key1.key2'),
    ).toBe(true)
  })

  it('should return false if readonly is undefined', () => {
    expect(isReadonly()).toBe(false)
  })

  it('should return false if readonly is a regex array and path is undefined', () => {
    expect(isReadonly([/^.*$/])).toBe(false)
  })

  it('should return false if readonly is a regex array and path doesnt match one of the regex', () => {
    expect(isReadonly([/somethingnotmathching/], 'key1.key2')).toBe(false)
  })
})
