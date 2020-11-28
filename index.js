
L.mapbox.accessToken = 'pk.eyJ1Ijoic2RhaGFsMiIsImEiOiJja2g4NzVjd3IwYmVvMnRvNzU1bjlia2tsIn0.GhYhUmrb0rsxIXrl3rjyLg';
const mymap = L.mapbox.map('map_id').setView([40.896401, -74.022748], 14);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 20,
id: 'mapbox/streets-v9',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1Ijoic2RhaGFsMiIsImEiOiJja2g4NzVjd3IwYmVvMnRvNzU1bjlia2tsIn0.GhYhUmrb0rsxIXrl3rjyLg' // add your mapbox token here
}).addTo(mymap)

var geoLocations = {}; //object to record the addresses and their coordinates
var count = 0; //records the number of addresses and their coordinates in geoLocations
const geocoder = L.mapbox.geocoder('mapbox.places');
const marker = {
	icon: L.mapbox.marker.icon({
		'marker-size':'large',
		'marker-color':'#fa0'
    })};
    
const map_address = async (id) => {
      
    const entered_text = document.getElementById(id).value;
    const normalized = encodeURIComponent(entered_text);
    console.log(normalized);
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${normalized}.json?access_token=pk.eyJ1Ijoic2RhaGFsMiIsImEiOiJja2g4NzVjd3IwYmVvMnRvNzU1bjlia2tsIn0.GhYhUmrb0rsxIXrl3rjyLg`);
    const data = response.data;
    
    var coordinates = getCoordinates(data);
    mark(coordinates);
    flyToLocation(coordinates);

    geoLocations[entered_text.toString()] = coordinates;
    count++; //each time a location is added, the count increases

    console.log(geoLocations);

    document.querySelectorAll('input').forEach(e => e.value = "");
    const list = document.getElementsByTagName('ul')[0];
    
    console.log(count);
    list.innerHTML += "<li class='class" + count.toString() + "'onclick = 'my_location(this)'><p id = 'my_id" + count.toString() +"'>" + entered_text + "</p></li>";
}

const getCoordinates = (data) => {

    coordinates = Object.values(data.features[0].center);
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    console.log(latitude);
    
    const latlng = [latitude, longitude];
    return latlng;
}

const flyToLocation = (coordinates) => {
    mymap.flyTo(coordinates, 10);
}

const my_location = (obj) => {
    
    //getting the classNum from the classname
    const classNum = obj.className.slice(5);

    //getting the id number from the class name
    const idNum = parseInt(classNum).toString();

    //class number and p id number will be the same
    const my_id = "my_id"+ idNum;

    //getting the text from p id
    const text = document.getElementById(my_id).textContent;
    
    //converting it to a string
    const address = text.toString();

    console.log(address);

    //once we have the address from the p id,we can fetch its coordinates 
    coordinates = geoLocations[address];

    //re-centering the map to the coordinates
    flyToLocation(coordinates);
}

const mark = (coordinates) => {
    L.marker(coordinates).addTo(mymap);
}

