import React, { PropsWithChildren } from 'react'

import { ExpandedConfig, LanguageConfig, ReadonlyConfig, TranslatorPath } from '../../defs'
import i18n from '../../i18n.json'
import { t } from '../../utils/i18n'
import { ConfigContext } from './ConfigContext'

export type LeafItToMeConfig = {
  readonly?: ReadonlyConfig
  disableWarnings?: boolean
  isExpanded?: ExpandedConfig
  language?: LanguageConfig
}

const defaultConfig: LeafItToMeConfig = {
  readonly: false,
}

type ConfigContextProviderProps = PropsWithChildren & {
  config?: LeafItToMeConfig
}

export const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({
  config,
  children,
}) => {
  const translator: TranslatorPath = (path: string) => {
    if (config?.language?.translations) {
      const translation = t(path, config.language.translations)
      if (translation !== path) return translation
    }

    return t(path, i18n)
  }

  return (
    <ConfigContext.Provider
      value={{
        ...(config ?? defaultConfig),
        t: config?.language?.translator ?? translator,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
