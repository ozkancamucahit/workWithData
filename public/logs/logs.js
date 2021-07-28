
getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const root = document.createElement('p');
    const geo = document.createElement('div');
    const date = document.createElement('div');
    const image = document.createElement('img');

    geo.textContent = `${item.lat}°, ${item.lon}°`;
    const dateString = new Date(item.timestamp).toLocaleString();
    date.textContent = dateString;
    image.src = item.image64;
    image.alt = 'LOL';

    root.append( geo, date, image);
    document.body.append(root);
  }
  console.log(data);
}