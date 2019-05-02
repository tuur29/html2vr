
import back from './assets/back.svg';
import {
  createVRNode,
  getProperties,
  linkConsoleToParent,
  hideCursor,
  showCursor,
} from './helpers';
import { addBackButton, addStartPage } from './navigation';
import { OverviewPage, DetailPage, ErrorPage } from './pages';

export function render3DScene(params = {}) {
  let scene;

  // load the needed libraries and setup the 3d environment
  function loadLibraries() {
    linkConsoleToParent();
    addStartPage();

    // load webvr library
    const aframeScript = document.createElement('script');
    aframeScript.src = params.aframeUrl;
    document.head.appendChild(aframeScript);

    // load extra dependancies
    return new Promise((resolve) => {
      aframeScript.addEventListener('load', () => {
        const extrasScript = document.createElement('script');
        extrasScript.src = params.aframeExtrasUrl;
        document.head.appendChild(extrasScript);

        const superHandsScript = document.createElement('script');
        superHandsScript.src = params.superhandsUrl;
        document.head.appendChild(superHandsScript);

        Promise.all([
          new Promise((r) => {
            extrasScript.addEventListener('load', () => r());
          }),
          new Promise((r) => {
            superHandsScript.addEventListener('load', () => r());
          }),
        ]).then(() => resolve());
      });
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
        scene.appendChild(createVRNode(`
          <a-assets class="html2vr-permanent">
            <img id="back" src="data:image/svg+xml;base64,${window.btoa(back)}" />
          </a-assets>
        `));

        // Add gaze cursor
        scene.appendChild(createVRNode(`
          <a-entity camera look-controls>
            <a-entity id="cursor"
              visible="true"
              cursor="fuse: true"
              raycaster="far: 20; interval: 300; objects: .clickable"
              animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
              animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
              animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
              material="color: black; shader: flat"
              position="0 0 -3"
              geometry="primitive: ring; radiusInner: 0.035; radiusOuter: 0.05;" />
            <a-entity id="spinner"
              visible="false"
              material="color: ${params.backgroundColor}; shader: flat"
              position="0 0 0.001"
              geometry="primitive: ring; radiusInner: 0.035; radiusOuter: 0.05; thetaLength: 180;"
              animation="property: geometry.thetaStart; to: 360 0; loop: true; dur: 1000; easing: linear" />
          </a-entity>
        `));

        // Add mixins for controllers
        scene.appendChild(createVRNode(`
          <a-assets>
            <a-mixin id="pointer"
              raycaster="showLine: true; objects: .clickable, a-link"
              super-hands="colliderEvent: raycaster-intersection;
                          colliderEventProperty: els;
                          colliderEndEvent:raycaster-intersection-cleared;
                          colliderEndEventProperty: clearedEls;" />
            <a-mixin id="controller-right" mixin="pointer"
              vive-controls="hand: right" oculus-touch-controls="hand: right"
              windows-motion-controls="hand: right"
              gearvr-controls daydream-controls oculus-go-controls />
            <a-mixin id="controller-left" mixin="pointer"
              vive-controls="hand: left" oculus-touch-controls="hand: left"
              windows-motion-controls="hand: left" />
          </a-assets>
        `));

        // Add controllers themselves
        scene.appendChild(createVRNode(`
          <a-entity id="controllers">
            <a-entity id="rhand" mixin="controller-right"></a-entity>
            <a-entity id="lhand" mixin="controller-left"></a-entity>
          </a-entity>
        `));

        // TODO: darken backgroundcolor for floor
        // Add floor
        scene.appendChild(createVRNode(`
          <a-circle class="html2vr-permanent"
            position="0 -1.5 0"
            rotation="-90 0 0"
            color="#9d9d9d"
            radius="4" />
        `));

        // Hide cursor when 3/6DOF controllers connected
        scene.addEventListener('enter-vr', () => {
          setTimeout(() => {
            if (navigator.getGamepads().length > 0) {
              hideCursor();
            }
          }, 50);
        });

        scene.addEventListener('exit-vr', () => {
          showCursor();
        });

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
