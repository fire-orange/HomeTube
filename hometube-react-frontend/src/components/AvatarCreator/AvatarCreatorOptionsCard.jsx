import React from "react";
import avatarOptions from "./AvatarOptions";
import Card from "../Card";
import Select from "../Select";
import Button from "../Button";

const AvatarCreatorOptionsCard = (props) => {
  const avatarOptionKeys = Object.keys(avatarOptions);
  const [avatar, setAvatar] = props.avatar;
  const { onDone } = props;

  const updateAvatarFromSelect = (event, avatarOptionKey) => {
    const value = event.target.value;
    setAvatar({ ...avatar, [avatarOptionKey]: value });
  };

  return (
    <Card bg="bg-zinc-800" className="w-11/12 md:w-9/12">
      {avatarOptionKeys.map((avatarOptionKey) => {
        return (
          <div className="flex mb-3">
            <div className="w-2/6">
              <label className="text-white">
                {avatarOptionKey[0].toUpperCase() +
                  avatarOptionKey
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .substring(1)}
              </label>
            </div>
            <div className="w-4/6">
              <Select
                halo
                onChange={(event) => {
                  updateAvatarFromSelect(event, avatarOptionKey);
                }}
                className="w-full"
                value={avatar[avatarOptionKey]}
              >
                {avatarOptions[avatarOptionKey].map((option) => {
                  return (
                    <option value={option}>
                      {option.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center">
        <Button className="w-4/6" onClick={onDone}>
          Done
        </Button>
      </div>
    </Card>
  );
};

export default AvatarCreatorOptionsCard;
