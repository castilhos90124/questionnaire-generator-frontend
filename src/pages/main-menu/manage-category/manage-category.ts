import {Vue} from 'vue-class-component';
import {getCategories} from '@/services/services';
import {useToast} from 'vue-toastification';

export default class ManageCategory extends Vue {
    public categories: any;
    created() {
        this.populateCategories();
    }
    private toast = useToast();
    private async populateCategories(): Promise<void> {
        let response;
        try {
            response = await getCategories();
            this.categories = response.data.data;
        } catch (error: any) {
            this.toast.error(error.message);
        }
    }
    data() {
        return {
            columns: ['Nome', 'Descrição'],
            categories: this.categories
        };
    }
}
