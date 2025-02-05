import {
  ComponentPropsWithoutRef,
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { classNames } from '../utils/classNames'
import { Popover, PopoverProps } from './Popover/Popover'

import './action-button.css'

type ActionButtonProps = ComponentPropsWithoutRef<'button'> & {
  icon: ReactElement
  readonly?: boolean
  popover?: Omit<PopoverProps, 'targetRef'>
}

export type ActionButtonExternalRef = {
  contains: (node: Node | null) => boolean
}

export const ActionButton = forwardRef<
  ActionButtonExternalRef,
  ActionButtonProps
>(({ icon, className, readonly, popover, ...props }, externalRef) => {
  const localeRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(
    externalRef,
    () => ({
      contains: (node) => localeRef?.current?.contains(node) ?? false,
    }),
    [],
  )

  if (popover) {
    return (
      <div className="action-button-container">
        <Popover {...popover} targetRef={localeRef} />
        <button
          ref={localeRef}
          className={classNames('action-button', className ?? '', {
            readonly,
          })}
          {...props}
        >
          {icon}
        </button>
      </div>
    )
  }
  return (
    <div className="action-button-container">
      <button
        ref={localeRef}
        className={classNames('action-button', className ?? '', { readonly })}
        {...props}
      >
        {icon}
      </button>
    </div>
  )
})
