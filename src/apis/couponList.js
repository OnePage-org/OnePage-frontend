import axios from "axios";
import { API_DOMAIN } from "../common/common";

const responseHandler = (response) => response.data;
const errorHandler = (error) => {
    if (!error.response || !error.response.data) return null;
    const responseBody = error.response.data;
    return responseBody;
};

const COUPON_LIST_URL = () => `${API_DOMAIN}/coupons`;

export const getCouponList = async () => {
    const result = await axios
        .get(COUPON_LIST_URL())
        .then(responseHandler)
        .catch(errorHandler);
    return result;
};

export const applyCoupon = async (couponId) => {
    const result = await axios
        .post(`${COUPON_LIST_URL()}/${couponId}/apply`)
        .then(responseHandler)
        .catch(errorHandler);
    return result;
};