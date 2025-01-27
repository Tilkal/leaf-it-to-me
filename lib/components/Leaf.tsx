import React, { useEffect, useMemo, useState } from 'react'

import { Leaf as LeafProps, LeafType } from '../defs'
import { classNames } from '../utils/classNames'
import { isValidNumber, isValidString } from '../utils/json'
import { TypeSelector } from './TypeSelector'
import { TypeTag } from './TypeTag'
import { Tick } from './icons/Tick'
import { X } from './icons/X'

import './leaf.css'

export const Leaf: React.FC<LeafProps> = ({
  type: initType,
  name: initName,
  value: initValue,
  readonly,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(initName)
  const [value, setValue] = useState<string>(initValue?.toString() ?? '')
  const [type, setType] = useState<LeafType>(initType)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const hasError = useMemo(
    () => Object.values(errors).some((value) => value),
    [errors],
  )

  useEffect(() => {
    setErrors((prev) => ({ ...prev, name: !isValidString(name) }))
  }, [name])

  useEffect(() => {
    switch (type) {
      case 'string':
        setErrors((prev) => ({ ...prev, value: !isValidString(value) }))
        break

      case 'number':
        setErrors((prev) => ({...prev, value: !isValidNumber(value)}))
        break
      default:
        break
    }
  }, [type, value])

  if (!readonly && isEditing) {
    return (
      <form
        className={classNames('leaf', 'leaf-edit', {
          error: hasError,
        })}
        onSubmit={(event) => {
          event.preventDefault()
          if (hasError) {
            console.log({ hasError })
          } else {
            setIsEditing(false)
          }
        }}
      >
        <div className="leaf-input-group">
          <TypeSelector
            value={type}
            options={['string', 'boolean', 'number']}
            onSelect={(value) => setType(value)}
          />
          <input
            className={classNames('leaf-input', 'input-name', {
              error: errors.name,
            })}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className={classNames('leaf-input', 'input-value', {
              error: errors.value,
            })}
            type="text"
            value={value?.toString() ?? ''}
            onChange={(event) => setValue(event.target.value)}
          />
          <button
            className={classNames('leaf-input-group-button', 'button-submit', {
              error: hasError,
            })}
            type="submit"
          >
            <Tick />
          </button>
        </div>
        <button className="leaf-delete">
          <X />
        </button>
      </form>
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
