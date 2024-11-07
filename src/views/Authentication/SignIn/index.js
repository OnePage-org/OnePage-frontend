import InputBox from "../../../components/InputBox";
import React, { useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { signInRequest, SNS_SIGN_IN_URL } from "../../../apis";
import ResponseCode from "../../../common/responseCode";
import { setCookie } from "../../../common/Cookie";

export default function SignUp() {
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordError, setPasswordError] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const navigate = useNavigate();

  /* ID 관련 시작 */
  const onIdChangeHandler = (event) => {
    const { value } = event.target;
    setUsername(value);
  };

  const onIdKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };
  /* ID 관련 끝 */

  /* PW 관련 시작 */
  const onPasswordChangeHandler = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage("");
  };

  const onPasswordKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onSignInButtonClickHandler();
  };

  /* PW 관련 끝 */

  /* OAuth 관련 이벤트 */
  const onSnsSignInButtonClickHandler = (type = "kakao" | "naver") => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  /* 로그인 관련 시작 */
  const onSignInButtonClickHandler = () => {
    if (!username || !password) return;

    const requestBody = { username, password };
    signInRequest(requestBody).then(signInResponse);
  };

  const signInResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;
    // console.log(code);

    if (code === ResponseCode.SIGN_IN_FAIL) {
      setPasswordError(true);
      setPasswordMessage("로그인 정보가 일치하지 않습니다.");
    }

    if (code === ResponseCode.VALIDATION_FAIL) alert("모든 값을 입력해주세요.");
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code !== ResponseCode.SUCCESS) return;

    /* POST 요청후 백엔드로부터 응답으로 받은 responseBody의 DTO 중 token과 만료시간인 expriationTime을 가져온다. */
    const { token, expirationTime, role } = responseBody;
    const now = new Date().getTime();
    const expires = new Date(now + expirationTime * 1000);
    /* 첫 번째 매개변수는 쿠키 이름, 두 번째 매개변수는 넣을 값, 그 이후는 추가 옵션 */
    setCookie("accessToken", token, { expires, path: "/" });

    /* 로그인이 성공했을 경우 responseBody로부터 받은 Role 정보로부터 일반 유저인지 관리자인지 확인한 뒤,
    일반 유저이면 메인페이지, 관리자면 관리자 페이지로 보내준다. */
    if (role === "ROLE_USER") navigate("/");
    if (role === "ROLE_ADMIN") navigate("/admin");
  };
  /* 로그인 관련 끝 */

  /* 회원가입 버튼 이벤트 시작 */
  const onSignUpButtonClickHandler = () => {
    navigate("/signUp");
  };
  /* 회원가입 버튼 이벤트 끝 */

  return (
    <div id="sign-in-wrapper">
      <div className="sign-in-image"></div>
      <div className="sign-in-container">
        <div className="sign-in-box">
          <div className="sign-in-title">{"coupong"}</div>
          <div className="sign-in-content-box">
            <div className="sign-in-content-input-box">
              <InputBox
                ref={idRef}
                title="닉네임"
                placeholder="닉네임을 입력해주세요"
                type="text"
                value={username}
                onChange={onIdChangeHandler}
                onKeyDown={onIdKeyDownHandler}
              />
              <InputBox
                ref={passwordRef}
                title="비밀번호"
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                onChange={onPasswordChangeHandler}
                message={passwordMessage}
                isErrorMessage={isPasswordError}
                onKeyDown={onPasswordKeyDownHandler}
              />
            </div>
            <div className="sign-in-content-button-box">
              <div
                className="primary-button-large full-width"
                onClick={onSignInButtonClickHandler}
              >
                {"로그인"}
              </div>
              <div
                className="text-link-large full-width"
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
              {/* <div className="sign-in-content-divider"></div>
              <div className="sign-in-content-sns-sign-in-box">
                <div className="sign-in-content-sns-sign-in-title">
                  {"SNS 로그인"}
                </div>
                <div className="sign-in-content-sns-sign-in-button-box">
                  <div
                    className="kakao-sign-in-button"
                    onClick={() => onSnsSignInButtonClickHandler("kakao")}
                  ></div>
                  <div
                    className="naver-sign-in-button"
                    onClick={() => onSnsSignInButtonClickHandler("naver")}
                  ></div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
