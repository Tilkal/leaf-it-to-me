import React, { useState } from "react"

import { Leaf as LeafProps, Primitive } from "./types"
import { X } from "./icons/X"

import "./leaf.css"
import { Tick } from "./icons/Tick"
import { TypeSelector } from "./TypeSelector"
import { TypeTag } from "./TypeTag"

export const Leaf: React.FC<LeafProps> = ({
  name: initName,
  value: initValue,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(initName)
  const [value, setValue] = useState<Primitive>(initValue)
  const type = "string"

  if (isEditing) {
    return (
      <div className="leaf leaf-edit">
        <div className="leaf-input-group">
          <TypeSelector
            value={type}
            options={["string", "boolean", "number"]}
            onSelect={(value) => console.log({ value })}
          />
          <input className="leaf-input input-name" type="text" value={name} />
          <input
            className="leaf-input input-value"
            type="text"
            value={value?.toString() ?? ""}
          />
          {/* // TODO: Manage focus on tab for full div instead of button */}
          <div className="leaf-input-group-button">
            <button
              className="leaf-confirm"
              onClick={() => setIsEditing(false)}
            >
              <Tick />
            </button>
          </div>
        </div>
        <button className="leaf-close">
          <X />
        </button>
      </div>
    )
  }

  return (
    <div className="leaf" onClick={() => setIsEditing(true)}>
      <div className={`leaf-type type-${type}`}>
        <TypeTag type={type} />
      </div>
      <div className={`leaf-name type-${type}`}>{name}</div>
      <div className={`leaf-value type-${type}`}>{value}</div>
      <button className="leaf-close">
        <X />
      </button>
    </div>
  )
}
