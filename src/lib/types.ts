export type Primitive = string | number | boolean | undefined | null

export type Tree = {
  [key: string | number]: Primitive | Primitive[] | Tree | Tree[]
}

export type Leaf = {
  name: string
  value: Primitive
}
