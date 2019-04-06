import {createFilmCard} from './create-film-card';

export const getFilmsData = (amount) =>
  Array.from({length: amount}).map(() => createFilmCard());
