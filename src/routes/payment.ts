import { Router, Request, Response } from 'express';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { appConfig } from '../config';
import * as xMLHttpRequest from 'xmlhttprequest';
import fixtureParser from '../fixtures/Parser'

const XMLHttpRequest = xMLHttpRequest.XMLHttpRequest;

class PaymentRouter {

    routes(): Router {
        return Router()
            .post('/auth', (req: Request, res: Response) => {
                this.authenticateClient().subscribe(
                    access_token => res.send(access_token),
                    err => res.status(err.status).send(err)
                )
            })
            .post('/make', (req: Request, res: Response) => {
                const brand = req.query.brand;
                this.makePayment(req.body, brand).subscribe(
                    resp => res.send(resp),
                    err => res.status(err.status).send(err.response.message || 'Unknown error')
                )
            })
    }

    makePayment(body, brand) {
        const paymentString = fixtureParser.parsePayment(body.paymentType, body);
        const options = {
            method: 'POST',
            url: `${appConfig.apiURL}/psd2/v3/payment-requests?brand=${brand}`,
            headers: {
                'Authorization': `Bearer ${body.access_token}`,
                'Content-Type': 'application/json',
                'Signature': '<Base64(RSA-SHA256(signing string))>',
                'X-Request-ID': '<X-Request-ID>',
                businessLineName: 'RPB'
            },
            body: paymentString,
            createXHR: () => new XMLHttpRequest()
        };

        return ajax(options).pipe(
            map(resp => {
                const href = resp.response._links.consentApproval.href
                return href
            }),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }

    authenticateClient() {
        const formData = {
            grant_type: 'client_credentials',
            scope: 'aisp;pisp',
            client_id: appConfig.clientId,
            client_secret: appConfig.clientSecret,
            redirect_uri: appConfig.redirectURI
        };
        const options = {
            method: 'POST',
            url: `${appConfig.authURL}/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
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
}

export default new PaymentRouter()