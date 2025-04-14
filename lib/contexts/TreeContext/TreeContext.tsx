import { Dispatch, SetStateAction, createContext, useContext } from 'react'

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
  editing: string | null
  setEditing: Dispatch<SetStateAction<string | null>>
  isExpanded: (path: string) => boolean
  setIsExpanded: (path: string, expanded: boolean) => void
}

export const TreeContext = createContext<TreeContextProps>(
  {} as TreeContextProps,
)

export const useTreeContext = () => useContext(TreeContext)
