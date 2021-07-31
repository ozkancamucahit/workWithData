

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST", "feed");

var xmlDoc;

xmlhttp.onreadystatechange = function (){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //Request was successful
        xmlDoc = xmlhttp.responseXML;
        console.log( xmlDoc );
       }
}



