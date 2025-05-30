import React, { PropsWithChildren, useEffect, useState } from 'react'

import { Container } from './components/Container'
import { ErrorDisplay } from './components/ErrorDisplay'
import { SearchInput } from './components/SearchInput'
import { TreeRoot } from './components/TreeRoot'
import {
  ConfigContextProvider,
  LeafItToMeConfig,
} from './contexts/ConfigContext/ConfigContextProvider'
import { CopyContextProvider } from './contexts/CopyContext/CopyContextProvider'
import { SearchContextProvider } from './contexts/SearchContext/SearchContextProvider'
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
      setDescription(getJsonDescription(json, undefined, undefined, true))
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
      <SearchContextProvider>
        <TreeContextProvider tree={description} onChange={onChange}>
          <CopyContextProvider>
            <Container>
              <SearchInput />
              <TreeRoot />
            </Container>
          </CopyContextProvider>
        </TreeContextProvider>
      </SearchContextProvider>
    </ConfigApp>
  )
}
