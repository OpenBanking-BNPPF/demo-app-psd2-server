import {Router, Request, Response} from 'express';
import {ajax} from 'rxjs/ajax';
import {map, catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {appConfig} from '../config/config';
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
                this.getBalances(accessToken, accountResourceId).subscribe(
                    balances => res.send(balances),
                    err => res.status(500).send(err)
                )
            })
            .get('/transactions', (req: Request, res: Response) => {
                const accessToken = req.headers.authorization;
                const accountResourceId = req.query.accountResourceId;
                this.getTransactions(accessToken, accountResourceId).subscribe(
                    transactions => res.send(transactions),
                    err => res.status(500).send(err)
                )
            })
    }

    static getBalances(accessToken, accountResourceId) {
        return this.getResource(`${appConfig.apiURL}/v1/accounts/${accountResourceId}/balances`, accessToken)
            .pipe(
                map(data => data.balances)
            )
    }

    static getTransactions(accessToken, accountResourceId) {
        return this.getResource(`${appConfig.apiURL}/v1/accounts/${accountResourceId}/transactions`, accessToken)
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
                'X-Openbank-Organization': appConfig.organization,
                'X-Openbank-Stet-Version': appConfig.stetVersion,
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
            url: `${appConfig.apiURL}/psd2/v1/accounts?brand=${brand}`,
            headers: {
                'Authorization': `${accessToken}`,
                'X-Openbank-Organization': appConfig.organization,
                'X-Openbank-Stet-Version': appConfig.stetVersion,
                'Signature': 'toto',
                'X-Request-ID': 'toto'
            },
            createXHR: () => new XMLHttpRequest()
        };
        return ajax(options).pipe(
            map(data => data.response.accounts),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }
}