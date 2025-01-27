import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { classNames } from '../utils/classNames'

import './popover.css'

type PopoverProps = PropsWithChildren & {
  content: string
}

type IsOpen = { isClicked: boolean; isFocused: boolean; isHovered: boolean }

const CLOSED_STATE: IsOpen = {
  isClicked: false,
  isFocused: false,
  isHovered: false,
}

export const Popover: React.FC<PopoverProps> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState<IsOpen>(CLOSED_STATE)

  const ref = useRef<HTMLDivElement>(null)

  const isActive = useMemo(
    () => isOpen.isClicked || isOpen.isFocused || isOpen.isHovered,
    [isOpen],
  )

  const onClickOutside = (event: Event) => {
    if (
      ref &&
      event.target instanceof Node &&
      !ref.current?.contains(event.target)
    ) {
      setIsOpen(CLOSED_STATE)
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [ref])

  return (
    <div
      className="popover-container"
      ref={ref}
      tabIndex={0}
      onClick={() =>
        setIsOpen((prev) =>
          isActive ? CLOSED_STATE : { ...prev, isClicked: true },
        )
      }
      onMouseEnter={() => setIsOpen((prev) => ({ ...prev, isHovered: true }))}
      onMouseLeave={() => setIsOpen((prev) => ({ ...prev, isHovered: false }))}
      onFocus={() => setIsOpen((prev) => ({ ...prev, isFocused: true }))}
      onBlur={() => setIsOpen((prev) => ({ ...prev, isFocused: false }))}
    >
      <div className={classNames('popover', { active: isActive })}>
        {content}
      </div>
      <div className="popover-children">{children}</div>
    </div>
  )
}
