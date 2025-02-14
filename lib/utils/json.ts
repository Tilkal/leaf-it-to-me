import { JSONType, LeafType, Node, Primitive } from '../defs'
import { toKebabCase } from './string'

export const isValidString = (key: string): boolean =>
  /^(?:[^"\\]|\\["\\/bfnrt]|\\u[0-9a-fA-F]{4})*$/.test(key)

export const isValidNumber = (input: string): boolean =>
  /^-{0,1}[0-9]+\.{0,1}[0-9]*([eE]{1}[+-]{1}[0-9]+){0,1}$/.test(input)

const isInvalidValue = (value: unknown): boolean =>
  value === undefined ||
  typeof value === 'function' ||
  typeof value === 'bigint' ||
  typeof value === 'symbol'

const getNodeType = (input: JSONType): LeafType => {
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

const isPrimitive = (input: Primitive | JSONType): input is Primitive =>
  ['string', 'number', 'boolean'].includes(typeof input) || input === null

const getNewPath = (parent: string, child?: string | number): string =>
  `${parent}${parent !== '' && child !== undefined ? '.' : ''}${child ?? ''}`

// Recursively create the tree description from a given input
export const getJsonDescription = (
  input: JSONType,
  path: string = '',
  nameOrIndex?: string | number,
): Node => {
  // JSON only allows a limited type of values, JS objects do not
  // Since we work with JSON, we only allow JSON types
  if (isInvalidValue(input))
    throw new TypeError(`Invalid JSON value at path "${path}".`)

  // JSON strings are double quoted and must escape some chars
  // We check if the given string is valid according to those rules
  if (typeof input === 'string' && !isValidString(input))
    throw new SyntaxError(`Invalid JSON value at path "${path}".`)

  // The same rule exist for JSON keys
  if (
    nameOrIndex &&
    typeof nameOrIndex === 'string' &&
    !isValidString(nameOrIndex)
  )
    throw new SyntaxError(`Invalid JSON key at path "${path}".`)

  const newPath = getNewPath(
    path,
    typeof nameOrIndex === 'string' ? toKebabCase(nameOrIndex) : nameOrIndex,
  )
  const node: Node = {
    type: getNodeType(input),
    path: newPath,
  }

  // The name is optional, since it is only used for subtrees in an object (no primitives nor arrays)
  if (nameOrIndex !== undefined && typeof nameOrIndex === 'string')
    node.name = nameOrIndex

  // Primitives are final nodes with values
  if (isPrimitive(input)) node.value = input

  // Arrays and objects have children
  if (node.type === 'array' && Array.isArray(input))
    node.children = input
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter((value) => value !== undefined)
      .map((value, index) => getJsonDescription(value, newPath, index))

  if (node.type === 'object' && typeof input === 'object' && input !== null)
    node.children = Object.entries(input)
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => getJsonDescription(value, newPath, key))

  return node
}

export const getJsonFromNode = (node: Node): JSONType => {
  switch (node.type) {
    case 'string':
    case 'number':
    case 'boolean':
      return node.value ?? null // Should not happen in those cases, string, number and boolean should always have a value
    case 'null':
      return null // null is null, any other value is invalid and should not happen
    case 'array':
      return [...(node.children?.map((child) => getJsonFromNode(child)) ?? [])]
    case 'object':
      return (
        node.children?.reduce(
          (object: Record<string, JSONType>, child: Node) => {
            if (typeof child.name === 'string')
              object[child.name] = getJsonFromNode(child)
            return object
          },
          {},
        ) ?? {}
      )
    default:
      throw new TypeError(
        `Node at path ${node.path} has an unsupported type (${node.type}).`,
      )
  }
}
