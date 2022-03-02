import {Vue} from 'vue-class-component';
import {getCategories, deleteCategory} from '@/services/services';
import {useToast} from 'vue-toastification';

export default class ManageCategory extends Vue {
    public categories: any;
    private toast = useToast();

    private updateCategoriesList() {
        getCategories().then(
            (response: any) => {
                this.categories = response.data.data;
            },
            (error: any) => {
                this.toast.error(error.message);
            }
        );
    }

    created() {
        this.updateCategoriesList();
    }

    data() {
        return {
            columns: ['Nome', 'Descrição'],
            categories: this.categories
        };
    }

    public onEdit(index: number) {
        console.log(index);
    }

    private onDelete(index: number) {
        deleteCategory(this.categories[index].id).then(
            () => {
                this.toast.success(this.$t('messages.removeItemSuccess'));
                this.updateCategoriesList();
            },
            (error: any) => this.toast.error(error.message)
        );
    }
}
