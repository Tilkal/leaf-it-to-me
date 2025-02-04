import React from 'react'

import { TreeRoot } from './components/TreeRoot'
import { LeafItToMeConfig } from './contexts/ConfigContext/ConfigContext'
import { ConfigContextProvider } from './contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from './contexts/TreeContext/TreeContextProvider'
import { JSONType } from './defs'
import { getJsonDescription } from './utils/json'

import './root.css'

export type LeafItToMeProps = {
  json: JSONType
  config?: LeafItToMeConfig
  onChange?: (json: JSONType) => void
}

export const LeafItToMe: React.FC<LeafItToMeProps> = ({
  config,
  json,
  onChange,
}) => {
  const description = getJsonDescription(json)

  return (
    <ConfigContextProvider config={config}>
      <TreeContextProvider tree={description} onChange={onChange}>
        <TreeRoot />
      </TreeContextProvider>
    </ConfigContextProvider>
  )
}
