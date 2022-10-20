// can use this code to load in vector tiles of all POI's in NYC

ap.on("load", () => {
  map.addSource("jpegmountainman.8dcxy04p", {
    type: "vector",
    // Use any Mapbox-hosted tileset using its tileset id.
    // Learn more about where to find a tileset id:
    // https://docs.mapbox.com/help/glossary/tileset-id/
    url: "mapbox://jpegmountainman.8dcxy04p",
  });
  map.addLayer({
    id: "jpegmountainman.8dcxy04p",
    type: "circle",
    source: "jpegmountainman.8dcxy04p",
    "source-layer": "Points_Of_Interest-616pti",
    paint: {
      // Make circles larger as the user zooms from z12 to z22.
      "circle-radius": {
        base: 1.75,
        stops: [
          [12, 2],
          [22, 180],
        ],
      },
      // Color circles by ethnicity, using a `match` expression.
      "circle-color": [
        "match",
        ["get", "borough"],
        "1",
        "#fbb03b",
        "4",
        "#223b53",
        "3",
        "#e55e5e",
        "2",
        "#3bb2d0",
        /* other */ "#ccc",
      ],
    },
  });
});

// const poly1 = map.on("load", () => {
//   // Add a data source containing GeoJSON data.
//   map.addSource("lowerMan", {
//     type: "geojson",
//     data: {
//       type: "Feature",
//       geometry: {
//         type: "Polygon",
//         // These coordinates outline Maine.
//         coordinates: [
//           [
//             [-74.01656946883831, 40.71514242151838],
//             [-73.99009771828993, 40.71564440194771],
//             [-73.9816479968161, 40.70796121158713],
//             [-74.01662127020676, 40.70339402883093],
//             [-74.01656946883831, 40.71514242151838],
//           ],
//         ],
//       },
//     },
//   });

//   // Add a new layer to visualize the polygon.
//   map.addLayer({
//     id: "lowerMan",
//     type: "fill",
//     source: "lowerMan", // reference the data source
//     layout: {},
//     paint: {
//       "fill-color": "#0080ff", // blue color fill
//       "fill-opacity": 0.3,
//     },
//   });
//   // Add a black outline around the polygon.
//   map.addLayer({
//     id: "outline",
//     type: "line",
//     source: "lowerMan",
//     layout: {},
//     paint: {
//       "line-color": "#000",
//       "line-width": 2,
//     },
//   });
// });

map.on("load", () => {
  // Add a data source containing GeoJSON data.
  map.addSource("maine", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        // These coordinates outline Maine.
        coordinates: [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745],
          ],
        ],
      },
    },
  });

  // can use this to add a polygon

  // Add a new layer to visualize the polygon.
  map.addLayer({
    id: "maine",
    type: "fill",
    source: "maine", // reference the data source
    layout: {},
    paint: {
      "fill-color": "#0080ff", // blue color fill
      "fill-opacity": 0.5,
    },
  });
  // Add a black outline around the polygon.
  map.addLayer({
    id: "outline",
    type: "line",
    source: "maine",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });
});

// use this to add polygon to map and search for points within
// returns boolean

var searchWithin = turf.polygon([
  [
    [-74.01656946883831, 40.71514242151838],
    [-73.99009771828993, 40.71564440194771],
    [-73.9816479968161, 40.70796121158713],
    [-74.01662127020676, 40.70339402883093],
    [-74.01656946883831, 40.71514242151838],
  ],
]);

console.log(pt);
var ptWithin = turf.inside(pt, searchWithin);
console.log(ptWithin);

if (ptWithin === true) {
  console.log(`You are in Lower Manhattan!`);
} else {
  console.log(`this is not in the study area. try again.`);
}

// Add an image to use as a custom marker
map.on("load", () => {
  map.loadImage(
    "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
    (error, image) => {
      if (error) throw error;
      map.addImage("custom-marker", image);
      // Add a GeoJSON source with 2 points
      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              // feature for Mapbox DC
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-73.99106999861966, 40.73005400028978],
              },
              properties: {
                title: "4-6-6 Express",
              },
            },
            {
              // feature for Mapbox SF
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-74.00019299927328, 40.71880300107709],
              },
              properties: {
                title: "4-6-6 Express",
              },
            },
            {
              // feature for Mapbox SF
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-73.98384899986625, 40.76172799961419],
              },
              properties: {
                title: "1-2",
              },
            },
            {
              // feature for Mapbox SF
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-73.97499915116808, 40.68086213682956],
              },
              properties: {
                title: "2-3-4",
              },
            },
          ],
        },
      });

      // Add a symbol layer
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "custom-marker",
          // get the title name from the source's "title" property
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
        },
      });
    }
  );
});

//    var pt = turf.point([lng, Lat]);
//   var buffered = turf.buffer(pt, 1, { units: "miles" });
//   console.log(buffered);
//   console.log(pt);
