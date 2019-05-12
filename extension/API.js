/* eslint-disable */
let API;

if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    API = browser;
} else {
    API = chrome;
}

// TODO: abstract API access for the following methods:
// - API.runtime.getURL()
// - API.runtime.onMessage.addListener()
// - API.storage.local.set()
// - API.storage.local.get()
// - API.tabs.sendMessage()
// - API.tabs.query()