import {
  ComponentPropsWithoutRef,
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { VariantState } from '../../defs'
import { classNames } from '../../utils/classNames'
import { Popover, PopoverProps } from '../Popover'

import './action-button.css'

type ActionButtonProps = ComponentPropsWithoutRef<'button'> & {
  icon: ReactElement
  tooltip?: Omit<PopoverProps, 'targetRef'>
  popover?: Omit<PopoverProps, 'targetRef'>
  variant?: VariantState
}

export type ActionButtonExternalRef = {
  contains: (node: Node | null) => boolean
}

export const ActionButton = forwardRef<
  ActionButtonExternalRef,
  ActionButtonProps
>(
  (
    {
      icon,
      className,
      tooltip,
      popover,
      variant = VariantState.DEFAULT,
      ...props
    },
    externalRef,
  ) => {
    const localeRef = useRef<HTMLButtonElement>(null)

    useImperativeHandle(
      externalRef,
      () => ({
        contains: (node) => localeRef?.current?.contains(node) ?? false,
      }),
      [],
    )

    return (
      <div className="action-button-container">
        {popover && <Popover {...popover} targetRef={localeRef} />}
        {tooltip && <Popover {...tooltip} targetRef={localeRef} />}
        <button
          ref={localeRef}
          className={classNames('action-button', variant, className ?? '')}
          {...props}
        >
          {icon}
        </button>
      </div>
    )
  },
)
