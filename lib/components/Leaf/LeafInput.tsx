import React, { ComponentPropsWithoutRef, useRef } from 'react'

import { ErrorLevel } from '../../defs'
import { classNames } from '../../utils/classNames'
import { Popover } from '../Popover'
import { getVariantFromError } from './utils'

type LeafInputProps = ComponentPropsWithoutRef<'input'> & {
  error: ErrorLevel
  message?: string
}

export const LeafInput: React.FC<LeafInputProps> = ({
  error,
  message = '',
  className = '',
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="leaf-input-container">
      <Popover
        targetRef={inputRef}
        content={message}
        variant={getVariantFromError(error)}
        enabled={[ErrorLevel.WARNING, ErrorLevel.ERROR].includes(error)}
      />
      <input
        {...props}
        ref={inputRef}
        className={classNames('leaf-input', className, {
          error: error === ErrorLevel.ERROR,
          warning: error === ErrorLevel.WARNING,
        })}
      />
    </div>
  )
}
