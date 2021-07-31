

const mymap = L.map("checkinMap").setView([0, 0], 1);
const attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer( tileUrl, {attribution} );
tiles.addTo(mymap);

async function getData() {

  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    L.marker( [ item.lat, item.lon ] ).addTo( mymap );
    
  //   const root = document.createElement('p');
  //   const geo = document.createElement('div');
  //   const date = document.createElement('div');

  //   geo.textContent = `${item.lat}°, ${item.lon}°`;
  //   const dateString = new Date(item.timestamp).toLocaleString();
  //   date.textContent = dateString;

  //   root.append( geo, date );
  //   document.body.append(root);
   }
  console.log(data);
}



getData();
