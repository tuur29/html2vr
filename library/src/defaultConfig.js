/* global ENV */
import { getParentWindow } from './helpers';

export const defaultConfig = {

  // for grid page
  columnCount: 4,

  // css color
  backgroundColor: '#cecece',

  // can be url to different cdn or absolute path to local
  aframeUrl: ENV.DEV
    ? new URL('/aframe-v0.9.1.min.js', window.location.href.indexOf('http') < 0 ? getParentWindow().location.href : window.location.href).href
    : 'https://aframe.io/releases/0.9.1/aframe.min.js',

  aframeExtrasUrl: ENV.DEV
    ? new URL('/aframe-extras.min.js', window.location.href.indexOf('http') < 0 ? getParentWindow().location.href : window.location.href).href
    : 'https://cdn.rawgit.com/donmccurdy/aframe-extras/v6.0.0/dist/aframe-extras.min.js',

  superhandsUrl: ENV.DEV
    ? new URL('/super-hands.min.js', window.location.href.indexOf('http') < 0 ? getParentWindow().location.href : window.location.href).href
    : 'https://unpkg.com/super-hands@3.0.0/dist/super-hands.min.js',

  // only set this to a absolute link when the browser cant find the library in the popup
  scriptLocation: undefined,

};
