import fetch from 'node-fetch';
import { InstagramAuth } from './InstagramAuthWindow';
import { NodeStore } from './NodeStore';

const appId = process.env.INSTAGRAM_APP_ID;
const appSecret = process.env.INSTAGRAM_APP_SECRET;
const redirectUri = 'https://localhost/auth'
const store = NodeStore();

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

    const params = new URLSearchParams();
    params.append('client_id', appId);
    params.append('client_secret', appSecret);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

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


export const fetchPosts = () => {

    const authAndStore = () => InstagramAuth().then((token) => {
        store.set('igCode', token);
        return token;
    })

    const exchangeToken = (token: string) => exchangeTheCodeForAToken(token)
        .then(({access_token, user_id}) => {
            store.set('igUser', {
                access_token,
                user_id
            });
        })
        .catch(authAndStore)

    const doInstagramFetchStuff: () => Promise<GetMyPosts> = () => getMyPosts(store.get('igUser.access_token'))
        .catch(() => {
            store.clear();
            return doInstagramStuff();
        })

    const doInstagramStuff = () => {
        if (!store.store.igCode) {
            return authAndStore().then(exchangeToken).then(doInstagramFetchStuff);
        }
        if (!store.store.igUser) {
            return exchangeToken(store.store.igCode as string).then(doInstagramFetchStuff);
        }
        return doInstagramFetchStuff()
    }

    return doInstagramStuff()
}
