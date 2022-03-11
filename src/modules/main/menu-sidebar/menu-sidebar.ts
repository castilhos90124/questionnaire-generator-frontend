import {IUser} from '@/interfaces/user';
import {Options, Vue} from 'vue-class-component';
import MenuItem from '@/components/menu-item/menu-item.vue';

@Options({
    name: 'app-menu-sidebar',
    components: {
        'app-menu-item': MenuItem
    }
})
export default class MenuSidebar extends Vue {
    public menu = MENU;
    get user(): IUser {
        return this.$store.getters['auth/user'];
    }
}

export const MENU = [
    {
        name: 'labels.dashboard',
        path: '/'
    },
    {
        name: 'labels.questions',
        path: '/manage-question'
    },
    {
        name: 'labels.categories',
        path: '/manage-category'
    },
    {
        name: 'labels.students',
        path: '/manage-student'
    }
];
