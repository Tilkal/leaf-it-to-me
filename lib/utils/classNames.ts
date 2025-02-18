export type ClassName =
  | string
  | Record<string, boolean | undefined>
  | ClassName[]

export const classNames = (...classes: ClassName[]): string =>
  classes
    .reduce((cn: string[], current: ClassName) => {
      if (typeof current === 'string' && current !== '') {
        cn.push(current)
      } else if (Array.isArray(current)) {
        cn.push(...classNames(...current).split(' '))
      } else if (typeof current === 'object' && current !== null) {
        Object.entries(current).forEach(([className, shouldBeIncluded]) => {
          if (shouldBeIncluded) {
            cn.push(className)
          }
        })
      }
      return cn
    }, [])
    .join(' ')
