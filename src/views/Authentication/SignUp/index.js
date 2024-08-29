import InputBox from "../../../components/InputBox";
import React, { useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const emailRef = useRef(null);
  const certificationNumberRef = useRef(null);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [certification, setCertificationNumber] = useState("");

  const [isIdError, setIdError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [isCertificationNumberError, setCertificationNumberError] =
    useState(false);

  const [idMessage, setIdMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [certificationNumberMessage, setCertificationNumberMessage] =
    useState("");

  const onIdChangeHandler = (event) => {
    const { value } = event.target;
    setId(value);
    setIdMessage("");
    setIdCheck(false);
  };

  const onPasswordChangeHandler = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage("");
  };

  const onPasswordCheckChangeHandler = (event) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordCheckMessage("");
  };

  const onEmailChangeHandler = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage("");
  };

  const onCertificationNumberChangeHandler = (event) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage("");
  };

  const onIdButtonClickHandler = () => {
    if (!id) return;
    const requestBody = { id };
  };

  const onPasswordButtonClickHandler = () => {};

  const onPasswordCheckButtonClickHandler = () => {};

  const onSnsSignInButtonClickHandler = (type) => {};

  const onEmailButtonClickHandler = () => {
    if (!id || !email) return;
    const checkedEmail = emailPattern.test(email);
    if (!checkedEmail) {
      setEmailError(true);
      setEmailMessage("이메일 형식이 아닙니다.");
      return;
    }

    const requestBody = { id, email };

    setEmailError(false);
    setEmailMessage("이메일 전송중...");
  };

  const onCertificationNumberButtonClickHandler = () => {
    if (!id || !email || !certification) return;
    const requestBody = { id, email, certification };
  };

  const onIdKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onIdButtonClickHandler();
  };

  const onPasswordKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  };

  const onPasswordCheckKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    if (!emailRef.current) return;
    emailRef.current.focus();
  };

  const onEmailKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onEmailButtonClickHandler();
  };

  const onCertificationKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onCertificationNumberButtonClickHandler();
  };

  const onSignUpButtonClickHandler = () => {
    if (!id || !email || !certification || !password || !passwordCheck) return;
    if (!isIdCheck) {
      alert("중복 확인은 필수입니다.");
      return;
    }

    const checkedPassword = passwordPattern.test(password);
    if (!checkedPassword) {
      setPasswordError(true);
      setPasswordMessage("영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setPasswordCheckError(true);
      setPasswordCheckMessage("비밀번호가 일치하지 않습니다.");
    }

    if (!isCertificationCheck) {
      alert("이메일 인증은 필수입니다.");
      return;
    }

    const requestBody = { id, password, email, certification };
  };

  const onSignInButtonClickHandler = () => {
    navigate("/auth/sign-in");
  };

  const [isIdCheck, setIdCheck] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [isCertificationCheck, setCertificationCheck] = useState(false);

  const signUpButtonClass =
    id && password && passwordCheck && email && certification
      ? "primary-button-large"
      : "disable-button-large";

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

  const navigate = useNavigate();

  const signUpResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;

    navigate("/auth/sign-in");
  };

  return (
    <div id="sign-up-wrapper">
      <div className="sign-up-image"></div>
      <div className="sign-up-container">
        <div className="sign-up-box">
          <div className="sign-up-title">{"coupong"}</div>
          <div className="sign-up-content-box">
            <div className="sign-up-content-sns-sign-in-box">
              <div className="sign-up-content-sns-sign-in-title">
                {"SNS 회원가입"}
              </div>
              <div className="sign-up-content-sns-sign-in-button-box">
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
            <div className="sign-up-content-divider"></div>
            <div className="sign-up-content-input-box">
              <InputBox
                ref={idRef}
                title="아이디"
                placeholder="아이디를 입력해주세요"
                type="text"
                value={id}
                onChange={onIdChangeHandler}
                isErrorMessage={isIdError}
                message={idMessage}
                buttonTitle="중복 확인"
                onButtonClick={onIdButtonClickHandler}
                onKeyDown={onIdKeyDownHandler}
              />
              <InputBox
                ref={passwordRef}
                title="비밀번호"
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                onChange={onPasswordChangeHandler}
                isErrorMessage={isPasswordError}
                message={passwordMessage}
                onButtonClick={onPasswordButtonClickHandler}
                onKeyDown={onPasswordKeyDownHandler}
              />
              <InputBox
                ref={passwordCheckRef}
                title="비밀번호 확인"
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={passwordCheck}
                onChange={onPasswordCheckChangeHandler}
                isErrorMessage={isPasswordCheckError}
                message={passwordCheckMessage}
                onButtonClick={onPasswordCheckButtonClickHandler}
                onKeyDown={onPasswordCheckKeyDownHandler}
              />
              <InputBox
                ref={emailRef}
                title="이메일"
                placeholder="이메일 주소를 입력해주세요"
                type="text"
                value={email}
                onChange={onEmailChangeHandler}
                isErrorMessage={isEmailError}
                message={emailMessage}
                buttonTitle="이메일 인증"
                onButtonClick={onEmailButtonClickHandler}
                onKeyDown={onEmailKeyDownHandler}
              />
              <InputBox
                ref={certificationNumberRef}
                title="인증번호"
                placeholder="인증번호를 입력해주세요"
                type="text"
                value={certification}
                onChange={onCertificationNumberChangeHandler}
                isErrorMessage={isCertificationNumberError}
                message={certificationNumberMessage}
                buttonTitle="인증 확인"
                onButtonClick={onCertificationNumberButtonClickHandler}
                onKeyDown={onCertificationKeyDownHandler}
              />
            </div>
            <div className="sign-up-content-button-box">
              <div
                className={`${signUpButtonClass} full-width`}
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
              <div
                className="text-link-large full-width"
                onClick={onSignInButtonClickHandler}
              >
                {"로그인"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
