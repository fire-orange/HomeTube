import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import defaultImg from "../assets/default-img.jpg";

const Img = (props) => {
  const { src, alt, name, className } = props;
  let [image, setImage] = useState(defaultImg);

  function onSuccess(data) {
      setImage(URL.createObjectURL(data.data));
  }

  function onError() {
    setTimeout(refetch, 10000);
  }

  const {refetch} = useQuery(
    "img-" + name,
    () => {
      return axios.get(src,{
        responseType: 'blob',
      });
    },
    { onSuccess: onSuccess, onError: onError, staleTime: Infinity}
  );

  return <img className={className} src={image} alt={alt} />;
};

export default Img;
