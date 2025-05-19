import React, { ReactElement, useState } from 'react'

import { useConfigContext } from '../../contexts/ConfigContext/ConfigContext'
import { useTreeContext } from '../../contexts/TreeContext/TreeContext'
import { LeafMode, Node } from '../../defs'
import { isReadonly } from '../../utils/config'
import { LeafEdit } from './LeafEdit'
import { LeafView } from './LeafView'

import './leaf.css'

type LeafProps = {
  node: Node
  mode?: LeafMode
  addon?: ReactElement | null
}

export const Leaf: React.FC<LeafProps> = ({
  node,
  mode = LeafMode.OBJECT,
  addon,
}) => {
  const { readonly } = useConfigContext()
  const { editing } = useTreeContext()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isReadonly(readonly, node.path) && editing === node.path) {
    return <LeafEdit node={node} mode={mode} />
  }

  return (
    <LeafView
      node={node}
      mode={mode}
      addon={addon}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  )
}
