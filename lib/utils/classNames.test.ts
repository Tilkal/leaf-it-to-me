import { describe, expect, it } from 'vitest'

import { ClassName, classNames } from './classNames'

describe('classNames', () => {
  it('should return a single class name when given a single string', () => {
    expect(classNames('class1')).toBe('class1')
  })

  it('should concatenate multiple class names passed as strings', () => {
    expect(classNames('class1', 'class2', 'class3')).toBe(
      'class1 class2 class3',
    )
  })

  it('should handle an array of class names', () => {
    expect(classNames(['class1', 'class2'])).toBe('class1 class2')
  })

  it('should handle nested arrays of class names', () => {
    expect(classNames(['class1', ['class2', ['class3']]])).toBe(
      'class1 class2 class3',
    )
  })

  it('should include class names based on conditions from an object', () => {
    expect(
      classNames({
        class1: true,
        class2: false,
        class3: undefined,
        class4: true,
      }),
    ).toBe('class1 class4')
  })

  it('should handle a mix of strings, objects, and arrays', () => {
    expect(
      classNames('class1', { class2: true, class3: false }, [
        'class4',
        { class5: true },
      ]),
    ).toBe('class1 class2 class4 class5')
  })

  it('should return an empty string when given no arguments', () => {
    expect(classNames()).toBe('')
  })

  it('should ignore invalid values in arrays', () => {
    expect(
      classNames([
        'class1',
        null,
        undefined,
        0,
        'class2',
      ] as unknown as ClassName[]),
    ).toBe('class1 class2')
  })

  it('should not duplicate class names', () => {
    expect(classNames('class1', 'class1', ['class1'])).toBe(
      'class1 class1 class1',
    )
  })

  it('should handle empty arrays and objects gracefully', () => {
    expect(classNames([], {})).toBe('')
  })

  it('should work with deeply nested structures', () => {
    expect(
      classNames(['class1', { class2: true }, [['class3', { class4: true }]]]),
    ).toBe('class1 class2 class3 class4')
  })
})
