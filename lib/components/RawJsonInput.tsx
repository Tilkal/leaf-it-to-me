import React, { useState } from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { ActionButton } from './ActionButton'
import { Merge } from './icons/Merge'
import { Tick } from './icons/Tick'
import { X } from './icons/X'

import './raw-json-input.css'

export type RawJsonInputProps = {
  onCancel: () => void
  onAdd: (value: string) => void
  onMerge: (value: string) => void
  error: string | undefined
}

export const RawJsonInput: React.FC<RawJsonInputProps> = ({
  onAdd,
  onMerge,
  onCancel,
  error,
}) => {
  const { t } = useConfigContext()
  const [rawJson, setRawJson] = useState<string>('')

  return (
    <div className="raw-json-input">
      <label>{t('raw-json-input.title')}</label>
      <textarea onChange={(event) => setRawJson(event.target.value)} />
      {error && <div>{error}</div>}
      <div className="confirm-action-buttons">
        <ActionButton
          icon={<Tick />}
          onClick={() => onAdd(rawJson)}
          aria-label={t('confirm-action.action.confirm.label')}
        />
        <ActionButton
          icon={<Merge />}
          onClick={() => onMerge(rawJson)}
          aria-label={t('confirm-action.action.confirm.label')}
        />
        <ActionButton
          icon={<X />}
          onClick={onCancel}
          aria-label={t('confirm-action.action.cancel.label')}
        />
      </div>
    </div>
  )
}
