import React from 'react'

import { TreeRoot } from './components/TreeRoot'
import { LeafItToMeConfig } from './contexts/ConfigContext/ConfigContext'
import { ConfigContextProvider } from './contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from './contexts/TreeContext/TreeContextProvider'
import { JSON } from './defs'
import { getJsonDescription } from './utils/json'

import './root.css'

type LeafItToMeProps = {
  json: JSON
  config?: LeafItToMeConfig
  onChange?: (json: JSON) => void
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
