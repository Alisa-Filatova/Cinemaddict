import {FilmState, UserRank} from '../enums';
import {USER_RANK_VALUES} from '../constants';
import {calcCountFilmsWithStatus} from './calc-count-films-with-status';

/**
 * Рассчет звания пользователя
 * @param {Array} films
 * @return {String}
 */

export const getUserRank = (films) => {
  const count = calcCountFilmsWithStatus(films, FilmState.WATCHED);

  if (count <= USER_RANK_VALUES.novice.max && count >= USER_RANK_VALUES.novice.min) {
    return UserRank.NOVICE;
  } else if (count >= USER_RANK_VALUES.fan.min && count < USER_RANK_VALUES.movieBuff.min) {
    return UserRank.FAN;
  } else if (count >= USER_RANK_VALUES.movieBuff.min) {
    return UserRank.MOVIE_BUFF;
  } else {
    return null;
  }
};
