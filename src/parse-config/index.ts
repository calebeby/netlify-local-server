export interface Route {
  from: string[]
  to: string[]
  code: number
}

export type ParsedConfig = Route[]

/**
 * Splits a url into chunks
 * @param input The url to parse
 */
export const parseUrl = (url: string): string[] =>
  url.split('/').filter(c => c !== '')

const parseLine = (line: string): Route => {
  const chunked = line.split(/\s+/)
  return {
    from: parseUrl(chunked[0]),
    to: parseUrl(chunked[1]),
    code: parseInt(chunked[2]) || 301,
  }
}

const parseConfig = (config: string) =>
  config
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '' && !l.startsWith('#'))
    .map(parseLine)

export default parseConfig
