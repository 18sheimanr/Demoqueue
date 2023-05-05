import { IconButton } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import "./VotingButtons.css";

function VotingButtons(props) {
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  useEffect(() => {
      let initialVoteState = localStorage.getItem(props.songId.toString());
      if(initialVoteState && initialVoteState === "1") {
          setUpVoted(true);
      }else if(initialVoteState && initialVoteState === "-1"){
          setDownVoted(true);
      }
  }, []);

  return (
    <div className="votingButtons">
      <IconButton
        style={{ color: `${upVoted ? "gray" : "#4BB543"}` }}
        onClick={() => {
          if (upVoted) {
            props.downVote(props.index, false);
            setUpVoted(false);
            localStorage.setItem(props.songId.toString(), "0");
            return;
          }
          props.upVote(props.index, downVoted);
          setUpVoted(true);
          setDownVoted(false);
          localStorage.setItem(props.songId.toString(), "1");
        }}
      >
        <ArrowDropUp style={{ transform: "scale(1.5)" }} />
      </IconButton>
      <IconButton
        style={{ color: `${downVoted ? "gray" : "#eb5534"}` }}
        onClick={() => {
          if (downVoted) {
            props.upVote(props.index, false);
            setDownVoted(false);
            localStorage.setItem(props.songId.toString(), "0");
            return;
          }
          props.downVote(props.index, upVoted);
          setDownVoted(true);
          setUpVoted(false);
          localStorage.setItem(props.songId.toString(), "-1");
        }}
      >
        <ArrowDropDown style={{ transform: "scale(1.5)" }} />
      </IconButton>
    </div>
  );
}

export default VotingButtons;
