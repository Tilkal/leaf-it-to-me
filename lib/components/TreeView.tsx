import React, { useState } from 'react'

import { LeafMode, Node } from '../defs'
import { classNames } from '../utils/classNames'
import { ActionButton } from './ActionButton'
import { Leaf } from './Leaf'
import { X } from './icons/X'

import './tree-view.css'

type TreeProps = {
  node: Node
  mode: LeafMode
}

export const TreeView: React.FC<TreeProps> = ({ node, mode }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <div className={classNames('tree-view', { root: mode === LeafMode.ROOT })}>
      <Leaf
        type={node.type}
        name={node.name}
        value={node.value}
        mode={mode}
        readonly={false}
      />
      {isExpanded &&
        node.children?.map((child) => (
          <TreeView
            node={child}
            mode={node.type === 'array' ? LeafMode.ARRAY : LeafMode.OBJECT}
          />
        ))}
      {['array', 'object'].includes(node.type) && (
        <div className="tree-view-actions">
          <ActionButton
            className="button-add"
            icon={<X />}
            popover={{ content: 'Add item' }}
            aria-label="Add item"
          />
        </div>
      )}
    </div>
  )
}
