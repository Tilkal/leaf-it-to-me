import React, { PropsWithChildren, ReactElement } from 'react'

import { VariantState } from '../../defs'
import { classNames } from '../../utils/classNames'

import './toolbar.css'

export type ToolbarItemProps = PropsWithChildren & {
  icon: ReactElement
  onClick: () => void
  variant?: VariantState
  tabIndex?: -1 | 0
}

export const ToolbarItem: React.FC<ToolbarItemProps> = ({
  icon,
  onClick,
  variant,
  tabIndex,
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
    tabIndex={tabIndex ?? 0}
  >
    <div className="toolbar-icon">{icon}</div>
    <div className="toolbar-label">{children}</div>
  </div>
)
