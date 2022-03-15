import React from "react";

const Button = (props) => {
  const { className } = props;

  return (
    <button
      className={
        "bg-orange-500 hover:bg-orange-600 rounded-md h-10 px-2 py-1 text-white font-semibold " +
        className
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
