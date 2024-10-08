export const getProductsFilteredbyValues = (values = {}, subProducts = []) =>
  Object.keys(values).reduce(
    (acum, item) =>
      // eslint-disable-next-line eqeqeq
      acum.filter(x => x.variants[item] == values[item]),
    subProducts,
  ); // return a native array

export const getVariantFromSubProducts = (subProducts = []) =>
  subProducts.reduce((accumulator, item) => {
    Object.keys(item.variants || {}).forEach(key => {
      accumulator[key] = (accumulator[key] || [])
        .concat(item.variants[key])
        .filter((elem, pos, arr) => arr.indexOf(elem) === pos); // ensure unique values
    });
    return accumulator;
  }, {}); // return an object

export const getVariantsFilteredbyValues = (values = {}, subProducts = []) =>
  getVariantFromSubProducts(getProductsFilteredbyValues(values, subProducts));

export const checkCanBuyProductQuantity = (
  pQuantity,
  pAvailable,
  pOnDemand,
) => {
  if (pQuantity > pAvailable && !pOnDemand) {
    return false;
  }
  return true;
};

export const checkProductMaxPurcahseAmount = (pQuantity, pMaxPurchase) => {
  if (pQuantity > pMaxPurchase) {
    return false;
  }
  return true;
};

export const ONDEMAND = 'ondemand';
export const ONSTOCK = 'onstock';

const paramKeys = /:(\w+)/g;
export const paramReplace = (text, params = {}) =>
  text.replace(paramKeys, (_, key) => params[key] || key);
