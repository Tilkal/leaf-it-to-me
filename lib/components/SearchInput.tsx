import React, { useEffect, useRef, useState } from 'react'

import { useConfigContext } from '../contexts/ConfigContext/ConfigContext'
import { useSearchContext } from '../contexts/SearchContext/SearchContext'
import { ActionButton } from './ActionButton'
import { Chevron } from './icons/Chevron'

import './search-input.css'

export const SearchInput: React.FC = () => {
  const { t } = useConfigContext()
  const { search, setSearch } = useSearchContext()
  const highlightedElements = useRef<Element[] | null>(null)
  const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(0)
  const [totalHighlightedIndex, setTotalHighlightedIndex] = useState(0)

  useEffect(() => {
    if (search) {
      const elements = Array.from(document.querySelectorAll('.leaf.highlight'))
      highlightedElements.current = elements
      setTotalHighlightedIndex(elements.length)
      setCurrentHighlightedIndex(0)
      if (elements.length > 0) {
        scrollToElement(0)
      }
    } else {
      highlightedElements.current = null
      setCurrentHighlightedIndex(0)
      setTotalHighlightedIndex(0)
    }
  }, [search])

  const scrollToElement = (index: number) => {
    const container = document.getElementById('leaf-it-to-me-container')

    if (container) {
      const parent = container.getBoundingClientRect()
      if (
        highlightedElements.current &&
        highlightedElements.current.length > 0
      ) {
        const element = highlightedElements.current[index]
        if (element) {
          const child = element.getBoundingClientRect()

          const scroll = child.top - parent.top + container.scrollTop

          container.scrollTop = scroll - parent.height / 2
        }
      }
    }
  }

  const handleNextElement = () => {
    if (highlightedElements.current && totalHighlightedIndex > 0) {
      const nextIndex = (currentHighlightedIndex + 1) % totalHighlightedIndex
      setCurrentHighlightedIndex(nextIndex)
      scrollToElement(nextIndex)
    }
  }

  const handlePrevElement = () => {
    if (highlightedElements.current) {
      const prevIndex =
        (currentHighlightedIndex - 1 + totalHighlightedIndex) %
        totalHighlightedIndex
      setCurrentHighlightedIndex(prevIndex)
      scrollToElement(prevIndex)
    }
  }

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={t('search.placeholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && totalHighlightedIndex > 0 && (
        <div className="navigation-buttons">
          <ActionButton
            className="up"
            onClick={handlePrevElement}
            icon={<Chevron />}
            aria-label={t('search.action.button-up')}
          />
          <span className="highlight-count">
            {currentHighlightedIndex + 1} / {totalHighlightedIndex}
          </span>
          <ActionButton
            className="down"
            onClick={handleNextElement}
            icon={<Chevron />}
            aria-label={t('search.action.button-down')}
          />
        </div>
      )}
    </div>
  )
}
