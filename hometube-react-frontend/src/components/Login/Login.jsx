import React from "react";
import LoginCard from "./LoginCard";

const Login = (props) => {
  const { setErrorMsg } = props;

  return (
    <div className="w-11/12 md:w-5/12 lg:w-3/12">
      <LoginCard setErrorMsg={setErrorMsg} />
    </div>
  );
};

export default Login;
