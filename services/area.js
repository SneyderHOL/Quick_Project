
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
