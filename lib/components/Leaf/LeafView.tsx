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
import { useCopyContext } from '../../contexts/CopyContext/CopyContext'
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
import { Toolbar } from '../Toolbar'
import { ToolbarItem } from '../Toolbar/ToolbarItem'
import { TypeTag } from '../TypeTag'
import { Copy } from '../icons/Copy'
import { Dots } from '../icons/Dots'
import { Pencil } from '../icons/Pencil'
import { TrashCan } from '../icons/TrashCan'
import { getVariantFromError } from './utils'

type LeafViewProps = {
  node: LeafNode
  mode: LeafMode
  addon?: ReactElement | null
  isExpanded: boolean
  setIsExpanded: Dispatch<SetStateAction<boolean>>
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
  isExpanded,
  setIsExpanded,
}) => {
  const { disableWarnings, readonly, t } = useConfigContext()
  const { deleteNode, setEditing } = useTreeContext()
  const { copy } = useCopyContext()
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
        setIsExpanded(false)
      }
    },
    [setIsExpanded],
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
                copy: typeof node.value === 'string',
              })}
              onClick={() =>
                typeof node.value === 'string' &&
                navigator.clipboard.writeText(node.value)
              }
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
          expanded: isExpanded,
        })}
      >
        {!isReadonly(readonly, node.path) && (
          <>
            <ActionButton
              ref={toggleToolbarRef}
              className="leaf-action-button button-expand"
              aria-label={t(
                `leaf.view.action.toolbar.label.${isExpanded ? 'close' : 'open'}`,
              )}
              onClick={() => setIsExpanded((prev) => !prev)}
              icon={<Dots />}
              popover={{
                fullWidth: isExpanded,
                variant: isExpanded
                  ? mustConfirm
                    ? VariantState.ERROR
                    : VariantState.INFO
                  : VariantState.DEFAULT,
                keepOpen: mustConfirm || isExpanded,
                content: isExpanded ? (
                  mustConfirm ? (
                    <ConfirmAction
                      onCancel={() => setMustConfirm(false)}
                      onConfirm={onDelete}
                    />
                  ) : (
                    <Toolbar>
                      <ToolbarItem
                        icon={<Pencil />}
                        onClick={() => setEditing(node.path)}
                      >
                        {t('leaf.view.action.edit.label')}
                      </ToolbarItem>
                      <ToolbarItem icon={<Copy />} onClick={() => copy(node)}>
                        {t('leaf.view.action.copy.label')}
                      </ToolbarItem>
                      {!node.isRoot && (
                        <ToolbarItem
                          icon={<TrashCan />}
                          onClick={() => setMustConfirm((prev) => !prev)}
                          variant={VariantState.ERROR}
                        >
                          {deleteNodeError ||
                            t('leaf.view.action.delete.label')}
                        </ToolbarItem>
                      )}
                    </Toolbar>
                  )
                ) : (
                  t(`leaf.view.action.toolbar.label.open`)
                ),
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
