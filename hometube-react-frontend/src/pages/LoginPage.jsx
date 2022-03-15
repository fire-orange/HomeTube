import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Textfield from "../components/Textfield";
import Button from "../components/Button";

const LoginPage = () => {
  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      className=" flex flex-col"
    >
      <Navbar />
      <div className="flex justify-center items-center p-4 grow">
        <div className="w-11/12 md:w-4/12 lg:w-3/12">
          <Card bg="bg-zinc-800">
            <h1 className="mb-12 font-bold text-3xl text-white">Log In</h1>
            <Textfield
              large={true}
              placeHolder="Username"
              className="w-full mb-4"
            />
            <Textfield
              large={true}
              censor={true}
              placeHolder="Password"
              className="w-full mb-4"
            />
            <Button className="w-full mb-8">Log In</Button>
            <div className="border-b-2 border-orange-500 w-2/6 mx-auto mb-8"></div>
            <h1 className="text-md text-white mb-2">Don't have an account?</h1>
            <div className="flex w-full justify-start">
              <Button className="w-full">Create New Account</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
