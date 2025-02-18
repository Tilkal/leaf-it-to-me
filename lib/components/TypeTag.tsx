import React from 'react'

import './type-tag.css'

type TypeTagProps = {
  type: string
}

export const TypeTag: React.FC<TypeTagProps> = ({ type }) => (
  <div className={`type-tag type-${type}`}>{type}</div>
)
