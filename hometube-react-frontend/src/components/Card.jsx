import React from "react";

const Card = (props) => {
  const { bg, shadowColor, className } = props;

  return (
    <div
      className={
        "rounded-md shadow-lg p-4 " + bg + " " + shadowColor + " " + className
      }
    >
      {props.children}
    </div>
  );
};

export default Card;
