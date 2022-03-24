import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import AvatarCreator from "../components/AvatarCreator";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = (props) => {
  const { signup } = props;
  let [showAvatarCreator, setShowAvatarCreator] = useState(false);
  let [errorMsg, setErrorMsg] = useState(null);
  let [signupDetails, setSignupDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  let [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  let navigate = useNavigate();

  function handleLogin() {
    axios
      .post("/login", loginDetails, { withCredentials: true })
      .then((res) => {
        const { success, msg, redirectUrl, username, name, avatar } = res.data;
        if (success) {
          localStorage.setItem("avatar", avatar);
          localStorage.setItem("name", name);
          localStorage.setItem("username", username);
          navigate(redirectUrl);
        } else {
          setErrorMsg(msg);
          localStorage.clear();
        }
      });
  }

  function handleSignupDetails() {
    if (signupDetails.firstName === "") {
      setErrorMsg("First name can't be empty.");
      return;
    }
    if (signupDetails.lastName === "") {
      setErrorMsg("Last name can't be empty.");
      return;
    }
    if (signupDetails.username === "") {
      setErrorMsg("Username can't be empty.");
      return;
    }
    if (signupDetails.username.includes(" ")) {
      setErrorMsg("Username can't contain whitespaces.");
      return;
    }
    if (signupDetails.password === "") {
      setErrorMsg("Password can't be empty.");
      return;
    }
    if (signupDetails.password.length < 4) {
      setErrorMsg("Password can't be less than 4 characters.");
      return;
    }
    if (signupDetails.password.includes(" ")) {
      setErrorMsg("Password can't contain whitespaces.");
      return;
    }
    setErrorMsg(null);
    setShowAvatarCreator(true);
  }

  function handleAvatar(avatar) {
    axios
      .post(
        "/signup",
        {
          avatar: avatar,
          ...signupDetails,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const { success, msg, redirectUrl, username, name, avatar } = res.data;
        if (success) {
          localStorage.setItem("avatar", avatar);
          localStorage.setItem("name", name);
          localStorage.setItem("username", username);
          navigate(redirectUrl);
        } else {
          setErrorMsg(msg);
          localStorage.clear();
        }
      });
  }

  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      className=" flex flex-col"
    >
      <Navbar />
      {errorMsg ? (
        <div className="text-white text-lg text-center font-semibold rounded-md bg-red-400 bg-warning ring ring-red-600 p-2 m-4 w-11/12 md:w-5/12 lg:w-3/12 mx-auto">
          {errorMsg}
        </div>
      ) : null}
      {showAvatarCreator ? (
        <AvatarCreator onDone={handleAvatar} />
      ) : (
        <div className="flex justify-center items-center p-4 grow">
          <div className="w-11/12 md:w-5/12 lg:w-3/12">
            {signup ? (
              <SignupCard
                onDone={handleSignupDetails}
                signupDetails={signupDetails}
                setSignupDetails={setSignupDetails}
                setErrorMsg={setErrorMsg}
              />
            ) : (
              <LoginCard
                onDone={handleLogin}
                loginDetails={loginDetails}
                setLoginDetails={setLoginDetails}
                setErrorMsg={setErrorMsg}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
