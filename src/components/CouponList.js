import React, { useState, useEffect } from "react";
import { getCouponList } from "../apis/couponList";
import { getCookie } from "../common/Cookie";
import axios from "axios";
import { API_DOMAIN } from "../common/common";
import banapresso from "../assets/logos/banapresso.png"; // Coffee 카테고리 이미지
import dominosPizza from "../assets/logos/dominosPizza.jpg"; // Pizza 카테고리 이미지
import bhcChicken from "../assets/logos/bhcChicken.jpeg"; // Chicken 카테고리 이미지
import style from "../css/couponlist.module.css";

const CouponList = ({ userNameInfo }) => {
  const [couponEvents, setCouponEvents] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const [loadingProgress, setLoadingProgress] = useState(false); // 프로그레스바 상태
  const [buttonDisabled, setButtonDisabled] = useState(false); // 버튼 비활성화 상태
  const [successModal, setSuccessModal] = useState(false); // 성공 모달 상태

  useEffect(() => {
    const fetchCouponEvents = async () => {
      try {
        const data = await getCouponList(); // API 호출
        console.log(data);
        if (Array.isArray(data)) {
          setCouponEvents(data);
        } else if (data) {
          setCouponEvents([data]); // 단일 객체일 경우 배열로 변환
        } else {
          setError("진행 중인 이벤트가 없습니다");
        }
      } catch (error) {
        setError("Failed to fetch coupon event list");
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCouponEvents();
  }, []);

  const onApplyClickHandler = async (category) => {
    try {
      setButtonDisabled(true); // 버튼 비활성화
      const token = getCookie("accessToken");
      const startMs = Date.now();

      const requestBody = {
        id: 0, // 서버에서 유저 ID 처리
        couponCategory: category,
        attemptAt: startMs,
        username: userNameInfo,
      };

      const result = await axios.post(`${API_DOMAIN}/coupon-event/attempt`, requestBody, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // 요청이 성공적으로 완료되면 5초간 프로그레스바 표시
      if (result.status === 200) {
        setLoadingProgress(true); // 프로그레스바 표시
        setTimeout(() => {
          setLoadingProgress(false); // 5초 후 프로그레스바 숨김
          setSuccessModal(true); // 성공 모달 표시
        }, 7000); // 7초 동안 프로그레스바 표시
      }

    } catch (error) {
      if (error.response) {

        if (error.response.status === 400) {
          setModalMessage("이벤트가 아직 시작되지 않았습니다"); // 모달 메시지 설정
        } else if (error.response.status === 410) {
          setModalMessage("이벤트가 종료되었습니다"); // 모달 메시지 설정
        } else if (error.response.status === 406) {
          setModalMessage(
            <>
              이벤트에 이미 참여하셨습니다<br />
              결과는 왼쪽 리더보드를 통해 확인하실 수 있습니다
            </>
          ); // 모달 메시지 설정
        } else {
          setModalMessage("잠시 후에 다시 시도해주세요");
        }
        setShowModal(true); // 모달 표시
      } else {
        setModalMessage("쿠폰 발급 요청에 실패했습니다");
        setShowModal(true); // 실패 모달 표시
        console.error(error);
      }
    } finally {
      setButtonDisabled(false); // 버튼 다시 활성화
    }
  };

  const closeModal = () => {
    setShowModal(false); // 모달 닫기
  };

  const closeSuccessModal = () => {
    setSuccessModal(false); // 성공 모달 닫기
  };

  // 카테고리에 맞는 이미지를 반환하는 함수
  const getImageByCategory = (category) => {
    switch (category) {
      case "PIZZA":
        return dominosPizza;
      case "COFFEE":
        return banapresso;
      case "CHICKEN":
        return bhcChicken;
      default:
        return banapresso;
    }
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div>Loading coupon events...</div>;
  }

  // 에러가 발생했을 때 표시할 UI
  if (error) {
    return <div><br /><br />{error}</div>;
  }

  // 쿠폰 이벤트가 없을 때 표시할 UI
  if (!couponEvents || couponEvents.length === 0) {
    return <div>No coupon events available.</div>;
  }

  return (
    <div className={style.container}>
      {/* 성공 모달창 */}
      {successModal && (
        <div className={style.overlay}>
          <div className={style.modal}>
            <div className={style.modalContent}>
              <p>쿠폰 발급 요청에 성공했습니다!</p>
              <p>결과는 왼쪽 리더보드를 통해 확인하실 수 있습니다</p>
              <button onClick={closeSuccessModal} className={style.confirmButton}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 실패 또는 이벤트 시작 전 모달창 */}
      {showModal && (
        <div className={style.overlay}>
          <div className={style.modal}>
            <div className={style.modalContent}>
              <p>{modalMessage}</p>
              <button onClick={closeModal} className={style.confirmButton}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 프로그레스바 표시 */}
      {loadingProgress && (
        <div className={style.overlay}>
          <div className={style.progressBarContainer}>
            <div className={style.progressBar}></div>
            <p>쿠폰 발급 요청 처리 중...</p>
          </div>
        </div>
      )}

      {/* 쿠폰 리스트 */}
      {couponEvents.map((event, index) => (
        <div className={style.couponList} key={index}>
          <div className={style.logo}>
            <img
              src={getImageByCategory(event.eventCategory)} // 카테고리에 따라 이미지 결정
              alt={`${event.brand} logo`}
              className={style.logoImg}
            />
            <div>
              <p className={style.eventName}>{event.eventName}</p>
              <p className={style.eventCategory}>{event.eventCategory}</p>
              <p className={style.startTime}>
                {new Date(event.startTime).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => onApplyClickHandler(event.eventCategory)}
            disabled={buttonDisabled || showModal || loadingProgress} // 버튼 비활성화 제어
            className={buttonDisabled ? style.disabledButton : style.activeButton} // 버튼 스타일 변경
          >
            응모하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default CouponList;
