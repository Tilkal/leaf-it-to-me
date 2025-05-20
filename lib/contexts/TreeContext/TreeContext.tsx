import { Dispatch, SetStateAction, createContext, useContext } from 'react'

import {
  AddNodeAction,
  DeleteNodeAction,
  Node,
  PasteNodeAction,
  UpdateNodeAction,
} from '../../defs'

export type TreeContextProps = {
  tree: Node
  addNode: AddNodeAction
  updateNode: UpdateNodeAction
  deleteNode: DeleteNodeAction
  pasteNode: PasteNodeAction
  editing: string | null
  setEditing: Dispatch<SetStateAction<string | null>>
  isCollapsed: (path: string) => boolean
  setIsCollapsed: (path: string, collapsed: boolean) => void
}

export const TreeContext = createContext<TreeContextProps>(
  {} as TreeContextProps,
)

export const useTreeContext = () => useContext(TreeContext)
