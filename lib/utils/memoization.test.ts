import { describe, expect, it } from 'vitest'

import { hashCode } from './memoization'

describe('hashCode', () => {
  it('should return number hash code', () => {
    expect(hashCode({ type: 'string', path: 'key' })).toBe(-1951898125)
  })

  it('should always return the same hash code', async () => {
    expect(hashCode({ type: 'string', path: 'key' })).toBe(-1951898125)
    expect(hashCode({ type: 'string', path: 'key' })).toBe(-1951898125)
    expect(hashCode({ type: 'string', path: 'key' })).toBe(-1951898125)

    expect(
      hashCode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'number',
            path: 'key',
          },
        ],
      }),
    ).toBe(-558898212)
    expect(
      hashCode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'number',
            path: 'key',
          },
        ],
      }),
    ).toBe(-558898212)
    expect(
      hashCode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'number',
            path: 'key',
          },
        ],
      }),
    ).toBe(-558898212)
  })
})
