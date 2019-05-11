// This script is loaded inside the active tab when HTML2VR is enabled from popup

// TODO: support chrome
/* eslint-disable */
const API = browser || chrome;
/* eslint-enable */

// eslint-disable-next-line func-names
(function () {
  if (window.hasHTML2VRRun) return;
  window.hasHTML2VRRun = true;

  const scriptLocation = 'https://tuur29.github.io/html2vr/library/dist/html2vr.min.js';
  const supportedURLs = [ // Needs to be synced with supportedURLs in popup.html
    {
      url: '*://*.tuurlievens.net/*',
      properties: { // you can omit "data-html2vr-"
        'page-type': 'grid',
        selector: '.card .thumbnail',
      },
      settings: {
        columnCount: 3,
      },
    },
  ];

  // Source: https://stackoverflow.com/a/32402438
  function matchRule(str, rule) { // function to use simple wildcard matching (like in manifest.json)
    return new RegExp('^' + rule.split('*').join('.*') + '$').test(str);
  }

  function inject() {
    // TODO: check if site natively implemented HTML2VR and instead use those parameters
    // find correct config
    const site = supportedURLs.find(s => matchRule(window.location.href, s.url));
    if (!site) return;

    // load correct properties from supportedUrls array
    Object.entries(site.properties).forEach(([key, value]) => {
      document.body.setAttribute('data-html2vr-' + key, value);
    });

    // open vr popup
    const scripts = window.document.createRange().createContextualFragment(`
      <script id="html2vr-lib" src="${scriptLocation}"></script>
      <script id="html2vr-lib-init">
        var script = document.head.querySelector("#html2vr-lib");
        script.onload = function() {
          html2vr.openPopup(JSON.parse('${JSON.stringify(site.settings)}'))
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
    // TODO: close HTML2VR popup on reset
  }

  API.runtime.onMessage.addListener((message) => {
    if (message.command === 'inject') {
      inject();
    } else if (message.command === 'reset') {
      reset();
    }
  });
}());
