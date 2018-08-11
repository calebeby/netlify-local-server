import { create as createBrowserSync } from 'browser-sync'
import netlifyRouteMiddleware from './route-middleware'
import clipboardy from 'clipboardy'
import kleur from 'kleur'

const bs = createBrowserSync()

bs.init(
  {
    server: 'dist',
    port: 2345,
    open: false,
    reloadOnRestart: true,
    middleware: [
      netlifyRouteMiddleware({
        routes: [
          {
            from: ['styles', 'fonts'],
            to: [],
            code: 200,
          },
        ],
      }),
    ],
  },
  async () => {
    const URL = `http://localhost:${bs.getOption('port')}`
    await clipboardy.write(URL)
    console.log(
      kleur.blue(`\nCopied server URL: ${kleur.bold(URL)} to clipboard`),
    )
  },
)
