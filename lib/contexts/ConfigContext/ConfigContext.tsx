import { createContext, useContext } from 'react'

import {
  ExpandedConfig,
  Plugin,
  ReadonlyConfig,
  Translator,
  TranslatorPath,
} from '../../defs'

type ConfigContextProps = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  isExpanded?: ExpandedConfig
  t: Translator | TranslatorPath
  plugins?: Plugin[]
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps,
)

export const useConfigContext = () => useContext(ConfigContext)
