import React from 'react'

import { TreeRoot } from './components/TreeRoot'
import { LeafItToMeConfig } from './contexts/ConfigContext/ConfigContext'
import { ConfigContextProvider } from './contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from './contexts/TreeContext/TreeContextProvider'
import { Tree } from './defs'
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
      <TreeContextProvider tree={description}>
        <TreeRoot />
      </TreeContextProvider>
    </ConfigContextProvider>
  )
}
