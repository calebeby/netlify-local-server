export const printUrl = (input: string[]) => '/' + input.join('/')

/**
 * Splits a url into chunks
 * @param input The url to parse
 */
export const parseUrl = (url: string): string[] =>
  url.split('/').filter(c => c !== '')

export interface QueryParams {
  [queryParam: string]: string
}

export interface Route {
  from: string[]
  to: string[]
  code: number
  queryParams: QueryParams
}

export type ParsedConfig = Route[]
