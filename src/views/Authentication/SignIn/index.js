import InputBox from "../../../components/InputBox";
import React, { useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const onSnsSignInButtonClickHandler = () => {};

  /* 로그인 버튼 이벤트 시작 */
  const onSignInButtonClickHandler = () => {
    navigate("/signIn");
  };
  /* 로그인 버튼 이벤트 끝 */

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
                title="아이디"
                placeholder="아이디를 입력해주세요"
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
                isErrorMessage
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
              <div className="sign-in-content-divider"></div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
