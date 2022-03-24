import {Options, Vue} from 'vue-class-component';
import {getRequest, getNextQuestion} from '@/services/services';
import {useToast} from 'vue-toastification';
import Button from '@/components/button/button.vue';

@Options({
    components: {
        'app-button': Button,
    }
})
export default class Questionnaire extends Vue {
    private sessions: any;
    private toast = useToast();
    private currentQuestion: number = 1;
    private questionText: string =
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged';
    private question: any;
    private hasSession: boolean = false;
    private isLoading: boolean = false;
    private selectedAnswer: number;
    // private answers: any;

    created() {
        this.updateSessionsList();
    }
    data() {
        return {
            question: this.question
        };
    }

    private updateSessionsList() {
        getRequest('sessions').then(
            (response: any) => {
                this.sessions = response.data.data;
                // TODO: Verificar qual session deve ser usada, pois pode ter mais de uma ativa para o usuario
                // e se o usuario tem sessions, pois pode nao ter nenhuma
                if (this.sessions.length < 1) {
                    return;
                }

                const session = this.sessions[0];
                this.hasSession = true;
                this.question = this.getMockQuestion();
                console.log('question', this.question);

                // getRequest(`questions/${session.current_question}`).then(
                //     (response: any) => {
                //         this.question = response.data.data;
                //         console.log('question', this.question);
                //     },
                //     () => {
                //         this.toast.error(this.$t('messages.getFailed'));
                //     }
                // );
                // getNextQuestion(session.id).then(
                //     (response: any) => {
                //         this.question = response.data.data;
                //         console.log('question', this.question);
                //     },
                //     () => {
                //         this.toast.error(this.$t('messages.getFailed'));
                //     }
                // );
            },
            () => {
                this.toast.error(this.$t('messages.getFailed'));
            }
        );
    }

    private onAnswer() {
        this.isLoading = true;
        console.log('answer', this.selectedAnswer);
        this.isLoading = false;
    }

    private getMockQuestion(): any {
        return {
            id: "95cfc3b1-cd3c-46c3-a3f0-fd30ff089155",
            moodle_id: null,
            category_id: "95cfc038-e92a-481c-b4f0-a4421130a086",
            type: "multiplechoice",
            name: "1111",
            questiontext: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
            questiontext_format: "html",
            generalfeedback: "",
            generalfeedback_format: "",
            defaultgrade: 1,
            penalty: 0.33,
            hidden: 0,
            idnumber: null,
            single: 0,
            shuffleanswers: 0,
            answernumbering: "",
            showstandardinstruction: 0,
            correctfeedback: "Your answer is correct.",
            correctfeedback_format: "html",
            partiallycorrectfeedback: "Your answer is partially correct.",
            partiallycorrectfeedback_format: "html",
            incorrectfeedback: "Your answer is incorrect.",
            incorrectfeedback_format: "html",
            ability: 0,
            discrimination: 0,
            guess: 0,
            answers: [
                {
                    id: "95cfc3b2-042f-4cc4-a2d1-c664b245d812",
                    moodle_id: null,
                    question_id: "95cfc3b1-cd3c-46c3-a3f0-fd30ff089155",
                    fraction: 1,
                    format: "html",
                    text: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    is_correct: 0,
                    feedback: "",
                    feedback_format: "html",
                    created_at: "2022-03-13T18:22:19.000000Z",
                    updated_at: "2022-03-13T18:22:19.000000Z"
                },
                {
                    id: "95cfc3b2-07e4-429d-9ec8-64f1e7660292",
                    moodle_id: null,
                    question_id: "95cfc3b1-cd3c-46c3-a3f0-fd30ff089155",
                    fraction: 1,
                    format: "html",
                    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem",
                    is_correct: 1,
                    feedback: "",
                    feedback_format: "html",
                    created_at: "2022-03-13T18:22:19.000000Z",
                    updated_at: "2022-03-13T18:22:19.000000Z"
                }
            ],
            created_at: "2022-03-13T18:22:19.000000Z",
            updated_at: "2022-03-13T18:22:19.000000Z"
        };
    }
}
