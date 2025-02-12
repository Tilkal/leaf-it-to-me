import React, { useEffect, useRef, useState } from 'react'

import { LEAF_TYPES, LeafType } from '../../defs'
import { classNames } from '../../utils/classNames'
import { TypeTag } from '../TypeTag'

import './type-selector.css'

type SelectProps = {
  value: string
  onSelect: (value: LeafType) => void
}

export const TypeSelector: React.FC<SelectProps> = ({ value, onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(
    LEAF_TYPES.findIndex((item) => item === value),
  )
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onClickOutside = (event: Event) => {
    if (
      ref &&
      event.target instanceof Node &&
      !ref.current?.contains(event.target)
    ) {
      setIsOpen(false)
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
      role="select"
      onClick={() => {
        setIsOpen((prev) => !prev)
      }}
      onBlur={(event) => {
        if (!dropdownRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
      onKeyDown={(event) => {
        if (
          event.key === 'ArrowDown' &&
          event.target === document.activeElement
        ) {
          event.preventDefault()
          const newIndex =
            selectedIndex === LEAF_TYPES.length - 1
              ? selectedIndex
              : selectedIndex + 1
          setSelectedIndex(newIndex)
          onSelect(LEAF_TYPES[newIndex])
        }
        if (
          event.key === 'ArrowUp' &&
          event.target === document.activeElement
        ) {
          event.preventDefault()
          const newIndex =
            selectedIndex === 0 ? selectedIndex : selectedIndex - 1
          setSelectedIndex(newIndex)
          onSelect(LEAF_TYPES[newIndex])
        }
        if (event.key === 'Enter' && event.target === document.activeElement) {
          event.preventDefault()
          setIsOpen(false)
        }
      }}
    >
      <div className={`type-selector-value type-${LEAF_TYPES[selectedIndex]}`}>
        <TypeTag type={LEAF_TYPES[selectedIndex]} />
      </div>
      {isOpen && (
        <div className="type-selector-dropdown" ref={dropdownRef}>
          {LEAF_TYPES.map((option, index) => (
            <div
              key={option}
              className={classNames(
                `type-selector-dropdown-item type-${option}`,
                { hover: index === selectedIndex },
              )}
              role="option"
              onClick={(event) => {
                event.stopPropagation()
                setSelectedIndex(index)
                setIsOpen(false)
                onSelect(option)
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
