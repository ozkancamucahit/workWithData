
//this is the server


// like import
const express = require('express');
const app = express(); // create express app
const dataStore = require('nedb');
const fetch = require( 'node-fetch' );


require('dotenv').config();

const parseString = require('xml2js').parseString;


const mqtt = require('mqtt');
const mqttclient = mqtt.connect('mqtt://test.mosquitto.org');
//const mqttclient = mqtt.connect('mqtt://localhost');

mqttclient.subscribe('esp/yt');

// feed string to send with mqtt message
var feed_string; 

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

app.get('/api/firebase', (request, response) =>{

    
    response.json( process.env.FIREBASE_API_KEY ).end();

});


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

var client = "test";
app.get( '/esp/channel', (request, response) =>{
    
    if ( client )
    {
        response.json( client ).end();
        return;
    }
    response.type("text/plain");
    response.status(204).send("No variable client");
    response.end();
} );

var channelID;
// get channel id from client
app.post( '/esp/channel', async( request, response ) => {

    const message = request.body;
    channelID = message.channel;
    client = message.client;

    console.log( `client : ${message.client} sent channel id: ${message.channel}`);
    

    if ( !message.channel || !message.client )
    {
        console.log("Provide channel id");
        response.send("No channel id found");
        response.status(400);
        response.end();
        return;
        
    }

const url = `https://pubsubhubbub.appspot.com/subscribe?hub.verify=async&hub.callback=https://espyoutube.azurewebsites.net/esp/not&hub.mode=subscribe&hub.topic=https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelID}`

    const options = { 

        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        }
     };
    
    const responsePubSUb = await fetch(url, options);

    if ( responsePubSUb.status !=  202)
    {
        console.log( "err on responsePubSub" );
        console.log( url );
        response.status(400);
        response.end();
        return;
    }

    response.status(200);
    response.end();
} );

// variable containing feed notifications
var entries = null;


mqttclient.on('message', function (topic, message) {
    // message is Buffer
    console.log( "topic: "+ topic + " "+ message.toString());
    //mqttclient.end();
  });


app.get( "/esp/not", ( request, response )  => {


    const data = request.query;

    console.log( data );
    
    const challenge = data["hub.challenge"];
    response.send( challenge);
    response.status(204);
    response.end();

} );



app.get( '/esp/feed/entries/', ( request, response )  => {

    if ( entries != null )
    {
        response.json( entries );
        response.end();
    }

    // no entry available
    else {
        response.status(400);
        response.json( {body : "empty.No feed available"});
        response.end();
    }

} );

var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  
    //console.log("req body in saver =>", req.rawBody);
  }


app.use( express.raw( {type : 'application/atom+xml', verify: rawBodySaver} ) );


var channel_name, video_link, published, video_title, updated;

app.post( "/esp/not*", ( request, response )  => {

    //const lol = request.get( "content-type" );
  
    parseString(request.rawBody, function (err, result) {
    
    entries = result;
    channel_name = entries.feed.entry[0].author[0].name[0];
    video_link = entries.feed.entry[0].link[0].$.href;
    published = entries.feed.entry[0].published[0];
    video_title = entries.feed.entry[0].title[0];
    updated = entries.feed.entry[0].updated[0];

    feed_string = `\tkanal :${channel_name},\n
    "${video_title}" isminde bir video yukledi\n
    video linki: ${video_link}\n
    paylasim saati: ${Date(published)}\n
    guncellenme saati: ${Date( updated )}`;

    mqttclient.publish("esp/yt", feed_string);
    //console.log("logging fron index => ",feed_string);

    });
    response.status(200);
    response.end();
});

