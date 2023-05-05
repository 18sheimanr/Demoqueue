import React from "react";
import DeleteButton from "./DeleteButton/DeleteButton";
import "./SongSuggestion.css";
import VotingButtons from "./VotingButtons/VotingButtons";

function SongSuggestion(props) {
  return (
    <div className="song__card">
      <div className="song__info">
        <h3 className="song__info--name">{props.name}</h3>
        <h4 className="song__info--artist">{props.artist}</h4>
      </div>

      <div className="song__interactions">
        <div className="votes__counter--container">
          <span className="song__votes song__votes--number">{props.votes}</span>
          <span className="song__votes song__votes--text">votes</span>
        </div>

        <VotingButtons
          upVote={props.upVote}
          songId={props.id}
          downVote={props.downVote}
          index={props.index}
        />
        
        <DeleteButton
          deleteSuggestion={props.deleteSuggestion}
          isAdmin={props.isAdmin}
          index={props.isAdmin}
        />
      </div>
    </div>
  );
}

export default SongSuggestion;
