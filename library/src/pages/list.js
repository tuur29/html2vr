
import {
  createVRNode,
  createHashCode,
  getProperties,
} from '../helpers';

import { navigate } from '../navigation';

export class ListPage {
  // Selector should return element of the form <el href=""><img src="" />Text</el> (see grid.js, optional img)
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    const data = Array.from(sourceDOM.querySelectorAll(props['data-html2vr-selector']));
    console.log('listData', data);
    return data;
  }

  static draw(scene, data, params, callback) {
    if (data.length < 1) return false;

    const assets = scene.querySelector('a-assets');
    const aspectRatio = 1.6 / 0.9;
    const height = 0.8;
    const imgwidth = height * aspectRatio;
    const padding = 0.2;
    const z = -6;

    // add links to scene
    data.forEach((il, i) => {
      const linkEl = il.querySelector('a');
      const linkUrl = linkEl ? linkEl.href : null;

      const y = 4.5 - (padding + height) * i; // 1.5 is eye height
      let elementString = '';

      const imageEl = il.querySelector('img');
      if (imageEl && imageEl.src.indexOf('.svg') < 0) {
        const imageUrl = imageEl.src;
        const id = 'grid' + createHashCode(imageUrl);
        const image = createVRNode(`<img id="${id}" src="${imageUrl}" crossorigin>`);
        assets.appendChild(image);

        elementString += `
          <a-image
            class="html2vr-element ${linkUrl ? 'clickable' : ''}" 
            position="${-(imgwidth / 2 + padding)} ${y} ${z}"
            width="${imgwidth}" height="${height}"
            src="#${id}"
          />
        `;
      }

      // Source for textcontent trimming: https://stackoverflow.com/a/42921059
      elementString += `
        <a-text
          class="html2vr-element ${linkUrl ? 'clickable' : ''}" 
          position="${imgwidth / 2} ${y} ${z}"
          value="${il.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()}"
          anchor="left"
          geometry="primitive:plane; width: auto; height: "
          material="opacity: 0"
          color="black"
          width="12"
        />
      `;

      const item = createVRNode(elementString);
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
