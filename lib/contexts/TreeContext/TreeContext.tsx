import { createContext, useContext } from 'react'

import {
  AddNodeAction,
  DeleteNodeAction,
  Node,
  UpdateNodeAction,
} from '../../defs'

export type TreeContextProps = {
  tree: Node
  addNode: AddNodeAction
  updateNode: UpdateNodeAction
  deleteNode: DeleteNodeAction
}

export const TreeContext = createContext<TreeContextProps>(
  {} as TreeContextProps,
)

export const useTreeContext = () => useContext(TreeContext)
