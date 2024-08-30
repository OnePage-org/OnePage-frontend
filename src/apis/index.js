import axios from "axios";

const DOMAIN = "http://localhost:4040";
const API_DOMAIN = `${DOMAIN}/api/v1`;

const responseHandler = (response) => {
  const responseBody = response.data;
  return responseBody;
};

const errorHandler = (error) => {
  if (!error.response || !error.response.data) return null;
  const responseBody = error.response.data;
  return responseBody;
};

const ID_CHECK_URL = () => `${API_DOMAIN}/auth/idCheck`;

export const idCheckRequest = async (requestBody) => {
  const result = await axios
    .post(ID_CHECK_URL(), requestBody)
    .then(responseHandler)
    .catch(errorHandler);
  return result;
};
