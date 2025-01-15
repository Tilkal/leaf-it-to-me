import React from 'react'
import { Tree } from './types'

import './root.css'

type LeafItToMeProps = {
  tree: Tree
}

export const LeafItToMe: React.FC<LeafItToMeProps> = ({ tree }) => {
  return (
    <div>
      {Object.entries(tree).map(([key]) => (
        <div>{key}</div>
      ))}
    </div>
  )
}
