import React, { useState } from 'react'

import { classNames } from '../utils/classNames'

import './switch.css'

type SwitchProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  ariaLabel?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  ariaLabel,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(Boolean(checked))
  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <div className="switch-container">
      <input
        className="switch-checkbox"
        type="checkbox"
        checked={isChecked}
        aria-label={ariaLabel}
        onChange={() => {
          setIsChecked(!isChecked)
          if (onChange) onChange(!isChecked)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div
        className={classNames('switch', {
          checked: isChecked,
          focused: isFocused,
        })}
      >
        <div className="switch-option">false</div>
        <div className="switch-option">true</div>
      </div>
    </div>
  )
}
