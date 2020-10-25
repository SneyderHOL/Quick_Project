const geolib = require('geolib');

const AREA = [
  [1.549626, -78.938278],
  [1.365109, -78.714303],
  [1.248884, -78.548769],
  [1.193604, -78.438173],
  [1.198804, -78.305183],
  [0.937178, -78.130096],
  [0.860027, -77.937037],
  [0.857670, -77.705146],
  [0.794692, -77.638021],
  [0.693719, -77.615999],
  [0.672786, -77.465280],
  [0.446573, -77.455482],
  [0.252178, -76.864446],
  [0.447138, -76.263078],
  [0.149971, -75.836645],
  [-0.081618, -74.826307],
  [-1.661783, -73.380923],
  [-2.243597, -72.382699],
  [-2.131663, -71.017514],
  [-2.667294, -69.956611],
  [-3.470612, -70.533641],
  [-3.787946, -70.680284],
  [-4.169510, -69.945412],
  [-1.399205, -69.651939],
  [-0.465448, -69.632409],
  [-0.182123, -70.063267],
  [0.586417, -70.056927],
  [0.632291, -69.117052],
  [1.062618, -69.199571],
  [1.203811, -69.811575],
  [1.773241, -69.796295],
  [1.801448, -68.090022],
  [2.253679, -67.388933],
  [1.158082, -67.160672],
  [1.320225, -66.882424],
  [2.327110, -67.224655],
  [2.855519, -67.881220],
  [3.436502, -67.312653],
  [4.015665, -67.754338],
  [5.286322, -67.983169],
  [5.996970, -67.444363],
  [6.310186, -67.534709],
  [6.130578, -68.703216],
  [6.369524, -69.483527],
  [7.000458, -70.116150],
  [7.196303, -71.043069],
  [7.049664, -71.955840],
  [7.446089, -72.386493],
  [7.685748, -72.483151],
  [8.330949, -72.392092],
  [8.609140, -72.642059],
  [9.401635, -72.814433],
  [9.239284, -73.398816],
  [10.308690, -72.985160],
  [11.156464, -72.245746],
  [11.619264, -72.003047],
  [11.995167, -71.124865],
  [12.627092, -71.300982],
  [12.302208, -72.152118],
  [11.301842, -73.335079],
  [11.397205, -74.170020],
  [11.133221, -74.885110],
  [10.808662, -75.555300],
  [10.415781, -75.829650],
  [9.574350, -75.684150],
  [9.202851, -76.401451],
  [8.829173, -76.624254],
  [8.595183, -76.968101],
  [8.012522, -76.853260],
  [8.753504, -77.371795],
  [7.972204, -77.357255],
  [7.738010, -77.807047],
  [7.189466, -78.095907],
  [6.602544, -77.403098],
  [3.356307, -77.479205],
  [1.645653, -79.024881],
  [1.648629, -79.025772],
  [1.549626, -78.938278]
];
//   {
//     "lat": 4.713364,
//     "lng": -74.069909
//   }
module.exports.limits = (points) => {
  return geolib.isPointInPolygon([points.lat, points.lng], AREA);
};

/**
 * find the Min, Max latitute and longitude
 * return: area object with minimum latitude and longitude, maximum latitude and longitude
 */
module.exports.findSearchArea = function (sectionPoints) {
  let maxLatitude = sectionPoints[0][1];
  let minLatitude = maxLatitude;
  let maxLongitude = sectionPoints[0][0];
  let minLongitude = maxLongitude;
  let point = null;
  for (let i = 0; i < sectionPoints.length; i++) {
    point = sectionPoints[i];
    if (point[1] > maxLatitude) {
      maxLatitude = point[1];
    } else if (point[1] < minLatitude) {
      minLatitude = point[1];
    }
    if (point[0] > maxLongitude) {
      maxLongitude = point[0];
    } else if (point[0] < minLongitude) {
      minLongitude = point[0];
    }
  }
  const area = {
    lat: {
      min: minLatitude,
      max: maxLatitude
    },
    lng: {
      min: minLongitude,
      max: maxLongitude
    }
  };
  return area;
};

/**
 * adjust the area points according to origin and destination
 */
module.exports.adjustSearchAreaPoints = function (areaPoints, originPoint, destinationPoint, sectionDirection) {
  if (sectionDirection.lat === 1) {
    originPoint.lat = areaPoints.lat.max;
    destinationPoint.lat = areaPoints.lat.min;
    if (sectionDirection.lng === 3) {
      originPoint.lng = areaPoints.lng.max;
      destinationPoint.lng = areaPoints.lng.min;
    } else {
      originPoint.lng = areaPoints.lng.min;
      destinationPoint.lng = areaPoints.lng.max;
    }
  } else {
    originPoint.lat = areaPoints.lat.min;
    destinationPoint.lat = areaPoints.lat.max;
    if (sectionDirection.lng === 3) {
      originPoint.lng = areaPoints.lng.max;
      destinationPoint.lng = areaPoints.lng.min;
    } else {
      originPoint.lng = areaPoints.lng.min;
      destinationPoint.lng = areaPoints.lng.max;
    }
  }
};
