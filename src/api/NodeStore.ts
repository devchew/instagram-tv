import Store from 'electron-store';
import { LongLiveToken } from './Instagram';

type StoreType = {
    igCode: string,
    igUserToken: LongLiveToken,
    igTokenExpireAt: number
    igAccessToken: string
}
export const NodeStore = () =>
    new Store<StoreType>({
        name: 'nodeStore'
    });
