
//this is the server


// like import
const express = require('express'); 
const app = express(); // create express app

app.listen(3000, () => console.log( "listening 3000" ) );
// create folder 'public'
app.use( express.static('public') );
app.use( express.json( { limit:'1mb' } ) );

app.post( '/api', (request, response) => {
    
    console.log( request.body );
    const data = request.body;

    response.json( {
        status:'success',
        latitude: data.lat,
        longitude: data.lon
    } );

    response.end();

} );
