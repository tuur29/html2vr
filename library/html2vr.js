
// TODO: bundle this code into a module (https://webpack.js.org/guides/author-libraries/)

// eslint-disable-next-line no-unused-vars
function html2vr(params = {}) {
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

  // FLOW

  let VRMode = false;
  let popup;

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
  function openPopup() {
    // TODO: improve path when loading frame script
    const base = Array.from(document.querySelectorAll('script')).filter(s => s.src.includes('html2vr'))[0].src.replace(/[^/]*$/, '');
    const location = base + 'html2vr-frame.js';
    popup = window.open('', '3D View', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,height=800,width=800');
    popup.document.head.appendChild(createScriptNode(`<script src="${location}"></script>`));
    // TODO: check if script is actually loaded
    setTimeout(() => {
      popup.document.head.appendChild(createScriptNode(`<script>html2vrFrame(JSON.parse('${JSON.stringify(params)}'))</script>`));
    }, 1000);
  }

  // add enter vr button
  const button = createNode('<a href="#" id="html2vr-button">View in 3D</a>');

  button.addEventListener('click', () => {
    if (VRMode) {
      popup.close();
      button.innerHTML = 'View in 3D';
    } else {
      openPopup();
      button.innerHTML = 'Exit 3D';
    }
    VRMode = !VRMode;
  });
  document.body.appendChild(button);
}
