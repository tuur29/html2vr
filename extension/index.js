// This script is loaded inside the active tab when HTML2VR is enabled from popup

/* global helpers */
/* global API */
/* global supportedURLs */

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

    // TODO: popup closing and listener dont work after navigating away from page
    // reset button in popup on vrpopup close
    document.addEventListener('html2vr-popupClosed', () => {
      API.save({ started: false });
    }, false);

    // open vr popup
    const scriptLocation = API.getURL('./lib/html2vr.min.js');
    const scripts = window.document.createRange().createContextualFragment(`
      <script id="html2vr-lib" src="${scriptLocation}"></script>
      <script id="html2vr-lib-init">
        var script = document.head.querySelector("#html2vr-lib");
        script.onload = function() {
          var popup = html2vr.openPopup(JSON.parse('${JSON.stringify(site.settings || {})}'));
          popup.onbeforeunload = function() {
            document.dispatchEvent(new Event('html2vr-popupClosed'));
          };
          document.addEventListener('html2vr-closePopup', () => {
            if (popup) popup.close();
          }, false);
        };
      </script>
    `);
    window.document.head.appendChild(scripts);
  }

  function reset() {
    document.querySelectorAll('[id^=html2vr]').forEach((el) => {
      el.parentElement.removeChild(el);
    });
    window.hasHTML2VRRun = false;
    document.dispatchEvent(new Event('html2vr-closePopup'));
  }

  // initialize html2vr
  if (site) {
    inject();
    API.addMessageListener((message) => {
      if (message.command === 'start') {
        start();
      } else if (message.command === 'reset') {
        reset();
      }
    });
  }
}());
