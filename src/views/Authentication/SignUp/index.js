import InputBox from "../../../components/InputBox";
import React, { useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import {
  checkCertificationRequest,
  idCheckRequest,
  sendMailRequest,
} from "../../../apis";

import ResponseCode from "../../../common/responseCode";

export default function SignUp() {
  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const emailRef = useRef(null);
  const certificationNumberRef = useRef(null);

  const [username, setUsername] = useState("");
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

  const [isIdCheck, setIdCheck] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [isCertificationCheck, setCertificationCheck] = useState(false);

  const signUpButtonClass =
    username && password && passwordCheck && email && certification
      ? "primary-button-large"
      : "disable-button-large";

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

  const navigate = useNavigate();

  /* ID 관련 시작 */
  const onIdChangeHandler = (event) => {
    const { value } = event.target;
    setUsername(value);
    setIdMessage("");
    setIdCheck(false);
  };

  /* ID 중복확인 버튼 눌렀을 때 이벤트 */
  const onIdButtonClickHandler = () => {
    if (!username) return;
    const requestBody = { username };
    idCheckRequest(requestBody).then(idCheckResponse);
  };

  const idCheckResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("모든 값을 입력하세요.");
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage("이미 사용중인 아이디 입니다.");
      setIdCheck(false);
    }

    if (code !== ResponseCode.SUCCESS) return;

    setIdError(false);
    setIdMessage("사용 가능한 아이디 입니다.");
    setIdCheck(true);
  };

  const onIdKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onIdButtonClickHandler();
  };
  /* ID 관련 끝 */

  /* PW 관련 시작 */
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

  const onPasswordButtonClickHandler = () => {};

  const onPasswordCheckButtonClickHandler = () => {};

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
  /* PW 관련 끝 */

  const onSnsSignInButtonClickHandler = () => {};

  /* Mail 관련 시작 */
  /* 이메일 전송 관련 */
  const onEmailChangeHandler = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage("");
  };

  /* 이메일 인증 버튼 */
  const onEmailButtonClickHandler = () => {
    /* 아이디와 이메일을 입력하지 않은채 이메일 인증을 누르면 실행안되도록 하기 위함 */
    if (!username || !email) return;
    /* 올바른 이메일 형식인지 패턴 확인 */
    const checkedEmail = emailPattern.test(email);
    if (!checkedEmail) {
      setEmailError(true);
      setEmailMessage("이메일 형식이 아닙니다.");
      return;
    }

    const requestBody = { username, email };
    sendMailRequest(requestBody).then(sendMailResponse);

    setEmailError(false);
    setEmailMessage("이메일 전송중...");
  };

  const sendMailResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("아이디와 이메일을 모두 입력하세요. ");
    }
    if (code === ResponseCode.DATABASE_ERROR) alert("데이터베이스 오류입니다.");
    if (code !== ResponseCode.SUCCESS) return;

    setEmailError(false);
    setEmailMessage("인증번호가 전송되었습니다.");
    setEmailCheck(true);
  };

  /* 인증 확인 관련 */
  const onCertificationNumberChangeHandler = (event) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage("");
  };

  /* 인증 확인 버튼 */
  const onCertificationNumberButtonClickHandler = () => {
    if (!username || !email || !certification) return;
    const requestBody = { username, email, certification };
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
  };

  const checkCertificationResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage("인증번호가 일치하지 않습니다.");
      setCertificationCheck(false);
    }

    if (code !== ResponseCode.SUCCESS) return;

    setCertificationNumberError(false);
    setCertificationNumberMessage("인증번호가 확인되었습니다.");
    setCertificationCheck(true);
  };

  /* 이메일 InputBox에서 엔터치면 이메일 인증 버튼 실행 */
  const onEmailKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onEmailButtonClickHandler();
  };

  /* 인증번호 InputBox에서 엔터치면 인증 확인 버튼 실행 */
  const onCertificationKeyDownHandler = (event) => {
    if (event.key !== "Enter") return;
    onCertificationNumberButtonClickHandler();
  };
  /* Mail 관련 끝 */

  /* 회원가입 관련 시작 */
  const onSignUpButtonClickHandler = () => {
    if (!username || !email || !certification || !password || !passwordCheck)
      return;
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
  };

  const signUpResponse = (responseBody) => {
    if (!responseBody) return;
    const { code } = responseBody;

    navigate("/auth/sign-in");
  };
  /* 회원가입 관련 끝 */

  /* 로그인 버튼 이벤트 시작 */
  const onSignInButtonClickHandler = () => {
    navigate("/signIn");
  };
  /* 로그인 버튼 이벤트 끝 */

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
                value={username}
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
