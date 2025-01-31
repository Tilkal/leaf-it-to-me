import React from 'react'

import { TreeView } from './components/TreeView'
import {
  ConfigContextProvider,
  LeafItToMeConfig,
} from './contexts/ConfigContext'
import { LeafMode, Tree } from './defs'
import { getTreeDescription } from './utils/json'

import './root.css'

type LeafItToMeProps = {
  tree: Tree
  config?: LeafItToMeConfig
}

export const LeafItToMe: React.FC<LeafItToMeProps> = ({ config, tree }) => {
  const description = getTreeDescription(tree)

  return (
    <ConfigContextProvider config={config}>
      <TreeView node={description} mode={LeafMode.ROOT} />
    </ConfigContextProvider>
  )
}
