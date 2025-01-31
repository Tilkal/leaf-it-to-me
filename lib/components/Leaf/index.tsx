import React, { ReactElement, useEffect, useMemo, useState } from 'react'

import { LeafMode, LeafType, Leaf as ObjectLeaf, TempValue } from '../../defs'
import { isValidNumber, isValidString } from '../../utils/json'
import { LeafEdit } from './LeafEdit'
import { LeafView } from './LeafView'

import './leaf.css'

type LeafProps = ObjectLeaf & {
  edit?: boolean
  addon?: ReactElement | null
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
      <LeafEdit
        mode={mode}
        errors={errors}
        warnings={warnings}
        hasError={hasError}
        hasWarning={hasWarning}
        name={name}
        setName={setName}
        value={value}
        setValue={setValue}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        type={type}
        setType={setType}
        setIsEditing={setIsEditing}
      />
    )
  }

  return (
    <LeafView
      readonly={readonly}
      mode={mode}
      hasError={hasError}
      hasWarning={hasWarning}
      name={name}
      value={value}
      isChecked={isChecked}
      type={type}
      setIsEditing={setIsEditing}
      addon={addon}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  )
}
