import {IAuthState} from '@/interfaces/state';

export default {
    user: (state: IAuthState): any => state.user,
    token: (state: IAuthState): string => state.token
};
