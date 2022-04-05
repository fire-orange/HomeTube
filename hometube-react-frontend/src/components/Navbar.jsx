import React from "react";
import Avatar from "avataaars";
import Textfield from "./Textfield";
import Button from "./Button";
import {FaUpload} from "react-icons/fa"

const Navbar = (props) => {
  const { avatar, searchBar, upload, handleUploadClick } = props;
  const avatarConfig = JSON.parse(localStorage.getItem("avatar"));

  return (
    <div className="flex items-center bg-zinc-800 p-1 md:p-4">
      <h1 className=" text-white font-bold text-2xl grow">
        HomeTube
      </h1>
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
          {upload ? <div className="flex mr-4 cursor-pointer" onClick={handleUploadClick}><FaUpload className="text-white h-6 w-6 mx-1" /><p className="text-white text-md mx-1">Upload</p></div> : null}
          {avatarConfig ? (
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
          ) : (
            <div className="bg-orange-500 rounded-full w-11 h-11"></div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
