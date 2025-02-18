import i18n from './i18n.json'

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
  NONE = 'none',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum VariantState {
  DEFAULT = 'default',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export const ErrorMessages: Partial<
  Record<LeafType, Partial<Record<ErrorLevel, string>>>
> = {
  string: {
    [ErrorLevel.ERROR]: `Value must be a valid JSON string.
            Some characters are forbidden and must be escaped:
            - Double quote "
            - Reverse solidus \\
            - Unterminated unicode \\u12`,
    [ErrorLevel.WARNING]: 'Empty values may cause issues.',
  },
  number: {
    [ErrorLevel.ERROR]:
      'Value must be a valid number. At least one character, numeric only (0..9).',
    [ErrorLevel.WARNING]: 'Empty values may cause issues.',
  },
}

export type ReadonlyConfig = boolean | RegExp[]

export type Translator = (path: string) => string

export type I18NPath = Path<typeof i18n>

export type TranslatorPath = (path: I18NPath) => string

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type Translations = DeepPartial<typeof i18n>

export type LanguageConfig = {
  translator?: Translator
  translations?: Translations
}

export type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${Path<T[K]>}`
      : never
  : never
