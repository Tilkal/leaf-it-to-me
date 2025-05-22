import React, {
  MutableRefObject,
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
  content: string | ReactElement
  variant?: VariantState
  enabled?: boolean
  keepOpen?: boolean
  targetRef: MutableRefObject<HTMLElement | undefined | null>
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  fullWidth?: boolean
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
  position = 'auto',
  fullWidth,
}) => {
  const ref = useRef<HTMLDivElement>(null)

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

  const getPopoverPosition = useCallback((): Omit<
    PopoverProps['position'],
    'auto'
  > => {
    const spacing = 8
    const height = window.innerHeight
    const width = window.innerWidth
    const targetRect = targetRef.current?.getBoundingClientRect()
    const popoverRect = ref.current?.getBoundingClientRect()
    if (!targetRect || !popoverRect) return 'top'

    const centerX = targetRect.right - targetRect.width / 2
    const centerY = targetRect.bottom - targetRect.height / 2

    switch (true) {
      case targetRect.top - popoverRect.height - spacing >= 0 &&
        centerX - popoverRect.width / 2 - spacing >= 0 &&
        centerX + popoverRect.width / 2 + spacing <= width:
        return 'top'
      case targetRect.bottom + popoverRect.height + spacing <= height &&
        centerX - popoverRect.width / 2 - spacing >= 0 &&
        centerX + popoverRect.width / 2 + spacing <= width:
        return 'bottom'
      case targetRect.right + popoverRect.width + spacing <= width &&
        centerY - popoverRect.height / 2 - spacing >= 0 &&
        centerY + popoverRect.height / 2 + spacing <= height:
        return 'right'
      case targetRect.left >= popoverRect.width + spacing &&
        centerY - popoverRect.height / 2 - spacing >= 0 &&
        centerY + popoverRect.height / 2 + spacing <= height:
        return 'left'
      default:
        return 'top'
    }
  }, [targetRef, ref])

  return (
    <div
      ref={ref}
      className={classNames(
        'popover',
        variant,
        position === 'auto' ? getPopoverPosition() : position,
        {
          active: isActive,
          ['full-width']: fullWidth,
        },
      )}
    >
      {content}
    </div>
  )
}
