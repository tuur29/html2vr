
import {
  createVRNode,
  getProperties,
} from '../helpers';

import { navigate } from '../navigation';

export class DetailPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    return sourceDOM.querySelector(props['data-html2vr-selector']);
  }

  static draw(scene, data, params, callback) {
    // show detail
    const text = createVRNode(`
      <a-text
        class="html2vr-element"
        position="0 1.5 -6"
        value="${data.innerHTML}"
        anchor="left"
        geometry="primitive:plane; width: auto; height: "
        material="opacity: 0"
        color="black"
        width="12"
      />
    `);
    scene.appendChild(text);

    // Temporary elements to demo complex navigation (left is error, right is home)
    const errortest = createVRNode(`
      <a-box class="html2vr-element clickable"
        position="-2 1.5 -6"
        width="2" height="2" depth="0.1" />
    `);
    errortest.querySelector('*').addEventListener('click', () => {
      navigate('http://localhost:8080/1.html', () => callback('refresh'));
    });
    scene.appendChild(errortest);

    const hometest = createVRNode(`
      <a-box class="html2vr-element clickable"
        position="4 1.5 -6"
        width="2" height="2" depth="0.1" />
    `);
    hometest.querySelector('*').addEventListener('click', () => {
      navigate('http://localhost:8080/index.html', () => callback('refresh'));
    });
    scene.appendChild(hometest);
  }
}
