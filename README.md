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
- Open the file src/config/config.ts
- Fill in the correct data.

example of a configuration used to connect to the test environment of the sandbox

```typescript
const appConfig = {
    authURL: 'https://sandbox.auth.tstbnpparibasfortis.com',
    apiURL: 'https://sandbox.api.tstbnpparibasfortis.com',
    organization: 'ede7eede-211b-47ab-8dde-a3d8e0023351',
    stetVersion: '1.4.0.47.develop',
    clientId: 'ec38b391-5ec2-4cca-87e4-93f46cef8b3b',
    clientSecret: 'c66b22181c802bc94ae1d248fa20894c9d1f6e444346a56abae6eb66934c98eb9fdd9463df799dce5ae47982a29132ce',
    redirectURI: 'http://127.0.0.1:8090/auth',
    scope: 'aisp',
    state: 'toto'
}
```
## How to use it ?
run the node server using
```bash
npm run build
npm run dev
```
this will start the server on port 3000

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
