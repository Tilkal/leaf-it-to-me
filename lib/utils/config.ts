import { ExpandedConfig, ReadonlyConfig } from '../defs'

export const isReadonly = (readonly?: ReadonlyConfig, path?: string): boolean =>
  (typeof readonly === 'boolean' && readonly === true) ||
  (Array.isArray(readonly) &&
    typeof path === 'string' &&
    readonly.some((regex) => regex.test(path)))


export const shouldExpand = (isExpanded?: ExpandedConfig, path?: string): boolean => {
  if (typeof isExpanded === 'boolean') return isExpanded
  if (Array.isArray(isExpanded) && path) return isExpanded.some((regex) => regex.test(path))

  return true
}