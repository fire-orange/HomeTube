import React, {useRef, useEffect} from "react";
import { useParams } from "react-router-dom";

const VideoPlayerPage = () => {
  const { video } = useParams();

  const videoPlayer = useRef(null);

useEffect(() => {
  videoPlayer.current.play();
}, [])

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      className=" flex justify-center items-center"
    >
      <div
        className="grow flex justify-center items-center"
        style={{ maxHeight: "100vh", width: "100%", maxWidth: "100vw" }}
      >
        <video ref={videoPlayer} style={{ maxHeight: "100vh" }} controls>
          <source src={"/api/v1/watch/" + video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
