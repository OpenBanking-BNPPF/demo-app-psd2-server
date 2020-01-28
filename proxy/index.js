const httpProxy = require('http-proxy')
const fs = require('fs')

function start () {
  console.log('Starting Proxy on: ', process.env.SANDBOX_ENV)
  try {
    const proxyOptions = {
      DEV: {
        targetHost: 'sandbox.api-dev.tstbnpparibasfortis.com',
      },
      TST: {
        targetHost: 'sandbox.api.tstbnpparibasfortis.com',
      },
      QA: {
        targetHost: 'sandbox.api.qabnpparibasfortis.com',
      },
      PROD: {
        targetHost: 'sandbox.api.bnpparibasfortis.com',
      }
    }
    const proxy = httpProxy.createProxyServer({
      target: {
        protocol: 'https:',
        host: proxyOptions[ process.env.SANDBOX_ENV ].targetHost,
        port: 443,
        cert: fs.readFileSync(`${__dirname}/cert/${process.env.SANDBOX_ENV.toLowerCase()}/cert.pem`, 'utf8'),
        key: fs.readFileSync(`${__dirname}/cert/${process.env.SANDBOX_ENV.toLowerCase()}/key.pem`, 'utf8'),
      },
      changeOrigin: true,
      timeout: 5000,
      proxyTimeout: 5000,
    }).listen(9000)
    proxy.on('error', function (error, req, res) {
      let json
      console.error('proxy error', error)
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' })
      }
      json = { error: 'proxy_error', reason: error.message }
      res.end(JSON.stringify(json))
    })
  } catch (e) {
    console.error(`Problem starting proxy`)
    console.error(e)
  }
}

module.exports = {
  start,
}
