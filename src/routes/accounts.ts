import {Router, Request, Response} from 'express';
import {ajax} from 'rxjs/ajax';
import {map, catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {appConfig} from '../config'; 
import * as xMLHttpRequest from 'xmlhttprequest';

const XMLHttpRequest = xMLHttpRequest.XMLHttpRequest;

export default class AccountsRouter {

    static routes(): Router {
        return Router()
            .get('/', (req: Request, res: Response) => {
                const accessToken = req.headers.authorization;
                const brand = req.query.brand;
                this.getAccounts(accessToken, brand).subscribe(
                    accounts => res.send(accounts),
                    err => res.status(500).send(err)
                )
            })
            .get('/balances', (req: Request, res: Response) => {
                const accessToken = req.headers.authorization;
                const accountResourceId = req.query.accountResourceId;
                const brand = req.query.brand;
                this.getBalances(accessToken, brand, accountResourceId).subscribe(
                    balances => res.send(balances),
                    err => res.status(500).send(err)
                )
            })
            .get('/transactions', (req: Request, res: Response) => {
                const accessToken = req.headers.authorization;
                const accountResourceId = req.query.accountResourceId;
                const brand = req.query.brand;
                this.getTransactions(accessToken, brand, accountResourceId).subscribe(
                    transactions => res.send(transactions),
                    err => res.status(500).send(err)
                )
            })
    }

    static getBalances(accessToken, brand, accountResourceId) {
        return this.getResource(`${appConfig.apiURL}/psd2/v2/accounts/${accountResourceId}/balances?brand=${brand}`, accessToken)
            .pipe(
                map(data => data.balances)
            )
    }

    static getTransactions(accessToken, brand, accountResourceId) {
        return this.getResource(`${appConfig.apiURL}/psd2/v2/accounts/${accountResourceId}/transactions?brand=${brand}`, accessToken)
            .pipe(
                map(data => data && data.transactions ? data.transactions : [])
            )
    }

    static getResource(url, accessToken) {
        const options = {
            method: 'GET',
            url,
            headers: {
                'Authorization': `${accessToken}`,
                'Signature': 'toto',
                'X-Request-ID': 'toto'
            },
            createXHR: () => new XMLHttpRequest()
        };
        return ajax(options).pipe(
            map(data => data.response),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }

    static getAccounts(accessToken, brand) {
        const options = {
            method: 'GET',
            url: `${appConfig.apiURL}/psd2/v2/accounts?brand=${brand}`,
            headers: {
                'Authorization': `${accessToken}`,
                'Signature': 'toto',
                'X-Request-ID': 'toto',
            },
            createXHR: () => new XMLHttpRequest()
        };
        console.log(JSON.stringify(options))
        return ajax(options).pipe(
            map(data => {
                console.log(data)
                return data.response.accounts
            }),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }
}