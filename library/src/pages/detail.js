
import {
  createNode,
  addGaze,
  getProperties,
} from '../helpers';

export class DetailPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    return sourceDOM.querySelector(props['data-html2vr-selector']);
  }

  static draw(scene, data, params, callback) {
    // show detail
    const text = createNode(`
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

    // render a back button
    const back = createNode(`
        <a-image
          class="html2vr-element"
          position="-4 4 -6"
          src="#back"
        />
    `);

    scene.appendChild(back);

    addGaze(back, () => {
      window.opener.history.back();
      setTimeout(() => {
        // TODO: make the onload listener at bottom work, then remove this
        callback('refresh');
      }, 500);
    });
  }
}
