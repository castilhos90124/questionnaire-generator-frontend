import {Options, Vue} from 'vue-class-component';
import {
    getCategories,
    createAnswers,
    createQuestion
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Modal from '@/components/modal/modal.vue';
import Button from '@/components/button/button.vue';

const initalAnswersQuantity = 2;

@Options({
    components: {
        'app-modal': Modal,
        'app-button': Button
    }
})
export default class ManageQuestion extends Vue {
    private categories: any;
    private modalActive = false;
    private toast = useToast();
    private name: string = '';
    private questionText: string = '';
    private isLoading: boolean = false;
    private categoryId: string;
    private isEditing: boolean = false;
    private selectedCategoryIndex: string;
    private questionDifficulty: number;
    private selectedAnswersQuantity: string = initalAnswersQuantity.toString();
    private answersQuantity: number = initalAnswersQuantity;
    private correctAnswer: number;
    private answersText: any = {1: '', 2: '', 3: '', 4: '', 5: ''};

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
        if (!this.hasFilledAllInputs()) {
            this.toast.error(this.$t('messages.fillAllRequiredFields'));
            return;
        }
        this.isLoading = true;
        if (this.isEditing) this.update();
        else this.create();
    }
    private onChangeAnswersQuantity() {
        this.answersQuantity = parseInt(this.selectedAnswersQuantity);
    }
    private onChangeCategory() {
        this.categoryId = this.categories[this.selectedCategoryIndex].id;
    }

    private hasFilledAllInputs(): boolean {
        for (let i = 1; i <= this.answersQuantity; i++) {
            if (!this.answersText[i]) return false;
        }
        return !!(
            this.name &&
            this.categoryId &&
            this.questionText &&
            this.questionDifficulty &&
            this.correctAnswer
        );
    }

    private toggleModal(): void {
        this.modalActive = !this.modalActive;
        this.cleanData();
    }
    private setEditedRow(index: number) {
        console.log('setEditedRow', index);
    }
    private cleanData() {
        this.name = '';
        this.questionText = '';
        this.categoryId = '';
        this.isEditing = false;
        this.selectedCategoryIndex = '';
        this.questionDifficulty = undefined;
        this.correctAnswer = undefined;
        for (const key in this.answersText) {
            this.answersText[key] = '';
        }
    }
    private create() {
        createQuestion(
            this.name,
            this.questionText,
            this.categoryId,
            this.questionDifficulty
        )
            .then(
                (response) => {
                    createAnswers(
                        this.answersText,
                        this.correctAnswer,
                        response.data.id
                    ).then(
                        () => {
                            this.toast.success(
                                this.$t('messages.createItemSuccess')
                            );
                            this.toggleModal();
                        },
                        (error: any) => {
                            this.toast.error(error.message);
                        }
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
    private update() {
        console.log('update');
    }

    private onDelete(index: number) {
        console.log('delete', index);
    }
}
