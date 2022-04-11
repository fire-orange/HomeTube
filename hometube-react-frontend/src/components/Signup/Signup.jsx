import React, { useState } from "react";
import SignupCard from "./SignupCard";
import AvatarCreator from "../AvatarCreator/AvatarCreator";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const { setErrorMsg } = props;

  let navigate = useNavigate();

  let [showAvatarCreator, setShowAvatarCreator] = useState(false);
  let [signupDetails, setSignupDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

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

  function handleSignupComplete(avatar) {
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
        const { redirectUrl, username, name, avatar } = res.data;
        if (res.status === 201) {
          localStorage.setItem("avatar", avatar);
          localStorage.setItem("name", name);
          localStorage.setItem("username", username);
          navigate(redirectUrl);
        }
      })
      .catch((err) => {
        const { message } = err.response.data;
        setErrorMsg(message);
        localStorage.clear();
      });
  }

  return (
    <>
      {showAvatarCreator ? (
        <AvatarCreator onDone={handleSignupComplete} />
      ) : (
        <div className="w-11/12 md:w-5/12 lg:w-3/12">
          <SignupCard
            onDone={handleSignupDetails}
            signupDetails={signupDetails}
            setSignupDetails={setSignupDetails}
            setErrorMsg={setErrorMsg}
          />
        </div>
      )}
    </>
  );
};

export default Signup;
