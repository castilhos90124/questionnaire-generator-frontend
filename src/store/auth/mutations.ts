import {IAuthState} from '@/interfaces/state';

export default {
    setToken: (state: IAuthState, payload: string): void => {
        state.token = payload;
    },
    setUser: (state: IAuthState, payload: any): void => {
        state.user = payload;
    }
};
