import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import store from '@/store/index';

import Main from '@/modules/main/main.vue';
import Login from '@/modules/login/login.vue';

import ForgotPassword from '@/modules/forgot-password/forgot-password.vue';
import ChangePassword from '@/pages/main-menu/change-password/change-password.vue';
import ManageCategory from '@/pages/main-menu/manage-category/manage-category.vue';
import ManageQuestion from '@/pages/main-menu/manage-question/manage-question.vue';
import ManageStudent from '@/pages/main-menu/manage-student/manage-student.vue';
import ManageQuestionnaire from '@/pages/main-menu/manage-questionnaire/manage-questionnaire.vue';
import Questionnaire from '@/pages/main-menu/questionnaire/questionnaire.vue';

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
                path: 'manage-question',
                name: 'Manage Question',
                component: ManageQuestion,
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
                path: 'manage-student',
                name: 'Manage Student',
                component: ManageStudent,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '',
                redirect: '/questionnaire'
            },
            {
                path: 'manage-questionnaire',
                name: 'Manage Questionnaire',
                component: ManageQuestionnaire,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'questionnaire',
                name: 'Questionnaire',
                component: Questionnaire,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/change-password',
                name: 'ChangePassword',
                component: ChangePassword,
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
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
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
