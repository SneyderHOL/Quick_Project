/**
 * categorization of costs according to vehicle and tolls
 * return: cost of tolls in route
 */
exports.total = async (tolls, vehicle) => {
  const numberToRome = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
  var costs = 0;
  const arrayLen = tolls.length;
  for (let i = 0; i < arrayLen; i++) {
    var category = vehicle[0].category;
    var group = category['group' + tolls[i].group.toString()];
    // console.log(tolls[i].costs[numberToRome[group]]);
    tolls[i].priceToPay = tolls[i].costs[numberToRome[group]];
    // console.log(tolls[i].priceVehicle);
    costs += tolls[i].costs[numberToRome[group]];
  }
  return costs;
};
