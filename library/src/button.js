
import { createHTMLNode, createVRNode } from './helpers';
import { open3DPopup } from './popup';

export function add3DButton(params = {}) {
  let popup;

  window.document.head.appendChild(createVRNode(`
    <style>
      #html2vr-button {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 9999;
        margin: 20px;
        border-radius: 50px;
        background: #444;
        box-shadow: 1px 1px 3px #111;
        font-size: 16px;
        color: white;
        width: 50px;
        height: 50px;
        vertical-align: middle;
        text-align: middle;
        border: none;
      }
    </style>
  `));

  // add enter vr button
  const button = createHTMLNode('<button href="#" id="html2vr-button">3D</button>');

  button.addEventListener('click', () => {
    if (popup) {
      popup.close();
      popup = null;
      button.innerHTML = '3D';
    } else {
      popup = open3DPopup(params);
      popup.onbeforeunload = () => {
        popup = null;
        button.innerHTML = '3D';
      };
      button.innerHTML = 'Exit';
    }
  });
  document.body.appendChild(button);
}
