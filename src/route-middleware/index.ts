import { MiddlewareHandler } from 'browser-sync'
import { ParsedConfig, Route, parseUrl } from '../parse-config'

interface RoutingOptions {
  routes: ParsedConfig
}

export const printUrl = (input: string[]) => '/' + input.join('/')

const routeMatches = (url: string) => (route: Route): boolean => {
  const parsedUrl = parseUrl(url)
  if (
    parsedUrl.length === route.from.length &&
    parsedUrl.every((c, i) => c === route.from[i])
  ) {
    return true
  }
  return false
}

const routeMiddleware = ({ routes }: RoutingOptions): MiddlewareHandler => (
  req,
  res,
  next,
) => {
  if (!req.url) return

  const route = routes.find(routeMatches(req.url))

  if (!route) return next()

  if (route.code === 301 || route.code === 302) {
    res.statusCode = route.code
    res.setHeader('Location', printUrl(route.to))
    res.end()
  }

  if (route.code === 200) {
    req.url = printUrl(route.to)
    next()
  }
}

export default routeMiddleware
