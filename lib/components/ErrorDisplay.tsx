import React from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'

import './error-display.css'

type ErrorDisplayProps = {
  message: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const { t } = useConfigContext()

  return (
    <div className="error-message">
      <div className="message-title">{t('error.title')}</div>
      <div className="message-content">{message}</div>
    </div>
  )
}
