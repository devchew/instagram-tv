import Store from 'electron-store';

export const NodeStore = () =>
    new Store({
        name:'nodeStore',
        schema: {
            igCode: {
                type: 'string'
            },
            igUser: {
                type: 'object',
                properties: {
                    access_token: { type: 'string' },
                    user_id: { type: 'number' },
                }
            }
        }
    })
