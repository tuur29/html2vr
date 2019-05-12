
import {
  createVRNode,
} from '../helpers';

export class ImagePage {
  static pageIsImageFile(doc) {
    return doc.body.children.length === 1 && doc.body.children[0].nodeName === 'IMG';
  }

  static getData(sourceDOM) {
    return sourceDOM.querySelector('img');
  }

  // eslint-disable-next-line no-unused-vars
  static draw(scene, data, params, callback) {
    const { width, height } = data.getBoundingClientRect();
    const aspect = height / width;
    const newWidth = 8;
    const newHeight = newWidth * aspect;

    const image = createVRNode(`
      <a-image
        class="html2vr-element"
        position="0 1.5 -6"
        src="${data.getAttribute('src')}"
        width="${newWidth}"
        height="${newHeight}"
      />
    `);
    scene.appendChild(image);
  }
}
