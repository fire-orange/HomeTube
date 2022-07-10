import React from 'react'
import Card from "./Card";
import { IoIosClose } from "react-icons/io";
import Avatar from "avataaars";
import Button from './Button';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UserModal = (props) => {

    const { onClose } = props;
    const avatarConfig = JSON.parse(localStorage.getItem("avatar"));
    const username = localStorage.getItem("username");

    let navigate = useNavigate();

    function handleLogout() {
        axios
          .post("/logout")
          .then(function (response) {
            console.log(response.data.message);
            localStorage.clear();
            navigate(response.data.redirectUrl);
          })
          .catch(function (err) {
            console.log(err.response.data.message);
          });
      }

  return (
    <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex h-screen w-screen justify-center items-center bg-transparent">
      <div className="w-11/12 md:w-5/12 lg:w-3/12">
        <Card bg="bg-zinc-800">
          <div className="flex justify-end">
            <IoIosClose
              className="text-white h-10 w-10 cursor-pointer"
              onClick={onClose}
            />
            </div>
            {avatarConfig ? (
            <div className="cursor-pointer">
              <Avatar
                className="w-12 h-12"
                avatarStyle="Circle"
                topType={avatarConfig.topType}
                accessoriesType={avatarConfig.accessoriesType}
                hairColor={avatarConfig.hairColor}
                facialHairType={avatarConfig.facialHairType}
                facialHairColor={avatarConfig.facialHairColor}
                clotheType={avatarConfig.clotheType}
                clotheColor={avatarConfig.clotheColor}
                eyeType={avatarConfig.eyeType}
                eyebrowType={avatarConfig.eyebrowType}
                mouthType={avatarConfig.mouthType}
                skinColor={avatarConfig.skinColor}
              />
            </div>
          ) : (
            <div
              className="bg-orange-500 rounded-full w-11 h-11 cursor-pointer"
            ></div>
          )}
            <h1 className="mt-2 mb-12 font-bold text-3xl text-white">FireOrange</h1>
            <Button className="w-full mb-4 bg-white text-orange-500  border-orange-500 hover:border-2 hover:bg-white" >Profile</Button>
            <Button className="w-full bg-white text-orange-500 border-orange-500 hover:border-2 hover:bg-white" onClick={handleLogout} >Log Out</Button>
        </Card>
      </div>
    </div>
  )
}

export default UserModal