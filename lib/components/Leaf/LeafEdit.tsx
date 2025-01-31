import React, { Dispatch, SetStateAction } from 'react'

import { LeafMode, LeafType, TempValue } from '../../defs'
import { classNames } from '../../utils/classNames'
import { ActionButton } from '../ActionButton'
import { Switch } from '../Switch'
import { TypeSelector } from '../TypeSelector'
import { Tick } from '../icons/Tick'
import { X } from '../icons/X'

type LeafEditProps = {
  mode: LeafMode
  errors: Record<string, boolean>
  hasError: boolean
  warnings: Record<string, boolean>
  hasWarning: boolean
  name: TempValue<string>
  setName: Dispatch<SetStateAction<TempValue<string>>>
  value: TempValue<string>
  setValue: Dispatch<SetStateAction<TempValue<string>>>
  isChecked: TempValue<boolean>
  setIsChecked: Dispatch<SetStateAction<TempValue<boolean>>>
  type: TempValue<LeafType>
  setType: Dispatch<SetStateAction<TempValue<LeafType>>>
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export const LeafEdit: React.FC<LeafEditProps> = ({
  mode,
  errors,
  warnings,
  hasError,
  hasWarning,
  name,
  setName,
  value,
  setValue,
  isChecked,
  setIsChecked,
  type,
  setType,
  setIsEditing,
}) => (
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
