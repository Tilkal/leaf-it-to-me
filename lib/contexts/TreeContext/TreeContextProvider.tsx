import React, { PropsWithChildren, useEffect, useState } from 'react'

import {
  AddNodeAction,
  DeleteNodeAction,
  JSON,
  Node,
  UpdateNodeAction,
} from '../../defs'
import { getJsonFromNode } from '../../utils/json'
import {
  addNodeToTree,
  deleteNodeInTree,
  updateNodeInTree,
} from '../../utils/tree'
import { TreeContext } from './TreeContext'

type TreeContextProviderProps = PropsWithChildren & {
  tree: Node
  onChange?: (json: JSON) => void
}

export const TreeContextProvider: React.FC<TreeContextProviderProps> = ({
  tree: originalTree,
  onChange,
  children,
}) => {
  const [tree, setTree] = useState<Node>(originalTree)
  const [editing, setEditing] = useState<string | null>(null)

  const addNode: AddNodeAction = (parentNode, childNode) =>
    setTree((prev) => addNodeToTree(parentNode, childNode, prev))

  const updateNode: UpdateNodeAction = (oldNode, newNode) =>
    setTree((prev) => updateNodeInTree(oldNode, newNode, prev))

  const deleteNode: DeleteNodeAction = (node) =>
    setTree((prev) => deleteNodeInTree(node, prev))

  useEffect(() => {
    if (onChange) onChange(getJsonFromNode(tree))
  }, [tree, onChange])

  return (
    <TreeContext.Provider
      value={{ tree, addNode, updateNode, deleteNode, editing, setEditing }}
    >
      {children}
    </TreeContext.Provider>
  )
}
