interface QueryParams {
  [queryParam: string]: string
}

export interface Route {
  from: string[]
  to: string[]
  code: number
  queryParams: QueryParams
}

export type ParsedConfig = Route[]

/**
 * Splits a url into chunks
 * @param input The url to parse
 */
export const parseUrl = (url: string): string[] =>
  url.split('/').filter(c => c !== '')

const parseQueryParam = (chunk: string): [string, string] | false => {
  const split = chunk.split('=')
  if (chunk.includes('/') || split.length !== 2) {
    return false
  }
  return split[1].startsWith(':') && (split as [string, string])
}

const parseLine = (line: string): Route => {
  const chunked = line.split(/\s+/)
  const params: QueryParams = {}
  const notParamChunks: string[] = []
  chunked.forEach(chunk => {
    const parsedQueryParam = parseQueryParam(chunk)
    if (parsedQueryParam === false) {
      return notParamChunks.push(chunk)
    }
    params[parsedQueryParam[0]] = parsedQueryParam[1]
  })

  return {
    from: parseUrl(notParamChunks[0]),
    to: parseUrl(notParamChunks[1]),
    code: parseInt(notParamChunks[2]) || 301,
    queryParams: params,
  }
}

const parseConfig = (config: string) =>
  config
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '' && !l.startsWith('#'))
    .map(parseLine)

export default parseConfig
