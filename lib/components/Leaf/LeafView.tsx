import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
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
  Node as LeafNode,
  VariantState,
} from '../../defs'
import { classNames } from '../../utils/classNames'
import { isReadonly } from '../../utils/config'
import { isValidString } from '../../utils/json'
import { ActionButton, ActionButtonExternalRef } from '../ActionButton'
import { ConfirmAction } from '../ConfirmAction'
import { Popover } from '../Popover'
import { TypeTag } from '../TypeTag'
import { Chevron } from '../icons/Chevron'
import { Pencil } from '../icons/Pencil'
import { TrashCan } from '../icons/TrashCan'
import { getVariantFromError } from './utils'

type LeafViewProps = {
  node: LeafNode
  mode: LeafMode
  addon?: ReactElement | null
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

const validateNode = (
  node: LeafNode,
  mode: LeafMode,
  disableWarnings?: boolean,
): ErrorLevel => {
  if (mode === LeafMode.OBJECT) {
    if (!node.name && !disableWarnings) return ErrorLevel.WARNING
    if (node.name && !isValidString(node.name)) return ErrorLevel.ERROR
  }

  if (node.type === 'string' && typeof node.value === 'string') {
    if (!node.value && !disableWarnings) return ErrorLevel.WARNING
    if (!isValidString(node.value)) return ErrorLevel.WARNING
  }

  return ErrorLevel.NONE
}

export const LeafView: React.FC<LeafViewProps> = ({
  node,
  mode,
  addon,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { disableWarnings, readonly, t } = useConfigContext()
  const { deleteNode, setEditing } = useTreeContext()
  const toggleToolbarRef = useRef<ActionButtonExternalRef>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [deleteNodeError, setDeleteNodeError] = useState<string>('')
  const [mustConfirm, setMustConfirm] = useState<boolean>(false)

  const nodeError = useMemo(
    () => validateNode(node, mode, disableWarnings),
    [node, mode, disableWarnings],
  )

  const onClickOutside = useCallback(
    (event: Event) => {
      if (
        toggleToolbarRef &&
        event.target instanceof Node &&
        [...document.querySelectorAll('.button-expand')].some((element) =>
          element.contains(event.target as Node),
        ) &&
        !toggleToolbarRef.current?.contains(event.target)
      ) {
        setIsCollapsed(true)
      }
    },
    [setIsCollapsed],
  )

  const onDelete = useCallback(() => {
    try {
      deleteNode(node)
    } catch (error) {
      if (typeof error === 'string') {
        setDeleteNodeError(error)
      } else if (error instanceof Error) {
        setDeleteNodeError(error.message)
      }
    } finally {
      setMustConfirm(false)
    }
  }, [deleteNode, node])

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [toggleToolbarRef, onClickOutside])

  return (
    <div className="leaf-container">
      <div
        className={classNames('leaf', {
          readonly: isReadonly(readonly, node.path),
          error: nodeError === ErrorLevel.ERROR,
          warning: nodeError === ErrorLevel.WARNING,
        })}
      >
        <Popover
          content={t('error.message.string.warning')}
          variant={getVariantFromError(nodeError)}
          enabled={[ErrorLevel.ERROR, ErrorLevel.WARNING].includes(nodeError)}
          targetRef={contentRef}
        />
        <div className="leaf-content" ref={contentRef}>
          <div className={`leaf-type type-${node.type}`}>
            <TypeTag type={node.type} />
          </div>
          {mode === LeafMode.OBJECT && (
            <div
              className={classNames(`leaf-name type-${node.type}`, {
                ['empty-string']: node.name === '',
              })}
            >
              {node.name !== '' ? node.name : t('leaf.view.field.empty-key')}
            </div>
          )}
          {['string', 'number'].includes(node.type) && (
            <div
              className={classNames(`leaf-value type-${node.type}`, {
                ['empty-string']: node.value === '',
              })}
            >
              {node.value !== ''
                ? node.value
                : t('leaf.view.field.empty-value')}
            </div>
          )}
          {['boolean'].includes(node.type) && (
            <div className="leaf-value type-boolean">
              {Boolean(node.value).toString()}
            </div>
          )}
          {node.type === 'null' && (
            <div className="leaf-value type-null">null</div>
          )}
        </div>

        {addon && <div className="leaf-addon">{addon}</div>}
      </div>
      <div
        className={classNames('leaf-actions', {
          readonly: isReadonly(readonly, node.path),
          expanded: !isCollapsed,
        })}
      >
        {!isReadonly(readonly, node.path) && (
          <>
            <ActionButton
              ref={toggleToolbarRef}
              className="leaf-action-button button-expand"
              aria-label={t(
                `leaf.view.action.toolbar.label.${!isCollapsed ? 'close' : 'open'}`,
              )}
              onClick={() => setIsCollapsed((prev) => !prev)}
              icon={<Chevron />}
              popover={{
                content: t(
                  `leaf.view.action.toolbar.label.${!isCollapsed ? 'close' : 'open'}`,
                ),
              }}
            />
            <ActionButton
              className={classNames('leaf-action-button button-edit', {
                hidden: isCollapsed,
              })}
              onClick={() => !isCollapsed && setEditing(node.path)}
              aria-label={t('leaf.view.action.edit.label')}
              icon={<Pencil />}
              tabIndex={!isCollapsed ? 0 : -1}
              popover={{
                content: t('leaf.view.action.edit.label'),
                enabled: !isCollapsed,
              }}
            />
            <ActionButton
              className={classNames('leaf-action-button button-delete', {
                hidden: isCollapsed,
              })}
              aria-label={t('leaf.view.action.delete.label')}
              icon={<TrashCan />}
              disabled={!!deleteNodeError}
              tabIndex={!isCollapsed ? 0 : -1}
              variant={VariantState.ERROR}
              popover={{
                content: deleteNodeError ? (
                  deleteNodeError
                ) : mustConfirm ? (
                  <ConfirmAction
                    onCancel={() => setMustConfirm(false)}
                    onConfirm={onDelete}
                  />
                ) : (
                  t('leaf.view.action.delete.label')
                ),
                enabled: !isCollapsed,
                keepOpen: !!deleteNodeError || mustConfirm,
                variant:
                  deleteNodeError || mustConfirm
                    ? VariantState.ERROR
                    : VariantState.DEFAULT,
              }}
              onClick={() => setMustConfirm((prev) => !prev)}
            />
          </>
        )}
      </div>
    </div>
  )
}
