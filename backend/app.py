import os

from flask_migrate import Migrate
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_socketio import SocketIO


basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_url_path='', static_folder='./../front-end/src')

app.config['SECRET_KEY'] = 'sadfsadfsadfadsfsafgr'
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

cors = CORS(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
socketio.run(app)

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
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

from routes import *
from spotify_client import *