import {Router, Request, Response} from 'express';
import {ajax} from 'rxjs/ajax';
import {map} from 'rxjs/operators';
import {appConfig} from '../config';
import {throwError, catchError, config} from 'rxjs';
import { XMLHttpRequest } from 'xhr2';

config.onUnhandledError = (err) => {
    console.warn(err)
}

export default class AuthRouter {

    static routes(): Router {
        return Router()
            .get('/login', (req: Request, res: Response) => {
                res.send(`${appConfig.authURL}/authorize?response_type=code&client_id=${appConfig.clientId}&redirect_uri=${appConfig.redirectURI}&scope=aisp&state=${appConfig.state}`)
            })

            .post('/token', (req: Request, res: Response) => {
                const code = req.body.code;
                this.getToken(code).subscribe(
                    token => res.send(token),
                    err => res.status(500).send(err)
                )
            });
    }

    static getToken(authorizationCode: string) {
        const formData = {
            code: authorizationCode,
            grant_type: 'authorization_code',
            scope: 'aisp',
            redirect_uri: appConfig.redirectURI,
            client_id: appConfig.clientId,
            client_secret: appConfig.clientSecret,
        };
        const options = {
            method: 'POST',
            url: `${appConfig.authURL}/token`,
            createXHR: () => new XMLHttpRequest(),
            //body: JSON.stringify(formData),
            body: formData,
        };
        return ajax(options).pipe(
            map(data => data.response),
            catchError(err => {
                console.error('err', err);
                return throwError(() => err)
            })
        )
    }
}