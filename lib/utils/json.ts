export const isValidString = (key: string): boolean =>
  /^(?:[^/"\\]|\\[/"\\/bfnrt]|\\u[0-9a-fA-F]{4})*$/.test(key)

export const isValidNumber = (input: string): boolean => 
  /^-{0,1}[0-9]+\.{0,1}[0-9]*([eE]{1}[+-]{1}[0-9]+){0,1}$/.test(input)
