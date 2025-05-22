import React, { PropsWithChildren, ReactElement } from 'react'

import { VariantState } from '../../defs'
import { classNames } from '../../utils/classNames'

import './toolbar.css'

export type ToolbarItemProps = PropsWithChildren & {
  icon: ReactElement
  onClick: () => void
  variant?: VariantState
}

export const ToolbarItem: React.FC<ToolbarItemProps> = ({
  icon,
  onClick,
  variant,
  children,
}) => (
  <div
    className={classNames('toolbar-item', {
      error: variant === VariantState.ERROR,
    })}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === 'Enter' && event.target === document.activeElement) {
        event.preventDefault()
        onClick()
      }
    }}
    tabIndex={0}
  >
    <div className="toolbar-icon">{icon}</div>
    <div className="toolbar-label">{children}</div>
  </div>
)
