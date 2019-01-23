
// TODO: bundle this code into a module (https://webpack.js.org/guides/author-libraries/)

// eslint-disable-next-line no-unused-vars
function html2vr(inputParams = {}) {
  // TODO: move default params to seperate file
  const params = {
    columnCount: 4,
    backgroundColor: '#cecece',
    ...inputParams,
  };

  // HELPERS
  function createExecutableNode(string) {
    return document.createRange().createContextualFragment(string);
  }

  function createNode(string) {
    const template = document.createElement('template');
    const html = string.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  // FLOW

  let VRMode = false;
  let popup;

  window.document.head.appendChild(createExecutableNode(`
    <style>
      #html2vr-button {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 9999;
        margin: 20px;
        border-radius: 50px;
        background: #444;
        box-shadow: 1px 1px 3px #111;
        font-size: 16px;
        color: white;
        width: 50px;
        height: 50px;
        vertical-align: middle;
        text-align: middle;
        border: none;
      }
    </style>
  `));

  // load the needed libraries and setup the 3d environment
  function openPopup() {
    // TODO: improve path when loading frame script
    const base = Array.from(document.querySelectorAll('script')).filter(s => s.src.includes('html2vr'))[0].src.replace(/[^/]*$/, '');
    const location = base + 'html2vr-frame.js';

    popup = window.open('', '3D View', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,height=800,width=800');
    popup.document.body.appendChild(createExecutableNode(`<div id='loader'></div><style>
      body { background: ${params.backgroundColor}; }
      #loader {
        height: 32px;
        width: 32px;
        position: fixed;
        top: calc(50% - (32px / 2));
        left: calc(50% - (32px / 2));
        animation: rotate 0.8s infinite linear;
        border: 8px solid black;
        border-right-color: transparent;
        border-radius: 50%;
      }
      
      @keyframes rotate {
        0%    { transform: rotate(0deg); }
        100%  { transform: rotate(360deg); }
      }
    </style>`));
    popup.document.head.appendChild(createExecutableNode(`<script src="${location}"></script>`));
    // TODO: check if script is actually loaded
    setTimeout(() => {
      popup.document.head.appendChild(createExecutableNode(`<script>html2vrFrame(JSON.parse('${JSON.stringify(params)}'))</script>`));
    }, 1500);
  }

  // add enter vr button
  const button = createNode('<button href="#" id="html2vr-button">3D</button>');

  button.addEventListener('click', () => {
    if (VRMode) {
      popup.close();
      button.innerHTML = '3D';
    } else {
      openPopup();
      button.innerHTML = 'Exit';
    }
    VRMode = !VRMode;
  });
  document.body.appendChild(button);
}
