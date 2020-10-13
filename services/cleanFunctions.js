/**
 * Clean path from google API
 * return: list of paths with start and end coordinates
 */
module.exports.cleanPathFunction = function (steps) {
  const path = [];
  for (let i = 0; i < steps.length; i++) {
    const points = {
      start: steps[i].start_location,
      end: steps[i].end_location
    };
    path.push(points);
  }
  return path;
};

/**
 * Clean tolls array
 * return: list of tolls with coordinates and name
 */
module.exports.cleanTollsFunction = function (tolls) {
  const tollsList = [];
  for (let i = 0; i < tolls.length; i++) {
    // console.log(tolls[i]);
    const toll = {
      coordinates: tolls[i].coordinates,
      name: tolls[i].name
    };
    tollsList.push(toll);
  }
  return tollsList;
};
