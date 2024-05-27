function featureToArray(products, feature) {
  let featureArray = products.map((product) => {
    return product?.[feature];
  });

  featureArray = featureArray.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  return Object.entries(featureArray);
}

module.exports = featureToArray;
