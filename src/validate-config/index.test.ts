import { validateInputUrl, validateUrl, validateOutputUrl } from '.'

describe('validates all urls', () => {
  it('should return the url if there are no problems', () => {
    expect(validateUrl(['foo', 'bar', '*'])).toEqual(['foo', 'bar', '*'])
  })
  it('should not allow url segments to have * if that is not the whole chunk', () => {
    expect(() => validateUrl(['foo', 'asdf*']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/asdf*'
* must be the only part of a url segment. 'asdf*' is invalid"
`)
  })
})

describe('validates input urls', () => {
  it('should return the url if there are no problems', () => {
    expect(validateInputUrl(['foo', 'bar', '*'])).toEqual(['foo', 'bar', '*'])
  })
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

describe('validates output urls', () => {
  it('should return the output url if there are no problems', () => {
    expect(validateOutputUrl(['foo', ':bar'])).toEqual(['foo', ':bar'])
  })
  it('should throw if the output url has *', () => {
    expect(() => validateOutputUrl(['foo', '*']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/*'
Ouptut urls cannot use '*'"
`)
    expect(() => validateOutputUrl(['foo', 'as*df']))
      .toThrowErrorMatchingInlineSnapshot(`
"Error parsing '/foo/as*df'
Ouptut urls cannot use '*'"
`)
  })
})
