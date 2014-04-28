samesamebutdifferent
====================

Music suggestion app using Deezer and Last.fm API data

This was my final project submitted as part of the General Assembly WDI developer course.

It was built over 10 days during weeks 11 and 12 of the course.

It was designed as an exercise on my part to try to build an app based on information gathered from open-API data sources.

The app takes information from last.fm and deezer.com open APIs.  It also posts user information back into Deezer.com using 
Oauth user authentication.

User must log in to the app using their deezer.com account details, this is done using server side oauth.  Deezer returns a
token which is stored in the app user profile and will be overwritten each time the user logs in.

Users can enter a track name and artist name, this form data is first sent to last.fm where it is normalized against the last.fm database 
and if a valid track is found it is saved to the search database.  Artist and track data is then sent to the last.fm similar songs API request
which returns a JSON object of similar songs based on last.fm user data.  This data is then sent to the Deezer API to return deezer data for each song.
Where there is a match between last.fm and deezer for song and artist, the similar song is then displayed to the user.

Deezer API requests are also made to return user favourite song data from their deezer profile.

The front end of the app makes use of Jquery AJAX calls for user form submissions and underscore.js library for displaying API call results.

noty.js library is used for error and success notifications on API requests to Deezer.

User and song search information is persisted in a postgres database using a rails CRUD framework.

API calls are made from the rails server, with user search requests being saved to the database.  




