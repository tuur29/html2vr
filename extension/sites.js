/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */

const supportedURLs = [
  {
    'url': '*://*.tuurlievens.net/',
    'properties': { // you can omit "data-html2vr-"
      'page-type': 'grid',
      'selector': '#nav a',
    },
    'settings': {
      'columnCount': 2,
    },
  },
  {
    'url': '*://*.tuurlievens.net/home',
    'properties': {
      'page-type': 'grid',
      'selector': '#nav a',
    },
    'settings': {
      'columnCount': 2,
    },
  },
  {
    'url': '*://*.tuurlievens.net/android',
    'properties': {
      'page-type': 'grid',
      'selector': '.card .photo img',
    },
  },
];
