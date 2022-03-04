import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import store from '@/store/index';

import Main from '@/modules/main/main.vue';
import Login from '@/modules/login/login.vue';
import Register from '@/modules/register/register.vue';

import Dashboard from '@/pages/dashboard/dashboard.vue';
import Profile from '@/pages/profile/profile.vue';
import ForgotPassword from '@/modules/forgot-password/forgot-password.vue';
import RecoverPassword from '@/modules/recover-password/recover-password.vue';
import NewQuestion from '@/pages/main-menu/new-question/new-question.vue';
import ManageCategory from '@/pages/main-menu/manage-category/manage-category.vue';
import Blank from '@/pages/blank/blank.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Main',
        component: Main,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'profile',
                name: 'Profile',
                component: Profile,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'blank',
                name: 'Blank',
                component: Blank,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'new-question',
                name: 'New Question',
                component: NewQuestion,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'manage-category',
                name: 'Manage Category',
                component: ManageCategory,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'sub-menu-2',
                name: 'Sub Menu 2',
                component: Blank,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '',
                name: 'Dashboard',
                component: Dashboard,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '',
                name: 'Questionário',
                component: Dashboard,
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/recover-password',
        name: 'RecoverPassword',
        component: RecoverPassword,
        meta: {
            requiresUnauth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isLoggedIn()) {
        next('/login');
    } else if (to.meta.requiresUnauth && isLoggedIn()) {
        next('/');
    } else {
        next();
    }
});

const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!store.getters['auth/token'] || !!token;
};

export default router;
