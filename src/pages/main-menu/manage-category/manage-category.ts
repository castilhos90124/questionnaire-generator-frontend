import {Options, Vue} from 'vue-class-component';
import {
    getRequest,
    updateCategory,
    createCategory,
    deleteRequest,
    getCategoryNameById,
    getCategoryIndexById
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';

@Options({
    components: {
        'app-button': Button
    }
})
export default class ManageCategory extends Vue {
    private categories: any;
    private modalActive = false;
    private modalDeleteActive = false;
    private toast = useToast();
    private name: string = '';
    private description: string = '';
    private isLoading: boolean = false;
    private categoryId: string;
    private isEditing: boolean = false;
    private deleteIndex: number;
    private categoryMotherIndex: string;

    created() {
        this.updateCategoriesList();
    }
    data() {
        return {
            columns: ['Nome', 'Descrição', 'Subcategoria da'],
            categories: this.categories
        };
    }
    private updateCategoriesList() {
        getRequest('categories').then(
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
        const category = this.categories[index];
        this.name = category.name;
        this.description = category.info;
        this.categoryId = category.id;
        this.categoryMotherIndex = getCategoryIndexById(
            category.category_id,
            this.categories
        );
    }

    private cleanEditedRow() {
        this.name = '';
        this.description = '';
        this.categoryId = '';
        this.categoryMotherIndex = undefined;
        this.isEditing = false;
    }

    private create() {
        const categoryMotherId = this.categories[this.categoryMotherIndex]?.id;
        createCategory(this.name, this.description, categoryMotherId)
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
    private onDelete() {
        this.isLoading = true;
        deleteRequest('categories', this.categories[this.deleteIndex].id)
            .then(
                () => {
                    this.toast.success(this.$t('messages.removeItemSuccess'));
                    this.updateCategoriesList();
                    this.toggleDeleteModal();
                },
                (error: any) => this.toast.error(error.message)
            )
            .finally(() => (this.isLoading = false));
    }

    private toggleDeleteModal(index?: number) {
        this.deleteIndex = index;
        this.modalDeleteActive = !this.modalDeleteActive;
    }

    private getCategoryNameById(id: string): string {
        return getCategoryNameById(id, this.categories);
    }
}
