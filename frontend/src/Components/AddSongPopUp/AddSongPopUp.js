import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Close } from "@material-ui/icons";
import React, { useState } from "react";
import ResultsList from "./ResultsList";

function AddSongPopUp(props) {
  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <Box sx={BOX_STYLE}>
      <Typography
        style={SEARCH_TEXT}
        variant="h5"
        component="h2"
        align="center"
      >
        Song Search
      </Typography>

      <IconButton style={EXIT_BUTTON} onClick={props.onClose}>
        <Close />
      </IconButton>

      <input type="text" placeholder="Song Name" onChange={inputHandler} />

      <ResultsList
        addSongToQueue={props.addSongToQueue}
        onClose={props.onClose}
        input={inputText}
      />
    </Box>
  );
}

const BOX_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: "75%",
  height: "75vh",
  borderRadius: "1rem",

  bgcolor: "background.paper",

  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};

const EXIT_BUTTON = {
  position: "absolute",
  top: ".5rem",
  right: ".5rem",
  transform: "scale(1.3)",
};

const SEARCH_TEXT = {
  paddingTop: "2rem",
  color: "black",
  margin: 0,
};

export default AddSongPopUp;
