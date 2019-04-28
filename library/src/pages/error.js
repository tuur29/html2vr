
import { createVRNode, addBackButton } from '../helpers';

export class ErrorPage {
  static draw(scene, data, params, callback) {
    addBackButton(scene, callback);

    const text = createVRNode(`
        <a-text 
          class="html2vr-element"
          position="0 1.5 -6"
          value="This page is not supported, please go back."
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
