import axios from 'axios';
import { API_DOMAIN } from "../common/common";
import { getCookie } from '../common/Cookie';

export const getCouponList = async () => {
    try {
        const token = getCookie("accessToken");

        const response = await axios.get(`${API_DOMAIN}/coupon-event/list`, {
            headers: {
                Authorization: `${token}`,
            },
        }); // 백엔드 API 호출
        return response.data; // 데이터 반환
    } catch (error) {
        console.error("진행중인 이벤트가 없습니다");
        throw error;
    }
};

// API 요청 보내기
