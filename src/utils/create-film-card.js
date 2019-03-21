import {compareRandom} from './compare-random';
import {generateRandomNumber} from './generate-random-number';
import {getRandomArrayElement} from './get-random-array-element';
import {EMOJIES, MAX_SENTENCES_FOR_FILM_DESCRIPTION, DAY_LENGTH, WEEKDAYS_COUNT} from '../constants';

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

const allGenres = [`Comedy`, `Action`, `Fantasy`, `Epic`, `History`, `Dram`];
const directors = [`Steven Spielberg`, `Peter Jackson`, `Paul Anderson`, `James Cameron`, `Tim Burton`];
const writersList = [`Christopher Nolan`, `Luc Besson`, `Martin Scorsese`, `Guy Richie`, `Stephen King`];
const actorsList = [`Brad Pitt`, `Hugh Laurie`, `Nichole Kidman`, `Jhonny Depp`, `Jim Carrey`, `Kate Winslet`];
const ages = [18, 10, 6, 16, 3];
const countries = [`USA`, `Canada`, `Russia`, `France`, `England`];
const [sleeping, happy] = [EMOJIES[0].emoji, EMOJIES[2].emoji];
const allComments = [
  {
    emoji: sleeping,
    comment: `So boring...`,
    userName: `Vasya Pupkin`,
    date: Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  },
  {
    emoji: happy,
    comment: `Like it...`,
    userName: `Ann Hetaway`,
    date: Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  }
];

export const createFilmCard = () => ({
  title: getRandomArrayElement(titles),
  titleOriginal: getRandomArrayElement(titles),
  director: getRandomArrayElement(directors),
  poster: `./images/posters/${getRandomArrayElement(posters)}.jpg`,
  description:
    description.split(`. `)
      .sort(compareRandom)
      .slice(0, generateRandomNumber(MAX_SENTENCES_FOR_FILM_DESCRIPTION))
      .join(`. `),
  writers:
    writersList
      .sort(compareRandom)
      .slice(0, generateRandomNumber(writersList.length))
      .join(`, `),
  actors:
    actorsList
      .sort(compareRandom)
      .slice(0, generateRandomNumber(actorsList.length))
      .join(`, `),
  rating: (Math.random() * (10 - 2 + 1) + 2).toFixed(1),
  score: (Math.random() * (10 - 2 + 1) + 2).toFixed(1),
  date: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  releaseDate: Date.now() - Math.floor(Math.random() * WEEKDAYS_COUNT) * DAY_LENGTH,
  country: getRandomArrayElement(countries),
  duration: new Date(Math.floor(Math.random() * 60) * 5 * 60 * 1000),
  runtime: new Date(Math.floor(Math.random() * 60) * 5 * 60 * 1000),
  genre: getRandomArrayElement(allGenres),
  genres: allGenres.sort(compareRandom).join(`, `),
  releaseCountry: getRandomArrayElement(countries),
  comments: allComments,
  ageLimit: getRandomArrayElement(ages),
});
