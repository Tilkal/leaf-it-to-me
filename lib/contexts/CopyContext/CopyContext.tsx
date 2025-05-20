import { createContext, useContext } from 'react'

import { Node } from '../../defs'

type CopyContextProps = {
  clipboard: Node | null
  copy: (element: string | Node) => void
  clear: () => void
}

export const CopyContext = createContext<CopyContextProps>(
  {} as CopyContextProps,
)

export const useCopyContext = () => useContext(CopyContext)
