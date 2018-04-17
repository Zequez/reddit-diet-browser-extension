function validRequest (url) {
  return (/^http:\/\/localhost:8080\/.*/).test(url) ||
  (/^http:\/\/redditdiet.zequez.com\/.*/).test(url) ||
  (new RegExp('^' + chrome.extension.getURL('.*').replace('/', '\\/'))).test(url)
}

var validActiveTab = false
function updateActiveTab () {
  chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
    validActiveTab = validRequest(arrayOfTabs[0].url)
  })
}

chrome.tabs.onActivated.addListener(() => { updateActiveTab() })
chrome.tabs.onUpdated.addListener(() => { updateActiveTab() })
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(validActiveTab)
})

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    if (validActiveTab) {
      for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name.toLowerCase() == 'x-frame-options') {
          details.responseHeaders.splice(i, 1);
          return {
            responseHeaders: details.responseHeaders
          };
        }
      }
    }
  }, {
    urls: ['<all_urls>']
  }, ["blocking", "responseHeaders"]);
