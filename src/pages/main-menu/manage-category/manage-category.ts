import {Options, Vue} from 'vue-class-component';
import {
    getCategories,
    deleteCategory,
    updateCategory,
    createCategory
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Modal from '@/components/modal/modal.vue';
import Button from '@/components/button/button.vue';

@Options({
    components: {
        'app-modal': Modal,
        'app-button': Button
    }
})
export default class ManageCategory extends Vue {
    private categories: any;
    private modalActive = false;
    private toast = useToast();
    private name: string = '';
    private description: string = '';
    private isLoading: boolean = false;
    private categoryId: string;
    private isEditing: boolean = false;

    created() {
        this.updateCategoriesList();
    }
    data() {
        return {
            columns: ['Nome', 'Descrição'],
            categories: this.categories
        };
    }
    private updateCategoriesList() {
        getCategories().then(
            (response: any) => {
                this.categories = response.data.data;
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }
    private onOpenModal(index: any) {
        this.toggleModal();
        if (typeof index === 'number') {
            this.setEditedRow(index);
            this.isEditing = true;
        }
    }
    private onSubmit() {
        if (!this.name) {
            this.toast.error(this.$t('messages.fillCategoryName'));
            return;
        }
        this.isLoading = true;
        if (this.isEditing) this.update();
        else this.create();
    }
    private toggleModal() {
        this.modalActive = !this.modalActive;
        this.cleanEditedRow();
    }
    private setEditedRow(index: number) {
        this.name = this.categories[index].name;
        this.description = this.categories[index].info;
        this.categoryId = this.categories[index].id;
    }
    private cleanEditedRow() {
        this.name = '';
        this.description = '';
        this.categoryId = '';
        this.isEditing = false;
    }
    private create() {
        createCategory(this.name, this.description)
            .then(
                () => {
                    this.toast.success(this.$t('messages.createItemSuccess'));
                    this.toggleModal();
                    this.updateCategoriesList();
                },
                (error: any) => {
                    this.toast.error(error.message);
                }
            )
            .finally(() => {
                this.isLoading = false;
            });
    }
    private update() {
        updateCategory(this.categoryId, this.name, this.description)
            .then(
                () => {
                    this.toast.success(this.$t('messages.editItemSuccess'));
                    this.toggleModal();
                    this.updateCategoriesList();
                },
                (error: any) => {
                    this.toast.error(error.message);
                }
            )
            .finally(() => {
                this.isLoading = false;
            });
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
