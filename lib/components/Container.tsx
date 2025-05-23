import React, { PropsWithChildren } from 'react'

import './container.css'

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div id="leaf-it-to-me-container">{children}</div>
}
