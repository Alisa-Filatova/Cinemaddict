import {compareRandom} from './compareRandom';
import {generateRandomNumber} from './generateRandomNumber';

export const getFilmCard = () => ({
  title: [
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
  ][generateRandomNumber(14)],
  poster: `./images/posters/${
    [
      `moonrise`,
      `accused`,
      `blackmail`,
      `blue-blazes`,
      `fuga-da-new-york`,
      `three-friends`
    ][generateRandomNumber(5)]}.jpg`,
  desc:
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, 
    non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam 
    id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, 
    sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, 
    eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis 
    suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
    .split(`. `).sort(compareRandom).slice(0, generateRandomNumber(2)).join(`. `),
  rating: [8.7, 9.1, 3.5, 7.2][generateRandomNumber(3)],
  year: [1990, 1987, 2011, 1930][generateRandomNumber(3)],
  duration: [`1h 30m`, `2h 10m`, `1h 00m`][generateRandomNumber(2)],
  genre: [`Comedy`, `Action`, `Fantasy`, `Epic`][generateRandomNumber(3)],
  commentsCount: [200, 9, 1, 23][generateRandomNumber(3)],
});
