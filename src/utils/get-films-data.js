import {createFilmCard} from '../mocks/create-film-card';

export const getFilmsData = (amount) =>
  Array.from({length: amount}).map(() => createFilmCard());
