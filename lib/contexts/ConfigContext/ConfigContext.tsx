import { createContext, useContext } from 'react'

export type LeafItToMeConfig = {
  readonly?: boolean | RegExp[]
  disableWarnings?: boolean
  isExpanded?: boolean
}

export const ConfigContext = createContext<LeafItToMeConfig>({})

export const useConfigContext = () => useContext(ConfigContext)
