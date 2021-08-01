
//this is the server


// like import
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');
const fetch = require( 'node-fetch' );
require('dotenv').config();

const parseString = require('xml2js').parseString;



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


const server = app.listen(port, () => {
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
    console.log( "weather response : ", weather_response );
    // make the api call from here

    //send backto client
    response.json( weather_json );
});


var entries;

app.get( "/esp/not", ( request, response )  => {


    const data = request.query;

    console.log( data );
    
    const challenge = data["hub.challenge"];
    response.send( challenge);
    response.status(204);
    response.end();

} );


app.get( "/esp/feed/entries", ( request, response )  => {


    response.json( entries );
    response.status(204);
    response.end();

} );

var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  
    //console.log("req body in saver =>", req.rawBody);
  }


app.use( express.raw( {type : 'application/atom+xml', verify: rawBodySaver} ) );

app.post( "/esp/not*", ( request, response )  => {

    const lol = request.get( "content-type" );
    const body = request.read(12);
    //console.log( request );

    
    //console.log( "query => ", request.query );
    //console.log( "params =>", request.params );
    //console.log( "headers =>", request.headers );
    //console.log( "body =>", request.body );
    //console.log( "ct", lol );
  
    parseString(request.rawBody, function (err, result) {
    entries = result;
    console.log(result);
    });

    

    response.status(200);
    response.end();
    

});
