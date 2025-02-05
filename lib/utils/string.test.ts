import { describe, expect, it } from 'vitest'

import { toKebabCase } from './string'

describe('toKebabCase', () => {
  it('should remove all non alphanumeric char', () => {
    expect(toKebabCase('&é"\'(èçà)=^$*ù%µ£¨!:;,?./§<>')).toBe('') // Non exhaustive list but there is way too many
  })

  it('should be all lowercase', () => {
    expect(toKebabCase('TOLOWERCASE')).toBe('tolowercase')
  })

  it('should replace spaces and underscore with hyphen', () => {
    expect(toKebabCase(' ')).toBe('-')
    expect(toKebabCase('_')).toBe('-')
  })

  it('should not have more than one hyphen', () => {
    expect(toKebabCase(' _ ')).toBe('-')
  })
})
