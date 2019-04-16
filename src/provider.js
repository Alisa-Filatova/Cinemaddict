import ModelFilmCard from './models/film-card';
import {objectToArray} from './utils/_common';

class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updateFilm({id, data}) {
    if (Provider._isOnline()) {
      return this._api.updateFilm({id, data}).then((film) => {
        this._store.setItem({key: film.id, item: film.toRAW()});
        return film;
      });
    }

    const film = data;
    this._needSync = true;
    this._store.setItem({key: film.id, item: film});

    return Promise.resolve(ModelFilmCard.parseFilmCard(film));
  }

  getFilms() {
    if (Provider._isOnline()) {
      return this._api.getFilms().then((films) => {
        films.map((film) => this._store.setItem({key: film.id, item: film.toRAW()}));
        return films;
      });
    }

    const rawFilmsMap = this._store.getAll();
    const rawFilms = objectToArray(rawFilmsMap);
    const films = ModelFilmCard.parseFilmCards(rawFilms);

    return Promise.resolve(films);
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  static _isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
