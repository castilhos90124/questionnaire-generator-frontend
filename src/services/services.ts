import axios from 'axios';

const ANSWERED_STATUS = 3;

const getError = (error: any) => {
    const message =
        (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
        'Failed';
    return new Error(message);
};

export const loginByAuth = async (email: string, password: string) => {
    try {
        const payload = {
            email: email,
            password: password,
            password_confirmation: password
        };

        return await axios.post('/login', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const createCategory = async (
    name: string,
    description: string,
    categoryMotherId: string
) => {
    try {
        const payload = {
            name,
            info: description,
            category_id: categoryMotherId || null,
            info_format: 'html',
            moodle_id: null as number
        };

        return await axios.post('/categories', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateCategory = async (
    id: string,
    name: string,
    description: string
) => {
    try {
        const payload = {
            name,
            info: description
        };
        return await axios.put(`/categories/${id}`, payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const createQuestion = async (
    name: string,
    questionText: string,
    categoryId: string,
    questionDifficulty: number
) => {
    try {
        const payload = {
            name,
            questiontext: questionText,
            category_id: categoryId,
            questiontext_format: 'html',
            type: 'multiplechoice',
            defaultgrade: 1,
            ability: questionDifficulty,
            discrimination: 0,
            guess: 0,
            moodle_id: null as number
        };

        return await axios.post('/questions', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateQuestion = async (
    id: string,
    name: string,
    questionText: string,
    categoryId: string,
    questionDifficulty: number
) => {
    try {
        const payload = {
            name,
            questiontext: questionText,
            category_id: categoryId,
            ability: questionDifficulty
        };

        return await axios.put(`/questions/${id}`, payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const createAnswers = async (
    answersText: any,
    correctAnswer: number,
    questionId: string
) => {
    try {
        const payload = [];
        for (const key in answersText) {
            if (answersText[key]) {
                const answer = {
                    name: '',
                    question_id: questionId,
                    fraction: 1,
                    is_correct: correctAnswer == parseInt(key) ? 1 : 0,
                    text: answersText[key],
                    moodle_id: null as number
                };
                payload.push(answer);
            }
        }
        return await axios.post('/answers', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateAnswers = async (
    answersIds: string[],
    answersText: any,
    correctAnswer: number,
    questionId: string
) => {
    try {
        for (const key in answersText) {
            const answerIndex = parseInt(key) - 1;
            if (answersText[key]) {
                const answer = {
                    question_id: questionId,
                    is_correct: correctAnswer == parseInt(key) ? 1 : 0,
                    text: answersText[key]
                };
                if (answersIds[answerIndex]) {
                    await axios.put(`/answers/${answersIds[answerIndex]}`, answer);
                }
                else {
                    createAnswers([answer.text], answer.is_correct, answer.question_id);
                }
            }
        }
    } catch (error: any) {
        throw getError(error);
    }
};

export const createStudent = async (
    firstName: string,
    lastName: string,
    email: string
) => {
    try {
        const payload = {
            firstname: firstName,
            lastname: lastName,
            email,
            username: '',
            moodle_id: null as number
        };

        return await axios.post('/students', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const createStudentUser = async (
    name: string,
    email: string,
    studentId: string
) => {
    try {
        const default_username = email.substring(0, email.indexOf('@'));
        const payload = {
            name,
            email,
            username: default_username,
            password: default_username,
            password_confirmation: default_username,
            student_id: studentId
        };

        return await axios.post('/register', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateStudent = async (
    firstName: string,
    lastName: string,
    email: string,
    studentId: string
) => {
    try {
        const payload = {
            firstname: firstName,
            lastname: lastName,
            email,
            username: '',
            moodle_id: null as number
        };

        return await axios.put(`/students/${studentId}`, payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const getRequest = async (path: string) => {
    try {
        return await axios.get(`/${path}`);
    } catch (error: any) {
        throw getError(error);
    }
};

export const deleteRequest = async (path: string, id: string) => {
    try {
        return await axios.delete(`/${path}/${id}`);
    } catch (error: any) {
        throw getError(error);
    }
};

export const getCategoryNameById = (id: string, categoryList: any) => {
    let categoryName = '';
    categoryList.filter((item: any) => {
        if (item.id === id) {
            categoryName = item.name;
        }
    });
    return categoryName;
};

export const getCategoryIndexById = (id: string, categoryList: any) => {
    return categoryList.findIndex((item: any) => {
        return item.id === id;
    });
};

export const createSessions = async (
    categoryId: string,
    studentsIds: any,
    numberOfQuestions: number
) => {
    try {
        const payload = [];
        const date = new Date();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        for (const key in studentsIds) {
            const student_id = studentsIds[key];
            getRequest(`students/${student_id}`).then((response: any) => {
                const student = response.data.data;
                createStudentUser(
                    `${student.firstname} ${student.lastname}`,
                    student.email,
                    student_id
                );
            });
            const session = {
                category_id: categoryId,
                student_id,
                number_questions: numberOfQuestions,
                status: 1,
                current_answer_id: null as number,
                time_started: `${date.getFullYear()}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                tqg_id: 1
            };
            payload.push(session);
        }
        return await axios.post('/sessions', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateSession = async (
    id: string,
    categoryId: string,
    numberOfQuestions: number
) => {
    try {
        const payload = {
            category_id: categoryId,
            number_questions: numberOfQuestions
        };

        return await axios.put(`/sessions/${id}`, payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const updateSessionByStudent = async (
    id: string,
    currentAnswerId: string
) => {
    try {
        const payload: any = {
            current_answer_id: currentAnswerId,
            status: ANSWERED_STATUS
        };
        return await axios.put(`/sessions/${id}`, payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const getStudentEmailById = (id: string, studentList: any) => {
    let studentEmail = '';
    studentList.filter((item: any) => {
        if (item.id === id) {
            studentEmail = item.email;
        }
    });
    return studentEmail;
};

export const getNextQuestion = async (sessionId: string) => {
    try {
        return await axios.get(`/sessions/${sessionId}/get_next_question`);
    } catch (error: any) {
        throw getError(error);
    }
};

export const getCurrentQuestion = async (sessionId: string) => {
    try {
        return await axios.get(`/sessions/${sessionId}/get_current_question`);
    } catch (error: any) {
        throw getError(error);
    }
};

export const changePassword = async (
    password: string,
    passwordConfirmation: string
) => {
    try {
        const payload = {
            new_password: password,
            new_password_confirmation: passwordConfirmation
        };

        return await axios.post('/password', payload);
    } catch (error: any) {
        throw getError(error);
    }
};

export const createTeacher = async (
    name: string,
    email: string,
    password: string
) => {
    try {
        const payload = {
            name,
            email,
            username: email,
            password,
            password_confirmation: password
        };

        return await axios.post('/register', payload);
    } catch (error: any) {
        throw getError(error);
    }
};
