export default ({name, count, active}) => (
  `<a href="" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">${name} 
   ${count === null ? `` : `<span class="main-navigation__item-count"> ${count}</span>`}</a>`
);
