
// Helper functions, some also found in library/src/helpers.js

// eslint-disable-next-line no-unused-vars
const helpers = {

  $: (...args) => document.querySelector(...args),

  detectWebGL: () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl && gl instanceof WebGLRenderingContext;
  },

  detectWebVR: () => 'getVRDisplays' in navigator,

  // Source: https://stackoverflow.com/a/32402438
  // function to use simple wildcard matching (like in manifest.json)
  matchRule: (str, rule) => new RegExp('^' + rule.split('*').join('.*') + '$').test(str),

  // check if site natively defined HTML2VR  parameters
  checkIfParametersSet: () => {
    const props = Array.from(document.body.attributes)
                    .filter(a => a.name.indexOf('data-html2vr') === 0);
    return props.length > 0;
  },

  checkIfLibraryIsLoaded: () => {
    const scripts = Array.from(document.querySelectorAll('script'))
                      .filter(s => s.src.includes('html2vr.min.js'));
    return scripts.length > 0;
  },

};
