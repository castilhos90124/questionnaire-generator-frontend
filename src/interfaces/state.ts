export interface IAuthState {
    token: string;
    user: any;
}

export interface IAuthModule {
    namespaced: boolean;
    state: IAuthState;
    mutations: any;
    actions: any;
    getters: any;
}
