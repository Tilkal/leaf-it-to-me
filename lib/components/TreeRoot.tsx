import React from 'react'

import { useTreeContext } from '../contexts/TreeContext/TreeContext'
import { LeafMode } from '../defs'
import { hashCode } from '../utils/memoization'
import { TreeView } from './TreeView'

export const TreeRoot: React.FC = () => {
  const { tree } = useTreeContext()

  // Key is required to correctly update component on context change
  return <TreeView key={hashCode(tree)} node={tree} mode={LeafMode.ROOT} />
}
