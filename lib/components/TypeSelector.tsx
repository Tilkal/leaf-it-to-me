import React, { useEffect, useRef, useState } from 'react'

import { TypeTag } from './TypeTag'

import './type-selector.css'

type SelectProps = {
  value: string
  options: string[]
  onSelect: (value: string) => void
}

const OPTIONS = ['string', 'number', 'boolean', 'array', 'object']

type IsOpen = { isFocused: boolean; isClicked: boolean }

// TODO: manage tab navigation + focus display
export const TypeSelector: React.FC<SelectProps> = ({ value, onSelect }) => {
  const [selected, setSelected] = useState<string>(value)
  const [isOpen, setIsOpen] = useState<IsOpen>({
    isFocused: false,
    isClicked: false,
  })
  const ref = useRef<HTMLDivElement>(null)

  const onClickOutside: EventListener = (event) => {
    if (
      ref &&
      event.target instanceof Node &&
      !ref.current?.contains(event.target)
    ) {
      setIsOpen({ isFocused: false, isClicked: false })
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [ref])

  return (
    <div
      className="type-selector"
      ref={ref}
      tabIndex={0}
      onFocus={() => setIsOpen((prev) => ({ ...prev, isFocused: true }))}
      onBlur={() => setIsOpen((prev) => ({ ...prev, isFocused: false }))}
    >
      <select>
        {OPTIONS.map((option) => (
          <option value={option} selected={selected === option}>
            {option}
          </option>
        ))}
      </select>
      <div
        className={`type-selector-value type-${selected}`}
        onClick={() => {
          ref.current?.focus()
          setIsOpen((prev) => ({
            isClicked: !prev.isClicked,
            isFocused: false,
          }))
        }}
      >
        <TypeTag type={selected} />
      </div>
      {(isOpen.isFocused || isOpen.isClicked) && (
        <div className="type-selector-dropdown">
          {OPTIONS.map((option) => (
            <div
              className={`type-selector-dropdown-item type-${option}`}
              onClick={() => {
                setSelected(option)
                onSelect(option)
                setIsOpen({ isClicked: false, isFocused: false })
              }}
            >
              <TypeTag type={option} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
