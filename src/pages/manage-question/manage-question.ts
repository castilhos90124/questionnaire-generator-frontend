import {Options, Vue} from 'vue-class-component';
import {
    getRequest,
    createAnswers,
    updateAnswers,
    createQuestion,
    updateQuestion,
    deleteRequest,
    getCategoryNameById,
    getCategoryIndexById
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';

const initalAnswersQuantity = 2;
const maxAnswersQuantity = 6;

@Options({
    components: {
        'app-button': Button
    }
})
export default class ManageQuestion extends Vue {
    private categories: any;
    private questions: any;
    private modalActive: boolean = false;
    private modalDeleteActive: boolean = false;
    private toast = useToast();
    private name: string = '';
    private questionText: string = '';
    private isLoading: boolean = false;
    private isLoadingQuestion: boolean = false;
    private categoryId: string;
    private questionId: string;
    private answersIds: string[] = [];
    private isEditing: boolean = false;
    private selectedCategoryIndex: string;
    private questionDifficulty: number;
    private selectedAnswersQuantity: string = initalAnswersQuantity.toString();
    private answersQuantity: number = initalAnswersQuantity;
    private correctAnswer: number;
    private answersText: any = {1: '', 2: '', 3: '', 4: '', 5: ''};
    private deleteIndex: number;
    private questionTextMaxChars = 350;
    private maxAnswersQuantity: number = maxAnswersQuantity;

    created() {
        this.updateCategoriesList();
        this.updateQuestionsList();
    }
    data() {
        return {
            columns: ['Nome', 'Enunciado', 'Categoria', 'Dificuldade'],
            questions: this.questions
        };
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
            this.questionDifficulty !== undefined &&
            this.correctAnswer
        );
    }

    private toggleModal(): void {
        this.modalActive = !this.modalActive;
        this.cleanData();
    }

    private setEditedRow(index: number) {
        const question = this.questions[index];
        this.questionId = question.id;
        this.name = question.name;
        this.questionText = question.questiontext;
        this.selectedCategoryIndex = getCategoryIndexById(
            question.category_id,
            this.categories
        );
        this.onChangeCategory();
        this.questionDifficulty = question.ability;
        this.setAnswersValues(question.answers);
    }

    private setAnswersValues(answers: any) {
        this.selectedAnswersQuantity = answers.length.toString();
        this.onChangeAnswersQuantity();

        for (const key in answers) {
            const answerIndex = parseInt(key) + 1;
            this.answersText[answerIndex] = answers[key].text;
            if (answers[key].is_correct) {
                this.correctAnswer = answerIndex;
            }
            this.answersIds[parseInt(key)] = answers[key].id;
        }
    }

    private cleanData() {
        this.name = '';
        this.questionId = '';
        this.questionText = '';
        this.categoryId = '';
        this.isEditing = false;
        this.selectedCategoryIndex = '';
        this.questionDifficulty = undefined;
        this.correctAnswer = undefined;
        for (const key in this.answersText) {
            this.answersText[key] = '';
        }
        for (const key in this.answersIds) {
            this.answersIds[key] = '';
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
                            this.updateQuestionsList();
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
        updateQuestion(
            this.questionId,
            this.name,
            this.questionText,
            this.categoryId,
            this.questionDifficulty
        )
            .then(
                (response) => {
                    updateAnswers(
                        this.answersIds,
                        this.answersText,
                        this.correctAnswer,
                        response.data.id
                    ).then(
                        () => {
                            this.updateQuestionsList();
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

    private onDelete() {
        this.isLoading = true;
        deleteRequest('questions', this.questions[this.deleteIndex].id)
            .then(
                () => {
                    this.toast.success(this.$t('messages.removeItemSuccess'));
                    this.updateQuestionsList();
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

    private updateQuestionsList() {
        this.isLoadingQuestion = true;
        getRequest('questions')
            .then(
                (response: any) => {
                    this.questions = response.data.data;
                },
                () => {
                    this.toast.error(this.$t('messages.getFailed'));
                }
            )
            .finally(() => {
                this.isLoadingQuestion = false;
            });
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

    private getCategoryNameById(id: string): string {
        return getCategoryNameById(id, this.categories);
    }
}
