Upgraded to PSD2-v3 

[![Build Status](https://travis-ci.com/OpenBanking-BNPPF/demo-app-psd2-server.svg?branch=master)](https://travis-ci.com/github/OpenBanking-BNPPF/demo-app-psd2-server)
[![Coverage Status](https://coveralls.io/repos/github/OpenBanking-BNPPF/demo-app-psd2-server/badge.svg?branch=master)](https://coveralls.io/github/OpenBanking-BNPPF/demo-app-psd2-server)
[![Known Vulnerabilities](https://snyk.io/test/github/OpenBanking-BNPPF/demo-app-psd2-server/badge.svg)](https://snyk.io/test/github/OpenBanking-BNPPF/demo-app-psd2-server)

# OPEN BANK API - DEMO APP
===========

This node js app can be used in order to interact with the open bank sandbox.

## How to install it ?

We'll consider you already have Node.js installed.  

- install npm packages

```bash
npm install 
```

## How to configure it ?
- Create the file src/config/envs.ts similar to envs_example.ts
- Fill in the correct data.

example of a configuration used to connect to the test environment of the sandbox

```typescript
const appConfig = {
    authURL: 'https://sandbox.auth.tstbnpparibasfortis.com',
    // API url is url of proxy, as we have SSL-MA
    apiURL: 'http://127.0.0.1:9000',
    clientId: 'my-client-id',
    clientSecret: 'my-client-secret',
    redirectURI: 'http://127.0.0.1:8090/auth',
    scope: 'aisp',
    state: 'toto'
}
```
## How to use it ?
run the node server using
```bash
npm run build
npm run prod
```
this will start the server on port 8081 and a proxy for the api calls on port 9000

## Apis
the server expose the following routes:
### Auth routes
```bash
/api/auth/login 
```
this route returns the authentication url to be used the first time in order to get the authorization code.

```bash 
/api/auth/token
```
this route returns the access token to be used for all the apis request (ex: to get accounts).
It needs the authorization code in the body:
```bash
{
    code: authorizationCode 
}
```
the authorization code received after following the login url returned by the login route (/api/auth/login)
### Accounts routes
All these routes needs a valid authorization token of type bearer in the headers (see the previous route '/api/auth/token')  
```bash
/api/accounts 
```
this route returns the all accounts of the authenticated user.
```bash
/api/accounts/balances
```
this route returns the balance list of a given account.
it takes 'accountResourceId' as a query parameter
example: 
```bash
/api/accounts/balances?accountResourceId=BE42142298183350EUR
```
```bash
/api/accounts/transactions
```
this route returns the transaction list of a given account.
it takes 'accountResourceId' as a query parameter
example: 
```bash
/api/accounts/transactions?accountResourceId=BE42142298183350EUR
```
