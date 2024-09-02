import { Cookies } from "react-cookie";

const cookies = new Cookies();

/* 쿠키에 값을 저장할때 사용 */
export const setCookie = (name, value) => {
  return cookies.set(name, value);
};

/* 쿠키에 있는 값을 꺼낼때 사용 */
export const getCookie = (name) => {
  return cookies.get(name);
};

/* 쿠키를 지울때 사용 */
export const removeCookie = (name) => {
  return cookies.remove(name);
};
