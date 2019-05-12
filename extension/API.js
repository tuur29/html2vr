/* eslint-disable padded-blocks */

/* global browser */
/* global chrome */

// eslint-disable-next-line no-unused-vars
const API = {};

if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {

  API.getURL = (...args) => browser.runtime.getURL(...args);
  API.queryTabs = (...args) => browser.tabs.query(...args);
  API.addMessageListener = (...args) => browser.runtime.onMessage.addListener(...args);
  API.sendMessage = (...args) => browser.tabs.sendMessage(...args);
  API.save = (...args) => browser.storage.local.set(...args);
  API.load = (...args) => browser.storage.local.get(...args);

} else {

  API.getURL = (...args) => chrome.runtime.getURL(...args);
  API.queryTabs = (...args) => new Promise(res => chrome.tabs.query(...args, res));
  API.addMessageListener = (...args) => chrome.runtime.onMessage.addListener(...args);
  API.sendMessage = (...args) => chrome.tabs.sendMessage(...args);
  API.save = (...args) => chrome.storage.local.set(...args);
  API.load = (...args) => new Promise(res => chrome.storage.local.get(...args, res));

}
