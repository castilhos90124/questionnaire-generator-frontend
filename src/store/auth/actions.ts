import router from '@/router/index';

export default {
    login: (context: any, payload: string): void => {
        context.commit('setToken', payload);
        router.replace('/');
    },
    getUser: (context: any, payload: any): void => {
        context.commit('setUser', payload);
    },
    logout: (context: any): void => {
        context.commit('setToken', null);
        context.commit('setUser', null);
        localStorage.removeItem('token');
        router.replace('/login');
    }
};
