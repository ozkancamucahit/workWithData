
//this is the server


// like import
const { request } = require('express');
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');
const fetch = require( 'node-fetch' );
require('dotenv').config();

const youtubeNotifier = require( 'youtube-notification' );

const notifier = new YouTubeNotifier({
    hubCallback: 'https://espyoutube.glitch.me/esp',
    port: 8080,
    path: '/esp'
  });

notifier.setup();

notifier.on('notified', data => {
    console.log('New Video');
    console.log(
      `${data.channel.name} just uploaded a new video titled: ${data.video.title}`
    );
  });
   
  notifier.subscribe('UCMyNomwx3XRN7mCWyRSHGRQ');




// const mysql = require('mysql2');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: ""
//   });
  
//   con.connect(err =>{
//     if (err) { throw err }
//     console.log("Connected!");
//   });

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log( `listening port : ${port}` );
} );

    // create folder 'public'
app.use( express.static('public') );
app.use( express.json( { limit:'1mb' } ) );

const database = new dataStore("database.db");

database.loadDatabase();

app.post( '/api', (request, response) => {
    
    //console.log( "req body : ",request.body );
    
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);
    //echo back the request
    response.json( data );

    response.end();

} );

app.get('/api', ( request, response ) => {

    // find everything
    database.find( {}, (err, data)=>{
        if (err){
            response.end();
            return;
        }

        response.json(data);
    } );

    //response.json( {test: 1717} );
} );

app.get( '/weather/:latlon', async(request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const API_KEY = process.env.API_KEY;


    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    const weather_response = await fetch(api_url);
    const weather_json = await weather_response.json();
    //console.log( 'weather api :', weather_json );
    //console.log( "weather response : ", weather_response );
    // make the api call from here

    //send backto client
    response.json( weather_json );
});


app.get("/esp", ( request, response )=> {


    const data = request.query;

    console.log( data );
    
    const challenge = data["hub.challenge"];
    //console.log( "challenge : ", challange );
    app.render("esp.html");
    
    response.send( challenge );
    response.status(204);
    response.end();

} );

app.post( "/esp*", ( request, response )  => {

    
    console.log( "query", request.query );
    console.log( "params", request.params );
    console.log( "headers", request.headers );
    
    response.status(200);
    response.end();
    

});

