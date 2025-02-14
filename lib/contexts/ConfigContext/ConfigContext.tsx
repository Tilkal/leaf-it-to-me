import { createContext, useContext } from 'react'

import { ReadonlyConfig } from '../../defs'

export type LeafItToMeConfig = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  isExpanded?: boolean
}

export const ConfigContext = createContext<LeafItToMeConfig>({})

export const useConfigContext = () => useContext(ConfigContext)
