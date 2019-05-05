
import {
  createHTMLNode,
  createVRNode,
  detectWebGL,
  detectWebVR,
} from './helpers';
import { open3DPopup } from './popup';

export function add3DButton(params = {}) {
  let popup;

  window.document.head.appendChild(createVRNode(`
    <style>
      #html2vr-button-container {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 9999;
      }
      #html2vr-button, #html2vr-tooltip {
        background: #444;
        box-shadow: 1px 1px 3px #111;
        color: white;
      }
      #html2vr-button {
        margin: 20px;
        border-radius: 50px;
        width: 50px;
        height: 50px;
        vertical-align: middle;
        text-align: middle;
        border: none;
        font-size: 16px;
        cursor: pointer;
      }
      #html2vr-tooltip {
        display: none;
        position: absolute;
        bottom: 80px;
        right: 25px;
        width: 280px;
        padding: 7px;
        font-size: 13px;
        border-radius: 5px;
      }
      #html2vr-button-container:hover #html2vr-tooltip {
        display: block;
      }
    </style>
  `));

  // add enter vr button
  const button = createHTMLNode(`
    <div id="html2vr-button-container">
      <button href="#" id="html2vr-button">3D</button>
      <div id="html2vr-tooltip">
        Click the button to view this page in 3D / VR!
        ${detectWebGL() ? '' : `<br/>WebGL isn't supported by your browser.
                                Make sure you GPU drivers are up to date.`}
        ${detectWebVR() ? '' : `<br/>Unfortunately your browser does not support WebVR yet.
                        You can still view the page in 3D.
                        Click <a href="https://webvr.rocks/">here</a> to learn more.`}
      </div>
    </div>
  `);
  document.body.appendChild(button);

  document.querySelector('#html2vr-button').addEventListener('click', (e) => {
    if (!detectWebGL()) {
      // eslint-disable-next-line no-alert
      alert('WebGL isn\'t supported by your browser. Make sure you GPU drivers are up to date.');
      return;
    }
    if (popup) {
      popup.close();
      popup = null;
      e.target.innerHTML = '3D';
    } else {
      popup = open3DPopup(params);
      popup.onbeforeunload = () => {
        popup = null;
        e.target.innerHTML = '3D';
      };
      e.target.innerHTML = 'Exit';
    }
  });
}
