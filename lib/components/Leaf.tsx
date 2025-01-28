import React, { useEffect, useMemo, useState } from 'react'

import { LeafMode, LeafType, Leaf as ObjectLeaf, Primitive } from '../defs'
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
}

type TempValue<T extends Primitive> = {
  value: T
  tempValue: T
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
  const [name, setName] = useState<TempValue<string>>({
    value: initName ?? '',
    tempValue: initName ?? '',
  })
  const [value, setValue] = useState<TempValue<string>>({
    value: initValue?.toString() ?? '',
    tempValue: initValue?.toString() ?? '',
  })
  const [isChecked, setIsChecked] = useState<TempValue<boolean>>({
    value: typeof initValue === 'boolean' ? initValue : false,
    tempValue: typeof initValue === 'boolean' ? initValue : false,
  })
  const [type, setType] = useState<TempValue<LeafType>>({
    value: initType,
    tempValue: initType,
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const hasError = useMemo(
    () => Object.values(errors).some((value) => value),
    [errors],
  )

  useEffect(() => {
    setErrors((prev) => ({ ...prev, name: !isValidString(name.tempValue) }))
  }, [name])

  useEffect(() => {
    switch (type.tempValue) {
      case 'string':
        setErrors((prev) => ({
          ...prev,
          value: !isValidString(value.tempValue),
        }))
        break
      case 'number':
        setErrors((prev) => ({
          ...prev,
          value: !isValidNumber(value.tempValue),
        }))
        break
      case 'boolean':
        setErrors((prev) => ({ ...prev, value: false }))
        break
      default:
        break
    }
  }, [type.tempValue, value.tempValue])

  if (!readonly && isEditing) {
    return (
      <form
        className="leaf-container"
        onSubmit={(event) => {
          event.preventDefault()
          if (hasError) {
            console.log({ hasError })
          } else {
            setName((prev) => ({ ...prev, value: prev.tempValue }))
            setValue((prev) => ({ ...prev, value: prev.tempValue }))
            setIsChecked((prev) => ({ ...prev, value: prev.tempValue }))
            setType((prev) => ({ ...prev, value: prev.tempValue }))
            setIsEditing(false)
          }
        }}
      >
        <div
          className={classNames('leaf', 'leaf-edit', {
            error: hasError,
          })}
        >
          <div className="leaf-input-group">
            <TypeSelector
              value={type.tempValue}
              options={['string', 'boolean', 'number']}
              onSelect={(value) =>
                setType((prev) => ({ ...prev, tempValue: value }))
              }
            />
            {mode === LeafMode.OBJECT && (
              <input
                className={classNames('leaf-input', 'input-name', {
                  error: errors.name,
                })}
                type="text"
                value={name.tempValue}
                onChange={(event) =>
                  setName((prev) => ({
                    ...prev,
                    tempValue: event.target.value,
                  }))
                }
                aria-label="Modifier la clé"
              />
            )}
            {['string', 'number'].includes(type.tempValue) && (
              <input
                className={classNames('leaf-input', 'input-value', {
                  error: errors.value,
                })}
                type="text"
                value={value.tempValue}
                onChange={(event) =>
                  setValue((prev) => ({
                    ...prev,
                    tempValue: event.target.value,
                  }))
                }
                aria-label="Modifier la valeur"
              />
            )}
            {type.tempValue === 'boolean' && (
              <Switch
                checked={isChecked.tempValue}
                onChange={(checked) =>
                  setIsChecked((prev) => ({ ...prev, tempValue: checked }))
                }
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
            onClick={() => {
              setName((prev) => ({ ...prev, tempValue: prev.value }))
              setValue((prev) => ({ ...prev, tempValue: prev.value }))
              setIsChecked((prev) => ({ ...prev, tempValue: prev.value }))
              setType((prev) => ({ ...prev, tempValue: prev.value }))
              setIsEditing(false)
            }}
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
        <div className={`leaf-type type-${type.value}`}>
          <TypeTag type={type.value} />
        </div>
        {mode === LeafMode.OBJECT && (
          <div className={`leaf-name type-${type.value}`}>{name.value}</div>
        )}
        {['string', 'number'].includes(type.value) && (
          <div className={`leaf-value type-${type.value}`}>{value.value}</div>
        )}
        {['boolean'].includes(type.value) && (
          <div className={`leaf-value type-${type.value}`}>
            {Boolean(isChecked.value).toString()}
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
