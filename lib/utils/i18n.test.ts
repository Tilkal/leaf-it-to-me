import { describe, expect, it } from 'vitest'

import i18n from '../i18n.json'
import { t } from './i18n'

describe('t', () => {
  it('should return value at path if path exists', () => {
    expect(t('leaf.view.action.toolbar.label.open', i18n)).toBe('Open toolbar')
  })

  it('should return path if value at path doesnt exists', () => {
    expect(t('some.unknown.path', i18n)).toBe('some.unknown.path')
  })

  it('should return path if value at path is not a string', () => {
    expect(t('leaf.view', i18n)).toBe('leaf.view')
  })
})
