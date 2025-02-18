import React from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { ActionButton } from './ActionButton'
import { Tick } from './icons/Tick'
import { X } from './icons/X'

import './confirm-action.css'

type ConfirmActionProps = {
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmAction: React.FC<ConfirmActionProps> = ({
  onCancel,
  onConfirm,
}) => {
  const { t } = useConfigContext()

  return (
    <div className="confirm-action">
      <div>{t('confirm-action.message')}</div>
      <div className="confirm-action-buttons">
        <ActionButton
          icon={<Tick />}
          onClick={onConfirm}
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
