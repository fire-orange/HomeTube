import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";

const AuthPage = (props) => {
  const { signup } = props;
  let [errorMsg, setErrorMsg] = useState(null);

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      className=" flex flex-col"
    >
      <Navbar />
      {errorMsg ? (
        <div className="text-white text-lg text-center font-semibold rounded-md bg-red-400 bg-warning ring ring-red-600 p-2 m-4 w-11/12 md:w-5/12 lg:w-3/12 mx-auto">
          {errorMsg}
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row justify-center items-center md:p-4 grow">
        {signup ? <Signup setErrorMsg={setErrorMsg} /> : <Login setErrorMsg={setErrorMsg} />}
      </div>
    </div>
  );
};

export default AuthPage;
