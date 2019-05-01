
import {
  createVRNode,
  createHashCode,
  getProperties,
} from '../helpers';

import { navigate } from '../navigation';

export class OverviewPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    return Array.from(
      sourceDOM.querySelectorAll(props['data-html2vr-selector']),
    );
  }

  static draw(scene, data, params, callback) {
    // TODO: use own selectors instead of bootstrap classes
    // TODO: make algorithm to generate grid aligned coordinates

    const assets = scene.querySelector('a-assets');

    // add links to scene
    data.forEach((il, i) => {
      const linkUrl = il.parentElement.href;
      const imageUrl = il.src;

      const width = 1.6;
      const height = 0.9;
      const padding = 0.2;

      const col = i % params.columnCount; // x coord
      const row = (i - col) / params.columnCount; // y coord

      let x = 0; // 0 is centered
      let y = 1.5; // 1.5 is eye height
      const z = -6;

      x -= (params.columnCount * width + params.columnCount * padding * 2) / 2; // start drawing at left bound
      y += 2.5 * (2 * padding + height);

      x += padding + (width + 2 * padding) * col + width / 2;
      y -= padding + (height + 2 * padding) * row + height / 2;

      const id = 'grid' + createHashCode(imageUrl);
      const image = createVRNode(`<img id="${id}" src="${imageUrl}">`);
      assets.appendChild(image);

      // TODO: add a default background color
      const screen = createVRNode(`
        <a-box class="html2vr-element clickable"
          position="${x} ${y} ${z}"
          width="${width}" height="${height}" depth="0.1"
          src="#${id}" />
      `);
      screen.querySelector('*').addEventListener('click', () => {
        navigate(linkUrl, () => callback('refresh'));
      });

      scene.appendChild(screen);
    });
  }
}
