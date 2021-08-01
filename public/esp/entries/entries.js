


async function getData(){

const data = await fetch("/esp/feed/entries");
const data_json = await data.json();
console.log("headers", data.headers);
console.log("type :", data.type);
console.log("feed", data.feed);
console.log("json", data_json);


}

getData();