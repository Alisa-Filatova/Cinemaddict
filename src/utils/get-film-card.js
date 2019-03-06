import {compareRandom} from './compare-random';
import {generateRandomNumber} from './generate-random-number';
import {getRandomArrayElement} from './get-random-array-element';

const titles = [
  `Mr Nobody`,
  `The Lord if the Rings`,
  `The Elephant Man`,
  `Fight Club`,
  `The Pianist`,
  `Schindler's List`,
  `Barfuss`,
  `Catch Me If You Can`,
  `Shutter Island`,
  `Seven`,
  `Whiplash`,
  `The Pursuit of Happiness`,
  `Butterfly Effect`,
  `Sisters`,
  `Star Wars`,
];

const posters = [
  `moonrise`,
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `three-friends`,
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, 
  non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam 
  id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, 
  sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, 
  eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis 
  suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const ratings = [8.7, 9.1, 3.5, 7.2, 10, 4.1];
const years = [1990, 1987, 2011, 1930, 2019, 1975];
const durations = [`1h 30m`, `2h 10m`, `1h 00m`, `0h 45m`, `2h 05m`];
const genres = [`Comedy`, `Action`, `Fantasy`, `Epic`, `History`, `Dram`];
const commentsCountSet = [200, 9, 1, 23, 20, 50, 78];

export const getFilmCard = () => ({
  title: getRandomArrayElement(titles),
  poster: `./images/posters/${getRandomArrayElement(posters)}.jpg`,
  description: description.split(`. `).sort(compareRandom).slice(0, generateRandomNumber(2)).join(`. `),
  rating: getRandomArrayElement(ratings),
  year: getRandomArrayElement(years),
  duration: getRandomArrayElement(durations),
  genre: getRandomArrayElement(genres),
  commentsCount: getRandomArrayElement(commentsCountSet),
});
