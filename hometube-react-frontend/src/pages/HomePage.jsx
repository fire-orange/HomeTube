import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Img from "../components/Img";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadModal from "../components/UploadModal";

const HomePage = () => {
  let [showUploadModal, setShowUploadModal] = useState(false);
  let [videos, setVideos] = useState([]);

  let navigate = useNavigate();

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

  function videoCardClicked(video) {
    navigate("/watch/" + video.fileName);
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      className=" flex flex-col"
    >
      <Navbar avatar searchBar upload handleUploadClick={handleUploadClick} />
      {showUploadModal ? (
        <UploadModal
          onClose={handleUploadModalClose}
          onDone={handleUploadModalComplete}
        />
      ) : null}

      <div className="p-4 grow flex justify-start flex-wrap text-white">
        {videos.map((video) => {
          return (
            <div className="w-full md:w-4/12 lg:w-3/12">
              <Card
                bg="bg-zinc-800"
                className="m-2 cursor-pointer"
                onClick={() => {
                  videoCardClicked(video);
                }}
              >
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
