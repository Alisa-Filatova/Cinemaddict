import {createFilmCard} from '../mocks/create-film-card';
/**
 * @param {Number} amount
 * @return {Object}
 */
export const getFilmsData = (amount) =>
  Array.from({length: amount}).map(() => createFilmCard());
