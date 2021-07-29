        
    
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

            const api_url = `/weather/${lat},${lon}`

            const weather_response = await fetch(api_url);
            const weather_json = await weather_response.json();
            //console.log( 'weather api :', weather_json );
            document.getElementById("summary").textContent = weather_json.weather[0].main;
            document.getElementById("temp").textContent = weather_json.main.temp;

            let weather = weather_json.weather[0];

            let temp = weather_json.main.temp;

            const data = { lat, lon, weather, temp };

            const options = { 

                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

             };
            
            const response = await fetch('/api', options);
            const json = await response.json();




        });

    } else {
        /* geolocation IS NOT available */
        //console.log("not available" );
        document.getElementById('init').textContent = 'not available';

    }


    }); // click event end