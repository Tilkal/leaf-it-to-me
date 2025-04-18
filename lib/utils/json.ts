import { JSONType, LeafType, Node, Plugin, Primitive } from '../defs'
import { toKebabCase } from './string'

export const isValidString = (key: string): boolean =>
  /^(?:[^\\]|\\[^u]|\\u[0-9a-fA-F]{4})*$/.test(key)

export const isValidNumber = (input: string): boolean =>
  /^-{0,1}[0-9]+\.{0,1}[0-9]*([eE]{1}[+-]{1}[0-9]+){0,1}$/.test(input)

const isInvalidValue = (value: unknown): boolean =>
  value === undefined ||
  typeof value === 'function' ||
  typeof value === 'bigint' ||
  typeof value === 'symbol'

const getNodeType = (input: JSONType, plugins?: Plugin[]): LeafType => {
  switch (true) {
    case plugins && plugins.length !== 0:
      return (plugins.find((plugin) => plugin.checker(input))?.type ??
        getNodeType(input)) as LeafType
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

type JsonDescriptionParameters = {
  json: JSONType
  path?: string
  nameOrIndex?: string | number
  isRoot?: boolean
  plugins?: Plugin[]
}

// Recursively create the tree description from a given input
export const getJsonDescription = ({
  json,
  path = '',
  nameOrIndex,
  isRoot,
  plugins,
}: JsonDescriptionParameters): Node => {
  // JSON only allows a limited type of values, JS objects do not
  // Since we work with JSON, we only allow JSON types
  if (isInvalidValue(json))
    throw new TypeError(`Invalid JSON value at path "${path}".`)

  // JSON strings are double quoted and must escape some chars
  // We check if the given string is valid according to those rules
  if (typeof json === 'string' && !isValidString(json)) {
    throw new SyntaxError(`Invalid JSON value at path "${path}".`)
  }

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
    type: getNodeType(json, plugins),
    path: newPath,
  }

  if (isRoot || isRoot === undefined) node.isRoot = true

  // The name is optional, since it is only used for subtrees in an object (no primitives nor arrays)
  if (nameOrIndex !== undefined && typeof nameOrIndex === 'string')
    node.name = nameOrIndex

  // Primitives are final nodes with values
  if (isPrimitive(json)) node.value = json

  const nodePlugin: Plugin | undefined = plugins?.find(
    (plugin) => plugin.type === node.type,
  )

  // Arrays, objects and custom nested have children
  if (
    (node.type === 'array' || nodePlugin?.nested === 'array') &&
    Array.isArray(json)
  ) {
    node.children = json
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter((value) => value !== undefined)
      .map((value, index) =>
        getJsonDescription({
          json: value,
          path: newPath,
          nameOrIndex: index,
          isRoot: false,
          plugins,
        }),
      )
  }

  if (
    (node.type === 'object' || nodePlugin?.nested === 'object') &&
    typeof json === 'object' &&
    json !== null
  ) {
    node.children = Object.entries(json)
      // Remove undefined values in subtree, they are not allowed in JSON
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) =>
        getJsonDescription({
          json: value,
          path: newPath,
          nameOrIndex: key,
          isRoot: false,
          plugins,
        }),
      )
  }

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
