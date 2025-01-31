export type Primitive = string | number | boolean | null

export type Tree =
  | Primitive
  | {
      [key: string]: Tree
    }
  | Tree[]

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

export type Leaf = Node & {
  mode?: LeafMode
  readonly?: boolean
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
