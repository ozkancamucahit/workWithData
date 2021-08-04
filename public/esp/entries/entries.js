
/**
 * 
 * @param {Promise} data Data to send to firebase
 */
async function sendDataToFirebase( data, ref )
{

    var client_response = await fetch('/esp/channel');
    if ( client_response.status == 204 )
        document.getElementById("client_name").textContent ="empty body: client name";
    
        var client_name = await client_response.json();
        document.getElementById("client_name").textContent =client_name;


    if ( data )
    {
        console.log ( "data in send firebase => ", data);
        var data_to_db = 
        {
            client : client_name,
            channel_name : data.feed.entry[0].author[0].name[0],
            video_link : data.feed.entry[0].link[0].$.href,
            published : Date(data.feed.entry[0].published[0]),
            video_title : data.feed.entry[0].title[0],
            updated : Date(data.feed.entry[0].updated[0])
        };

        ref.push( data_to_db );

    }


}


async function fireBaseInit( )
{
     var firebase_api_key = await fetch ('/api/firebase'); 
     var text_api_key = await firebase_api_key.json();
    

    //console.log( "fb pi key", text_api_key );
    var firebaseConfig = {
        apiKey: text_api_key,
        authDomain: "esp-321413.firebaseapp.com",
        databaseURL: "https://esp-321413-7707f.firebaseio.com",
        projectId: "espyoutube-321413",
        storageBucket: "espyoutube-321413.appspot.com",
        messagingSenderId: "281635650657",
        appId: "1:281635650657:web:7e1d5870e0c320270b3e20",
        measurementId: "G-G7FKHJJPYB"
      };

      // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    var ref =  database.ref("esp/feeds");
    return ref;
    
}

/**
 * 
 * @returns Feed xml parsed to json object || null if nothing found
 */
async function getData()
{

    const data_response = await fetch('/esp/feed/entries/');

    const data_json = await data_response.json();

    //console.log( "datajson:", data_json );
    
    if ( data_response.status != 400 )
        return data_json;

    else return null;

}

var ref;

fireBaseInit()
    .then( databaseref => {
        getData()
            .then ( data_json => sendDataToFirebase( data_json, databaseref ) )
    } );
