import React, { ReactElement, useMemo, useState } from 'react'

import { useConfigContext } from '../../contexts/ConfigContext/ConfigContext'
import { LeafMode, Node } from '../../defs'
import { LeafEdit } from './LeafEdit'
import { LeafView } from './LeafView'

import './leaf.css'

type LeafProps = {
  node: Node
  mode?: LeafMode
  edit?: boolean
  addon?: ReactElement | null
}

export const Leaf: React.FC<LeafProps> = ({
  node: leafNode,
  edit = false,
  mode = LeafMode.OBJECT,
  addon,
}) => {
  const { readonly } = useConfigContext()
  const [isEditing, setIsEditing] = useState<boolean>(edit)
  const [node, setNode] = useState<Node>(leafNode)
  const [isExpanded, setIsExpanded] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [warnings, setWarnings] = useState<Record<string, boolean>>({})

  const hasError = useMemo(
    () => Object.values(errors).some((value) => value),
    [errors],
  )

  const hasWarning = useMemo(
    () => Object.values(warnings).some((value) => value),
    [warnings],
  )

  if (!readonly && isEditing) {
    return (
      <LeafEdit
        node={node}
        setNode={setNode}
        mode={mode}
        errors={errors}
        warnings={warnings}
        hasError={hasError}
        hasWarning={hasWarning}
        setErrors={setErrors}
        setWarnings={setWarnings}
        setIsEditing={setIsEditing}
      />
    )
  }

  return (
    <LeafView
      node={node}
      mode={mode}
      hasError={hasError}
      hasWarning={hasWarning}
      setIsEditing={setIsEditing}
      addon={addon}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  )
}
