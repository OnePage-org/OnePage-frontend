import React, { useState, useEffect } from "react";
import { getCouponList } from "../apis/couponList"; // API 함수 임포트
import { getCookie } from "../common/Cookie";
import axios from "axios";
import { API_DOMAIN } from "../common/common";
import banapresso from "../assets/logos/banapresso.png";
// import "./listStyle.css";
import style from "../css/couponlist.module.css";

const CouponList = ({ userNameInfo }) => {
  // couponEvents 초기값을 빈 배열로 설정
  const [couponEvents, setCouponEvents] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  // 쿠폰 이벤트 목록을 가져오는 useEffect
  useEffect(() => {
    const fetchCouponEvents = async () => {
      try {
        const data = await getCouponList(); // API 호출
        console.log(data);
        // 데이터가 배열인지 확인하고 배열이 아닌 경우에도 배열로 처리
        if (Array.isArray(data)) {
          setCouponEvents(data);
        } else if (data) {
          setCouponEvents([data]); // 단일 객체일 경우 배열로 변환
        } else {
          setError("No event data available");
        }
      } catch (error) {
        setError("Failed to fetch coupon event list");
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCouponEvents(); // 컴포넌트 마운트 시 API 호출
  }, []);

  const onApplyClickHandler = async (category) => {
    try {
      const token = getCookie("accessToken");
      const startMs = Date.now();

      const requestBody = {
        id: 0,
        couponCategory: category,
        attemptAt: startMs,
        username: userNameInfo,
      };

      const result = await axios.post(
        `${API_DOMAIN}/coupon-event/attempt`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div>Loading coupon events...</div>;
  }

  // 에러가 발생했을 때 표시할 UI
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 쿠폰 이벤트가 없을 때 표시할 UI
  if (!couponEvents || couponEvents.length === 0) {
    return <div>No coupon events available.</div>;
  }

  // 쿠폰 이벤트가 있을 때 렌더링할 UI
  return (
    <div className={style.container}>
      {couponEvents.map((event, index) => (
        <div className={style.couponList} key={index}>
          <div className={style.logo}>
            <img
              src={banapresso}
              //   src={event.logoUrl}
              alt={`${event.brand} logo`}
              className={style.logoImg}
            />
            <div>
              {/* <h2>{event.eventName}</h2> */}
              <p className={style.eventName}>제로슈가 아이스티</p>
              <p className={style.eventCategory}>{event.eventCategory}</p>
              <p className={style.startTime}>
                {new Date(event.startTime).toLocaleString()}
              </p>
            </div>
          </div>
          <button onClick={() => onApplyClickHandler(event.eventCategory)}>
            응모하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default CouponList;
