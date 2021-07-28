

function setup(){
        
    noCanvas();
    const video = createCapture( VIDEO );
    video.size( 160, 120 );
    
     document.getElementById("btn_submit").addEventListener("click",
    event => {
        if ('geolocation' in navigator) {
        /* geolocation is available */
        //console.log("available" );
        navigator.geolocation.getCurrentPosition(async position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            video.loadPixels(); //load video elements pixels to canvas
            //convers data in canvas to base64
            const image64 = video.canvas.toDataURL();
            //console.log(position.coords.latitude, position.coords.longitude);
            document.getElementById('lat').textContent = lat;
            document.getElementById('lon').textContent = lon;
            document.getElementById('init').textContent = 'available';

            const data = { lat, lon, image64 };

            const options = { 

                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

             };
            
            const response = await fetch('/api', options);
            const json = await response.json();
            console.log(json);

        });

    } else {
        /* geolocation IS NOT available */
        //console.log("not available" );
        document.getElementById('init').textContent = 'not available';

    }


    })
}//end setup