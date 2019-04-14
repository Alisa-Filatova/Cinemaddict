import {FilmState, UserRank} from '../enums';
import {calcCountFilmsWithStatus} from './calc-count-films-with-status';

/**
 * Рассчет звания пользователя
 * @param {Array} films
 * @return {String}
 */

export const getUserRank = (films) => {
  const count = calcCountFilmsWithStatus(films, FilmState.WATCHED);

  if (count <= 10 && count !== 0) {
    return UserRank.NOVICE;
  } else if (count >= 11 && count < 20) {
    return UserRank.FAN;
  } else if (count >= 20) {
    return UserRank.MOVIE_BUFF;
  } else {
    return null;
  }
};
