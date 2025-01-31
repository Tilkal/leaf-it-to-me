import { describe, expect, it } from 'vitest'

import { getTreeDescription, isValidNumber, isValidString } from './json'

describe('isValidString', () => {
  it('should be valid for keys without special characters', () => {
    expect(isValidString('key')).toBe(true)
    expect(isValidString('another_key')).toBe(true)
    expect(isValidString('another key')).toBe(true)
    expect(isValidString('123key456')).toBe(true)
    expect(isValidString('')).toBe(true)
    expect(isValidString('unescaped / solidus')).toBe(true)
  })

  it('should be valid for keys with escaped characters', () => {
    expect(isValidString(String.raw`escaped \n newline`)).toBe(true)
    expect(isValidString(String.raw`escaped \t tab`)).toBe(true)
    expect(isValidString(String.raw`escaped \" quote`)).toBe(true)
    expect(isValidString(String.raw`escaped \\ reverse solidus`)).toBe(true)
    expect(isValidString(String.raw`unicode \u1234`)).toBe(true)
  })

  it('should be invalid for keys with unescaped characters', () => {
    expect(isValidString(String.raw`unescaped " quote`)).toBe(false)
    expect(isValidString(String.raw`unescaped \ reverse solidus`)).toBe(false)
    expect(isValidString(String.raw`unterminatedKey \u12`)).toBe(false)
  })
})

describe('isValidNumber', () => {
  it('should be represented in base 10', () => {
    expect(isValidNumber('10')).toBe(true)
    expect(isValidNumber('E4CB35')).toBe(false)
  })

  it('should be a number', () => {
    expect(isValidNumber('10')).toBe(true)
    expect(isValidNumber('Bonjour')).toBe(false)
  })

  it('should accept valid negative number', () => {
    expect(isValidNumber('-10')).toBe(true)
    expect(isValidNumber('10-')).toBe(false)
    expect(isValidNumber('--10')).toBe(false)
  })

  it('should accept valid fraction', () => {
    expect(isValidNumber('0.5')).toBe(true)
    expect(isValidNumber('0.')).toBe(true)
    expect(isValidNumber('.5')).toBe(false)
    expect(isValidNumber('0..5')).toBe(false)
    expect(isValidNumber('0.1.2')).toBe(false)
    expect(isValidNumber('0,5')).toBe(false)
  })

  it('should accept an exponent of 10, prefixed by e or E with a plus or minus sign', () => {
    expect(isValidNumber('10e+2')).toBe(true)
    expect(isValidNumber('10e-5')).toBe(true)
    expect(isValidNumber('10E+2')).toBe(true)
    expect(isValidNumber('10e5')).toBe(false)
    expect(isValidNumber('10e+2.4')).toBe(false)
    expect(isValidNumber('e+5')).toBe(false)
  })

  it('should not accept NaN or Infinity', () => {
    expect(isValidNumber('NaN')).toBe(false)
    expect(isValidNumber('Infinity')).toBe(false)
  })
})

