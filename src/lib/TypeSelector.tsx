import React, { useState } from "react"

import "./type-selector.css"
import { TypeTag } from "./TypeTag"

type SelectProps = {
  value: string
  options: string[]
  onSelect: (value: string) => void
}

const OPTIONS = ["string", "number", "boolean", "array", "object"]

// TODO: manage tab navigation + focus display
export const TypeSelector: React.FC<SelectProps> = ({ value, onSelect }) => {
  const [selected, setSelected] = useState<string>(value)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="select">
      <div
        className={`select-value type-${selected}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <TypeTag type={selected} />
      </div>
      {isOpen && (
        <div className="select-dropdown">
          {OPTIONS.map((option) => (
            <div
              className={`select-dropdown-item type-${option}`}
              onClick={() => {
                setSelected(option)
                onSelect(option)
                setIsOpen(false)
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
