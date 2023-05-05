import { Box } from "@material-ui/core";
import React from "react";
import { sampleSongData } from "../../Helpers/data";
import Result from "./Result";

function ResultsList(props) {
  const filteredData = sampleSongData.filter((song) => {
    if (props.input === "") return song;

    return (
      song.name.toLowerCase().includes(props.input) ||
      song.artist.toLowerCase().includes(props.input)
    );
  });

  return (
    <Box sx={ITEM_BOX_STYLE}>
      {/* {filteredData.map((song) => (
        <Result
          key={song.name}
          name={song.name}
          artist={song.artist}
          handleClick={()=>{
            console.log(`Adding: ${song.name}`)
            props.addSongToQueue(song.name,song.artist);
            props.onClose();
          }}
        />
      ))} */}
    </Box>
  );
}

const ITEM_BOX_STYLE = {
  overflowY:"auto",
  paddingBottom:"2rem",
  paddingLeft:"2rem",
  paddingRight:"2rem",
}

export default ResultsList;
