import { createContext, useContext } from 'react'

import {
  CollapsedConfig,
  ReadonlyConfig,
  Translator,
  TranslatorPath,
} from '../../defs'

type ConfigContextProps = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  collapsed?: CollapsedConfig
  t: Translator | TranslatorPath
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps,
)

export const useConfigContext = () => useContext(ConfigContext)