describe('getTreeDescription', () => {
  // Node types
  it('should include the type of a node', () => {
    expect(getTreeDescription('')).toMatchObject({
      type: 'string',
    })
  })

  it('should correctly identify a string and have a value', () => {
    expect(getTreeDescription('')).toMatchObject({
      type: 'string',
      value: '',
    })

    expect(getTreeDescription('not empty string')).toMatchObject({
      type: 'string',
      value: 'not empty string',
    })
  })

  it('should correctly identify a number and have a value', () => {
    expect(getTreeDescription(0)).toMatchObject({
      type: 'number',
      value: 0,
    })

    expect(getTreeDescription(42)).toMatchObject({
      type: 'number',
      value: 42,
    })

    expect(getTreeDescription(-42)).toMatchObject({
      type: 'number',
      value: -42,
    })
  })

  it('should correctly identify a boolean and have a value', () => {
    expect(getTreeDescription(true)).toMatchObject({
      type: 'boolean',
      value: true,
    })

    expect(getTreeDescription(false)).toMatchObject({
      type: 'boolean',
      value: false,
    })
  })

  it('should correctly identify a null and have null as value', () => {
    expect(getTreeDescription(null)).toMatchObject({
      type: 'null',
      value: null,
    })
  })

  it('should correctly identify an array and have children', () => {
    expect(getTreeDescription([])).toMatchObject({
      type: 'array',
      children: [],
    })
  })

  it('should correctly identify an object and have children', () => {
    expect(getTreeDescription({})).toMatchObject({
      type: 'object',
      children: [],
    })
  })

  it('should correctly identify values of an array as nodes with value but no name', () => {
    expect(getTreeDescription([42])).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'number',
          value: 42,
        },
      ],
    })
  })

  it('should correctly identify values of an object as nodes with value and name', () => {
    expect(getTreeDescription({ key: 'value' })).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'string',
          name: 'key',
          value: 'value',
        },
      ],
    })
  })

  // Empty array and object
  it('should return an empty root object if the input JSON is empty', () => {
    expect(getTreeDescription({})).toMatchObject({
      type: 'object',
      children: [],
    })

    expect(getTreeDescription([])).toMatchObject({
      type: 'array',
      children: [],
    })
  })

  // Simple "map"
  it('should handle a JSON with a single key-value pair', () => {
    expect(getTreeDescription({ key: 'value' })).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'string',
          name: 'key',
          value: 'value',
        },
      ],
    })
  })

  it('should handle a JSON with multiple key-value pairs', () => {
    expect(
      getTreeDescription({ key1: 'value', key2: 42, key3: true, key4: null }),
    ).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'string',
          name: 'key1',
          value: 'value',
        },
        {
          type: 'number',
          name: 'key2',
          value: 42,
        },
        {
          type: 'boolean',
          name: 'key3',
          value: true,
        },
        {
          type: 'null',
          name: 'key4',
          value: null,
        },
      ],
    })
  })

  // Simple array JSON
  it('should handle a JSON array with primitive values', () => {
    expect(getTreeDescription(['value', 'value'])).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'string',
          value: 'value',
        },
        {
          type: 'string',
          value: 'value',
        },
      ],
    })
  })

  it('should handle a JSON array with mixed primitive types', () => {
    expect(getTreeDescription(['value', 42, true, null])).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'string',
          value: 'value',
        },
        {
          type: 'number',
          value: 42,
        },
        {
          type: 'boolean',
          value: true,
        },
        {
          type: 'null',
          value: null,
        },
      ],
    })
  })

  // Nested objects and arrays
  it('should handle a JSON object with nested objects', () => {
    expect(
      getTreeDescription({
        key1: 'value',
        key2: { key3: 'value2', key4: { key5: 'value3' } },
        key6: 42,
      }),
    ).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'string',
          name: 'key1',
          value: 'value',
        },
        {
          type: 'object',
          name: 'key2',
          children: [
            {
              type: 'string',
              name: 'key3',
              value: 'value2',
            },
            {
              type: 'object',
              name: 'key4',
              children: [{ type: 'string', name: 'key5', value: 'value3' }],
            },
          ],
        },
        {
          type: 'number',
          name: 'key6',
          value: 42,
        },
      ],
    })
  })

  it('should handle a JSON array with nested arrays', () => {
    expect(
      getTreeDescription(['value1', [1, true, 'value2', ['value3']], null]),
    ).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'string',
          value: 'value1',
        },
        {
          type: 'array',
          children: [
            {
              type: 'number',
              value: 1,
            },
            {
              type: 'boolean',
              value: true,
            },
            {
              type: 'string',
              value: 'value2',
            },
            {
              type: 'array',
              children: [
                {
                  type: 'string',
                  value: 'value3',
                },
              ],
            },
          ],
        },
        {
          type: 'null',
          value: null,
        },
      ],
    })
  })

  it('should handle a JSON object with mixed nested objects and arrays', () => {
    expect(
      getTreeDescription({
        key1: [1, { key2: 'value', key3: [true] }],
        key4: null,
      }),
    ).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'array',
          name: 'key1',
          children: [
            {
              type: 'number',
              value: 1,
            },
            {
              type: 'object',
              children: [
                {
                  type: 'string',
                  name: 'key2',
                  value: 'value',
                },
                {
                  type: 'array',
                  name: 'key3',
                  children: [
                    {
                      type: 'boolean',
                      value: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'null',
          name: 'key4',
          value: null,
        },
      ],
    })
  })
  it('should handle a JSON array with mixed nested objects and arrays', () => {
    expect(
      getTreeDescription([
        [1, { key1: 'value', key2: [true] }],
        null,
        {
          key3: [42],
        },
      ]),
    ).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'array',
          children: [
            {
              type: 'number',
              value: 1,
            },
            {
              type: 'object',
              children: [
                {
                  type: 'string',
                  name: 'key1',
                  value: 'value',
                },
                {
                  type: 'array',
                  name: 'key2',
                  children: [
                    {
                      type: 'boolean',
                      value: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        { type: 'null', value: null },
        {
          type: 'object',
          children: [
            {
              type: 'array',
              name: 'key3',
              children: [
                {
                  type: 'number',
                  value: 42,
                },
              ],
            },
          ],
        },
      ],
    })
  })

  // Error cases
  it('should throw a TypeError for invalid JSON input', () => {
    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription({ a: 1n })).toThrowError(
      'invalid JSON value',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription({ a: () => undefined })).toThrowError(
      'invalid JSON value',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription(undefined)).toThrowError(
      'invalid JSON value',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription(function () {})).toThrowError(
      'invalid JSON value',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription(() => undefined)).toThrowError(
      'invalid JSON value',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getTreeDescription(Symbol())).toThrowError(
      'invalid JSON value',
    )
  })

  it('should throw a SyntaxError for invalid string values', () => {
    expect(() =>
      getTreeDescription({ a: String.raw`unescaped " quote` }),
    ).toThrowError('invalid JSON string value')

    expect(() =>
      getTreeDescription({ a: String.raw`unescaped \ reverse solidus` }),
    ).toThrowError('invalid JSON string value')

    expect(() =>
      getTreeDescription({ a: String.raw`unterminatedKey \u12` }),
    ).toThrowError('invalid JSON string value')
  })

  // undefined case
  it('should ignore undefined values', () => {
    expect(
      // @ts-expect-error -- Testing undefined case
      getTreeDescription([undefined, 42, undefined, 'value', undefined]),
    ).toMatchObject({
      type: 'array',
      children: [
        {
          type: 'number',
          value: 42,
        },
        {
          type: 'string',
          value: 'value',
        },
      ],
    })

    expect(
      // @ts-expect-error -- Testing undefined case
      getTreeDescription({ key1: undefined, key2: 42 }),
    ).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'number',
          name: 'key2',
          value: 42,
        },
      ],
    })
  })

  // Path
  it('should have an empty path for root element', () => {
    expect(getTreeDescription(42)).toMatchObject({
      path: '',
    })
    expect(getTreeDescription('')).toMatchObject({
      path: '',
    })
    expect(getTreeDescription(null)).toMatchObject({
      path: '',
    })
    expect(getTreeDescription(true)).toMatchObject({
      path: '',
    })
    expect(getTreeDescription([])).toMatchObject({
      path: '',
    })
    expect(getTreeDescription({})).toMatchObject({
      path: '',
    })
  })

  it('should have an object key as path for object keys', () => {
    expect(
      getTreeDescription({ key1: 'value1', key2: 'value2' }),
    ).toMatchObject({
      children: [
        {
          path: 'key1',
        },
        {
          path: 'key2',
        },
      ],
    })
  })

  it('should have an index path for array items', () => {
    expect(getTreeDescription(['value', 42])).toMatchObject({
      children: [
        {
          path: '0',
        },
        {
          path: '1',
        },
      ],
    })
  })

  it('should indicate nesting with a dot (.) separator for arrays and objects', () => {
    // Nested objects
    expect(
      getTreeDescription({
        key1: 'value',
        key2: {
          key3: 42,
        },
      }),
    ).toMatchObject({
      children: [
        {
          path: 'key1',
        },
        {
          path: 'key2',
          children: [
            {
              path: 'key2.key3',
            },
          ],
        },
      ],
    })

    // Nested arrays
    expect(getTreeDescription([1, [42, [2]]])).toMatchObject({
      children: [
        {
          path: '0',
        },
        {
          path: '1',
          children: [
            {
              path: '1.0',
            },
            {
              path: '1.1',
              children: [
                {
                  path: '1.1.0',
                },
              ],
            },
          ],
        },
      ],
    })

    // Mixed
    expect(getTreeDescription([{ key1: { key2: [42] } }])).toMatchObject({
      children: [
        {
          path: '0',
          children: [
            {
              path: '0.key1',
              children: [
                {
                  path: '0.key1.key2',
                  children: [
                    {
                      path: '0.key1.key2.0',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
