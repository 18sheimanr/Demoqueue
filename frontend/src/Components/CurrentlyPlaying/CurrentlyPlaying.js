import React from "react";
import "./CurrentlyPlaying.css";
import ShowQRCodeButton from "./ShowQRCodeButton/ShowQRCodeButton";

function CurrentlyPlaying(props) {
  // const [timeToLock, setTimeToLock] = useState(30);

  //   useEffect(() => {
  //     setTimeToLock(30);
  //   }, []);

  //     setInterval(() => {
  //       setTimeToLock(timeToLock - 1);
  //     }, 1000);

  return (
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
        {/* <h4 className="lockTimer">Song Locks in {timeToLock}s</h4> */}
        <ShowQRCodeButton eventName={props.eventName}/>
      </div>
    </div>
  );
}

export default CurrentlyPlaying;
