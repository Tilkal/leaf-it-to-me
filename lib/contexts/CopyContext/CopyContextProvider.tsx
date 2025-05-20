import React, { PropsWithChildren, useState } from 'react'

import { Node } from '../../defs'
import { getJsonFromNode } from '../../utils/json'
import { CopyContext } from './CopyContext'

export const CopyContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [clipboard, setClipboard] = useState<Node | null>(null)

  const copy = (element: string | Node) => {
    if (typeof element === 'string') {
      navigator.clipboard.writeText(element)
    } else {
      setClipboard(element)
      navigator.clipboard.writeText(JSON.stringify(getJsonFromNode(element)))
    }
  }

  const clear = () => setClipboard(null)

  return (
    <CopyContext.Provider value={{ clipboard, copy, clear }}>
      {children}
    </CopyContext.Provider>
  )
}
