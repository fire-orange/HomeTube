import React from "react";
import { useState } from "react";
import Avatar from "avataaars";
import Textfield from "./Textfield";
import Button from "./Button";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal";
import UploadModal from "../components/UploadModal";

const Navbar = (props) => {
  const { avatar, searchBar, upload, refetch} = props;
  let [showUserModal, setShowUserModal] = useState(false);
  let [showUploadModal, setShowUploadModal] = useState(false);
  const avatarConfig = JSON.parse(localStorage.getItem("avatar"));

  let navigate = useNavigate();

  function handleAvatarClicked() {
    setShowUserModal(true);
  }

  function handleUserModalClosed() {
    setShowUserModal(false);
  }

  function handleUploadModalClose() {
    setShowUploadModal(false);
  }

  function handleUploadModalComplete() {
    setShowUploadModal(false);
    refetch();
  }

  function handleUploadClick() {
    setShowUploadModal(true);
  }

  return (
    <div className="flex items-center bg-zinc-800 p-1 md:p-4 max-h-20">
      {showUserModal ? <UserModal onClose={handleUserModalClosed}/> : null}
      {showUploadModal ? (
        <UploadModal
          onClose={handleUploadModalClose}
          onDone={handleUploadModalComplete}
        />
      ) : null}
      <h1 className=" text-white font-bold text-2xl grow">HomeTube</h1>
      {searchBar ? (
        <div className="flex invisible md:visible md:grow">
          <Textfield
            placeHolder="Search"
            className=" text-white bg-black w-full rounded-r-none"
          />
          <Button className="rounded-l-none">Search</Button>
        </div>
      ) : null}
      {avatar ? (
        <div className="flex grow justify-end items-center">
          {upload ? (
            <div
              className="flex mr-4 cursor-pointer"
              onClick={handleUploadClick}
            >
              <FaUpload className="text-white h-6 w-6 mx-1" />
              <p className="text-white text-md mx-1">Upload</p>
            </div>
          ) : null}
          {avatarConfig ? (
            <div className="cursor-pointer" onClick={handleAvatarClicked}>
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
              onClick={handleAvatarClicked}
            ></div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
