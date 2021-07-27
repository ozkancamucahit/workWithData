
//this is the server


// like import
const express = require('express'); 
const app = express(); // create express app

app.listen(3000, () => console.log( "listening 3000" ) );
// create folder 'public'
app.use( express.static('public') );

