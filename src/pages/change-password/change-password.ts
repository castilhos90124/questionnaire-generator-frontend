import {Options, Vue} from 'vue-class-component';
import Button from '@/components/button/button.vue';
import Input from '@/components/input/input.vue';
import {useToast} from 'vue-toastification';
import {changePassword} from '@/services/services';

@Options({
    components: {
        'app-input': Input,
        'app-button': Button
    }
})
export default class ChangePassword extends Vue {
    private appElement: HTMLElement | null = null;
    public password: string = '';
    public confirmPassword: string = '';
    private toast = useToast();
    private isLoading: boolean = false;

    private onSubmit() {
        if (!this.password || !this.confirmPassword) {
            this.toast.error(this.$t('messages.fillAllRequiredFields'));
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.toast.error(this.$t('messages.passwordsMustMatch'));
            return;
        }
        this.isLoading = true;
        this.changePassword(this.password, this.confirmPassword);
    }

    private changePassword(password: string, confirmPassword: string) {
        changePassword(password, confirmPassword)
            .then(
                () => {
                    this.toast.success(
                        this.$t('messages.passwordChangedSuccessfully')
                    );
                },
                (error: any) => {
                    this.toast.error(error.message);
                }
            )
            .finally(() => {
                this.isLoading = false;
            });
    }
}
