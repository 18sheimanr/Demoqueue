import React from "react";
import "./CurrentlyPlaying.css";
import ShowQRCodeButton from "./ShowQRCodeButton/ShowQRCodeButton";

function CurrentlyPlaying(props) {
  const progressPercentage = (props.songProgress / props.songDuration) * 100;

  return (
    <div className="currentlyPlaying__wrapper">
      <div className="currentlyPlaying__container">
        <div className="currentlyPlaying__albumworkName--container">
          <img
            className="currentlyPlaying__albumwork"
            src={props.albumWorkURL}
            alt={props.name}
          />

          <div className="currentlyPlaying__songInfo">
            <h2 className="currentlyPlaying__songInfo--name">{props.name}</h2>
            <h3 className="currentlyPlaying__songInfo--artist">{props.artist}</h3>
          </div>
        </div>

        <div className="currentlyPlaying__lockTimer">
          <ShowQRCodeButton eventName={props.eventName}/>
        </div>
      </div>

      <div className="currentlyPlaying__progressBar">
        <div
          className="currentlyPlaying__progressBar--fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default CurrentlyPlaying;
