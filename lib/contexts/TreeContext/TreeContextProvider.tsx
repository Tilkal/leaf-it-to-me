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

export const ConfigContextProvider: React.FC<TreeContextProviderProps> = ({
  tree: originalTree,
  children,
}) => {
  const [tree, setTree] = useState<Node>(originalTree)

  const addNode: AddNodeAction = (parentNode, childNode) => {
    const newTree = addNodeToTree(parentNode, childNode, tree)
    setTree(newTree)
  }

  const updateNode: UpdateNodeAction = (oldNode, newNode) => {
    const newTree = updateNodeInTree(oldNode, newNode, tree)
    setTree(newTree)
  }

  const deleteNode: DeleteNodeAction = (node) => {
    const newTree = deleteNodeInTree(node, tree)
    setTree(newTree)
  }

  return (
    <TreeContext.Provider value={{ tree, addNode, updateNode, deleteNode }}>
      {children}
    </TreeContext.Provider>
  )
}
