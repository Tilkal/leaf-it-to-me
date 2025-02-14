type JSONRecord = {
  [key: string]: string | JSONRecord
}

export const t = (path: string, translations: JSONRecord): string =>
  path
    .split('.')
    .reduce((temp: string | JSONRecord | undefined, part, index, array) => {
      if (typeof temp === 'string' || temp === undefined) return path

      const next = temp[part]
      if (index === array.length - 1) {
        return typeof next === 'string' ? next : path
      }
      return next
    }, translations) as string // TypeScript isn't smart enough to understand it's necessarily a string at the end
