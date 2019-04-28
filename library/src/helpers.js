// HTML

// Create a bunch of html nodes at once, does run scripts
export function createExecutableNode(string, doc = window.document) {
  return doc.createRange().createContextualFragment(string);
}

// Create a bunch of html nodes at once, doesn't run embedded scripts
export function createNode(string) {
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

// Add a crosshair to scene, gaze at item to click it
export function addGaze(element, callback) {
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

export function navigate(url, callback) {
  const oldUrl = window.opener.location;
  window.opener.location = url;

  // TODO: show loading icon in VR
  // wait until new document exists
  setTimeout(() => {
    if (window.opener.location === oldUrl) return;

    // refresh when new document has finished loading
    if (window.opener.document.readyState === 'complete') {
      callback('refresh');
    } else {
      window.opener.addEventListener('load', () => {
        callback('refresh');
      });
    }
  }, 50);
}
