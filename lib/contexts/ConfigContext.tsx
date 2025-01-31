import React, { PropsWithChildren, createContext } from 'react'

export type LeafItToMeConfig = {
  readonly?: boolean | RegExp[]
  showWarnings?: boolean
  isExpanded?: boolean
}

const Context = createContext<LeafItToMeConfig>({})

type ConfigContextProviderProps = PropsWithChildren & {
  config?: LeafItToMeConfig
}

const defaultConfig: LeafItToMeConfig = {
  readonly: false,
}

export const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({
  config,
  children,
}) => (
  <Context.Provider value={config ?? defaultConfig}>
    {children}
  </Context.Provider>
)
