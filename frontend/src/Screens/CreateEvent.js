import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";
import PlaylistCard from "./../Components/PlaylistCard/PlaylistCard";
import {Box, CircularProgress} from "@material-ui/core";

function CreateEvent() {
  // get list of playlists from API here
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [hostPlaylists, setHostPlaylists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/login`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.authenticated || !data.spotifyAuthorized) {
          navigate("/authenticate");
        } else {
          getSpotifyPlaylists();
        }
      });
  }, []);

  function getSpotifyPlaylists() {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/host_spotify_playlists`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setHostPlaylists(data.playlists);
      });
  }

  function showConfirmButton(playlistId) {
    setSelectedPlaylist(playlistId);
  }

  function createEventQueue() {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ playlist_spotify_id: selectedPlaylist }),
    };
    fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/create_event_queue`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          localStorage.setItem("admin", true);
          navigate("/queue?event_name=" + data.event_name);
        }
      });
  }

  return (
    <div className="container">
      <h1 className="title">SELECT A PLAYLIST.</h1>
      {hostPlaylists === null ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="createEvent__playlistCards">
          {hostPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              name={playlist.name}
              playlistArtURL={playlist.image_url}
              playlistId={playlist.id}
              onSelect={showConfirmButton}
              selected={playlist.id === selectedPlaylist}
            />
          ))}
        </div>
      )}
      {selectedPlaylist.length > 1 ? (
        <button
          className="createEvent__confirmButton"
          onClick={createEventQueue}
        >
          Create Event Queue
        </button>
      ) : null}
    </div>
  );
}

export default CreateEvent;
