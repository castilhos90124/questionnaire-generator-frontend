import {createCategory} from '@/services/services';
import Button from '@/components/button/button.vue';
import Input from '@/components/input/input.vue';
import {Options, Vue} from 'vue-class-component';
import {useToast} from 'vue-toastification';

@Options({
    components: {
        'app-input': Input,
        'app-button': Button
    }
})
export default class Category extends Vue {
    public name: string = '';
    public description: string = '';
    public isLoading: boolean = false;
    private toast = useToast();
    public async onCreate(): Promise<void> {
        if (!this.name) {
            this.toast.error(this.$t('messages.fillCategoryName'));
            return;
        }
        try {
            this.isLoading = true;
            await createCategory(this.name, this.description);
            this.isLoading = false;
        } catch (error: any) {
            this.toast.error(error.message);
            this.isLoading = false;
        }
    }
}
