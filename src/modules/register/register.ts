import {Options, Vue} from 'vue-class-component';
import {createTeacher} from '@/services/services';
import Input from '@/components/input/input.vue';
import Button from '@/components/button/button.vue';
import {useToast} from 'vue-toastification';
import Checkbox from '@/components/checkbox/checkbox.vue';

@Options({
    components: {
        'app-input': Input,
        'app-button': Button,
        'app-checkbox': Checkbox
    }
})
export default class Register extends Vue {
    private appElement: HTMLElement | null = null;
    public email: string = '';
    public password: string = '';
    public isLoading: boolean = false;
    private toast = useToast();
    private name: string = '';
    private passwordConfirmation: string = '';
    private isTeacher: boolean = false;

    public mounted(): void {
        this.appElement = document.getElementById('app') as HTMLElement;
        this.appElement.classList.add('login-page');
    }

    public unmounted(): void {
        (this.appElement as HTMLElement).classList.remove('login-page');
    }

    private onSubmit() {
        if (!this.hasFilledAllInputs()) {
            this.toast.error(this.$t('messages.fillAllRequiredFields'));
            return;
        }
        if (!this.isValidEmail(this.email)) {
            this.toast.error(this.$t('messages.fillValidEmail'));
            return;
        }
        if (this.password !== this.passwordConfirmation) {
            this.toast.error(this.$t('messages.passwordsMustMatch'));
            return;
        }
        if (!this.isTeacher) {
            this.toast.error(this.$t('messages.mustBeTeacher'));
            return;
        }
        this.isLoading = true;
        this.register();
    }

    private register() {
        createTeacher(this.name, this.email, this.password)
            .then(
                () => {
                    this.toast.success(this.$t('messages.registerSuccess'));
                    this.$router.push('/login');
                },
                () => {
                    this.toast.error(this.$t('messages.registerFail'));
                }
            )
            .finally(() => {
                this.isLoading = false;
            });
    }
    private isValidEmail = (email: string): boolean => {
        return Boolean(
            String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        );
    };

    private hasFilledAllInputs(): boolean {
        return !!(
            this.name &&
            this.email &&
            this.password &&
            this.passwordConfirmation
        );
    }
}
