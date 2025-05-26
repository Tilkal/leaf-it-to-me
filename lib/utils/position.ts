type PositionValidator = (
  containerRect: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>,
  anchorRect: DOMRect,
  elementRect: DOMRect,
  offset: number,
) => boolean

const isValidTop: PositionValidator = (
  containerRect,
  anchorRect,
  elementRect,
  offset,
) => {
  const center = anchorRect.right - anchorRect.width / 2
  return (
    anchorRect.top - elementRect.height - offset >= containerRect.x &&
    center - elementRect.width / 2 - offset >= containerRect.x &&
    center + elementRect.width / 2 + offset <= containerRect.width
  )
}

const isValidBottom: PositionValidator = (
  containerRect,
  anchorRect,
  elementRect,
  offset,
) => {
  const center = anchorRect.right - anchorRect.width / 2
  return (
    anchorRect.bottom + elementRect.height + offset <= containerRect.height &&
    center - elementRect.width / 2 - offset >= containerRect.x &&
    center + elementRect.width / 2 + offset <= containerRect.width
  )
}

const isValidRight: PositionValidator = (
  containerRect,
  anchorRect,
  elementRect,
  offset,
) => {
  const center = anchorRect.bottom - anchorRect.height / 2
  return (
    anchorRect.right + elementRect.width + offset <= containerRect.width &&
    center - elementRect.height / 2 - offset >= containerRect.y &&
    center + elementRect.height / 2 + offset <= containerRect.height
  )
}

const isValidLeft: PositionValidator = (
  containerRect,
  anchorRect,
  elementRect,
  offset,
) => {
  const center = anchorRect.bottom - anchorRect.height / 2
  return (
    anchorRect.left >= elementRect.width + offset &&
    center - elementRect.height / 2 - offset >= containerRect.y &&
    center + elementRect.height / 2 + offset <= containerRect.height
  )
}

export const isValid = {
  top: isValidTop,
  bottom: isValidBottom,
  right: isValidRight,
  left: isValidLeft,
}
