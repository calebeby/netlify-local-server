import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { getType } from 'mime'

const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)
const read = (path: string): Promise<string> => readFile(path, 'utf8')

const parseRedirectLine = (text: string) => {
  const f = text.split(/\s+/)
  return { from: f[0].split('/'), to: f[1], statusCode: parseInt(f[2]) }
}

const parseRedirects = (text: string) => text.split('\n').map(parseRedirectLine)

let redirectsFile = ''
try {
  redirectsFile = fs.readFileSync(
    path.join(process.cwd(), '_redirects'),
    'utf8',
  )
} catch {}

const parsedRedirects = parseRedirects(redirectsFile)
console.log(parsedRedirects)

const rel = (...p: string[]) => path.join(process.cwd(), ...p)

const lookupFile = (p: string): string => {
  if (path.extname(p) === '') {
    return rel(p, 'index.html')
  }
  return rel(p)
}

const getRedirects = (
  url: string,
): { from: string[]; to: string; statusCode: number } | undefined => {
  return parsedRedirects.find(redir => {
    return url.split('/').every(
      (c, i) =>
        (redir.from.length === url.split('/').length && redir.from[i] === c) ||
        redir.from[i] === '*' || // * Should match any chunk (TODO: doesn't quite match netlify behavior)
        redir.from[i].startsWith(':'), // TODO: chunks starting with : should also be usable in `to:`
    )
  })
}

interface HTTPResponse {
  statusCode: number
  body?: string
  headers?: { [key: string]: string }
}

const respond = async (url: string): Promise<HTTPResponse> => {
  const redirect = getRedirects(url)
  console.log(url, '=>', redirect)
  if (redirect !== undefined) {
    if (redirect.statusCode === 200) {
      return respond(redirect.to)
    }
    return {
      headers: { Location: redirect.to },
      statusCode: redirect.statusCode,
    }
  }
  const f = lookupFile(url)
  if (!(await exists(f))) {
    return { statusCode: 404 }
  }
  const headers = {
    'Cache-Control': 'max-age=31536000',
    'Content-Type': getType(path.extname(f).replace(/^\./, '')) || 'text/plain',
  }
  return { statusCode: 200, headers, body: await read(f) }
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return
  const { statusCode, body, headers } = await respond(req.url)
  res.statusCode = statusCode
  if (headers !== undefined) {
    Object.entries(headers).forEach(([name, value]) =>
      res.setHeader(name, value),
    )
  }
  if (statusCode === 404) {
    res.end()
  }
  res.end(body)
})

server.on('error', (err: Error) => {
  console.error('we have an error:', err)
})

server.on('sessionError', (err: Error) => {
  console.error('we have an error:', err)
})

const PORT = 3000
server.listen(PORT)
console.log(`watching on port ${PORT}`)
