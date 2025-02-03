import { describe, expect, it } from 'vitest'

import {
  addNodeToTree,
  deleteNodeInTree,
  hasNode,
  updateNodeInTree,
} from './tree'

describe('hasNode', () => {
  it('should return true if node is root', () => {
    expect(
      hasNode({ type: 'object', path: '' }, { type: 'object', path: '' }),
    ).toBe(true)
  })

  it('should return true if node is tree', () => {
    expect(
      hasNode(
        { type: 'object', path: 'a.b.c' },
        { type: 'object', path: 'a.b.c' },
      ),
    ).toBe(true)
  })

  it('should return true if node is child of tree', () => {
    expect(
      hasNode(
        { type: 'object', path: 'a' },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'a',
            },
          ],
        },
      ),
    ).toBe(true)
  })

  it('should return true if node is nested in tree', () => {
    expect(
      hasNode(
        {
          type: 'object',
          path: 'a.0.b',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'array',
              path: 'a',
              children: [
                {
                  type: 'object',
                  path: 'a.0',
                  children: [
                    {
                      type: 'object',
                      path: 'a.0.b',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    ).toBe(true)
  })

  it('should work with arrays', () => {
    expect(
      hasNode(
        { type: 'string', path: '0' },
        {
          type: 'array',
          path: '',
          children: [
            {
              type: 'string',
              path: '0',
            },
          ],
        },
      ),
    ).toBe(true)
  })

  it('should return false if not found', () => {
    expect(
      hasNode({ type: 'string', path: 'a.b.c' }, { type: 'object', path: '' }),
    )
  })
})

describe('addNodeToTree', () => {
  it('should add node to an empty tree', () => {
    expect(
      addNodeToTree(
        {
          type: 'object',
          path: '',
        },
        {
          type: 'string',
          path: 'key',
        },
        {
          type: 'object',
          path: '',
          children: [],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'string',
          path: 'key',
        },
      ],
    })
  })

  it('should add node as a child of the specified parent node', () => {
    expect(
      addNodeToTree(
        {
          type: 'object',
          path: 'object2',
          children: [],
        },
        {
          type: 'string',
          path: 'object2.key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'object1',
              children: [],
            },
            {
              type: 'object',
              path: 'object2',
              children: [],
            },
            {
              type: 'object',
              path: 'object3',
              children: [],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'object',
          path: 'object1',
          children: [],
        },
        {
          type: 'object',
          path: 'object2',
          children: [
            {
              type: 'string',
              path: 'object2.key',
            },
          ],
        },
        {
          type: 'object',
          path: 'object3',
          children: [],
        },
      ],
    })
  })

  it('should handle adding a node to an array structure', () => {
    expect(
      addNodeToTree(
        {
          type: 'array',
          path: '',
          children: [],
        },
        {
          type: 'string',
          path: '0',
        },
        {
          type: 'array',
          path: '',
          children: [],
        },
      ),
    ).toMatchObject({
      type: 'array',
      path: '',
      children: [
        {
          type: 'string',
          path: '0',
        },
      ],
    })
  })

  it('should add a node correctly when the parent has existing children', () => {
    expect(
      addNodeToTree(
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'number',
              path: 'key1',
            },
          ],
        },
        {
          type: 'string',
          path: 'key2',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'number',
              path: 'key1',
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'number',
          path: 'key1',
        },
        {
          type: 'string',
          path: 'key2',
        },
      ],
    })
  })

  it('should handle deep nesting correctly', () => {
    expect(
      addNodeToTree(
        {
          type: 'object',
          path: 'array.1.0.parent',
        },
        {
          type: 'string',
          path: 'array.1.0.parent.key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'array',
              path: 'array',
              children: [
                {
                  type: 'null',
                  path: 'array.0',
                },
                {
                  type: 'array',
                  path: 'array.1',
                  children: [
                    {
                      type: 'object',
                      path: 'array.1.0',
                      children: [
                        {
                          type: 'object',
                          path: 'array.1.0.parent',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'array',
          path: 'array',
          children: [
            {
              type: 'null',
              path: 'array.0',
            },
            {
              type: 'array',
              path: 'array.1',
              children: [
                {
                  type: 'object',
                  path: 'array.1.0',
                  children: [
                    {
                      type: 'object',
                      path: 'array.1.0.parent',
                      children: [
                        {
                          type: 'string',
                          path: 'array.1.0.parent.key',
                        },
                      ],
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

  it('should throw an error if parent is not found in tree', () => {
    expect(() =>
      addNodeToTree(
        {
          type: 'object',
          path: 'not-found',
        },
        {
          type: 'string',
          path: 'not-found.key',
        },
        {
          type: 'object',
          path: '',
          children: [],
        },
      ),
    ).toThrowError('not found')
  })

  it('should throw an error if child path is invalid', () => {
    expect(() =>
      addNodeToTree(
        {
          type: 'object',
          path: '',
          children: [],
        },
        {
          type: 'string',
          path: 'some.not-found.path.key',
        },
        {
          type: 'object',
          path: '',
          children: [],
        },
      ),
    ).toThrowError('invalid path')
  })

  it('should throw an error if parent already has a child at specified path', () => {
    expect(() =>
      addNodeToTree(
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'string',
              path: 'key',
            },
          ],
        },
        {
          type: 'string',
          path: 'key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'string',
              path: 'key',
            },
          ],
        },
      ),
    ).toThrowError('already exists')
  })
})

describe('deleteNodeInTree', () => {
  it('should delete a node when it exists in the tree', () => {
    expect(
      deleteNodeInTree(
        { type: 'string', path: 'key' },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'string',
              path: 'key',
            },
          ],
        },
      ),
    ).toMatchObject({ type: 'object', path: '', children: [] })
  })

  it('should delete a node in an array', () => {
    expect(
      deleteNodeInTree(
        {
          type: 'string',
          path: '0',
        },
        {
          type: 'array',
          path: '',
          children: [
            {
              type: 'string',
              path: '0',
            },
          ],
        },
      ),
    ).toMatchObject({ type: 'array', path: '', children: [] })
  })

  it('should not modify the tree structure except for the deleted node', () => {
    expect(
      deleteNodeInTree(
        { type: 'string', path: 'object.key2' },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'object',
              children: [
                {
                  type: 'null',
                  path: 'object.key1',
                },
                {
                  type: 'string',
                  path: 'object.key2',
                },
                {
                  type: 'number',
                  path: 'object.key3',
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'object',
          path: 'object',
          children: [
            {
              type: 'null',
              path: 'object.key1',
            },
            {
              type: 'number',
              path: 'object.key3',
            },
          ],
        },
      ],
    })
  })

  it('should not update array path index for the siblings of the deleted node', () => {
    expect(
      deleteNodeInTree(
        { type: 'string', path: '1' },
        {
          type: 'array',
          path: '',
          children: [
            {
              type: 'null',
              path: '0',
            },
            {
              type: 'string',
              path: '1',
            },
            {
              type: 'number',
              path: '2',
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'array',
      path: '',
      children: [
        {
          type: 'null',
          path: '0',
        },
        {
          type: 'number',
          path: '2',
        },
      ],
    })
  })

  it('should delete a deeply nested node', () => {
    expect(
      deleteNodeInTree(
        { type: 'string', path: '0.object.1.key' },
        {
          type: 'array',
          path: '',
          children: [
            {
              type: 'object',
              path: '0',
              children: [
                {
                  type: 'array',
                  path: '0.object',
                  children: [
                    {
                      type: 'number',
                      path: '0.object.0',
                    },
                    {
                      type: 'object',
                      path: '0.object.1',
                      children: [
                        {
                          type: 'string',
                          path: '0.object.1.key',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'array',
      path: '',
      children: [
        {
          type: 'object',
          path: '0',
          children: [
            {
              type: 'array',
              path: '0.object',
              children: [
                {
                  type: 'number',
                  path: '0.object.0',
                },
                {
                  type: 'object',
                  path: '0.object.1',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('should return the tree unchanged if the node does not exists', () => {
    expect(
      deleteNodeInTree(
        { type: 'string', path: 'unknown.path' },
        {
          type: 'object',
          path: '',
          children: [],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [],
    })
  })

  it('should throw an error if trying to delete the root with', () => {
    // Empty path
    expect(() =>
      deleteNodeInTree(
        { type: 'object', path: '' },
        { type: 'object', path: '' },
      ),
    ).toThrowError('cannot be deleted')

    // Not empty path
    expect(() =>
      deleteNodeInTree(
        { type: 'object', path: 'a' },
        { type: 'object', path: 'a' },
      ),
    ).toThrowError('cannot be deleted')
  })
})

describe('updateNodeInTree', () => {
  it('should update a node when it exists in the tree', () => {
    expect(
      updateNodeInTree(
        {
          type: 'string',
          path: 'key',
        },
        {
          type: 'number',
          path: 'key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'string',
              path: 'key',
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'number',
          path: 'key',
        },
      ],
    })
  })

  it('should update a node in an array', () => {
    expect(
      updateNodeInTree(
        { type: 'string', path: '0' },
        { type: 'number', path: '0' },
        {
          type: 'array',
          path: '',
          children: [
            {
              type: 'string',
              path: '0',
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'array',
      path: '',
      children: [
        {
          type: 'number',
          path: '0',
        },
      ],
    })
  })

  it('should not modify the tree structure except for the updated node', () => {
    expect(
      updateNodeInTree(
        {
          type: 'string',
          path: 'key2',
        },
        {
          type: 'number',
          path: 'key2',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'null',
              path: 'key1',
            },
            {
              type: 'string',
              path: 'key2',
            },
            {
              type: 'boolean',
              path: 'key3',
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'null',
          path: 'key1',
        },
        {
          type: 'number',
          path: 'key2',
        },
        {
          type: 'boolean',
          path: 'key3',
        },
      ],
    })
  })

  it('should update a deeply nested node', () => {
    expect(
      updateNodeInTree(
        {
          type: 'string',
          path: 'key1.0.1.key2',
        },
        {
          type: 'number',
          path: 'key1.0.1.key2',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'array',
              path: 'key1',
              children: [
                {
                  type: 'array',
                  path: 'key1.0',
                  children: [
                    {
                      type: 'null',
                      path: 'key1.0.0',
                    },
                    {
                      type: 'object',
                      path: 'key1.0.1',
                      children: [
                        {
                          type: 'string',
                          path: 'key1.0.1.key2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'array',
          path: 'key1',
          children: [
            {
              type: 'array',
              path: 'key1.0',
              children: [
                {
                  type: 'null',
                  path: 'key1.0.0',
                },
                {
                  type: 'object',
                  path: 'key1.0.1',
                  children: [
                    {
                      type: 'number',
                      path: 'key1.0.1.key2',
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

  it('should correctly update the root node if needed', () => {
    expect(
      updateNodeInTree(
        { type: 'object', path: '' },
        { type: 'array', path: '' },
        { type: 'object', path: '' },
      ),
    ).toMatchObject({
      type: 'array',
      path: '',
    })
  })

  it('should allow to change path leaf (last part)', () => {
    expect(
      updateNodeInTree(
        {
          type: 'string',
          path: 'object.old-key',
        },
        {
          type: 'string',
          path: 'object.new-key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'object',
              children: [
                {
                  type: 'string',
                  path: 'object.old-key',
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'object',
          path: 'object',
          children: [
            {
              type: 'string',
              path: 'object.new-key',
            },
          ],
        },
      ],
    })
  })

  it('should allow to change path of node in tree', () => {
    expect(
      updateNodeInTree(
        {
          type: 'string',
          path: 'object1.object2.key',
        },
        {
          type: 'string',
          path: 'object3.object4.key',
        },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'object1',
              children: [
                {
                  type: 'object',
                  path: 'object1.object2',
                  children: [
                    {
                      type: 'string',
                      path: 'object1.object2.key',
                    },
                  ],
                },
              ],
            },
            {
              type: 'object',
              path: 'object3',
              children: [
                {
                  type: 'object',
                  path: 'object3.object4',
                  children: [],
                },
              ],
            },
          ],
        },
      ),
    ).toMatchObject({
      type: 'object',
      path: '',
      children: [
        {
          type: 'object',
          path: 'object1',
          children: [
            {
              type: 'object',
              path: 'object1.object2',
              children: [],
            },
          ],
        },
        {
          type: 'object',
          path: 'object3',
          children: [
            {
              type: 'object',
              path: 'object3.object4',
              children: [
                {
                  type: 'string',
                  path: 'object3.object4.key',
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('should throw an error if the node to update is not found', () => {
    expect(() =>
      updateNodeInTree(
        { type: 'string', path: 'object.not-found' },
        {
          type: 'number',
          path: 'object.not-found',
        },
        {
          type: 'object',
          path: '',
          children: [],
        },
      ),
    ).toThrowError('not found')
  })

  it('should throw an error if a node already exists at the updated node path', () => {
    expect(() =>
      updateNodeInTree(
        { type: 'string', path: 'key1' },
        { type: 'string', path: 'key2' },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'string',
              path: 'key1',
            },
            {
              type: 'string',
              path: 'key2',
            },
          ],
        },
      ),
    ).toThrowError('already exists')
  })

  it('should throw an error if an updated path is invalid (cannot be reached)', () => {
    expect(() =>
      updateNodeInTree(
        { type: 'string', path: 'object.key' },
        { type: 'string', path: 'missing-object.key' },
        {
          type: 'object',
          path: '',
          children: [
            {
              type: 'object',
              path: 'object',
              children: [
                {
                  type: 'string',
                  path: 'object.key',
                },
              ],
            },
          ],
        },
      ),
    ).toThrowError('invalid path')
  })
})
