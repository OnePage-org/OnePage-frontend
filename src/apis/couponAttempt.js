import axios from 'axios';
import { API_DOMAIN } from "../common/common";
import { getCookie } from '../common/Cookie';

export const attemptCoupon = async (couponCategory) => {
    try {
        const token = getCookie("accessToken");
        const requestBody = {
            couponCategory: couponCategory,  // 쿠폰 카테고리
            attemptAt: new Date().getTime()  // 현재 시간 전송
        };

        const response = await axios.post(`${API_DOMAIN}/coupon-event/attempt`, requestBody, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
        });

        return response.data;  // 서버 응답 반환
    } catch (error) {
        console.error("Failed to attempt coupon:", error);
        throw error;
    }
};
