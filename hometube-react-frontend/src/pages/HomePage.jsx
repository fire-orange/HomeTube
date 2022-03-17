import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      className=" flex flex-col"
    >
      <Navbar />
    </div>
  );
};

export default HomePage;
