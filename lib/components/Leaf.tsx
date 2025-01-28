import React, { useEffect, useMemo, useState } from 'react'

import { LeafMode, LeafType, Leaf as ObjectLeaf } from '../defs'
import { classNames } from '../utils/classNames'
import { isValidNumber, isValidString } from '../utils/json'
import { Switch } from './Switch'
import { TypeSelector } from './TypeSelector'
import { TypeTag } from './TypeTag'
import { Chevron } from './icons/Chevron'
import { Pencil } from './icons/Pencil'
import { Tick } from './icons/Tick'
import { TrashCan } from './icons/TrashCan'
import { X } from './icons/X'

import './leaf.css'

type LeafProps = ObjectLeaf & {
  edit?: boolean
  mode?: LeafMode
  readonly?: boolean
}

export const Leaf: React.FC<LeafProps> = ({
  edit = false,
  type: initType,
  name: initName,
  value: initValue,
  mode = LeafMode.OBJECT,
  readonly,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(edit)
  const [name, setName] = useState<string>(initName ?? '')
  const [value, setValue] = useState<string>(initValue?.toString() ?? '')
  const [isChecked, setIsChecked] = useState<boolean>(
    typeof initValue === 'boolean' ? initValue : false,
  )
  const [isExpanded, setIsExpanded] = useState(false)
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
        setErrors((prev) => ({ ...prev, value: !isValidNumber(value) }))
        break
      case 'boolean':
        setErrors((prev) => ({ ...prev, value: false }))
        break
      default:
        break
    }
  }, [type, value])

  if (!readonly && isEditing) {
    return (
      <form className="leaf-container">
        <div
          className={classNames('leaf', 'leaf-edit', {
            error: hasError,
          })}
          onSubmit={(event) => {
            console.log({ event })
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
            {mode === LeafMode.OBJECT && (
              <input
                className={classNames('leaf-input', 'input-name', {
                  error: errors.name,
                })}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-label="Modifier la clé"
              />
            )}
            {['string', 'number'].includes(type) && (
              <input
                className={classNames('leaf-input', 'input-value', {
                  error: errors.value,
                })}
                type="text"
                value={value?.toString() ?? ''}
                onChange={(event) => setValue(event.target.value)}
                aria-label="Modifier la valeur"
              />
            )}
            {type === 'boolean' && (
              <Switch
                checked={isChecked}
                onChange={(checked) => setIsChecked(checked)}
              />
            )}
          </div>
        </div>
        <div className="leaf-actions expanded">
          <button
            className={classNames('leaf-action-button', 'button-submit', {
              error: hasError,
            })}
            type="submit"
            aria-label="Valider les modifications"
          >
            <Tick />
          </button>
          <button
            className="leaf-action-button button-cancel"
            aria-label="Annuler les modifications"
          >
            <X />
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="leaf-container">
      <div className={classNames('leaf', { readonly })}>
        <div className={`leaf-type type-${type}`}>
          <TypeTag type={type} />
        </div>
        {mode === LeafMode.OBJECT && (
          <div className={`leaf-name type-${type}`}>{name}</div>
        )}
        {['string', 'number'].includes(type) && (
          <div className={`leaf-value type-${type}`}>{value}</div>
        )}
        {['boolean'].includes(type) && (
          <div className={`leaf-value type-${type}`}>
            {Boolean(isChecked).toString()}
          </div>
        )}
      </div>
      <div
        className={classNames('leaf-actions', {
          readonly,
          expanded: isExpanded,
        })}
      >
        <button
          className={classNames('leaf-action-button button-expand', {
            readonly,
          })}
          aria-label="Ouvrir"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Chevron />
        </button>

        <button
          className={classNames('leaf-action-button button-edit', {
            readonly,
          })}
          onClick={() => !readonly && setIsEditing(true)}
          aria-label="Modifier la ligne"
        >
          <Pencil />
        </button>

        <button
          className={classNames('leaf-action-button button-delete', {
            readonly,
          })}
          aria-label="Supprimer la ligne"
        >
          <TrashCan />
        </button>
      </div>
    </div>
  )
}
