import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="auth/oauth-response/:token/:expirationTime"
          element={<OAuth />}
        ></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/signIn" element={<SignIn />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
