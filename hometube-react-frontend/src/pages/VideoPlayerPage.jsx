import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { BsFullscreen } from "react-icons/bs";
import { BsFullscreenExit } from "react-icons/bs";
import { BsFillSkipStartFill } from "react-icons/bs";
import { BsFillSkipEndFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VideoPlayerPage = () => {
  const { video } = useParams();
  const videoPlayer = useRef(null);
  const videoPlayerContainer = useRef(null);
  let navigate = useNavigate();

  let [videoDetails, setVideoDetails] = useState();
  let [isPaused, setIsPaused] = useState(false);
  let [isPausedAfterSeek, setIsPausedAfterSeek] = useState(false);
  let [isFullscreen, setIsFullscreen] = useState(false);
  let [currentTime, setCurrentTime] = useState(0);
  let [timeLeft, setTimeLeft] = useState(0);
  let [videoDuration, setVideoDuration] = useState(0);
  let [isVideoLoading, setIsVideoLoading] = useState(false);
  let [showControls, setShowControls] = useState(true);
  let [controlsTimeoutId, setControlsTimeoutId] = useState();

  useEffect(() => {
    axios.get("/api/v1/videos/" + video).then(function (response) {
      setVideoDetails(response.data.video);
    });
  }, []);

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds - minutes * 60);
    const hours = Math.floor(minutes / 60);
    const minutesLeft = minutes - hours * 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft
    }:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
  }

  function playPauseVideo() {
    if (isPaused) {
      videoPlayer.current.play();
    } else {
      videoPlayer.current.pause();
    }
    setIsPausedAfterSeek(isPaused);
  }

  function openCloseFullscreen() {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (videoPlayerContainer.current.requestFullscreen) {
        videoPlayerContainer.current.requestFullscreen();
      } else if (videoPlayerContainer.current.webkitRequestFullscreen) {
        videoPlayerContainer.current.webkitRequestFullscreen();
      } else if (videoPlayerContainer.current.msRequestFullscreen) {
        videoPlayerContainer.current.msRequestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }

  function onLoadedMetadata() {
    setVideoDuration(videoPlayer.current.duration);
  }

  function handleVideoLoadStart() {
    setIsVideoLoading(true);
  }

  function handleCanPlayVideo() {
    setIsVideoLoading(false);
  }

  function updateProgress() {
    const { currentTime } = videoPlayer.current;
    setCurrentTime(currentTime);
    setTimeLeft(videoDuration - currentTime);
  }

  function handleVideoPlay() {
    setIsPaused(false);
  }

  function handleVideoPause() {
    setIsPaused(true);
  }

  function handleVideoEnded() {
    videoPlayer.current.currentTime = 0;
  }

  function handleSeek(seekTime) {
    videoPlayer.current.currentTime = seekTime;
    if (!isPausedAfterSeek) {
      videoPlayer.current.play();
    }
  }

  function handleTimeSliderChange(event) {
    videoPlayer.current.pause();
    setCurrentTime(event.target.value);
    handleSeek(event.target.value);
  }

  function skipForward10s() {
    videoPlayer.current.pause();
    const skip10s = videoPlayer.current.currentTime + 10;
    if (skip10s <= videoDuration) {
      handleSeek(skip10s);
    } else {
      handleSeek(videoDuration);
    }
  }

  function skipBackward10s() {
    videoPlayer.current.pause();
    const rewind10s = videoPlayer.current.currentTime - 10;
    if (rewind10s >= 0) {
      handleSeek(rewind10s);
    } else {
      handleSeek(0);
    }
  }

  function goBack() {
    navigate(-1);
  }

  function handleHideControls() {
    setShowControls(true);
    clearTimeout(controlsTimeoutId);
    setControlsTimeoutId(
      setTimeout(() => {
        setShowControls(false);
      }, 5000)
    );
  }

  function handleShowControls() {
    setShowControls(true);
    clearTimeout(controlsTimeoutId);
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      className={
        " flex justify-center items-center " +
        (showControls ? "" : "cursor-none")
      }
      onMouseLeave={handleHideControls}
      ref={videoPlayerContainer}
    >
      {isVideoLoading ? (
        <CircularProgress
          sx={{
            color: "#f97316",
          }}
          size={52}
          className="fixed"
        />
      ) : null}
      <div className="canvas fixed flex flex-col z-10 h-full w-full">
        <div
          className={
            "flex justify-start items-center " + (showControls ? "" : "hidden")
          }
          onMouseMove={handleHideControls}
        >
          <FaArrowLeft
            size={36}
            color="white"
            className="cursor-pointer m-4"
            onClick={goBack}
          />
          {videoDetails ? (
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-white text-3xl font-bold">
                {videoDetails.title}
              </h1>
              <h1 className="text-gray-300 text-md font-semibold">
                {videoDetails.author}
              </h1>
            </div>
          ) : null}
        </div>
        <div className="grow" onMouseMove={handleHideControls}></div>
        <div
          className={
            "controls w-full flex-col items-center justify-start flex " +
            (showControls ? "" : "hidden")
          }
          onMouseOver={handleShowControls}
        >
          <div className="w-full flex items-center my-4">
            <h1 className="text-white mx-4 select-none">
              {formatDuration(currentTime)}
            </h1>
            <div className="px-4 grow flex items-center">
              <Slider
                value={currentTime}
                min={0}
                max={videoDuration}
                onChange={handleTimeSliderChange}
                sx={{
                  color: "#f97316",
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "& .MuiSlider-thumb": {
                    width: 24,
                    height: 24,
                    backgroundColor: "#fff",
                    "&:before": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                    },
                    "&:hover, &.Mui-focusVisible, &.Mui-active": {
                      boxShadow: "none",
                    },
                  },
                }}
              />
            </div>
            <h1 className="text-white mx-4 select-none">
              -{formatDuration(timeLeft)}
            </h1>
          </div>
          <div className="w-full flex justify-between items-center mt-4 mb-8">
            <div className="flex items-center">
              {isPaused ? (
                <FaPlay
                  size={28}
                  color="white"
                  className="mx-4 cursor-pointer"
                  onClick={playPauseVideo}
                />
              ) : (
                <FaPause
                  size={28}
                  color="white"
                  className="mx-4 cursor-pointer"
                  onClick={playPauseVideo}
                />
              )}
              <div
                className="mx-4 flex items-center cursor-pointer"
                onClick={skipBackward10s}
              >
                <BsFillSkipStartFill size={36} color="white" />
                <h1 className="text-white text-lg font-bold ">10</h1>
              </div>
              <div
                className="mx-4 flex items-center cursor-pointer"
                onClick={skipForward10s}
              >
                <h1 className="text-white text-lg font-bold ">10</h1>
                <BsFillSkipEndFill size={36} color="white" />
              </div>
            </div>
            <div>
              {isFullscreen ? (
                <BsFullscreenExit
                  size={28}
                  color="white"
                  className="mx-4 cursor-pointer"
                  onClick={openCloseFullscreen}
                />
              ) : (
                <BsFullscreen
                  size={28}
                  color="white"
                  className="mx-4 cursor-pointer"
                  onClick={openCloseFullscreen}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="grow flex justify-center items-center"
        style={{ maxHeight: "100vh", width: "100%", maxWidth: "100vw" }}
      >
        <video
          className="w-full "
          ref={videoPlayer}
          style={{ maxHeight: "100vh" }}
          onTimeUpdate={updateProgress}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onStalled={handleVideoLoadStart}
          onPlaying={handleCanPlayVideo}
          onCanPlay={handleCanPlayVideo}
          autoPlay
        >
          <source src={"/api/v1/watch/" + video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
