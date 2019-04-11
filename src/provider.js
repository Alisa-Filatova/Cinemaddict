import ModelFilmCard from './models/film-card';
import {objectToArray} from './utils';

const Provider = class {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(ModelFilmCard.parseFilmCard(film));
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((film) => this._store.setItem({key: film.id, item: film.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelFilmCard.parseFilmCards(rawFilms);

      return Promise.resolve(films);
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};

export default Provider;
