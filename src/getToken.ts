import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { XMLHttpRequest } from 'xmlhttprequest';





const getToken = () => {
    const formData = {
        code: 'authorizationCode',
        grant_type: 'authorization_code',
        scope: 'aisp',
        redirect_uri: 'appConfig.redirectURI',
        client_id: 'appConfig.clientId',
        client_secret: 'appConfig.clientSecret',
    };
    const options = {
        method: 'POST',
        url: `http://127.0.0.1/token`,
        createXHR: createXHReq,
        //body: JSON.stringify(formData),
        body: formData,
        timeout: 2000
    };
    return ajax(options).pipe(
        map(data => data.response)
    )
}

const createXHReq = () => {
    const request = new XMLHttpRequest()

    return request
}



(async function() {
    getToken().subscribe(
        r => console.log(r),
        r => console.error(r)
    )
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    console.log(1)
    await sleep(5000)
    console.log(2)
    })()