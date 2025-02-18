import { ErrorLevel, VariantState } from '../../defs'

export const getVariantFromError = (error: ErrorLevel): VariantState => {
  switch (error) {
    case ErrorLevel.ERROR:
      return VariantState.ERROR
    case ErrorLevel.WARNING:
      return VariantState.WARNING
    default:
      return VariantState.DEFAULT
  }
}
