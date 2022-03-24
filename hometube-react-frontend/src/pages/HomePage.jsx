import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Img from "../components/Img";
import { useQuery } from "react-query";
import axios from "axios";
import UploadModal from "../components/UploadModal";

const HomePage = () => {
  let [showUploadModal, setShowUploadModal] = useState(false);
  let [videos, setVideos] = useState([]);

  function onSuccess(data) {
    setVideos(data.data.videos);
  }

  const { refetch } = useQuery(
    "home-page-videos",
    () => {
      return axios.get("/api/v1/videos", { withCredentials: true });
    },
    { onSuccess: onSuccess }
  );

  function handleUploadModalClose() {
    setShowUploadModal(false);
  }

  function handleUploadModalComplete() {
    setShowUploadModal(false);
    refetch();
  }

  function handleUploadClick() {
    setShowUploadModal(true);
  }

  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      className=" flex flex-col"
    >
      <Navbar avatar searchBar upload handleUploadClick={handleUploadClick} />
      {showUploadModal ? (
        <UploadModal
          onClose={handleUploadModalClose}
          onComplete={handleUploadModalComplete}
        />
      ) : null}

      <div className="p-4 grow flex justify-start flex-wrap text-white">
        {videos.map((video) => {
          return (
            <div className="w-full md:w-4/12 lg:w-3/12">
              <Card bg="bg-zinc-800" className="m-2">
                <Img
                  className="w-full"
                  src={"/api/v1/thumbnails/" + video.thumbnail}
                  alt={video.title}
                  name={video.thumbnail}
                />
                <h1 className="text-white text-xl font-semibold">
                  {video.title}
                </h1>
                <p className="text-gray-400 text-sm">{video.author}</p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
