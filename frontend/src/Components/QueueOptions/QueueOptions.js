import { Box, Button, IconButton, Modal, Typography } from "@material-ui/core";
import { Add, Close, Sort } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

import { sampleSongData } from "../../Helpers/data";

import "./QueueOptions.css";

function QueueOptions(props) {

  const [addSongsOpen, setAddSongsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [songList, setSongList] = useState([])
  const handleOpen = () => setAddSongsOpen(true);
  const handleClose = () => setAddSongsOpen(false);
  
  const inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(
      "https://demoqueue-server.herokuapp.com/event_songs?event_name=" + props.event_name,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("Got all songs from API", data.songs);
        // console.log(data.songs[0]);
        console.log(data.songs);
        setSongList(data.songs);
      });
  }, [])
  

  const filteredData = songList.filter((song) => {
    if (inputText === "") return song;

    return (
      song.name.toLowerCase().includes(inputText) ||
      song.artist.toLowerCase().includes(inputText)
    );
  });

  return (
    <div className="QueueOptions">
      <Button
        color="primary"
        startIcon={<Sort />}
        onClick={() => {
          props.toggleSortType();
        }}
      >
        Sort {props.sortedByRank ? "Alphabetically" : "by Rank"}
      </Button>
      <Button endIcon={<Add />} color="primary" onClick={handleOpen}>
        Add Song
      </Button>

      <Modal open={addSongsOpen} onClose={handleClose}>
        <Box sx={BOX_STYLE}>
          <Typography
            style={SEARCH_TEXT}
            variant="h5"
            component="h2"
            align="center"
          >
            Song Search
          </Typography>

          <IconButton style={EXIT_BUTTON} onClick={handleClose}>
            <Close />
          </IconButton>

          <input type="text" placeholder="Song Name" onChange={inputHandler} />

          <Box sx={ITEM_BOX_STYLE}>
            {filteredData.map((song) => (
              <Box
                key={song.name}
                onClick={() => {
                  props.addSongToQueue(song.name, song.artist,song);
                  handleClose();
                }}
                style={containerStyle}
              >
                <Typography style={nameStyle} variant="h5" component="h3">
                  {song.name}
                </Typography>
                <Typography style={artistStyle} variant="h6" component="h4">
                  {song.artist}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

    </div>
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
  
  // bgcolor: "background.paper",
  backgroundColor:"#1c0835",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};

const EXIT_BUTTON = {
  position: "absolute",
  top: ".5rem",
  right: ".5rem",
  color:"white",
  transform: "scale(1.3)",
};

const SEARCH_TEXT = {
  paddingTop: "2rem",
  margin: 0,
};

const containerStyle = {
  width: "53.5vw",
  borderBottom:"1px solid gray",
  paddingBottom:"1rem",
  // width: "75%",
  
  color: "white",
  // backgroundColor: "#ededed",
  
  // borderRadius: "1rem",
  
  // padding: "1rem",
  margin: "1rem 0",
};

const ITEM_BOX_STYLE = {
  overflowY: "auto",
  paddingBottom: "2rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
};

const nameStyle = {
  fontSize: "18px",
};

const artistStyle = {
  fontSize: "15px",
  color: "rgb(140, 140, 140)",
};

export default QueueOptions;
