import {Options, Vue} from 'vue-class-component';
import {
    createStudent,
    getRequest,
    deleteRequest,
    updateStudent,
    createStudentUser
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';
import Input from '@/components/input/input.vue';

@Options({
    components: {
        'app-button': Button,
        'app-input': Input
    }
})
export default class ManageStudent extends Vue {
    private students: any;
    private modalActive = false;
    private modalDeleteActive = false;
    private toast = useToast();
    private email: string = '';
    private studentId: string = '';
    private isLoading: boolean = false;
    private isEditing: boolean = false;
    private deleteIndex: number;
    private firstName: string = '';
    private lastName: string = '';

    created() {
        this.updateStudentsList();
    }
    data() {
        return {
            columns: ['Nome', 'Email', 'Habilidade', 'Notas'],
            students: this.students
        };
    }
    private updateStudentsList() {
        getRequest('students').then(
            (response: any) => {
                this.students = response.data.data;
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
        if (!this.firstName || !this.lastName || !this.email) {
            this.toast.error(this.$t('messages.fillAllRequiredFields'));
            return;
        }
        if (!this.isValidEmail(this.email)) {
            this.toast.error(this.$t('messages.fillValidEmail'));
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

    private isValidEmail = (email: string): boolean => {
        return Boolean(
            String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        );
    };

    private setEditedRow(index: number) {
        const student = this.students[index];
        this.studentId = student.id;
        this.firstName = student.firstname;
        this.lastName = student.lastname;
        this.email = student.email;
    }
    private cleanEditedRow() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.studentId = '';
        this.isEditing = false;
    }
    private create() {
        createStudent(this.firstName, this.lastName, this.email)
            .then(
                (response) => {
                    const studentId = response.data.id;
                    createStudentUser(
                        `${this.firstName} ${this.lastName}`,
                        this.email,
                        studentId
                    ).then(
                        () => {
                            this.toast.success(
                                this.$t('messages.createItemSuccess')
                            );
                            this.toggleModal();
                            this.updateStudentsList();
                        },
                        (error: any) => {
                            deleteRequest('students', studentId);
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
        updateStudent(this.firstName, this.lastName, this.email, this.studentId)
            .then(
                () => {
                    this.toast.success(this.$t('messages.editItemSuccess'));
                    this.toggleModal();
                    this.updateStudentsList();
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
        deleteRequest('students', this.students[this.deleteIndex].id)
            .then(
                () => {
                    this.toast.success(this.$t('messages.removeItemSuccess'));
                    this.updateStudentsList();
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
}
