        
    
     document.getElementById("btn_submit").addEventListener("click",
    event => {
        if ('geolocation' in navigator) {
        /* geolocation is available */
        //console.log("available" );
        navigator.geolocation.getCurrentPosition(async position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            //console.log(position.coords.latitude, position.coords.longitude);
            document.getElementById('lat').textContent = lat;
            document.getElementById('lon').textContent = lon;
            document.getElementById('init').textContent = 'available';

            const data = { lat, lon };
            const api_url = `/weather/${lat},${lon}`

            const weather_response = await fetch(api_url);
            const weather_json = await weather_response.json();
            //console.log( 'weather api :', weather_json );

            const options = { 

                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

             };
            
            const response = await fetch('/api', options);
            const json = await response.json();
            //console.log(json);

        });

    } else {
        /* geolocation IS NOT available */
        //console.log("not available" );
        document.getElementById('init').textContent = 'not available';

    }


    });