import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { BsFullscreen } from "react-icons/bs";
import { BsFullscreenExit } from "react-icons/bs";
import { BsFillSkipStartFill } from "react-icons/bs";
import { BsFillSkipEndFill } from "react-icons/bs";
import Slider from "@mui/material/Slider";

const VideoPlayerPage = () => {
  const { video } = useParams();
  const videoPlayer = useRef(null);
  const videoPlayerContainer = useRef(null);

  let [isPaused, setIsPaused] = useState(true);
  let [isPausedAfterSeek, setIsPausedAfterSeek] = useState(true);
  let [isFullscreen, setIsFullscreen] = useState(false);
  let [currentTime, setCurrentTime] = useState(0);
  let [timeLeft, setTimeLeft] = useState(0);
  let [videoDuration, setVideoDuration] = useState(0);
  let [seekTime, setSeekTime] = useState(0);
  let shouldSeekOnMouseUp = false;

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
    setIsPausedAfterSeek(!isPausedAfterSeek);
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

  function handleTimeSliderChange(event) {
    setSeekTime(event.target.value);
    setCurrentTime(event.target.value);
    shouldSeekOnMouseUp = true;
  }

  function handleSeek() {
    if (!shouldSeekOnMouseUp) {
      return;
    }
    videoPlayer.current.currentTime = seekTime;
    if (!isPausedAfterSeek) {
      videoPlayer.current.play();
    }
    shouldSeekOnMouseUp = false;
  }

  function skipForward10s() {
    videoPlayer.current.pause();
    const skip10s = videoPlayer.current.currentTime + 10;
    if (skip10s <= videoDuration) {
      videoPlayer.current.currentTime = skip10s;
      setCurrentTime(skip10s);
    } else {
      videoPlayer.current.currentTime = videoDuration;
      setCurrentTime(videoDuration);
    }
    if (!isPausedAfterSeek) {
      videoPlayer.current.play();
    }
  }

  function skipBackward10s() {
    videoPlayer.current.pause();
    const rewind10s = videoPlayer.current.currentTime - 10;
    if (rewind10s >= 0) {
      videoPlayer.current.currentTime = rewind10s;
      setCurrentTime(rewind10s);
    } else {
      videoPlayer.current.currentTime = 0;
      setCurrentTime(0);
    }
    if (!isPausedAfterSeek) {
      videoPlayer.current.play();
    }
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      className=" flex justify-center items-center"
      onMouseUp={handleSeek}
      ref={videoPlayerContainer}
    >
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
          autoPlay
        >
          <source src={"/api/v1/watch/" + video} type="video/mp4" />
        </video>
        <div className=" w-full absolute bottom-0 flex-col items-center justify-start hidden md:flex ">
          <div className="w-full flex items-center my-4">
            <h1 className="text-white mx-4 select-none">
              {formatDuration(currentTime)}
            </h1>
            <div className="px-4 grow flex items-center">
              <Slider
                value={currentTime}
                min={0}
                max={videoDuration}
                onTouchEnd={handleSeek}
                onMouseUp={handleSeek}
                onTouchStart={() => {
                  videoPlayer.current.pause();
                }}
                onMouseDown={() => {
                  videoPlayer.current.pause();
                }}
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
                <h1 className="text-white text-lg font-bold select-none">10</h1>
              </div>
              <div
                className="mx-4 flex items-center cursor-pointer"
                onClick={skipForward10s}
              >
                <h1 className="text-white text-lg font-bold select-none">10</h1>
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
    </div>
  );
};

export default VideoPlayerPage;
