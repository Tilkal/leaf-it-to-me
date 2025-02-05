import React from 'react'

import './error-display.css'

type ErrorDisplayProps = {
  message: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="error-message">
    <div className="message-title">
      An error occured while creating the tree:
    </div>
    <div className="message-content">{message}</div>
  </div>
)
