import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { VariantState } from '../../defs'
import { classNames } from '../../utils/classNames'

import './popover.css'

export type PopoverProps = {
  content: string
  variant?: VariantState
  enabled?: boolean
  keepOpen?: boolean
  children: ReactElement
}

type IsOpen = { isClicked: boolean; isFocused: boolean; isHovered: boolean }

const OPEN_STATE: IsOpen = {
  isClicked: true,
  isFocused: true,
  isHovered: true,
}

const CLOSED_STATE: IsOpen = {
  isClicked: false,
  isFocused: false,
  isHovered: false,
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  variant = VariantState.DEFAULT,
  enabled = true,
  keepOpen,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<IsOpen>(
    keepOpen ? OPEN_STATE : CLOSED_STATE,
  )

  const ref = useRef<HTMLDivElement>(null)

  const isActive = useMemo(
    () => isOpen.isClicked || isOpen.isFocused || isOpen.isHovered,
    [isOpen],
  )

  const onClickOutside = useCallback(
    (event: Event) => {
      if (
        ref &&
        event.target instanceof Node &&
        !ref.current?.contains(event.target) &&
        !keepOpen
      ) {
        setIsOpen(CLOSED_STATE)
      }
    },
    [keepOpen],
  )

  useEffect(() => {
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [ref, onClickOutside])

  return (
    <div
      className="popover-container"
      ref={ref}
      onClick={() =>
        enabled &&
        !keepOpen &&
        setIsOpen((prev) =>
          isActive ? CLOSED_STATE : { ...prev, isClicked: true },
        )
      }
      onMouseEnter={() =>
        enabled &&
        !keepOpen &&
        setIsOpen((prev) => ({ ...prev, isHovered: true }))
      }
      onMouseLeave={() =>
        enabled &&
        !keepOpen &&
        setIsOpen((prev) => ({ ...prev, isHovered: false }))
      }
    >
      <div className={classNames('popover', variant, { active: isActive })}>
        {content}
      </div>
      <div className="popover-children">
        {React.cloneElement(children, {
          onFocus: () =>
            enabled &&
            !keepOpen &&
            setIsOpen((prev) => ({ ...prev, isFocused: true })),
          onBlur: () =>
            enabled &&
            !keepOpen &&
            setIsOpen((prev) => ({ ...prev, isFocused: false })),
        })}
      </div>
    </div>
  )
}
