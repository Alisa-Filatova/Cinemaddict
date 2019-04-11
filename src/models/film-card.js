class ModelFilmCard {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.titleOriginal = data[`film_info`][`alternative_title`] || `-`;
    this.description = data[`film_info`][`description`] || `-`;
    this.director = data[`film_info`][`director`] || `-`;
    this.writers = data[`film_info`][`writers`] || `-`;
    this.actors = data[`film_info`][`actors`] || [];
    this.poster = data[`film_info`][`poster`] || ``;
    this.releaseDate = data[`film_info`][`release`][`release_date`];
    this.country = data[`film_info`][`release`][`release_country`] || `-`;
    this.rating = data[`film_info`][`total_rating`] || 0;
    this.score = data[`user_details`][`personal_rating`] || 0;
    this.genres = data[`film_info`][`genre`] || [];
    this.ageLimit = data[`film_info`][`age_rating`] || 0;
    this.comments = data[`comments`] || [];
    this.duration = data[`film_info`][`runtime`] || 0;
    this.watchDate = data[`user_details`][`watching_date`];
    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.title,
        'poster': this.poster,
        'alternative_title': this.titleOriginal,
        'actors': this.actors,
        'age_rating': this.ageLimit,
        'description': this.description,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country,
        },
        'runtime': this.duration,
        'genre': this.genres,
        'director': this.director,
        'writers': this.writers,
        'total_rating': this.rating,
        'personal_rating': this.score,
      },
      'comments': this.comments,
      'user_details': {
        'watchlist': this.isInWatchlist,
        'already_watched': this.isWatched,
        'favorite': this.isFavorite,
        'personal_rating': this.score,
        'watching_date': this.watchDate,
      }
    };
  }

  static parseFilmCard(data) {
    return new ModelFilmCard(data);
  }

  static parseFilmCards(data) {
    return data.map(ModelFilmCard.parseFilmCard);
  }
}

export default ModelFilmCard;
