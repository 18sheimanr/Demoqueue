import React, { useEffect, useState } from "react";
import { Button, Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import CurrentlyPlaying from "../Components/CurrentlyPlaying/CurrentlyPlaying";
import QueueOptions from "../Components/QueueOptions/QueueOptions";
import SongSuggestion from "../Components/SongSuggestion/SongSuggestion";
import sortAndReturnNumerically, {
  sortAndReturnAlphabetically,
} from "../Helpers/sort";
import "./LiveQueue.css";

const socket = io.connect(`${process.env.REACT_APP_BACKEND_BASE_URL}`);

function LiveQueue() {
  const [currentSong, setCurrentSong] = useState({});
  const [songsInQueue, setSongsInQueue] = useState([]);
  const [songProgress, setSongProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) === true || false
  );
  const [sortedByRank, setSortedByRank] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const navigate = useNavigate();

  const defaultAlbumArtworkURL = "https://static.vecteezy.com/system/resources/thumbnails/002/249/673/small/music-note-icon-song-melody-tune-flat-symbol-free-vector.jpg";

  const handleToastOpen = () => setToastOpen(true);
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let event_name = params.get("event_name");
  const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
  };

  const loadPlaylistSongs = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/event_songs?event_name=${event_name}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Got all songs from API", data.songs);
        const song_list = data.songs.map((song) => ({
          name: song.name,
          artist: song.artist,
          id: song.id,
          votes: song.votes,
          spotify_id: song.spotify_id,
        }));
        sortQueue(song_list);
      })
      .catch((error) => {
        setIsErrorState(true);
      });
  };

  const sortQueue = (queue) => {
    setSongsInQueue(
      sortedByRank
        ? sortAndReturnNumerically(queue)
        : sortAndReturnAlphabetically(queue)
    );
  };

  const addSongToQueue = (name, artist, songObject) => {
    if (
      songsInQueue.some(
        (song) => song.name === name && song.artist === artist
      )
    ) {
      handleToastOpen();
      return;
    }

    const updatedQueue = [songObject, ...songsInQueue];
    sortQueue(updatedQueue);
  };

  const upVote = (index, switchVote) => {
    const updatedQueue = [...songsInQueue];
    socket.emit("vote", {
      song: updatedQueue[index].id,
      change: switchVote ? 2 : 1,
    });
    updatedQueue[index].votes += switchVote ? 2 : 1;
    sortQueue(updatedQueue);
  };

  const downVote = (index, switchVote) => {
    const updatedQueue = [...songsInQueue];
    socket.emit("vote", {
      song: updatedQueue[index].id,
      change: switchVote ? -2 : -1,
    });
    updatedQueue[index].votes -= switchVote ? 2 : 1;
    sortQueue(updatedQueue);
  };

  const deleteSuggestion = (index) => {
    const updatedQueue = [...songsInQueue];
    updatedQueue.splice(index, 1);
    sortQueue(updatedQueue);
  };

  const toggleSortType = () => {
    setSortedByRank(!sortedByRank);
  };

  const updateCurrentSong = () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ event_name: event_name }),
    };
    fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/currently_playing`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.no_playback || !data) {
          console.log("no playback or no data");
        } else {
          setCurrentSong({
            name: data.item.name,
            artist: data.item.artists[0].name,
            albumWorkURL: data.item.album.images[0].url
          });
          setSongProgress(data.progress_ms / 1000);
          setSongDuration(data.item.duration_ms / 1000);
        }
      })
      .catch((error) => {
        console.log("Error getting current song", error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(updateCurrentSong, 1000); // 30000 ms = 30 s
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    loadPlaylistSongs();

    socket.on("send_vote", (vote) => {
      setSongsInQueue((prevQueue) => {
        const updatedQueue = prevQueue.map((song) =>
          song.id === vote.song
            ? { ...song, votes: song.votes + vote.change }
            : song
        );
        return sortQueue(updatedQueue);
      });
    });

    return () => {
      socket.off("send_vote");
    };
  }, []);

  useEffect(() => {
    sortQueue([...songsInQueue]);
  }, [sortedByRank]);

  useEffect(() => {
    if(!currentSong.name) {
      setCurrentSong({
        name: "Spotify playback paused.",
        artist: "Make sure Spotify is playing.",
        albumWorkURL: defaultAlbumArtworkURL,
      });
    }
  }, [currentSong.name]);

  return (
    <div>
      <div className="queue__header">
        <CurrentlyPlaying
          name={currentSong.name}
          artist={currentSong.artist}
          albumWorkURL={currentSong.albumWorkURL}
          eventName={event_name}
          songProgress={songProgress}
          songDuration={songDuration}
        />
      </div>

      <QueueOptions
        sortedByRank={sortedByRank}
        toggleSortType={toggleSortType}
        addSongToQueue={addSongToQueue}
        event_name={event_name}
        songList={songsInQueue}
      />

      {!isErrorState ? (
        <div className="song__queue">
          {songsInQueue.map((song, index) => (
            <SongSuggestion
              key={`${song.name} ${song.artist}`}
              isAdmin={isAdmin}
              name={song.name}
              id={song.id}
              artist={song.artist}
              votes={song.votes}
              index={index}
              upVote={upVote}
              downVote={downVote}
              deleteSuggestion={deleteSuggestion}
            />
          ))}
        </div>
      ) : (
        <div className="error_message">
          <h3>Oops! This event code doesn't seem to be valid.</h3>
          <Button variant="contained" color="primary" onClick={() => navigate("/home")}>
            Go Back
          </Button>
        </div>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Song is already in the Queue
        </Alert>
      </Snackbar>
    </div>
  );
}

export default LiveQueue;