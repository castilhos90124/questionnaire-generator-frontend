import {Options, Vue} from 'vue-class-component';
import MenuItem from '@/components/menu-item/menu-item.vue';
import {getRequest} from '@/services/services';

@Options({
    name: 'app-menu-sidebar',
    components: {
        'app-menu-item': MenuItem
    }
})
export default class MenuSidebar extends Vue {
    public menu = studentsMenu;
    public created(): void {
        getRequest('user').then(
            (response: any) => {
                const user = response.data;
                if (!user.student_id) {
                    this.menu = teachersMenu;
                }
            },
            () => {
                this.$store.dispatch('auth/logout');
            }
        );
    }
}

export const teachersMenu = [
    // {
    //     name: 'labels.dashboard',
    //     path: '/'
    // },
    {
        name: 'labels.categories',
        path: '/manage-category'
    },
    {
        name: 'labels.students',
        path: '/manage-student'
    },
    {
        name: 'labels.questions',
        path: '/manage-question'
    },
    {
        name: 'labels.questionnaires',
        path: '/manage-questionnaire'
    }
];

export const studentsMenu = [
    {
        name: 'labels.questionnaires',
        path: '/questionnaire'
    }
];
