class ModelFilmCard {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`] || ``;
    this.titleOriginal = data[`film_info`][`alternative_title`] || ``;
    this.description = data[`film_info`][`description`] || ``;
    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`] || `-`;
    this.actors = data[`film_info`][`actors`] || [];
    this.poster = data[`film_info`][`poster`] || ``;
    this.releaseDate = data[`film_info`][`release`][`release_date`];
    this.country = data[`film_info`][`release`][`release_country`] || `-`;
    this.rating = data[`film_info`][`total_rating`] || 0.0;
    this.score = [`user_details`][`personal_rating`] || 0;
    this.genres = data[`film_info`][`genre`] || [];
    this.ageLimit = data[`film_info`][`age_rating`] || 0;
    this.releaseCountry = data[`film_info`][`release`][`release_country`] || `-`;
    this.comments = data[`comments`] || [];
    this.duration = data[`film_info`][`runtime`] || ``;

    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
  }

  static parseFilmCard(data) {
    return new ModelFilmCard(data);
  }

  static parseFilmCards(data) {
    return data.map(ModelFilmCard.parseFilmCard);
  }
}

export default ModelFilmCard;
