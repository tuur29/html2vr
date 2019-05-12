// This script is loaded inside the active tab when HTML2VR is enabled from popup

// TODO: support chrome
/* eslint-disable */
const API = browser || chrome;
/* eslint-enable */

// eslint-disable-next-line func-names
(function () {
  if (window.hasHTML2VRRun) return;
  window.hasHTML2VRRun = true;

  const supportedURLs = [ // Needs to be synced with supportedURLs in popup.html
    {
      url: '*://*.tuurlievens.net/',
      properties: { // you can omit "data-html2vr-"
        'page-type': 'grid',
        selector: '#nav a',
      },
      settings: {
        columnCount: 2,
      },
    },
    {
      url: '*://*.tuurlievens.net/home',
      properties: { // you can omit "data-html2vr-"
        'page-type': 'grid',
        selector: '#nav a',
      },
      settings: {
        columnCount: 2,
      },
    },
    {
      url: '*://*.tuurlievens.net/android',
      properties: { // you can omit "data-html2vr-"
        'page-type': 'grid',
        selector: '.card .photo img',
      },
    },
  ];

  // Source: https://stackoverflow.com/a/32402438
  function matchRule(str, rule) { // function to use simple wildcard matching (like in manifest.json)
    return new RegExp('^' + rule.split('*').join('.*') + '$').test(str);
  }

  const site = supportedURLs.find(s => matchRule(window.location.href, s.url));

  // check if site natively implemented HTML2VR and instead use those parameters
  function checkIfLibraryAlreadyImplemented() {
    // based on function in ../library/src/helpers.js
    const props = Array.from(document.body.attributes)
      .filter(a => a.name.indexOf('data-html2vr') === 0);
    return props.length > 0;
  }

  function inject() {
    // find correct config
    if (checkIfLibraryAlreadyImplemented()) return;
    if (!site || !site.properties) return;

    // load correct properties from supportedUrls array
    Object.entries(site.properties).forEach(([key, value]) => {
      document.body.setAttribute('data-html2vr-' + key, value);
    });
  }

  function start() {
    if (checkIfLibraryAlreadyImplemented()) return;
    if (!site) return;

    if (document.querySelector('#html2vr-lib')) return;

    // open vr popup
    const scriptLocation = API.runtime.getURL('./lib/html2vr.min.js');
    const scripts = window.document.createRange().createContextualFragment(`
      <script id="html2vr-lib" src="${scriptLocation}"></script>
      <script id="html2vr-lib-init">
        var script = document.head.querySelector("#html2vr-lib");
        script.onload = function() {
          html2vr.openPopup(JSON.parse('${JSON.stringify(site.settings || {})}'))
        }
      </script>
    `);
    window.document.head.appendChild(scripts);
  }

  function reset() {
    document.querySelectorAll('[id^=html2vr]').forEach((el) => {
      el.parentElement.removeChild(el);
    });
    window.hasHTML2VRRun = false;
  }

  // initialize html2vr
  if (site) {
    inject();
    API.runtime.onMessage.addListener((message) => {
      if (message.command === 'start') {
        start();
      } else if (message.command === 'reset') {
        reset();
      }
    });
  }
}());
