import React, { useState } from 'react'

import { Leaf as LeafProps, Primitive } from '../types'
import { classNames } from '../utils/classNames'
import { TypeSelector } from './TypeSelector'
import { TypeTag } from './TypeTag'
import { Tick } from './icons/Tick'
import { X } from './icons/X'

import './leaf.css'

export const Leaf: React.FC<LeafProps> = ({
  name: initName,
  value: initValue,
  readonly,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(initName)
  const [value, setValue] = useState<Primitive>(initValue)
  const type = 'string'

  if (!readonly && isEditing) {
    return (
      <div className="leaf leaf-edit">
        <div className="leaf-input-group">
          <TypeSelector
            value={type}
            options={['string', 'boolean', 'number']}
            onSelect={(value) => console.log({ value })}
          />
          <input className="leaf-input input-name" type="text" value={name} />
          <input
            className="leaf-input input-value"
            type="text"
            value={value?.toString() ?? ''}
          />
          <button
            className="leaf-input-group-button"
            onClick={() => setIsEditing(false)}
          >
            <Tick />
          </button>
        </div>
        <button className="leaf-delete">
          <X />
        </button>
      </div>
    )
  }

  return (
    <div
      className={classNames('leaf', { readonly })}
      onClick={() => !readonly && setIsEditing(true)}
    >
      <div className={`leaf-type type-${type}`}>
        <TypeTag type={type} />
      </div>
      <div className={`leaf-name type-${type}`}>{name}</div>
      <div className={`leaf-value type-${type}`}>{value}</div>
      <button className={classNames('leaf-delete', { readonly })}>
        <X />
      </button>
    </div>
  )
}
