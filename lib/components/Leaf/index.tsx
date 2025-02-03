import React, { ReactElement, useMemo, useState } from 'react'

import { useConfigContext } from '../../contexts/ConfigContext/ConfigContext'
import { useTreeContext } from '../../contexts/TreeContext/TreeContext'
import { LeafMode, Node } from '../../defs'
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

  if (!readonly && editing === node.path) {
    return (
      <LeafEdit
        node={node}
        mode={mode}
        errors={errors}
        warnings={warnings}
        hasError={hasError}
        hasWarning={hasWarning}
        setErrors={setErrors}
        setWarnings={setWarnings}
      />
    )
  }

  return (
    <LeafView
      node={node}
      mode={mode}
      hasError={hasError}
      hasWarning={hasWarning}
      addon={addon}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  )
}
