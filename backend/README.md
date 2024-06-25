helpful scripts

docker build postgres-image
docker run -d -p 5432:5432 --name postgres postgres-image # Run the database container

alembic -c ./migrations/alembic.ini upgrade head

set -a; source example.env; set +a # Load local environment variables from example.env
flask run # Run the app with flask
gunicorn --worker-class eventlet -w 1 'app:create_app()' # OR Run the app with gunicorn

