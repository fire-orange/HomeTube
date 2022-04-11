import React, { useState } from "react";
import Card from "../Card";
import Textfield from "../Textfield";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginCard = (props) => {
  const { setErrorMsg } = props;
  let navigate = useNavigate();
  let [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  function handleLogin() {
    if (loginDetails.username === "") {
      setErrorMsg("Please enter a username");
      return;
    }

    if (loginDetails.password === "") {
      setErrorMsg("Please enter a password");
      return;
    }

    axios
      .post("/login", loginDetails, { withCredentials: true })
      .then((res) => {
        const { username, name, avatar, redirectUrl } = res.data;
        if (res.status === 200) {
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
    <Card bg="bg-zinc-800">
      <h1 className="mb-12 font-bold text-3xl text-white">Log In</h1>
      <Textfield
        large
        halo
        placeHolder="Username"
        className="w-full mb-4"
        value={loginDetails.username}
        onChange={(event) =>
          setLoginDetails({
            ...loginDetails,
            username: event.target.value,
          })
        }
      />
      <Textfield
        large
        halo
        censor
        placeHolder="Password"
        className="w-full mb-4"
        value={loginDetails.password}
        onChange={(event) =>
          setLoginDetails({
            ...loginDetails,
            password: event.target.value,
          })
        }
      />
      <Button className="w-full mb-8" onClick={handleLogin}>
        Log In
      </Button>
      <div className="border-b-2 border-orange-500 w-2/6 mx-auto mb-8"></div>
      <h1 className="text-md text-white mb-2">Don't have an account?</h1>
      <div className="flex w-full justify-start">
        <Button
          className="w-full"
          onClick={() => {
            setErrorMsg(null);
            navigate("/signup");
          }}
        >
          Create New Account
        </Button>
      </div>
    </Card>
  );
};

export default LoginCard;
