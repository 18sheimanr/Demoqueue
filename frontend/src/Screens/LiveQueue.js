import { Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import CurrentlyPlaying from "../Components/CurrentlyPlaying/CurrentlyPlaying";
import QueueOptions from "../Components/QueueOptions/QueueOptions";
import SongSuggestion from "../Components/SongSuggestion/SongSuggestion";
import sortAndReturnNumerically, {
  sortAndReturnAlphabetically,
} from "../Helpers/sort";
import "./LiveQueue.css";
import io from "socket.io-client";
import axios from "axios";

let socket = io.connect("https://demoqueue-server.herokuapp.com");

function LiveQueue() {
  const [currentSong, setCurrentSong] = useState({});
  const [songsInQueue, setSongsInQueue] = useState([]);
  const [songProgress, setSongProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const queueRef = React.useRef(songsInQueue);
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) === true || false
  );
  const [sortedByRank, setSortedByRank] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const handleToastOpen = () => setToastOpen(true);
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let event_name = params.get("event_name");

  const loadPlaylistSongs = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(
      "https://demoqueue-server.herokuapp.com/event_songs?event_name=" +
        event_name,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Got all songs from API", data.songs);
        let song_list = [...songsInQueue];
        data.songs.forEach((song) => {
          song_list.push({
            name: song.name,
            artist: song.artist,
            id: song.id,
            votes: song.votes,
            spotify_id: song.spotify_id,
          });
        });
        sortQueue(song_list);
      });
  };

  const getCurrentlyPlayingSong = async () => {
    let requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(
      "https://demoqueue-server.herokuapp.com/currently_playing",
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.no_playback) {
          console.log("no playback");
        } else {
          setSongProgress(data.progress_ms / 1000);
          setSongDuration(data.item.duration_ms / 1000);
          setInterval(() => {
            setSongProgress((seconds) => seconds + 1);
          }, 1000);
          setTimeout(() => {
            console.log("add to queue");
            if (isAdmin) {
              console.log("admin adding song to queue");
              requestOptions.method = "POST";
              requestOptions.withCredentials = true;
              let queue = [...queueRef.current];
              queue = sortAndReturnNumerically(queue);

              console.log("adding", queue[0]);
              axios
                .post(
                  "https://demoqueue-server.herokuapp.com/add_song_to_queue",
                  { spotify_uri: queue[0].spotify_id },
                  requestOptions
                )
                .then((res) => console.log(res.data));
            }
          }, data.item.duration_ms - data.progress_ms - 30 * 1000);
          setTimeout(() => {
            console.log("song ended");
            window.location.reload();
          }, data.item.duration_ms - data.progress_ms - 2000);
          updateCurrentlyPlaying(
            data.item.name,
            data.item.artists[0].name,
            data.item.album.images[0].url
          );
        }
      });
  };

  const updateCurrentlyPlaying = (name, artist, imageURL) => {
    setCurrentSong({
      name: name,
      artist: artist,
      albumWorkURL: imageURL,
    });
  };

  const sortQueue = (queue) => {
    if (sortedByRank) {
      setSongsInQueue(sortAndReturnNumerically(queue));
    } else {
      setSongsInQueue(sortAndReturnAlphabetically(queue));
    }
  };

  const addSongToQueue = (name, artist, songObject) => {
    if (
      songsInQueue.filter(
        (song) => song.name === name && song.artist === artist
      ).length > 0
    ) {
      handleToastOpen();
      return;
    }

    let queueCopy = [...songsInQueue];

    queueCopy.unshift(songObject);

    sortQueue(queueCopy);
  };

  const upVote = (index, switchVote) => {
    let queueCopy = [...songsInQueue];
    socket.emit("vote", {
      song: queueCopy[index].id,
      change: switchVote ? 2 : 1,
    });
    queueCopy[index].votes += switchVote ? 2 : 1;
    sortQueue(queueCopy);
  };

  const downVote = (index, switchVote) => {
    let queueCopy = [...songsInQueue];
    socket.emit("vote", {
      song: queueCopy[index].id,
      change: switchVote ? -2 : -1,
    });
    queueCopy[index].votes -= switchVote ? 2 : 1;
    sortQueue(queueCopy);
  };

  const deleteSuggestion = (index) => {
    let queueCopy = [...songsInQueue];
    queueCopy.splice(index, 1);
    sortQueue(queueCopy);
  };

  const toggleSortType = () => {
    setSortedByRank(!sortedByRank);
  };

  useEffect(() => {
    queueRef.current = songsInQueue;
  });

  useEffect(() => {
    sortQueue([...songsInQueue]);
  }, [sortedByRank]);

  useEffect(() => {
    socket.on("send_vote", (vote) => {
      console.log("useEffect on send vote");
      let queueCopy = [...queueRef.current];
      const idx = queueCopy.findIndex((song) => song.id === vote.song);
      queueCopy[idx].votes += vote.change;
      sortQueue(queueCopy);
    });
    setCurrentSong({
      name: "",
      artist: "",
      albumWorkURL:
        "https://static.vecteezy.com/system/resources/thumbnails/002/249/673/small/music-note-icon-song-melody-tune-flat-symbol-free-vector.jpg",
    });
    getCurrentlyPlayingSong();
    // loadPlaylistSongs();
  }, []);

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
      />

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
