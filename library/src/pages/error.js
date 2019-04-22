
import { createNode, addGaze } from '../helpers';

export class ErrorPage {
  static draw(scene, data, params, callback) {
    const text = createNode(`
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

    // render a back button
    const back = createNode(`
        <a-box
          class="html2vr-element"
          position="-4 4 -6"
          width="1" height="1" depth="0.1"
          src="#back"
        />
    `);
    scene.appendChild(back);

    addGaze(back, () => {
      window.opener.history.back();
      setTimeout(() => {
        // TODO: make the onload listener at frame.js work, then remove this
        callback('refresh');
      }, 500);
    });
  }
}
