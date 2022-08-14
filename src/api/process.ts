import { Bridge } from '../preload';

declare const electron: Bridge

export const closeWindow = (): void => {
    electron.api.close();
};
