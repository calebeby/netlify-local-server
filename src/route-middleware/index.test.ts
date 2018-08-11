import routeMiddleware from '.'
import request from 'supertest'
import connect from 'connect'

test.each`
  input          | rewrittenUrl | redirect  | method | text
  ${'/asdf/bar'} | ${null}      | ${'/baz'} | ${301} | ${''}
  ${'/foo/bar'}  | ${'/'}       | ${null}   | ${200} | ${'homepage'}
`(
  '$input rewrites to $rewrittenUrl and redirects to $redirect with $method',
  async ({ input, redirect, method, text, rewrittenUrl }) => {
    const response = await request(
      connect()
        .use(
          routeMiddleware({
            routes: [
              {
                from: ['asdf', 'bar'],
                to: ['baz'],
                code: 301,
                queryParams: {},
              },
              {
                from: ['foo', 'bar'],
                to: [],
                code: 200,
                queryParams: {},
              },
            ],
          }),
        )
        .use((req, res) => {
          if (rewrittenUrl !== null) expect(req.url).toEqual(rewrittenUrl)
          if (req.url === '/') {
            res.write('homepage')
            res.end()
          }
        })
        .use((err, _req, _res, _next) => {
          console.error(err)
        }),
    )
      .get(input)
      .expect(method)

    if (redirect !== null) expect(response.header.location).toBe(redirect)
    expect(response.text).toBe(text)
  },
)
