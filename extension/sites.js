/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */

/**
* Example: (more info on https://tuur29.github.io/html2vr/library/)
*
* @example
* {
*   'url': '*://*.domain.com/*',
*   'properties': { // you can omit "data-html2vr-"
*     'page-type': 'grid',
*     'selector': '#nav a',
*   },
*   'settings': {
*     'columnCount': 2,
*   },
*   render: (settings) => {
*     return '<a-text value="hi" />';
*   },
* },
*
*/
const supportedURLs = [
  // Android page of Portfolio
  {
    'url': '*://*.tuurlievens.net/android',
    'properties': {
      'page-type': 'grid',
      'selector': '.card .photo:not(.hidden)',
    },
  },

  // Reddit
  {
    'url': '*://old.reddit.com/r/*/comments/*',
    'properties': {
      'page-type': 'detail',
      'selector': 'a.title',
    },
    'render': (params) => {
      // unfortunatly this doesnt work thanks to CORS
      const src = document.querySelector('.thing .thumbnail img').src;
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
    'properties': {
      'page-type': 'grid',
      'selector': '.thing .thumbnail',
    },
  },

  // Imgur
  {
    'url': '*://imgur.com/gallery/*',
    'properties': {
      'page-type': 'image',
      'selector': '.post-image img',
    },
    'settings': {
      'backgroundColor': '#333',
    },
  },
  {
    'url': '*://imgur.com/t/*/*',
    'properties': {
      'page-type': 'image',
      'selector': '.post-image img',
    },
    'settings': {
      'backgroundColor': '#333',
    },
  },
  {
    'url': '*://imgur.com/*',
    'properties': {
      'page-type': 'grid',
      'selector': '.Post-item',
    },
    'settings': {
      'backgroundColor': '#333',
    },
  },

  // Youtube (Cors blocks all images)
  // {
  //   'url': '*://*.youtube.com/watch?*',
  //   'properties': {
  //     'page-type': 'detail',
  //     'selector': '#info-contents h1',
  //   },
  // },
  // {
  //   'url': '*://*.youtube.com/*',
  //   'properties': {
  //     'page-type': 'list',
  //     'selector': 'ytd-thumbnail',
  //   },
  // },

];
