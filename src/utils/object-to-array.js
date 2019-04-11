export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};
