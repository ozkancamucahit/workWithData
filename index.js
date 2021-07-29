
//this is the server


// like import
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');
const fetch = require( 'node-fetch' );


// const mysql = require('mysql2');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Muhammed17"
//   });
  
//   con.connect(err =>{
//     if (err) { throw err }
//     console.log("Connected!");
//   });


app.listen(3000, () => console.log( "listening 3000" ) );
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
    const API_KEY = 'f6ac3d8ac0e9e10a30efdaa7c22536b8';


    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    const weather_response = await fetch(api_url);
    const weather_json = await weather_response.json();
    //console.log( 'weather api :', weather_json );
    //console.log( "weather response : ", weather_response );
    // make the api call from here

    //send backto client
    response.json( weather_json );
});




