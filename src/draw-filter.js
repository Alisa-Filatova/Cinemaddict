export default ({name, link, count, active}) => (
  `<a href="${link}" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">${name} 
   ${count === null ? `` : `<span class="main-navigation__item-count"> ${count}</span>`}</a>`
);
