/*eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZWxpb3Ntb25jaG8iLCJhIjoiY2w0OHp4MTQyMDg1cjNibzNtMzdpenVoaiJ9.m4iqP4DWkzHV7OAHL3dusQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});
