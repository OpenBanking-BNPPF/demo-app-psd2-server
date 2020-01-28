const {envs} = require('./envs')
const e = process.env.SANDBOX_ENV ? process.env.SANDBOX_ENV : 'PROD'
console.log('Loading config for ', e)
const appConfig = envs[e]

export {appConfig}