import {compareRandom} from './compare-random';
import {generateRandomNumber} from './generate-random-number';
import {getRandomArrayElement} from './get-random-array-element';
import {
  EMOJIES,
  MAX_SENTENCES_FOR_FILM_DESCRIPTION,
  DAY_LENGTH,
  WEEKDAYS_COUNT,
  HOUR,
  MAX_RATE_NUMBER,
  BOOLEANS,
} from '../constants';

const TITLES = [
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

const POSTERS = [
  `moonrise`,
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `three-friends`,
];

const GENRES = [`Comedy`, `Action`, `Fantasy`, `Epic`, `History`, `Dram`];
const DIRECTORS = [`Steven Spielberg`, `Peter Jackson`, `Paul Anderson`, `James Cameron`, `Tim Burton`];
const WRITERS = [`Christopher Nolan`, `Luc Besson`, `Martin Scorsese`, `Guy Richie`, `Stephen King`];
const ACTORS = [`Brad Pitt`, `Hugh Laurie`, `Nichole Kidman`, `Jhonny Depp`, `Jim Carrey`, `Kate Winslet`];
const AGE_LIMITS = [0, 3, 6, 12, 16, 18];
const COUNTRIES = [`USA`, `Canada`, `Russia`, `France`, `England`];

const COMMENTS = [
  {
    emoji: EMOJIES.sleeping,
    comment: `So boring...`,
    userName: getRandomArrayElement(ACTORS),
    date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  },
  {
    emoji: EMOJIES.grinning,
    comment: `Like it...`,
    userName: getRandomArrayElement(ACTORS),
    date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  },
  {
    emoji: EMOJIES.grinning,
    comment: `So so...`,
    userName: getRandomArrayElement(ACTORS),
    date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  },
  {
    emoji: EMOJIES.sleeping,
    comment: `I'm slept`,
    userName: getRandomArrayElement(ACTORS),
    date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  }
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, 
  non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam 
  id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, 
  sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, 
  eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis 
  suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const createFilmCard = () => ({
  title: getRandomArrayElement(TITLES),
  titleOriginal: getRandomArrayElement(TITLES),
  director: getRandomArrayElement(DIRECTORS),
  poster: `./images/posters/${getRandomArrayElement(POSTERS)}.jpg`,
  description:
    description.split(`. `)
      .sort(compareRandom)
      .slice(0, generateRandomNumber(MAX_SENTENCES_FOR_FILM_DESCRIPTION))
      .join(`. `),
  writers:
    WRITERS
      .sort(compareRandom)
      .slice(0, generateRandomNumber(WRITERS.length))
      .join(`, `),
  actors:
    ACTORS
      .sort(compareRandom)
      .slice(0, generateRandomNumber(ACTORS.length))
      .join(`, `),
  rating: (Math.random() * (MAX_RATE_NUMBER - 2 + 1) + 2).toFixed(1),
  score: generateRandomNumber(MAX_RATE_NUMBER),
  date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  releaseDate: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  country: getRandomArrayElement(COUNTRIES),
  duration: new Date(Math.floor(Math.random() * HOUR) * 5 * HOUR * 1000),
  runtime: new Date(Math.floor(Math.random() * HOUR) * 5 * HOUR * 1000),
  genre: getRandomArrayElement(GENRES),
  genres: GENRES.sort(compareRandom).join(`, `),
  releaseCountry: getRandomArrayElement(COUNTRIES),
  comments: COMMENTS.slice(0, generateRandomNumber(COMMENTS.length)),
  ageLimit: getRandomArrayElement(AGE_LIMITS),
  isFavorite: getRandomArrayElement(BOOLEANS),
  isWatched: getRandomArrayElement(BOOLEANS),
  isInWatchlist: getRandomArrayElement(BOOLEANS),
});
