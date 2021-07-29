
async function getData() {

  const response = await fetch('/api');
  const data = await response.json();

  // for (item of data) {
    
  //   const root = document.createElement('p');
  //   const geo = document.createElement('div');
  //   const date = document.createElement('div');

  //   geo.textContent = `${item.lat}°, ${item.lon}°`;
  //   const dateString = new Date(item.timestamp).toLocaleString();
  //   date.textContent = dateString;

  //   root.append( geo, date );
  //   document.body.append(root);
  // }
  console.log(data);
}

const mymap = L.map('issMap').setView([0, 0], 1);
        const attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

        const myIcon = L.icon({
        iconUrl: 'iss200.png',
        iconSize: [50, 30],
        iconAnchor: [25, 15],
        popupAnchor: [-3, -76]
        });
        const marker = L.marker( [0,0], {icon:myIcon} ).addTo(mymap);


        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer( tileUrl, {attribution} );
        tiles.addTo(mymap);

getData();
