
import {
  addBackButton,
  createVRNode,
  getProperties,
} from '../helpers';

export class DetailPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    return sourceDOM.querySelector(props['data-html2vr-selector']);
  }

  static draw(scene, data, params, callback) {
    addBackButton(scene, callback);

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
  }
}
