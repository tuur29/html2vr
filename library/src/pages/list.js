
import {
  createVRNode,
  createHashCode,
  getProperties,
} from '../helpers';

import { navigate } from '../navigation';

export class ListPage {
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    // Selector should return element of the form <el href=""><img src="" />Text</el> (see grid.js, optional img)
    return Array.from(
      sourceDOM.querySelectorAll(props['data-html2vr-selector']),
    );
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
      const links = Array.from(il.children).filter(el => el.tagName === 'A');
      const linkUrl = links.length > 0 ? links[0].href : null;

      const y = 4.5 - (padding + height) * i; // 1.5 is eye height
      let elementString = '';

      const images = Array.from(il.children).filter(el => el.tagName === 'IMG');
      if (images.length > 0) {
        const imageUrl = images[0].src;
        const id = 'grid' + createHashCode(imageUrl);
        const image = createVRNode(`<img id="${id}" src="${imageUrl}">`);
        assets.appendChild(image);

        // TODO: add a default background color
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
