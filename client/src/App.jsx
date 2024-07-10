import "./App.css";
import { useState, useEffect } from "react";
import {
  PauseIcon,
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";

function App() {
  const songIds = ["1", "2", "3", "4"] // list of all the song ids
  const [currIndex, setCurrIndex] = useState(0) // the current index represents the song currently playing

  const audio = document.querySelector("audio"); // get the audio element

  const [isPlaying, setIsPlaying] = useState(false); // current state of playback
  const [currTime, setCurrTime] = useState(0); // current time of playback
  const [newTime, setNewTime] = useState(0); // new time of playback
  const [isSeeking, setIsSeeking] = useState(false); // is the user using the seeker

  // play or pause the current song
  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  // run the following code everytime the playback state changes
  useEffect(() => {
    if (audio) { // if audio component has been mounted
      // play or pause the audio
      if (!isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  }, [isPlaying]);

  // update the current time of the audio
  const updateCurrTime = () => {
    if (audio) {
      audio.currentTime = newTime * audio.duration; // set the current time of the audio tag by getting the proprtion of its duration
    }
  };

  // go to the previous track
  const previousTrack = () => {
    setIsPlaying(false)
    if (currIndex >= 1) { // go to the previous index in the array if it is not the first index
      setCurrIndex(currIndex - 1)
    } else { // go to the end of the array
      setCurrIndex(songIds.length - 1)
    }
  }

  // go to the next track
  const nextTrack = () => {
    setIsPlaying(false)
    if (currIndex < songIds.length - 1) { // go to the next index in the array if it is not the last index
      setCurrIndex(currIndex + 1)
    } else { // go to the start of the array
      setCurrIndex(0)
    }
  }

  // anytime the current index changes reset the playback position and start playing
  useEffect(() => {
    if (audio) {
      setCurrTime(0)
      setIsPlaying(true)
    }
  }, [currIndex])

  return (
    <>
      <h2 className="text-3xl font-bold">Custom Audio Player</h2>

      <div className="w-full flex flex-row m-8 items-center justify-center">

        {/* PREVIOUS TRACK BUTTON */}
        <div
          role="button"
          className=" bg-blue-400 rounded-full p-2 m-2"
          onClick={previousTrack}
        >
          <BackwardIcon className="h-6 w-6" />
        </div>

        {/* PLAY PAUSE BUTTON */}
        <div role="button" className=" bg-blue-400 rounded-full p-2 m-2" onClick={playPause}>
          {
            isPlaying ? <PauseIcon className="h-6 w-6"/> : <PlayIcon className="h-6 w-6"/>
          }
        </div>

        {/* NEXT TRACK BUTTON */}
        <div
          role="button"
          className=" bg-blue-400 rounded-full p-2 m-2"
          onClick={nextTrack}
        >
          <ForwardIcon className="h-6 w-6" />
        </div>

        {/* SEEKER */}
        <div className="p-2 m-2">
          <input
            type="range"
            value={!isSeeking ? currTime : newTime}
            min={0}
            max={1}
            step={0.01}
            onMouseDown={() => {
              // the user is seeking
              setIsSeeking(true);
            }}
            onMouseUp={(event) => {
              // the user has stopped seeking
              setIsSeeking(false);

              // update the current time
              updateCurrTime(event.currentTarget.value);
            }}
            onChange={(event) => {
              // update the new value to seek to
              setNewTime(event.currentTarget.value)
            }}
            className="w-64"
          ></input>
        </div>
      </div>

      {/* AUDIO ELEMENT */}
      <audio
        src={`http://localhost:3000/audio/${songIds[currIndex]}`}
        controls={false}
        onTimeUpdate={(event) => {
          if (!isSeeking) {
          // set the current time if the user is not seeking
            setCurrTime(
              event.currentTarget.currentTime / event.currentTarget.duration
            );
          }
        }}
        onEnded={nextTrack}
      ></audio>
    </>
  );
}

export default App