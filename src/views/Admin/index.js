import React, { useEffect, useState } from "react";
import { API_DOMAIN } from "../../common/common";
import { getCookie, removeCookie } from "../../common/Cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminMain() {
  const TOKEN_DECRYPTION = () => `${API_DOMAIN}/auth/tokenDecryption`;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    removeCookie("accessToken");
    navigate("/signIn");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie("accessToken");

        // 쿠키에 토큰이 없으면 API 호출을 하지 않음
        if (!token) {
          navigate("/signIn");
          throw new Error("No token found");
        }

        // API 요청 보내기
        const response = await axios.get(TOKEN_DECRYPTION(), {
          headers: {
            Authorization: `${token}`,
          },
        });

        const { role } = response.data;
        if (role !== "ROLE_ADMIN") {
          navigate("/signIn");
        }
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false); // API 요청 완료 후 로딩 상태 해제
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중 메시지
  }

  return (
    <div>
      <h1>{userData.username}</h1>
      <h1>{userData.email}</h1>
      <h1>{userData.type}</h1>
      <h1>{userData.role}</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
