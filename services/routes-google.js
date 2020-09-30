const fetch = require('node-fetch');
const fs = require('fs');

const key = process.env.GOOGLE_API;

const routesGoogle = (coordenates) => {
  const url = 'https://maps.googleapis.com/maps/api/directions/json?' +
    `origin=${coordenates.ini.lat},${coordenates.ini.lng}` +
    `&destination=${coordenates.end.lat},${coordenates.end.lng}` +
    `&key=${key}`;

  const requestRoutes = async (url) => {
    const response = await fetch(url);
    return response.json();
  };
  requestRoutes(url)
    .then(data => fs.writeFileSync('file.json', JSON.stringify(data)));
};

/* TEST THE FUCNTION
  const coordenates = {
   "ini": {
     "lat": 4.6162642,
     "lng": -74.1366968,
     "address": "Calle 32 # 20 - 68, Bogotá, Colombia"
   },
   "end": {
     "lat": 10.3950646,
     "lng": -75.4857664,
     "address": "Carrea 62 # 15A - 12, Cartagena, Colombia"
   }
 }
 routesGoogle(coordenates)
*/

module.exports = {
  routesGoogle
};
