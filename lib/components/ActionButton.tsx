import { ComponentPropsWithoutRef, ReactElement, forwardRef } from 'react'

import { classNames } from '../utils/classNames'
import { Popover, PopoverProps } from './Popover/Popover'

import './action-button.css'

type ActionButtonProps = ComponentPropsWithoutRef<'button'> & {
  icon: ReactElement
  readonly?: boolean
  popover?: Omit<PopoverProps, 'children'>
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, className, readonly, popover, ...props }, ref) => {
    if (popover) {
      return (
        <Popover {...popover}>
          <button
            ref={ref}
            className={classNames('action-button', className ?? '', {
              readonly,
            })}
            {...props}
          >
            {icon}
          </button>
        </Popover>
      )
    }
    return (
      <button
        ref={ref}
        className={classNames('action-button', className ?? '', { readonly })}
        {...props}
      >
        {icon}
      </button>
    )
  },
)
