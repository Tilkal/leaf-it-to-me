import { describe, expect, it, vi } from 'vitest'

import { hashCode, memoize } from './memoization'

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

describe('memoize', () => {
  it('should return the correct value', () => {
    const mockFn = vi.fn(() => 'value')

    const memoizedMockFn = memoize(mockFn)
    expect(memoizedMockFn()).toBe('value')
  })

  it('should cache the return value', () => {
    const mockFn = vi.fn(() => 'value')
    const cache = new Map()
    const setSpy = vi.spyOn(cache, 'set')
    const memoizedMockFn = memoize(mockFn, () => 'a', cache)

    memoizedMockFn()
    expect(setSpy).toHaveBeenCalledOnce()
    expect(cache.get('a')).toBe('value')
  })

  it('should return the cached value', () => {
    const mockFn = vi.fn(() => 'value')
    const cache = new Map()
    const getSpy = vi.spyOn(cache, 'get')
    const memoizedMockFn = memoize(mockFn, () => 'a', cache)

    memoizedMockFn()
    expect(getSpy).toHaveBeenCalledOnce()
  })

  it('should hit cache for each consecutive call', () => {
    const mockFn = vi.fn(() => 'value')
    const cache = new Map()
    const getSpy = vi.spyOn(cache, 'get')
    const memoizedMockFn = memoize(mockFn, () => 'a', cache)

    expect(mockFn).toHaveBeenCalledTimes(0)
    expect(getSpy).toHaveBeenCalledTimes(0)

    memoizedMockFn()
    expect(mockFn).toHaveBeenCalledOnce()
    expect(getSpy).toHaveBeenCalledOnce()
    memoizedMockFn()
    expect(mockFn).toHaveBeenCalledOnce()
    expect(getSpy).toHaveBeenCalledTimes(2)
    memoizedMockFn()
    expect(mockFn).toHaveBeenCalledOnce()
    expect(getSpy).toHaveBeenCalledTimes(3)
    memoizedMockFn()
    expect(mockFn).toHaveBeenCalledOnce()
    expect(getSpy).toHaveBeenCalledTimes(4)
  })
})
