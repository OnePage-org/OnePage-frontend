import axios from "axios";
import { API_DOMAIN } from "../common/common";

const responseHandler = (response) => response.data;
const errorHandler = (error) => {
    if (!error.response || !error.response.data) return null;
    const responseBody = error.response.data;
    return responseBody;
};

const CHAT_URL = () => `${API_DOMAIN}/chat`;

export const getChatMessages = async () => {
    const result = await axios
        .get(CHAT_URL())
        .then(responseHandler)
        .catch(errorHandler);
    return result;
};

export const sendMessage = async (messageBody) => {
    const result = await axios
        .post(CHAT_URL(), messageBody)
        .then(responseHandler)
        .catch(errorHandler);
    return result;
};