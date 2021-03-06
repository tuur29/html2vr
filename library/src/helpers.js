
export function getParentWindow() {
  // Chrome doesnt allow you to change url via window.opener
  if (window.opener.location) {
    return window.opener;
  }

  return window.parent;
}

// also redirect all messages from popup to parent
export function linkConsoleToParent() {
  const methodeNames = ['log', 'error', 'warning', 'info', 'debug', 'table'];

  methodeNames.forEach((method) => {
    const oldFunction = window.console[method];
    window.console[method] = (...args) => {
      getParentWindow().console[method](...args);
      oldFunction(...args);
    };
  });
}

// HTML

// Create a bunch of html nodes at once, does run scripts
export function createVRNode(string, doc = window.document) {
  return doc.createRange().createContextualFragment(string);
}

// Create a bunch of html nodes at once, doesn't run embedded scripts
export function createHTMLNode(string) {
  const template = document.createElement('template');
  const html = string.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

// Generate a fixed length hash based on a string, used as unique id for assets
export function createHashCode(string) {
  let hash = 0;
  let i;
  let chr;

  if (string.length === 0) {
    return hash;
  }

  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// this gets all html2vr properties from the body
export function getProperties(document) {
  /* eslint-disable */
  const props = Array.from(document.body.attributes)
    .filter(a => a.name.indexOf('data-html2vr') === 0)
    .reduce((map, obj) => (map[obj.name] = obj.value, map), {});
  return props;
  /* eslint-enable */
}

// 3D / VR

export function getScene() {
  return document.getElementById('scene');
}

let lastCursorState = true;

function saveCursorState() {
  const cursor = document.querySelector('#cursor');
  lastCursorState = cursor.getAttribute('visible');
}

export function showCursor() {
  const cursor = document.querySelector('#cursor');
  cursor.setAttribute('visible', true);
  cursor.setAttribute('cursor', 'fuse: true');
}

export function hideCursor() {
  const cursor = document.querySelector('#cursor');
  cursor.setAttribute('visible', false);
  cursor.setAttribute('cursor', 'fuse: false');
}

export function detectDOFControllers() {
  // Chrome uses gamepad.axis while Firefox uses gamepad.axes
  return Object.values(navigator.getGamepads()).filter(v => v !== null && ((v.axes && v.axes.length > 0) || (v.axis && v.axis.length > 0))).length > 0;
}

// show/hide loading indicator
export function startLoading() {
  saveCursorState();
  showCursor();
  document.getElementById('spinner').setAttribute('visible', 'true');
}
export function stopLoading() {
  if (lastCursorState === false) {
    hideCursor();
  }
  lastCursorState = null;
  document.getElementById('spinner').setAttribute('visible', 'false');
}

export function detectWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl && gl instanceof WebGLRenderingContext;
}

export function detectWebVR() {
  return 'getVRDisplays' in navigator;
}

// Other

// Source: https://stackoverflow.com/a/1573154
export function convertColorToRGB(color) {
  const d = document.createElement('div');
  d.style.color = color;
  document.body.appendChild(d);
  const hex = window.getComputedStyle(d).color;
  document.body.removeChild(d);
  return hex;
}

/* eslint-disable */
// Source: https://stackoverflow.com/a/13542669
export function lightenDarkenColor(p,c) {
  var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
  return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}
/* eslint-enable */
