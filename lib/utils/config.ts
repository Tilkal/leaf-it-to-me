import { ReadonlyConfig } from '../defs'

export const isReadonly = (readonly?: ReadonlyConfig, path?: string): boolean =>
  (typeof readonly === 'boolean' && readonly === true) ||
  (Array.isArray(readonly) &&
    typeof path === 'string' &&
    readonly.some((regex) => regex.test(path)))
