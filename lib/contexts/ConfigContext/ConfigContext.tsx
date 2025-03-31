import { createContext, useContext } from 'react'

import { ExpandedConfig, ReadonlyConfig, Translator, TranslatorPath } from '../../defs'

type ConfigContextProps = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  isExpanded?: ExpandedConfig
  t: Translator | TranslatorPath
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps,
)

export const useConfigContext = () => useContext(ConfigContext)
