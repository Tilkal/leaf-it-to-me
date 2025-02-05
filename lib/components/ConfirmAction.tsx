import React from 'react'

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
}) => (
  <div className="confirm-action">
    <div>This action cannot be undone.</div>
    <div>Do you wish to continue?</div>
    <div className="confirm-action-buttons">
      <ActionButton
        icon={<Tick />}
        onClick={onConfirm}
        aria-label="Confirm action"
      />
      <ActionButton
        icon={<X />}
        onClick={onCancel}
        aria-label="Cancel action"
      />
    </div>
  </div>
)
