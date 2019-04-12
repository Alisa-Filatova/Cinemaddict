/**
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
export const getRandomInteger = (max, min = 0) => Math.floor(Math.random() * (max - min) + min);

