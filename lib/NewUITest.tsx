import React, { useEffect } from 'react'

import { Chevron } from './components/icons/Chevron'
import { Copy } from './components/icons/Copy'
import { Dots } from './components/icons/Dots'
import { Pencil } from './components/icons/Pencil'
import { Tick } from './components/icons/Tick'
import { TrashCan } from './components/icons/TrashCan'
import { X } from './components/icons/X'

import './font.css'
import './new-ui-test.css'

type NewUITestProps = { theme?: 'dark' | 'light' }

export const NewUITest: React.FC<NewUITestProps> = ({ theme }) => {
  useEffect(() => {
    switch (true) {
      case theme === 'dark':
        import('./dark.css')
        break
      case theme === 'light':
        import('./light.css')
        break
      default: {
        const darkThemeMediaQuery = window.matchMedia(
          '(prefers-color-scheme: dark)',
        )
        if (darkThemeMediaQuery.matches) {
          import('./dark.css')
        } else {
          import('./light.css')
        }
        break
      }
    }
  }, [theme])

  return (
    <div className="litm-container">
      <div className="litm-overflow-wrapper">
        <div className="litm-main-toolbar">
          <input className="litm-input" type="text" placeholder="Search" />
          <button className="litm-icon-button litm-button-prev">
            <Chevron />
          </button>
          <div className="litm-search-pages">1/4</div>
          <button className="litm-icon-button litm-button-next">
            <Chevron />
          </button>
        </div>
        <div className="litm-root">
          <div className="litm-tree">
            <div className="litm-leaf">
              <div className="litm-leaf-content">
                <div className="litm-leaf-type">object</div>
              </div>
              <div className="litm-leaf-actions">
                <button className="litm-icon-button">
                  <Dots />
                </button>
              </div>
            </div>
            <div className="litm-tree">
              <div className="litm-tree-branches">
                <button className="litm-icon-button litm-button-small litm-button-expand">
                  <Chevron />
                </button>
                <div className="litm-tree-actions one-one">
                  <button className="litm-icon-button litm-button-small">
                    <Dots />
                  </button>
                </div>
                <div className="litm-tree-actions one-two">
                  <button className="litm-icon-button litm-button-small">
                    <Dots />
                  </button>
                </div>
                <div className="litm-tree-actions one-three">
                  <button className="litm-icon-button litm-button-small">
                    <Dots />
                  </button>
                </div>
              </div>
              <div className="litm-leaf litm-leaf-edit">
                <div className="litm-leaf-content">
                  <div className="litm-leaf-type edit">string</div>
                  <input
                    className="litm-leaf-name litm-input"
                    value="key"
                    placeholder="key"
                  />
                  <input
                    className="litm-leaf-value litm-input"
                    value="value"
                    placeholder="key"
                  />
                </div>
                <div className="litm-leaf-actions">
                  <button className="litm-icon-button button-save">
                    <Tick />
                  </button>
                  <button className="litm-icon-button button-cancel">
                    <X />
                  </button>
                </div>
              </div>
              <div className="litm-leaf">
                <div className="litm-leaf-content">
                  <div className="litm-leaf-type">array</div>
                  <div className="litm-leaf-name">arr</div>
                </div>
                <div className="litm-leaf-actions">
                  <button className="litm-icon-button">
                    <Dots />
                  </button>
                </div>
              </div>
              <div className="litm-tree">
                <div className="litm-tree-branches">
                  <button className="litm-icon-button litm-button-small litm-button-expand">
                    <Chevron />
                  </button>
                  <div className="litm-tree-actions two-one">
                    <button className="litm-icon-button litm-button-small">
                      <Dots />
                    </button>
                  </div>
                  <div className="litm-tree-actions two-two">
                    <button className="litm-icon-button litm-button-small">
                      <Dots />
                    </button>
                  </div>
                  <div className="litm-tree-actions two-three">
                    <button className="litm-icon-button litm-button-small">
                      <Dots />
                    </button>
                  </div>
                </div>
                <div className="litm-leaf">
                  <div className="litm-leaf-content">
                    <div className="litm-leaf-type">number</div>
                    <div className="litm-leaf-value">42</div>
                  </div>
                  <div className="litm-leaf-actions">
                    <button className="litm-icon-button">
                      <Dots />
                    </button>
                  </div>
                </div>
                <div className="litm-leaf">
                  <div className="litm-leaf-content">
                    <div className="litm-leaf-type">boolean</div>
                    <div className="litm-leaf-value">true</div>
                  </div>
                  <div className="litm-leaf-actions fake-clicked">
                    <button className="litm-icon-button">
                      <Dots />
                    </button>
                  </div>
                  <div className="litm-popover">
                    <div className="litm-menu">
                      <div className="litm-menu-item">
                        <div className="litm-menu-item-icon">
                          <Pencil />
                        </div>
                        Edit
                      </div>
                      <div className="litm-menu-item">
                        <div className="litm-menu-item-icon">
                          <Copy />
                        </div>
                        Copy
                      </div>
                      <div className="litm-menu-item danger">
                        <div className="litm-menu-item-icon">
                          <TrashCan />
                        </div>
                        Delete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
