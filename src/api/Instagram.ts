import fetch from 'node-fetch';
import { InstagramAuthWindow } from './InstagramAuthWindow';
import { NodeStore } from './NodeStore';
import settings from './../settings.json';
import secrets from '../../secrets';

const appId = secrets.INSTAGRAM_APP_ID;
const appSecret = secrets.INSTAGRAM_APP_SECRET;
const redirectUri = 'https://localhost/auth'
const store = NodeStore();

const sToMs = (s: number): number => s * 1000

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
                reject(resp as Error)
            }
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
                reject(resp as Error)
            }
            resolve(resp as LongLiveToken)
        }))
}


const refreshLongLiveToken = (llToken: string): Promise<LongLiveToken> => {
    const url = new URL('https://graph.instagram.com/refresh_access_token')

    url.search = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        access_token: llToken,
    }).toString()

    return fetch(url.toString())
        .then((resp) => resp.json())
        .then((resp: LongLiveToken & Error) => new Promise((resolve, reject) => {
            if (resp.error) {
                reject(resp as Error)
            }
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
                reject(resp as Error)
            }
            resolve(resp as GetMyPosts)
        }))
}

const auth = () => new Promise<string>((resolve) => {

    const authAndStore = () => InstagramAuthWindow().then((code) => {
        store.set('igCode', code);
        return code;
    })

    const exchangeToken = (token: string): Promise<string> => exchangeTheCodeForAToken(token)
        .then(({access_token}) => exchangeTokenToLongLiveToken(access_token))
        .then(({access_token, expires_in}) => {
            store.set('igUserToken', access_token);
            store.set('igTokenExpireAt', +new Date() + sToMs(expires_in))
            return access_token;
        })
        .catch(() => authAndStore().then(exchangeToken).then((token) => {
            resolve(token);
            return token;
        }))


    if (!store.store.igCode) {
        return authAndStore().then(exchangeToken).then(resolve);
    }
    if (!store.store.igUserToken.access_token) {
        exchangeToken(store.store.igCode).then(resolve);
    }
    if (+new Date() + sToMs(settings.updateIntervalInSeconds) > store.store.igTokenExpireAt) {
        refreshLongLiveToken(store.store.igUserToken.access_token)
            .then(({access_token}) => {
                resolve(access_token)
            })
            .catch(() => {
                exchangeToken(store.store.igCode)
            })
    }
})

export const fetchPosts = (): Promise<GetMyPosts> => auth().then(getMyPosts).catch(() => fetchPosts())
