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
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-73.92772226626813, 40.69072912914976], // starting position [lng, lat]
  zoom: 13, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })
);

map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  }),
  "top-left"
);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
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
  })
);

const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');
 
for (const input of inputs) {
input.onclick = (layer) => {
const layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
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
      map.addImage("coffee-icon", image, { sdf: true });
    };
  map.addLayer({
    id: "data",
    type: "circle",
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

// const coordinates = navigator.geolocation.getCurrentPosition((position) => {
//   let lat = position.coords.latitude;
//   let long = position.coords.longitude;
// });

// const start = [-73.92772226626813, 40.69072912914976];

// // create a function to make a directions request
// async function getRoute(end) {
//   // make a directions request using cycling profile
//   // an arbitrary start will always be the same
//   // only the end or destination will change

//   const query = await fetch(
//     `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
//     { method: "GET" }
//   );

//   const json = await query.json();
//   const data = json.routes[0];
//   const route = data.geometry.coordinates;
//   const geojson = {
//     type: "Feature",
//     properties: {},
//     geometry: {
//       type: "LineString",
//       coordinates: route,
//     },
//   };
//   // if the route already exists on the map, we'll reset it using setData
//   if (map.getSource("route")) {
//     map.getSource("route").setData(geojson);
//   }
//   // otherwise, we'll make a new request
//   else {
//     map.addLayer({
//       id: "route",
//       type: "line",
//       source: {
//         type: "geojson",
//         data: geojson,
//       },
//       layout: {
//         "line-join": "round",
//         "line-cap": "round",
//       },
//       paint: {
//         "line-color": "#3887be",
//         "line-width": 5,
//         "line-opacity": 0.75,
//       },
//     });
//   }
//   // add turn instructions here at the end
// }

// map.on("load", () => {
//   // make an initial directions request that
//   // starts and ends at the same location
//   getRoute(start);

//   // Add starting point to the map
//   map.addLayer({
//     id: "point",
//     type: "circle",
//     source: {
//       type: "geojson",
//       data: {
//         type: "FeatureCollection",
//         features: [
//           {
//             type: "Feature",
//             properties: {},
//             geometry: {
//               type: "Point",
//               coordinates: start,
//             },
//           },
//         ],
//       },
//     },
//     paint: {
//       "circle-radius": 10,
//       "circle-color": "#3887be",
//     },
//   });
//   map.on("click", (event) => {
//     const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
//     const end = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             type: "Point",
//             coordinates: coords,
//           },
//         },
//       ],
//     };
//     if (map.getLayer("end")) {
//       map.getSource("end").setData(end);
//     } else {
//       map.addLayer({
//         id: "end",
//         type: "circle",
//         source: {
//           type: "geojson",
//           data: {
//             type: "FeatureCollection",
//             features: [
//               {
//                 type: "Feature",
//                 properties: {},
//                 geometry: {
//                   type: "Point",
//                   coordinates: coords,
//                 },
//               },
//             ],
//           },
//         },
//         paint: {
//           "circle-radius": 10,
//           "circle-color": "#f30",
//         },
//       });
//     }
//     getRoute(coords);
//   });
// });

// get the sidebar and add the instructions
// const instructions = document.getElementById("instructions");
// const steps = data.legs[0].steps;

// let tripInstructions = "";
// for (const step of steps) {
//   tripInstructions += `<li>${step.maneuver.instruction}</li>`;
// }
// instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
//   data.duration / 60
// )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
