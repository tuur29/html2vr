// import * as aframe from 'aframe';

// TODO: bundle this code into a module (https://webpack.js.org/guides/author-libraries/)

// HELPERS
function createScriptNode(string) {
  return document.createRange().createContextualFragment(string);
}

function createNode(string) {
  const template = document.createElement('template');
  const html = string.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

/*eslint-disable */
function hashCode(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
/* eslint-enable */


// FLOW

let VRMode = false;
let firstTime = true;
let scene;
let assets;
let camera;

window.document.head.appendChild(createScriptNode(`
  <style>
    #html2vr-button {
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 2;
      margin: 10px;
      padding: 10px;
      background: #cecece;
      border: 1px solid #222;
      border-radius: 10px;
    }
  </style>
`));

// load the needed libraries and setup the 3d environment
function setup() {
  // load webvr library
  if (firstTime) {
    window.document.head.appendChild(createScriptNode(`
      <script src="https://aframe.io/releases/0.8.0/aframe.min.js" class="html2vr-external"></script>
    `));
    window.document.head.appendChild(createScriptNode(`
      <script src="https://unpkg.com/aframe-event-set-component@4.1.2/dist/aframe-event-set-component.min.js" class="html2vr-external"></script>
    `));

    window.document.head.appendChild(createScriptNode(`
      <style>
        #html2vr-scene {
          width: 75%;
          height: 75%;
          position: fixed;
          top: 12.5%;
          left: 12.5%;
          background: #cecece;
          box-shadow: 0 0 25px #222;
        }
      </style>
    `));
    firstTime = false;
  }

  // setup vr environment
  scene = createNode('<a-scene id="html2vr-scene" background="color: #cecece" embedded />');
  document.body.appendChild(scene);
  assets = createNode('<a-assets id="html2vr-assets" />');
  scene.appendChild(assets);
  camera = createNode('<a-camera id="html2vr-camera"><a-cursor></a-cursor></a-camera>');
  scene.appendChild(camera);
  const floor = createNode(`
    <a-circle
      position="0 -1.5 0"
      rotation="-90 0 0"
      color="#9d9d9d"
      radius="4" />
  `);
  scene.appendChild(floor);


  // TODO: use own selectors instead of bootstrap classes
  // TODO: make algorithm to generate grid aligned coordinates 

  // add links to scene
  scene.addEventListener('loaded', () => {
    const imageLinks = window.document.querySelectorAll('a img');
    imageLinks.forEach((il, i) => {
      const linkUrl = il.parentElement.href;
      const imageUrl = il.src;

      const colcount = 4;
      const width = 1.6;
      const height = 0.9;
      const padding = 0.2;

      const col = i % colcount; // x coord
      const row = (i - col) / colcount; // y coord

      let x = 0; // 0 is centered
      let y = 1.5; // 1.5 is eye height
      const z = -6;

      x -= (colcount * width + colcount * padding * 2) / 2; // start drawing at left bound
      y += 2.5 * (2 * padding + height);

      x += padding + (width + 2 * padding) * col + width / 2;
      y -= padding + (height + 2 * padding) * row + height / 2;

      const id = 'grid' + hashCode(imageUrl);
      const image = createNode(`<img id="${id}" src="${imageUrl}">`);
      assets.appendChild(image);

      const screen = createNode(`
        <a-box
          position="${x} ${y} ${z}"
          width="${width}" height="${height}" depth="0.1"
          src="#${id}" />
      `);
      scene.appendChild(screen);

      const wait = 1500;
      const pressDepth = 0.2;
      let counter = 0;
      let interval;
      screen.addEventListener('mouseenter', () => {
        interval = setInterval(() => {
          counter += 10;
          screen.setAttribute('depth', 0.1 + pressDepth - (counter / wait) * pressDepth);
          if (counter > wait) {
            counter = 0;
            screen.setAttribute('depth', 0.1);
            clearInterval(interval);

            console.log('selected');
            window.location = linkUrl;
          }
        }, 10);
        screen.setAttribute('depth', 0.1 + pressDepth);
      });
      screen.addEventListener('mouseleave', () => {
        screen.setAttribute('depth', 0.1);
        clearInterval(interval);
      });
    });
  });
}

// this should remove all added 3d elements
function removeSetup() {
  scene.parentNode.removeChild(scene);
}

// add enter vr button
const button = createNode('<a href="#" id="html2vr-button">View in 3D</a>');

button.addEventListener('click', () => {
  if (VRMode) {
    scene.exitVR();
    removeSetup();
    button.innerHTML = 'View in 3D';
  } else {
    setup();
    button.innerHTML = 'Exit 3D';
  }
  VRMode = !VRMode;
});
document.body.appendChild(button);
