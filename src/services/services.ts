import axios from 'axios';

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

export const registerByAuth = async (email: string, password: string) => {
    try {
        // TODO: implement register
        const token = 'await registerByAuth(email, password)';
        return token;
    } catch (error: any) {
        throw getError(error);
    }
};

export const getProfile = () => {
    try {
        // TODO: verify if user is student or teacher
        const user = {
            username: 'Professor'
        };
        return user;
    } catch (error: any) {
        throw getError(error);
    }
};

export const createCategory = async (name: string, description: string) => {
    try {
        const payload = {
            name,
            info: description,
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
                await axios.put(`/answers/${answersIds[answerIndex]}`, answer);
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
