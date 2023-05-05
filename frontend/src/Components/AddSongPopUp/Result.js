import { Box, Typography } from '@material-ui/core';
import React from 'react'


function Result({name, artist,handleClick}) {
  return (
    <Box onClick={handleClick} style={containerStyle}>
        <Typography style={nameStyle}variant="h5" component="h3" >
            {name}
        </Typography>
        <Typography style={artistStyle}variant="h6" component="h4">
            {artist}
        </Typography>
    </Box>
  )
}

const containerStyle = {
    width:"53.5vw",

    color: "black",
    backgroundColor:"#ededed",

    borderRadius:"1rem",

    padding:"1rem",
    margin:"1rem 0",
};

const nameStyle = {
    fontSize:"18px"
}
const artistStyle = {
    fontSize:"15px",
    color:"#4a4a4a"
}
export default Result