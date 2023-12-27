import {Router, Request, Response} from 'express';
import {ajax, AjaxResponse} from 'rxjs/ajax';
import {map, catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {appConfig} from '../config'; 
import * as xMLHttpRequest from 'xmlhttprequest';
import { Resource } from '../types/resource';

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
                const accountResourceId = req.query.accountResourceId as string;
                const brand = req.query.brand as string;
                this.getBalances(accessToken, brand, accountResourceId).subscribe(
                    balances => res.send(balances),
                    err => res.status(500).send(err)
                )
            })
            .get('/transactions', (req: Request, res: Response) => {
                const accessToken = req.headers.authorization;
                const accountResourceId = req.query.accountResourceId as string;
                const brand = req.query.brand as string;
                this.getTransactions(accessToken, brand, accountResourceId).subscribe(
                    transactions => res.send(transactions),
                    err => res.status(500).send(err)
                )
            })
    }

    static getBalances(accessToken: string, brand: string, accountResourceId: string) {
        return this.getResource(`${appConfig.apiURL}/psd2/v3/accounts/${accountResourceId}/balances?brand=${brand}`, accessToken)
            .pipe(
                map(data => data.balances)
            )
    }

    static getTransactions(accessToken: string, brand: string, accountResourceId: string) {
        return this.getResource(`${appConfig.apiURL}/psd2/v3/accounts/${accountResourceId}/transactions?brand=${brand}`, accessToken)
            .pipe(
                map(data => data && data.transactions ? data.transactions : [])
            )
    }

    static getResource(url, accessToken): Observable<Resource> {
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
        return ajax<Resource>(options).pipe(
            map(data => data.response),
            catchError(err => {
                console.error(err);
                return throwError(() => err)
            })
        )
    }

    static getAccounts(accessToken, brand) {
        const options = {
            method: 'GET',
            url: `${appConfig.apiURL}/psd2/v3/accounts?brand=${brand}`,
            headers: {
                'Authorization': `${accessToken}`,
                'Signature': 'toto',
                'X-Request-ID': 'toto',
            },
            createXHR: () => new XMLHttpRequest()
        }; 
        return ajax<Resource>(options).pipe(
            map(data => {
                return data.response.accounts
            }),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }
}