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
