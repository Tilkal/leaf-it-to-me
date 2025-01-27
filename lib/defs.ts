export type Primitive = string | number | boolean | undefined | null

export type Tree = {
  [key: string | number]: Primitive | Primitive[] | Tree | Tree[]
}

export const LEAF_TYPES = [
  'string',
  'number',
  'boolean',
  'array',
  'object',
] as const

export type LeafType = (typeof LEAF_TYPES)[number]

export type Leaf = {
  type: LeafType
  name?: string
  value: Primitive
}

export enum LeafMode {
  OBJECT,
  ARRAY,
}
