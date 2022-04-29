import {Options, Vue} from 'vue-class-component';
import {
    getRequest,
    getNextQuestion,
    updateSessionByStudent,
    getCurrentQuestion
} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';

const FINISHED_STATUS = 4;

@Options({
    components: {
        'app-button': Button
    }
})
export default class Questionnaire extends Vue {
    private sessions: any;
    private toast = useToast();
    private question: any;
    private isLoading: boolean = false;
    private hasSession: boolean = false;
    private selectedAnswer: number;
    private currentSession: any;
    private startedQuestionnaire: boolean = false;
    private finishedQuestionnaire: boolean = false;

    created() {
        getRequest('user').then(
            (response: any) => {
                const user = response.data;
                if (!user.student_id) {
                    this.$router.push('/manage-questionnaire');
                }
                this.updateSessionsList();
            },
            () => {
                this.$store.dispatch('auth/logout');
            }
        );
    }
    data() {
        return {
            question: this.question
        };
    }

    private updateSessionsList() {
        getRequest('sessions').then(
            (response: any) => {
                this.finishedQuestionnaire = false;
                this.sessions = response.data.data;
                // TODO: Verificar qual session deve ser usada, pois pode ter mais de uma ativa para o usuario
                // e se o usuario tem sessions, pois pode nao ter nenhuma
                if (this.sessions.length < 1) {
                    return;
                }

                this.currentSession = this.sessions[0];
                this.hasSession = true;
                if (this.currentSession.status === FINISHED_STATUS) {
                    this.finishedQuestionnaire = true;
                    return;
                }
                if (!this.question && this.startedQuestionnaire) {
                    this.getQuestion();
                }
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }

    private isQuestionnaireInProgress(sessionStatus: number): boolean {
        switch (sessionStatus) {
            case 2:
            case 3:
                return true;
            case 1:
            case 4:
            default:
                return false;
        }
    }

    private onAnswer() {
        this.isLoading = true;
        const answer = this.question.answers[this.selectedAnswer];
        updateSessionByStudent(this.currentSession.id, answer.id).then(
            (response: any) => {
                this.question = response.data.data;
                this.getNextQuestion();
                this.updateSessionsList();
                this.selectedAnswer = undefined;
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }

    private getNextQuestion() {
        getNextQuestion(this.currentSession.id)
            .then(
                (response: any) => {
                    this.question = response.data.data;
                },
                () => {
                    // this.toast.error(this.$t('messages.getFailed'));
                }
            )
            .finally(() => {
                this.isLoading = false;
            });
    }

    private getQuestion() {
        getCurrentQuestion(this.currentSession.id).then(
            (response: any) => {
                this.question = response.data.data;
            },
            () => {
                this.getNextQuestion();
            }
        );
    }

    private onStartQuestionnaire() {
        this.startedQuestionnaire = true;
        this.updateSessionsList();
    }

    private getQuestionnaireStatus() {
        if (this.finishedQuestionnaire) return 'finished';
        if (!this.startedQuestionnaire && this.hasSession) {
            if (this.isQuestionnaireInProgress(this.currentSession.status))
                return 'inProgress';
            else return 'created';
        }
        if (this.isLoading || (!!this.question && this.startedQuestionnaire))
            return 'showQuestion';
        if (!this.hasSession) return 'noQuestionnaire';
    }
}
