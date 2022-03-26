import {Options, Vue} from 'vue-class-component';
import {
    getRequest,
    createSessions,
    deleteRequest,
    getCategoryNameById,
    getCategoryIndexById,
    getStudentEmailById,
    updateSession
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';
import Multiselect from '@vueform/multiselect';

const initialQuestionsQuantity = 15;

@Options({
    components: {
        'app-button': Button,
        'Multiselect': Multiselect
    }
})
export default class ManageQuestionnaire extends Vue {
    private categories: any;
    private sessions: any;
    private students: any;
    private modalActive = false;
    private modalDeleteActive = false;
    private toast = useToast();
    private isLoading: boolean = false;
    private isEditing: boolean = false;
    private deleteIndex: number;
    private selectedCategoryIndex: string;
    private selectedStudents: any = [];
    private questionsQuantity: number = initialQuestionsQuantity;
    private studentsOptions: any = [];
    private sessionId: string;
    public $refs: any;

    created() {
        this.updateCategoriesList();
        this.updateStudentsList();
        this.updateSessionsList();
    }
    data() {
        return {
            columns: ['Aluno', 'Categoria', 'Questões', 'Status'],
            sessions: this.sessions
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

    private updateSessionsList() {
        getRequest('sessions').then(
            (response: any) => {
                this.sessions = response.data.data;
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }

    private updateStudentsList() {
        getRequest('students').then(
            (response: any) => {
                this.students = response.data.data;
                for (const i in this.students) {
                    this.studentsOptions[i] = this.students[i].email;
                }
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }

    private onSelectAll() {
        this.$refs.multiselect.selectAll();
    }
    private onOpenModal(index: any) {
        this.toggleModal();
        if (typeof index === 'number') {
            this.setEditedRow(index);
            this.isEditing = true;
        }
    }
    private onSubmit() {
        if (
            this.selectedCategoryIndex === undefined ||
            this.selectedStudents.length < 1
        ) {
            this.toast.error(this.$t('messages.fillAllRequiredFields'));
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
        const session = this.sessions[index];
        this.selectedCategoryIndex = getCategoryIndexById(
            session.category_id,
            this.categories
        );
        this.selectedStudents.push(
            this.getStudentEmailById(session.student_id)
        );
        this.questionsQuantity = session.number_questions;
        this.sessionId = session.id;
    }

    private cleanEditedRow() {
        this.selectedCategoryIndex = undefined;
        this.selectedStudents = [];
        this.questionsQuantity = initialQuestionsQuantity;
        this.isEditing = false;
    }

    private getSelectedStudentsIds(selectedStudentsEmails: any, students: any) {
        const studentsIds = [];
        for (const i in selectedStudentsEmails) {
            const email = selectedStudentsEmails[i];
            for (const j in students) {
                const student = students[j];
                if (student.email === email) {
                    studentsIds.push(student.id);
                }
            }
        }
        return studentsIds;
    }
    private create() {
        const selectedStudentsIds = this.getSelectedStudentsIds(
            this.selectedStudents,
            this.students
        );
        const categoryId = this.categories[this.selectedCategoryIndex]?.id;
        createSessions(categoryId, selectedStudentsIds, this.questionsQuantity)
            .then(
                () => {
                    this.toast.success(this.$t('messages.createItemSuccess'));
                    this.toggleModal();
                    this.updateSessionsList();
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
        const categoryId = this.categories[this.selectedCategoryIndex]?.id;
        updateSession(this.sessionId, categoryId, this.questionsQuantity)
            .then(
                () => {
                    this.toast.success(this.$t('messages.editItemSuccess'));
                    this.toggleModal();
                    this.updateSessionsList();
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
        deleteRequest('sessions', this.sessions[this.deleteIndex].id)
            .then(
                () => {
                    this.toast.success(this.$t('messages.removeItemSuccess'));
                    this.updateSessionsList();
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

    private getStudentEmailById(id: string): string {
        return getStudentEmailById(id, this.students);
    }
}
