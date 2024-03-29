import fetch from 'node-fetch';
import { InstagramAuthWindow } from './InstagramAuthWindow';
import { NodeStore } from './NodeStore';
import secrets from '../../secrets';
import { processLog } from './log';
import { sToMs } from '../helpers/time';

const appId = secrets.INSTAGRAM_APP_ID;
const appSecret = secrets.INSTAGRAM_APP_SECRET;
const redirectUri = 'https://localhost/auth'
const store = NodeStore();

const oneMonthInMs = 2629746000;

interface Error {
    error: {
        message: string,
        type: string,
        code: number,
        fbtrace_id: string
    }
}


export interface ExchangeTheCodeForAToken {
    access_token: string,
    user_id: number
}

export const exchangeTheCodeForAToken = (code: string): Promise<ExchangeTheCodeForAToken> => {

    const params = new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
    })

    return fetch(
        'https://api.instagram.com/oauth/access_token',
        {
            method: 'post',
            body: params
        }
    )
        .then((resp) => resp.json())
        .then((resp: ExchangeTheCodeForAToken & Error) => new Promise((resolve, reject) => {
            if (resp.error) {
                processLog.error('exchangeTheCodeForAToken: auth error', resp)
                reject(resp as Error)
                return resp as Error;
            }
            processLog.info('exchangeTheCodeForAToken: refresh successfully')
            resolve(resp as ExchangeTheCodeForAToken)
        }))
}


export interface LongLiveToken {
    "access_token": string;
    "token_type": "bearer",
    "expires_in": number
}

const exchangeTokenToLongLiveToken = (token: string): Promise<LongLiveToken> => {

    const url = new URL('https://graph.instagram.com/access_token')

    url.search = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: token,
    }).toString()

    return fetch(url.toString())
        .then((resp) => resp.json())
        .then((resp: LongLiveToken & Error) => new Promise((resolve, reject) => {
            if (resp.error) {
                processLog.error('exchangeTokenToLongLiveToken: request error', resp)
                reject(resp as Error)
                return resp as Error;
            }
            processLog.info('exchangeTokenToLongLiveToken: exchange successfully')
            resolve(resp as LongLiveToken)
        }))
}


const refreshLongLiveToken = (llToken: string): Promise<LongLiveToken> => {
    const url = new URL('https://graph.instagram.com/refresh_access_token')

    url.search = new URLSearchParams({
        grant_type: 'ig_refresh_token',
        access_token: llToken,
    }).toString()

    return fetch(url.toString())
        .then((resp) => resp.json())
        .then((resp: LongLiveToken & Error) => new Promise((resolve, reject) => {
            if (resp.error) {
                processLog.error('refreshLongLiveToken: request error', resp)
                reject(resp as Error)
                return resp as Error;
            }
            processLog.info('refreshLongLiveToken: refresh successfully')
            resolve(resp as LongLiveToken)
        }))
}

export interface GetMyPosts {
    "data": [
        {
            "id": string
        }
    ]
}

export const getMyPosts = (token: string): Promise<GetMyPosts> => {
    return fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp&access_token=${token}`,
    )
        .then((resp) => resp.json())
        .then((resp: GetMyPosts & Error) => new Promise((resolve, reject) => {
            if (resp.error) {
                processLog.error('getMyPosts: fetch error', resp)
                reject(resp as Error);
                return resp as Error;
            }
            processLog.info('getMyPosts: fetch successfully')
            resolve(resp as GetMyPosts)
        }))
}

const authAndStore = () => InstagramAuthWindow().then((code) => {
    store.set('igCode', code);
    return code;
})
const exchangeToken = (token: string): Promise<string> => exchangeTheCodeForAToken(token)
    .then(({access_token}) => exchangeTokenToLongLiveToken(access_token))
    .then((token) => {
        store.set('igUserToken', token);
        store.set('igTokenExpireAt', +new Date() + sToMs(token.expires_in))
        return token.access_token;
    })
    .catch((e) => authAndStore().then(exchangeToken).then((token) => {
        processLog.error('exchangeToken chain error', e);
        return token;
    }))
const auth = () => new Promise<string>((resolve) => {

    if (!store.store.igCode || !store.store.igAccessToken) {
        return authAndStore().then(exchangeToken).then((access_token) => {
            store.set('igAccessToken', access_token);
            return access_token
        }).then(resolve);
    }
    if (!store.store.igUserToken.access_token) {
        return exchangeToken(store.store.igCode).then((access_token) => {
            store.set('igAccessToken', access_token);
            return access_token
        }).then(resolve);
    }
    if (+new Date() + oneMonthInMs > store.store.igTokenExpireAt) {
        return refreshLongLiveToken(store.store.igUserToken.access_token)
            .then(({access_token}) => {
                store.set('igAccessToken', access_token);
                return access_token
            })
            .then(resolve)
            .catch((e) => {
                processLog.error('refreshLongLiveToken chain error', e)
                return exchangeToken(store.store.igCode)
            })
    }
    resolve(store.store.igAccessToken)
})

export const fetchPosts = (): Promise<GetMyPosts> => auth().then(getMyPosts)
