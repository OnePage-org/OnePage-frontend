import InputBox from "../../../components/InputBox";
import React, { useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const onIdChangeHandler = (event) => {
    const { value } = event.target;
    setId(value);
    setMessage("");
  };

  const onPasswordChangeHandler = (event) => {
    const { value } = event.target;
    setPassword(value);
    setMessage("");
  };

  const onIdKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

  const onPasswordKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onSignInButtonClickHandler();
  };

  const onSignInButtonClickHandler = () => {
    if (!id || !password) {
      alert("아이디와 비밀번호 모두 입력하세요.");
      return;
    }
  };

  const onSnsSignInButtonClickHandler = (type) => {};

  const onSignUpButtonClickHandler = () => {
    navigate("/signUp");
  };

  const navigate = useNavigate();

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
                value={id}
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
                message={message}
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
