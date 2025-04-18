import { describe, expect, it } from 'vitest'

import { ErrorLevel } from '../defs'
import {
  getJsonDescription,
  getJsonFromNode,
  isValidNumber,
  isValidString,
} from './json'

describe('isValidString', () => {
  it('should be valid for strings without special characters', () => {
    expect(isValidString('key')).toBe(true)
    expect(isValidString('another_key')).toBe(true)
    expect(isValidString('another key')).toBe(true)
    expect(isValidString('123key456')).toBe(true)
    expect(isValidString('')).toBe(true)
    expect(isValidString('unescaped / solidus')).toBe(true)
  })

  it('should be valid for strings with escaped characters', () => {
    expect(isValidString(String.raw`escaped \n newline`)).toBe(true)
    expect(isValidString(String.raw`escaped \t tab`)).toBe(true)
    expect(isValidString(String.raw`escaped " quote`)).toBe(true)
    expect(isValidString(String.raw`escaped \ reverse solidus`)).toBe(true)
    expect(isValidString(String.raw`unicode \u1234`)).toBe(true)
  })

  it('should be invalid for strings with unescaped characters', () => {
    expect(isValidString(String.raw`unterminatedKey \u12`)).toBe(false)
  })

  it('should be valid for strings with stringified json', () => {
    expect(isValidString('{"a":"b"}'))
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

describe('getJsonDescription', () => {
  // Node types
  it('should include the type of a node', () => {
    expect(getJsonDescription({ json: '' })).toMatchObject({
      type: 'string',
    })
  })

  it('should correctly identify a string and have a value', () => {
    expect(getJsonDescription({ json: '' })).toMatchObject({
      type: 'string',
      value: '',
    })

    expect(getJsonDescription({ json: 'not empty string' })).toMatchObject({
      type: 'string',
      value: 'not empty string',
    })
  })

  it('should correctly identify a number and have a value', () => {
    expect(getJsonDescription({ json: 0 })).toMatchObject({
      type: 'number',
      value: 0,
    })

    expect(getJsonDescription({ json: 42 })).toMatchObject({
      type: 'number',
      value: 42,
    })

    expect(getJsonDescription({ json: -42 })).toMatchObject({
      type: 'number',
      value: -42,
    })
  })

  it('should correctly identify a boolean and have a value', () => {
    expect(getJsonDescription({ json: true })).toMatchObject({
      type: 'boolean',
      value: true,
    })

    expect(getJsonDescription({ json: false })).toMatchObject({
      type: 'boolean',
      value: false,
    })
  })

  it('should correctly identify a null and have null as value', () => {
    expect(getJsonDescription({ json: null })).toMatchObject({
      type: 'null',
      value: null,
    })
  })

  it('should correctly identify an array and have children', () => {
    expect(getJsonDescription({ json: [] })).toMatchObject({
      type: 'array',
      children: [],
    })
  })

  it('should correctly identify an object and have children', () => {
    expect(getJsonDescription({ json: {} })).toMatchObject({
      type: 'object',
      children: [],
    })
  })

  it('should correctly identify values of an array as nodes with value but no name', () => {
    expect(getJsonDescription({ json: [42] })).toMatchObject({
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
    expect(getJsonDescription({ json: { key: 'value' } })).toMatchObject({
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
    expect(getJsonDescription({ json: {} })).toMatchObject({
      type: 'object',
      children: [],
    })

    expect(getJsonDescription({ json: [] })).toMatchObject({
      type: 'array',
      children: [],
    })
  })

  // Simple "map"
  it('should handle a JSON with a single key-value pair', () => {
    expect(getJsonDescription({ json: { key: 'value' } })).toMatchObject({
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
      getJsonDescription({
        json: { key1: 'value', key2: 42, key3: true, key4: null },
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
    expect(getJsonDescription({ json: ['value', 'value'] })).toMatchObject({
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
    expect(
      getJsonDescription({ json: ['value', 42, true, null] }),
    ).toMatchObject({
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
      getJsonDescription({
        json: {
          key1: 'value',
          key2: { key3: 'value2', key4: { key5: 'value3' } },
          key6: 42,
        },
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
      getJsonDescription({
        json: ['value1', [1, true, 'value2', ['value3']], null],
      }),
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
      getJsonDescription({
        json: {
          key1: [1, { key2: 'value', key3: [true] }],
          key4: null,
        },
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
      getJsonDescription({
        json: [
          [1, { key1: 'value', key2: [true] }],
          null,
          {
            key3: [42],
          },
        ],
      }),
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

  // Root
  it('should have property isRoot on root node only if root is set to true', () => {
    expect(
      getJsonDescription({ json: { key: 'value' }, isRoot: true }),
    ).toStrictEqual({
      type: 'object',
      isRoot: true,
      path: '',
      children: [
        {
          type: 'string',
          name: 'key',
          value: 'value',
          path: 'key',
        },
      ],
    })
  })

  it('should have property isRoot on root node only if root is omited', () => {
    expect(getJsonDescription({ json: { key: 'value' } })).toStrictEqual({
      type: 'object',
      isRoot: true,
      path: '',
      children: [
        {
          type: 'string',
          name: 'key',
          value: 'value',
          path: 'key',
        },
      ],
    })
  })

  it('should only have isRoot property on root node', () => {
    expect(
      getJsonDescription({
        json: { key: 'value', a: { b: { c: { d: 'e' } } } },
      }),
    ).toStrictEqual({
      type: 'object',
      isRoot: true,
      path: '',
      children: [
        {
          type: 'string',
          name: 'key',
          value: 'value',
          path: 'key',
        },
        {
          type: 'object',
          name: 'a',
          path: 'a',
          children: [
            {
              type: 'object',
              name: 'b',
              path: 'a.b',
              children: [
                {
                  type: 'object',
                  name: 'c',
                  path: 'a.b.c',
                  children: [
                    {
                      type: 'string',
                      name: 'd',
                      path: 'a.b.c.d',
                      value: 'e',
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

  // Error cases
  it('should throw a TypeError for invalid JSON input', () => {
    // @ts-expect-error -- Expected invalid type
    expect(() => getJsonDescription({ json: { a: 1n } })).toThrowError(
      'Invalid JSON value at path ""',
    )

    expect(() =>
      // @ts-expect-error -- Expected invalid type
      getJsonDescription({ json: { a: () => undefined } }),
    ).toThrowError('Invalid JSON value at path ""')

    // @ts-expect-error -- Expected invalid type
    expect(() => getJsonDescription({ json: undefined })).toThrowError(
      'Invalid JSON value at path ""',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getJsonDescription({ json: function () {} })).toThrowError(
      'Invalid JSON value at path ""',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getJsonDescription({ json: () => undefined })).toThrowError(
      'Invalid JSON value at path ""',
    )

    // @ts-expect-error -- Expected invalid type
    expect(() => getJsonDescription({ json: Symbol() })).toThrowError(
      'Invalid JSON value at path ""',
    )
  })

  it('should throw a SyntaxError for invalid string values', () => {
    expect(() =>
      getJsonDescription({ json: { a: String.raw`unterminatedKey \u12` } }),
    ).toThrowError('Invalid JSON value at path ""')
  })

  // undefined case
  it('should ignore undefined values', () => {
    expect(
      getJsonDescription({
        // @ts-expect-error -- Testing undefined case
        json: [undefined, 42, undefined, 'value', undefined],
      }),
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
      getJsonDescription({ json: { key1: undefined, key2: 42 } }),
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

  it('should keep empty string as key', () => {
    expect(getJsonDescription({ json: { '': 'value' } })).toMatchObject({
      type: 'object',
      children: [
        {
          type: 'string',
          name: '',
          value: 'value',
        },
      ],
    })
  })

  // Path
  it('should have an empty path for root element', () => {
    expect(getJsonDescription({ json: 42 })).toMatchObject({
      path: '',
    })
    expect(getJsonDescription({ json: '' })).toMatchObject({
      path: '',
    })
    expect(getJsonDescription({ json: null })).toMatchObject({
      path: '',
    })
    expect(getJsonDescription({ json: true })).toMatchObject({
      path: '',
    })
    expect(getJsonDescription({ json: [] })).toMatchObject({
      path: '',
    })
    expect(getJsonDescription({ json: {} })).toMatchObject({
      path: '',
    })
  })

  it('should have an object key as path for object keys', () => {
    expect(
      getJsonDescription({ json: { key1: 'value1', key2: 'value2' } }),
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

  it('should format keys to kebab-case for paths', () => {
    expect(
      getJsonDescription({ json: { ['some not kebab cased key']: 'value1' } }),
    ).toMatchObject({
      children: [
        {
          path: 'some-not-kebab-cased-key',
        },
      ],
    })
  })

  it('should have an index path for array items', () => {
    expect(getJsonDescription({ json: ['value', 42] })).toMatchObject({
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
      getJsonDescription({
        json: {
          key1: 'value',
          key2: {
            key3: 42,
          },
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
    expect(getJsonDescription({ json: [1, [42, [2]]] })).toMatchObject({
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
    expect(
      getJsonDescription({ json: [{ key1: { key2: [42] } }] }),
    ).toMatchObject({
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

  // Plugins
  it('should find a custom type', () => {
    expect(
      getJsonDescription({
        json: 'potatoe',
        plugins: [
          {
            type: 'potatoe',
            checker: (value) => value === 'potatoe',
            color: 'cyan',
            nested: false,
            parser: (value) => value,
            validator: () => ErrorLevel.NONE,
          },
        ],
      }),
    ).toMatchObject({
      type: 'potatoe',
      value: 'potatoe',
    })
  })

  it('should have children for custom nested type', () => {
    type Potatoe = {
      type: 'potatoe'
      values: string[]
    }

    const isPotatoe = (json: unknown): json is Potatoe =>
      typeof json === 'object' &&
      Object.hasOwn(json as object, 'type') &&
      (json as { type: string }).type === 'potatoe'

    expect(
      getJsonDescription({
        json: {
          type: 'potatoe',
          values: ['agata', 'balmoral', 'coliban'],
        },
        plugins: [
          {
            type: 'potatoe',
            checker: isPotatoe,
            color: 'cyan',
            nested: 'object',
            parser: (value) => value,
            validator: () => ErrorLevel.NONE,
          },
        ],
      }),
    ).toMatchObject({
      type: 'potatoe',
      children: [
        {
          type: 'string',
          name: 'type',
          value: 'potatoe',
        },
        {
          type: 'array',
          name: 'values',
          children: [
            {
              type: 'string',
              value: 'agata',
            },
            {
              type: 'string',
              value: 'balmoral',
            },
            {
              type: 'string',
              value: 'coliban',
            },
          ],
        },
      ],
    })
  })
})

describe('getJsonFromNode', () => {
  it('should return null for a node of type "null"', () => {
    expect(getJsonFromNode({ type: 'null', path: '' })).toBe(null)
  })

  it('should return a string value for a node of type "string"', () => {
    expect(getJsonFromNode({ type: 'string', value: 'value', path: '' })).toBe(
      'value',
    )
  })

  it('should return a number value for a node of type "number"', () => {
    expect(getJsonFromNode({ type: 'number', value: 42, path: '' })).toBe(42)
  })

  it('should return a boolean value for a node of type "boolean"', () => {
    expect(getJsonFromNode({ type: 'boolean', value: true, path: '' })).toBe(
      true,
    )
    expect(getJsonFromNode({ type: 'boolean', value: false, path: '' })).toBe(
      false,
    )
  })

  it('should return an empty object for a node of type "object" with no children', () => {
    // Empty children
    expect(
      getJsonFromNode({ type: 'object', path: '', children: [] }),
    ).toStrictEqual({})

    // Missing children, should not happen
    expect(getJsonFromNode({ type: 'object', path: '' })).toStrictEqual({})
  })

  it('should return an object with correct key-value pairs for a node of type "object" with children', () => {
    expect(
      getJsonFromNode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'string',
            name: 'key1',
            value: 'string',
            path: 'key1',
          },
          {
            type: 'number',
            name: 'key2',
            value: 42,
            path: 'key2',
          },
          {
            type: 'boolean',
            name: 'key3',
            value: true,
            path: 'key3',
          },
          {
            type: 'null',
            name: 'key4',
            value: null,
            path: 'key4',
          },
          {
            type: 'array',
            name: 'key5',
            path: 'key5',
            children: [],
          },
          {
            type: 'object',
            name: 'key6',
            path: 'key6',
            children: [],
          },
        ],
      }),
    ).toStrictEqual({
      key1: 'string',
      key2: 42,
      key3: true,
      key4: null,
      key5: [],
      key6: {},
    })
  })

  it('should return an empty array for a node of type "array" with no children', () => {
    // Empty children
    expect(
      getJsonFromNode({ type: 'array', path: '', children: [] }),
    ).toStrictEqual([])

    // Missing children, should not happen
    expect(getJsonFromNode({ type: 'array', path: '' })).toStrictEqual([])
  })

  it('should return an array with correct elements for a node of type "array" with children', () => {
    expect(
      getJsonFromNode({
        type: 'array',
        path: '',
        children: [
          {
            type: 'string',
            value: 'string',
            path: '0',
          },
          {
            type: 'number',
            value: 42,
            path: '1',
          },
          {
            type: 'boolean',
            value: true,
            path: '2',
          },
          {
            type: 'null',
            value: null,
            path: '3',
          },
          {
            type: 'array',
            path: '4',
            children: [],
          },
          {
            type: 'object',
            path: '5',
            children: [],
          },
        ],
      }),
    ).toStrictEqual(['string', 42, true, null, [], {}])
  })

  it('should handle deeply nested object structures correctly', () => {
    expect(
      getJsonFromNode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'object',
            path: 'key1',
            name: 'key1',
            children: [
              {
                type: 'number',
                path: 'key1.key3',
                name: 'key3',
                value: 42,
              },
              {
                type: 'object',
                path: 'key1.key4',
                name: 'key4',
                children: [
                  {
                    type: 'null',
                    path: 'key1.key4.key5',
                    name: 'key5',
                    value: null,
                  },
                ],
              },
            ],
          },
          {
            type: 'string',
            path: 'key2',
            name: 'key2',
            value: 'string',
          },
        ],
      }),
    ).toStrictEqual({
      key1: { key3: 42, key4: { key5: null } },
      key2: 'string',
    })
  })

  it('should handle deeply nested array structures correctly', () => {
    expect(
      getJsonFromNode({
        type: 'array',
        path: '',
        children: [
          {
            type: 'boolean',
            path: '0',
            value: false,
          },
          {
            type: 'array',
            path: '1',
            children: [
              {
                type: 'array',
                path: '1.0',
                children: [
                  {
                    type: 'boolean',
                    path: '1.0.0',
                    value: true,
                  },
                ],
              },
              {
                type: 'null',
                path: '1.1',
                value: null,
              },
            ],
          },
        ],
      }),
    ).toStrictEqual([false, [[true], null]])
  })

  it('should handle mixed object and array nesting correctly', () => {
    expect(
      getJsonFromNode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'array',
            path: 'key1',
            name: 'key1',
            children: [
              {
                type: 'array',
                path: 'key1.0',
                children: [
                  {
                    type: 'number',
                    path: 'key1.0.0',
                    value: 42,
                  },
                  {
                    type: 'object',
                    path: 'key1.0.1',
                    children: [
                      {
                        type: 'null',
                        path: 'key1.0.1.key3',
                        name: 'key3',
                        value: null,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'string',
            path: 'key2',
            name: 'key2',
            value: 'string',
          },
        ],
      }),
    ).toStrictEqual({
      key1: [[42, { key3: null }]],
      key2: 'string',
    })
  })

  it('should ignore the path property when constructing the JSON output', () => {
    // Ignore direct node
    expect(
      getJsonFromNode({
        type: 'null',
        path: 'not.root.path',
        value: null,
      }),
    ).toBe(null)

    // Ignore deeply nested nodes
    expect(
      getJsonFromNode({
        type: 'object',
        path: '',
        children: [
          {
            type: 'object',
            path: 'incorrect.path',
            name: 'key1',
            children: [
              {
                type: 'string',
                path: 'another.incorrect.path',
                name: 'key2',
                value: 'string',
              },
            ],
          },
        ],
      }),
    ).toStrictEqual({ key1: { key2: 'string' } })
  })

  it('should throw a TypeError for a node of unsupported type', () => {
    expect(() =>
      // @ts-expect-error -- testing unsupported types
      getJsonFromNode({ type: 'bigint', path: '', value: 1n }),
    ).toThrowError('unsupported type')
  })
})
