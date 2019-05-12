// This script if loaded in the browser extension popup

/* global helpers */
/* global API */
/* global supportedURLs */

// Variables
let disabled = false;
let started = false;
let selectedTab = {};

// Show if page supported
function setup(tabs) {
  [selectedTab] = tabs;

  // show message and disable button if WebGL/VR not supported
  if (!helpers.detectWebGL()) {
    helpers.$('#error').innerHTML = 'WebGL isn\'t supported by your API.<br>Make sure you GPU drivers are up to date.';
    helpers.$('#button').setAttribute('disabled', true);
    disabled = true;
    return;
  }

  if (!helpers.detectWebVR()) {
    helpers.$('#info').innerHTML = 'Unfortunately your API does not support WebVR yet.<br>You can still view the page in 3D';
  }

  // show message if site not supported
  const match = supportedURLs.find(u => helpers.matchRule(selectedTab.url, u.url));
  if (!match) {
    helpers.$('#error').innerHTML = `
      <img 
        src='${selectedTab.favIconUrl}'
        style='width: 16px; height: 16px; margin: 4px; display: ${selectedTab.favIconUrl ? 'block' : 'none'}'
      />
      <span>The site ${selectedTab.title} is not supported.</span>
    `;
    helpers.$('#button').setAttribute('disabled', true);
    disabled = true;
    return;
  }

  // show confirmation site is supported
  helpers.$('#success').innerHTML = `
    <img src='${selectedTab.favIconUrl}' style='width: 16px; height: 16px; margin: 4px;' />
    <span>${selectedTab.title} <br/>is supported!</span>
  `;
}

// Toggle button
helpers.$('#button').addEventListener('click', () => {
  if (disabled) return;
  started = !started;

  helpers.$('#info').innerHTML = started ? 'Please allow API popups on the current site' : '';
  helpers.$('#button').innerHTML = started ? 'Disable' : 'Start in VR';

  API.storage.local.set({ started });

  setTimeout(() => {
    API.tabs.sendMessage(selectedTab.id, {
      command: started ? 'start' : 'reset',
    });
  }, 500); // timeout so people can read popup message
});

// Initialize
API.tabs.query({ active: true, currentWindow: true }).then(setup);
