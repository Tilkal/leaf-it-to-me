export const isValidString = (key: string): boolean =>
  /^(?:[^/"\\]|\\[/"\\/bfnrt]|\\u[0-9a-fA-F]{4})*$/.test(key)
