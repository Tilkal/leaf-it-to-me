import { describe, expect, it } from 'vitest'

import { isValidString } from './json'

describe('isValidString', () => {
  it('should be valid for keys without special characters', () => {
    expect(isValidString('key')).toBe(true)
    expect(isValidString('another_key')).toBe(true)
    expect(isValidString('another key')).toBe(true)
    expect(isValidString('123key456')).toBe(true)
    expect(isValidString('')).toBe(true)
  })

  it('should be valid for keys with escaped characters', () => {
    expect(isValidString(String.raw`escaped \/ solidus`)).toBe(true)
    expect(isValidString(String.raw`escaped \n newline`)).toBe(true)
    expect(isValidString(String.raw`escaped \t tab`)).toBe(true)
    expect(isValidString(String.raw`escaped \" quote`)).toBe(true)
    expect(isValidString(String.raw`escaped \\ reverse solidus`)).toBe(true)
    expect(isValidString(String.raw`unicode \u1234`)).toBe(true)
  })

  it('should be invalid for keys with unescaped characters', () => {
    expect(isValidString(String.raw`unescaped / solidus`)).toBe(false)
    expect(isValidString(String.raw`unescaped " quote`)).toBe(false)
    expect(isValidString(String.raw`unescaped \ reverse solidus`)).toBe(false)
    expect(isValidString(String.raw`unterminatedKey \u12`)).toBe(false)
  })
})
