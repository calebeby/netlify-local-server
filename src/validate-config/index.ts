import { printUrl } from '../utils'

const createUrlError = (url: string[], error: string) =>
  new Error(
    `Error parsing '${printUrl(url)}'
${error}`,
  )

export const validateUrl = (url: string[]): string[] => {
  // Segments must be "*" or not contain "*" at all
  const invalidChunk = url.find(chunk => chunk.includes('*') && chunk !== '*')
  if (invalidChunk) {
    throw createUrlError(
      url,
      `* must be the only part of a url segment. '${invalidChunk}' is invalid`,
    )
  }
  return url
}

export const validateInputUrl = (url: string[]): string[] => {
  // * Is only allowed at the end
  if (url.some((chunk, i) => chunk === '*' && i !== url.length - 1)) {
    throw createUrlError(url, `* is only allowed at the end of urls`)
  }
  if (url.some(chunk => chunk === ':splat')) {
    throw createUrlError(
      url,
      `:splat cannot be used as a placeholder, because it is reserved for *`,
    )
  }
  return url
}

export const validateOutputUrl = (url: string[]): string[] => {
  if (url.some(c => c.includes('*'))) {
    throw createUrlError(url, "Ouptut urls cannot use '*'")
  }
  return url
}
