/**
 * Подсчет кол-ва фильмов по статусу
 *
 * @param {Array} films
 * @param {String} status
 * @return {Number}
 */
export const calcCountFilmsWithStatus = (films, status) => films.filter((film) => film[status]).length;
