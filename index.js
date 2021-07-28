
//this is the server


// like import
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');

app.listen(3000, () => console.log( "listening 3000" ) );
// create folder 'public'
app.use( express.static('public') );
app.use( express.json( { limit:'1mb' } ) );

const database = new dataStore("database.db");
database.loadDatabase();

app.post( '/api', (request, response) => {
    
    console.log( request.body );
    
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);
    //echo back the request
    response.json( {
        status:'success',
        timestamp: timestamp,
        latitude: data.lat,
        longitude: data.lon
    } );

    response.end();

} );
