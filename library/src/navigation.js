import {
  linkConsoleToParent,
  startLoading,
  stopLoading,
  getParentWindow,
  createVRNode,
} from './helpers';

const historyStack = [];

export function addStartPage() {
  if (historyStack.length === 0) {
    historyStack.push(getParentWindow().location.href);
  }
}

function finishNavigation(callback) {
  setTimeout(() => {
    if (historyStack[historyStack.length - 1] !== getParentWindow().location.href) {
      historyStack.push(getParentWindow().location.href);
    }
    callback('refresh');
    linkConsoleToParent();
    stopLoading();
  }, 50); // Allow page scripts and browser extension to dynamically add properties to body
}

function waitForNavigation(callback) {
  const oldUrl = getParentWindow().location.href;

  const interval = setInterval(() => {
    if (getParentWindow().location.href !== oldUrl) {
      clearInterval(interval);
      // refresh when new document has finished loading
      if (getParentWindow().document.readyState === 'complete') {
        finishNavigation(callback);
      } else {
        getParentWindow().addEventListener('load', () => {
          finishNavigation(callback);
        });
      }
    }
  }, 50);
}

export function navigate(url, callback) {
  startLoading();
  getParentWindow().location.href = url;
  waitForNavigation(callback);
}

function goBack(callback) {
  if (historyStack.length > 1) {
    historyStack.pop();
    const last = historyStack[historyStack.length - 1];
    navigate(last, callback);
  }
}

export function addBackButton(scene, callback) {
  if (historyStack.length < 2) return;

  // render a back button
  const back = createVRNode(`
      <a-image
        class="html2vr-element clickable"
        position="-5 4 -6"
        width="1" height="1"
        src="#back" />
    `);
  back.querySelector('*').addEventListener('click', () => {
    goBack(callback);
  });
  scene.appendChild(back);
}
