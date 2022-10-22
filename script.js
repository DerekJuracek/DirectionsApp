// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     console.log(position);
//     const lat = position.coords.latitude;
//     const long = position.coords.longitude;
// });

// Use google maps geolocation to get current location when in NYC or find better
// Omaha POI data

mapboxgl.accessToken =
  "pk.eyJ1IjoianBlZ21vdW50YWlubWFuIiwiYSI6ImNsMDMxMG9hZTBmeHAzZG1tOTd2NWxhZnkifQ.aXMcmbPG90l2w8KFx8E2RA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/navigation-night-v1", // style URL
  center: [-73.935242, 40.73061], // starting position [lng, lat]
  zoom: 11, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    bbox: [
      -74.48605437031603, 40.50049476056204, -72.43999662579785,
      41.77015436911461,
    ],
    placeholder: "          Where are we going?",
  }),
  "top-right"
);

// map.on("mousemove", (e) => {
//   document.getElementById("info").innerHTML =
//     // `e.point` is the x, y coordinates of the `mousemove` event
//     // relative to the top-left corner of the map.
//     JSON.stringify(e.point) +
//     "<br />" +
//     // `e.lngLat` is the longitude, latitude geographical position of the event.
//     JSON.stringify(e.lngLat.wrap());
// });

map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  }),
  "top-left"
);

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
});
map.addControl(nav, "bottom-right");

map.on("style.load", () => {
  map.setFog({
    range: [0.8, 8],
    color: "#dc9f9f",
    "horizon-blend": 0.5,
    "high-color": "#245bde",
    "space-color": "#000000",
    "star-intensity": 0.15,
  }); // Set the default atmosphere style
});

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
    showUserLocation: true,
  }),
  "bottom-right"
);

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  };
}
// Example of a MapMouseEvent of type "click"
// map.on("click", (mapEvent) => {
//   //   console.log(mapEvent);
//   coords = mapEvent.lngLat;
//   const Lat = mapEvent.lngLat.lat;
//   const lng = mapEvent.lngLat.lng;

//   const popup = new mapboxgl.Popup({ offset: 25 }).setText(
//     `You clicked at ${Lat}, ${lng} `
//   );
//   const marker1 = new mapboxgl.Marker()
//     .setLngLat([lng, Lat])
//     .setPopup(popup)
//     .addTo(map);
// });

map.on("load", function () {
  map.loadImage("coffeecup.png"),
    (error, image) => {
      if (error) throw error;
      map.addImage("coffeecup.png", image, { sdf: true });
    };
  map.addLayer({
    id: "data",
    type: "symbol",
    source: {
      type: "geojson",
      data: data,
    },
  });
});
console.log(data);

// When a click event occurs on a feature in the data layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on("click", "data", (e) => {
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  console.log(e);
  console.log(coordinates);

  const comments = e.features[0].properties.Comments;
  const name = e.features[0].properties.Name;
  const popupInfo = [name, comments];

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupInfo).addTo(map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "data", () => {
  map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "data", () => {
  map.getCanvas().style.cursor = "";
});
