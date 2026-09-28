import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { useCopyContext } from '../contexts/CopyContext/CopyContext'
import { useSearchContext } from '../contexts/SearchContext/SearchContext'
import { useTreeContext } from '../contexts/TreeContext/TreeContext'
import { LeafMode, Node, VariantState } from '../defs'
import { classNames } from '../utils/classNames'
import { isReadonly } from '../utils/config'
import { getJsonDescription } from '../utils/json'
import { hashCode } from '../utils/memoization'
import { hasMatchingNode, hasNode, updateNodePath } from '../utils/tree'
import { ActionButton, ActionButtonExternalRef } from './ActionButton'
import { Leaf } from './Leaf'
import { RawJsonInput } from './RawJsonInput'
import { Toolbar } from './Toolbar'
import { ToolbarItem } from './Toolbar/ToolbarItem'
import { Chevron } from './icons/Chevron'
import { Copy } from './icons/Copy'
import { CurlyBraces } from './icons/CurlyBraces'
import { Dots } from './icons/Dots'
import { X } from './icons/X'

import './tree-view.css'

type TreeProps = {
  node: Node
  mode: LeafMode
}

export const TreeView: React.FC<TreeProps> = memo(
  ({ node, mode }) => {
    const { readonly, t } = useConfigContext()
    const { clipboard, clear } = useCopyContext()
    const { addNode, setEditing, isCollapsed, setIsCollapsed, pasteNode } =
      useTreeContext()
    const [addNodeError, setAddNodeError] = useState<string>('')
    const [isRawJsonOpen, setIsRawJsonOpen] = useState<boolean>(false)
    const [rawJsonError, setRawJsonError] = useState<string | undefined>()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const toggleToolbarRef = useRef<ActionButtonExternalRef>(null)
    const { matchSearch } = useSearchContext()
    const collapsed =
      isCollapsed(node.path) && !hasMatchingNode(node, matchSearch)

    const onClickOutside = useCallback((event: Event) => {
      if (
        toggleToolbarRef &&
        event.target instanceof window.Node &&
        !toggleToolbarRef.current?.contains(event.target)
      ) {
        setIsExpanded(false)
      }
    }, [])

    useEffect(() => {
      document.addEventListener('click', onClickOutside)
      return () => document.removeEventListener('click', onClickOutside)
    }, [toggleToolbarRef, onClickOutside])

    const handleRawJson = (value: string, mode: 'add' | 'merge') => {
      try {
        const rawJsonNode = getJsonDescription(
          JSON.parse(value),
          node.path,
          node.type === 'array' ? node.children?.length : '',
          false,
        )
        switch (mode) {
          case 'add':
            addNode(node, rawJsonNode)
            break
          case 'merge':
            pasteNode(node, rawJsonNode, true)
            break
          default:
            break
        }
        setIsRawJsonOpen(false)
        setRawJsonError(undefined)
      } catch (error) {
        if (typeof error === 'string') {
          setRawJsonError(error)
        } else if (error instanceof Error) {
          setRawJsonError(error.message)
        }
      }
    }

    return (
      <div
        className={classNames('tree-view', { root: mode === LeafMode.ROOT })}
      >
        <Leaf
          node={node}
          mode={mode}
          addon={
            ['object', 'array'].includes(node.type) &&
            (!readonly || node.children?.length) ? (
              <ActionButton
                className={classNames('button-toggle', {
                  expanded: !collapsed,
                })}
                aria-label={t(
                  `tree-view.action.toggle.label.${!collapsed ? 'close' : 'open'}`,
                )}
                aria-expanded={!collapsed}
                icon={<Chevron />}
                popover={{
                  content: t(
                    `tree-view.action.toggle.label.${!collapsed ? 'close' : 'open'}`,
                  ),
                }}
                onClick={() => setIsCollapsed(node.path, !collapsed)}
              />
            ) : null
          }
        />
        {!collapsed && (
          <>
            {node.children?.map((child) => (
              <TreeView
                key={hashCode(child)}
                node={child}
                mode={node.type === 'array' ? LeafMode.ARRAY : LeafMode.OBJECT}
              />
            ))}
            {!isReadonly(readonly, node.path) &&
              ['array', 'object'].includes(node.type) && (
                <div
                  className={classNames('tree-view-actions', {
                    expanded: isExpanded,
                  })}
                >
                  <ActionButton
                    ref={toggleToolbarRef}
                    className="button-expand"
                    aria-label={t(
                      `leaf.view.action.toolbar.label.${isExpanded ? 'close' : 'open'}`,
                    )}
                    disabled={!!addNodeError}
                    onClick={() => setIsExpanded((prev) => !prev)}
                    icon={<Dots />}
                    tooltip={{
                      content: isExpanded
                        ? null
                        : t('leaf.view.action.toolbar.label.open'),
                      trigger: ['hover', 'focus'],
                    }}
                    popover={{
                      trigger: 'click',
                      fullWidth: !addNodeError && !isRawJsonOpen,
                      variant:
                        addNodeError || rawJsonError
                          ? VariantState.ERROR
                          : VariantState.INFO,
                      keepOpen: !!addNodeError || isRawJsonOpen,
                      content: addNodeError ? (
                        addNodeError
                      ) : isRawJsonOpen ? (
                        <RawJsonInput
                          error={rawJsonError}
                          onAdd={(value) => handleRawJson(value, 'add')}
                          onMerge={(value) => handleRawJson(value, 'merge')}
                          onCancel={() => {
                            setIsRawJsonOpen(false)
                            setRawJsonError(undefined)
                          }}
                        />
                      ) : (
                        <Toolbar>
                          <ToolbarItem
                            tabIndex={isExpanded ? 0 : -1}
                            icon={
                              <div className="icon-add">
                                <X />
                              </div>
                            }
                            onClick={() => {
                              if (node.children) {
                                const newNode: Node = {
                                  type: 'string',
                                  path: `${node.path}${node.path ? '.' : ''}${node.type === 'array' ? node.children.length : ''}`,
                                  name: '',
                                  value: '',
                                  children: [],
                                }
                                // Only add new node if an unfinished new one is not present
                                // Prevent error for duplicate paths
                                if (
                                  !node.children.some(
                                    (child) => child.path === newNode.path,
                                  )
                                ) {
                                  try {
                                    addNode(node, newNode)
                                  } catch (error) {
                                    if (typeof error === 'string') {
                                      setAddNodeError(error)
                                    } else if (error instanceof Error) {
                                      setAddNodeError(error.message)
                                    }
                                  }
                                }
                                setEditing(newNode.path)
                              }
                            }}
                          >
                            {t('tree-view.action.add.label')}
                          </ToolbarItem>
                          <ToolbarItem
                            tabIndex={isExpanded ? 0 : -1}
                            icon={<CurlyBraces />}
                            onClick={() => setIsRawJsonOpen(true)}
                          >
                            {t('tree-view.action.raw-json.label')}
                          </ToolbarItem>
                          {clipboard &&
                            !hasNode(updateNodePath(node, clipboard), node) && (
                              <ToolbarItem
                                tabIndex={isExpanded ? 0 : -1}
                                icon={<Copy />}
                                onClick={() => {
                                  pasteNode(node, clipboard)
                                  clear()
                                }}
                              >
                                {t('tree-view.action.paste.label')}
                              </ToolbarItem>
                            )}
                        </Toolbar>
                      ),
                    }}
                  />
                </div>
              )}
          </>
        )}
      </div>
    )
  },
  (prev, next) => hashCode(prev.node) === hashCode(next.node),
)
