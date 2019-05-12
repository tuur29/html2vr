
// TODO: support chrome
/* eslint-disable */
const API = browser || chrome;
/* eslint-enable */

// Variables
let disabled = false;
let started = false;
let selectedTab = {};
const supportedURLs = [ // Based on list in index.js
  '*://*.tuurlievens.net/',
  '*://*.tuurlievens.net/home',
  '*://*.tuurlievens.net/android',
];

// Helper functions, some also found in library/src/helpers.js

const $ = (...args) => document.querySelector(...args);

function detectWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl && gl instanceof WebGLRenderingContext;
}

function detectWebVR() {
  return 'getVRDisplays' in navigator;
}

// Source: https://stackoverflow.com/a/32402438
function matchRule(str, rule) { // function to use simple wildcard matching (like in manifest.json)
  return new RegExp('^' + rule.split('*').join('.*') + '$').test(str);
}

// Show if page supported
function setup(tabs) {
  [selectedTab] = tabs;

  // show message and disable button if WebGL/VR not supported
  if (!detectWebGL()) {
    $('#error').innerHTML = 'WebGL isn\'t supported by your API.<br>Make sure you GPU drivers are up to date.';
    $('#button').setAttribute('disabled', true);
    disabled = true;
    return;
  }

  if (!detectWebVR()) {
    $('#info').innerHTML = 'Unfortunately your API does not support WebVR yet.<br>You can still view the page in 3D';
  }

  // show message if site not supported
  const match = supportedURLs.find(u => matchRule(selectedTab.url, u));
  if (!match) {
    $('#error').innerHTML = `
      <img 
        src='${selectedTab.favIconUrl}'
        style='width: 16px; height: 16px; margin: 4px; display: ${selectedTab.favIconUrl ? 'block' : 'none'}'
      />
      <span>The site ${selectedTab.title} is not supported.</span>
    `;
    $('#button').setAttribute('disabled', true);
    disabled = true;
    return;
  }

  // show confirmation site is supported
  $('#success').innerHTML = `
    <img src='${selectedTab.favIconUrl}' style='width: 16px; height: 16px; margin: 4px;' />
    <span>${selectedTab.title} <br/>is supported!</span>
  `;
}

// Toggle button
$('#button').addEventListener('click', () => {
  if (disabled) return;
  started = !started;

  $('#info').innerHTML = started ? 'Please allow API popups on the current site' : '';
  $('#button').innerHTML = started ? 'Disable' : 'Start in VR';

  API.storage.local.set({ started });

  setTimeout(() => {
    API.tabs.sendMessage(selectedTab.id, {
      command: started ? 'start' : 'reset',
    });
  }, 500);
});

// Initialize
API.tabs.query({ active: true, currentWindow: true }).then(setup);
