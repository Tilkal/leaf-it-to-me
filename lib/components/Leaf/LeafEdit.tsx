import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useTreeContext } from '../../contexts/TreeContext/TreeContext'
import {
  ErrorLevel,
  LeafMode,
  LeafType,
  Node,
  Primitive,
  VariantState,
} from '../../defs'
import { classNames } from '../../utils/classNames'
import { isValidNumber, isValidString } from '../../utils/json'
import { toKebabCase } from '../../utils/string'
import { ActionButton } from '../ActionButton'
import { Popover } from '../Popover/Popover'
import { Switch } from '../Switch'
import { TypeSelector } from '../TypeSelector'
import { Tick } from '../icons/Tick'
import { X } from '../icons/X'
import { LeafInput } from './LeafInput'

type LeafEditProps = {
  node: Node
  mode: LeafMode
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

export const LeafEdit: React.FC<LeafEditProps> = ({ node, mode }) => {
  const { updateNode, deleteNode, setEditing } = useTreeContext()
  const [type, setType] = useState<LeafType>(node.type)
  const [name, setName] = useState<string>(node.name ?? '')
  const [value, setValue] = useState<string>(node.value?.toString() ?? '')
  const [isChecked, setIsChecked] = useState<boolean>(
    typeof node.value === 'boolean' ? node.value : false,
  )
  const [errors, setErrors] = useState<Record<string, ErrorLevel>>({})
  const [submitError, setSubmitError] = useState<string>('')

  const leafRef = useRef<HTMLDivElement>(null)

  const hasError = useMemo(
    () => Object.values(errors).some((error) => error === ErrorLevel.ERROR),
    [errors],
  )

  const reset = useCallback(
    (event?: MouseEvent) => {
      if (event && node.name === '' && node.value === '') deleteNode(node)
      setType(node.type)
      setName(node.name ?? '')
      setValue(node.value?.toString() ?? '')
      setIsChecked(typeof node.value === 'boolean' ? node.value : false)
      // Event differentiate if reset is triggered by cancel button or unmount
      // If cancel button, it stops editing too
      if (event) setEditing(null)
    },
    [deleteNode, node, setEditing],
  )

  // Editing another node closes the current edit, it must cancel editing on unmount
  useEffect(() => () => reset(), [reset])

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      submit: ErrorLevel.NONE,
      name: !isValidString(name)
        ? ErrorLevel.ERROR
        : mode === LeafMode.OBJECT && name === ''
          ? ErrorLevel.WARNING
          : ErrorLevel.NONE,
    }))
  }, [mode, name, setErrors])

  useEffect(() => {
    switch (type) {
      case 'string':
        setErrors((prev) => ({
          ...prev,
          submit: ErrorLevel.NONE,
          value: !isValidString(value)
            ? ErrorLevel.ERROR
            : value === ''
              ? ErrorLevel.WARNING
              : ErrorLevel.NONE,
        }))
        break
      case 'number':
        setErrors((prev) => ({
          ...prev,
          submit: ErrorLevel.NONE,
          value: !isValidNumber(value) ? ErrorLevel.ERROR : ErrorLevel.NONE,
        }))
        break
      default:
        setErrors((prev) => ({
          ...prev,
          submit: ErrorLevel.NONE,
          value: ErrorLevel.NONE,
        }))
        break
    }
  }, [type, value, setErrors])

  return (
    <form
      className="leaf-container"
      onSubmit={(event) => {
        event.preventDefault()
        if (!hasError) {
          try {
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
            updateNode(node, updatedNode)
            setEditing(null)
          } catch (error) {
            setErrors((prev) => ({ ...prev, submit: ErrorLevel.ERROR }))
            if (typeof error === 'string') {
              setSubmitError(error)
            } else if (error instanceof Error) {
              setSubmitError(error.message)
            }
          }
        }
      }}
    >
      <div
        ref={leafRef}
        className={classNames('leaf', 'leaf-edit', {
          error: hasError,
        })}
      >
        <Popover
          content={submitError}
          variant={VariantState.ERROR}
          keepOpen={errors.submit === ErrorLevel.ERROR}
          enabled={errors.submit === ErrorLevel.ERROR}
          targetRef={leafRef}
        />
        <div className="leaf-content">
          <div className="leaf-input-group">
            <TypeSelector value={type} onSelect={(value) => setType(value)} />
            {mode === LeafMode.OBJECT && (
              <LeafInput
                className="input-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-label="Modifier la clé"
                placeholder="Key"
                error={errors.name}
              />
            )}
            {['string', 'number'].includes(type) && (
              <LeafInput
                className="input-value"
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-label="Modifier la valeur"
                placeholder="Value"
                error={errors.value}
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
            warning:
              !hasError &&
              Object.values(errors).some((error) => error === ErrorLevel.ERROR),
          })}
          type="submit"
          aria-label="Save"
          icon={<Tick />}
          disabled={hasError}
          popover={{ content: 'Save', enabled: !hasError }}
        />
        <ActionButton
          className="leaf-action-button button-cancel"
          aria-label="Cancel"
          onClick={reset}
          icon={<X />}
          popover={{ content: 'Cancel' }}
        />
      </div>
    </form>
  )
}
