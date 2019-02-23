
import { createExecutableNode, createNode, getProperties } from './helpers';
import { OverviewPage, DetailPage, ErrorPage } from './pages';

export function render3DScene(params = {}) {
  let scene;

  // load the needed libraries and setup the 3d environment
  function setup() {
    // load webvr library
    document.head.appendChild(createExecutableNode(`
      <script src="${params.aframeUrl}" class="html2vr-external"></script>
    `));

    // setup vr environment
    scene = createNode(`<a-scene class="html2vr-permanent" background="color: ${params.backgroundColor}" />`);
    document.body.appendChild(scene);

    const assets = createNode('<a-assets class="html2vr-permanent" />');
    scene.appendChild(assets);

    // TODO: Fix svg back button
    const back = createNode(`
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="50px" height="50px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
        <path d="M427,234.625H167.296l119.702-119.702L256,85L85,256l171,171l29.922-29.924L167.296,277.375H427V234.625z" fill="#000"/>
      </svg>
    `);
    assets.appendChild(back);

    const camera = createNode('<a-camera class="html2vr-permanent"><a-cursor></a-cursor></a-camera>');
    scene.appendChild(camera);

    const floor = createNode(`
      <a-circle class="html2vr-permanent"
        position="0 -1.5 0"
        rotation="-90 0 0"
        color="#9d9d9d"
        radius="4" />
    `);
    scene.appendChild(floor);
  }

  // remove all items from scene
  function clear() {
    document.querySelectorAll('.html2vr-element').forEach((el) => {
      el.parentElement.removeChild(el);
    });
  }

  // load new page, refresh scene
  function refresh() {
    clear();
    // eslint-disable-next-line no-use-before-define
    draw();
  }

  function sceneCallback(data) {
    if (data === 'refresh') {
      refresh();
    }
  }

  function draw() {
    // draw correct type
    const type = getProperties(window.opener.document)['data-html2vr-page-type'];

    if (type === 'detail') {
      const data = DetailPage.getData(window.opener.document);
      DetailPage.draw(scene, data, params, sceneCallback);
    } else if (type === 'grid') {
      const data = OverviewPage.getData(window.opener.document);
      OverviewPage.draw(scene, data, params, sceneCallback);
    } else {
      ErrorPage.draw(scene, null, params, sceneCallback);
    }
  }

  // ON RUN

  setup();
  scene.addEventListener('loaded', () => {
    draw();
  });

  // FIXME: this doesnt run currently refreshing manually, see TODO's above
  window.opener.addEventListener('load', () => {
    console.log('All assets are loaded');
    refresh();
  });
}
