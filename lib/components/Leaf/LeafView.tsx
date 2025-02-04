import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { useTreeContext } from '../../contexts/TreeContext/TreeContext'
import { ErrorLevel, LeafMode, Node as LeafNode } from '../../defs'
import { classNames } from '../../utils/classNames'
import { isValidString } from '../../utils/json'
import { ActionButton } from '../ActionButton'
import { TypeTag } from '../TypeTag'
import { Chevron } from '../icons/Chevron'
import { Pencil } from '../icons/Pencil'
import { TrashCan } from '../icons/TrashCan'

type LeafViewProps = {
  node: LeafNode
  readonly?: boolean
  mode: LeafMode
  addon?: ReactElement | null
  isExpanded: boolean
  setIsExpanded: Dispatch<SetStateAction<boolean>>
}

const validateNode = (node: LeafNode, mode: LeafMode): ErrorLevel => {
  if (mode === LeafMode.OBJECT) {
    if (!node.name) return ErrorLevel.WARNING
    if (!isValidString(node.name)) return ErrorLevel.ERROR
  }

  if (node.type === 'string' && typeof node.value === 'string') {
    if (!node.value) return ErrorLevel.WARNING
    if (!isValidString(node.value)) return ErrorLevel.WARNING
  }

  return ErrorLevel.NONE
}

export const LeafView: React.FC<LeafViewProps> = ({
  node,
  readonly,
  mode,
  addon,
  isExpanded,
  setIsExpanded,
}) => {
  const { deleteNode, setEditing } = useTreeContext()
  const ref = useRef<HTMLButtonElement>(null)

  const nodeError = useMemo(() => validateNode(node, mode), [node, mode])

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
          error: nodeError === ErrorLevel.ERROR,
          warning: nodeError === ErrorLevel.WARNING,
        })}
      >
        <div className="leaf-content">
          <div className={`leaf-type type-${node.type}`}>
            <TypeTag type={node.type} />
          </div>
          {mode === LeafMode.OBJECT && (
            <div
              className={classNames(`leaf-name type-${node.type}`, {
                ['empty-string']: node.name === '',
              })}
            >
              {node.name !== '' ? node.name : 'empty key'}
            </div>
          )}
          {['string', 'number'].includes(node.type) && (
            <div
              className={classNames(`leaf-value type-${node.type}`, {
                ['empty-string']: node.value === '',
              })}
            >
              {node.value !== '' ? node.value : 'empty value'}
            </div>
          )}
          {['boolean'].includes(node.type) && (
            <div className={`leaf-value type-${node.type}`}>
              {Boolean(node.value).toString()}
            </div>
          )}
          {node.type === 'null' && (
            <div className="leaf-value type-${node.type}">null</div>
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
          onClick={() => !readonly && isExpanded && setEditing(node.path)}
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
          onClick={() => deleteNode(node)}
        />
      </div>
    </div>
  )
}
