// This script is loaded inside the active tab when HTML2VR is enabled from popup

/* global helpers */
/* global API */
/* global supportedURLs */

// TODO: support chrome

// eslint-disable-next-line func-names
(function () {
  if (window.hasHTML2VRRun) return;
  window.hasHTML2VRRun = true;

  const site = supportedURLs.find(s => helpers.matchRule(window.location.href, s.url));

  function inject() {
    // find correct config
    if (helpers.checkIfParametersSet()) return;
    if (!site || !site.properties) return;

    // load correct properties from supportedUrls array
    Object.entries(site.properties).forEach(([key, value]) => {
      document.body.setAttribute('data-html2vr-' + key, value);
    });
  }

  function start() {
    if (helpers.checkIfLibraryIsLoaded()) return;
    if (!site) return;

    if (helpers.$('#html2vr-lib')) return;

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
