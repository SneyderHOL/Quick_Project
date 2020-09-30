
// Find the direction of the route according to origin and destination
function findDirection (origin, destination) {
  if (typeof (origin) !== 'object' || typeof (destination) !== 'object') {
    console.log('Wrong input type');
    return;
  }
  /* Directions: 1- North - South
     2- South - North
     3- East - West
     4- West - East
  */
  const latitudeDirection = (origin.lat > destination.lat) ? 1 : 2;
  const longitudeDirection = (origin.lng > destination.lng) ? 3 : 4;

  return [latitudeDirection, longitudeDirection];
}
