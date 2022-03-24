import React from "react";
import { useState, useEffect } from "react";
import Button from "./Button";
import Avatar from "avataaars";
import AvatarCreatorCard from "../components/AvatarCreatorCard";
import { generateRandomAvatarOptions } from "./AvatarOptions";

const AvatarCreator = (props) => {
  let [avatar, setAvatar] = useState({
    topType: "ShortHairDreads01",
    accessoriesType: "Wayfarers",
    hairColor: "PastelPink",
    facialHairType: "Blank",
    facialHairColor: "Black",
    clotheType: "ShirtCrewNeck",
    clotheColor: "Gray02",
    eyeType: "Surprised",
    eyebrowType: "RaisedExcited",
    mouthType: "Smile",
    skinColor: "Tanned",
  });

  const { onDone, className } = props;

  useEffect(() => {
    setAvatar(generateRandomAvatarOptions());
  }, []);

  return (
    <div
      className={className + " flex flex-col md:flex-row items-center p-4 grow"}
    >
      <div className="flex flex-col justify-center items-center w-full md:w-6/12">
        <Avatar
          className="mb-4"
          avatarStyle="Circle"
          topType={avatar.topType}
          accessoriesType={avatar.accessoriesType}
          hairColor={avatar.hairColor}
          facialHairType={avatar.facialHairType}
          facialHairColor={avatar.facialHairColor}
          clotheType={avatar.clotheType}
          clotheColor={avatar.clotheColor}
          eyeType={avatar.eyeType}
          eyebrowType={avatar.eyebrowType}
          mouthType={avatar.mouthType}
          skinColor={avatar.skinColor}
        />
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => {
            setAvatar(generateRandomAvatarOptions());
          }}
        >
          Random
        </Button>
      </div>
      <div className="flex justify-center w-full md:w-6/12">
        <AvatarCreatorCard
          avatar={[avatar, setAvatar]}
          onDone={() => {
            onDone(avatar);
          }}
        />
      </div>
    </div>
  );
};

export default AvatarCreator;
