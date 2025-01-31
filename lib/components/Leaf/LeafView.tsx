import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import { LeafMode, LeafType, TempValue } from '../../defs'
import { classNames } from '../../utils/classNames'
import { ActionButton } from '../ActionButton'
import { TypeTag } from '../TypeTag'
import { Chevron } from '../icons/Chevron'
import { Pencil } from '../icons/Pencil'
import { TrashCan } from '../icons/TrashCan'

type LeafViewProps = {
  readonly?: boolean
  mode: LeafMode
  hasError: boolean
  hasWarning: boolean
  name: TempValue<string>
  value: TempValue<string>
  isChecked: TempValue<boolean>
  type: TempValue<LeafType>
  setIsEditing: Dispatch<SetStateAction<boolean>>
  addon?: ReactElement | null
  isExpanded: boolean
  setIsExpanded: Dispatch<SetStateAction<boolean>>
}

export const LeafView: React.FC<LeafViewProps> = ({
  readonly,
  mode,
  hasError,
  hasWarning,
  name,
  value,
  isChecked,
  type,
  setIsEditing,
  addon,
  isExpanded,
  setIsExpanded,
}) => {
  const ref = useRef<HTMLButtonElement>(null)

  const onClickOutside = useCallback(
    (event: Event) => {
      if (
        ref &&
        event.target instanceof Node &&
        [...document.querySelectorAll('.button-expand')].some((element) =>
          element.contains(event.target as Node),
        ) &&
        !ref.current?.contains(event.target)
      ) {
        setIsExpanded(false)
      }
    },
    [setIsExpanded],
  )

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [ref, onClickOutside])

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
          ref={ref}
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
