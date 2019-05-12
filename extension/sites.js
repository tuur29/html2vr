/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */

/**
Example: (more info on https://tuur29.github.io/html2vr/library/)

{
  'url': '*://*.domain.com/*',
  'properties': {
    'page-type': 'grid',
    'selector': '#nav a',
  },
  'settings': {
    'columnCount': 2,
  },
  render: (settings) => {
    return '<a-text value="hi" />';
  },
},

*/
const supportedURLs = [
  // part of Portfolio
  {
    'url': '*://*.tuurlievens.net/android',
    'properties': {
      'page-type': 'grid',
      'selector': '.card .photo img',
    },
  },

  // Reddit
  {
    'url': '*://old.reddit.com/r/*/comments/*',
    'properties': { // you can omit "data-html2vr-"
      'page-type': 'detail',
      'selector': 'a.title',
    },
    'render': (params) => {
      const src = 'https:' + document.querySelector('.thing .thumbnail img').getAttribute('src');
      return `
        <a-image
          class="html2vr-element clickable"
          position="-1 1.5 -6"
          width="1" height="1"
          src="${src}" />
      `;
    },
  },
  {
    'url': '*://old.reddit.com/*',
    'properties': { // you can omit "data-html2vr-"
      'page-type': 'grid',
      'selector': '.thing .thumbnail img',
    },
  },

];
