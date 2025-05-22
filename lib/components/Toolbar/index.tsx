import React, { PropsWithChildren } from 'react'

import './toolbar.css'

export const Toolbar: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="toolbar">{children}</div>
)
