import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useTreeContext } from '../../contexts/TreeContext/TreeContext'
import { LeafMode, LeafType, Node, Primitive } from '../../defs'
import { classNames } from '../../utils/classNames'
import { isValidNumber, isValidString } from '../../utils/json'
import { toKebabCase } from '../../utils/string'
import { ActionButton } from '../ActionButton'
import { Switch } from '../Switch'
import { TypeSelector } from '../TypeSelector'
import { Tick } from '../icons/Tick'
import { X } from '../icons/X'

type LeafEditProps = {
  node: Node
  mode: LeafMode
  errors: Record<string, boolean>
  hasError: boolean
  setErrors: Dispatch<SetStateAction<Record<string, boolean>>>
  warnings: Record<string, boolean>
  hasWarning: boolean
  setWarnings: Dispatch<SetStateAction<Record<string, boolean>>>
}

const typedValue = (
  type: LeafType,
  value: string,
  isChecked: boolean,
): Primitive | undefined => {
  switch (type) {
    case 'null':
      return null
    case 'boolean':
      return isChecked
    case 'string':
      return value
    case 'number':
      return Number(value)
    default:
      return undefined
  }
}

const updatePath = (oldPath: string, name: string): string => {
  const parts = oldPath.split('.')
  parts[parts.length - 1] = toKebabCase(name)
  return parts.join('.')
}

export const LeafEdit: React.FC<LeafEditProps> = ({
  node,
  mode,
  errors,
  warnings,
  hasError,
  hasWarning,
  setErrors,
  setWarnings,
}) => {
  const { updateNode, deleteNode, setEditing } = useTreeContext()
  const [type, setType] = useState<LeafType>(node.type)
  const [name, setName] = useState<string>(node.name ?? '')
  const [value, setValue] = useState<string>(node.value?.toString() ?? '')
  const [isChecked, setIsChecked] = useState<boolean>(
    typeof node.value === 'boolean' ? node.value : false,
  )

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      name: !isValidString(name),
    }))
    setWarnings((prev) => ({
      ...prev,
      name: mode === LeafMode.OBJECT && name === '',
    }))
  }, [mode, name, setErrors, setWarnings])

  useEffect(() => {
    switch (type) {
      case 'string':
        setErrors((prev) => ({
          ...prev,
          value: !isValidString(value),
        }))
        setWarnings((prev) => ({ ...prev, value: value === '' }))
        break
      case 'number':
        setErrors((prev) => ({
          ...prev,
          value: !isValidNumber(value),
        }))
        break
      case 'boolean':
        setErrors((prev) => ({ ...prev, value: false }))
        break
      default:
        break
    }
  }, [type, value, setErrors, setWarnings])

  return (
    <form
      className="leaf-container"
      onSubmit={(event) => {
        event.preventDefault()
        if (hasError) {
          console.log({ hasError })
        } else {
          const updatedNode: Node = {
            ...node,
            type,
            name,
            value: typedValue(type, value, isChecked),
            path:
              mode === LeafMode.OBJECT
                ? updatePath(node.path, name)
                : node.path,
          }
          setEditing(null)
          updateNode(node, updatedNode)
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
            <TypeSelector value={type} onSelect={(value) => setType(value)} />
            {mode === LeafMode.OBJECT && (
              <input
                className={classNames('leaf-input', 'input-name', {
                  error: errors.name,
                  warning: !hasError && warnings.name,
                })}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-label="Modifier la clé"
                placeholder="Key"
              />
            )}
            {['string', 'number'].includes(type) && (
              <input
                className={classNames('leaf-input', 'input-value', {
                  error: errors.value,
                  warning: !hasError && warnings.value,
                })}
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-label="Modifier la valeur"
                placeholder="Value"
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
            if (node.name === '' && node.value === '') deleteNode(node)
            setEditing(null)
          }}
          icon={<X />}
          popover={{ content: 'Cancel' }}
        />
      </div>
    </form>
  )
}
