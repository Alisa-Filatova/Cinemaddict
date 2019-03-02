export default (title, list, extra) => (
  ` <section class="films-list${extra ? `--extra` : ``}">
      <h2 class="films-list__title ${extra ? `` : `visually-hidden`}">${title}</h2>
      <div class="films-list__container">${list}</div>
      ${extra ? `` : `<button class="films-list__show-more">Show more</button>`}
   </section>`
);
