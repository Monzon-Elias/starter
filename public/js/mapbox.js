/*eslint-disable */

export const displayMap = (location) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWxpb3Ntb25jaG8iLCJhIjoiY2w0OHp4MTQyMDg1cjNibzNtMzdpenVoaiJ9.m4iqP4DWkzHV7OAHL3dusQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //remember that locations is an array
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    });

    //add popup
    new mapboxgl.Popup({ offset: 30 })

      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
