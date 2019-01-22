
// TODO: bundle this code into a module (https://webpack.js.org/guides/author-libraries/)

// eslint-disable-next-line no-unused-vars
function html2vrFrame(inputParams = {}) {
  // get params
  const params = {
    columnCount: 4,
    backgroundColor: '#cecece',
    ...inputParams,
  };

  const props = [];

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

  function addGaze(element, callback) {
    const wait = 1500;
    const pressDepth = 0.2;
    let counter = 0;
    let interval;

    element.addEventListener('mouseenter', () => {
      interval = setInterval(() => {
        counter += 10;
        element.setAttribute('depth', 0.1 + pressDepth - (counter / wait) * pressDepth);
        if (counter > wait) {
          counter = 0;
          element.setAttribute('depth', 0.1);
          clearInterval(interval);

          callback();
        }
      }, 10);
      element.setAttribute('depth', 0.1 + pressDepth);
    });

    element.addEventListener('mouseleave', () => {
      element.setAttribute('depth', 0.1);
      clearInterval(interval);
    });
  }


  // FLOW

  let scene;
  let assets;

  // load the needed libraries and setup the 3d environment
  function setup() {
    // load webvr library
    document.head.appendChild(createScriptNode(`
      <script src="https://aframe.io/releases/0.8.0/aframe.min.js" class="html2vr-external"></script>
    `));

    // setup vr environment
    scene = createNode(`<a-scene class="html2vr-permanent" background="color: ${params.backgroundColor}" />`);
    document.body.appendChild(scene);

    assets = createNode('<a-assets class="html2vr-permanent" />');
    scene.appendChild(assets);

    // TODO: improve path when loading back button image
    const base = Array.from(document.querySelectorAll('script')).filter(s => s.src.includes('html2vr'))[0].src.replace(/[^/]*$/, '');
    const location = base + 'back.png';
    const back = createNode(`<img id="back" src="${location}">`);
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

  function clear() {
    document.querySelectorAll('.html2vr-element').forEach((el) => {
      el.parentElement.removeChild(el);
    });
  }

  function getList() {
    return window.opener.document.querySelectorAll(props['data-html2vr-selector']);
  }

  function drawGrid(data) {
    // TODO: use own selectors instead of bootstrap classes
    // TODO: make algorithm to generate grid aligned coordinates

    // add links to scene
    data.forEach((il, i) => {
      const linkUrl = il.parentElement.href;
      const imageUrl = il.src;

      const width = 1.6;
      const height = 0.9;
      const padding = 0.2;

      const col = i % params.columnCount; // x coord
      const row = (i - col) / params.columnCount; // y coord

      let x = 0; // 0 is centered
      let y = 1.5; // 1.5 is eye height
      const z = -6;

      x -= (params.columnCount * width + params.columnCount * padding * 2) / 2; // start drawing at left bound
      y += 2.5 * (2 * padding + height);

      x += padding + (width + 2 * padding) * col + width / 2;
      y -= padding + (height + 2 * padding) * row + height / 2;

      const id = 'grid' + hashCode(imageUrl);
      const image = createNode(`<img id="${id}" src="${imageUrl}">`);
      assets.appendChild(image);

      const screen = createNode(`
        <a-box class="html2vr-element"
          position="${x} ${y} ${z}"
          width="${width}" height="${height}" depth="0.1"
          src="#${id}" />
      `);
      scene.appendChild(screen);

      addGaze(screen, () => {
        window.opener.location = linkUrl;
        // TODO: make the onload listener at bottom work, then remove this
        setTimeout(() => {
          // eslint-disable-next-line no-use-before-define
          refresh();
        }, 500);
      });
    });
  }

  function getDetail() {
    return window.opener.document.querySelector(props['data-html2vr-selector']);
  }

  function drawDetail(data) {
    // show detail
    const text = createNode(`
      <a-text class="html2vr-element"
        position="0 1.5 -6"
        value="${data.innerHTML}"
        anchor="left"
        geometry="primitive:plane; width: auto; height: "
        material="opacity: 0"
        color="black"
        width="12"
      />
    `);
    scene.appendChild(text);

    // render a back button
    const back = createNode(`
      <a-box class="html2vr-element"
      position="-4 4 -6"
      width="1" height="1" depth="0.1"
      src="#back" />
    `);
    scene.appendChild(back);

    addGaze(back, () => {
      window.opener.history.back();
      setTimeout(() => {
        // TODO: make the onload listener at bottom work, then remove this
        // eslint-disable-next-line no-use-before-define
        refresh();
      }, 500);
    });
  }

  function drawError() {
    const text = createNode(`
      <a-text class="html2vr-element"
        position="0 1.5 -6"
        value="This page is not supported, please go back."
        anchor="left"
        geometry="primitive:plane; width: auto; height: "
        material="opacity: 0"
        color="black"
        width="12"
      />
    `);
    scene.appendChild(text);

    // render a back button
    const back = createNode(`
      <a-box class="html2vr-element"
      position="-4 4 -6"
      width="1" height="1" depth="0.1"
      src="#back" />
    `);
    scene.appendChild(back);

    addGaze(back, () => {
      window.opener.history.back();
      setTimeout(() => {
        // TODO: make the onload listener at bottom work, then remove this
        // eslint-disable-next-line no-use-before-define
        refresh();
      }, 500);
    });
  }

  function draw() {
    // draw correct type
    console.log(props);
    if (props['data-html2vr-page-type'] === 'detail') {
      const detail = getDetail();
      drawDetail(detail);
    } else if (props['data-html2vr-page-type'] === 'grid') {
      const data = getList();
      drawGrid(data);
    } else {
      drawError();
    }
  }

  function refreshProperties() {
    Array.from(window.opener.document.body.attributes).forEach((attr) => {
      props[attr.name] = attr.value;
    });
  }

  // ON RUN

  setup();
  scene.addEventListener('loaded', () => {
    refreshProperties();
    draw();
  });

  function refresh() {
    clear();
    refreshProperties();
    draw();
  }

  // FIXME: this doesnt run currently refreshing manually, see TODO's above
  window.opener.addEventListener('load', () => {
    console.log('All assets are loaded');
    refresh();
  });
}
