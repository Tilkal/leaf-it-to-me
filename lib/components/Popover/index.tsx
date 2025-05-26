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
import { isValid } from '../../utils/position'

import './popover.css'

export type PopoverTrigger = 'focus' | 'hover' | 'click'

export type PopoverProps = {
  content: string | ReactElement | null
  variant?: VariantState
  enabled?: boolean
  keepOpen?: boolean
  targetRef: MutableRefObject<HTMLElement | undefined | null>
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  fullWidth?: boolean
  trigger?: PopoverTrigger | PopoverTrigger[]
}

type IsOpen = { isClicked: boolean; isFocused: boolean; isHovered: boolean }

const OPEN_STATE: IsOpen = {
  isClicked: true,
  isFocused: false,
  isHovered: false,
}

const CLOSED_STATE: IsOpen = {
  isClicked: false,
  isFocused: false,
  isHovered: false,
}

const shouldTrigger = (
  action: PopoverTrigger,
  mode?: PopoverTrigger | PopoverTrigger[],
) =>
  mode &&
  ((typeof mode === 'string' && mode === action) ||
    (Array.isArray(mode) && mode.includes(action)))

export const Popover: React.FC<PopoverProps> = ({
  content,
  variant = VariantState.DEFAULT,
  enabled = true,
  keepOpen,
  targetRef,
  position = 'auto',
  fullWidth,
  trigger = ['focus', 'hover', 'click'],
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState<IsOpen>(
    keepOpen ? OPEN_STATE : CLOSED_STATE,
  )

  const [computedPosition, setComputedPosition] =
    useState<Omit<PopoverProps['position'], 'auto'>>(position)

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
    if (
      targetRef?.current &&
      enabled &&
      !keepOpen &&
      shouldTrigger('click', trigger)
    ) {
      setIsOpen((prev) =>
        prev.isClicked === true ? CLOSED_STATE : { ...prev, isClicked: true },
      )
    }
  }, [enabled, keepOpen, targetRef, trigger])

  const onMouseEnter = useCallback(() => {
    if (
      targetRef?.current &&
      enabled &&
      !keepOpen &&
      shouldTrigger('hover', trigger)
    ) {
      setIsOpen((prev) => ({ ...prev, isHovered: true }))
    }
  }, [enabled, keepOpen, targetRef, trigger])

  const onMouseLeave = useCallback(() => {
    if (
      targetRef?.current &&
      enabled &&
      !keepOpen &&
      shouldTrigger('hover', trigger)
    ) {
      setIsOpen((prev) => ({ ...prev, isHovered: false }))
    }
  }, [enabled, keepOpen, targetRef, trigger])

  const onFocus = useCallback(() => {
    if (
      targetRef?.current &&
      enabled &&
      !keepOpen &&
      shouldTrigger('focus', trigger)
    ) {
      setIsOpen((prev) => ({ ...prev, isFocused: true }))
    }
  }, [enabled, keepOpen, targetRef, trigger])

  const onBlur = useCallback(() => {
    if (
      targetRef?.current &&
      enabled &&
      !keepOpen &&
      shouldTrigger('focus', trigger)
    ) {
      setIsOpen((prev) => ({ ...prev, isFocused: false }))
    }
  }, [enabled, keepOpen, targetRef, trigger])

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

  useEffect(() => {
    const offset = 8
    const height = window.innerHeight
    const width = window.innerWidth
    const targetRect = targetRef.current?.getBoundingClientRect()
    const popoverRect = ref.current?.getBoundingClientRect()
    const containerRect = {
      x: 0,
      y: 0,
      width,
      height,
    }
    if (!targetRect || !popoverRect) {
      return
    }

    switch (true) {
      case position &&
        position !== 'auto' &&
        isValid[position](containerRect, targetRect, popoverRect, offset):
        setComputedPosition(position)
        break
      case isValid.top(containerRect, targetRect, popoverRect, offset):
        setComputedPosition('top')
        break
      case isValid.bottom(containerRect, targetRect, popoverRect, offset):
        setComputedPosition('bottom')
        break
      case isValid.right(containerRect, targetRect, popoverRect, offset):
        setComputedPosition('right')
        break
      case isValid.left(containerRect, targetRect, popoverRect, offset):
        setComputedPosition('left')
        break
      default:
        setComputedPosition(position !== 'auto' ? position : 'top')
        break
    }
  }, [targetRef, ref, position])

  if (!content) return null

  return (
    <div
      ref={ref}
      className={classNames('popover', variant, computedPosition ?? '', {
        active: isActive,
        ['full-width']: fullWidth,
      })}
    >
      {content}
    </div>
  )
}
