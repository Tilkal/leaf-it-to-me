export type Primitive = string | number | boolean | null

export type JSONType =
  | Primitive
  | {
      [key: string]: JSONType
    }
  | JSONType[]

export const LEAF_TYPES = [
  'null',
  'string',
  'number',
  'boolean',
  'array',
  'object',
] as const

export type LeafType = (typeof LEAF_TYPES)[number]

export type Node = {
  type: LeafType
  path: string
  name?: string
  value?: Primitive
  children?: Node[]
}

export enum LeafMode {
  OBJECT,
  ARRAY,
  ROOT,
}

export type TempValue<T extends Primitive> = {
  value: T
  tempValue: T
}

export interface AddNodeAction {
  (parentNode: Node, childNode: Node): void
}

export interface UpdateNodeAction {
  (oldNode: Node, newNode: Node): void
}

export interface DeleteNodeAction {
  (node: Node): void
}

export enum ErrorLevel {
  NONE,
  INFO,
  WARNING,
  ERROR,
}

export enum VariantState {
  DEFAULT = 'default',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
