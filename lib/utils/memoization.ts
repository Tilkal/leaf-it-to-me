import { Node } from '../defs'

// Create simple hash code from node for React.memo arePropsEqual parameter
// Based on https://stackoverflow.com/a/8831937
export const hashCode = (node: Node): number => {
  const str = JSON.stringify(node)
  let hash = 0
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  hashFn?: (...args: Parameters<T>) => string | number,
  cache: Map<string | number, ReturnType<T>> = new Map(),
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const hash = hashFn ? hashFn(...args) : args.join(':')
    if (!cache.has(hash)) cache.set(hash, fn(...args))
    return cache.get(hash)!
  }
}
