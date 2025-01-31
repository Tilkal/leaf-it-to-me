import React from 'react'

import { Warning } from './icons/Waring'

import './Error.css'

export const Error: React.FC = () => {
  return (
    <div className="error-container">
      <div className="error-message">
        <Warning />
        <p className="error-description">CHEF on a un gros problème !</p>
      </div>
    </div>
  )
}
