#!/usr/bin/env node
const routesGoogle = (coordenates) => {
  const ulr = `maps.googleapis.com/maps/api/directions/json?`
  const query = `origin=${coordenates.ini.lat},${coordenates.ini.lng}&destination=${coordenates.end.lat},${coordenates.end.lat}&key=${coordenates.lat}`
}


module.exports = {
  routesGoogle
}

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
console.log(routesGoogle(coordenates))
