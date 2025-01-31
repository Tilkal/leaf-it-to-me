import { LeafType, Node, Primitive, Tree } from '../defs'

export const isValidString = (key: string): boolean =>
  /^(?:[^"\\]|\\["\\/bfnrt]|\\u[0-9a-fA-F]{4})*$/.test(key)

export const isValidNumber = (input: string): boolean =>
  /^-{0,1}[0-9]+\.{0,1}[0-9]*([eE]{1}[+-]{1}[0-9]+){0,1}$/.test(input)

const isInvalidValue = (value: unknown): boolean =>
  value === undefined ||
  typeof value === 'function' ||
  typeof value === 'bigint' ||
  typeof value === 'symbol'

const getNodeType = (input: Tree): LeafType => {
  switch (true) {
    case input === null:
      return 'null'
    case Array.isArray(input):
      return 'array'
    case typeof input === 'object':
      return 'object'
    default:
      return typeof input as LeafType
  }
}

const isPrimitive = (input: Primitive | Tree): input is Primitive =>
  ['string', 'number', 'boolean'].includes(typeof input) || input === null

const getNewPath = (parent: string, child?: string | number): string =>
  `${parent}${parent !== '' && child !== undefined ? '.' : ''}${child ?? ''}`

// Recursively create the tree description from a given input
export const getTreeDescription = (
  input: Tree,
  path: string = '',
  nameOrIndex?: string | number,
): Node => {
  // JSON only allows a limited type of values, JS objects do not
  // Since we work with JSON, we only allow JSON types
  if (isInvalidValue(input)) throw new TypeError('invalid JSON value')

  // JSON strings are double quoted and must escape some chars
  // We check if the given string is valid according to those rules
  if (typeof input === 'string' && !isValidString(input))
    throw new SyntaxError('invalid JSON string value')

  // The same rule exist for JSON keys
  if (
    nameOrIndex &&
    typeof nameOrIndex === 'string' &&
    !isValidString(nameOrIndex)
  )
    throw new SyntaxError('invalid JSON string key')

  const newPath = getNewPath(path, nameOrIndex)
  const node: Node = {
    type: getNodeType(input),
    path: newPath,
  }

  // The name is optional, since it is only used for subtrees in an object (no primitives nor arrays)
  if (nameOrIndex && typeof nameOrIndex === 'string') node.name = nameOrIndex

  // Primitives are final nodes with values
  if (isPrimitive(input)) node.value = input

  // Arrays and objects have children
  if (node.type === 'array' && Array.isArray(input))
    node.children = input
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter((value) => value !== undefined)
      .map((value, index) => getTreeDescription(value, newPath, index))

  if (node.type === 'object' && typeof input === 'object' && input !== null)
    node.children = Object.entries(input)
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => getTreeDescription(value, newPath, key))

  return node
}
