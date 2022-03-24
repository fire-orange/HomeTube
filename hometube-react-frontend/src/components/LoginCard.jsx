import React from "react";
import Card from "../components/Card";
import Textfield from "../components/Textfield";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LoginCard = (props) => {
  const { onDone, loginDetails, setLoginDetails, setErrorMsg } = props;
  let navigate = useNavigate();

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
      <Button className="w-full mb-8" onClick={onDone}>
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
