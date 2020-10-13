/**
 * categorization of costs according to vehicle and tolls
 * return: cost of tolls in route
 */
exports.total = async (tolls, vehicle) => {
  const numberToRome = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
  var costs = 0;
  await tolls.forEach((element) => {
    var category = vehicle[0].category;
    var group = category['group' + element.group.toString()];
    costs += element.costs[numberToRome[group]];
  });
  return costs;
};
