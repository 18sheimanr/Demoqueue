import os

from flask_migrate import Migrate
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_socketio import SocketIO


basedir = os.path.abspath(os.path.dirname(__file__))
app = None
db = SQLAlchemy()
socketio = None

def create_app():
  global app
  global db
  global socketio
  app = Flask(__name__)

  app.config['SECRET_KEY'] = 'sadfsadfsadfadsfsafgr'
  app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

  cors = CORS(app, origins=["https://18sheimanr.github.io"])
  db = SQLAlchemy(app)
  migrate = Migrate(app, db)
  socketio = SocketIO(app, cors_allowed_origins="https://18sheimanr.github.io")

  login_manager = LoginManager()
  login_manager.session_protection = 'strong'
  login_manager.init_app(app)
  # login_manager.login_view = 'auth.login'

  application = app

  db.create_all()

  @login_manager.user_loader
  def load_user(user_id):
      return Host.query.get(int(user_id))

  # Fixes CORS issue to allow for credentials to be sent from front end
  @app.after_request
  def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://18sheimanr.github.io')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

  from routes import sign_out, login, sign_up, create_event_queue, event_songs, handle_vote
  from spotify_client import spotify_playlist, spotify_track, api_callback, get_user_playlists, get_playlist_songs, get_currently_playing_song_status, add_song_to_queue
  return app
