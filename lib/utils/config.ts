import { CollapsedConfig, ReadonlyConfig } from '../defs'

export const isReadonly = (readonly?: ReadonlyConfig, path?: string): boolean =>
  (typeof readonly === 'boolean' && readonly === true) ||
  (Array.isArray(readonly) &&
    typeof path === 'string' &&
    readonly.some((regex) => regex.test(path)))

export const shouldCollapse = (
  isCollapsed?: CollapsedConfig,
  path?: string,
): boolean => {
  if (typeof isCollapsed === 'boolean') return isCollapsed
  if (Array.isArray(isCollapsed) && path)
    return isCollapsed.some((regex) => regex.test(path))

  return false
}
