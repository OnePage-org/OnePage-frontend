import axios from "axios";
import { API_DOMAIN } from "../common/common";

const responseHandler = (response) => response.data;
const errorHandler = (error) => {
    if (!error.response || !error.response.data) return null;
    const responseBody = error.response.data;
    return responseBody;
};

const LEADERBOARD_URL = () => `${API_DOMAIN}/leaderboard`;

export const getLeaderboard = async () => {
    const result = await axios
        .get(LEADERBOARD_URL())
        .then(responseHandler)
        .catch(errorHandler);
    return result;
};