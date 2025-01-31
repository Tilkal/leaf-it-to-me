import React, { ReactElement, useEffect, useMemo, useState } from 'react'

import { LeafMode, LeafType, Leaf as ObjectLeaf, Primitive } from '../defs'
import { classNames } from '../utils/classNames'
import { isValidNumber, isValidString } from '../utils/json'
import { ActionButton } from './ActionButton'
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
  addon?: ReactElement | null
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
  addon,
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
  const [warnings, setWarnings] = useState<Record<string, boolean>>({})

  const hasError = useMemo(
    () => Object.values(errors).some((value) => value),
    [errors],
  )

  const hasWarning = useMemo(
    () => Object.values(warnings).some((value) => value),
    [warnings],
  )

  useEffect(() => {
    setErrors((prev) => ({ ...prev, name: !isValidString(name.tempValue) }))
    setWarnings((prev) => ({
      ...prev,
      name: mode === LeafMode.OBJECT && name.tempValue === '',
    }))
  }, [mode, name])

  useEffect(() => {
    switch (type.tempValue) {
      case 'string':
        setErrors((prev) => ({
          ...prev,
          value: !isValidString(value.tempValue),
        }))
        setWarnings((prev) => ({ ...prev, value: value.tempValue === '' }))
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
          <div className="leaf-content">
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
                    warning: !hasError && warnings.name,
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
                  placeholder="Key"
                />
              )}
              {['string', 'number'].includes(type.tempValue) && (
                <input
                  className={classNames('leaf-input', 'input-value', {
                    error: errors.value,
                    warning: !hasError && warnings.value,
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
                  placeholder="Value"
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
        </div>
        <div className="leaf-actions expanded">
          <ActionButton
            className={classNames('leaf-action-button button-submit', {
              error: hasError,
              warning: !hasError && hasWarning,
            })}
            type="submit"
            aria-label="Save"
            icon={<Tick />}
            disabled={hasError}
            popover={{ content: 'Save' }}
          />
          <ActionButton
            className="leaf-action-button button-cancel"
            aria-label="Cancel"
            onClick={() => {
              setName((prev) => ({ ...prev, tempValue: prev.value }))
              setValue((prev) => ({ ...prev, tempValue: prev.value }))
              setIsChecked((prev) => ({ ...prev, tempValue: prev.value }))
              setType((prev) => ({ ...prev, tempValue: prev.value }))
              setIsEditing(false)
            }}
            icon={<X />}
            popover={{ content: 'Cancel' }}
          />
        </div>
      </form>
    )
  }

  return (
    <div className="leaf-container">
      <div
        className={classNames('leaf', {
          readonly,
          error: hasError,
          warning: hasWarning,
        })}
      >
        <div className="leaf-content">
          <div className={`leaf-type type-${type.value}`}>
            <TypeTag type={type.value} />
          </div>
          {mode === LeafMode.OBJECT && (
            <div
              className={classNames(`leaf-name type-${type.value}`, {
                ['empty-string']: name.value === '',
              })}
            >
              {name.value !== '' ? name.value : 'empty key'}
            </div>
          )}
          {['string', 'number'].includes(type.value) && (
            <div
              className={classNames(`leaf-value type-${type.value}`, {
                ['empty-string']: value.value === '',
              })}
            >
              {value.value !== '' ? value.value : 'empty value'}
            </div>
          )}
          {['boolean'].includes(type.value) && (
            <div className={`leaf-value type-${type.value}`}>
              {Boolean(isChecked.value).toString()}
            </div>
          )}
          {type.value === 'null' && (
            <div className="leaf-value type-${type.value}">null</div>
          )}
        </div>

        {addon && <div className="leaf-addon">{addon}</div>}
      </div>
      <div
        className={classNames('leaf-actions', {
          readonly,
          expanded: isExpanded,
        })}
      >
        <ActionButton
          className="leaf-action-button button-expand"
          aria-label={isExpanded ? 'Close toolbar' : 'Open toolbar'}
          onClick={() => setIsExpanded((prev) => !prev)}
          icon={<Chevron />}
          disabled={readonly}
          popover={{ content: isExpanded ? 'Close toolbar' : 'Open toolbar' }}
        />
        <ActionButton
          className={classNames('leaf-action-button button-edit', {
            hidden: !isExpanded,
          })}
          onClick={() => !readonly && isExpanded && setIsEditing(true)}
          aria-label="Edit"
          icon={<Pencil />}
          disabled={readonly}
          tabIndex={isExpanded ? 0 : -1}
          popover={{ content: 'Edit', enabled: !readonly && isExpanded }}
        />
        <ActionButton
          className={classNames('leaf-action-button button-delete', {
            hidden: !isExpanded,
          })}
          aria-label="Delete"
          icon={<TrashCan />}
          disabled={readonly}
          tabIndex={isExpanded ? 0 : -1}
          popover={{ content: 'Delete', enabled: !readonly && isExpanded }}
        />
      </div>
    </div>
  )
}
