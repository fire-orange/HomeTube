import React from "react";
import Textfield from "./Textfield";
import Button from "./Button";

const Navbar = () => {
  return (
    <div className="flex p-4 bg-zinc-800">
      <h1 className=" text-white font-bold text-2xl grow">HomeTube</h1>
      <div className="flex grow">
        <Textfield
          placeHolder="Search"
          className=" text-white bg-black w-full rounded-r-none "
        />
        <Button className="rounded-l-none">Search</Button>
      </div>
      <div className="flex grow justify-end">
        <div className="bg-orange-500 rounded-full w-10 h-10"></div>
      </div>
    </div>
  );
};

export default Navbar;
