/* global ENV */

export const defaultConfig = {

  // for grid page
  columnCount: 4,

  // css color
  backgroundColor: '#cecece',

  // can be url to different cdn or absolute path to local
  aframeUrl: ENV.DEV
    ? `http://localhost:${ENV.PORT}/aframe-v0.9.1.min.js`
    : 'https://aframe.io/releases/0.9.1/aframe.min.js',

  aframeExtrasUrl: ENV.DEV
    ? `http://localhost:${ENV.PORT}/aframe-extras.min.js`
    : 'https://cdn.rawgit.com/donmccurdy/aframe-extras/v6.0.0/dist/aframe-extras.min.js',

  superhandsUrl: ENV.DEV
    ? `http://localhost:${ENV.PORT}/super-hands.min.js`
    : 'https://unpkg.com/super-hands@3.0.0/dist/super-hands.min.js',

  // only set this to a absolute link when the browser cant find the library in the popup
  scriptLocation: undefined,

};
