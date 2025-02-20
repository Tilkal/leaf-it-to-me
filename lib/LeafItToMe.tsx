import React, { PropsWithChildren, useEffect, useState } from 'react'

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

const ConfigApp: React.FC<
  Pick<LeafItToMeProps, 'config'> & PropsWithChildren
> = ({ config, children }) => (
  <ConfigContextProvider config={config}>{children}</ConfigContextProvider>
)

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

  if (error) {
    return (
      <ConfigApp config={config}>
        <ErrorDisplay message={error} />
      </ConfigApp>
    )
  }

  if (description === null) return null

  return (
    <ConfigApp config={config}>
      <TreeContextProvider tree={description} onChange={onChange}>
        <TreeRoot />
      </TreeContextProvider>
    </ConfigApp>
  )
}
