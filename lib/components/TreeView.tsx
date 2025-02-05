import React, { memo, useState } from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { useTreeContext } from '../contexts/TreeContext/TreeContext'
import { LeafMode, Node, VariantState } from '../defs'
import { classNames } from '../utils/classNames'
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
    const { readonly } = useConfigContext()
    const { addNode, setEditing } = useTreeContext()
    const [isExpanded, setIsExpanded] = useState<boolean>(true)
    const [addNodeError, setAddNodeError] = useState<string>('')

    return (
      <div
        className={classNames('tree-view', { root: mode === LeafMode.ROOT })}
      >
        <Leaf
          node={node}
          mode={mode}
          addon={
            ['object', 'array'].includes(node.type) && node.children?.length ? (
              <ActionButton
                className={classNames('button-toggle', {
                  expanded: isExpanded,
                })}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                aria-expanded={isExpanded}
                icon={<Chevron />}
                popover={{ content: isExpanded ? 'Collapse' : 'Expand' }}
                onClick={() => setIsExpanded((prev) => !prev)}
              />
            ) : null
          }
        />
        {isExpanded && (
          <>
            {node.children?.map((child) => (
              <TreeView
                key={hashCode(child)}
                node={child}
                mode={node.type === 'array' ? LeafMode.ARRAY : LeafMode.OBJECT}
              />
            ))}
            {!readonly && ['array', 'object'].includes(node.type) && (
              <div className="tree-view-actions">
                <ActionButton
                  className="button-add"
                  icon={<X />}
                  popover={{
                    content: addNodeError || 'Add item',
                    keepOpen: !!addNodeError,
                    variant: addNodeError
                      ? VariantState.ERROR
                      : VariantState.DEFAULT,
                  }}
                  aria-label="Add item"
                  disabled={!!addNodeError}
                  onClick={() => {
                    if (node.children) {
                      const newNode: Node = {
                        type: 'string',
                        path: `${node.path}.${node.type === 'array' ? node.children.length : ''}`,
                        name: '',
                        value: '',
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
