import {Router, Request, Response} from 'express';
import {ajax} from 'rxjs/ajax';
import {map, catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {appConfig} from '../config';
import * as xMLHttpRequest from 'xmlhttprequest';

const XMLHttpRequest = xMLHttpRequest.XMLHttpRequest;

export default class PaymentRouter {

    static routes(): Router {
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
                    err => res.status(err.status).send(err)
                )
            })
    }

    static makePayment(body, brand) {
        const now = new Date();
        const data = {
            "paymentInformationId": "MyPmtInfId",
            "creationDateTime": now,
            "requestedExecutionDate": now,
            "numberOfTransactions": 1,
            "initiatingParty": {
                "name": "DemoApp",
                "postalAddress": {
                    "country": "FR",
                    "addressLine": [
                        "18 rue de la DSP2",
                        "75008 PARIS"
                    ]
                },
                "organisationId": {
                    "identification": "12FR5",
                    "schemeName": "COID",
                    "issuer": "ACPR"
                }
            },
            "paymentTypeInformation": {
                "serviceLevel": "SEPA"
            },
            "debtor": {
                "name": "Isaac Newton",
                "postalAddress": {
                    "country": "FR",
                    "addressLine": [
                        "18 rue de la DSP2",
                        "75008 PARIS"
                    ]
                },
                "privateId": {
                    "identification": "FD37G",
                    "schemeName": "BANK",
                    "issuer": "BICXYYTTZZZ"
                },
            },
            "debtorAccount": {
                "iban": body.debtorAccount
            },
            "beneficiary": {
                "creditor": {
                    "name": `${body.beneficiaryName}`,
                    "postalAddress": {
                        "country": "FR",
                        "addressLine": [
                            "18 rue de la DSP2",
                            "75008 PARIS"
                        ]
                    },
                    "organisationId": {
                        "identification": "852126789",
                        "schemeName": "SREN",
                        "issuer": "FR"
                    }
                },
                "creditorAccount": {
                    "iban": `${body.beneficiaryAccount}`
                }
            },
            "ultimateCreditor": {
                "name": "myPreferedUltimateMerchant",
                "postalAddress": {
                    "country": "FR",
                    "addressLine": [
                        "18 rue de la DSP2",
                        "75008 PARIS"
                    ]
                },
                "organisationId": {
                    "identification": "85212678900025",
                    "schemeName": "SRET",
                    "issuer": "FR"
                }
            },
            "purpose": "COMC",
            "chargeBearer": "SLEV",
            "creditTransferTransaction": [
                {
                    "paymentId": {
                        "instructionId": "MyInstrId",
                        "endToEndId": "MyEndToEndId"
                    },

                    "instructedAmount": {
                        "currency": "EUR",
                        "amount": `${body.amount}`
                    },
                    "remittanceInformation": [
                        body.remittanceInformation
                    ]
                }
            ],
            "supplementaryData": {
                "acceptedAuthenticationApproach": [
                    "REDIRECT",
                    "DECOUPLED"
                ],
                "successfulReportUrl": "http://127.0.0.1:8090/PaymentSuccess",
                "unsuccessfulReportUrl": "http://127.0.0.1:8090/PaymentFailure"
            }
        };
        const options = {
            method: 'POST',
            url: `${appConfig.apiURL}/psd2/v1/payment-requests?brand=${brand}`,
            headers: {
                'Authorization': `bearer ${body.access_token}`,
                'Content-Type': 'application/json',
                'X-Openbank-Organization': appConfig.organization,
                'X-Openbank-Stet-Version': appConfig.stetVersion,
                'Signature': '<Base64(RSA-SHA256(signing string))>',
                'X-Request-ID': '<X-Request-ID>'
            },
            body: JSON.stringify(data),
            createXHR: () => new XMLHttpRequest()
        };
        
        return ajax(options).pipe(
            map(data => data.response._links.consentApproval.href),
            catchError(err => {
                console.error(err);
                return throwError(err)
            })
        )
    }

    static authenticateClient() {
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
                'content-type': 'multipart/form-data;',
                'X-Openbank-Organization': appConfig.organization,
                'X-Openbank-Stet-Version': appConfig.stetVersion
            },
            body: JSON.stringify(formData),
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