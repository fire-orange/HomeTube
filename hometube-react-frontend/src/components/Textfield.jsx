import React from "react";

const Textfield = (props) => {
  const { censor, placeHolder, className, large, halo } = props;

  return (
    <input
      type={censor ? "password" : "text"}
      placeholder={placeHolder}
      className={
        className +
        " rounded-md " +
        (large ? "px-4 py-2" : "px-2 py-1") +
        " border-gray-400 border-2 focus:outline-none focus:border-orange-500 " +
        (halo ? " focus:ring focus:ring-orange-500 focus:ring-1" : null)
      }
    />
  );
};

export default Textfield;
