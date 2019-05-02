
export const defaultConfig = {

  // for grid page
  columnCount: 4,

  // css color
  backgroundColor: '#cecece',

  // TODO: test relative url?
  // TODO: change this to path in node_modules when useing devserver?
  // can be url to different cdn or absolute path to local
  aframeUrl: 'https://aframe.io/releases/0.9.1/aframe.min.js',
  aframeExtrasUrl: 'https://cdn.rawgit.com/donmccurdy/aframe-extras/v6.0.0/dist/aframe-extras.min.js',
  superhandsUrl: 'https://unpkg.com/super-hands@3.0.0/dist/super-hands.min.js',

  // only set this to a absolute link when the browser cant find the library in the popup
  scriptLocation: undefined,

};
