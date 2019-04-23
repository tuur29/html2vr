
import back from './assets/back.svg';
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

    // eslint-disable-next-line global-require
    const backButton = createNode(`
        <img
          id="back"
          src="data:image/svg+xml;base64,${window.btoa(back)}"
        />
    `);
    assets.appendChild(backButton);

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
}
