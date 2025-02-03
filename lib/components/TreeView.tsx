import React, { memo, useState } from 'react'

import { useTreeContext } from '../contexts/TreeContext/TreeContext'
import { LeafMode, Node } from '../defs'
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
    const { addNode, setEditing } = useTreeContext()
    const [isExpanded, setIsExpanded] = useState<boolean>(true)
    const readonly = false

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
                  popover={{ content: 'Add item' }}
                  aria-label="Add item"
                  onClick={() => {
                    if (node.children) {
                      const newNode: Node = {
                        type: 'string',
                        path: `${node.path}.${node.type === 'array' ? node.children.length : ''}`,
                        name: '',
                        value: '',
                      }
                      addNode(node, newNode)
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
