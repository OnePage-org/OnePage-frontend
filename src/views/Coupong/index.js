import React, { useEffect, useRef, useState } from "react";
import { API_DOMAIN } from "../../common/common";
import { getCookie, removeCookie } from "../../common/Cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useBeforeUnload } from "react-router-dom";

import "./style.css";
import logoutButton from "../../assets/images/logout.png";

import Leaderboard from "../../components/Leaderboard";
import CouponList from "../../components/CouponList";
import ChatRoom from "../../components/ChatRoom";

export default function CoupongMain() {
  const TOKEN_DECRYPTION = () => `${API_DOMAIN}/auth/tokenDecryption`;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatRoomRef = useRef();
  const navigate = useNavigate();

  const logout = () => {
    if (chatRoomRef.current) {
      chatRoomRef.current.handleExit();
    }
    removeCookie("accessToken");
    navigate("/signIn");
  };

  const refreshFunc = () => {
    navigate("/signIn");
  };

  useBeforeUnload((event) => {
    event.preventDefault();
    removeCookie("accessToken");
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie("accessToken");

        // 쿠키에 토큰이 없으면 API 호출을 하지 않음
        if (!token) {
          navigate("signIn");
          throw new Error("No token found");
        }

        // API 요청 보내기
        const response = await axios.get(TOKEN_DECRYPTION(), {
          headers: {
            Authorization: `${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false); // API 요청 완료 후 로딩 상태 해제
      }
    };

    fetchUserData();
    if (chatRoomRef.current) {
      chatRoomRef.current.handleEnter();
    }

    window.addEventListener("refresh", useBeforeUnload);
    return () => {
      window.removeEventListener("refresh", useBeforeUnload);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중 메시지
  }

  return (
    <div className="main-container">
      <div className="header">
        <p className="user-name">{userData.username} 님, 반갑습니다 !</p>
        <div className="logout" onClick={logout}>
          <img src={logoutButton}></img>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "90vh",
          justifyContent: "space-between",
        }}
      >
        <Leaderboard />
        <CouponList userNameInfo={userData.username} />
        <ChatRoom ref={chatRoomRef} username={userData.username} />
      </div>
    </div>
  );
}
