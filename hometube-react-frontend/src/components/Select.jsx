import React from "react";

const Select = (props) => {
  const { id, className, large, halo, value, onChange } = props;

  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={
        className +
        " rounded-md " +
        (large ? "px-4 py-2" : "px-2 py-1") +
        " border-gray-400 border-2 hover:outline-none hover:border-orange-500 focus:outline-none focus:border-orange-500 " +
        (halo ? " focus:ring focus:ring-orange-500" : null)
      }
    >
      {props.children}
    </select>
  );
};

export default Select;
