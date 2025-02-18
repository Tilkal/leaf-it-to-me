import React, { useEffect, useState } from 'react'

import { ErrorDisplay } from './components/ErrorDisplay'
import { TreeRoot } from './components/TreeRoot'
import {
  ConfigContextProvider,
  LeafItToMeConfig,
} from './contexts/ConfigContext/ConfigContextProvider'
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
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      setDescription(getJsonDescription(json))
    } catch (error) {
      if (typeof error === 'string') {
        setError(error)
      } else if (error instanceof Error) {
        setError(error.message)
      }
    }
  }, [json])

  if (description === null) return null

  return (
    <ConfigContextProvider config={config}>
      <TreeContextProvider tree={description} onChange={onChange}>
        {error ? <ErrorDisplay message={error} /> : <TreeRoot />}
      </TreeContextProvider>
    </ConfigContextProvider>
  )
}
