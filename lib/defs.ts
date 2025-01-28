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
  name?: string
  value?: Primitive
  children?: Node[]
}

export type Leaf = Node & {
  value: Primitive
  mode?: LeafMode
  readonly?: boolean
}

export enum LeafMode {
  OBJECT,
  ARRAY,
}
