import React, { memo, useState } from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { useTreeContext } from '../contexts/TreeContext/TreeContext'
import { LeafMode, Node, VariantState } from '../defs'
import { classNames } from '../utils/classNames'
import { isReadonly } from '../utils/config'
import { hashCode } from '../utils/memoization'
import { ActionButton } from './ActionButton'
import { Leaf } from './Leaf'
import { Chevron } from './icons/Chevron'
import { X } from './icons/X'

import './tree-view.css'

type TreeProps = {
  node: Node
  mode: LeafMode
}

export const TreeView: React.FC<TreeProps> = memo(
  ({ node, mode }) => {
    const { readonly, t } = useConfigContext()
    const { addNode, setEditing, isCollapsed, setIsCollapsed } =
      useTreeContext()
    const [addNodeError, setAddNodeError] = useState<string>('')
    const collapsed = isCollapsed(node.path)

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
                <div className="tree-view-actions">
                  <ActionButton
                    className="button-add"
                    icon={<X />}
                    popover={{
                      content: addNodeError || t('tree-view.action.add.label'),
                      keepOpen: !!addNodeError,
                      variant: addNodeError
                        ? VariantState.ERROR
                        : VariantState.DEFAULT,
                    }}
                    aria-label={t('tree-view.action.add.label')}
                    disabled={!!addNodeError}
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
