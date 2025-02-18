import React, {
  MutableRefObject,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { VariantState } from '../../defs'
import { classNames } from '../../utils/classNames'

import './popover.css'

export type PopoverProps = {
  content: string | ReactElement
  variant?: VariantState
  enabled?: boolean
  keepOpen?: boolean
  targetRef: MutableRefObject<HTMLElement | undefined | null>
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
  targetRef,
}) => {
  const [isOpen, setIsOpen] = useState<IsOpen>(
    keepOpen ? OPEN_STATE : CLOSED_STATE,
  )

  const isActive = useMemo(
    () =>
      enabled &&
      (keepOpen || isOpen.isClicked || isOpen.isFocused || isOpen.isHovered),
    [isOpen, keepOpen, enabled],
  )

  const onClickOutside = useCallback(
    (event: Event) => {
      if (
        targetRef &&
        event.target instanceof Node &&
        !targetRef.current?.contains(event.target) &&
        !keepOpen
      ) {
        setIsOpen(CLOSED_STATE)
      }
    },
    [keepOpen, targetRef],
  )

  const onClick = useCallback(() => {
    if (targetRef?.current && enabled && !keepOpen) {
      setIsOpen((prev) =>
        prev.isClicked === true ? CLOSED_STATE : { ...prev, isClicked: true },
      )
    }
  }, [enabled, keepOpen, targetRef])

  const onMouseEnter = useCallback(() => {
    if (targetRef?.current && enabled && !keepOpen) {
      setIsOpen((prev) => ({ ...prev, isHovered: true }))
    }
  }, [enabled, keepOpen, targetRef])

  const onMouseLeave = useCallback(() => {
    if (targetRef?.current && enabled && !keepOpen) {
      setIsOpen((prev) => ({ ...prev, isHovered: false }))
    }
  }, [enabled, keepOpen, targetRef])

  const onFocus = useCallback(() => {
    if (targetRef?.current && enabled && !keepOpen) {
      setIsOpen((prev) => ({ ...prev, isFocused: true }))
    }
  }, [enabled, keepOpen, targetRef])

  const onBlur = useCallback(() => {
    if (targetRef?.current && enabled && !keepOpen) {
      setIsOpen((prev) => ({ ...prev, isFocused: false }))
    }
  }, [enabled, keepOpen, targetRef])

  useEffect(() => {
    const effectRef = targetRef?.current
    document.addEventListener('click', onClickOutside)
    if (effectRef) {
      effectRef.addEventListener('click', onClick)
      effectRef.addEventListener('mouseenter', onMouseEnter)
      effectRef.addEventListener('mouseleave', onMouseLeave)
      effectRef.addEventListener('focus', onFocus)
      effectRef.addEventListener('blur', onBlur)
    }
    return () => {
      document.removeEventListener('click', onClickOutside)
      if (effectRef) {
        effectRef.removeEventListener('click', onClick)
        effectRef.removeEventListener('mouseenter', onMouseEnter)
        effectRef.removeEventListener('mouseleave', onMouseLeave)
        effectRef.removeEventListener('focus', onFocus)
        effectRef.removeEventListener('blur', onBlur)
      }
    }
  }, [
    targetRef,
    onClickOutside,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  ])

  return (
    <div className={classNames('popover', variant, { active: isActive })}>
      {content}
    </div>
  )
}
