
import {
  createVRNode,
  getProperties,
  getParentWindow,
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
      <a-text
        class="html2vr-element clickable"
        position="-2.5 1.5 -5.9"
        geometry="primitive:plane; width: 2; height: "
        color="black"
        value="Load error" />
    `);
    errortest.querySelector('*').addEventListener('click', () => {
      if (process.env.NODE_ENV === 'development') {
        navigate('http://localhost:8080/error.html', () => callback('refresh'));
      } else {
        navigate('https://tuur29.github.io/html2vr/', () => callback('refresh'));
      }
    });
    scene.appendChild(errortest);

    const hometest = createVRNode(`
      <a-text
        class="html2vr-element clickable"
        position="4 1.5 -5.9"
        geometry="primitive:plane; width: 2; height: "
        color="black"
        value="Load previous" />
    `);
    hometest.querySelector('*').addEventListener('click', () => {
      navigate(getParentWindow().document.referrer, () => callback('refresh'));
    });
    scene.appendChild(hometest);
  }
}
