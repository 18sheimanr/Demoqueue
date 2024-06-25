import datetime
import json
import os

from flask import redirect, session, request
from pip._vendor import requests

from app import app, db
from models import Song, Event

clientId = os.getenv("SPOTIFY_CLIENT_ID")
clientSecret = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
spotify_base_api = "https://api.spotify.com/v1"

class spotify_playlist():
    def __init__(self, name, id, image_url, track_count):
        self.id = id
        self.name = name
        self.image_url = image_url
        self.track_count = track_count

    def as_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url,
            "track_count": self.track_count
        }

class spotify_track():
    def __init__(self, name, artist, image_url, id,uri):
        self.name = name
        self.image_url = image_url
        self.artist = artist
        self.id = id
        self.uri = uri

@app.route("/spotify_webhook")
def api_callback():

    auth_token = request.args['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": os.getenv("BASE_URL") + "/spotify_webhook",
        'client_id': clientId,
        'client_secret': clientSecret,
    }
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload)

    response_data = json.loads(post_request.text)
    access_token = response_data["access_token"]
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]

    session["spotify_token"] = access_token
    session["spotify_refresh_token"] = refresh_token
    session["spotify_token_expires"] = datetime.datetime.now() + datetime.timedelta(seconds=int(expires_in))

    return redirect(os.getenv("FRONTEND_ORIGIN") + "/create_event")

@app.route('/host_spotify_playlists', methods=['GET'])
def get_user_playlists():
    token = session["spotify_token"]
    authorization_header = {"Authorization": "Bearer {}".format(token)}

    playlist_api_endpoint = "{}/me/playlists".format(spotify_base_api)
    playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    playlist_data = json.loads(playlists_response.text)

    playlists = []
    for playlist in playlist_data["items"]:
        if playlist["tracks"]["total"] == 0:
            continue
        if len(playlist["images"]) > 0:
            img_url = playlist["images"][0]["url"]
        else:
            img_url = ""
        playlists.append(spotify_playlist(
            name=playlist["name"],
            id=playlist["id"],
            image_url=img_url,
            track_count=playlist["tracks"]["total"],
        ))

    return {"playlists": [playlist.as_json() for playlist in playlists]}

def get_playlist_songs(playlist_spotify_id):
    token = session["spotify_token"]
    authorization_header = {"Authorization": "Bearer {}".format(token)}

    playlist_api_endpoint = "{}/playlists/{}".format(spotify_base_api, playlist_spotify_id)
    playlist_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    playlist_data = json.loads(playlist_response.text)

    songs = playlist_data["tracks"]["items"]
    parsed_songs = []

    for song in songs:
        artist = (", ").join([str(a["name"]) for a in song["track"]["artists"]])
        song_name = song["track"]["name"]
        song_img_url = song["track"]["album"]["images"][0]["url"]
        song_id = song["track"]["id"]
        song_uri = song["track"]["uri"]
        song_object = spotify_track(name=song_name, artist=artist, image_url=song_img_url, id=song_id,uri=song_uri)
        parsed_songs.append(song_object)

    return parsed_songs

@app.route('/currently_playing', methods=['POST'])
def get_currently_playing_song_status():
    token = session["spotify_token"]
    authorization_header = {"Authorization": "Bearer {}".format(token)}

    player_api_endpoint = "{}/me/player".format(spotify_base_api)
    players_response = requests.get(player_api_endpoint, headers=authorization_header)
    if len(players_response.text) <= 1:
        return {"no_playback":True}
    player_data = json.loads(players_response.text)
    print(player_data['item']['duration_ms'])
    print(player_data['progress_ms'])
    if int(player_data['item']['duration_ms']) - int(player_data['progress_ms']) - 3 * 1000 < 0:  # 3 seconds left in the song, queue next one
        # play next song, ideally store the spotify token to back end and use it to queue the next song without
        # relying on FE client calling this method
        event = db.session.query(Event).filter(Event.name == request.json["event_name"]).first()
        song = db.session.query(Song).filter(Song.event_id == event.id).order_by(Song.rating.desc()).first()
        if session.get("last_queued_song_id", "") == song.id:
            return player_data

        session["last_queued_song_id"] = song.id
        queue_api_endpoint = "{}/me/player/queue?uri={}".format(spotify_base_api, song.spotify_id)
        requests.post(queue_api_endpoint, headers=authorization_header)

    return player_data

@app.route('/add_song_to_queue', methods=['POST'])
def add_song_to_queue():
    try:
        token = session["spotify_token"]
        spotify_uri = request.json["spotify_uri"]
        authorization_header = {"Authorization": "Bearer {}".format(token)}

        queue_api_endpoint = "{}/me/player/queue?uri={}".format(spotify_base_api,spotify_uri)        
        requests.post(queue_api_endpoint,headers=authorization_header)
        return {"res": "Song added successfully"}
    except Exception as e:
        print(e)

    return {"res":"Song wasn't added succesfully"}