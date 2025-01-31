import React, { useEffect, useState } from 'react'

import { Error } from './components/Error'
import { TreeRoot } from './components/TreeRoot'
import { LeafItToMeConfig } from './contexts/ConfigContext/ConfigContext'
import { ConfigContextProvider } from './contexts/ConfigContext/ConfigContextProvider'
import { TreeContextProvider } from './contexts/TreeContext/TreeContextProvider'
import { JSONType, Node } from './defs'
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
  const [description, setDescription] = useState<Node | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    try {
      setDescription(getJsonDescription(json))
    } catch (error) {
      setHasError(true)
    }
  }, [json])

  if (hasError) {
    return <Error />
  }

  if (description === null) {
    return null
  }

  return (
    <ConfigContextProvider config={config}>
      <TreeContextProvider tree={description} onChange={onChange}>
        <TreeRoot />
      </TreeContextProvider>
    </ConfigContextProvider>
  )
}
