import { validateInputUrl, validateUrl } from '.'

describe('validates all urls', () => {
  it('should not allow url segments to have * if that is not the whole chunk', () => {
    expect(() => validateUrl(['foo', 'asdf*']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/asdf*'
* must be the only part of a url segment. 'asdf*' is invalid"
`)
  })
})

describe('validates input urls', () => {
  it('should only allow * at the end of urls', () => {
    expect(() => validateInputUrl(['foo', 'bar', '*', 'baz']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/bar/*/baz'
* is only allowed at the end of urls"
`)
    expect(() => validateInputUrl(['foo', 'bar', 'baz', '*'])).not.toThrow()
  })
  it("should not allow placeholders named ':splat'", () => {
    expect(() => validateInputUrl(['foo', ':something', ':splat']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/:something/:splat'
:splat cannot be used as a placeholder, because it is reserved for *"
`)
  })
})
