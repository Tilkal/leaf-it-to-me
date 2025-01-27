import { describe, expect, it } from 'vitest'

import { isValidNumber, isValidString } from './json'

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


describe('isValidNumber', () => {
  it('should be represented in base 10', () => {
    expect(isValidNumber("10")).toBe(true)
    expect(isValidNumber("E4CB35")).toBe(false)
  })

  it('should be a number', () => {
    expect(isValidNumber("10")).toBe(true)
    expect(isValidNumber("Bonjour")).toBe(false)
  })

  it('should accept valid negative number', () => {
    expect(isValidNumber("-10")).toBe(true)
    expect(isValidNumber("10-")).toBe(false)
    expect(isValidNumber("--10")).toBe(false)
  })

  it('should accept valid fraction', () => {
    expect(isValidNumber("0.5")).toBe(true)
    expect(isValidNumber("0.")).toBe(true)
    expect(isValidNumber(".5")).toBe(false)
    expect(isValidNumber("0..5")).toBe(false)
    expect(isValidNumber("0.1.2")).toBe(false)
    expect(isValidNumber("0,5")).toBe(false)
  })

  it('should accept an exponent of 10, prefixed by e or E with a plus or minus sign', () => {
    expect(isValidNumber("10e+2")).toBe(true)
    expect(isValidNumber("10e-5")).toBe(true)
    expect(isValidNumber("10E+2")).toBe(true)
    expect(isValidNumber("10e5")).toBe(false)
    expect(isValidNumber("10e+2.4")).toBe(false)
    expect(isValidNumber("e+5")).toBe(false)
  })

  it('should not accept NaN or Infinity', () => {
    expect(isValidNumber("NaN")).toBe(false)
    expect(isValidNumber("Infinity")).toBe(false)
  })
})