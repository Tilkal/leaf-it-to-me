import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { classNames } from '../utils/classNames'

import './popover.css'

export type PopoverProps = {
  content: string
  enabled?: boolean
  children: ReactElement
}

type IsOpen = { isClicked: boolean; isFocused: boolean; isHovered: boolean }

const CLOSED_STATE: IsOpen = {
  isClicked: false,
  isFocused: false,
  isHovered: false,
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  enabled = true,
}) => {
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
      onClick={() =>
        enabled &&
        setIsOpen((prev) =>
          isActive ? CLOSED_STATE : { ...prev, isClicked: true },
        )
      }
      onMouseEnter={() =>
        enabled && setIsOpen((prev) => ({ ...prev, isHovered: true }))
      }
      onMouseLeave={() =>
        enabled && setIsOpen((prev) => ({ ...prev, isHovered: false }))
      }
    >
      <div className={classNames('popover', { active: isActive })}>
        {content}
      </div>
      <div className="popover-children">
        {React.cloneElement(children, {
          onFocus: () =>
            enabled && setIsOpen((prev) => ({ ...prev, isFocused: true })),
          onBlur: () =>
            enabled && setIsOpen((prev) => ({ ...prev, isFocused: false })),
        })}
      </div>
    </div>
  )
}
