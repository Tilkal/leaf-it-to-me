import React, { PropsWithChildren, useState } from 'react'

import {
  AddNodeAction,
  DeleteNodeAction,
  Node,
  UpdateNodeAction,
} from '../../defs'
import {
  addNodeToTree,
  deleteNodeInTree,
  updateNodeInTree,
} from '../../utils/tree'
import { TreeContext } from './TreeContext'

type TreeContextProviderProps = PropsWithChildren & {
  tree: Node
}

export const TreeContextProvider: React.FC<TreeContextProviderProps> = ({
  tree: originalTree,
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

  return (
    <TreeContext.Provider
      value={{ tree, addNode, updateNode, deleteNode, editing, setEditing }}
    >
      {children}
    </TreeContext.Provider>
  )
}
