import React, { useEffect, useRef, useState } from 'react'

import { LEAF_TYPES, LeafType } from '../defs'
import { TypeTag } from './TypeTag'

import './type-selector.css'

type SelectProps = {
  value: string
  options: string[]
  onSelect: (value: LeafType) => void
}

type IsOpen = { isFocused: boolean; isClicked: boolean }

// TODO: manage tab navigation + focus display
export const TypeSelector: React.FC<SelectProps> = ({ value, onSelect }) => {
  const [selected, setSelected] = useState<string>(value)
  const [isOpen, setIsOpen] = useState<IsOpen>({
    isFocused: false,
    isClicked: false,
  })
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onClickOutside = (event: Event) => {
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
      onBlur={(event) => {
        if (!dropdownRef.current?.contains(event.relatedTarget)) {
          setIsOpen({ isClicked: false, isFocused: false })
        }
      }}
      onKeyDown={(event) => {
        if (
          event.key === 'ArrowDown' &&
          event.target === document.activeElement &&
          dropdownRef.current?.firstChild &&
          dropdownRef.current.firstChild instanceof HTMLElement
        ) {
          dropdownRef.current.firstChild.focus()
        }
      }}
    >
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
        <div className="type-selector-dropdown" ref={dropdownRef}>
          {LEAF_TYPES.map((option) => (
            <div
              key={option}
              tabIndex={0}
              className={`type-selector-dropdown-item type-${option}`}
              onClick={() => {
                setSelected(option)
                onSelect(option)
                setIsOpen({ isClicked: false, isFocused: false })
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setSelected(option)
                }
                if (
                  event.key === 'ArrowDown' &&
                  event.target instanceof HTMLElement &&
                  event.target.nextSibling instanceof HTMLElement
                ) {
                  event.target.nextSibling.focus()
                }
                if (
                  event.key === 'ArrowUp' &&
                  event.target instanceof HTMLElement &&
                  event.target.previousSibling instanceof HTMLElement
                ) {
                  event.target.previousSibling.focus()
                }
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
