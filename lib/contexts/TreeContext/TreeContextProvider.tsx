import React, { PropsWithChildren, useEffect, useState } from 'react'

import {
  AddNodeAction,
  DeleteNodeAction,
  ExpandedConfig,
  JSONType,
  Node,
  UpdateNodeAction,
} from '../../defs'
import { isReadonly, shouldExpand } from '../../utils/config'
import { getJsonFromNode } from '../../utils/json'
import {
  addNodeToTree,
  deleteNodeInTree,
  updateNodeInTree,
} from '../../utils/tree'
import { useConfigContext } from '../ConfigContext/ConfigContext'
import { TreeContext } from './TreeContext'

type TreeContextProviderProps = PropsWithChildren & {
  tree: Node
  onChange?: (json: JSONType) => void
  expandConfig?: ExpandedConfig
}

export const TreeContextProvider: React.FC<TreeContextProviderProps> = ({
  tree: originalTree,
  onChange,
  expandConfig,
  children,
}) => {
  const { readonly } = useConfigContext()
  const [tree, setTree] = useState<Node>(originalTree)
  const [editing, setEditing] = useState<string | null>(null)
  const [expandedList, setExpandedList] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setTree(originalTree)
  }, [originalTree])

  const isExpanded = (path: string) => {
    return expandedList[path] ?? shouldExpand(expandConfig, path)
  }
  const setIsExpanded = (path: string, expanded: boolean) => {
    setExpandedList((prev) => ({
      ...prev,
      [path]: expanded,
    }))
  }

  // Errors in addNode, updateNode and deleteNode are catched
  // setTree(prev => action(prev)) will prevent that behavior
  const addNode: AddNodeAction = (parentNode, childNode) => {
    // Prevent adding node to readonly parent
    if (isReadonly(readonly, parentNode.path)) return
    const newTree = addNodeToTree(parentNode, childNode, tree)
    setTree(newTree)
  }

  const updateNode: UpdateNodeAction = (oldNode, newNode) => {
    // Prevent updating readonly old or new node
    if (
      isReadonly(readonly, oldNode.path) ||
      isReadonly(readonly, newNode.path)
    )
      return
    const newTree = updateNodeInTree(oldNode, newNode, tree)
    setTree(newTree)
  }

  const deleteNode: DeleteNodeAction = (node) => {
    // Prevent deleting readonly node
    if (isReadonly(readonly, node.path)) return
    const newTree = deleteNodeInTree(node, tree)
    setTree(newTree)
  }

  useEffect(() => {
    if (onChange) onChange(getJsonFromNode(tree))
  }, [tree, onChange])

  return (
    <TreeContext.Provider
      value={{
        tree,
        addNode,
        updateNode,
        deleteNode,
        editing,
        setEditing,
        isExpanded,
        setIsExpanded,
      }}
    >
      {children}
    </TreeContext.Provider>
  )
}
