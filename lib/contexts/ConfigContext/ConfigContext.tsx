import { createContext, useContext } from 'react'

import { ReadonlyConfig, Translator } from '../../defs'

type ConfigContextProps = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  isExpanded?: boolean
  t: Translator
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps,
)

export const useConfigContext = () => useContext(ConfigContext)
