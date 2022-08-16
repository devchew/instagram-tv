import { Bridge } from '../preload';

declare const electron: Bridge

export const closeWindow = (): void => {
    electron.api.close();
};

export const listenToData = electron.api.listenToData
