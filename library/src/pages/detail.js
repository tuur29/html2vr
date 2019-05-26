
import {
  createVRNode,
  getProperties,
} from '../helpers';

export class DetailPage {
  // Maily for testing purposes, just displays textcontent of selected object + error and home link
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    const data = sourceDOM.querySelector(props['data-html2vr-selector']);
    console.log('detailData', data);
    return data;
  }

  // eslint-disable-next-line no-unused-vars
  static draw(scene, data, params, callback) {
    if (!data) return false;

    const text = createVRNode(`
      <a-text
        class="html2vr-element"
        position="0 1.5 -6"
        value="${data.textContent}"
        anchor="left"
        geometry="primitive:plane; width: auto; height: "
        material="opacity: 0"
        color="black"
        width="12"
      />
    `);
    scene.appendChild(text);

    return true;
  }
}
