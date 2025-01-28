import React from 'react'

import { Tree } from './defs'

import './root.css'

type LeafItToMeProps = {
  tree: Tree
}

export const LeafItToMe: React.FC<LeafItToMeProps> = ({ tree }) => {
  if (tree === null) {
    return <div>null</div>
  }
  if (['string', 'number'].includes(typeof tree)) {
    return <div>{tree.toString()}</div>
  }
  if (Array.isArray(tree)) {
    return (
      <div>
        {tree.map((_, index) => (
          <div>{index}</div>
        ))}
      </div>
    )
  }
  if (typeof tree === 'object') {
    return (
      <div>
        {Object.entries(tree).map(([key]) => (
          <div>{key}</div>
        ))}
      </div>
    )
  }
}
