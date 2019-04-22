
import { createExecutableNode } from './helpers';

export function open3DPopup(params = {}) {
  const location = params.scriptLocation || Array.from(document.querySelectorAll('script'))
    .filter(
      s => s.src.includes('html2vr.min.js'),
    )[0].src
    .replace(/[^/]*$/, '')
        + 'html2vr.min.js';

  const popup = window.open('', 'HTML2VR', `
    toolbar=no,
    location=no,
    directories=no,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes,
    height=800,
    width=800
  `);

  // Stop loader from getting re-added when user reloads window and re-focusses popup by clicking button
  if (popup.document.querySelector('#loader')) return popup;

  popup.document.body.appendChild(createExecutableNode(`
    <div id='loader'></div>
    <style>
        body { 
            background: ${params.backgroundColor};
            margin: 0;
        }

        #loader {
            height: 32px;
            width: 32px;
            position: fixed;
            top: calc(50% - (32px / 2));
            left: calc(50% - (32px / 2));
            animation: rotate 0.8s infinite linear;
            border: 8px solid black;
            border-right-color: transparent;
            border-radius: 50%;
        }
        
        @keyframes rotate {
            0%  { transform: rotate(0deg); }
            100%  { transform: rotate(360deg); }
        }

        a-assets {
          display: none;
        }
    </style>
  `, popup.document));

  const scripts = createExecutableNode(`
    <script id="lib" src="${location}"></script>
    <script>
        var script = document.head.querySelector("#lib");
        script.onload = function() {
          html2vr.render(JSON.parse('${JSON.stringify(params)}'))
        }
    </script>
  `, popup.document);

  popup.document.head.appendChild(scripts);

  return popup;
}
