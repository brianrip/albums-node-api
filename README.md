## Albums API

Steps to run locally
- Ensure you have a instance of mongoDB running locally by installing mongo if you haven't and running command: `mongod` this may require `sudo` depending on your permissions. Once mongo is up and running on default ports:
- `npm install`
- `npm start`

Upon first successful startup you should see these messages in your terminal.
- Web server running on port 3000.
- Mongoose connection successful.
- Warning: Possible unwanted characters in album titled: 'Don‰Ûªt Believe the Truth'. Check document with this title and edit as needed.
- Warning: Possible unwanted characters in album titled: 'Post'. Check document with this title and edit as needed.

The last three messages will only appear the first time you start the app in order to seed the database from a csv of albums. The `Warning:` messages are to notify the user that some data contained possible unwanted characters.

API root url:
- http://localhost:3000/v1

Endpoints:
- GET http://localhost:3000/v1/albums index of albums
- GET http://localhost:3000/v1/albums/:id show album
- POST http://localhost:3000/v1/albums create album, requires: title, artist, genre, and year params in body of request
- PUT http://localhost:3000/v1/albums/:id update album
- GET http://localhost:3000/v1/artists index of artists
- GET http://localhost:3000/v1/artists/:name all albums for a particular artists. This can also be queried in a more restful way through `http://localhost:3000/v1/albums?query={"where": {"artist": "Oasis"}}`

Extra Credit:
- GET http://localhost:3000/v1/genres/mostAlbums genres ranked by number of albums
