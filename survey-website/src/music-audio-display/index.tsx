import { useEffect } from "react";
import { Data } from "../App";

interface IProps {
  song: Data;
  index: number;
}

const MusicAudioDisplay = ({ song, index }: IProps) => {
  useEffect(() => {
    fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${song.id}`,

    ).then((res) => {
      res.json().then((json) => {
        let div = document.getElementById(song.id + "" + index);
        if (div) {
          div.innerHTML = json.html;
        }
      });
    });
  }, [song.id]);
  return <div id={song.id + "" + index} />;
};

export default MusicAudioDisplay;
