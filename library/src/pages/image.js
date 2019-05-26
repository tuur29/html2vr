
import {
  createVRNode,
  getProperties,
} from '../helpers';

export class ImagePage {
  // selector should point to img element or be undefined in which case first image is selected
  // this page is also used when navigating to an actual image file
  static getData(sourceDOM) {
    const props = getProperties(sourceDOM);
    const data = sourceDOM.querySelector(props['data-html2vr-selector'] || 'img');
    console.log('imageData', data);
    return data;
  }

  static pageIsImageFile(doc) {
    return doc.body.children.length === 1 && doc.body.children[0].nodeName === 'IMG';
  }

  // eslint-disable-next-line no-unused-vars
  static draw(scene, data, params, callback) {
    if (!data || !data.src) return false;

    const { width, height } = data.getBoundingClientRect();
    const aspect = height / width;
    const newWidth = 8;
    const newHeight = newWidth * aspect;

    const image = createVRNode(`
      <a-image
        class="html2vr-element"
        position="0 1.5 -6"
        src="${data.src}"
        width="${newWidth}"
        height="${newHeight}"
      />
    `);
    scene.appendChild(image);

    return true;
  }
}
