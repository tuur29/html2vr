
import back from './assets/back.svg';
import {
  createVRNode,
  getProperties,
  linkConsoleToParent,
} from './helpers';
import { addBackButton, addStartPage } from './navigation';
import { OverviewPage, DetailPage, ErrorPage } from './pages';

export function render3DScene(params = {}) {
  let scene;
  let script;

  // load the needed libraries and setup the 3d environment
  function loadLibraries() {
    linkConsoleToParent();
    addStartPage();

    // load webvr library
    script = document.createElement('script');
    script.src = params.aframeUrl;
    document.head.appendChild(script);

    return new Promise((resolve) => {
      script.addEventListener('load', () => resolve());
    });
  }

  function setupScene() {
    // setup vr environment
    scene = document.createElement('a-scene');
    scene.setAttribute('id', 'scene');
    scene.setAttribute('class', 'html2vr-permanent');
    scene.setAttribute('background', `color: ${params.backgroundColor}`);
    document.body.appendChild(scene);

    return new Promise((resolve) => {
      scene.addEventListener('loaded', () => {
        const assets = createVRNode('<a-assets class="html2vr-permanent" />');

        // eslint-disable-next-line global-require
        const backButton = createVRNode(`
            <img
              id="back"
              src="data:image/svg+xml;base64,${window.btoa(back)}"
            />
        `);
        assets.appendChild(backButton);
        scene.appendChild(assets);

        const fuzeTime = 1500;
        const camera = createVRNode(`
          <a-entity camera look-controls>
            <a-entity cursor="fuse: true; fuseTimeout: ${fuzeTime};"
                      raycaster="far: 20; interval: ${fuzeTime / 5}; objects: .clickable"
                      animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: ${fuzeTime / 10}; from: 0.1 0.1 0.1; to: 1 1 1"
                      animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: ${fuzeTime}; from: 1 1 1; to: 0.1 0.1 0.1"
                      animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: ${fuzeTime / 3}; to: 1 1 1"
                      material="color: black; shader: flat"
                      position="0 0 -3"
                      geometry="primitive: ring; radiusInner: 0.05; radiusOuter: 0.07;" />
            <a-entity id="spinner"
                      visible="false"
                      material="color: ${params.backgroundColor}; shader: flat"
                      position="0 0 1"
                      geometry="primitive: ring; radiusInner: 0.03; radiusOuter: 0.05; thetaLength: 180;"
                      animation="property: geometry.thetaStart; to: 360 0; loop: true; dur: 1000; easing: linear" />
          </a-entity>
        `);
        scene.appendChild(camera);

        // TODO: darken backgroundcolor for floor
        const floor = createVRNode(`
          <a-circle class="html2vr-permanent"
            position="0 -1.5 0"
            rotation="-90 0 0"
            color="#9d9d9d"
            radius="4" />
        `);
        scene.appendChild(floor);

        resolve();
      });
    });
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
    addBackButton(scene, refresh);
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

  loadLibraries().then(() => {
    setupScene().then(() => {
      draw();
    });
  });
}
