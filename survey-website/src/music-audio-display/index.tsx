import { useEffect } from "react";
import { Data } from "../App";

interface IProps {
  song: Data;
}

const MusicAudioDisplay = ({ song }: IProps) => {
  useEffect(() => {
    fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${song.id}`
    ).then((res) => {
      res.json().then((json) => {
        console.log("Json", json);
        let div = document.getElementById(song.id);
        if (div) {
          div.innerHTML = json.html;
        }
      });
    });
  }, [song.id]);
  return <div id={song.id} />;
};

export default MusicAudioDisplay;
