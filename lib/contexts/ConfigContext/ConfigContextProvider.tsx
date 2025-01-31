import React, { PropsWithChildren } from 'react'

import { ConfigContext, LeafItToMeConfig } from './ConfigContext'

const defaultConfig: LeafItToMeConfig = {
  readonly: false,
}

type ConfigContextProviderProps = PropsWithChildren & {
  config?: LeafItToMeConfig
}

export const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({
  config,
  children,
}) => (
  <ConfigContext.Provider value={config ?? defaultConfig}>
    {children}
  </ConfigContext.Provider>
)
