import React from "react";
import Card from "../Card";
import Textfield from "../Textfield";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const SignupCard = (props) => {
  const {
    onDone,
    className,
    signupDetails,
    setSignupDetails,
    setErrorMsg,
  } = props;
  let navigate = useNavigate();

  return (
    <Card bg="bg-zinc-800" className={className}>
      <h1 className="mb-12 font-bold text-3xl text-white">Sign Up</h1>
      <div className="flex justify-between">
        <Textfield
          large
          halo
          placeHolder="First Name"
          className="w-49% mb-4"
          value={signupDetails.firstName}
          onChange={(event) =>
            setSignupDetails({
              ...signupDetails,
              firstName: event.target.value,
            })
          }
        />
        <Textfield
          large
          halo
          placeHolder="Last Name"
          className="w-49% mb-4"
          value={signupDetails.lastName}
          onChange={(event) =>
            setSignupDetails({
              ...signupDetails,
              lastName: event.target.value,
            })
          }
        />
      </div>
      <Textfield
        large
        halo
        placeHolder="Username"
        className="w-full mb-4"
        value={signupDetails.username}
        onChange={(event) =>
          setSignupDetails({
            ...signupDetails,
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
        value={signupDetails.password}
        onChange={(event) =>
          setSignupDetails({
            ...signupDetails,
            password: event.target.value,
          })
        }
      />
      <Button className="w-full mb-8" onClick={onDone}>
        Next
      </Button>
      <div className="border-b-2 border-orange-500 w-2/6 mx-auto mb-8"></div>
      <h1 className="text-md text-white mb-2">Already have an account?</h1>
      <div className="flex w-full justify-start">
        <Button
          className="w-full"
          onClick={() => {
            setErrorMsg(null);
            navigate("/login");
          }}
        >
          Log In
        </Button>
      </div>
    </Card>
  );
};

export default SignupCard;
