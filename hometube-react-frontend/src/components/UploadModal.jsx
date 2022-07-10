import React, { useState } from "react";
import Card from "./Card";
import Textfield from "./Textfield";
import Button from "./Button";
import axios from "axios";
import { IoIosClose } from "react-icons/io";

const UploadModal = (props) => {
  const { onDone, onClose } = props;

  let [title, setTitle] = useState("");
  let [progress, setProgress] = useState(0);
  let [errorMsg, setErrorMsg] = useState(null);
  let [file, setFile] = useState(null);

  function loadFile({ target: { files } }) {
    setFile(files[0]);
  }

  function updateUploadProgress(uploadProgressEvent) {
    const { loaded, total } = uploadProgressEvent;
    setProgress(Math.floor((loaded * 100) / total));
  }

  function upload() {
    if (title === "") {
      setErrorMsg("Title cannot be empty.");
      return;
    }

    if (!file) {
      setErrorMsg("File cannot be empty.");
      return;
    }

    let data = new FormData();
    data.append("video", file);
    data.append("title", title);
    data.append("author", localStorage.getItem("username"));

    axios
      .post("api/v1/upload", data, {
        withCredentials: true,
        onUploadProgress: updateUploadProgress,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          onDone();
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Upload failed.");
        setProgress(0);
      });
  }

  return (
    <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex h-screen w-screen justify-center items-center bg-transparent">
      <div className="w-11/12 md:w-5/12 lg:w-3/12">
        <Card bg="bg-zinc-800">
          <div className="flex justify-end">
            <IoIosClose
              className="text-white h-10 w-10 cursor-pointer"
              onClick={onClose}
            />
          </div>
          {errorMsg ? (
            <div className="text-white text-lg text-center font-semibold rounded-md bg-red-400 bg-warning ring ring-red-600 p-2 my-2">
              {errorMsg}
            </div>
          ) : null}
          <h1 className="mb-12 font-bold text-3xl text-white">Upload</h1>
          <Textfield
            className="my-2"
            placeHolder="Video Title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <input
            className="text-white my-2"
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={loadFile}
          />
          <div
            className="h-1 rounded-sm bg-orange-500 transition-all"
            style={{ width: progress + "%" }}
          />
          <Button className="my-2" onClick={upload}>
            Upload
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default UploadModal;
