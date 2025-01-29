import React, { ComponentPropsWithoutRef, ReactElement } from 'react'

import { classNames } from '../utils/classNames'
import { Popover, PopoverProps } from './Popover'

import './action-button.css'

type ActionButtonProps = ComponentPropsWithoutRef<'button'> & {
  icon: ReactElement
  readonly?: boolean
  popover?: Omit<PopoverProps, 'children'>
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  className,
  readonly,
  popover,
  ...props
}) => {
  if (popover) {
    return (
      <Popover {...popover}>
        <button
          className={classNames('action-button', className ?? '', { readonly })}
          {...props}
        >
          {icon}
        </button>
      </Popover>
    )
  }
  return (
    <button
      className={classNames('action-button', className ?? '', { readonly })}
      {...props}
    >
      {icon}
    </button>
  )
}
