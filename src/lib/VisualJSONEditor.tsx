import React from "react"
import { Tree } from "./types"

import "./root.css"

type VisualJSONEditorProps = {
  tree: Tree
}

export const VisualJSONEditor: React.FC<VisualJSONEditorProps> = ({ tree }) => {
  return (
    <div>
      {Object.entries(tree).map(([key]) => (
        <div>{key}</div>
      ))}
    </div>
  )
}
