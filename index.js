
//this is the server


// like import
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');


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
    
    console.log( request.body );
    
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
