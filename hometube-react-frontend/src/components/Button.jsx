import React from "react";

const Button = (props) => {
  const { className, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={
        className +
        " bg-orange-500 hover:bg-orange-600 rounded-md h-10 px-2 py-1 text-white font-semibold "
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
