
import {
  createVRNode,
  createHashCode,
  getProperties,
} from '../helpers';

import { navigate } from '../navigation';

export class GridPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    // Selector should return element of the form <el href=""><img src="" /></el>, items become links if 'el' is a
    return Array.from(
      sourceDOM.querySelectorAll(props['data-html2vr-selector']),
    );
  }

  static draw(scene, data, params, callback) {
    if (data.length < 1) return false;

    const assets = scene.querySelector('a-assets');
    const width = 1.6;
    const height = 0.9;
    const padding = 0.2;
    const z = -6;

    // add links to scene
    data.forEach((il, i) => {
      const linkUrl = il.href;
      const images = Array.from(il.children).filter(el => el.tagName === 'IMG');
      if (images.length < 1) return;
      const imageUrl = images[0].src;

      const col = i % params.columnCount; // x coord
      const row = (i - col) / params.columnCount; // y coord

      let x = 0; // 0 is centered
      let y = 1.5; // 1.5 is eye height

      x -= (params.columnCount * width + params.columnCount * padding * 2) / 2; // start drawing at left bound
      y += 2.5 * (2 * padding + height);

      x += padding + (width + 2 * padding) * col + width / 2;
      y -= padding + (height + 2 * padding) * row + height / 2;

      const id = 'grid' + createHashCode(imageUrl);
      const image = createVRNode(`<img id="${id}" src="${imageUrl}">`);
      assets.appendChild(image);

      const item = createVRNode(`
        <a-image class="html2vr-element ${linkUrl ? 'clickable' : ''}"
          position="${x} ${y} ${z}"
          width="${width}" height="${height}"
          src="#${id}" />
      `);
      if (linkUrl) {
        item.querySelector('*').addEventListener('click', () => {
          navigate(linkUrl, () => callback('refresh'));
        });
      }

      scene.appendChild(item);
    });

    return true;
  }
}
