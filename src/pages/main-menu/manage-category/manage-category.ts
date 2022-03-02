import {Vue} from 'vue-class-component';
import {getCategories} from '@/services/services';
import {useToast} from 'vue-toastification';

export default class ManageCategory extends Vue {
    public categories: any;
    private toast = useToast();

    private populateCategories() {
        getCategories().then(
            (response: any) => {
                this.categories = response.data.data;
            },
            (error: any) => {
                this.toast.error(error.message);
            }
        );
    }

    data() {
        return {
            columns: ['Nome', 'Descrição'],
            categories: this.categories
        };
    }

    created() {
        this.populateCategories();
    }
}
