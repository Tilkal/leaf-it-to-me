import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useConfigContext } from '../../contexts/ConfigContext/ConfigContext'
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
import { Popover } from '../Popover'
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
  const { disableWarnings, t } = useConfigContext()
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
        : mode === LeafMode.OBJECT && name === '' && !disableWarnings
          ? ErrorLevel.WARNING
          : ErrorLevel.NONE,
    }))
  }, [mode, name, setErrors, disableWarnings])

  useEffect(() => {
    switch (type) {
      case 'string':
        setErrors((prev) => ({
          ...prev,
          submit: ErrorLevel.NONE,
          value: !isValidString(value)
            ? ErrorLevel.ERROR
            : value === '' && !disableWarnings
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
  }, [type, value, setErrors, disableWarnings])

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
                aria-label={t('leaf.edit.input.key.label')}
                placeholder={t('leaf.edit.input.key.placeholder')}
                error={errors.name}
                message={t(`error.message.${type}.${errors.name}`)}
              />
            )}
            {['string', 'number'].includes(type) && (
              <LeafInput
                className="input-value"
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-label={t('leaf.edit.input.value.label')}
                placeholder={t('leaf.edit.input.value.placeholder')}
                error={errors.value}
                message={t(`error.message.${type}.${errors.value}`)}
              />
            )}
            {type === 'boolean' && (
              <Switch
                checked={isChecked}
                onChange={(checked) => setIsChecked(checked)}
                aria-label={t('leaf.edit.input.switch.label')}
              />
            )}
          </div>
        </div>
      </div>
      <div className="leaf-actions expanded">
        <ActionButton
          className={classNames('leaf-action-button button-submit')}
          type="submit"
          aria-label={t('leaf.edit.input.submit.label')}
          icon={<Tick />}
          variant={
            hasError
              ? VariantState.ERROR
              : Object.values(errors).some(
                    (error) => error === ErrorLevel.WARNING,
                  ) && !disableWarnings
                ? VariantState.WARNING
                : VariantState.SUCCESS
          }
          disabled={hasError}
          popover={{
            content: t('leaf.edit.input.submit.label'),
            enabled: !hasError,
          }}
        />
        <ActionButton
          className="leaf-action-button button-cancel"
          aria-label={t('leaf.edit.input.cancel.label')}
          onClick={reset}
          icon={<X />}
          popover={{ content: t('leaf.edit.input.cancel.label') }}
        />
      </div>
    </form>
  )
}
