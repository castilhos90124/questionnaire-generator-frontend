/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Gatekeeper} from 'gatekeeper-client-sdk';
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
        const loginUrl = `${process.env.VUE_APP_API_URL}/login`;
        const payload = {
            email: email,
            password: password,
            password_confirmation: password
        };
        const token = await axios.post(loginUrl, payload);

        return token;
    } catch (error: any) {
        throw getError(error);
    }
};

export const registerByAuth = async (email: string, password: string) => {
    try {
        const token = await Gatekeeper.registerByAuth(email, password);
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
