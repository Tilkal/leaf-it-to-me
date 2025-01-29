import React from 'react'

import { TreeView } from './components/TreeView'
import { LeafMode, Tree } from './defs'
import { getTreeDescription } from './utils/json'

import './root.css'

type LeafItToMeProps = {
  tree: Tree
}

export const LeafItToMe: React.FC<LeafItToMeProps> = ({ tree }) => {
  const description = getTreeDescription(tree)

  return <TreeView node={description} mode={LeafMode.ROOT} />
}
