
import { createExecutableNode } from './helpers';

export function open3DPopup(params = {}) {
  // TODO: improve path when loading frame script
  const location = Array.from(document.querySelectorAll('script'))
    .filter(
      s => s.src.includes('html2vr'),
    )[0].src
    .replace(/[^/]*$/, '')
        + 'html2vr.min.js';

  const popup = window.open('', '3D View', `
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

  popup.document.body.appendChild(createExecutableNode(`
    <div id='loader'></div>
    <style>
        body { 
            background: ${params.backgroundColor};
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
    </style>
  `));

  popup.document.head.appendChild(createExecutableNode(`<script src="${location}"></script>`));
  // TODO: check if script is actually loaded instead of timeout
  setTimeout(() => {
    popup.document.head.appendChild(createExecutableNode(`<script>html2vr.render(JSON.parse('${JSON.stringify(params)}'))</script>`));
  }, 1500);

  return popup;
}
